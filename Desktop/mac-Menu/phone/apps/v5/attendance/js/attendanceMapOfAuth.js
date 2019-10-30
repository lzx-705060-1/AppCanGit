(function(){
	//作用域内变量
	var amap,scroller,pageParam,infoWin,activeMarker,currentAuthorDom,markerObj = {};
	cmp.ready(function(){
		//返回按钮
		backButton();
		//页面参数
		initPageParam();
		//页面元素计算和组件加载
		initDom();
		//数据加载
		initData();
		//事件绑定
		bindEvent();
	});
	var backButton = function(){
//		cmp("body").on("tap","#backBtn",function(){
//			cmp.href.back();
//		});
		cmp.backbutton();
        cmp.backbutton.push(cmp.href.back);
	}
	var initPageParam = function(){
		var _signTime = cmp.href.getBackParam("signTime");
		if(_signTime){
			pageParam = {};
			pageParam.signTime = _signTime;
			return;
		}
		pageParam = cmp.href.getParam();
	}
	var initDom = function(){
		//初始化地图
		var mapContainer = document.querySelector("#mapContainer");
		amap = AmapComponent.initMap(mapContainer);
		//初始化时间
		document.querySelector(".auth-time-show").innerHTML = attendanceCommon.getCurrentByPattern(pageParam.signTime,"yyyy-MM-dd");
	}
	var initData = function(){
		var pageNo = 1,pageSize = 20;
		var initList = function(){
			var param = {
				pageNo : pageNo,
				pageSize : pageSize,
				startTime : attendanceCommon.getFirstTimeOfDay(pageParam.signTime),
				endTime : attendanceCommon.getLastTimeOfDay(pageParam.signTime)
			}
			$s.Attendance.getAuthorize({},param,{
				success : function(result){
					if(result.success){
						result = result.data.data;
					}else{
						cmp.notification.alert(result.msg,function(){
							cmp.href.back();
						},cmp.i18n("Attendance.message.warn"),cmp.i18n("Attendance.message.previousPage"));
						return;
					}
					render(result,pageNo == 1 ? false : true);
				},
				error : function(e){
					attendanceCommon.dealAjaxError(e);
					options.error();
				}
			});
		}
		var render = function(data,isAppend){
			var tpl = document.querySelector('#authMenber').innerHTML;
			var container = document.querySelector('#authContainer .mui-table-view');
			//没有数据的情况处理
			if(data.length == 0 && pageNo == 1){
				document.querySelector("#noData").classList.add("active");
			}else{
				document.querySelector("#noData").classList.remove("active");
			}
			
			var html = cmp.tpl(tpl,data);
			if(isAppend){
				cmp.append(container,html);
			}else{
				container.innerHTML = html;
			}
			drawPoints(data,amap);
	       	updateListWidth(document.querySelector('#authContainer'),scroller);
		}	
		scroller = new cmp.iScroll("#authContainer",{
            vScroll:false,
            hScroll:true,
            x: 0,
            y: 0,
            bounce: true,
            bounceLock: false,
            momentum: true,
            lockDirection: true,
            useTransform: true,
            useTransition: false,
            handleClick: true,
            special:true,
            onScrollEnd:function(){
            	if(this.x != 0){
					pageNo++;
					initList();
            	}
            },
            onRefresh:null
       });
       initList();
	}
	var drawPoints = function(data,ctx){
		cmp.each(data,function(index,item){
			var lng,lat;
			lng = item.longitude;
			lat = item.latitude;
			if(!lng || !lat){
				return;
			}
			ctx.setCenter([lng,lat]);
			var marker = new AMap.Marker({
				content: parseDom("<div class='auth-mark-container'><span class='checkinicon icon-checkin-map'></span><div class='map-mark-pin'><img src='" + attendanceCommon.getCmpRoot() + item.owner_img + "'></div></div>"),
			    position: [lng,lat],
			    map:ctx,
			    offset: new AMap.Pixel(-20, -38),
	    		extData : {
					memberId : item.owner_id,
					signTime : item.sign_time
				}
			});
			//绑定marker点击事件
			marker.on("click",function(){
				//点选中
				var content = this.getContent();
				if(activeMarker){
					activeMarker.getContent().classList.remove("cmp-active");
				}
				content.classList.add("cmp-active");
				activeMarker = this;
				
				//列表选中
				var markerInfo = this.getExtData();
				var activeListDom = document.getElementById(markerInfo.memberId);
				activeListDom.classList.add("active");
				if(currentAuthorDom){
					currentAuthorDom.classList.remove("active");
				}
				currentAuthorDom = activeListDom;
				scroller.scrollToElement(currentAuthorDom);
				
				openInfoWin(this);
				//隐藏pc端链接
				document.querySelector(".auth-pc-container").style.display = "none";
			});
			ctx.setFitView();
			markerObj[item.owner_id] = marker;
		});
	}
	var bindEvent = function(){
		//头像点击事件
		cmp("#authContainer").on("tap",".auth-user-container",function(){
			//打开信息窗体
			var marker = markerObj[this.id];
			if(!marker){
				//显示pc端链接
				var memberId = this.attributes["item-id"].nodeValue;
				var signTime = this.attributes["item-date"].nodeValue;
				var pcInfo = document.querySelector(".auth-pc-container .auth-pc-info");
				pcInfo.attributes["item-id"].nodeValue = memberId;
				pcInfo.attributes["item-date"].nodeValue = signTime;
				document.querySelector(".auth-pc-container").style.display = "block";
				
				if(activeMarker){
					activeMarker.getContent().classList.remove("cmp-active");
				}
				this.classList.add("active");
				if(currentAuthorDom){
					currentAuthorDom.classList.remove("active");
				}
				currentAuthorDom = this;
				
				if(infoWin){
					infoWin.close();
				}
				
				return;
			}
			//隐藏pc端链接
			document.querySelector(".auth-pc-container").style.display = "none";
			openInfoWin(marker);
			
			var content = marker.getContent();
			if(activeMarker){
				activeMarker.getContent().classList.remove("cmp-active");
			}
			content.classList.add("cmp-active");
			activeMarker = marker;
			
			this.classList.add("active");
			if(currentAuthorDom){
				currentAuthorDom.classList.remove("active");
			}
			currentAuthorDom = this;
			amap.panTo(marker.getPosition());
		});
		//信息窗体点击事件
		document.querySelector("#mapContainer").addEventListener("click",function(event){
			var target = event.target;
			if(target.className == "auth-marker-info"){
				var memberId = target.attributes["item-id"].nodeValue;
				var signTime = target.attributes["item-date"].nodeValue;
				cmp.href.next(_attendancePath + "/html/attendanceMapOfMine.html",{memberId : memberId,signTime : signTime});
			}
		});
		//第一条是pc端情况点击事件
		document.querySelector(".auth-pc-container .auth-pc-info").addEventListener("click",function(){
			var memberId = this.attributes["item-id"].nodeValue;
			var signTime = this.attributes["item-date"].nodeValue;
			cmp.href.next(_attendancePath + "/html/attendanceMapOfMine.html",{memberId : memberId,signTime : signTime});
		});
		//切换日期
		document.querySelector(".auth-time").addEventListener("click",function(){
			var container = this.querySelector(".auth-time-show");
			var selectedValue = container.innerHTML;
			var options = {
				type : "date"
			}
			if(cmp.DtPicker){
				var picker = new cmp.DtPicker(options);
				picker.setSelectedValue(selectedValue);
				picker.show(function(rs) {
					container.innerHTML = rs.value;
					reLoad();
					picker.dispose();
				});
			}else{
				cmp.dialog.loading(); 
				var csses = [cmpPath+ "/css/cmp-picker.css" + $buildversion];
				var jses = [cmpPath + "/js/cmp-picker.js" + $buildversion,
				            cmpPath + "/js/cmp-dtPicker.js" + $buildversion];
				cmp.asyncLoad.css(csses);
				cmp.asyncLoad.js(jses,function(){
					cmp.dialog.loading(false); 
					var picker = new cmp.DtPicker(options);
					picker.setSelectedValue(selectedValue);
					picker.show(function(rs) {
						container.innerHTML = rs.value;
						reLoad();
						picker.dispose();
					});
				});
			}
		});
	}
	
	/**
	 * 重新加载页面数据
	 */
	var reLoad = function(){
		//清空地图
		amap.clearMap();
		//重新渲染底部列表
		pageParam.signTime = document.querySelector(".auth-time .auth-time-show").innerHTML;
		activeMarker = undefined,currentAuthorDom = undefined,markerObj = [];
		initData();
	}
	
	var openInfoWin = function(marker){
		//信息窗体
		if(!infoWin){
			infoWin = new AMap.InfoWindow({
				isCustom : true,
				offset: new AMap.Pixel(2, -45)
			});
		}
		//弹出地址信息
		var markerInfo = marker.getExtData();
		var tipInfo = '<div class="auth-marker-info" item-id="' + markerInfo.memberId + '" item-date="' + markerInfo.signTime + '">' + cmp.i18n("Attendance.label.detail") + '</div>';
		infoWin.setContent(tipInfo);
		infoWin.open(amap, marker.getPosition());
	}
	
	var scollToList = function(){
		
	}
	
	var updateListWidth = function(dom,scroller){
		var items = dom.getElementsByClassName("transverse-mark");
        var page = dom.querySelector(".scroller");
        var windowWid = cmp.os.android?document.body.clientWidth : window.innerWidth;
        var itemsWid = 0;
        for(var i = 0;i < items.length; i ++) {
            itemsWid += items[i].clientWidth;
        }
        if(itemsWid > windowWid) {
            page.style.width = itemsWid + 'px';
        }else {
            page.style.width = windowWid + 'px';
        }
        if(scroller && typeof scroller != "undefined") {
            scroller.refresh();
            var scrollerW = scroller.scrollerW,wrapperW = scroller.wrapperW,winW = window.innerWidth;
            if(scrollerW > wrapperW && scrollerW > winW){
//              scroller.scrollTo((wrapperW-scrollerW),0);
            }else if(scrollerW = winW){
                scroller.scrollTo(0,0);
            }
        }
	}
    var	parseDom = function(html){
		var dom = document.createElement("div");
		dom.innerHTML = html;
		return dom.childNodes[0];
	}
})();
