(function(){
	//页面全局变量
	var pageParams;//参数
	var amap;//地图对象
	var slideComponent;//滑动对象
	var submitParams = {
		available : true,
		attendRange : document.querySelector("#centerRange").innerHTML
	};
	
	cmp.ready(function(){
		//返回按钮
		backBtnFun();
		//初始化参数
		initParams();
		//页面计算
		initDom();
		//加载数据
		initData();
		//绑定事件
		bindEvents();
	});
	var backBtnFun = function(){
//		cmp("body").on("tap","#backBtn",function(){
//			cmp.href.back();
//		});
		cmp.backbutton();
        cmp.backbutton.push(cmp.href.back);
	}
	var initDom = function(){
		var cmp_content=document.querySelector('.cmp-content');
	    var header=document.querySelector('header');
	    var footer=document.querySelector('footer');
	    var windowH= window.innerHeight;
	    var headerH,footerH;
	    headerH = 0;
	    footerH = !footer ? 0 : footer.offsetHeight;
	    if(cmp_content){
	        cmp_content.style.height = windowH - headerH - footerH + "px";
	    }
	    /**
		 * 滑动
		 */
//		slideComponent = new AttendanceSlide("#slide-container",{
//			backFunc : function(){}
//		});
		/**
		 * 删除按钮是否显示
		 */
		if(pageParams && pageParams.id){
			document.querySelector(".common-query-btn").classList.add('active');
		}
	}
	var initParams = function(){
		pageParams = cmp.href.getParam();
		if(pageParams && pageParams.id){
			submitParams.id = pageParams.id;
		}
	}
	var initData = function(){
		var cfg = {
			attendRange : document.querySelector('#centerRange').innerHTML,
			mapDom : document.querySelector('#mapContainer'),
			queryDom : document.querySelector('#queryHandler'),
			callBack : function(results){
				//回填页面
				document.querySelector('#centerInput').value = results.name;
				cmp.extend(submitParams,results);
				
				if(results.isCustomse){
					document.querySelector('#centerInput').value = "";
					document.querySelector('#centerInput').readOnly = false;
				}
			}
		}
		if(pageParams && pageParams.id){
			$s.Attendance.findSettings(pageParams.id,{},{
				success : function(result){
					if(result.success){
						pageParams = result.data.data[0];
						//回填页面
						document.querySelector("#centerInput").value = pageParams.name;
						document.querySelector("#centerRange").innerHTML = pageParams.attendRange;
						submitParams.attendRange = pageParams.attendRange;
						document.querySelector("#remark").value = pageParams.remark;
						submitParams.remark = pageParams.remark;
						if(pageParams.available){
							submitParams.available = true;
							document.querySelector("#available").classList.add("cmp-active");
						}else{
							submitParams.available = false;
							document.querySelector("#available").classList.remove("cmp-active");
						}
						//加载地图
						cmp.extend(cfg,{
							center : [pageParams.longitude,pageParams.latitude],
							attendRange : pageParams.attendRange,
							initData : {
								name : pageParams.name,
								location : {
									lng : pageParams.longitude,
									lat : pageParams.latitude
								}
							}
						})
						initMap(cfg);
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
		}else{
			initMap(cfg);
		}
	}
	var initMap = function(cfg){
		//初始化地图
		amap = new AmapComponent('mapContainer',{
			type : 'amapQuery',
			cfg : cfg
		});
	}
	var bindEvents = function(){
		/**
		 * 改变范围事件
		 */
		var userPicker = new cmp.PopPicker({
			data : [{
						value:50,
						text:50
					},
					{
						value:100,
						text:100
					},
					{
						value:150,
						text:150
					},
					{
						value:200,
						text:200
					},
					{
						value:300,
						text:300
					},
					{
						value:400,
						text:400
					},
					{
						value:500,
						text:500
					},
					{
						value:1000,
						text:1000
					},
					{
						value:2000,
						text:2000
					}]
		});
		
		var rangeDom = document.querySelector('#centerRange');
		document.querySelector('#centerLi').addEventListener('click',function(){
			userPicker.defaultValue=rangeDom.innerHTML;
			userPicker.setPickerDefalutValue();
           	userPicker.show(function(items){
                var selected = items[0].value;
                rangeDom.innerHTML = selected;
                submitParams.attendRange = selected;
				amap.refresh({attendRange : selected});
            });
		});
		/**
		 * 启用开关
		 */
		document.querySelector('#available').addEventListener('toggle',function(event){
			submitParams.available = event.detail.isActive;
		});
		/**
		 * 保存事件
		 */
		document.querySelector('#saveBtn').addEventListener('click',function(){
			attendanceCommon.throttle(saveFun);
		});
		/**
		 * 删除事件
		 */
		document.querySelector("#deleteHandler").addEventListener("click",function(){
			var id = pageParams.id;
			cmp.notification.confirm(cmp.i18n("Attendance.message.comfirmDelete"),function(index){
				if(index == 1){
			        $s.Attendance.removeSetting(id,{},{
		        		success : function(result){
			                if(result.success){
			                	cmp.notification.toast(cmp.i18n("Attendance.message.deleteSuccess"), "center",1000,1);
			                	setTimeout(function(){
									cmp.href.back();
								},1000);
							}else{
								cmp.notification.alert(result.msg,function(){
									cmp.href.back();
								},cmp.i18n("Attendance.message.warn"),cmp.i18n("Attendance.message.previousPage"));
								return;
							}
		            	},
			            error : function(e){
							attendanceCommon.dealAjaxError(e);
						}
		        	});
				}
			});
		});
		/**
		 * 字数监听
		 */
		document.querySelector("#remark").addEventListener("input", function(){
			var num = this.value.length;
			if(num > 80){
				this.value = this.value.substr(0,80);
				this.blur();
				cmp.notification.toast(cmp.i18n("Attendance.message.word80"), "center");
			}
			reSizeText();
		});

	};
	var reSizeText = function(){
		// 最小高度
		var minRows = 2;
		// 最大高度，超过则出现滚动条
		var maxRows = 4;
		var t = document.getElementById('remark');
		if (t.scrollTop == 0) t.scrollTop=1;
		while (t.scrollTop == 0){
			if (t.rows > minRows)
				t.rows--;
			else
				break;
			t.scrollTop = 1;
			if (t.rows < maxRows)
				t.style.overflowY = "hidden";
			if (t.scrollTop > 0){
				t.rows++;
				break;
			}
		}
		while(t.scrollTop > 0){
			if (t.rows < maxRows){
				t.rows++;
				if (t.scrollTop == 0) t.scrollTop=1;
			}
			else{
				t.style.overflowY = "auto";
				break;
			}
		}
	};
	var validate = function(){
		if(submitParams.longitude && submitParams.latitude){
			return true;
		}else{
			cmp.notification.toast(cmp.i18n("Attendance.message.selectOne"),"center","",0);
			return false;
		}
	}
	var saveFun = function(){
		if(!validate()){
			return;
		}
		submitParams.name = document.querySelector("#centerInput").value;
		submitParams.attendRange = document.querySelector("#centerRange").innerHTML;
		submitParams.remark = document.querySelector("#remark").value;
		$s.Attendance.saveSetting({},submitParams,{
			success : function(result){
				if(result.success){
					cmp.notification.toast(cmp.i18n("Attendance.message.saveSuccess"), "center",1000,1);
					setTimeout(function(){
						cmp.href.back();
					},1000);
				}else{
					cmp.notification.alert(error);
				}
			},
			error : function(e){
				attendanceCommon.dealAjaxError(e);
			}
		});
	}
})();
