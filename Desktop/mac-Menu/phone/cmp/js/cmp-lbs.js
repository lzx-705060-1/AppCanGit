/**
 * Created by YH on 2015/9/21 0021.
 */
(function(_){
    _.lbs = {};

    /**
     * 获取当前位置
     */
    _.lbs.getCurrentPosition = function (cfg) {
        var _options = {
            success: null,
            error: null,
            mode:1//1：单次定位，2：多次定位
        };
        _options = _.extend(_options, cfg);
        if(_.platform.CMPShell){  //如果是cmp平台
            cordova.exec(
                _options.success,
                _options.error,
                "AMapLocationPlugin",
                "getLocation",
                [
                    {
                        mode:_options.mode + ""
                    }
                ]
            );
        }else if(_.platform.wechatOrDD){ //如果是微信或者钉钉平台 todo 待验证
            _getPositionByAMAP(_options)
        }else if(_.platform.third){
            _.event.trigger("cmpThirdPlatformPlugins",document,{data:_options,backupsFun:_getPositionByAMAP,plugin:"getPosition"})
        }
    };

    function _getPositionByAMAP(_options){
        if(typeof AMap == "undefined"){
            console.log("请使用高德定位插件");
        }else {
            var amapContainer = "<div style='width: 0;height: 0;' id='cmp_amap_container'></div>";
            var oldAmapContainer = document.getElementById("cmp_amap_container");
            if(!oldAmapContainer){
                _.append(document.body,amapContainer);
            }
            var mapObj = new AMap.Map("cmp_amap_container");
            mapObj.plugin('AMap.Geolocation', function() {
                var geolocation = new AMap.Geolocation({
                    enableHighAccuracy: true,//是否使用高精度定位，默认:true
                    timeout: 10000         //超过10秒后停止定位，默认：无穷大
                });
                mapObj.addControl(geolocation);
                geolocation.getCurrentPosition();
                AMap.event.addListener(geolocation, 'complete', function(data){
                    var longitude = data.position.getLng();
                    var latitude = data.position.getLat();
                    if(_options.success && typeof _options.success =="function" ){
                        var result = {
                            coordinate:{
                                longitude:parseFloat(longitude),
                                latitude:parseFloat(latitude)
                            },
                            success:true
                        };
                        _options.success(result);

                    }
                });//返回定位信息
                AMap.event.addListener(geolocation, 'error', function(){
                    if(_options.error && typeof _options.error != "undefined"){
                        _options.error({msg:"定位失败"});
                    }
                });      //返回定位出错信息
            });
        }
    }
    /**
     *  表单-地图标注
     * @param options
     *
     */
    _.lbs.markLocation = function (options) {
        var _options = {
            success: null,
            error: null,
            showMap:false,//是否返回地图图片地址,  返回结果以 mapImagePath:""字段返回
            extData:{
                zoom:"16",//地图缩放级别  默认16
                size:"408*240",//地图大小
                scale:"1"//高清/普通图片，1：普通，2：高清
            }
        };
        _options = _.extend(_options, options);
        if(_.platform.CMPShell) {  //如果是cmp平台
            cordova.exec(
                _options.success,
                _options.error,
                "CMPLocationMarkPlugin",
                "markLocation",
                [
                    {
                        showMap:_options.showMap?"1":"0",
                        extData:_options.extData
                    }
                ]
            );
        }
        else {
            // 返回不支持提示
        }
    };
    /**
     * 拍照定位
     * @param options {object} 配置参数对象
     * @param {Function} [options.success] 成功回调函数
     * @param {Function} [options.error] 失败回调函数
     * @example
     * ```
     * ```
     */
    _.lbs.takePicture = function (cfg) {
        var _options = {
            success: null,
            error: null,
            cancel:null,
            "userName":"",
            "uploadPicUrl":"http://10.5.6.240:88/file/upload/",
            "serverDateUrl":"",
            "location":""
        };
        _options = _.extend(_options, cfg);
        if(_.platform.CMPShell) {  //如果是cmp平台
            if(_.platform.M3W){
                _options.uploadPicUrl = convertFilePath4Token(_options.uploadPicUrl)
            }
            cordova.exec(
                _options.success,
                function(error){
                    if(error.code == 27003){
                        if(typeof _options.cancel == "function"){
                            _options.cancel(error);
                        }
                    }else {
                        if(typeof _options.error == "function"){
                            _options.error(error);
                        }
                    }
                },
                "CMPTakePicturePlugin",
                "takePicture",
                [
                    {
                        "userName": _options.userName,
                        "uploadPicUrl":_options.uploadPicUrl,
                        "serverDateUrl":_options.serverDateUrl,
                        "location":_options.location
                    }
                ]
            );
        }
        else {
            // 返回不支持提示
        }
    };
    function convertFilePath4Token(filePath){
        filePath = filePath.indexOf('?')>-1 ? filePath + '&' :  filePath+ '?';
        filePath = filePath + 'token='+_.token;
        return filePath;

    }
    // 位置定位，获取当前的经纬度，以及时间、地名信息
    _.lbs.getLocationInfo = function (cfg) {
        var _options = {
            success: null,
            error: null,
            mode:1//1：单次定位，2：多次定位
        };
        _options = _.extend(_options, cfg);
        if(_.platform.CMPShell) {  //如果是cmp平台
            cordova.exec(
                _options.success,
                _options.error,
                "AMapLocationPlugin",
                "getLocationInfo",
                [
                    {
                        mode:_options.mode + ""
                    }
                ]
            );
        }
        else {
            // 返回不支持提示
        }
    };
    /**
     *
     *显示地图信息
     */
    _.lbs.showLocationInfo = function (cfg) {
        var _options = {
            success: null,
            error: null,
            "lbsUrl":"", //  获取lbs信息的url地址 http://10.5.6.240:88/seeyon/rest/cmplbs/1814357976477972035
            "userName":"", // 用户名（可以不传）
            "memberIconUrl":"" // 用户头像url地址 （可以不传）
        };
        _options = _.extend(_options, cfg);
        if(_.platform.CMPShell) {  //如果是cmp平台
            if(_.platform.M3W){
                _options.lbsUrl = convertFilePath4Token(_options.lbsUrl);
            }
            cordova.exec(
                _options.success,
                _options.error,
                "CMPShowLocationPlugin",
                "showLocation",
                [
                    {
                        "lbsUrl":_options.lbsUrl,
                        "userName":_options.userName,
                        "memberIconUrl":_options.memberIconUrl
                    }
                ]
            );
        }
        else {
            // 返回不支持提示
        }
    };
    /**
     * @description 高德组件
     * @createDate 2018-01-25
     * @Author Clyne
     */

    /**
     * @description 高德地图组件，地图标注，LBS，轨迹，范围
     * @param el 目标绑定元素的选择器 [object String] 必填
     * @param options Map配置参数 [object Object] 必填
     
     * @param options.center 地图的中心坐标 [object Array] 必填
     * @param options.showCurPos 地图的中心坐标 [object Boolean] 默认 false
     * @param options.curContent 当前节点的覆盖层，可以是一个DOM的字符串来替代默认体表，[object String] 默认 ''
     * @param options.autoSearch 是否开启自动搜索 [object Boolean] 默认 false
     * @param options.autoSearchCallback 自动搜索触发的回调函数 [object Function] 默认 function(){}
     
     * @param options.pathOps 轨迹的配置参数 [object Object] 默认 {}
     * @param options.pathOps.strokeStyle 轨迹的颜色 [object String] 默认 red
     * @param options.pathOps.lineWidth 轨迹宽度 [object Number] 默认 6
     * @param options.pathOps.dirArrowStyle 是否显示轨迹箭头样式 [object Number] 默认 true
     
     * @param options.showPath 是否显示路径
     */
    ;(function() {
        var lbs = function( el, options ) {
            if ( this instanceof lbs ) {
                var defaults = {
                    //地图的center
                    center: options.center,
                    //是否展示当前位置
                    showCurPos: options.showCurPos,
                    //当前位置节点的content DOM
                    curContent: options.curContent || '',
                    //是否启用自动搜索
                    autoSearch: options.autoSearch,
                    //自动搜索初始化完成回调
                    autoSearchCallback: options.autoSearchCallback || function() {},
                    //轨迹初始化配置
                    pathOps: options.pathOps || {},
                    //是否显示路径
                    showPath: options.showPath
                }
                this.mark = [];
                this.circle = [];
                this.el = el;
                this._init(defaults);
            } else {
                return new lbs(el, options);
            }
        }

        lbs.prototype = {
            //初始化
            _init: function( options ) {
                var _this = this;
                for ( var i in options ) {
                    this[i] = options[i]
                };
                this._initMap();
                //是否展示当前的位置
                if ( this.showCurPos ) {
                    this.setCurPos({
                        pos: this.center,
                        content: this.curContent
                    });
                }
                //是否加载自动搜索
                if ( this.autoSearch ) {
                    _this._initAutoSearch();
                }
                //是否初始化轨迹
                if ( this.showPath ) {
                    this._initSimplifier();
                }
            },

            /**
             * @method getAddress
             * @description 获取地址
             * @param lnglatXY 地址坐标 [object Array] | [object Object]
             * @param callback 获取回调 [object Function]
             */
            getAddress: function(lnglatXY, callback) {
                if ( Object.prototype.toString.call(lnglatXY) === '[object Array]' ) {
                    lnglatXY = new AMap.LngLat(lnglatXY[0] + '', lnglatXY[1] + '');
                }
                this.geocoder.getAddress(lnglatXY, function(status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                        callback(result.regeocode);
                    } else {
                        throw new Error('高德地图获取坐标' + lnglatXY + '地址失败');
                    }
                });     
            },

            
            /**
             * @method clearAllNode
             * @description 移除所以节点
             */
            clearAllNode: function() {
                this.map.remove(this.mark);
                this.map.remove(this.circle);
                this.mark = [];
                this.circle = [];
            },

            //初始化地图
            _initMap: function() {
                var _this = this;
                this.map = new AMap.Map(this.el, {
                    resizeEnable: true,
                    zoom: 15,
                    center: this.center
                });
                this.geocoder = new AMap.Geocoder({
                    radius: 1000
                });
                AMap.plugin(['AMap.ToolBar'],function(){
                    _this.map.addControl(new AMap.ToolBar());
                });
            },

            /**
             * @method setCurPos
             * @description 设置当前的地址
             * @param obj.pos 坐标 [object Array]
             * @param obj.content 自定义样式html字符串 [object String]
             */
            setCurPos: function( obj ) {
                this.curPos = obj.pos;
                if ( this.curPosNode ) {
                    this.removeCurPos();
                }
                this.curPosNode = new AMap.Marker({
                    map: this.map,
                    position: obj.pos,
                    offset: new AMap.Pixel(-17, -42),
                    content: obj.content || ''
                });
                this.curPosNode.setMap(this.map);
                this.map.setFitView();
            },

            /**
             * @method removeCurPos
             * @description 移除当前的地址节点
             */
            removeCurPos: function() {
                this.map.remove([this.curPosNode]);
                this.curPosNode = null;
                this.curPos = null;
            },

            /**
             * @method appendMarkNode
             * @description 追加节点
             * @param obj.pos 位置节点集合，二维数组 [object Array]
             * @param obj.content 自定义DOMhtml 字符串数组 [object Array]
             * @param obj.clickCallback 点击事件回调 [object Function]
             * @param obj.dragEndCallback 拖拽回调 [object Function]
             * @param obj.draggable 是否可拖拽 [object boolean]
             */
            appendMarkNode: function( obj ) {
                var _this = this,
                    markList;
                obj.content = obj.content || [];
                //绘制点
                for ( var i = 0;i < obj.pos.length;i++ ) {
                    var mark = new AMap.Marker({
                        map: this.map,
                        position: obj.pos[i],
                        draggable: obj.draggable === undefined ? false : obj.draggable,
                        offset: new AMap.Pixel(-17, -42),
                        content: obj.content[i] || ''
                    });
                    mark.setMap(this.map);
                    mark.on('click', function(e) {
                        obj.clickCallback(e);
                    });
                    mark.on('dragend', function(e) {
                        obj.dragEndCallback(e);
                    });
                    this.mark.push(mark);
//                    markList.push(mark);
                }
                this.map.setFitView();
//                return markList;
            },

            /**
             * @method appendMarkNode
             * @description 追加节点
             * @param obj.pos 位置节点集合，一维数组 [object Array]
             * @param obj.radius 圆的半径 [object Number]
             * @param obj.strokeColor 线颜色 [object String]
             * @param obj.strokeOpacity 线透明度 [object Number]
             * @param obj.strokeWeight 线粗细度 [object Number]
             * @param obj.fillColor 填充颜色 [object String]
             * @param obj.fillOpacity 填充透明度 [object Number]
             * @param obj.content 自定义DOM html字符串 [object String]
             */
            setScope: function( obj ) {
                var circle = new AMap.Circle({
                    // 圆心位置
                    center: new AMap.LngLat(obj.pos[0] + '', obj.pos[1] + ''),
                    //半径
                    radius: obj.radius || 200, 
                    //线颜色
                    strokeColor: obj.strokeColor || "#fff", 
                    //线透明度
                    strokeOpacity: obj.strokeOpacity === undefined ? 0 : obj.strokeOpacity, 
                    //线粗细度
                    strokeWeight: obj.strokeWeight === undefined ? 0 : obj.strokeWeight, 
                    //填充颜色
                    fillColor: obj.fillColor || "#ee5500", 
                    //填充透明度
                    fillOpacity: obj.fillOpacity || 0.3,
                    //内容
                    content: obj.content
                });
                this.appendMarkNode({
                    pos: [obj.pos],
                    content: [obj.content]
                });
                this.circle.push(circle);
                circle.setMap(this.map);
            },

            /**
             * @method getNodeDis
             * @description 获取两点之间的距离
             * @param from 开始位置，一维数组 [object Array]
             * @param to 结束位置，一维数组 [object Object]
             */
            getNodeDis: function( from, to ) {
                var lnglat = new AMap.LngLat(from[0], from[1]);
                return Math.ceil(lnglat.distance(to));
            },

            /**
             * @method getDisCurPosToTgt
             * @description 获取当前点击节点到当前位置的距离
             * @param e 事件对象 [object Array]
             */
            getDisCurPosToTgt: function( e ) {
                if ( !this.curPosNode ) {
                    throw new Error('请你先设置你当前的位置');
                    return;
                }
                return this.getNodeDis(this.curPos, [e.lnglat.lng, e.lnglat.lat]);
            },

            /**
             * @method initSimplifier
             * @description 初始化轨迹
             * @param e 事件对象 [object Array]
             */
            _initSimplifier: function() {
                var _this = this;
                AMapUI.load(['ui/misc/PathSimplifier'], function(PathSimplifier) {
                    if ( !PathSimplifier.supportCanvas ) {
                        alert('当前环境不支持 Canvas！');
                        return;
                    }
                    //启动页面
                    _this.pathSimplifierIns = new PathSimplifier({
                        zIndex: 100,
                        map: _this.map,
                        getPath: function(pathData, pathIndex) {
                            //返回轨迹数据中的节点坐标信息，[AMap.LngLat, AMap.LngLat...] 或者 [[lng|number,lat|number],...]
                            return pathData.path;
                        },
                        getHoverTitle: function(pathData, pathIndex, pointIndex) {
                            //返回鼠标悬停时显示的信息
                            if (pointIndex >= 0) {
                                //鼠标悬停在某个轨迹节点上
                                return pathData.name + '，点:' + pointIndex + '/' + pathData.path.length;
                            }
                            //鼠标悬停在节点之间的连线上
                            return pathData.name + '，点数量' + pathData.path.length;
                        },
                        renderOptions: {
                            //轨迹线的样式
                            pathLineStyle: {
                                strokeStyle: _this.pathOps.strokeStyle || 'red',
                                lineWidth: _this.pathOps.lineWidth || 6,
                                dirArrowStyle: _this.pathOps.dirArrowStyle === undefined ? true : _this.pathOps.dirArrowStyle
                            }
                        }
                    });
                });
            },

            /**
             * @method setPathData
             * @description 设置路径
             * @param options 配置信息 [object Object]
             * @param options.name 轨迹名称 [object String]
             * @param options.pos 坐标集合，二维数组 [object Array]
             */
            setPathData: function( options ) {
                var _this = this;
                if ( this.pathSimplifierIns ) {
                    //这里构建两条简单的轨迹，仅作示例
                    this.pathSimplifierIns.setData([{
                        name: options.name || '轨迹',
                        path: options.pos
                    }]);
                } else {
                    setTimeout(function() {
                        _this.setPathData(options);
                    }, 100);
                }
            },

            //初始化自动搜索
            _initAutoSearch: function( callback ) {
                var _this = this;
                AMap.plugin(['AMap.Autocomplete'],function(){
                    var autoOptions = {
                        city: '', //城市，默认全国
                    };
                    _this.autoComplete = new AMap.Autocomplete(autoOptions);
                    _this.autoSearchCallback();
                    //加载完成标识
                    _this.autoSearchLoaded = true;
                });
            },

            /**
             * @method getSearchResultBykey
             * @description 根据keyword获取地理位置搜索结果
             * @param keyword 关键字 [object String]
             * @param callback 轨迹名称 [object Function]
             */
            getSearchResultBykey: function( keyword, callback ) {
                var _this = this;
                if ( !this.autoSearchLoaded ) {
                    throw new Error('高德搜索控件尚未加载完毕');
                    return;
                }
                clearTimeout(this.timer);
                this.timer = setTimeout(function() {
                    _this.autoComplete.search(keyword, function(status, result) {
                        callback(result);
                    });
                }, 300);
            }
        };
        cmp.lbs.gdMap = lbs;
    })();
})(cmp);