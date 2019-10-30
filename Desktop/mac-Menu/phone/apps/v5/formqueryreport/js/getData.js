//一、接口：getFormQueryTree
//参数：aId aListType aInputvalue
//M1FormUtils.C_iListType_Sreach =1,
//M1FormUtils.C_iListType_Statistics = 2,
//M1FormUtils.isSearchList=false

function doHome(aListType,aId,aSearchValue,aDoSlide){
	var data,fSearch,fCaption;
	fSearch=!M1FormUtils.isStatistics(aListType);

	if (fSearch||M1FormUtils.isSearchList){
		data=home_getSearchData(aId,aSearchValue);
		M1FormUtils.isSearchList=false;
	}
	else{
		data=home_getStatisticsData(aId,aSearchValue);
	}
	if (aDoSlide==null)
		aDoSlide=true;
}

function home_getSearchData(aId, aInputvalue) {
	var ftemp;
	if (aId == null) {
		ftemp = [ {
			"id" : 1,
			"title" : "工作计划",
			"itemtype" : M1FormUtils.C_iListType_Dir
		}, {
			"id" : 2,
			"title" : "研发体系测试草果长度的目录,我就是长,怎么样啊,你管得着吗",
			"itemtype" : M1FormUtils.C_iListType_Dir
		}, {
			"id" : 3,
			"title" : "运营体系",
			"itemtype" : M1FormUtils.C_iListType_Dir
		}, {
			"id" : 4,
			"title" : "客户体系",
			"itemtype" : M1FormUtils.C_iListType_Dir
		}, {
			"id" : 5,
			"title" : "质量问题查询",
			"itemtype" : M1FormUtils.C_iListType_Sreach
		} ];
		if (aInputvalue != null){
		var fitem;
		for (var i = ftemp.length - 1; i >= 0; i--) {
			fitem = ftemp[i];
			if (!startWith(fitem.title, aInputvalue))
				ftemp.splice(i, 1);
		}
		}
	} else
		ftemp = [ {
			"id" : 1,
			"title" : "开发审批",
			"itemtype" : M1FormUtils.C_iListType_Dir
		}, {
			"id" : 2,
			"title" : "产品发布查询",
			"itemtype" : M1FormUtils.C_iListType_Sreach
		}, {
			"id" : 3,
			"title" : "月度修复包发布查询",
			"itemtype" : M1FormUtils.C_iListType_Sreach
		} ];
	if (ftemp.length > 0)

		ftemp= {
			"id" : aId,
			"caption" : ftemp[0].title,
			"list" : ftemp
		};
	else
		ftemp= {
			"id" : aId,
			"caption" : "",
			"list" : []
		};
		return ftemp;
}
function home_getStatisticsData(aId, aInputvalue) {
	var ftemp;
	if (aId == null) {
		ftemp = [ {
			"id" : 2,
			"title" : "部门管理",
			"itemtype" : M1FormUtils.C_iListType_Dir
		}, {
			"id" : 2,
			"title" : "研发管理",
			"itemtype" : M1FormUtils.C_iListType_Dir
		} ];
		if (aInputvalue != null){
		var fitem;
		for (var i = ftemp.length - 1; i >= 0; i--) {
			fitem = ftemp[i];
			if (!startWith(fitem.title, aInputvalue))
				ftemp.splice(i, 1);
		}
		}
	} else
		ftemp = [ {
			"id" : 1,
			"title" : "品质管理中心",
			"itemtype" : M1FormUtils.C_iListType_Dir
		}, {
			"id" : 2,
			"title" : "产品开发",
			"itemtype" : M1FormUtils.C_iListType_Statistics
		}, {
			"id" : 3,
			"title" : "所有人积分和考题统计",
			"itemtype" : M1FormUtils.C_iListType_Statistics
		}, {
			"id" : 4,
			"title" : "人员负载（里程碑）",
			"itemtype" : M1FormUtils.C_iListType_Statistics
		}, {
			"id" : 5,
			"title" : "个人任务进度（实时）",
			"itemtype" : M1FormUtils.C_iListType_Statistics
		}, {
			"id" : 6,
			"title" : "团队工作量负载",
			"itemtype" : M1FormUtils.C_iListType_Statistics
		}, {
			"id" : 7,
			"title" : "产品经理工作量负载",
			"itemtype" : M1FormUtils.C_iListType_Statistics
		}, {
			"id" : 8,
			"title" : "所有测试任务",
			"itemtype" : M1FormUtils.C_iListType_Statistics
		} ];
	if (ftemp.length > 0)
		return {
			"id" : aId,
			"caption" : ftemp[0].title,
			"list" : ftemp
		};
	else
		return {
			"id" : aId,
			"caption" : "",
			"list" : []
		};
}

//2、
//接口：searchForm
//参数：aId aListType aCondition

function search_getData(aId, aListType, aCondition) {
	var fIndex, fresult,fresultData,freportData;
	var fConditionArray,fConditionItem;
	fConditionArray=[];
	fConditionItem=[
		    {
				"ctitle" : "人员名称",
				"ctype" : M1FormUtils.C_iConditionType_Input,
				"cname" : "pname"
			}, {
				"ctitle" : "是否开始",
				"ctype" : M1FormUtils.C_iConditionType_Checkbox,
				"cname" : "started",
				"datalist" : {
					"list" : [ {
						"value" : 0,
						"name" : "男"
					}, {
						"value" : 1,
						"name" : "女"
					}, {
						"value" : 2,
						"name" : "人妖"
					} ]
				}
			}, {
				"datalist" : {
					"defaultvalue" : 0,
					"list" : [ {
						"value" : 0,
						"name" : "左对其"
					}, {
						"value" : 1,
						"name" : "居中"
					}, {
						"value" : 2,
						"name" : "右对齐"
					} ]
				},
				"ctitle" : "对其方式",
				"ctype" : M1FormUtils.C_iConditionType_Select,
				"cname" : "aligntype"
			},{
				"ctitle" : "同意与否",
				"ctype" : M1FormUtils.C_iConditionType_Radio,
				"cname" : "isok",
				"datalist" : {
					"defaultvalue" : 0,
					"list" : [ {
						"value" : 0,
						"name" : "是"
					}, {
						"value" : 1,
						"name" : "否"
					} ]
				}

			},{
				"ctitle" : "单选人员",
				"ctype" : M1FormUtils.C_iConditionType_Persion,
				"cname" : "runmember"
			},{
				"ctitle" : "单选部门",
				"ctype" : M1FormUtils.C_iConditionType_Department,
				"cname" : "rundepartment"
			},{
				"ctitle" : "日期",
				"ctype" : M1FormUtils.C_iConditionType_Date,
				"cname" : "sdate"
			},{
				"ctitle" : "时间",
				"ctype" : M1FormUtils.C_iConditionType_Datetime,
				"cname" : "edatetime"
			},{
				"ctitle" : "关联项目",
				"ctype" : M1FormUtils.C_iConditionType_Project,
				"cname" : "lproject",
				"showtitle" : "测试项目",
				"cvalue":121212
			},{
				"ctitle" : "关联表单",
				"ctype" : M1FormUtils.C_iConditionType_Relationform,
				"cname" : "lform"
			} ];
	fConditionArray.push(fConditionItem);
/*
	,{
				"ctitle" : "单选枚举",
				"ctype" : M1FormUtils.C_iConditionType_Radio,
				"cname" : "rlist"
			}
*/
	fConditionItem=[{
				"ctitle" : "文本例子",
				"ctype" : M1FormUtils.C_iConditionType_Textarea,
				"cname" : "tname"
			},{
				"ctitle" : "复选枚举",
				"ctype" : M1FormUtils.C_iConditionType_Checkbox,
				"cname" : "clist",
				"datalist" : {
					"list" : [ {
						"value" : 0,
						"name" : "卤牛肉"
					}, {
						"value" : 1,
						"name" : "花生米"
					}, {
						"value" : 2,
						"name" : "四季豆"
					}, {
						"value" : 3,
						"name" : "薯片"
					}, {
						"value" : 4,
						"name" : "烤鸡翅"
					}, {
						"value" : 5,
						"name" : "凉拌三丝"
					}, {
						"value" : 6,
						"name" : "回锅肉"
					} ]
				},
			}
		];
//	fConditionItem.pop();

	fConditionArray.push(fConditionItem);
	freportData={
				 "reportName": "单项交叉",
				 "mChartList": [
				  {
				   "dataList": [
					[
					 "159","0"],[
					 "0","2480"]],
				   "serviesNames": [
					"辛裴部门","复活吧，我的勇士"],
				   "indexNames": [
					"洋3\/2016-02-06","洋5\/2016-02-29"],
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
	if (fIndex % 2 ==0)
    fConditionItem=fConditionArray[fIndex /2 ];

	fIndex = aId % 2;

	fresultData={
			 "chartnamelist":["统计图表"],
			 "moredata":"2112",
		     "vertical":false,
			 "metadata": [
			              {
			               "title": "产品线",
			               "align": 0
			              },{
			               "title": "版本号",
			               "align": 1
			              },{
			               "title": "功能模块",
			               "align": 0
			              },{
			               "title": "紧急程度",
			               "align": 2
			              },{
			               "title": "重要程度",
			               "align": 2
			              },{
			               "title": "发起人",
			               "align": 2
			              }],
			             "result": [
			              ["1","A1","3.50sp1","协同办公我是表单我超宽,就是宽,很是宽","紧急","重要","王涛"],
			              ["2","A2","3.50sp1","协同办公","紧急","重要","王涛"],
			              ["3","A3","3.50sp1","协同办公","紧急","重要","王涛"],
			              ["4","A4","3.50sp1","协同办公","紧急","重要","王涛"],
			              ["5","A5","3.50sp1","协同办公","紧急","重要","王涛"],
			              ["6","A6","3.50sp1","协同办公","紧急","重要","王涛"],
			              ["7","A7","3.50sp1","协同办公","紧急","重要","王涛"],
			              ["8","A8","3.50sp1","协同办公","紧急","重要","王涛"],
			              ["9","A9","3.50sp1","协同办公","紧急","重要","王涛"],
			              ["10","AA","3.50sp1","协同办公","紧急","重要","王涛"],
			              ["11","AB","3.50sp1","协同办公","紧急","重要","王涛"],
			              ["12","AC","3.50sp1","协同办公","紧急","重要","王涛"],
			              ["13","AD","3.50sp1","协同办公","紧急","重要","王涛"],
			              ["14","AE","3.50sp1","协同办公","紧急","重要","王涛"],
			              ["15","AF","3.50sp1","协同办公","紧急","重要","王涛"],
			              ["16","AG","3.50sp1","协同办公","紧急","重要","王涛"],
			              ["17","AH","3.50sp1","协同办公","紧急","重要","王涛"],
			              ["18","AI","3.50sp1","协同办公","紧急","重要","王涛"],
						  ["19","AJ","3.50sp2","协同办公1","紧急1","重要","王涛"]
					     ]
			            };
	
	if (fIndex == 0) {
		fresult = {
			"id" : aId,
			"listtype" : aListType,
			"caption" : "带条件的查询",
			"condition" : fConditionItem,
		};
  	    fresultData.moredata=2122;
		fresultData.vertical=true;
		if (aCondition==null || aCondition.length<=0)
			fresult.data=null;
		else{
			fresult.data=fresultData;
			fresult.reportdata=freportData;
			fresult.condition[0].cvalue="张三";
			if (fresult.condition[1].datalist!=null)
			{
  			  fresult.condition[1].cvalue=[1];
			}else
  			  fresult.condition[1].cvalue=[0];
			if (fresult.condition.length>2)
			  fresult.condition[2].cvalue=[1,2];
			if (fresult.condition.length>5)
			{
				fresult.condition[3].cvalue="[1]";
				//fresult.condition[3].cvalue="  ";
				fresult.condition[4].cvalue=JSON.stringify([ {
						"orgID" : 111,
						"type" : 1,
						"name" : "张一"
					}, {
						"orgID" : 222,
						"type" : 1,
						"name" : "张二"
					} ]);
						fresult.condition[5].cvalue=JSON.stringify([ {
						"orgID" : 911,
						"type" : 2,
						"name" : "开发部"
					}, {
						"orgID" : 922,
						"type" : 2,
						"name" : "营销部"
					} ]);
					}
			}
		
	} else {
		fresult = {
			"id" : aId,
			"listtype" : aListType,
			"caption" : "直接的查询结果就是长啊,就是长啊,就是长啊,就是长啊,就是长啊,",
			"condition" : [],
			"data" : fresultData,
			"reportdata":freportData
		};

	}
	return fresult;
}


//3、
//接口：getFormQueryViewParams
//参数：id queryid aCallBackFunc
//var ftestid=0;

function getShowFromData(aId,aQueryId,aCallBackFunc){

  var result;
  ftestid++;
  if (ftestid % 2 ==0)
  {
     if (ftestid==0);
  }else
  {
     if (ftestid==0);
  }
  if (aId % 2 ==0)
     result= {
	  moduleType:0,
	  moduleID:"moduleID111",
	  formID:"formID222",
	  relObjId:"1111",
      rightID:"rightID333",
	  from:"from222"
  };
  else
     result={
	  moduleType:1,
	  operationID:"operationID111",
	  affairID:"affairID222",
	  summaryID:"summaryID333",
	  archiveID:"archiveID444",
	  from:"from555"
  };
  aCallBackFunc(result);
};

