//页面初始化
cmp.ready(function() {
	
	if(!cmp.os.mobile){
		alert(cmp.i18n("footprint.message.viewOnPC"));
		document.getElementsByTagName("body")[0].innerHTML = "";
		return;
	}
	
	//针对于ios状态栏的颜色修改问题
	if (/iphone|ipad|ipod/gi.test(navigator.userAgent) && cmp.platform.CMPShell){
		cmp.app.setStatusBarStyleforiOS({
			statusBarStyle : 1
		});
	}
	
	var urlParam = cmp.href.getParam() || {};
	var isShare = urlParam.fromShare == undefined ? false : true;
	footPrint.pageData.isShare = isShare;
	/**
	 * 二次分享的情况
	 */
	if(getUrlParam("fromShare") == "true" && !footPrint.pageData.isShare){
		cmp.notification.alert(cmp.i18n("Taskmanage.message.noPermissionToView"),function(){},cmp.i18n("Taskmanage.label.tips"),cmp.i18n("Taskmanage.label.confirm"));
		return;
	}
	
	footPrint.initShareCondition();
	
	//1、初始fullpage事件
	footPrint.initPageEvent();
	//2、初始第一屏
	footPrint.initPageData();
	//显示页面
    _$("#fp-container").classList.add("body-visible");
    _$("#fp-container").classList.remove("body-hidden");
    _$(".page-loader").classList.add("body-hidden");
});

var footPrint = {};
//页面缓存数据
footPrint.pageData = {};
//默认为上月
footPrint.dateType = cmp.storage.get("selectValue") ? cmp.storage.get("selectValue") : "preMonth";

/**
 *初始化第一个页面 
 */
footPrint.initPageData = function() {	
	//1、获取人员头像、登录天数、人员姓名
	$s.Footprint.getUseDays("","",{
		success:function(indexInfo){
			if (indexInfo && indexInfo != null) {
				_$("#name").innerHTML = indexInfo.name;
				footPrint.pageData.userName = indexInfo.name;
				_$("#imgUrl").src = getCmpRoot() + indexInfo.imgUrl;
				_$("#days").innerHTML = indexInfo.days;
				_$("#currentDate").innerHTML = indexInfo.currentDate;
				//新用户或者外部人员只显示首页
				if(indexInfo.isNewUser=='true' || indexInfo.isNewUser==true
						|| indexInfo.isNotInternal=='true' || indexInfo.isNotInternal==true) {
					_$("#hasData").style.display = "none";
					if(indexInfo.isNotInternal=='true' || indexInfo.isNotInternal==true){//新建人员
						_$("#noData").style.display = "none";
						_$("#isNotInternal").style.display = "";
					}else{//外部人员
						_$("#noData").style.display = "";
						_$("#isNotInternal").style.display = "none";
					}
					//只显示本页和最后一页
					footPrint.removeItem("item2");
					footPrint.removeItem("item3");
					footPrint.removeItem("item4");
					footPrint.removeItem("item5");
					footPrint.removeItem("item6");
					return;
				}else{
					_$("#hasData").style.display = "";
					_$("#noData").style.display = "none";
					_$("#isNotInternal").style.display = "none";
				}
				
				/**
				 * 如果是分享就不初始化可选时间了
				 */
				if(footPrint.pageData.isShare) return;
				
				//获取下拉列表可以选择的时间
				$s.Footprint.getCanSearchDateList("","",{
					success:function(canSearchDateInfo){
						//可选择日期
						var objSelect=_$("#dateSelect");
						var inner = "<option value='preMonth' selected>"+canSearchDateInfo.preMonth+"</option>";
						if(canSearchDateInfo.preHalfYear){
							inner += "<option value='preHalfYear'>"+canSearchDateInfo.preHalfYear+"</option>";
						}
						inner += "<option value='preYear'>"+canSearchDateInfo.preYear+"</option>";
						objSelect.innerHTML=inner;			
									
						if (cmp.storage.get("selectIndex") && cmp.storage.get("selectIndex") !="") {
							var id = cmp.storage.get("selectIndex");
							var value = cmp.storage.get("selectValue");
							
							var objSelect=_$("#dateSelect");
							objSelect.options[id].selected = true;
							footPrint.dateType = value;
						}
					},
					error:function(){
						dealAjaxError(e);
					}
				});
				
			}
		},
		error :function(e){
			dealAjaxError(e);
		}
	});
}

function dateSelect(selectValue,selectIndex){
	footPrint.reBuildDom();
    cmp.storage.save("selectIndex", selectIndex);
    cmp.storage.save("selectValue", selectValue);
    footPrint.dateType = selectValue;
    footPrint.checkData();
    footPrint.insDate = getDateMapItem(selectValue);
    footPrint.initShare();    
    footPrint.fullPage.moveTo(1);
}
footPrint.reBuildDom = function(){
	for(var i = 2;i < 8;i++){
		var item = document.querySelector("#item" + i);
		if(item) item.parentNode.removeChild(item);
	}
	_$("#fullpage").insertAdjacentHTML("beforeEnd",footPrint.domTPL);
}
footPrint.getInitDom = function(){
	var initDom = "";
	for(var i = 2;i < 8;i++){
		initDom += document.querySelector("#item" + i).outerHTML;
	}	
	return initDom;
}
/**
 * 检查是否有调度数据。若没有则不展示第2，3，4，5，6页
 */
footPrint.checkData = function(){
	//没有调度数据的情况
	if(_$("#item2")){
		footPrint.getPageData("page2",function(detailInfo){
			if(detailInfo.zyxtScore == 0 && detailInfo.qywhScore == 0 && detailInfo.zsjlScore == 0 && detailInfo.rcgzScore == 0 && detailInfo.mblcScore == 0){
				footPrint.removeItem("item2");
				footPrint.removeItem("item4");
				footPrint.removeItem("item5");
				footPrint.removeItem("item6");
			}
		});
	}
	//第三页
	if(_$("#item3")){
		footPrint.getPageData("page3",function(detailInfo){
			if(_$("#hasLoginArea")) _$("#hasLoginArea").style.display = "";
			if(_$("#noLoginArea")) _$("#noLoginArea").style.display = "none";
			if(detailInfo.dateType!="preMonth"){
    			if(_$("#monthText1")) _$("#monthText1").style.display = "none";
    			if(_$("#monthText2")) _$("#monthText2").style.display = "none";
    		}else{
    			if(_$("#monthText1")) _$("#monthText1").style.display = "";
    			if(_$("#monthText2")) _$("#monthText2").style.display = "";
    		}
			if(detailInfo.totalCount==0){
				if(_$("#yearArea2")) _$("#yearArea2").innerHTML=detailInfo.year;
				if(_$("#monthArea2")) _$("#monthArea2").innerHTML=detailInfo.month;
				if(_$("#hasLoginArea")) _$("#hasLoginArea").style.display = "none";
				if(_$("#noLoginArea")) _$("#noLoginArea").style.display = "block";
				//后续仅显示最后一页。
				footPrint.removeItem("item4");
				footPrint.removeItem("item5");
				footPrint.removeItem("item6");
			}else if(!detailInfo.earliestMonth && !detailInfo.earliestDay && !detailInfo.earliestTimes){
				footPrint.removeItem("item3");
				return;
			}
		});
	}

	//第四页
	if(_$("#item4")){
		footPrint.getPageData("page4",function(detailInfo){
			if(detailInfo.sendNum == 0 && detailInfo.handNum == 0){
				footPrint.removeItem("item4");
			}
			//判断第五页要不要展示
			footPrint.getPageData("page5",function(detailInfo5){
				if((!detailInfo.receivePraiseNum || detailInfo.receivePraiseNum == 0) &&
					(!detailInfo.praiseNum || detailInfo.praiseNum == 0) &&
					(!detailInfo5.shareNum || detailInfo5.shareNum == 0) &&
					(!detailInfo5.readNum || detailInfo5.readNum == 0)) {
					footPrint.removeItem("item5");
				}else{
					//获赞
					if(_$("#receivePraiseNum")) _$("#receivePraiseNum").innerHTML = detailInfo.receivePraiseNum;
					//点赞
					if(_$("#praiseNum")) _$("#praiseNum").innerHTML = detailInfo.praiseNum;
				}
			});
		});
	}
	
	//第六页
	if(_$("#item6")){
		footPrint.getPageData("page6",function(detailInfo){
			if(detailInfo.readTotal == 0 && detailInfo.bbsNum == 0 && detailInfo.showPicNum == 0){
				footPrint.removeItem("item6");
			}
		});
	}
}
/**
 * 初始化页面事件
 */
footPrint.initPageEvent = function() {
	//注册返回事件
	footPrint.goBack();
	//分享事件
	footPrint.initShare();
	
    footPrint.fullPage = cmp.fullPage("#fullpage",{
        onLeave:function(curruntPageNo,nextPageNo,direction){
    		footPrint.getPageData("page"+nextPageNo,function(data){
    			footPrint.renderPage("page"+nextPageNo,data);
    		});
        },
        afterLoad:function(pageName,pageIndex){
        	if("page1" == pageName){
        		if(!footPrint.domTPL){
					//保存页面模板，当切换月份时重建dom
					footPrint.domTPL = footPrint.getInitDom();
				}
				footPrint.checkData();
        	}
        }
    });
}

/**
 * 注册分享事件
 */
footPrint.initShare = function(){
	if(!footPrint.pageData.isShare && cmp.platform.CMPShell){
		_$("#item7 .share .but").innerHTML = cmp.i18n("footprint.label.share");
		cmp("#item7").on("tap",".share .but",function(){
			try{
				ShareRecord.share(footPrint.insDate,42,footPrint.pageData.userName+cmp.i18n("footprint.label.behavior"));
			}catch(e){
				alert(cmp.i18n("footprint.message.shareError") + e);
			}
		});
	}else if(!footPrint.pageData.isShare && !cmp.platform.CMPShell){
		if(_$("#item7 .share .box") && _$("#item7 .share .but")){
			_$("#item7 .share .box").removeChild(_$("#item7 .share .but"));			
		}
	}else{
		//从分享页面进来的不显示分享按钮
		if(_$("#item7 .share .box") && _$("#item7 .share .but")){
			_$("#item7 .share .box").removeChild(_$("#item7 .share .but"));			
		}
		
		_$("#dateSelect").disabled = true;
	}
}

var isLoadChart = false;
/**
 *渲染fullPage页面 
 *@param anchorLink:渲染的页面
 *@param detailInfo：数据
 */
footPrint.renderPage = function(anchorLink,detailInfo){
    switch(anchorLink) {
		case "page2" :
			if(!_$("#item2")){
				return;
			}
			if(isLoadChart == false){				
				cmp.asyncLoad.js([footprintPath+"/js/chart-min.js" + $buildversion],function(){
					isLoadChart = true;
					footPrint.drawChart(detailInfo);
				});
			}else{
				footPrint.drawChart(detailInfo);
			}
    		
			_$("#yearArea1").innerHTML=detailInfo.year;
    		_$("#monthArea1").innerHTML=detailInfo.month;	
    		if(_$("#yearArea2")) _$("#yearArea2").innerHTML=detailInfo.year;
    		if(_$("#monthArea2")) _$("#monthArea2").innerHTML=detailInfo.month;
    		if(footPrint.pageData.isShare == true){
    			//超过全单位*%的人员 （对外分享时这么显示）
    			_$("#accountRankDiv").innerHTML = cmp.i18n("footprint.label.overco")+"<span class=\"ColorGer\">"+detailInfo.accountRankPct+"</span>"+cmp.i18n("footprint.label.people");
    		}else{
    			//单位排名
        		_$("#accountRankDiv").innerHTML = cmp.i18n("footprint.label.rank")+"<span class=\"ColorGer\">"+detailInfo.accountRankStr+"</span>";
    		}
    		
			if(detailInfo.dateType!="preMonth"){
    			if(_$("#monthText1")) _$("#monthText1").style.display = "none";
    			if(_$("#monthText2")) _$("#monthText2").style.display = "none";
    		}else{
    			if(_$("#monthText1")) _$("#monthText1").style.display = "";
    			if(_$("#monthText2")) _$("#monthText2").style.display = "";
    		}
    		break;
		case "page3" : 
			if(!_$("#item3")){
				return;
			}
			
			//最早登陆时间
			_$("#earliestMonth").innerHTML = detailInfo.earliestMonth;
			_$("#earliestDay").innerHTML = detailInfo.earliestDay;
			_$("#earliestTimes").innerHTML = detailInfo.earliestTimes;
			//最晚退出时间
			_$("#latestMonth").innerHTML = detailInfo.latestMonth;
			_$("#latestDay").innerHTML = detailInfo.latestDay;
			_$("#latestTimes").innerHTML = detailInfo.latestTimes;
			
			//登录次数
			//_$("#totalCount").innerHTML = detailInfo.totalCount;
			_$("#pcCount").innerHTML = detailInfo.pcCount;
			_$("#m1Count").innerHTML = detailInfo.m1Count;
			
			//m1登录占比
			_$("#m1LoginRank").innerHTML = detailInfo.m1LoginRank;
			
			//工作时长
			_$("#pcTimes").innerHTML = detailInfo.pcTimes;
			_$("#m1Times").innerHTML = detailInfo.m1Times;
			
			
			//m1无登陆，不显示对应信息
			if(detailInfo.isOnlyPcLogin){
				_$("#m1LoginRankArea").style.display = "none";
				_$("#m1TimesArea").style.display = "none";
			}else{
				_$("#m1LoginRankArea").style.display = "";
				_$("#m1TimesArea").style.display = "";

			}
			break;
		case "page4" : 
			if(!_$("#item4")){
				return;
			}
			//发送流程
			_$("#sendNum").innerHTML = detailInfo.sendNum;
			//处理流程
			_$("#handNum").innerHTML = detailInfo.handNum;
			if(detailInfo.handNum == 0){
				_$("#processHandArea").style.display = "none";
			}else{
				_$("#processHandArea").style.display = "";
				
				//平均处理时长
				var avgHtml = cmp.i18n("footprint.label.dealtime");
				var avghandles = (detailInfo.avgHandleTime).split(",");
				if(avghandles[0] > 0){//最大为天
					avgHtml = avgHtml+"<span class=\"ColorGer\">"+avghandles[0]+"</span>"+ cmp.i18n("footprint.label.days") +"<span class=\"ColorGer\">"+avghandles[1]+"</span>"+cmp.i18n("footprint.label.hours");
				}else if(avghandles[1] >0){//最大为小时
					avgHtml = avgHtml+"<span class=\"ColorGer\">"+avghandles[1]+"</span>"+cmp.i18n("footprint.label.hours")+"<span class=\"ColorGer\">"+avghandles[2]+"</span>"+cmp.i18n("footprint.label.minutes");
				}else{//最大为分钟
					avgHtml = avgHtml+"<span class=\"ColorGer\">"+avghandles[2]+"</span>"+cmp.i18n("footprint.label.minutes");
				}
				_$("#avgP").innerHTML = avgHtml;
				
				if(footPrint.pageData.isShare == true){
					//超过全单位50%的人
					_$("#processRank").innerHTML = cmp.i18n("footprint.label.overco")+"<span class=\"ColorGer\">"+detailInfo.processPct+"</span>"+cmp.i18n("footprint.label.people");
				}else{
					//全单位排名 50/100
					_$("#processRank").innerHTML = cmp.i18n("footprint.label.rank")+"<span class=\"ColorGer\">"+detailInfo.processRank+"</span>";
				}
			}
			
			if(detailInfo.templeteName == null || detailInfo.templeteName ==""){
				_$("#templeteArea").style.display = "none";
			}else{
				_$("#templeteArea").style.display = "";
				if(footPrint.pageData.isShare == true){
					//分享给外部时，转发的名称只显示首尾两个字 其余用***代替
					var tplName = detailInfo.templeteName;
					if(tplName.length > 2){
						tplName = tplName.substring(0,1) + "***" + tplName.substring(tplName.length-1);
					}
					_$("#templeteName").innerHTML = tplName;
				}else{
					//您使用最多的模板
					_$("#templeteName").innerHTML = detailInfo.templeteName;
				}
			}
			break;
		case "page5" :
			if(!_$("#item5")){
				return;
			}
			footPrint.getPageData(anchorLink,function(data){
				//分享文档
				_$("#docShareNum").innerHTML = data.shareNum;
				//阅读文档
				_$("#docReadNum").innerHTML = data.readNum;
			});
			break;
		case "page6" : 
			if(!_$("#item6")){
				return;
			}
			//阅读量
			_$("#readTotal").innerHTML = detailInfo.readTotal;
			if(detailInfo.readTotal == 0){
				_$("#readArea").style.display = "none";
			}else{
				//阅读比例
				_$("#readArea").style.display = "";
				_$("#readPct").innerHTML = detailInfo.readPct;
			}
			//参与讨论
			_$("#bbsNum").innerHTML = detailInfo.bbsNum;
			//秀出照片数
			_$("#showPicNum").innerHTML = detailInfo.showPicNum;
			if(detailInfo.showPicNum == 0){
				_$("#showPicMostArea").style.display = "none";
			}else{
				_$("#showPicMostArea").style.display = "";
				if(footPrint.pageData.isShare == true){
					//分享给外部时，秀主题名称只显示首尾两个字 其余用***代替
					var showName = detailInfo.showName;
					if(showName.length > 2){
						showName = showName.substring(0,1) + "***" + showName.substring(showName.length-1);
					}
					_$("#showName").innerHTML = showName;
				}else{
					//秀出最多的照片秀
					_$("#showName").innerHTML = detailInfo.showName;
				}
			}
			break;
		default : 
	}
}
//删除页面
footPrint.removeItem = function(itemId){
	var item=_$("#"+itemId);
	if(item){
		item.parentNode.removeChild(item);
	}
}
//返回事件
footPrint.goBack = function(){
	//适配底导航
	var isFromM3NavBar = window.location.href.match('m3from=navbar');
	if(isFromM3NavBar){
		document.querySelector("#callback").style.display = "none";
		
		cmp.backbutton();
    	cmp.backbutton.push(cmp.closeM3App);
	}else{
		cmp.backbutton();
	    cmp.backbutton.push(cmp.href.back);
	    
	    cmp(".header").on('tap', "#callback", function(){
			cmp.href.back();
		});
	}
}

footPrint.drawChart = function(detailInfo){
	/**
	 * 初始化数据
	 */
	var labelArr = [],valueArr = [];
	/**沟通协作总分*/
    if(detailInfo.zyxtScore != 0){
    	labelArr.push(cmp.i18n("footprint.label.freecolla"));
    	valueArr.push(detailInfo.zyxtScore);
	}
    /**审批流程总分*/
	if(detailInfo.mblcScore != 0){
		labelArr.push(cmp.i18n("footprint.label.model"));
    	valueArr.push(detailInfo.mblcScore);
	}
	/**日常工作总分*/
	if(detailInfo.rcgzScore != 0){
		labelArr.push(cmp.i18n("footprint.label.daily"));
    	valueArr.push(detailInfo.rcgzScore);
	}
	/**知识积累总分*/
	if(detailInfo.zsjlScore != 0){
		labelArr.push(cmp.i18n("footprint.label.knowledge"));
    	valueArr.push(detailInfo.zsjlScore);
	}
    /**企业文化总分*/
	if(detailInfo.qywhScore != 0){
		labelArr.push(cmp.i18n("footprint.label.culture"));
    	valueArr.push(detailInfo.qywhScore);
	}

	/**总分*/
	var totalScore = detailInfo.totalScore;
	
	/*
	 * 初始化雷达图
	 */
	var ctx = document.getElementById("chart-radar").getContext("2d");
	var data = {
	    labels: labelArr,
	    datasets: [
	        {
	            backgroundColor: "#7FC744",
	            borderColor: "#7FC744",
	            data: valueArr
	        }
	    ]
	};
	var myRadarChart = new Chart(ctx, {
	    type: 'radar',
	    data: data,
	    options: {	
	    			layout: {
	    				padding: 35
	    			},
	    			legend: {
	    				display: false
	    			},
	    			angleLines: {
	    				color: "rgba(255,255,255,1)"
	    			},
		            scale: {
		                ticks: {
		                    beginAtZero: true,
		                    max: 1000,
		                    fixedStepSize: 1000,
		                    showLabelBackdrop:false
		                },
		                pointLabels: {
		                	fontFamily: 'microsoft yahei',
		                	fontColor: "#ffffff",
		                	fontSize: 16
		                }
		            },
		            custom: {
		            	radarFill: true,
		            	radarBackgroundColor: "rgba(0,0,0,0.2)",
		            	angleLinesColor: "rgba(196,196,196,0.2)",
		            	centerText: totalScore,
		            	centerFont: "bold 20px microsoft yahei",
		            	centerFontStyle: "rgba(255,255,255,1)"
		            }
				}
	});
}
/**
 *一般获取数据 
 *@param anchorLink：或那个页面的数据
 *@param callback：数据加载成功回调
 */
footPrint.getPageData = function(anchorLink,callback){
	if(footPrint.pageData[footPrint.dateType + anchorLink]){
		//如果存在数据，则从缓存取
		callback(footPrint.pageData[footPrint.dateType + anchorLink]);
	}else{
		$s.Footprint.getFootPrintData(anchorLink,footPrint.dateType,"","",{
			success:function(detailInfo){
				footPrint.insDate = formatDateType(detailInfo.dateType,detailInfo.year,detailInfo.month);
				//缓存数据
				footPrint.pageData[footPrint.dateType + anchorLink] = detailInfo;
				//回调
				callback(detailInfo);
			},
			error :function(e){
				dealAjaxError(e);
			}
		});
	}
}
/**
 * 获取具体日期
 * @param {Object} year
 * @param {Object} month
 */
footPrint.dateMap = {};
var formatDateType = function(dateType,year,month){
	var result;
	if(dateType == "preYear"){
		result = year + "13";
	}else if(dateType == "preHalfYear"){
		result = year + "14"
	}else{
		result = year+month;
	}
	footPrint.dateMap["dateType_" + dateType] = result;
	return result;
}

var getDateMapItem = function(type){
	return footPrint.dateMap["dateType_" + type];
}

footPrint.initShareCondition = function(){
	if(footPrint.pageData.isShare){
		var urlParam = cmp.href.getParam() || {};
		var objectId = urlParam.objectId;
		footPrint.dateType = objectId;	
		
		//来自分享 ： 去掉返回按钮
		_$(".header").removeChild(_$("#callback"));
		_$(".icon_down_pos").style.display = "none";
		
		var opValue;
		var datePattern = footPrint.dateType;
		var year = datePattern.substring(0,4);
		var month = datePattern.substring(4);
		if(month == 13){
			opValue = year + cmp.i18n("footprint.label.wholeYear");
		}else if(month == 14){
			opValue = year + cmp.i18n("footprint.label.halfYear");
		}else{
			opValue = year + cmp.i18n("footprint.label.year") + month + cmp.i18n("footprint.label.month");
		}
		var objSelect=_$("#dateSelect");
		var inner = "<option>" + opValue + "</option>";
		objSelect.innerHTML=inner;
	}
}

var getUrlParam = function(name){
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
}

/*
 * ajax请求error处理
 */
var dealAjaxError = function(error){
	var cmpHandled = cmp.errorHandler(error);
	if(!cmpHandled){
		console.log(error);
		cmp.notification.alert(error);							
	}
}