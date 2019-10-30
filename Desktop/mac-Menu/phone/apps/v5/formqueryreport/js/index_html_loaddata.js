function home_getSearchData(aId, aInputvalue) {
    var ftemp;
    if (aId == null) {
        ftemp = [{
            "id": 1,
            "title": "工作计划",
            "itemtype": M1FormUtils.C_iListType_Dir
        }, {
            "id": 2,
            "title": "研发体系测试草果长度的目录,我就是长,怎么样啊,你管得着吗",
            "itemtype": M1FormUtils.C_iListType_Dir
        }, {
            "id": 3,
            "title": "运营体系",
            "itemtype": M1FormUtils.C_iListType_Dir
        }, {
            "id": 4,
            "title": "客户体系",
            "itemtype": M1FormUtils.C_iListType_Dir
        }, {
            "id": 5,
            "title": "质量问题查询",
            "itemtype": M1FormUtils.C_iListType_Sreach
        }];
        if (aInputvalue != null) {
            var fitem;
            for (var i = ftemp.length - 1; i >= 0; i--) {
                fitem = ftemp[i];
                if (!startWith(fitem.title, aInputvalue))
                    ftemp.splice(i, 1);
            }
        }
    } else
        ftemp = [{
            "id": 1,
            "title": "开发审批",
            "itemtype": M1FormUtils.C_iListType_Dir
        }, {
            "id": 2,
            "title": "产品发布查询",
            "itemtype": M1FormUtils.C_iListType_Sreach
        }, {
            "id": 3,
            "title": "月度修复包发布查询",
            "itemtype": M1FormUtils.C_iListType_Sreach
        }];
    if (ftemp.length > 0)

        ftemp = {
            "id": aId,
            "caption": ftemp[0].title,
            "list": ftemp
        };
    else
        ftemp = {
            "id": aId,
            "caption": "",
            "list": []
        };
    return ftemp;
}
function home_getStatisticsData(aId, aInputvalue) {
    var ftemp;
    if (aId == null) {
        ftemp = [{
            "id": 2,
            "title": "部门管理",
            "itemtype": M1FormUtils.C_iListType_Dir
        }, {
            "id": 2,
            "title": "研发管理",
            "itemtype": M1FormUtils.C_iListType_Dir
        }];
        if (aInputvalue != null) {
            var fitem;
            for (var i = ftemp.length - 1; i >= 0; i--) {
                fitem = ftemp[i];
                if (!startWith(fitem.title, aInputvalue))
                    ftemp.splice(i, 1);
            }
        }
    } else
        ftemp = [{
            "id": 1,
            "title": "品质管理中心",
            "itemtype": M1FormUtils.C_iListType_Dir
        }, {
            "id": 2,
            "title": "产品开发",
            "itemtype": M1FormUtils.C_iListType_Statistics
        }, {
            "id": 3,
            "title": "所有人积分和考题统计",
            "itemtype": M1FormUtils.C_iListType_Statistics
        }, {
            "id": 4,
            "title": "人员负载（里程碑）",
            "itemtype": M1FormUtils.C_iListType_Statistics
        }, {
            "id": 5,
            "title": "个人任务进度（实时）",
            "itemtype": M1FormUtils.C_iListType_Statistics
        }, {
            "id": 6,
            "title": "团队工作量负载",
            "itemtype": M1FormUtils.C_iListType_Statistics
        }, {
            "id": 7,
            "title": "产品经理工作量负载",
            "itemtype": M1FormUtils.C_iListType_Statistics
        }, {
            "id": 8,
            "title": "所有测试任务",
            "itemtype": M1FormUtils.C_iListType_Statistics
        },{
            "id": 9,
            "title": "草莓测试",
            "itemtype": M1FormUtils.C_iListType_Statistics
        },{
            "id": 10,
            "title": "莫妮卡任务",
            "itemtype": M1FormUtils.C_iListType_Statistics
        },{
            "id": 11,
            "title": "不上班测试",
            "itemtype": M1FormUtils.C_iListType_Statistics
        }];
    if (ftemp.length > 0)
        return {
            "id": aId,
            "caption": ftemp[0].title,
            "list": ftemp
        };
    else
        return {
            "id": aId,
            "caption": "",
            "list": []
        };
}

function search_getData(aId, aListType, aCondition) {
    var fIndex, fresult, fresultData, freportData;
    var fConditionArray, fConditionItem;
    fConditionArray = [];
    fConditionItem = [
        {
            "ctitle": "人员名称",
            "ctype": M1FormUtils.C_iConditionType_Input,
            "cname": "pname"
        }, {
            "ctitle": "动物名称",
            "ctype": M1FormUtils.C_iConditionType_Input,
            "cname": "pAname"
        }, {
            "ctitle": "Checkbox是否开始",
            "ctype": M1FormUtils.C_iConditionType_Checkbox,
            "cname": "started",
            "datalist": {
                "list": [{
                    "value": 0,
                    "name": "男"
                }, {
                    "value": 1,
                    "name": "女"
                }, {
                    "value": 2,
                    "name": "人妖"
                }]
            }
        }, {
            "ctitle": "Checkbox选择英雄",
            "ctype": M1FormUtils.C_iConditionType_Checkbox,
            "cname": "selectHero",
            "datalist": {
                "list": [{
                    "value": 0,
                    "name": "草莓小队长"
                }, {
                    "value": 1,
                    "name": "倒霉熊"
                }, {
                    "value": 2,
                    "name": "钢铁小学生"
                }]
            }
        }, {
            "datalist": {
                "defaultvalue": 0,
                "list": [{
                    "value": 0,
                    "name": "左对其"
                }, {
                    "value": 1,
                    "name": "居中"
                }, {
                    "value": 2,
                    "name": "右对齐"
                }]
            },
            "ctitle": "select对其方式",
            "ctype": M1FormUtils.C_iConditionType_Select,
            "cname": "aligntype"
        }, {
            "datalist": {
                "defaultvalue": 0,
                "list": [{
                    "value": 0,
                    "name": "龙龟"
                }, {
                    "value": 1,
                    "name": "阿木木"
                }, {
                    "value": 2,
                    "name": "提莫"
                }]
            },
            "ctitle": "select选择召唤师",
            "ctype": M1FormUtils.C_iConditionType_Select,
            "cname": "aligntype2"
        }, {
            "ctitle": "Radio同意与否",
            "ctype": M1FormUtils.C_iConditionType_Radio,
            "cname": "isok",
            "datalist": {
                "defaultvalue": 0,
                "list": [{
                    "value": 0,
                    "name": "是"
                }, {
                    "value": 1,
                    "name": "否"
                }]
            }

        }, {
            "ctitle": "单选人员",
            "ctype": M1FormUtils.C_iConditionType_Persion,
            "cname": "runmember"

        }, {
            "ctitle": "文本域",
            "ctype": M1FormUtils.C_iConditionType_Textarea,
            "cname": "textarea1"
        }, {
            "ctitle": "单选人员2",
            "ctype": M1FormUtils.C_iConditionType_Persion,
            "cname": "runmember2"
        }, {
            "ctitle": "多选人员",
            "ctype": M1FormUtils.C_iConditionType_Multipersion,
            "cname": "runmember2"
        }, {
            "ctitle": "单选部门",
            "ctype": M1FormUtils.C_iConditionType_Department,
            "cname": "rundepartment"
        }, {
            "ctitle": "多选部门",
            "ctype": M1FormUtils.C_iConditionType_Multidepartment,
            "cname": "rundepartment2"
        },
        {
            "ctitle": "单选单位",
            "ctype": M1FormUtils.C_iConditionType_Account,
            "cname": "runaccount"
        },
        {
            "ctitle": "多选单位",
            "ctype": M1FormUtils.C_iConditionType_Multiaccount,
            "cname": "runaccount2"
        }, {
            "ctitle": "单选岗位",
            "ctype": M1FormUtils.C_iConditionType_Post,
            "cname": "runpost"
        },
        {
            "ctitle": "多选岗位",
            "ctype": M1FormUtils.C_iConditionType_Multipost,
            "cname": "runpost2"
        }, {
            "ctitle": "单选职务",
            "ctype": M1FormUtils.C_iConditionType_Level,
            "cname": "runlevel"
        },
        {
            "ctitle": "多选职务",
            "ctype": M1FormUtils.C_iConditionType_Multilevel,
            "cname": "runlevel2"
        }, {
            "ctitle": "单选人员3",
            "ctype": M1FormUtils.C_iConditionType_Persion,
            "cname": "runmember"

        }, {
            "ctitle": "文本域2",
            "ctype": M1FormUtils.C_iConditionType_Textarea,
            "cname": "textarea1"
        }, {
            "ctitle": "单选人员4",
            "ctype": M1FormUtils.C_iConditionType_Persion,
            "cname": "runmember2"
        }, {
            "ctitle": "多选人员2",
            "ctype": M1FormUtils.C_iConditionType_Multipersion,
            "cname": "runmember2"
        }, {
            "ctitle": "单选部门2",
            "ctype": M1FormUtils.C_iConditionType_Department,
            "cname": "rundepartment"
        }, {
            "ctitle": "多选部门2",
            "ctype": M1FormUtils.C_iConditionType_Multidepartment,
            "cname": "rundepartment2"
        },
        {
            "ctitle": "单选单位2",
            "ctype": M1FormUtils.C_iConditionType_Account,
            "cname": "runaccount"
        },
        {
            "ctitle": "多选单位2",
            "ctype": M1FormUtils.C_iConditionType_Multiaccount,
            "cname": "runaccount2"
        }, {
            "ctitle": "单选岗位2",
            "ctype": M1FormUtils.C_iConditionType_Post,
            "cname": "runpost"
        },
        {
            "ctitle": "多选岗位2",
            "ctype": M1FormUtils.C_iConditionType_Multipost,
            "cname": "runpost2"
        }, {
            "ctitle": "单选职务2",
            "ctype": M1FormUtils.C_iConditionType_Level,
            "cname": "runlevel"
        },
        {
            "ctitle": "多选职务2",
            "ctype": M1FormUtils.C_iConditionType_Multilevel,
            "cname": "runlevel2"
        }, {
            "ctitle": "日期",
            "ctype": M1FormUtils.C_iConditionType_Date,
            "cname": "sdate"
        }, {
            "ctitle": "日期2",
            "ctype": M1FormUtils.C_iConditionType_Date,
            "cname": "sdate2"
        }, {
            "ctitle": "时间",
            "ctype": M1FormUtils.C_iConditionType_Datetime,
            "cname": "edatetime"
        }, {
            "ctitle": "时间2",
            "ctype": M1FormUtils.C_iConditionType_Datetime,
            "cname": "edatetime2"
        }, {
            "ctitle": "关联项目",
            "ctype": M1FormUtils.C_iConditionType_Project,
            "cname": "lproject",
            "showtitle": "测试项目",
            "cvalue": 121212
        }, {
            "ctitle": "关联项目2",
            "ctype": M1FormUtils.C_iConditionType_Project,
            "cname": "lproject2",
            "showtitle": "测试项目2",
            "cvalue": 1212122
        }];
    fConditionArray.push(fConditionItem);
    /*
     ,{
     "ctitle" : "单选枚举",
     "ctype" : M1FormUtils.C_iConditionType_Radio,
     "cname" : "rlist"
     }
     */
    fConditionItem = [{
        "ctitle": "文本例子",
        "ctype": M1FormUtils.C_iConditionType_Textarea,
        "cname": "tname"
    }, {
        "ctitle": "复选枚举",
        "ctype": M1FormUtils.C_iConditionType_Checkbox,
        "cname": "clist",
        "datalist": {
            "list": [{
                "value": 0,
                "name": "卤牛肉"
            }, {
                "value": 1,
                "name": "花生米"
            }, {
                "value": 2,
                "name": "四季豆"
            }, {
                "value": 3,
                "name": "薯片"
            }, {
                "value": 4,
                "name": "烤鸡翅"
            }, {
                "value": 5,
                "name": "凉拌三丝"
            }, {
                "value": 6,
                "name": "回锅肉"
            }]
        },
    }
    ];
//	fConditionItem.pop();

    fConditionArray.push(fConditionItem);
    freportData = {
        "reportName": "单项交叉",
        "mChartList": [
            {
                "dataList": [
                    [
                        "159", "0"], [
                        "0", "2480"]],
                "serviesNames": [
                    "辛裴部门", "复活吧，我的勇士"],
                "indexNames": [
                    "洋3\/2016-02-06", "洋5\/2016-02-29"],
                "graphFlag": true,
                "flag": true,
                "classType": "MChartList"
            }],
        "chartNameList": [
            "人员报销"],
        "reportID": "-7697926330859041398",
        "currentDate": "统计日期：2016-04-01"
    };
    fIndex = aId % 4;
    if (fIndex % 2 == 0)
        fConditionItem = fConditionArray[fIndex / 2];

    fIndex = aId % 2;

    fresultData = {
        "chartnamelist": ["统计图表"],
        "moredata": "2112",
        "vertical": false,
        "metadata": [
            {
                "title": "产品线",
                "align": 0
            }, {
                "title": "版本号",
                "align": 1
            }, {
                "title": "功能模块",
                "align": 0
            }, {
                "title": "紧急程度",
                "align": 2
            }, {
                "title": "重要程度",
                "align": 2
            }, {
                "title": "发起人",
                "align": 2
            }],
        "result": [
            ["1", "A1", "3.50sp1", "协同办公我是表单我超宽,就是宽,很是宽", "紧急", "重要", "王涛"],
            ["2", "A2", "3.50sp1", "协同办公", "紧急", "重要", "王涛"],
            ["3", "A3", "3.50sp1", "协同办公", "紧急", "重要", "王涛"],
            ["4", "A4", "3.50sp1", "协同办公", "紧急", "重要", "王涛"],
            ["5", "A5", "3.50sp1", "协同办公", "紧急", "重要", "王涛"],
            ["6", "A6", "3.50sp1", "协同办公", "紧急", "重要", "王涛"],
            ["7", "A7", "3.50sp1", "协同办公", "紧急", "重要", "王涛"],
            ["8", "A8", "3.50sp1", "协同办公", "紧急", "重要", "王涛"],
            ["9", "A9", "3.50sp1", "协同办公", "紧急", "重要", "王涛"],
            ["10", "AA", "3.50sp1", "协同办公", "紧急", "重要", "王涛"],
            ["11", "AB", "3.50sp1", "协同办公", "紧急", "重要", "王涛"],
            ["12", "AC", "3.50sp1", "协同办公", "紧急", "重要", "王涛"],
            ["13", "AD", "3.50sp1", "协同办公", "紧急", "重要", "王涛"],
            ["14", "AE", "3.50sp1", "协同办公", "紧急", "重要", "王涛"],
            ["15", "AF", "3.50sp1", "协同办公", "紧急", "重要", "王涛"],
            ["16", "AG", "3.50sp1", "协同办公", "紧急", "重要", "王涛"],
            ["17", "AH", "3.50sp1", "协同办公", "紧急", "重要", "王涛"],
            ["18", "AI", "3.50sp1", "协同办公", "紧急", "重要", "王涛"],
            ["19", "AJ", "3.50sp2", "协同办公1", "紧急1", "重要", "王涛"]
        ]
    };


    fresultData1 = {
        "chartnamelist": ["统计图表"],
        "moredata": "0",
        "vertical": false,
        "metadata": [
            {
                "title": "产品线",
                "align": 0
            }, {
                "title": "版本号",
                "align": 1
            }],
        "result": [
            ["1", "A1", "3.50sp1", "协同办公我是表单我超宽,就是宽,很是宽", "紧急", "重要", "王涛"],
            ["2", "A2", "3.50sp1", "协同办公", "紧急", "重要", "王涛"],
            ["3", "A3", "3.50sp1", "协同办公", "紧急", "重要", "王涛"],
            ["4", "A4", "3.50sp1", "协同办公", "紧急", "重要", "王涛"],
            ["5", "A5", "3.50sp1", "协同办公", "紧急", "重要", "王涛"],
            ["6", "A6", "3.50sp1", "协同办公", "紧急", "重要", "王涛"],
            ["7", "A7", "3.50sp1", "协同办公", "紧急", "重要", "王涛"],
            ["8", "A8", "3.50sp1", "协同办公", "紧急", "重要", "王涛"],
            ["9", "A9", "3.50sp1", "协同办公", "紧急", "重要", "王涛"],
            ["10", "AA", "3.50sp1", "协同办公", "紧急", "重要", "王涛"],
            ["11", "AB", "3.50sp1", "协同办公", "紧急", "重要", "王涛"],
            ["12", "AC", "3.50sp1", "协同办公", "紧急", "重要", "王涛"],
            ["13", "AD", "3.50sp1", "协同办公", "紧急", "重要", "王涛"],
            ["14", "AE", "3.50sp1", "协同办公", "紧急", "重要", "王涛"],
            ["15", "AF", "3.50sp1", "协同办公", "紧急", "重要", "王涛"],
            ["16", "AG", "3.50sp1", "协同办公", "紧急", "重要", "王涛"],
            ["17", "AH", "3.50sp1", "协同办公", "紧急", "重要", "王涛"],
            ["18", "AI", "3.50sp1", "协同办公", "紧急", "重要", "王涛"],
            ["19", "AJ", "3.50sp2", "协同办公1", "紧急1", "重要", "王涛"]
        ]
    };

    if (fIndex == 0) {
        fresult = {
            "id": aId,
            "listtype": aListType,
            "caption": "带条件的查询",
            "condition": fConditionItem,
        };
        fresultData.moredata = 2122;
        fresultData.vertical = true;
        if (aCondition == null || aCondition.length <= 0)
            fresult.data = null;
        else {
            fresult.data = fresultData;
            fresult.reportdata = freportData;
            fresult.condition[0].cvalue = "张三";
            if (fresult.condition[1].datalist != null) {
                fresult.condition[1].cvalue = [1];
            } else
                fresult.condition[1].cvalue = [0];
            if (fresult.condition.length > 2)
                fresult.condition[2].cvalue = [1, 2];
            if (fresult.condition.length > 5) {
                fresult.condition[3].cvalue = "[1]";
                //fresult.condition[3].cvalue="  ";
                fresult.condition[4].cvalue = JSON.stringify([{
                    "orgID": 111,
                    "type": 1,
                    "name": "张一"
                }, {
                    "orgID": 222,
                    "type": 1,
                    "name": "张二"
                }]);
                fresult.condition[5].cvalue = JSON.stringify([{
                    "orgID": 911,
                    "type": 2,
                    "name": "开发部"
                }, {
                    "orgID": 922,
                    "type": 2,
                    "name": "营销部"
                }]);
            }
        }

    } else {
        fresult = {
            "id": aId,
            "listtype": aListType,
            "caption": "直接的查询结果就是长啊,就是长啊,就是长啊,就是长啊,就是长啊,",
            "condition": [],
            "data": fresultData,
            "reportdata": freportData
        };

    }
    return fresult;
}

function doHome(aListType, aId, aSearchValue, aDoSlide) {
    var data, fSearch, fCaption,dataVal;
    fSearch = !M1FormUtils.isStatistics(aListType);
    var fParams;
    if (fSearch || M1FormUtils.isSearchList) {
        aListType = M1FormUtils.C_iListType_Sreach;
        M1FormUtils.isSearchList = false;
        //data=home_getSearchData(aId,aSearchValue);
        if(aSearchValue){
            dataVal = encodeURIComponent(aSearchValue);
        }
        fParams = {
            "aId": aId,
            "aListType": aListType,
            "aSearchValue": dataVal
        };

        $s.CapForm.getFormQueryTree({}, fParams, {
            success: function (ret) {

                console.log('success1');
                for (var i = 0; i < ret.list.length; i++) {
                    ret.list[i].itemtype = parseInt(ret.list[i].itemtype);
                }
                if (aSearchValue != null) {
                    var fitem;
                    for (var j = ret.list.length - 1; j >= 0; j--) {
                        fitem = ret.list[j];
                        if (!startWith(fitem.title, aSearchValue))
                            ret.list.splice(j, 1);
                    }
                }
                data = {
                    "id": ret.id,
                    "caption": ret.caption,
                    "list": ret.list
                };
                if (aDoSlide == null)
                    aDoSlide = true;
                M1FormUtils.isSearchList = false;
                update_homeUI(aDoSlide, data, aListType, aSearchValue);
            },
            error: function (ret) {
                console.log(ret);
            }
        });
    }
    else {

        aListType = M1FormUtils.C_iListType_Statistics;
        fParams = {
            "aId": aId,
            "aListType": aListType,
            "aSearchValue": aSearchValue
        };
        $s.CapForm.getFormQueryTree({}, fParams, {
            success: function (ret) {
                console.log('success1');
                for (var i = 0; i < ret.list.length; i++) {
                    ret.list[i].itemtype = parseInt(ret.list[i].itemtype);
                }
                if (aSearchValue != null) {
                    var fitem;
                    for (var j = ret.list.length - 1; j >= 0; j--) {
                        fitem = ret.list[j];
                        if (!startWith(fitem.title, aSearchValue))
                            ret.list.splice(j, 1);
                    }
                }
                data = {
                    "id": ret.id,
                    "caption": ret.caption,
                    "list": ret.list
                };
                if (aDoSlide == null)
                    aDoSlide = true;
                update_homeUI(aDoSlide, data, aListType, aSearchValue);
            },
            error: function (ret) {
                console.log(ret);
            }
        });
    }
}

function doSearch(aDoSlide, searchParams, aLeftReturnType,isFormQueryBtn) {
    var fdata;
    var fParams = {
        "aId": searchParams.id,
        "aListType": searchParams.listtype,
        "aSearchConditons": searchParams.searchConditons,
        //"userOrderBy":searchParams.userOrderBy
    };

    $s.CapForm.searchForm({}, fParams, {
        success: function (ret) {
            console.log(ret);
            if(typeof ret.id=="number"){
                ret.id=searchParams.id;
            }
            if(typeof ret.listtype=="number"){
                ret.listtype=searchParams.listtype;
            }

            fdata = ret;

            update_searchUI(aDoSlide, fdata, aLeftReturnType,isFormQueryBtn);
        },
        error: function (ret) {
            console.log(ret);
        }
    });
}

var fPCount = 1;

function doSelectPeople(aSelectType, aIsMulti, aConditionName) {
    var fcallObj;
    var fValue;
    var fdom;
    fdom = document.querySelector("span[name='" + aConditionName + "']");
    fValue = fdom.getAttribute("cvalue");
    fValue = decodePersonInfo(fValue);
    fPCount++;
    alert(fValue);
    if (fPCount % 2 == 0) {
        selectPeople_Success([{
            "orgID": 111,
            "type": 1,
            "name": "张一"
        }, {
            "orgID": 222,
            "type": 2,
            "name": "张二"
        }], fdom);
    } else {
        selectPeople_Success([{
            "orgID": 555,
            "type": 1,
            "name": "王大"
        }, {
            "orgID": 666,
            "type": 2,
            "name": "王爸"
        }, {
            "orgID": 777,
            "type": 2,
            "name": "王爷"
        }], fdom);
    }
};
var ftestid = 0;
function getShowFromData(aId, aQueryId, aCallBackFunc,headText) {
    var fParams = {
        "aId": aId,
        "aQueryId": aQueryId
    };
    var backPageInfo = {};
    backPageInfo.data = "";
    backPageInfo.url = "";
    cmp.storage.save(M1FormUtils.showPcFormKey, JSON.stringify(fParams), true);
    $s.CapForm.getFormQueryViewParams({}, fParams, {
        success: function (ret) {
            console.log(ret);
            cmp.storage.save(M1FormUtils.HISKEY, JSON.stringify(Router.get_his()), true);
            if (1 == ret.moduleType) {
                var backPageInfo={};
                var his=Router.get_his();
                /*backPageInfo.url=formqApi.basePath+"/html/index.html"+his[his.length-1];*/
                backPageInfo.url="";
                backPageInfo.data=his;
                collApi.jumpToColSummary(ret.summaryID, "formQuery",ret.operationID);

            } else {

                var options = {
                    name: headText,
                    moduleId: ret.moduleID,
                    moduleType: ret.moduleType,
                    rightId: ret.rightID,
                    viewState: '1'

                };
                cmp.openUnflowFormData(options);
                /*var options = {
                 containerId: 'contentDiv', //渲染的div根节点id
                 moduleId: ret.moduleID,
                 moduleType: ret.moduleType,
                 rightId: ret.rightID,
                 viewState: '1'

                 };
                 document.getElementById("pageframe").style.display = 'none';
                 cmp.sui.loadForm(options);
                 enterForm(ret);*/
            }
        },
        error: function (ret) {
            //console.log(ret);
            var msg;
            var canNotPenetrateMsg="表单设置了不允许穿透";
            if("string"==typeof ret){
                if("object" == typeof(JSON.parse(ret))&&canNotPenetrateMsg==JSON.parse(ret).message.replace(/[^\u4e00-\u9fa5]+/g, '') ){
                    msg = JSON.parse(ret).message.replace(/[^\u4e00-\u9fa5]+/g, '')+"!";
                    cmp.notification.toast(msg, 'bottom', 1500);
                }
            }else if("object"==typeof ret){
                if(canNotPenetrateMsg==ret.message.replace(/[^\u4e00-\u9fa5]+/g, '')){
                    msg = ret.message.replace(/[^\u4e00-\u9fa5]+/g, '')+"!";
                    cmp.notification.toast(msg, 'bottom', 1500);
                }
            }

        }
    });
};

/*function enterForm() {
 setTimeout(function () {
 if (null != document.querySelector(".sui-form-content")) {

 var contentDom = document.getElementById("contentDiv");
 contentDom.style.height = window.innerHeight + "px";
 contentDom.style.overflow = "auto";

 var span = "<span class='see-icon-v5-common-arrow-left cmp-pull-left back-link-list'></span>";
 var headerHtml = document.querySelector(".sui-form-header");
 var htmlValue = headerHtml.innerHTML;
 headerHtml.innerHTML = span + htmlValue;
 document.querySelector("h3").style.cssText = "display:inline-block";
 headerHtml.style.cssText = "overflow:hidden";
 document.querySelector(".back-link-list").addEventListener('tap', function () {
 document.getElementById("contentDiv").innerHTML = "";
 document.getElementById("pageframe").style.display = 'block';
 })
 } else {
 enterForm();
 }

 }, 100);
 }*/


function enterForm(params) {
    setTimeout(function () {
        if (null != document.querySelector(".sui-form-content")) {

            var contentDom = document.querySelector(".unflowformPage");
            var contentDiv= document.querySelector("#contentDiv");
            var headerDiv=document.querySelector("#header");

            contentDom.style.display ="block";
            /*if(parseInt(headerDiv.style.height.replace(/px/g,""))>50){
             headerDiv.style.position="relative";
             }*/

            cmp.backbutton.push(unflowformPageBack);
            contentDom.style.position = "relative";
            contentDom.style.height = window.innerHeight + "px";
            contentDom.style.overflow = "auto";
            contentDiv.style.top=headerDiv.style.height;

            var showPc_Btn = document.getElementById("showPc_Btn");
            showPc_Btn.addEventListener("tap", function(){
                var opt = {
                    "isNew": false,
                    "style":"1",
                    "moduleId": params.moduleID,
                    "moduleType": params.moduleType,
                    "openFrom": "unflowform",
                    "templateId": "",
                    "rightId": params.rightId,// "rightId": params.rightId.indexOf(".")==-1?params.rightId:params.rightId.substring(params.rightId.indexOf(".")+1).replace("|",""),
                    "indexParam": "0",
                    "viewState": "1",
                    "contentType": "20"
                };

                if(params.showType=="browse") {
                    opt.moduleId=params.moduleID;
                    cmp.showPcForm(opt);
                }else{
                    cmp.dialog.loading(true);//显示
                    var opt1= { moduleId:params.moduleID, needCheckRule:false, notSaveDB:true,needSn:false};
                    cmp.sui.submit(opt1,function(err, data) {
                        cmp.dialog.loading(false);//不显示
                        if(err){
                            cmp.notification.toast(err.message,"center");
                        }else {
                            opt.contentDataId=data.contentAll.contentDataId;
                            M1FormUtils.isShowPcForm=true;
                            cmp.showPcForm(opt);
                        }
                    });
                }

            });


            document.addEventListener("tap",function(e){

                var srcEle = e.target;

                //附件
                if(srcEle.classList.contains("allow-click-attachment")){
                    var attData = srcEle.getAttribute("see-att-data");
                    SeeyonAttachment.openRelatedDoc({"att" : cmp.parseJSON(attData)});
                }else if(srcEle.classList.contains("allow-click-relationform")){
                    //关联表单
                    var relData = srcEle.getAttribute("see-att-data");
                    relData = cmp.parseJSON(relData);
                    if(relData.formType=="1"){//有流程
                        //触发页面数据缓存
                        cmp.event.trigger("beforepageredirect",document);
                        parent.collApi.jumpToColSummary(relData.dataId,"formRelation");
                    }else{
                        var option={};
                        option.moduleId=relData.dataId;
                        option.moduleType=cmp.parseJSON(relData.record).formType;
                        option.rightId=relData.rightId;
                        option.name=relData.title;
                        //触发页面数据缓存
                        cmp.event.trigger("beforepageredirect",document);
                        cmp.openUnflowFormData(option);
                    }

                }else if(srcEle.tagName.toLocaleLowerCase() === "img"){

                    if(cmp.platform.CMPShell){
                        //图片
                        var path = srcEle.getAttribute("src"),
                            filename = srcEle.getAttribute('filename') || '' ;
                        cmp.att.read({
                            filename: filename,
                            path: path, // 文件路径
                            success: function(res){
                                console.log(res);
                            },
                            error:function(err){
                                console.log(err);
                            }
                        });
                    }else{
                        //TODO 图片为何要通过壳来看~~
                    }
                }
            });

        } else {
            enterForm(params);
        }

    }, 100);
}


function showFromDetail(aData) {
    alert(JSON.stringify(aData));
};
function doSelectProject(aConditionName) {
    alert("not support select project condition!");
    var fcallObj;
    var fdom;
    fdom = document.querySelector("span[name='" + aConditionName + "']");
    if (fdom == null) {
        alert("not found dom:span name=" + fdom.value);
        return;
    }

    var fresult;
    fresult = {id: "2573", name: "测试项目"};
    selectProject_Success(fresult, fdom);
};
