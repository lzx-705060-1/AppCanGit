(function(global){
	/*
	 * 全局变量
	 */
	var amap;//地图组件
	var pageParam;//页面参数
	var addressComponent;
	var currentMills;//服务器当前时间秒数
	var addressInfo;//地址信息
	var currentUser;//当前用户
	var attendCounter;//计数器
	var isAttend = true;//是否可签到
	var POSITION = "addressInfo";
	var isFromM3NavBar = window.location.href.match('m3from=navbar');//底导航
	var listView;
	
	cmp.ready(function(){
		//绑定返回事件
		bindBackEvent();
		//初始化页面布局(高度计算)
		initPageLayout();
		//初始化数据(地图，日期，打卡记录等)
		initPageData();
		//绑定事件
		bindDomEvent();
	});
	global.initAmap = function(){
		amap = new AmapComponent("mapContainer",{
			type : "amapShow",
			amapShow : {
				afterLoad : function(){
					var self = this;
					var center = self.controller.center;
					checkIsAvailable(center,function(result){
						if(result){
							setPosition(result,self);
						}else{
							AmapComponent.getNearByList(center,function(result){
								setPosition(result.poiList.pois[0],self);
							});
						}
					});
					
					//适配肖大爷的手机
					cmp.dialog.loading(false);
					var submit_success = cmp.storage.get("submit_success",true);
					if(submit_success){
						cmp.notification.toast(cmp.i18n("Attendance.message.attendSuccess"), "center",2000,1);
						cmp.storage.delete("submit_success",true);
					}
				}
			}
		});
	}
	var initPageData = function(){
		var params = cmp.href.getParam();
		//加载当前时间
		loadCurrentTime();
		//加载打卡记录，签到次数
		loadAttendanceList();
		//加载地图
		addressInfo = getPosition();
		
		cmp.dialog.loading(cmp.i18n("Attendance.label.loadMap"));
		var jses = ["https://webapi.amap.com/maps?v=1.3&key=dced395ba47d88fd4dcf8ed6d846cbc7&callback=initAmap"];
		cmp.asyncLoad.js(jses,function(){});		
	}
	var loadCurrentTime = function(){
		$s.Attendance.systemData4Attendance({},{
			success : function(result){
				if(result.success){
					result = result.data;
					console.log(result);
				}else{
					cmp.notification.alert(result.msg,function(){
						cmp.href.back();
					},cmp.i18n("Attendance.message.warn"),cmp.i18n("Attendance.message.previousPage"));
					return;
				}
				//当前用户
				currentUser = result.userInfo;
				currentMills = result.currentTime;
				document.querySelector(".nowDate").innerHTML = attendanceCommon.getCurrentDate(result.currentTime);
				//加载签到按钮上的时间
				document.querySelector(".signTime").innerHTML = attendanceCommon.getCurrentTime(result.currentTime);
			},
			error : function(e){
				attendanceCommon.dealAjaxError(e);
			}
		})
	}
	var loadAttendanceList = function(){
		listView = cmp.listView("#scroll",{
            config: {
                pageSize: 20,
                params: {},
                dataFunc: getData,
                renderFunc: renderData
            },
            up: {
                contentdown: cmp.i18n("Attendance.label.pullUp"),
                contentrefresh: cmp.i18n("Attendance.label.loading"),
                contentnomore: ''
            }
       });
	}
    var getData = function(param,options){
		$s.Attendance.currentAttendance(param,{
			success : function(result){
				if(result.success){
					result = result.data;
				}else{
					cmp.notification.alert(result.msg,function(){
						cmp.href.back();
					},cmp.i18n("Attendance.message.warn"),cmp.i18n("Attendance.message.previousPage"));
					return;
				}
				//签到次数
				if(!attendCounter || attendCounter <= 0) attendCounter = result.total;
				renderAttendanceTimes(result.total);
				options.success(result);
			},
			error : function(e){
				attendanceCommon.dealAjaxError(e);
				options.error();
			}
		});
    }
    /*
     * 签到次数
     */
    var renderAttendanceTimes = function(times){
    	if(times == 0){
    		document.querySelector(".index-action-container").classList.add("index-address-data");
    		var listviewContainer = document.querySelector(".index-listView");
    		if(listviewContainer) listviewContainer.style.display = 'none';
    		document.querySelector(".index-login-tal").innerHTML = cmp.i18n("Attendance.label.noAttendance");
    	}else{
    		var timesHtml = '<span style = "color:#3AADFB">' + times + '</span>'
    		document.querySelector(".index-login-tal").innerHTML = cmp.i18n("Attendance.label.attendTimes",[timesHtml]);
    	}
    }
    
    var renderData = function(result, isRefresh){
    	var tpl = document.getElementById("pending_li_tpl").innerHTML;
    	var table = document.body.querySelector('.cmp-table-view');
    	//删除listview底部div
    	var listViewFooter = document.querySelector("#scroll .cmp-pull-bottom-pocket");
    	if(listViewFooter) listViewFooter.parentNode.removeChild(listViewFooter);
    	
		var tplData = {
    		rowNum : attendCounter,
    		data : result
    	}
    	attendCounter = attendCounter - result.length;
    	
        var html = cmp.tpl(tpl, tplData);
        if (isRefresh) {//是否刷新操作，刷新操作 直接覆盖数据
            table.innerHTML = html;
        } else {
            table.innerHTML = table.innerHTML + html;
        }
        cmp.i18n.detect();
    }
    
	var bindBackEvent = function(){
		if(isFromM3NavBar){
			attendanceCommon.addWebviewEvent(function(data){
				if(data.isRefresh){
					cmp.notification.toast(cmp.i18n("Attendance.message.attendSuccess"), "center",2000,1);
					
					document.querySelector("#bottomPopover").classList.remove("cmp-active");
					document.querySelector("#bottomPopover").style.display = "none";
					
					document.querySelector(".index-listView").style.display = 'block';
					document.querySelector(".index-action-container").classList.remove("index-address-data");
					
					var backDrop = document.querySelector(".cmp-backdrop");
					if(backDrop)
						backDrop.parentNode.removeChild(backDrop);
    				
    				checkIsAvailable([addressInfo.location.lng,addressInfo.location.lat]);
					loadAttendanceList();
				}
			});
			cmp.backbutton();
			cmp.backbutton.push(cmp.closeM3App);
		}else{
			cmp.backbutton();
	        cmp.backbutton.push(cmp.href.back);
		}
	}
	
	var initPageLayout = function(hasHeader){
	    //中间大主容器计算高度
	    var cmp_content=document.querySelector('.cmp-content');
	    var header=document.querySelector('header');
	    var footer=document.querySelector('footer');
	    var windowH= window.innerHeight;
	    var headerH,footerH;
	    headerH = hasHeader ? 44 : 0;
	    footerH = !footer ? 0 : footer.offsetHeight;
	    if(cmp_content){
	        cmp_content.style.height = windowH - footerH + "px";
	    }
	    //首页listView容器高度
	    var index_container=document.querySelector('#index-container');
	    if(index_container){
	        var index_today=document.querySelector('.index-today').offsetHeight;
	        var index_map=document.querySelector('.index-map');
	        var index_location=document.querySelector('.index-location').offsetHeight;
	        var index_action_container=document.querySelector('.index-action-container');
	        var index_listView=index_action_container.querySelector('.index-listView');
	        var index_login=index_action_container.querySelector('.index-login');
	        var index_listView_content=index_listView.querySelector('.index-listView-content');
	        var index_listView_title=index_listView.querySelector('.index-listView-title');
			
			var mapHeight = (windowH - headerH - footerH -index_today - index_location) * 0.3;
			var contentHeight = (windowH - headerH - footerH -index_today - index_location) * 0.7;
			//地图容器高度
			if(index_map){index_map.style.height = mapHeight + "px";}
	        //中间按钮主容器计算高度
	        index_action_container.style.height= contentHeight + "px";
			index_listView.style.height = contentHeight - index_login.offsetHeight - 10 + "px";
			index_listView_content.style.height = index_listView.offsetHeight  - index_listView_title.offsetHeight +"px";
	    }
	}
	
	/**
	 * 验证签到是否可用
	 * @param {Object} lngLat
	 */
	var checkIsAvailable = function(lngLat,callback){
		var promise = new Promise(function(resolve,reject){
			$s.Attendance.availableSettings({},{
				success : function(result){
					if(result.success){
						result = result.data;
						var settingInfo;
						for(var i = 0;i < result.length;i++){
							var distance = AmapComponent.getDistance({
								lng : lngLat[0],
								lat : lngLat[1]
							},{
								lng : result[i].longitude,
								lat : result[i].latitude
							});
							if(distance < result[i].attendRange){
								isAttend = true;
								settingInfo = {
									name : result[i].remark || result[i].name,
									location : {
										lng : result[i].longitude,
										lat : result[i].latitude
									}
								}
								break;
							}
							isAttend = false;
						}
						var iconMark = document.querySelector("#iconMark");
						if(!isAttend){  //不能签到
							document.querySelector(".cmp-text-center.index-login").classList.add("isAttend");
							document.querySelector(".index-login-isAttend .isAttend-msg").innerHTML = cmp.i18n("Attendance.label.beyondTheRange");
							document.querySelector(".signType").innerHTML = cmp.i18n("Attendance.label.businessTrip");
							if(!iconMark.classList.contains('icon-checkin-tanhao')){
								iconMark.classList.add('icon-checkin-tanhao');
							}
							if(iconMark.classList.contains('icon-checkin-success')){
								iconMark.classList.remove('icon-checkin-success');
							}
						}else{
							document.querySelector(".cmp-text-center.index-login").classList.remove("isAttend");
							document.querySelector(".index-login-isAttend .isAttend-msg").innerHTML = cmp.i18n("Attendance.label.inTheRange");
							document.querySelector(".signType").innerHTML = cmp.i18n("Attendance.label.attendance");
							if(iconMark.classList.contains('icon-checkin-tanhao')){
								iconMark.classList.remove('icon-checkin-tanhao');
							}
							if(!iconMark.classList.contains('icon-checkin-success')){
								iconMark.classList.add('icon-checkin-success');
							}
						}
						//判断完成后回调
						if(typeof callback === "function"){
							callback.apply(this,[settingInfo]);
						}
						resolve();
					}else{
						cmp.notification.alert(result.msg,function(){
							cmp.href.back();
						},cmp.i18n("Attendance.message.warn"),cmp.i18n("Attendance.message.previousPage"));
						resolve();
						return;
					}
				},
				error : function(e){
					attendanceCommon.dealAjaxError(e);
					reject();
				}
			});
		});
		promise.then(checkAuth);
	}
	
	//加载签到按钮事件
	var checkAuth = function(){
		$s.Attendance.checkAuthForAttendance({},{
			success : function(result){
				if(result.success){
					result = result.data;
				}else{
					cmp.notification.alert(result.msg,function(){
						cmp.href.back();
					},cmp.i18n("Attendance.message.warn"),cmp.i18n("Attendance.message.previousPage"));
					return;
				}
				//外勤点击事件
				cmp("body").off("tap",".attendance-outside").on("tap",".attendance-outside",function(){
					var typeName = this.querySelector("p").innerHTML;
					doAttendance({
						type : 3,
						typeName : typeName
					});
				});
				document.querySelector(".attendance-work-on p").innerHTML = result.signinName;
				if(result.attend && isAttend){
					//上班签到图标
					document.querySelector(".attendance-work-on .rapid-btn").classList.remove("didNot");
					//上班点击事件
					cmp("body").off("tap",".attendance-work-on").on("tap",".attendance-work-on",function(){
						var typeName = this.querySelector("p").innerHTML;
						doAttendance({
							type : 1,
							typeName : typeName,
							fixTime: result.signinFixTime,
							punchType:result.signinTimeType
						});
					});
				}else{
					document.querySelector(".attendance-work-on .rapid-btn").classList.add("didNot");
					cmp("body").off("tap",".attendance-work-on");
				}
				document.querySelector(".attendance-work-off p").innerHTML = result.signoutName;
				if(result.leave && isAttend){
					//签退图标
					document.querySelector(".attendance-work-off .rapid-btn").classList.remove("didNot");
					//签退点击事件
					cmp("body").off("tap",".attendance-work-off").on("tap",".attendance-work-off",function(){
						var typeName = this.querySelector("p").innerHTML;
						doAttendance({
							type : 2,
							typeName : typeName,
							fixTime: result.signoutFixTime,
							punchType:result.signoutTimeType
						});
					});
				}else{
					document.querySelector(".attendance-work-off .rapid-btn").classList.add("didNot");
					cmp("body").off("tap",".attendance-work-off");
				}
				//重新打卡事件
				cmp("#scroll").off("tap",".modify").on("tap",".modify",function(e){
					if(!isAttend){
						cmp.notification.alert(cmp.i18n("Attendance.label.beyondTheRangeTip"),undefined,undefined,cmp.i18n("Attendance.message.confirm"));
						return;
					}
					var attendanceId = this.parentNode.parentNode.id;
					//签到类型
					var typeName = this.previousElementSibling.innerHTML;
					var type = this.getAttribute("type");
					//签到设备(pc & 移动)
					var source = this.getAttribute("source");
					var fixTime = this.getAttribute("fixTime");
					$s.Attendance.getAttendanceById(attendanceId,{},{
						success : function(result){
							var dateInfo = attendanceCommon.getDataInfo(currentMills);
							var params = {
								isModify : true,//修改标识
								currentUser : currentUser,
								nowdate : {
									time : dateInfo.year + "-" + dateInfo.month + "-" + dateInfo.day,
									week : dateInfo.weekDay
								},
								selectdata : addressInfo,
								typeName : typeName,
								type : type,
								source : source,
								punchType:result.data.punchType,//排班类型
								fixTime:fixTime
							};
							params.attendanceId = result.data.id;
							if(result.success){
								var options = {};
								if(isFromM3NavBar){
									options.openWebViewCatch = 1;
								}
								cmp.href.next(_attendancePath + "/html/attendance-submit.html",params,options);
							}else{
								cmp.notification.alert(result.msg,function(){
									cmp.href.back();
								},cmp.i18n("Attendance.message.warn"),cmp.i18n("Attendance.message.previousPage"));
								return;
							}
						},
						error : function(e){
							attendanceCommon.dealAjaxError(e);
							options.error();
						}
					});
				})
				
				//设置签到地点按钮是否显示
				if(result.showSetting){
					document.querySelector("#setting").style.display = 'block';
					document.querySelector("#index-container").style.paddingTop = '44px';
					
					initPageLayout(true);
					
					cmp("body").off("tap","#setting").on("tap","#setting",function(){
						var options = {};
						if(isFromM3NavBar){
							options.openWebViewCatch = 1;
						}
						cmp.href.next(_attendancePath + "/html/attendanceSettingList.html",null,options);
					});
				}

			},
			error : function(e){
				attendanceCommon.dealAjaxError(e);
			}
		});
	}
	
	var bindDomEvent = function(){
		//足迹分布点击事件
		cmp("body").on("tap","#distribution",function(){
			var options = {};
			if(isFromM3NavBar){
				options.openWebViewCatch = 1;
			}
			cmp.href.next(_attendancePath + "/html/attendanceDistribution.html",null,options);
		});
		//选择地址
		cmp("body").on("tap",".index-location,#mapContainer",function(){
			if(!addressInfo)
				return;
			var initAddressComponent = function(){
				if(!addressComponent){
					cmp.asyncLoad.js([commonPath+"/cmp-resources/lbs/js/lbs-address.js" + $buildversion],function(){					
						addressComponent = new LBSAddress({
							shownodata : false,
							coordinate : {longitude:addressInfo.location.lng,latitude:addressInfo.location.lat},
							title : {
								left:{text:cmp.i18n("Attendance.label.back")},
								right : {text:cmp.i18n("Attendance.message.confirm"),click:function(selectdata){
									setPosition(selectdata);
									checkIsAvailable([selectdata.location.lng,selectdata.location.lat]);
									return true;
								}},
								center:  {text:cmp.i18n("Attendance.label.choose")}
							}
						});
						addressComponent.open();
					});
				}else{
					addressComponent.open();
				}
			}
			attendanceCommon.throttle(initAddressComponent);
		});
		
		/**
		 * 签到记录点击事件
		 */
		cmp("#scroll").on("tap","li",function(e){
			if(e.target.className != 'modify'){
				var options = {};
				if(isFromM3NavBar){
					options.openWebViewCatch = 1;
				}
				var attendanceId = this.id;
				var params = {
					attendanceId : attendanceId
				}
				cmp.href.next(_attendancePath + "/html/attendanceDetail.html",params,options);
			}
		});
	}
	
	/**
	 * 跳转到签到页面
	 */
	var doAttendance = function(params){
		if(!addressInfo){
			cmp.notification.alert(cmp.i18n("Attendance.label.locating"),function(){},cmp.i18n("Attendance.message.warn"),cmp.i18n("Attendance.message.confirm"));
			return;
		}
		var dateInfo = attendanceCommon.getDataInfo(currentMills);
		cmp.extend(params,{
			currentUser : currentUser,
			nowdate : {
				time : dateInfo.year + "-" + dateInfo.month + "-" + dateInfo.day,
				week : dateInfo.weekDay
			},
			selectdata : addressInfo
		});
		var options = {};
		if(isFromM3NavBar){
			options.openWebViewCatch = 1;
		}
		cmp.href.next(_attendancePath + "/html/attendance-submit.html",params,options);
	}
	/**
	 * 设置当前位置信息
	 * @param {Object} selectdata
	 */
	var setPosition = function(selectdata,ctx){
		addressInfo = selectdata;
    	savePosition();
    	if(!ctx) ctx = amap;
        ctx.changeCenter([selectdata.location.lng,selectdata.location.lat]);
        document.querySelector(".location").innerHTML = selectdata.name.escapeHTML();
	}
	/**
	 * 保存当前位置到sessionStorage
	 */
	var savePosition = function(){
		if(addressInfo){
			cmp.storage.save(POSITION,cmp.toJSON(addressInfo),true);
		}
	}
	/**
	 * 获取sessionStorage中的当前位置
	 */
	var getPosition = function(){
		var position = cmp.storage.get(POSITION,true);
		if(position){
			position = cmp.parseJSON(position);
			cmp.storage.delete(POSITION,true);
		} 
		return position;
	}
})(this);
