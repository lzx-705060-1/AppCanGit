(function(){
	var amap;//地图组件
	
	cmp.ready(function(){
		//返回事件
		bindBackEvent();
		//计算页面高度
		initDom();
		//i18n
		initI18n();
		//加载页面数据
		initPageData();
		//加载页面事件
		bindDomEvent();
	});
	var initI18n = function(){
		document.title = cmp.i18n("Attendance.label.attendDetail");
	}
	var initDom = function(){
		//中间大主容器计算高度
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
		/**签到详情页**/
	    var checkin_details_container=document.querySelector('.checkin-details-container');
	    if(checkin_details_container){
	        var index_map_details,mapH;
	        index_map_details=document.querySelector('.index-map');
	        mapH = index_map_details ? index_map_details.offsetHeight : 0;
	        checkin_details_container.style.height = windowH - headerH - mapH +"px";
	    }
	}
	var bindBackEvent = function(){
		var param = cmp.href.getParam();
		var backFunc;
		if(param.weixinMessage){
			backFunc = cmp.href.closePage;
		}else{
			backFunc = cmp.href.back;
		}
//		cmp("body").on("tap","#backBtn",function(){
//			backFunc();
//		});
		cmp.backbutton();
        cmp.backbutton.push(backFunc);
	}
	var initPageData = function(){
		var param = cmp.href.getParam();
		if(param.openType && param.openType == 'message'){
			$s.Attendance.checkAttendanceAtByUser(param.attendanceId,{},{
				success : function(result){
					//校验是否取得数据
					if(!result.success){
						cmp.notification.alert(result.msg,function(){
							cmp.href.back();
						},cmp.i18n("Attendance.message.warn"),cmp.i18n("Attendance.message.previousPage"));
						return;
					}else{
						initAttendanceData();
					}
				},
				error : function(e){
					attendanceCommon.dealAjaxError(e);
				}
			});
		}else{
			initAttendanceData();
		}
	}
	
	var initAttendanceData = function(){
		var param = cmp.href.getParam();
		$s.Attendance.getAttendanceById(param.attendanceId,{},{
			success : function(result){
				//校验是否取得数据
				if(result.success){
					result = result.data;
				}else{
					cmp.notification.alert(result.msg,function(){
						cmp.href.back();
					},cmp.i18n("Attendance.message.warn"),cmp.i18n("Attendance.message.previousPage"));
					return;
				}
				var center;
				if(result.longitude && result.latitude){
					center = [result.longitude,result.latitude];
				}
				//初始化地图
				amap = new AmapComponent("mapContainer",{
					type : "amapShow",
					amapShow : {
						center : center
					}
				});
				//加载人员信息
				document.querySelector(".user-head img").src = attendanceCommon.getCmpRoot() + result.ownerImgPath;
				document.querySelector(".user-name label").innerHTML = result.ownerName;
				document.querySelector(".user-name p").innerHTML = result.signTime;
				//加载地址信息
				var nearAddress = (!result.nearAddress || result.nearAddress == "null") ? "" : result.nearAddress;
				document.querySelector(".map-address label").innerHTML = nearAddress;
				document.querySelector(".map-address p").innerHTML = result.sign;
				//备注
				if(result.remark){
					var content = result.remark.escapeHTML();
					content = content.replace(/\n/g,"<br>");
					document.querySelector(".user-talk .talk").innerHTML = content;
				}else{
					document.querySelector(".user-talk").style.display = "none";
				}
				//加载附件
				if(result.attachmentList) initAttachment(result);
			},
			error : function(e){
				attendanceCommon.dealAjaxError(e);
			}
		});
	}
	var initAttachment = function(result){
		var attList = result.attachmentList
		var imgHtml = "",recordHtml = "";
		for(var i = 0;i < attList.length;i++){
			var suffix = attList[i].filename.substring(attList[i].filename.lastIndexOf(".") + 1);
			if(/jpg|jpeg|gif|bmp|png/gi.test(suffix)){
				var imgSrc = cmp.origin + "/commonimage.do?method=showImage&id=" + attList[i].fileUrl + "&size=custom&q=0.3&size=resize&h=250&w=250";
				var autoUrl = cmp.origin + "/commonimage.do?method=showImage&id=" + attList[i].fileUrl + "&size=auto&from=mobile";
				var sourceUrl = cmp.origin + "/commonimage.do?method=showImage&id=" + attList[i].fileUrl + "&size=source";
				imgHtml += '<img index-data="' + i + '" src="' + imgSrc + '" auto-url="'+autoUrl+'" src-url="' + sourceUrl + '"/>'; 
			}else{
				var recordTime = "";
				if(result.recordInfo){
					recordTime = cmp.parseJSON(result.recordInfo).time;
				}
				recordHtml = '<div class="submit-record-file">'+
								 '<a class="submit-record-file-a" data-item=\'' + cmp.toJSON(attList[i]) + '\'>'+
									'<img class="record" src="../img/record_3.png" alt=""/>'+
									'<span>&nbsp;' + recordTime + '\"</span>'
								 '</a>'+
							 '</div>';
			}
		}
		//图片
		if(imgHtml){
			document.querySelector(".user-img").innerHTML = imgHtml;
		}else{
			document.querySelector(".user-img").style.display = "none";
		}
		//语音
		if(recordHtml) {
			document.querySelector(".user-record").innerHTML = recordHtml;
		}else{
			document.querySelector(".user-record").style.display = "none";
		}
	}
	var bindDomEvent = function(){
		//图片点击事件
		cmp("body").on("tap",".user-img img",function(){
			var imgs = this.parentElement.querySelectorAll("img");
			var imgArray = [];
		    for(var i = 0,len = imgs.length;i < len; i ++) {
		    	imgArray.push({
		        	small:imgs[i].getAttribute("auto-url"),
		        	big:imgs[i].getAttribute("src-url")
		        });
		    }
		    //默认查看第几张图
			var index = parseInt(this.getAttribute("index-data"));
		    //调用大图查看
			cmp.sliders.addNew(imgArray);
	        cmp.sliders.detect(index);
		});
		//录音文件点击事件
		cmp("body").on("tap",".submit-record-file-a",function(){
			if(!cmp.platform.CMPShell){
				cmp.notification.toast(cmp.i18n('Attendance.message.weChatNoPermission'), 'center', 1000);
				return;
			}
			var dataItem = this.attributes["data-item"].nodeValue;
			if(!dataItem) return;
			dataItem = cmp.parseJSON(dataItem);
			
			var id = dataItem.fileUrl, fileName = dataItem.filename;
	        var lastModified = dataItem.lastModified || dataItem.createDate || dataItem.createdate;
            var filePath = cmp.origin + "/rest/attachment/file/"+ id;
			playFile(id,filePath,fileName,lastModified);
		});
	}
	var isPlaying = false;
    var playFile = function(id,filePath,fileName,lastModified){
    	if(isPlaying){
    		return;
    	}
    	isPlaying = true;
        cmp.att.download({
            url: filePath,
            isSaveToLocal:false,
            title: fileName,
            extData: {
                lastModified:lastModified,
                fileId:id,
                origin:cmp.origin
            },
            progress: function (result) {

            },
            success: function (result) {
                var localPath =  result["target"];
                localPath = "file://" + localPath;
                document.querySelector(".record").src = "../img/record_play.gif";
                cmp.audio.playVoice({
			         url:localPath,
			         initSuccess:function(){},
			         success:function(src){
						document.querySelector(".record").src = "../img/record_3.png";
						isPlaying = false;
			         },
			         error:function(e){
			        	if(e.code != "57002"){//57002, "正在播放中..."
			        		cmp.notification.toast(e.message, "center");
			        	}
			        	isPlaying = false;
			        }
			    });
            },
            error: function (e) {
				console.log(e);
            }
        });
    };
})();
