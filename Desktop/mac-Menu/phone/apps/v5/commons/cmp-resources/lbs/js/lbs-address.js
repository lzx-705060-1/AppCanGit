/**
 * LBS地图定位组件
 * author:het
 * create date:2016-12-6
 */
; ~function (window, document) {
	/**
	 ***********调用规则********************
	 //创建定位组件对象
	 var lbs = new LBSAddress(options);//注：opstions详见下方注释"options参数"
	 ***********options参数*****************
	 {
	 	title:{//顶部title的自定义（*注：示例就是默认值）
	 	  left   : {enable:true, text:'取消',click:function(){return true;如果return true则组件随后帮你关闭窗体} },
	 	  right  : {enable:true, text:'确定',click:function(){return true;如果return true则组件随后帮你关闭窗体} },
	 	  center : {enable:true, text:'选择地址',click:function(){} }
	 	},
		shownodata : true, //是否显示“不显示位置”功能，默认true
		coordinate : {longitude:'经度',latitude:'纬度'}, //地图上默认的标注点，位置列表也以此中心取周围500米的数据；如果不传则由当前组件自动获取当前位置
		selectcallback : function(selectdata){name,cityname,id,location:{lng,lat}}, //触屏选择地址列表时触发，会返回地址列表的名称、所在城市名、经纬度以及高德定位的UUID
		selectdata : {id:""}, //组件根据uuid加载
		//位置信息搜索默认="商务住宅|地名地址信息|道路附属设施" ,组件支持20种搜索类型：汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务|公司企业|道路附属设施|地名地址信息|公共设施
	}
	 ***********接口方法********************
	 .open();  //打开页面，如果是首次调用则会初始化页面及事件，后续再此调用时不会再做初始化，只会将页面display
	 .close(); //关闭页面，此关闭只是隐藏页面，并不会做销毁操作
	 .getSelectdata(); //返回选中的数据：{name,cityname,uuid,lng,lat}，如果为“不显示位置”则返回undefined
	 .setSelectdata({id:"",...}); //设置选择的数据,uuid必备，其余的可以不传，组件会自动取所有信息
	 */
	function LBSAddress(options) {
		if (!options) {
			options = {};
		}
		options.title = getTitle(options);
		this.options = options;
		//初始化
		this.init();
		//加载数据
		this.initData();
		//绑定页面事件
		this.initPageEvent();
		//展示
		this.open();
	}

	LBSAddress.prototype = {
		/**
		 * 初始化dom
		 */
		init : function(){
			var thisObj = this;
			var container = thisObj.container;
			var options = thisObj.options;
			
			//初始化容器
			var container = document.createElement("div");
			container.classList.add("Animated-Container");
			container.classList.add("right-go");
			container.classList.add("animated");
			container.innerHTML = cmp.tpl(_contentTpl, options);
			document.getElementsByTagName('body')[0].appendChild(container);
			thisObj.container = container;
			cmp('.cmp-search input.address-query-input').input();
			document.querySelector('input.address-query-input').setAttribute("placeholder",cmp.i18n("Attendance.label.search"));
			
			//中间大主容器计算高度
			var cmp_content = container.querySelector('.cmp-content');
			var header = container.querySelector('header');
			var footer = container.querySelector('footer');
			var windowH = window.innerHeight;
			var headerH, footerH;
			headerH = 0;
			footerH = !footer ? 0 : footer.offsetHeight;
			if (cmp_content) {
				cmp_content.style.height = windowH - headerH - footerH + "px";
			}
			/**选择签到地址页**/
			var address_container = container.querySelector(".address-container");
			if (address_container) {
				var address_map = container.querySelector('.address-map');
				var address_listView = container.querySelectorAll('.address-listView');
				for(var i = 0;i < address_listView.length;i++){
					address_listView[i].style.height = cmp_content.offsetHeight - address_map.offsetHeight + "px";
				}
			}
		},
		/**
		 * 初始化地图和地址列表
		 */
		initData : function(){
			var thisObj = this;
			var container = thisObj.container;
			var options = thisObj.options;
			//初始化地图
			if (options.coordinate) {
				thisObj.map = initMap(options.coordinate, container);
				//加载listview
				thisObj.initAddressList();
			} else {
				getCurrentLocation(function (result) {
					options.coordinate = result;
					thisObj.map = initMap(options.coordinate, container);
					//加载listview
					thisObj.initAddressList();
				});
			}
		},
		initPageEvent : function() {
			var _this = this;
			var container = _this.container;
			//地址列表点击事件
			cmp(container).on("tap", ".cmp-table-view-cell", function () {
				_this.selectData = newSelectdata(this);
				if(_this.selectLiDom){
					_this.selectLiDom.classList.remove("cmp-selected");
				}
				_this.selectLiDom = this;
				//将地图定位到当前选中的记录
				locateMap(_this,[this.getAttribute("lng"),this.getAttribute("lat")]);
				if(_this.options.selectcallback){
					_this.close();
					_this.options.selectcallback(_this.selectData);
				}
				//选中返回
				if (_this.options.title.right.click) {//自定义事件回调
					if(!_this.selectData){
						cmp.notification.toast(cmp.i18n("commons.message.selectAddress"), "center",2000);
						return;
					}
					var result = _this.options.title.right.click(_this.selectData);
					if (result == true) {
						_this.close();
					}
				} else {//默认方法
					_this.close();
				}
			});
			//搜索事件
			cmp(container).on("keyup",".common-query-header input",function(e){
				var inputValue = this.value;
				if(e.keyCode != 13) return;
				inputValue = inputValue.replace(/(^\s+)|(\s+$)/g,"");
				initListView("#address_type_all .lbs-address-scroll",{
					place : inputValue,
					coordinate : _this.options.coordinate,
					pattern : LBSAddress.PATTERN.ALL
				});
				
				container.querySelector(".cmp-control-item.cmp-active").classList.remove("cmp-active");
				container.querySelector("#address_handle_all").classList.add("cmp-active");
				
				container.querySelector(".cmp-control-content.cmp-active").classList.remove("cmp-active");
				container.querySelector("#address_type_all").classList.add("cmp-active");
				
				this.blur();
			});
			cmp('.common-query-header .cmp-search input').input();
			//清除搜索内容按钮
			cmp(container).on("tap",".common-query-header .cmp-search span.cmp-icon-clear",function(){
				initListView("#address_type_all .lbs-address-scroll",{
					place : "",
					coordinate : _this.options.coordinate,
					pattern : LBSAddress.PATTERN.ALL
				});
				this.blur();
			});
		},
		open: function () {
			var _this = this;
			document.title = cmp.i18n("commons.choose.address");
			cmp.backbutton();
			cmp.backbutton.push(function(){_this.close();});
			_this.container.classList.add('cmp-active');
		},
		close: function () {
			var _this = this;
			document.title = cmp.i18n("commons.attendance.attend");
			cmp.backbutton.pop();
			_this.container.classList.remove('cmp-active');
		},
		initAddressList: function () {
			var _this = this;
			//初始化tab页面listview
			initListView("#address_type_pub .lbs-address-scroll",{
				coordinate : _this.options.coordinate,
				pattern : LBSAddress.PATTERN.PUB
			});
			initListView("#address_type_company .lbs-address-scroll",{
				coordinate : _this.options.coordinate,
				pattern : LBSAddress.PATTERN.COMPANY
			});
			initListView("#address_type_business .lbs-address-scroll",{
				coordinate : _this.options.coordinate,
				pattern : LBSAddress.PATTERN.BUSINESS
			});
			initListView("#address_type_all .lbs-address-scroll",{
				coordinate : _this.options.coordinate,
				pattern : LBSAddress.PATTERN.ALL
			});
		}
	}
	
	LBSAddress.PATTERN = {
		ALL : "汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务|公司企业|道路附属设施|地名地址信息|公共设施",
		PUB : "政府机构及社会团体|科教文化服务|交通设施服务|道路附属设施|地名地址信息|公共设施",
		BUSINESS : "汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅",
		COMPANY : "金融保险服务|公司企业"
	}
	
	/**
	 * 初始化listview
	 * @param {Object} selector
	 * @param {Object} params
	 */
	var initListView = function(selector,params){
		cmp.listView(selector, {
			config: {
				pageSize: 20,
				isClear : true,
				params : params,
				dataFunc: getListData,
				renderFunc: function (result, isRefresh) {
					var container = document.querySelector(selector);
					var table = container.querySelector('.cmp-table-view');
					var html = cmp.tpl(addressTpl, result);
					if (isRefresh) {//是否刷新操作，刷新操作 直接覆盖数据
						table.innerHTML = html;
					} else {
						cmp.append(table, html);
					}
					cmp.RefreshHeader();
				}
			},
			up: {
				contentdown: cmp.i18n("commons.page.action.loadMore"),//可选，在上拉可刷新状态时，上拉刷新控件上显示的标题内容
				contentrefresh: cmp.i18n("commons.page.state.refreshing"),//可选，正在加载状态时，上拉加载控件上显示的标题内容
				contentnomore: cmp.i18n("commons.page.state.noMore")//可选，请求完毕若没有更多数据时显示的提醒内容；
			}
		});
	}	
	/**获取listview数据 */
	function getListData(param, options) {
		var pageNo = param["pageNo"];
		var pageSize = param["pageSize"];
		var coordinate = param["coordinate"];
		var pattern = param["pattern"];
		var place = param["place"] || "";
		var result = {};
		if(LBSAddress.placeSearch){
			LBSAddress.placeSearch.setType(pattern);
			LBSAddress.placeSearch.setPageIndex(pageNo);
			LBSAddress.placeSearch.setPageSize(pageSize);
			var pos = [coordinate.longitude, coordinate.latitude];
			var rds = 500;
			LBSAddress.placeSearch.searchNearBy(place,pos,rds, function (status,res) {
				if (status === "complete" && res.info === "OK") {
					result.data = {};
					result.data.datalist = res.poiList.pois;
					result.total = res.poiList.count;
					options.success(result);
				}else if(status === "no_data"){
					options.success({
						data : [],
						total : 0
					});
			    }
			});
		}else{
			AMap.service(["AMap.PlaceSearch"], function () {
				LBSAddress.placeSearch = new AMap.PlaceSearch({
					type: pattern,
					pageSize: pageSize,
					pageIndex: pageNo,
					extensions: "all"
				});		
				var pos = [coordinate.longitude, coordinate.latitude];
				var rds = 500;
				LBSAddress.placeSearch.searchNearBy(place,pos,rds, function (status,res) {
					if (status === "complete" && res.info === "OK") {
						result.data = {};
						result.data.datalist = res.poiList.pois;
						result.total = res.poiList.count;
						options.success(result);
					}else if(status === "no_data"){
						options.success({
							data : [],
							total : 0
						});
				    }
				});
			});
		}

	};

	function clearAddressList(container) {
		container.querySelector('.cmp-table-view').innerHTML = "";
	}

	function locateMap(context,lngLat){
		var mapObj = context.map;
		var markers = mapObj.getAllOverlays('marker');
		if(markers && markers.length > 0){
			markers[0].setPosition(lngLat);
		}
		mapObj.setCenter(lngLat);
		mapObj.setFitView();
	}

	function newSelectdata(dom,obj) {
		var selectdata;
		if(dom != undefined && dom.getAttribute){
			var uuid = dom.getAttribute("uuid");
			if (uuid != undefined) {
				selectdata = {};
				selectdata.id = uuid;
				selectdata.name = dom.getAttribute("name");
				selectdata.cityname = dom.getAttribute("cityname");
				selectdata.location = {lng:dom.getAttribute("lng"),lat:dom.getAttribute("lat")};
			}
		}else if(obj != null){
			selectdata = obj;
		}
		return selectdata;
	}

	/**获取当前的位置 */
	function getCurrentLocation(callback,fail) {
		// 获取当前的坐标定位
		cmp.lbs.getCurrentPosition({
			success : function(result) {
				if(callback){
					callback(result);
				}
			},
			error : function(result) {
				if(fail){
					fail(result);
				}else{
					cmp.notification.alert(cmp.i18n("commons.place.failed"));
				}
			}
		});
	}

	/**地址列表回到顶部*/
	function toAddressTop(container){
		cmp.listView(".lbs-address-scroll").scrollTo(0,0);
	}

	/**初始化地图*/
	function initMap(coordinate,container) {
		var map = new AMap.Map(container.querySelector(".address-map-container"), {
			center: [coordinate.longitude, coordinate.latitude]
		});
		
		//国际化
		var lang = cmp.language;
		map.setLang(lang);
		
		var marker = new AMap.Marker({
			offset: new AMap.Pixel(-14, -34),
			content:"<div class='map-mark-content hollow'><span class='checkinicon icon-checkin-map'></span><div class='map-mark-pin'><span></span></div></div>",
			map: map,
			position: [coordinate.longitude, coordinate.latitude]
		});
		map.setFitView(); //地图自适应到最合适的比例
		return map;
	}

	/**获取顶部标题的初始化信息 */
	function getTitle(options) {
		var title = {
			left: { enable: true, text: cmp.i18n("commons.label.cancel"), click: null },
			right: { enable: true, text: cmp.i18n("commons.label.ok"), click: null },
			center: { enable: true, text: cmp.i18n("commons.choose.address1"), click: null }
		};
		if (options && options.title) {
			if (options.title.left) {
				if (options.title.left.enable != undefined) {
					title.left.enable = options.title.left.enable;
				}
				if (options.title.left.text) {
					title.left.text = options.title.left.text;
				}
				if (options.title.left.click && (typeof options.title.left.click === 'function' || options.title.left.click == null)) {
					title.left.click = options.title.left.click;
				}
			}
			if (options.title.right) {
				if (options.title.right.enable != undefined) {
					title.right.enable = options.title.right.enable;
				}
				if (options.title.right.text) {
					title.right.text = options.title.right.text;
				}
				if (options.title.right.click && (typeof options.title.right.click === 'function' || options.title.right.click == null)) {
					title.right.click = options.title.right.click;
				}
			}
			if (options.title.center) {
				if (options.title.center.enable != undefined) {
					title.center.enable = options.title.center.enable;
				}
				if (options.title.center.text) {
					title.center.text = options.title.center.text;
				}
				if (options.title.center.click && (typeof options.title.center.click === 'function' || options.title.center.click == null)) {
					title.center.click = options.title.center.click;
				}
			}
		}
		return title;
	}

	/**
	 * 整个正文模板
	 */
	var _contentTpl =
		'<div class="address-container cmp-content position_relative">' +
			'<div class="common-query-header">'+
				'<div class="cmp-input-row cmp-search">'+
					'<form id="cmp-search-input" onsubmit="return false;"></form>'+
					'<input placeholder="" type="search" name="search" form="cmp-search-input" class="btn cmp-input-clear cmp-v5-search-textBtn address-query-input">'+
				'</div>'+
			'</div>'+
		'    <div class="position_relative address-map">' +
		'        <div class="address-map-container" style="height:250px;"></div>' +
		'    </div>' +
		'    <div class="cmp-segmented-control cmp-segmented-control-inverted">' +
		'		<a class="cmp-control-item  cmp-active" id="address_handle_all" href="#address_type_all">' + cmp.i18n("commons.label.all") + '</a>' +
		'		<a class="cmp-control-item" href="#address_type_pub">' + cmp.i18n("commons.label.pub") + '</a>' +
		'		<a class="cmp-control-item" href="#address_type_company">' + cmp.i18n("commons.label.company") + '</a>' +
		'		<a class="cmp-control-item" href="#address_type_business">' + cmp.i18n("commons.label.business") + '</a>' +
		'	 </div>'+
		'    <div id="address_type_pub" class="cmp-control-content">' +
		'    	<div class="position_relative address-listView" >' +
		'        	<div class="lbs-address-scroll cmp-scroll-wrapper">' +
		'            	<div class="cmp-scroll">' +
		'                	<ul class="cmp-table-view cmp-table-view-radio cmp-table-view-striped cmp-table-view-condensed"></ul>' +
		'            	</div>' +
		'        	</div>' +
		'    	</div>' +
		'	 </div>' +
		'    <div id="address_type_company" class="cmp-control-content">' +
		'    	<div class="position_relative address-listView" >' +
		'        	<div class="lbs-address-scroll cmp-scroll-wrapper">' +
		'            	<div class="cmp-scroll">' +
		'                	<ul class="cmp-table-view cmp-table-view-radio cmp-table-view-striped cmp-table-view-condensed"></ul>' +
		'            	</div>' +
		'        	</div>' +
		'    	</div>' +
		'	 </div>' +
		'    <div id="address_type_business" class="cmp-control-content">' +
		'    	<div class="position_relative address-listView" >' +
		'        	<div class="lbs-address-scroll cmp-scroll-wrapper">' +
		'            	<div class="cmp-scroll">' +
		'                	<ul class="cmp-table-view cmp-table-view-radio cmp-table-view-striped cmp-table-view-condensed"></ul>' +
		'            	</div>' +
		'        	</div>' +
		'    	</div>' +
		'	 </div>' +
		'    <div id="address_type_all" class="cmp-control-content cmp-active">' +
		'    	<div class="position_relative address-listView" >' +
		'        	<div class="lbs-address-scroll cmp-scroll-wrapper">' +
		'            	<div class="cmp-scroll">' +
		'                	<ul class="cmp-table-view cmp-table-view-radio cmp-table-view-striped cmp-table-view-condensed"></ul>' +
		'            	</div>' +
		'        	</div>' +
		'    	</div>' +
		'	 </div>' +
		'</div>';

	/**下方位置列表模板*/
	var addressTpl =
		'<%if(this.shownodata == true){%>' +
		'<li class="cmp-table-view-cell <%if(this.selectdata == undefined){%> cmp-selected  <%}%>" >' +
		'    <a class="cmp-navigate-right">' +
		'        <div class="cmp-table">' +
		'            <div class="cmp-table-cell cmp-col-xs-10">' +
		'                <span class="cmp-ellipsis" >'+cmp.i18n("commons.place.notShow")+'</span>' +
		'                <p class="cmp-h6 cmp-ellipsis" ></p>' +
		'            </div>' +
		'        </div>' +
		'    </a>' +
		'</li>' +
		'<%}%>' +
		'<% if(this.selectdata != undefined){ %>' +
		'<% var selectedObj = this.selectdata; %>' +
		'<li class="cmp-table-view-cell cmp-selected" name="<%=selectedObj.name%>" cityname="<%=selectedObj.cityname%>" uuid="<%=selectedObj.id%>" lng="<%=selectedObj.location.lng%>" lat="<%=selectedObj.location.lat%>">' +
		'    <a class="cmp-navigate-right">' +
		'        <div class="cmp-table">' +
		'            <div class="cmp-table-cell cmp-col-xs-10">' +
		'                <span class="cmp-ellipsis" ><%=selectedObj.name %></span>' +
		'                <p class="cmp-h6 cmp-ellipsis" ><%=selectedObj.address %></p>' +
		'            </div>' +
		'        </div>' +
		'    </a>' +
		'</li>' +
		'<%	}%>' +
		'<% for(var i = 0,len = this.datalist.length;i < len; i++){ %>' +
		'<% var obj = this.datalist[i]; %>' +
		'<% if(this.selectdata == undefined || this.selectdata.id != obj.id){ %>' + //判断：如果当前地址已经被勾选了，则勾选的肯定是放第一行的，所以在此就排除掉
		'<li class="cmp-table-view-cell" name="<%=obj.name%>" cityname="<%=obj.cityname%>" uuid="<%=obj.id%>" lng="<%=obj.location.lng%>" lat="<%=obj.location.lat%>">' +
		'    <a class="cmp-navigate-right">' +
		'        <div class="cmp-table">' +
		'            <div class="cmp-table-cell cmp-col-xs-10">' +
		'                <span class="cmp-ellipsis" ><%=obj.name %></span>' +
		'                <p class="cmp-h6 cmp-ellipsis" ><%=obj.address %></p>' +
		'            </div>' +
		'        </div>' +
		'    </a>' +
		'</li>' +
		'<%	} %>' + 
		'<% } %>';
	window.LBSAddress = LBSAddress;
} (window, document);