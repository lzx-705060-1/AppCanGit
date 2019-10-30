(function(){
	//全局变量
	var pageContext = {
		isShare : false,
		userName : '',
		dateType : "preMonth",
		initDom : '',
		year : '',
		month : ''
	};
	
	cmp.ready(function(){
		//初始化页面状态
		//initPageState();
		//fullpage事件
		initFullPage();
		//返回事件
		initBackEvent();
		//初始化页面数据
		initData();
	});
	
	var initPageState = function(){
		/**
		 * 是否是分享
		 */
		var urlParam = cmp.href.getParam() || {};
		pageContext.isShare = urlParam.fromShare == undefined ? false : true;
		
		//初始化从分享点进来的情况
		initShareCondition();
		
		/**
		 * 分享之后可能在pc端打开
		 */
		if(!cmp.os.mobile){
			alert(cmp.i18n("footprint.message.viewOnPC"));
			document.getElementsByTagName("body")[0].innerHTML = "";
			return;
		}
		/**
		 * 二次分享的情况
		 */
		if(helpers.getUrlParam("fromShare") == "true" && !footPrint.pageData.isShare){
			cmp.notification.alert(cmp.i18n("Taskmanage.message.noPermissionToView"),function(){},cmp.i18n("Taskmanage.label.tips"),cmp.i18n("Taskmanage.label.confirm"));
			return;
		}
	}
	
	var initBackEvent = function(){
		var isFromM3NavBar = window.location.href.match('m3from=navbar');
		if(isFromM3NavBar){
			cmp.backbutton();
	    	cmp.backbutton.push(cmp.closeM3App);
		}else{
			cmp.backbutton();
		    cmp.backbutton.push(cmp.href.back);
		}
	}
	
	var initData = function(){
		var p_firstPage = new Promise(function(resolve, reject){
			//第一页和第二页数据
			$s.Footprint.getUseDays("","",{
				success:function(indexInfo){
					if (indexInfo && indexInfo != null) {
						//第一页
						_$(".item1 .user-name").innerHTML = indexInfo.name;
						_$(".item1 .user-img img").src = getCmpRoot() + indexInfo.imgUrl;
						pageContext.userName = indexInfo.name;
						//第二页
						var useDays = '';
						for(var i = 0;i < indexInfo.days.length;i++){
							useDays += '<li class="day-number li"><span class="number-text">' + indexInfo.days[i] + '</span></li>';
						}
						_$(".items-landscape ul").innerHTML = useDays;
						//多少年
						_$(".insetNumber").innerHTML = Math.round(indexInfo.days / 365);
						//新用户或者外部人员只显示首页
						if(indexInfo.isNewUser=='true' || indexInfo.isNewUser==true || indexInfo.isNotInternal=='true' || indexInfo.isNotInternal==true) {
							helpers.hideItem("item3");
							helpers.hideItem("item4");
							helpers.hideItem("item5");
							helpers.hideItem("item6");
							helpers.hideItem("item7");
							helpers.hideItem("item8");
						}
					}
					resolve();
				},
				error :function(e){
					dealAjaxError(e);
					reject();
				}
			});
		});
		var p_searchList = new Promise(function(resolve, reject){
			//获取下拉列表可以选择的时间
			$s.Footprint.getCanSearchDateList("","",{
				success:function(canSearchDateInfo){
					//可选择日期
					var selectItem = [];
					selectItem.push({
						value : 'preMonth',
						text : formatI18nDate(canSearchDateInfo['preMonth_data'].year,canSearchDateInfo['preMonth_data'].month)
					});
					if(canSearchDateInfo.preHalfYear){
						selectItem.push({
							value : 'preHalfYear',
							text : formatI18nDate(canSearchDateInfo['preHalfYear_data'].year,canSearchDateInfo['preHalfYear_data'].month)
						});
					}
					selectItem.push({
						value : 'preYear',
						text : formatI18nDate(canSearchDateInfo['preYear_data'].year,canSearchDateInfo['preYear_data'].month)
					});
					var userPicker = new cmp.PopPicker({
				       data:selectItem
				    });
					//在这里绑定切换日期事件
					_$('#selectDate').innerHTML = selectItem[0].text;
					cmp.event.click(_$(".fp-content-button"),function(){
						userPicker.show(function callback(items) {
							pageContext.dateType = items[0].value;
							_$('#selectDate').innerHTML = items[0].text;
							reBuildDom();
							initAllData();
					    });
					});
					resolve();
				},
				error:function(){
					dealAjaxError(e);
					reject();
				}
			});
		});
		Promise.all([p_firstPage,p_searchList]).then(function(){
			initAllData();
		});
	}
	
	var initAllData = function(){
		var p_page3 = new Promise(function(resolve, reject){
			//第三页
			if(_$("#item3")){
				$s.Footprint.getFootPrintData('page2',pageContext.dateType,"","",{
					success:function(detailInfo){
						//年月
						pageContext.year = detailInfo.year;
						pageContext.month = detailInfo.month;
						
						//没有调度数据
						if(detailInfo.zyxtScore == 0 && detailInfo.qywhScore == 0 && detailInfo.zsjlScore == 0 && detailInfo.rcgzScore == 0 && detailInfo.mblcScore == 0){
							helpers.hideItem("item3");
							helpers.hideItem("item6");
							helpers.hideItem("item7");
							helpers.hideItem("item8");
							return;
						}
						//单位排名
						var rank = detailInfo.accountRankStr.split('/');
						_$('.thisNumber').innerHTML = rank[0];
						_$('.allNumber-real').innerHTML = rank[1];
						//雷达图
						if(typeof Chart === 'undefined'){				
							cmp.asyncLoad.js([footprintPath+"/js/chart-min.js" + $buildversion],function(){
								drawChart(detailInfo);
							});
						}else{
							drawChart(detailInfo);
						}
						resolve();
					},
					error :function(e){
						dealAjaxError(e);
						reject();
					}
				});
			}
		});
		var p_page4_5 = new Promise(function(resolve, reject){
			//第四页和第五页
			if(_$("#item4") && _$("#item5")){
				$s.Footprint.getFootPrintData('page3',pageContext.dateType,"","",{
					success:function(detailInfo){
						//处理没有登录的情况
						if(detailInfo.totalCount==0){
							helpers.hideItem("item4");
							helpers.hideItem("item5");
							helpers.hideItem("item6");
							helpers.hideItem("item7");
							helpers.hideItem("item8");
							return;
						}
						//移动占比
						_$('.item4 .percent').innerHTML = detailInfo.m1LoginRank;
						//pc次数
						_$('#pcCount').innerHTML = detailInfo.pcCount;
						//pc时长
						_$('#pcTime').innerHTML = detailInfo.pcTimes;
						//移动次数
						_$('#mobileCount').innerHTML = detailInfo.m1Count;
						//移动时长
						_$('#mobileTime').innerHTML = detailInfo.m1Times;
						//最早登录
						_$('#earliestDay').innerHTML = formatI18nDate('',detailInfo.earliestMonth,detailInfo.earliestDay) + ' ' + detailInfo.earliestTimes;
						//最早登录数字处理
						var earliestNumber = '',earliestClass = 1;
						for(var i = 0;i < detailInfo.earliestTimes.length;i++){
							if(detailInfo.earliestTimes[i] !== ':'){
								earliestNumber += '<div class="cell cell' + earliestClass + '">' + detailInfo.earliestTimes[i] + '</div>';						
								earliestClass++;
							}
						}
						_$('#earliestDayNumber').innerHTML = earliestNumber;
						//最晚退出
						_$('#latestDay').innerHTML = formatI18nDate('',detailInfo.latestMonth,detailInfo.latestDay) + ' ' + detailInfo.latestTimes;
						//最晚退出数字处理
						var latestNumber = '',latestClass = 1;
						for(var i = 0;i < detailInfo.latestTimes.length;i++){
							if(detailInfo.latestTimes[i] !== ':'){
								latestNumber += '<div class="cell cell' + latestClass + '">' + detailInfo.latestTimes[i] + '</div>';						
								latestClass++;
							}
						}
						_$("#latestDayNumber").innerHTML = latestNumber;
						resolve();
					},
					error :function(e){
						dealAjaxError(e);
						reject();
					}
				});
			}
		});
		p_page3.then(p_page4_5).then(function(){
			//第六页和第七页
			if(_$("#item6") && _$("#item7")){
				$s.Footprint.getFootPrintData('page4',pageContext.dateType,"","",{
					success:function(detailInfo){
						//个人平均处理时长
						var avghandles = detailInfo.avgHandleTime.split(",");
						_$('#handleTime-days').innerHTML = avghandles[0];
						_$('#handleTime-hours').innerHTML = avghandles[1];
						//全单位排名
						var rank = detailInfo.processRank.split("/");
						_$('#account-rank-self').innerHTML = rank[0];
						_$('#account-rank-all').innerHTML = rank[1];
						//发起流程数
						_$('#sendNum').innerHTML = detailInfo.sendNum;
						//处理流程数
						_$('#handNum').innerHTML = detailInfo.handNum;
						//获赞数
						_$("#receivePraiseNum").innerHTML = detailInfo.receivePraiseNum;
						//点赞数
						_$("#praiseNum").innerHTML = detailInfo.praiseNum;
					},
					error :function(e){
						dealAjaxError(e);
					}
				});
			}
			//第八页
			if(_$("#item8")){
				$s.Footprint.getFootPrintData('page5',pageContext.dateType,"","",{
					success:function(detailInfo){
						//分享文档
						_$("#docShareNum").innerHTML = detailInfo.shareNum;
						//阅读文档
						_$("#docReadNum").innerHTML = detailInfo.readNum;
					},
					error :function(e){
						dealAjaxError(e);
					}
				});
			}
			//第七页和第八页
			if(_$("#item7") && _$("#item8")){
				$s.Footprint.getFootPrintData('page6',pageContext.dateType,"","",{
					success:function(detailInfo){
						//参与讨论
						_$("#bbsNum").innerHTML = detailInfo.bbsNum;
						//秀出照片数
						_$("#showPicNum").innerHTML = detailInfo.showPicNum;
						//阅读量
						_$("#readTotal").innerHTML = detailInfo.readTotal;
						//阅读比例
						_$("#readPct").innerHTML = detailInfo.readPct;
					},
					error :function(e){
						dealAjaxError(e);
					}
				});
			}
		});
	}
	
	var initFullPage = function(){
		//fullPage组件初始化
		cmp.fullPage("#fullpage",{
			afterLoad:function(pageName,pageIndex){
	        	if("page3" == pageName){
					document.querySelector("#chart-radar").style.display = '';
	        	}
	        }
		});
		//保存初始化后的dom
		pageContext.initDom = getInitDom();
	}
	
	var _$ = function(selector){
		return document.querySelector(selector);
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
	
	var reBuildDom = function(){
		for(var i = 3;i < 10;i++){
			var item = document.querySelector("#item" + i);
			if(item) item.parentNode.removeChild(item);
		}
		_$("#fullpage").insertAdjacentHTML("beforeEnd",pageContext.initDom);
	}
	var getInitDom = function(){
		var initDom = "";
		for(var i = 3;i < 10;i++){
			initDom += document.querySelector("#item" + i).outerHTML;
		}	
		return initDom;
	}
	/**
	 * 初始化是从分享进来的情况
	 */
	var initShareCondition = function(){
		//分享数据加载
		if(pageContext.isShare){
			var urlParam = cmp.href.getParam() || {};
			var objectId = urlParam.objectId;
			pageContext.dateType = objectId;	

			var opValue;
			var datePattern = pageContext.dateType;
			var year = datePattern.substring(0,4);
			var month = datePattern.substring(4);
			if(month == 13){
				opValue = year + cmp.i18n("footprint.label.wholeYear");
			}else if(month == 14){
				opValue = year + cmp.i18n("footprint.label.halfYear");
			}else{
				opValue = year + cmp.i18n("footprint.label.year") + month + cmp.i18n("footprint.label.month");
			}
			_$('#selectDate').innerHTML = opValue;
		}
		//从分享进来或者不是cmp壳的情况不显示按钮
		if(pageContext.isShare || !cmp.platform.CMPShell){
			_$(".praise-button").style.display = 'none';
			return
		}
		//分享按钮点击事件
		cmp("#fullpage").on("tap","#shareBtn",function(){
			try{
				ShareRecord.share(formatDateType(pageContext.dateType,pageContext.year,pageContext.month),42,pageContext.userName+cmp.i18n("footprint.label.behavior"));
			}catch(e){
				alert(cmp.i18n("footprint.message.shareError") + e);
			}
		});
	}
	
	var formatDateType = function(dateType,year,month){
		var result;
		if(dateType == "preYear"){
			result = year + "13";
		}else if(dateType == "preHalfYear"){
			result = year + "14"
		}else{
			result = year+month;
		}
		return result;
	}
	
	var formatI18nDate = function(year,month,day){
		var format = '';
		var locale = cmp.language;
		if(locale === 'en'){
			switch(month){
				case '1' : 
				    format = 'Jan.' + (day ? ' ' + day : '') + (year ? ' ' + year : '');
				    break;
				case '2' :
					format = 'Feb.' + (day ? ' ' + day : '') + (year ? ' ' + year : '');
					break;
				case '3' :
					format = 'Mar.' + (day ? ' ' + day : '')  + (year ? ' ' + year : '');
					break;
				case '4' :
					format = 'Apr.' + (day ? ' ' + day : '')  + (year ? ' ' + year : '');
					break;
				case '5' :
					format = 'May' + (day ? ' ' + day : '')  + (year ? ' ' + year : '');
					break;
				case '6' :
					format = 'Jun.' + (day ? ' ' + day : '')  + (year ? ' ' + year : '');
					break;
				case '7' :
					format = 'Jul.' + (day ? ' ' + day : '')  + (year ? ' ' + year : '');
					break;
				case '8' :
					format = 'Aug.' + (day ? ' ' + day : '')  + (year ? ' ' + year : '');
					break;
				case '9' :
					format = 'Sep.' + (day ? ' ' + day : '')  + (year ? ' ' + year : '');
					break;
				case '10' :
					format = 'Oct.' + (day ? ' ' + day : '')  + (year ? ' ' + year : '');
					break;
				case '11' :
					format = 'Nov.' + (day ? ' ' + day : '')  + (year ? ' ' + year : '');
					break;
				case '12' :
					format = 'Dec.' + (day ? ' ' + day : '')  + (year ? ' ' + year : '');
					break;
				case '13' :
					format = 'all year ' + year;
					break;
				case '14' :
					format = 'half year ' + year;
					break;
			}
		}else{
			switch(month){
				case '13' :
					format = (year ? year + '年' : '') + '全年';
					break;
				case '14' :
					format = (year ? year + '年' : '') + '上半年';
					break;
				default :
					format = (year ? year + '年' : '') + month + '月' + (day ? day + '日' : '');
					break;
			}
		}
		return format;
	}
	
	var drawChart = function(detailInfo){
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
	 * 其他函数
	 */
	helpers = {
		getUrlParam : function(name){
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
			var r = window.location.search.substr(1).match(reg); 
			if (r != null) return unescape(r[2]); return null; 
		},
		hideItem : function(itemId){
			var item=_$("#"+itemId);
			if(item){
				item.parentNode.removeChild(item);
			}
		}
	}
})();
