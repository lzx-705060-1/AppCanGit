/**
 * 
 */
$ShowLbs = {};
(function(){
	var _ = {};
	var _currentCity;
	/**
	 * options.selectedLocation 已选择的地理位置
	 * options.selectedCallback function(selectedLocationName)回调函数，返回选中的位置名称
	 * options.closeEvent
	 * */
	_.isInit = false;  //标识是否进行了初始化
	_.init = function(options){
		_.options = options;
		//Android手机返回按钮监听
        cmp.backbutton();
        cmp.backbutton.push(_.closePage);
		if(!_.isInit){
			document.querySelector('#location_list').innerHTML = "";
			_.initPageData();
			_.initPageEvent();
		}else{
			cmp.listView("#location_scroll").refresh();
		}
	}
	
	$ShowLbs.init = _.init;
	
	/**显示页面数据*/
	_.initPageData = function(){
		_.loadCurrentCityInfo(function(cityInfo){
			_currentCity = cityInfo;
			var cmp_selected = document.querySelector("#location_scroll").querySelector(".cmp-selected");
			if(cmp_selected){
				cmp_selected.classList.remove("cmp-selected");
			}
			
			if(_.options.selectedLocation === undefined || _.options.selectedLocation === "所在位置"){
            	document.querySelector("#not_pos_btn").querySelector(".cmp-table-view-cell").classList.add("cmp-selected");
            }
			
			var cmp_selected = "";
			if(_.options.selectedLocation === cityInfo){
				cmp_selected = "cmp-selected";
            }
            var htmlStr = "<li class=\"cmp-table-view-cell cmp-media "+cmp_selected+"\" id=\""+ cityInfo +"\"><a class=\"cmp-navigate-right\">" +
            		"<div class=\"cmp-media-body\"><span  style='width: 100%; display: inline-block;' class='cmp-ellipsis'>"+ cityInfo +"</span></div></a></li>";
            //TODO 回调 将城市信息放到第一行
            cmp.append(document.querySelector('#location_list'), htmlStr);
			
            _.initLocationListView();
		});
	}
	
	/**绑定页面事件*/
	_.initPageEvent = function(){
		cmp("#location_scroll").off("tap", ".cmp-table-view-cell");
		cmp("#location_scroll").on("tap", ".cmp-table-view-cell", function() {
			//去掉其它的选中
			var cmp_selected = document.querySelector("#location_scroll").querySelector(".cmp-selected");
			if(cmp_selected){
				cmp_selected.classList.remove("cmp-selected");
			}
			//找到当前选中的节点，执行回调
			var selectedLocationName = this.querySelector("span").innerHTML;
			if(_.options.selectedCallback){
				_.options.selectedCallback(selectedLocationName,_currentCity);
				_.closePage();
			}
		});
		
		//cmp("body").on("tap", "#close_window", _.closePage);
	}
	
	_.close = function(){document.querySelector('#location_content').classList.remove('cmp-active');}
	$ShowLbs.close = _.close;
	
	/**关闭页面*/
	_.closePage = function(){
		_.close();
		cmp.backbutton.pop();
		if(_.options.closeEvent && typeof(_.options.closeEvent) == "function"){
			_.options.closeEvent();
		}
	}
	
	/**根据IP获取当前城市所在地*/
	_.loadCurrentCityInfo = function(successCallback){
		if(typeof AMap == 'undefined'){
			cmp.notification.alert(cmp.i18n("Show.fails.locationError"));
			return;
		}
		AMap.service(["AMap.CitySearch"], function() {
	    	//实例化城市查询类
	        var citysearch = new AMap.CitySearch();
	        //自动获取用户IP，返回当前城市
	        citysearch.getLocalCity(function(status, result) {
	            if (status === 'complete' && result && result.info === 'OK') {
	                if (result.city && result.bounds) {
	                    var cityInfo = result.city;
	                    if(successCallback){
	                    	successCallback(cityInfo);
	                    }
	                }else{
	                	cmp.notification.alert(cmp.i18n("Show.fails.getcity") + cmp.i18n("Show.page.msg.net.error"));
	                }
	            }else{
	            	cmp.notification.alert(cmp.i18n("Show.fails.getcity") + cmp.i18n("Show.page.msg.net.error"));
	            }
	        });
	    });
	}//end of _.loadCurrentCityInfo
	
	
	/**ListView列表*/
	_.initLocationListView = function() {
		cmp.listView("#location_scroll", {
			config : {
				isClear : true,
				pageSize : 20,
				params : {},
				dataFunc : function(param, options) {
					cmp.lbs.getCurrentPosition({// 获取当前的坐标定位
						success : function(result) {
							//坐标
							param.pointResult = result;
							_.loadLocationListData(param, function(res) {// successCallback
								var result = {};
								result.data = res.poiList.pois;
								result.total = res.poiList.count;
								// 告诉ListView组件，参数准备完毕，可以执行renderFunc方法
								options.success(result);
							}, function(status, result) {// failCallback
								cmp.notification.alert(cmp.i18n("Show.fails.loadposition") + status);
							});
						},
						error : function(result) {
							cmp.notification.alert(cmp.i18n("Show.fails.position") + cmp.i18n("Show.page.msg.net.error"));
						}
					});
				},//end of dataFunc
				renderFunc : function(result, isRefresh) {
					var listTpl = document.querySelector("#location_li_tpl").innerHTML;
				    var table = document.querySelector('#location_list');
				    var selectedLocation = _.options.selectedLocation;
				    cmp.each(result, function(i, obj){
				    	if (obj.name === selectedLocation) {
				    		obj.selected = true;
				    	} else {
				    		obj.selected = false;
				    	}
				    });
				    var html = cmp.tpl(listTpl, result);
				    //是否刷新操作，刷新操作直接覆盖数据
				    if (isRefresh && StringUtil.isEmpty(table.innerHTML)) {
				        table.innerHTML = html;
				    } else {
				    	cmp.append(table,html);
				    }
				    
				    _.isInit = true;
				}//end of renderFunc
			},
			down : {
				contentdown : cmp.i18n("Show.info.pull.down"),
				contentover : cmp.i18n("Show.info.immediate.refresh"),
				contentrefresh : cmp.i18n("Show.info.being.refreshed")
			},
			up : {
				contentdown : cmp.i18n("Show.info.pull.up"),
				contentrefresh : cmp.i18n("Show.info.being.loaded"),
				contentnomore : cmp.i18n("Show.info.no.more.data")
			}
		});
	}// end of _.initLocationListView
	
	
	/** 根据坐标，分页获取列表的数据 */
	_.loadLocationListData = function(param,successCallBack,failCallBack){
		var pageNo = param["pageNo"];
	    var pageSize = param["pageSize"];
		AMap.service(["AMap.PlaceSearch"], function() {
			// 构造地点查询类
			var placePattern = "商务住宅|地名地址信息|道路附属设施";
	        var placePatternAll = "汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务|公司企业|道路附属设施|地名地址信息|公共设施";
			
			var placeSearch = new AMap.PlaceSearch({
				type : placePattern,
	            pageSize: pageSize,
	            pageIndex: pageNo
	        });
	        var pointResult = param.pointResult;
			
			var cpoint = []; // 中心点坐标
			if(pointResult.coordinate){
				cpoint.push(pointResult.coordinate.longitude);
				cpoint.push(pointResult.coordinate.latitude);
			}else{
				cpoint.push(pointResult.longitude);
				cpoint.push(pointResult.latitude);
			}
			
			placeSearch.searchNearBy("", cpoint, 500, function(status, result) {
				if(status === "complete" && result.info === "OK") {
					successCallBack(result);
				}else if(status === "no_data"){
					placeSearch.setType(placePatternAll);
	            	placeSearch.searchNearBy("",cpoint,500,function(status_,result_){
	            		if (status_ === 'complete' && result_.info === 'OK') {
			                successCallBack(result_);
			            }else{
			            	cmp.notification.alert(cmp.i18n("Show.fails.noLocationError"),function(){
								cmp.href.back();
							},cmp.i18n("Attendance.message.warn"),cmp.i18n("Attendance.message.previousPage"));
			            }
	            	})
				}else{
					failCallBack(cmp.i18n("Show.message.state") + status + cmp.i18n("Show.message.coordinate") + cmp.toJSON(cpoint),result);
				}
	        });
	    });
	}//_.loadLocationListData
	
})();