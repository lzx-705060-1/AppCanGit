(function(global,factory){
	global.AmapComponent = factory();
})(this,function(){
	var helpers = {
		/**
		 * 初始化地图
		 */
		initMap : function(ctx,center){
			if(typeof AMap == 'undefined'){
				cmp.notification.alert(cmp.i18n("Attendance.message.loadingGpsError"),function(){
					cmp.href.back();
				},cmp.i18n("Attendance.message.warn"),cmp.i18n("Attendance.message.previousPage"));
				return;
			}
			var mapObj = new AMap.Map(ctx,{showBuildingBlock : true});
			
			//国际化
			var lang = cmp.language;
			mapObj.setLang(lang);
			
			//移除地图logo
			helpers.removeLogo();
			//工具条和比例尺
			/*
		    AMap.plugin(['AMap.ToolBar','AMap.Scale'],function(){
		        var toolBar = new AMap.ToolBar();
			    var scale = new AMap.Scale();
			    mapObj.addControl(toolBar);
			    mapObj.addControl(scale);
			});
			*/
			// 在map中添加3D楼块图层
			var buildings = new AMap.Buildings();
	        buildings.setMap(mapObj);
	        
	        if(center){
	        	mapObj.setCenter(center);
				var marker = new AMap.Marker({
					offset: new AMap.Pixel(-14, -34),
					content:"<div class='map-mark-content hollow'><span class='checkinicon icon-checkin-map'></span><div class='map-mark-pin'><span></span></div></div>",
				    position: center,
				    map:mapObj
				});
	        } 
			mapObj.setFitView();
			return mapObj;
		},
		/**
		 * 渲染当前位置
		 * @param {Object} center
		 * @param {Object} mapObj
		 */
		renderPosition : function(center,mapObj){
			var markers = mapObj.getAllOverlays('marker');
			if(!markers || markers.length == 0){
	        	mapObj.setCenter(center);
				var marker = new AMap.Marker({
					offset: new AMap.Pixel(-14, -34),
					content:"<div class='map-mark-content hollow'><span class='checkinicon icon-checkin-map'></span><div class='map-mark-pin'><span></span></div></div>",
				    position: center,
				    map:mapObj
				});
	        }
			mapObj.setFitView();
		},
		/**
		 * 移除高德地图logo
		 */
		removeLogo : function(){
			var amapLogo = document.querySelector(".amap-logo");
			amapLogo.parentNode.removeChild(amapLogo);
			var amapCopyright = document.querySelector(".amap-copyright");
			amapCopyright.parentNode.removeChild(amapCopyright);
		},
		
		throttle : function(fun){
			var lastTime;
			var lastPosition;
			return function(){
				var now = +new Date();
				if(!lastTime || (now - lastTime >= 5000)){
					lastTime = now;
					var ctx = this, args = arguments;
					var result = args[0];
					var currentPosition = {
						lng : result.longitude || result.coordinate.longitude,
						lat : result.latitude || result.coordinate.latitude
					}
					if(!lastPosition){
						lastPosition = currentPosition;
						fun.apply(ctx,args);
					}else if(helpers.getDistance(currentPosition,lastPosition) > 500){
	                    lastPosition = currentPosition;
						fun.apply(ctx,args);
					}
				}
			}
		},
		
		/**
		 * 获取当前位置
		 */
		getCurrentPosition : function(backFunc){
			if(cmp.platform.CMPShell){
				cmp.lbs.getCurrentPosition({
					mode : 2,
					success : helpers.throttle(function(result){
						var lngLat = [];
						if(result.coordinate){
							lngLat.push(result.coordinate.longitude);
							lngLat.push(result.coordinate.latitude);
						}else{
							lngLat.push(result.longitude);
							lngLat.push(result.latitude);
						}
						backFunc(lngLat);
					}),
					error : function(){
						cmp.notification.alert(cmp.i18n("Attendance.message.locationError"),function(){
							cmp.href.back();
						},cmp.i18n("Attendance.message.warn"),cmp.i18n("Attendance.message.previousPage"));
					}
				});
			}else{
				//先尝试从微信获取定位
				var locationX = cmp.storage.get("locationX",true);
				var locationY = cmp.storage.get("locationY",true);
				if(locationX && locationX != 'undefined' && locationY && locationY != 'undefined'){
					AMap.convertFrom([locationX,locationY],'gps',function(status,result){
						if(status === 'complete' && result.info === 'ok')
							backFunc([result.locations[0].M,result.locations[0].O]);
					})
					return;
				}

				//从高德地图api获取定位
				var amapContainer = "<div style='width: 0;height: 0;' id='cmp_amap_container'></div>";
                var oldAmapContainer = document.getElementById("cmp_amap_container");
                if(!oldAmapContainer){
                    cmp.append(document.body,amapContainer);
                }
                var mapObj = new AMap.Map("cmp_amap_container");
                var errorCounter = 0;
                mapObj.plugin('AMap.Geolocation', function(){
                    var geolocation = new AMap.Geolocation({
                        enableHighAccuracy: true,//是否使用高精度定位，默认:true
                        timeout: 10000         //超过10秒后停止定位，默认：无穷大
                    });
                    mapObj.addControl(geolocation);
                    geolocation.getCurrentPosition();
                    AMap.event.addListener(geolocation, 'complete', function(data){
                        var longitude = data.position.getLng();
                        var latitude = data.position.getLat();
                        backFunc([longitude,latitude]);
                        mapObj.destroy();
                    });
                    AMap.event.addListener(geolocation, 'error', function(error){
                    	errorCounter++;
                    	if(!AMap.UA.ios || errorCounter == 2){
                    		cmp.notification.alert(error.message);
                    		mapObj.destroy();
                    		return;
                    	}
						if(AMap.UA.ios){ 
				            var remoGeo = new RemoGeoLocation(); 
				            navigator.geolocation.getCurrentPosition = function(){
				                return remoGeo.getCurrentPosition.apply(remoGeo, arguments); 
				            }; 
				            navigator.geolocation.watchPosition = function(){ 
				               return remoGeo.watchPosition.apply(remoGeo, arguments);
				            };
				            geolocation.getCurrentPosition();
				        }
                    });
                });
			}
		},
		/**
		 * 合并
		 * @param {Object} base
		 */
		extend : function(base){
			var setFn = function(value, key) {
				base[key] = value;
			};
			for (var i = 1, ilen = arguments.length; i < ilen; i++) {
				helpers.each(arguments[i], setFn);
			}
			return base;
		},
		/**
		 * 遍历对象
		 * @param {Object} loopable
		 * @param {Object} callback
		 * @param {Object} self
		 * @param {Object} reverse
		 */
		each : function(loopable, callback, self, reverse) {
			var i, len;
			if (helpers.isArray(loopable)) {
				len = loopable.length;
				if (reverse) {
					for (i = len - 1; i >= 0; i--) {
						callback.call(self, loopable[i], i);
					}
				} else {
					for (i = 0; i < len; i++) {
						callback.call(self, loopable[i], i);
					}
				}
			} else if (typeof loopable === 'object') {
				var keys = Object.keys(loopable);
				len = keys.length;
				for (i = 0; i < len; i++) {
					callback.call(self, loopable[keys[i]], keys[i]);
				}
			}
		},
		/**
		 * 判断是否是数组
		 */
		isArray : function(obj){
			if(Array.isArray){
				return Array.isArray(obj);
			}else{
				return Object.prototype.toString.call(obj) === '[object Array]';
			}
		},
		/**
		 * 继承
		 */
		inherits : function(extensions){
			var me = this;
			var MapElement = (extensions && extensions.hasOwnProperty('constructor')) ? extensions.constructor : function() {
				return me.apply(this, arguments);
			};
			var Surrogate = function() {
				this.constructor = MapElement;
			};
			Surrogate.prototype = me.prototype;
			MapElement.prototype = new Surrogate();
	
			MapElement.extend = helpers.inherits;
	
			if (extensions) {
				helpers.extend(MapElement.prototype, extensions);
			}
	
			MapElement.__super__ = me.prototype;
	
			return MapElement;
		},
		/**
		 * 获取dom对象
		 * @param {Object} item
		 */
		acquireContext : function(item){
			var context;
			if(typeof item === 'string'){
				context = document.getElementById(item);
			}
			if(item instanceof HTMLElement){
				context = item;
			}
			return context;
		},
		/**
		 * 获取附近
		 * @param {Object} backFunc
		 */
		getNearByList : function(center,backFunc){
			if(typeof AMap == 'undefined'){
				cmp.notification.alert(cmp.i18n("Attendance.message.loadingGpsError"),function(){
					cmp.href.back();
				},cmp.i18n("Attendance.message.warn"),cmp.i18n("Attendance.message.previousPage"));
				return;
			}
			AMap.service(["AMap.PlaceSearch"],function(){
				var placePattern = "政府机构及社会团体|公司企业|商务住宅|地名地址信息|交通设施服务|道路附属设施";
		        var placePatternAll = "汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务|公司企业|道路附属设施|地名地址信息|公共设施";
				var placeSearch = new AMap.PlaceSearch({
					type : placePattern,
		            pageSize: 20,
		            pageIndex: 1
		        });
		        var radius = 200;
		        /**
		         * 获取附近
		         */
		        var findNear = function(pos,rds){
		        	if(rds >= 10000){
    				    cmp.notification.alert(cmp.i18n("Attendance.message.noLocation"),function(){
							cmp.href.back();
						},cmp.i18n("Attendance.message.warn"),cmp.i18n("Attendance.message.previousPage"));
		        		return;
		        	}
	        		placeSearch.searchNearBy("",pos,rds,function(status,result){
						if (status === 'complete' && result.info === 'OK') {
			                backFunc(result);
			            }else if(status === "no_data"){
			            	placeSearch.setType(placePatternAll);
			            	findNear(pos,2 * rds);
			            }
		        	});
		        }
		        
		        if(center){
		        	findNear(center,radius);
		        }else{
			        helpers.getCurrentPosition(function(pos){
			        	findNear(pos,radius);
		        	});
		        }
			});
		},
		/**
		 * 关键字搜索
		 * @param {Object} lngLat
		 * @param {Object} city
		 */
		placeSearch : function(lngLat,city,backFunc){
			AMap.service('AMap.Geocoder',function(){
			    geocoder = new AMap.Geocoder({
			        city : city
			    });
			    geocoder.getAddress(lngLat, function(status, result) {
				    if (status === 'complete' && result.info === 'OK') {
				    	console.log(result);
				    }
				});
			})
		},
		/**
		 * 两点间距离
		 * @param {Object} p1
		 * @param {Object} p2
		 */
		getDistance : function(p1,p2){
			var marker1 = new AMap.LngLat(p1.lng,p1.lat);
			var marker2 = new AMap.LngLat(p2.lng,p2.lat);
			return marker1.distance(marker2);
		},
		/**
		 * 根据映射属性过滤数据
		 */
		getMappedData : function(data,mapping){
			var results = [];
			helpers.each(data,function(item){
				var temp = {};
				for(var key in mapping){
					temp[key] = item[mapping[key]];
				}
				results.push(temp);
			});
			return results;
		},
		/**
		 * 判断是节点关系
		 */
		isChildOf : function(child, parent){
	        var parentNode;
	        if(child && parent) {
	            parentNode = child.parentNode;
	            while(parentNode) {
	                if(parent === parentNode) {
	                    return true;
	                }
	                parentNode = parentNode.parentNode;
	            }
	        }
	        return false;
    	},
    	/**
    	 * 将html字符串转为dom对象
    	 * @param {Object} html
    	 */
    	parseDom : function(html){
    		var dom = document.createElement("div");
    		dom.innerHTML = html;
    		return dom.childNodes;
    	}
	}
	/**
	 * 构造函数
	 * @param {Object} config
	 */
	function Component(itemId,config){
		if(itemId && Component.instances[itemId]){
			Component.instances[itemId].instance.update(config);
			return Component.instances[itemId];
		}
		var context = helpers.acquireContext(itemId);
		var controller = new Component.Controller(context,config);
		Component.instances[itemId] = controller;
		return controller;
	}
	Component.instances = {};
	Component.Controller = function(context,config){
		var me = this;
		me.context = context;
		config = config || {};
		me.config = config;
		me.initialize();
	}
	Component.Controller.prototype = {
		initialize : function(){
			var me = this;
			me.build();
			me.render();
		},
		build : function(){
			var me = this;
			helpers.extend(me.config,{
				context : me.context,
				controller : me
			});
			if(me.config.type == "amapShow"){
				me.instance = new Component.AmapShow(me.config);
			}else if(me.config.type == "amapList"){
				me.instance = new Component.AmapList(me.config);
			}else if(me.config.type == "amapLinkList"){
				me.instance = new Component.AmapLinkList(me.config);
			}else if(me.config.type == "amapQuery"){
				me.instance = new Component.AmapQuery(me.config);
			}
		},
		render : function(){
			var me = this;
			me.instance.render();
		},
		changeCenter : function(lngLat){
			var me = this;
			var mapObj = me.instance.map;
			var markers = mapObj.getAllOverlays('marker');
			if(markers && markers.length > 0){
				markers[0].setPosition(lngLat);
			}
			mapObj.setCenter(lngLat);
			mapObj.setFitView();
		},
		refresh : function(cfg){
			var me = this;
			if(me.instance.refresh && typeof me.instance.refresh == 'function'){
				me.instance.refresh(cfg);
			}
		}
	}
	Component.Element = function(configuration){
		helpers.extend(this,configuration);
	}
	Component.Element.extend = helpers.inherits;
	/**
	 * 地图展示
	 */
	Component.AmapShow = Component.Element.extend({
		render : function(){
			var me = this;
			var context = helpers.acquireContext(me.context);
			me.map = helpers.initMap(context,me.amapShow.center);
			if(me.amapShow && me.amapShow.center){
				if(me.amapShow.afterLoad && typeof me.amapShow.afterLoad == 'function'){
					me.amapShow.afterLoad.call(me);
				}
			}else{
				helpers.getCurrentPosition(function(lngLat){
					me.controller.center = lngLat;
					helpers.renderPosition(lngLat,me.map);
					if(me.amapShow && me.amapShow.afterLoad && typeof me.amapShow.afterLoad == 'function'){
						me.amapShow.afterLoad.call(me);
					}
				});
			}
		},
		changeCenter : function(lngLat){
			var me = this;
			var mapObj = me.map;
			var markers = mapObj.getAllOverlays('marker');
			if(markers && markers.length > 0){
				markers[0].setPosition(lngLat);
			}
			mapObj.setCenter(lngLat);
			mapObj.setFitView();
		},
		update : function(){
			
		}
	});
	
	/**
	 * 地图查询
	 */
	Component.AmapQuery = Component.Element.extend({
		render : function(){
			var me = this;
			//初始化地图
			var initMap = function(ctx,center){
				me.map = new AMap.Map(ctx,{showBuildingBlock : true});
				//移除地图logo
				helpers.removeLogo();
				//根据中心画点
				if(me.cfg.initData){
					me.drawMarkers([me.cfg.initData]);
					var trigMarker = me.markerArray[0];
					trigMarker.marker.emit('click');
					return;
				}
				helpers.getNearByList(center,function(results){
					//画点
					me.drawMarkers([results.poiList.pois[0]]);
					var trigMarker = me.markerArray[0];
					trigMarker.marker.emit('click');
				})
			}
			me.searchType = '购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务|公司企业|道路附属设施|地名地址信息|公共设施';
			//地图上的点集合
			me.markerArray = [];
			
			if(me.cfg.center){
				initMap(me.cfg.mapDom,me.cfg.center);
				//初始化查询框
				me.map.getCity(function(result){
					me.initQuery(me.cfg.queryDom,result.citycode);
					me.initMapEvent();
				});
			}else{
				helpers.getCurrentPosition(function(lngLat){
					initMap(me.cfg.mapDom,lngLat);
					//初始化查询框
					me.map.getCity(function(result){
						me.initQuery(me.cfg.queryDom,result.citycode);
						me.initMapEvent();
					});
				});
			}
		},
		refresh : function(cfg){
			var me = this;
			helpers.extend(me.cfg,cfg);
			me.drawCircle();
		},
		initMapEvent : function(){
			var me = this;
			var timeout;
			var pixel;
			me.map.on('touchstart',function(event){
				pixel = event.pixel;
				timeout = setTimeout(function(){
					cmp.notification.confirm("确定开始编辑自定义位置？",function(index){
						if(index == 1){
							//清除上一次的结果,清空点数组
		           			me.map.clearMap();
		           			me.markerArray = [];
		           								
							var thisMarker = {
								name : "请输入地址名称",
								location : {
									lng : event.lnglat.lng,
									lat : event.lnglat.lat
								}
							}
							me.drawMarkers([thisMarker],true);
							me.markerArray[0].marker.emit('click');
						}
					});
				},2000);
			});
			me.map.on('touchmove',function(event){
				if(event.pixel.x == pixel.x && event.pixel.y == pixel.y)
					return;
				clearTimeout(timeout);
			});
			me.map.on('touchend',function(event){
				clearTimeout(timeout);
			});
		},
		initQuery : function(queryDom,city){
			var me = this;
			var placeSearch;
			//如果没有查询框则不初始化查询
			if(!queryDom){
				return;
			}					
			queryDom.addEventListener("click",function(){
				if(me.addressQuery){
					me.addressQuery.open();
					return;
				}
				me.addressQuery = new AddressQuery({
					city : city,
					callback : function(data){
						queryDom.querySelector("input").value = data.name;
						queryDom.querySelector("input").classList.add('pandleft0');
						queryDom.querySelector('.common-query-placeholder').classList.add('cmp-hidden');
						if(data.location){
							//清除上一次的结果,清空点数组
		           			me.map.clearMap();
		           			me.markerArray = [];
							me.drawMarkers([data]);
							var trigMarker = me.markerArray[0];
							trigMarker.marker.emit('click');
							return;
						}
						if(placeSearch){
							placeSearch.search(data.name,function(status, result){
				           		if (status === 'complete' && result.info === 'OK') {
				           			//清除上一次的结果,清空点数组
				           			me.map.clearMap();
				           			me.markerArray = [];
				           			
				           			//遍历查询结果把地点画到地图上
									var point = result.poiList.pois[0];
									me.drawMarkers([point]);
									var trigMarker = me.markerArray[0];
									trigMarker.marker.emit('click');
							    }
				           	});
						}else{
							AMap.plugin(['AMap.PlaceSearch'],function(){
							    placeSearch = new AMap.PlaceSearch({
									pageSize: 5,
									pageIndex: 1,
									city:city,
									type:me.searchType
							    });
					           	placeSearch.search(data.name,function(status, result){
					           		if (status === 'complete' && result.info === 'OK') {
					           			//清除上一次的结果,清空点数组
					           			me.map.clearMap();
					           			me.markerArray = [];
					           			
					           			//遍历查询结果把地点画到地图上
										var point = result.poiList.pois[0];
										me.drawMarkers([point]);
										var trigMarker = me.markerArray[0];
										trigMarker.marker.emit('click');
								    }
					           	});
							});
						}
					}
				});
			});
		},
		/**
		 * 弹出信息窗体
		 */
		openInfoWin : function(){
			var me = this;
			var marker = me.activeMarker;
			if(!marker) return;
			//信息窗体
			if(!me.infoWin){
				me.infoWin = new AMap.InfoWindow({
					offset: new AMap.Pixel(2, -30)
				});
			}
			//弹出地址信息
			var extData = marker.getExtData();
			var tipInfo  = 	'<div class="infoContainer">' +
								'<div class="infoTitle">' + extData.name + '</div>'+
							'</div>';
			me.infoWin.setContent(tipInfo);
			me.infoWin.open(me.map, marker.getPosition());
		},
		/**
		 * 画圆
		 */
		drawCircle : function(){
			var me = this;
			var marker = me.activeMarker;
			if(!marker) return;
			/**
			 * 根据传入的点对象获取自定义的点对象CustomMarker
			 * @param {Object} marker
			 */
			var getCustomMarker = function(marker){
			 	for(var i = 0; i < me.markerArray.length; i ++){
			 		if(me.markerArray[i].marker == marker){
			 			return me.markerArray[i];
			 		}
			 	}
			}
			var removeCircle = function(circle){
				for(var i = 0; i < me.markerArray.length; i ++){
					if(me.markerArray[i].circle == circle){
						me.markerArray[i].circle.show();
					}else{
						if(me.markerArray[i].circle) me.markerArray[i].circle.hide();
					}
				}
			}
			//画自己的圆
			var centerLnglat = marker.getPosition();
			var centerRange = me.cfg.attendRange;
			
			var cusMarker = getCustomMarker(marker) || {};
			if(cusMarker.circle){
				cusMarker.circle.setRadius(centerRange);
		    	removeCircle(cusMarker.circle);
				return;
			}
			var circle = new AMap.Circle({
		        center: centerLnglat,//圆心
		        radius: centerRange, //半径
		        strokeColor: "#FCDCA3", //线颜色
		        strokeOpacity: 1, //线透明度
		        strokeWeight: 1, //线粗细度
		        fillColor: "#F8DCB2", //填充颜色
		        fillOpacity: 0.4//填充透明度
		    });
		    circle.setMap(me.map);
			cusMarker.circle = circle;
			//去掉其他的圆
		    removeCircle(circle);
		},
		/**
		 * 画点
		 * @param {Object} points
		 */
		drawMarkers : function(points,isCustomse){
			var me = this;
			//循环记录画点
			for(var i = 0; i < points.length; i++){
				var lng = points[i].location.lng;
				var lat = points[i].location.lat;
				var index = i + 1;
				me.map.setCenter([lng,lat]);
				var marker = new AMap.Marker({
					content:'<div class="markerContainer"><div class="marker"></div></div>',
				    position: [lng,lat],
				    extData : {
				    	name : points[i].name
				    },
				    map:me.map
				});
				//绑定点的点击事件
				marker.on('click', function(e){
					var extData = this.getExtData();
					var lngLat = this.getPosition();
					//设置当前激活的点
					me.activeMarker = this;
					//弹出信息窗体
					//me.openInfoWin();
					//在点周围画圆
					me.drawCircle();
					//回调选中事件
					if(me.cfg.callBack && typeof me.cfg.callBack == 'function'){
						me.cfg.callBack.apply(me,[{
							name : extData.name,
							address : extData.address,
							tel : extData.tel,
							longitude : lngLat.lng,
							latitude : lngLat.lat,
							isCustomse : isCustomse
						}]);
					}
				});
				me.map.setFitView();
				me.map.panBy(0,-150);
				//保存点对象
				var customMarker = {};
				customMarker.marker = marker;
				me.markerArray.push(customMarker);
			}
		}
	});
	
	/**
	 * 地圖列表聯動
	 */
	Component.AmapLinkList = Component.Element.extend({
		render : function(){
			var me = this;
			//初始化地圖
			var mapObj = helpers.initMap(me.context);
			me.map = mapObj;
			//初始化標記點
			me.initMarks();
			//列表點擊事件
			me.bindDomEvent();
		},
		update : function(config){
			var me = this;
			helpers.extend(me,config);
			me.initMarks();
			me.bindDomEvent();
		},
		initMarks : function(){
			var me = this;
			//获取映射数据
		    var mappingData = helpers.getMappedData(me.amapLinkList.data,me.amapLinkList.dataMapping);
		    me.data = me.data || [];
		    var baseIndex = me.data.length;
		    var counter = me.amapLinkList.counter;
		    me.data = me.data.concat(mappingData);
			var result = {};
			var marker,lngLat;
			helpers.each(mappingData,function(item,index){
				if(item.longitude && item.latitude){
					lngLat = new AMap.LngLat(item.longitude,item.latitude);
					var htmlDomH = document.getElementById(item.id).clientHeight;
					var markerHtml = "<div class='map-mark-content'><span class='checkinicon icon-checkin-map'></span><div class='map-mark-pin'><span>" + (counter - index) + "</span></div></div>";
					var markerDom = helpers.parseDom(markerHtml);
					marker = new AMap.Marker({
						offset: new AMap.Pixel(-14, -34),
						content: markerDom[0],
						extData : {
							id : item.id,
							context : me,
							x : 0,
							y : (baseIndex + index) * (htmlDomH + 10) * -1
						},
					    position : lngLat,
					    map : me.map
					});
					//绑定marker点击事件
					marker.on("click",function(){
						//获取当前组件上下文
						var context = this.getExtData().context;
						var handlerDom = document.getElementById(this.getExtData().id);
						//将之前选中的列表记录样式更改为一般样式
						if(context.selectedId){
							document.getElementById(context.selectedId).classList.remove("active");
						}
						//设置当前选中的列表Id
						context.selectedId = this.getExtData().id;
						//设置当前选中的列表样式
						handlerDom.classList.add("active");
						
						//将之前选中的点样式更改为一般样式
						if(context.activeMarker){
							context.activeMarker.getContent().classList.remove("cmp-active");
						}
						//设置当前选中的点对象
						context.activeMarker = this;
						//设置当前选中的点对象样式
						this.getContent().classList.add("cmp-active");
						
						//将listview滚动到当前选中的列表记录
						var listView = context.amapLinkList.listView;
						listView.scrollTo(this.getExtData().x,this.getExtData().y,500);
					});
					result[item.id] = marker;
					me.map.setFitView();
					me.map.panTo(lngLat);
					me.map.panBy(0,-150);
				}
			});
			me.markers = me.markers || {};
			helpers.extend(me.markers,result);
		},
		bindDomEvent : function(){
			var me = this;
			var scroller =  me.amapLinkList.listView._cmpScroll;
			scroller.addEventListener("tap",function(e){
				var liArry = this.querySelectorAll("li");
				for(var i = 0;i < liArry.length;i++){
					if(helpers.isChildOf(e.target,liArry[i])){
						var currentMarker = me.markers[liArry[i].id];
						if(!currentMarker){
							cmp.notification.toast(cmp.i18n("Attendance.message.attendFromPc"),"center");
							return;
						} 
						//地图定位到当前点
						me.map.panTo(currentMarker.getPosition());
						me.map.panBy(0,-150);
						//设置之前选中的点样式为默认样式
						if(me.activeMarker){
							me.activeMarker.getContent().classList.remove("cmp-active");
						}
						//设置当前选中的点样式为选中样式
						currentMarker.getContent().classList.add("cmp-active");
						currentMarker.setAnimation('AMAP_ANIMATION_DROP');
						currentMarker.setTop(true);
						//保存当前点
						me.activeMarker = currentMarker;
						
						//将之前选中的列表记录样式改为一般样式
						if(me.selectedId){
							document.getElementById(me.selectedId).classList.remove("active");
						}
						//将当前选中的列表记录样式改为选中的样式
						liArry[i].classList.add("active");
						//保存当前的列表记录
						me.selectedId = liArry[i].id;
						break;
					}
				}
			},false);
		}
	});
	
	/**
	 * 暂时在这里初始化一个简单的地址查询组件
	 */
	function AddressQuery(options){
		var me = this;
		me.options = options;
		me.initDom();
		me.backButton();
		me.bindEvent();
	}
	AddressQuery.prototype = {
		backButton : function(){
			var me = this;
			me.queryContainer.querySelector(".cancel").addEventListener("click",function(){
				me.close();
			});
			cmp.backbutton();
        	cmp.backbutton.push(function(){
        		me.close();
        	});
		},
		initDom : function(){
			//初始化容器
			var me = this;
			var queryContainer = document.createElement("div");
			queryContainer.classList.add("Animated-Container");
			queryContainer.classList.add("right-go");
			queryContainer.classList.add("animated");
			queryContainer.innerHTML = queryHeader + queryContent;
			var Edit_content = queryContainer.querySelector('.create-edit-content');
			var Edit_header =  queryContainer.querySelector('.create-edit-header');
			Edit_content.style.height = window.innerHeight - Edit_header.offsetHeight +"px";
			document.getElementsByTagName('body')[0].appendChild(queryContainer);
			cmp('.cmp-search input.address-query-input').input();
			queryContainer.classList.add("cmp-active");
			
			me.queryContainer = queryContainer;
			me.queryInput = me.queryContainer.querySelector(".address-query-input");
			me.dataContainer = me.queryContainer.querySelector(".list-contaner-ul");
			
			me.queryInput.focus();
			//i18n
			me.queryInput.setAttribute("placeholder",cmp.i18n("Attendance.label.search"));
			cmp.i18n.detect();
		},
		bindEvent : function(){
			var me = this;
			//查询框事件			
			me.queryInput.addEventListener("input",function(){
				var inputValue = this.value;
				if(!inputValue){
					me.dataContainer.innerHTML = "";
					return;
				}
				if(me.autocomplete){
					me.autocomplete.search(inputValue,function(status, result){
					    if(status === 'complete' && result.info === 'OK'){
					    	renderData(result.tips);
					    }else if(status === 'no_data'){
					    	console.log("no_data");
					    }
					});
				}else{
					AMap.plugin(['AMap.Autocomplete','AMap.PlaceSearch'],function(){
						var autoOptions = {
						    city: me.options.city
						};
						me.autocomplete= new AMap.Autocomplete(autoOptions);
						me.autocomplete.search(inputValue,function(status, result){
						    if(status === 'complete' && result.info === 'OK'){
						    	renderData(result.tips);
						    }else if(status === 'no_data'){
						    	console.log("no_data");
						    }
						});
					});
				}
			});
			//渲染数据
			var renderData = function(result){
				var html = cmp.tpl(addressTpl,result);
				me.dataContainer.innerHTML = html;
			}
			//列表选中事件
			cmp(".list-contaner-ul").on("tap","li",function(){
				var info = this.attributes["data-info"].nodeValue;
				info = cmp.parseJSON(info);
				if(me.options.callback && typeof me.options.callback == 'function'){
					me.options.callback(info);
				}
				me.close();
			});
			//查询框清空事件
			cmp(".cmp-search").on("tap",".cmp-icon-clear",function(){
				me.dataContainer.innerHTML = "";
			});
		},
		open : function(){
			var me = this;
			me.queryContainer.classList.add("cmp-active");
			me.queryInput.focus();
			
			cmp.backbutton();
        	cmp.backbutton.push(function(){
        		me.close();
        	});
		},
		close : function(){
			var me = this;
			me.queryContainer.classList.remove("cmp-active");
			cmp.backbutton.pop();
		}
	}
	var queryHeader = '<header class="cmp-bar cmp-bar-nav after-line set-Edit-header create-edit-header">'+
						'<div class="">'+
							'<div class="cmp-content-title-search create-edit-search">'+
								'<div class="cmp-input-row cmp-search " style="width: 100%;">'+
									'<form id="cmp-search-input" onsubmit="return false;"></form>'+
									'<input placeholder="" type="search" name="search" form="cmp-search-input" class="btn cmp-input-clear cmp-v5-search-textBtn address-query-input" >'+
								'</div>'+
							'</div>' +
							'<div class="cancel"><i18n key="Attendance.message.cancel"></i18n></div>'+
						'</div>'+
					'</header>';
	
	var queryContent = '<div class="position_relative create-edit-content">'+
					   		'<div class="list-container cmp-scroll">'+
					   			'<ul class="list-contaner-ul cmp-table-view cmp-table-view-striped cmp-table-view-condensed edit-search-ul"><ul>'+
					   		'</div>'+
					   '</div>';
	
	var addressTpl = '<% for(var i = 0,len = this.length;i < len; i++){ %>'+
	        		 '<% var obj = this[i];%>'+
					 '<li data-info=\'<%=cmp.toJSON(obj)%>\' class="cmp-table-view-cell">'+
						'<div class="cmp-table">'+
							'<div class="cmp-table-cell cmp-col-xs-10">' +
								'<h4 class="cmp-ellipsis-2"><%=obj.name%></h4>'+
								'<p class="cmp-h6 cmp-ellipsis"><%=obj.district%></p>'+
							'</div>'+
						'</div>'+
					 '</li>'+
					 '<%}%>';





	Component.initMap = helpers.initMap;
	Component.getNearByList = helpers.getNearByList;
	Component.getCurrentPosition = helpers.getCurrentPosition;
	Component.getDistance = helpers.getDistance;
	return Component;
});
