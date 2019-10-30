/**
 * 签到信息填写提交页面
 * author:het
 * createTime:2016-12-13
 */
; ~function (window, document) {
	//保存时提交的数据
	var _submitObj = {};
	//本地参数
	var _params = {};
	//当前用户
	var currentUser;

	/**页面初始化操作*/
	function init() {

		//页面元素操作是否可用控制
		var permission = {
			commonwordEnable: true,
			recordEnable: true,
			cameraEnable: true,
			atEnable: true
		};
		if (cmp.system.filePermission() == false) {
			//某些客户端无法使用拍照、语音，如：微协同端
			permission.recordEnable = false;
			permission.cameraEnable = false;
		}
		_params.permission = permission;
		
		_params.checkSubmitFlag = true;
		
		initPreEvent();
		//国际化
		initI18n();
		//计算dom高度
		initDom();
		initPageDataLayout();
	}
	
	function initI18n(){
		document.title = cmp.i18n("Attendance.label.submit");
		document.querySelector("#submit_textarea").placeholder = cmp.i18n("Attendance.label.placeholder");
	}
	
	function initDom(){
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
	}
	
	function initPreEvent() {
		//首先绑定回到上一页
//		cmp("body").on("tap", ".attendance-left", goBackConfirm);
		//Android手机返回按钮监听
		cmp.backbutton();
		cmp.backbutton.push(goBackConfirm);
	}

	/**初始化--页面数据*/
	function initPageDataLayout() {
		cmp.listView('#topPopover');

		var params = cmp.href.getParam();
		var selectdata = params.selectdata; //LBS定位信息
		var nowdate = params.nowdate;		//当前时间
		//当前用户
		currentUser = params.currentUser;

		var yearDom = document.querySelector(".index-today .years");
		var weekDom = document.querySelector(".index-today .week");
		var locationDom = document.querySelector(".index-location .attendance-address");
		yearDom.innerHTML = nowdate.time;
		weekDom.innerHTML = nowdate.week;
		locationDom.innerHTML = selectdata.name.escapeHTML();

		var footer_tpl = document.querySelector("#footer_tpl").innerHTML;
		var footer_html = cmp.tpl(footer_tpl, _params.permission);
		document.querySelector(".submit-footer-action").innerHTML = footer_html;
		cmp.i18n.detect();

		var header = document.title;
		header.innerHTML = params.typeName;
		document.title = params.typeName;
		cmp.dialog.loading();
		cmp.asyncLoad.js(["https://webapi.amap.com/maps?v=1.3&key=dced395ba47d88fd4dcf8ed6d846cbc7"],function(){
			if(typeof AMap == 'undefined'){
				cmp.notification.alert(cmp.i18n("Attendance.message.loadingGpsError"),function(){
					cmp.href.back();
				},cmp.i18n("Attendance.message.warn"),cmp.i18n("Attendance.message.previousPage"));
				return;
			}			
			AMap.service(["AMap.Geocoder"], function () {
				var geocoder = new AMap.Geocoder({
					radius: 200,
					extensions: "all"
				});
				geocoder.getAddress([params.selectdata.location.lng, params.selectdata.location.lat], function (status, result) {
					if (status === 'complete' && result.info === 'OK') {
						var addr = result.regeocode.addressComponent;
						_submitObj.continent = "";
						_submitObj.country = "";
						_submitObj.province = addr.province;
						_submitObj.city = addr.city;
						_submitObj.town = addr.district;
						_submitObj.street = addr.street;
						_submitObj.nearAddress = params.selectdata.name;
						_submitObj.longitude = params.selectdata.location.lng;
						_submitObj.latitude = params.selectdata.location.lat;
						if (_submitObj.province == _submitObj.city) {
							_submitObj.sign = _submitObj.province + _submitObj.town + _submitObj.nearAddress;
						} else {
							_submitObj.sign = _submitObj.province + _submitObj.city + _submitObj.town + _submitObj.nearAddress;
						}
					} else {
						cmp.notification.toast(cmp.i18n("Attendance.label.locateFail") , "center");
					}
					//等待地址加载完成了再初始化后续的页面dom事件
					cmp.dialog.loading(false);
					initEvent();
				});
			});//end of AMAP
		});
	}
	
	/**
	 * 根据经纬度获取地址信息
	 */
	var getAddress = function(selectdata){
		cmp.asyncLoad.js(["https://webapi.amap.com/maps?v=1.3&key=dced395ba47d88fd4dcf8ed6d846cbc7"],function(){
			if(typeof AMap == 'undefined'){
				cmp.notification.alert(cmp.i18n("Attendance.message.loadingGpsError"),function(){
					cmp.href.back();
				},cmp.i18n("Attendance.message.warn"),cmp.i18n("Attendance.message.previousPage"));
				return;
			}			
			AMap.service(["AMap.Geocoder"], function () {
				var geocoder = new AMap.Geocoder({
					radius: 200,
					extensions: "all"
				});
				geocoder.getAddress([selectdata.location.lng, selectdata.location.lat], function (status, result) {
					if (status === 'complete' && result.info === 'OK') {
						var addr = result.regeocode.addressComponent;
						_submitObj.continent = "";
						_submitObj.country = "";
						_submitObj.province = addr.province;
						_submitObj.city = addr.city;
						_submitObj.town = addr.district;
						_submitObj.street = addr.street;
						_submitObj.nearAddress = selectdata.name;
						_submitObj.longitude = selectdata.location.lng;
						_submitObj.latitude = selectdata.location.lat;
						if (_submitObj.province == _submitObj.city) {
							_submitObj.sign = _submitObj.province + _submitObj.town + _submitObj.nearAddress;
						} else {
							_submitObj.sign = _submitObj.province + _submitObj.city + _submitObj.town + _submitObj.nearAddress;
						}
					} else {
						cmp.notification.toast(cmp.i18n("Attendance.label.locateFail") , "center");
					}
					//等待地址加载完成了再初始化后续的页面dom事件
					cmp.dialog.loading(false);
				});
			});//end of AMAP
		});
	} 
	/**
	 * 设置当前位置信息
	 * @param {Object} selectdata
	 */
	var setPosition = function(selectdata,ctx){
    	savePosition(selectdata);
    	getAddress(selectdata);
        document.querySelector(".attendance-address").innerHTML = selectdata.name;
	}
	
	var POSITION = "addressInfo";
	
	/**
	 * 保存当前位置到sessionStorage
	 */
	var savePosition = function(addressInfo){
		if(addressInfo){
			cmp.storage.save(POSITION,cmp.toJSON(addressInfo),true);
		}
	}
	
	/**初始化--绑定页面事件*/
	function initEvent() {
		var addressInit = false;
		var addressComponent;
		var params = cmp.href.getParam();
		var isModify = params.isModify;
		if(isModify){//如果是签到修改,绑定位置定位事件
			var m = document.body.querySelector(".index-location .modify");
			m.style.display = "block";
			cmp("body").on("tap",".index-location .modify",function(){
				document.querySelector("#submit_textarea").blur();
				setTimeout(function(){
					var params = cmp.href.getParam();
					var addressInfo = params.selectdata;
					if(!addressInfo){
						cmp.notification.alert(cmp.i18n("Attendance.label.locating"),function(){},cmp.i18n("Attendance.message.warn"),cmp.i18n("Attendance.message.confirm"));
						return;
					}
					if(!addressComponent){
						cmp.asyncLoad.js([commonPath+"/cmp-resources/lbs/js/lbs-address.js" + $buildversion],function(){					
							addressComponent = new LBSAddress({
								shownodata : false,
								coordinate : {longitude:addressInfo.location.lng,latitude:addressInfo.location.lat},
								title : {
									left:{text:cmp.i18n("Attendance.label.back")},
									right : {text:cmp.i18n("Attendance.message.confirm"),click:function(selectdata){
										setPosition(selectdata);
										return true;
									}},
									center:  {text:cmp.i18n("Attendance.label.choose")}
								}
							});
							addressComponent.open();
						});//end of 
					}else{
						addressComponent.open();
					}
				},200);
			});
		}
		//提交按钮
		cmp("body").on("tap", "#attendance-right", validateAndSubmit);
		if (_params.permission.cameraEnable == true) {
			//打开拍照页面
			cmp("body").on("tap", ".attendance-camera", function(){
				if(cmp.lbs){
					openCamera();
				}else{
					cmp.asyncLoad.js([cmpPath+"/js/cmp-lbs.js" + $buildversion],function(){
						openCamera();
					});
				}
			});
			//点击页面图片+号时弹出
			cmp("body").on("tap", ".img-add", function(){
				if(cmp.lbs){
					openCamera();
				}else{
					cmp.asyncLoad.js([cmpPath+"/js/cmp-lbs.js" + $buildversion],function(){
						openCamera();
					});
				}
			});
		}
		//＠他人打开选人页面
		cmp("body").on("tap", ".attendance-at", function(){
			if(cmp.selectOrg){
				attendanceCommon.throttle(openAt,window);
			}else{
				cmp.asyncLoad.css([cmpPath+"/css/cmp-selectOrg.css" + $buildversion]);
				cmp.asyncLoad.js([cmpPath+"/js/cmp-selectOrg.js" + $buildversion],function(){													
					attendanceCommon.throttle(openAt,window);
				});
			}
		});
		//页面底部动态化
		var record_btn_cont = document.querySelector('.submit-footer');
		cmp.footerAuto(record_btn_cont);
		//语音操作
		if(_params.permission.recordEnable){
			//页面语音操作
			var record = record_btn_cont.querySelector('.record');
			var recordAudio;
			var startTime,endTime;
			var recordComponent = cmp.SubmitRecord(record, {
				touchstart: function () {//录音
					var uuid = cmp.buildUUID();
					cmp.audio.startRecord({
						 url:cmp.os.android ? "cmp_recording_" + uuid + ".wav" : cordova.file.tempDirectory + "cmp_recording" + uuid + ".wav",
				         success:function(src){
							console.log(src);
				         },
				        error:function(e){
				            console.log(e);
				        }
				    });
				},
				touchend: function (action) {//录音结束
					cmp.audio.stopRecord({
				         success:function(src){
							//手指上滑取消录音
							if(action && !action.recording) return;
							times = action.times;
							src = cmp.os.android ? cordova.file.externalRootDirectory + src : src;
							var result = {
								src : src,
								times : times
							}
							if(result == null){
								cmp.notification.toast(cmp.i18n("Attendance.label.recordFail"), "center");
								return;
							}
							if (document.querySelector(".attendance-record-value")) {
								//如果此前已经有录音，则弹出提示
								cmp.notification.confirm(cmp.i18n("Attendance.message.override"), function (e) {
									if (e == 1) {
										if(cmp.att){
											addRecord(result,true);
										}else{													
											cmp.asyncLoad.js([cmpPath+"/js/cmp-att.js" + $buildversion],function(){													
												addRecord(result,true);
											});
										}
									}
								}, null, [cmp.i18n("Attendance.message.cancel"),cmp.i18n("Attendance.message.confirm")]);
							} else {
								//如果此前无录音，则直接保存
								if(cmp.att){
									addRecord(result);
								}else{													
									cmp.asyncLoad.js([cmpPath+"/js/cmp-att.js" + $buildversion],function(){													
										addRecord(result);
									});
								}
							}
				         },
				        error:function(e){
				            console.log(e);
				        }
				    });
				}
			});
			//输入框获得焦点的时候隐藏录音组件
			document.querySelector("#submit_textarea").addEventListener("focus",function(){
				recordComponent.cancel();
			});
			//语音文件点击
			cmp("body").on("tap", ".submit-record-file-a", openRecord);
		}
		//点击常用语按钮，添加常用语到文本框
		var lists = document.querySelector('#bottomPopover').querySelectorAll('.cmp-table-view-cell');
		cmp.each(lists, function (i, terget) {
			lists[i].addEventListener('tap', function () {
				cmp('#bottomPopover').popover("toggle");
				var textarea = document.querySelector('textarea');
				insertValue(textarea, this.innerText.replace(/(^\s*)|(\s*$)/g, ""));
			}, false);
		});
		
		if(cmp.os.android){ 
			var Popover = document.querySelector('#bottomPopover');
			var submit_footer_action = document.querySelector('.submit-footer-action');
			var useful = submit_footer_action.querySelector('.useful');
			useful.addEventListener('tap',function(){
				setTimeout(function(){
					if(Popover.classList.contains('cmp-active')){
						Popover.style.top="initial";
						Popover.style.bottom="58px";
					} 
				},500);
			
			},false);
		}
		
		
		//添加图片删除事件
		cmp("body").on("tap",".img-all .checkin-delete-icon",function(){
			var self = this;
			cmp.notification.confirm(cmp.i18n("Attendance.message.deletePicture"), function (e) {
				if (e == 1) {
					var fileId = self.getAttribute("fileId");
					var index = _params.imgs.indexOf(fileId);
					_params.imgs.splice(index, 1);
					self.parentNode.remove();
					refreshPage();
				}
			}, null, [cmp.i18n("Attendance.message.cancel"),cmp.i18n("Attendance.message.confirm")]);
		})
		//调度大图查看
		cmp("body").on("tap",".img-all img",function(){
			var imgSrc = this.src;
			if(cmp.sliders){
				cmp.sliders.addNew([imgSrc]);
				cmp.sliders.detect(0);
			}else{
				cmp.asyncLoad.css([cmpPath+"/css/cmp-sliders.css" + $buildversion]);
				
				if(cmp.att){
					cmp.asyncLoad.js([cmpPath+"/js/cmp-sliders.js" + $buildversion],function(){
						cmp.sliders.addNew([imgSrc]);
						cmp.sliders.detect(0);
					});
				}else{
					cmp.asyncLoad.js([cmpPath+"/js/cmp-sliders.js" + $buildversion,cmpPath+"/js/cmp-att.js" + $buildversion],function(){
						cmp.sliders.addNew([imgSrc]);
						cmp.sliders.detect(0);
					});
				}
				
			}
		})
		
		//添加语音删除事件
		cmp("body").on("tap",".submit-record-file .checkin-delete-icon",function(){
			var self = this;
			cmp.notification.confirm(cmp.i18n("Attendance.message.deleteRecord"), function (e) {
				if (e == 1) {
					document.querySelector(".submit-record-file").remove();
					_params.records = null;
					refreshPage();
				}
			}, null, [cmp.i18n("Attendance.message.cancel"),cmp.i18n("Attendance.message.confirm")]);
		})

		//添加文本框输入字数监听
		document.querySelector("#submit_textarea").addEventListener("input", function(){
			var num = this.value.length;
			if(num > 140){
				cmp.notification.toast(cmp.i18n("Attendance.message.backupWordNo",[num]), "center");
			}
		});
		
		//软键盘弹起
		cmp('body').on('focusin','#submit_textarea',function(){
			document.querySelector('#attendFooter .container-footer').style.display = 'none';
		});
		//软键盘收起
		cmp('body').on('focusout','#submit_textarea',function(){
			document.querySelector('#attendFooter .container-footer').style.display = 'block';
		});
		//处理andriod软键盘事件
		var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
		window.onresize = function(){
			var nowClientHeight = document.documentElement.clientHeight || document.body.clientHeight;
		    if (clientHeight - nowClientHeight > 50) {
		        document.querySelector('#attendFooter .container-footer').style.display = 'none';
		    }
		    else {
		        document.querySelector('#attendFooter .container-footer').style.display = 'block';
		    }
		}
	}

	function addRecord(result,isoverride){
		_upload({
			url: result.src,
			extData: { applicationCategory: 36 },
			success: function (atts) {
				_params.records = [];
				for (var i = 0; i < atts.length; i++) {
					_params.records.push(atts[i].fileUrl);
				}
				
				//TODO ------防提交太快，将附件提交之后再显示在此，后续还要再改造
				_params.recordTime = result.times;
				if(_params.record_tpl == null){
					_params.record_tpl = document.querySelector("#record_tpl").innerHTML;
				}
				var fileContainer = document.querySelector(".submit-scroll");
				if(isoverride == true){
					fileContainer.querySelector(".submit-record-file").remove();
				}
				fileContainer.insertAdjacentHTML("afterBegin",cmp.tpl(_params.record_tpl, result));
				refreshPage();
				//TODO ------ 
			},
			error: function (error) {console.log("upload record error")}
		});
		
	}
	
	/**上传附件代码*/
	function _upload(options) {
		cmp.att.upload({
			url: cmp.serverIp + '/seeyon/rest/attachment?option.n_a_s=1',  //附件上传的服务器地址
			fileList: [{
				filepath: options.url,
				fileId: cmp.buildUUID()
			}],//需要上传的附件列表
			title: "",  	//上传进度显示名称
			extData: "",
			progress: function (result) {
				console.log("progress↓");
				console.log(result.pos);  //0~1的小数，即上传进度的百分比
			},
			success: function (result) {  //服务器端返回的相应数据
				console.log("upload success↓");
				var atts = JSON.parse(result.response).atts;
				console.log(atts);
				if (options.success) {
					options.success(atts);
				}
			},
			error: function (error) { //服务器异常
				console.log("upload error:" + error);
				if (options.error) {
					options.error(error);
				}
			}
		});
	}

	/**回到上一页弹出确认框*/
	function goBackConfirm() {
		var remark = document.querySelector("#submit_textarea").value;
		if(remark != "" || (_params.imgs && _params.imgs.length > 0) || (_params.records && _params.records.length > 0)){
			cmp.notification.confirm(cmp.i18n("Attendance.message.clearup"), function (e) {
				if (e == 1) {
					goback();
				}
			}, null, [cmp.i18n("Attendance.message.cancel"),cmp.i18n("Attendance.message.confirm")]);
		}else{
			goback();
		}
	}

	/*回到首页*/
	function goback(params) {
		if(params == null){
			params = {};
		}
		setTimeout(function(){
			cmp.href.back();
		},200);
	}

	/**校验输入有效性及提交数据*/
	function validateAndSubmit() {
		var params = cmp.href.getParam();
		
		//设备信息
		var deviceInfo = cmp.device.info() || {};
		_submitObj.deviceId = deviceInfo.uuid;

		_submitObj.remark = document.querySelector("#submit_textarea").value;
		var emoji =cmp.Emoji();
		//判断是否是emoji
		if(emoji.isEmojiCharacter(_submitObj.remark)){
			_submitObj.remark = emoji.EmojiToString(_submitObj.remark);
		}
		_submitObj.receiveIds = "";
		if (_params.selectids) {
			var arrays = _params.selectids.split(",");
			if (arrays.length > 0) {
				for (var i = 0; i < arrays.length; i++) {
					var idstr = arrays[i];
					var id = idstr.substring(0, idstr.indexOf("|"));
					var name = idstr.substring(idstr.indexOf("|") + 1);
					if (_submitObj.remark.indexOf(" @" + name) >= 0) {
						if (_submitObj.receiveIds == "") {
							_submitObj.receiveIds = id;
						} else {
							_submitObj.receiveIds += "," + id;
						}
					}
				}
			}
		}

		_submitObj.fileIds = [];
		if (_params.imgs != null) {
			_submitObj.imgNum = _params.imgs.length;
			_submitObj.fileIds = _submitObj.fileIds.concat(_params.imgs);
		}
		if (_params.records != null) {
			_submitObj.recordInfo = cmp.toJSON({time : _params.recordTime});
			_submitObj.recordNum = _params.records.length;
			_submitObj.fileIds = _submitObj.fileIds.concat(_params.records);
		}
		//防止重复提交
		if(!_params.checkSubmitFlag){
			cmp.notification.toast(cmp.i18n("Attendance.message.savingAttendance"), "center",2000,1);
			return;
		}
		_params.checkSubmitFlag = false;
		if(params.isModify){
			//修改提交
			_submitObj.attendanceId = params.attendanceId;
			_submitObj.type = params.type;
			_submitObj.source = 2;
			_submitObj.punchType = params.punchType;
			_submitObj.fixTime = params.fixTime
			$s.Attendance.updateAttendance({}, _submitObj, {
				success: function (ret) {
					_params.checkSubmitFlag = true;
					if (ret.success == true) {
						cmp.storage.save("submit_success",true,true);
						attendanceCommon.fireWebviewEvent({
							isRefresh : true
						});
						goback();
					} else {
						cmp.notification.toast(ret.msg, "center");
					}
				}, error: function (e) {
					_params.checkSubmitFlag = true;
					attendanceCommon.dealAjaxError(e);
				}
			});
		}else{
			_submitObj.source = 2;
			_submitObj.type = params.type;
			_submitObj.fixTime = params.fixTime;
			_submitObj.punchType = params.punchType;
			$s.Attendance.saveAttendance({}, _submitObj, {
				success: function (ret) {
					_params.checkSubmitFlag = true;
					if (ret.success == true) {
						cmp.storage.save("submit_success",true,true);
						attendanceCommon.fireWebviewEvent({
							isRefresh : true
						});
						goback();
					} else {
						cmp.notification.toast(ret.msg, "center");
					}
				}, error: function (e) {
					_params.checkSubmitFlag = true;
					attendanceCommon.dealAjaxError(e);
				}
			});
		}

	}

	/**打开拍照组件*/
	function openCamera() {
		if (_params.imgs != null && _params.imgs.length >= 9) {
			cmp.notification.toast(cmp.i18n("Attendance.message.pic9"), "center");
			return;
		}
		//签到地址：待用
		var address = _submitObj.sign;
		var targetServer = cmp.serverIp;
		var uploadUrl = targetServer + '/seeyon/rest/attachment?option.n_a_s=1';
		var serverDateUrl = targetServer + '/seeyon/rest/cmplbs/servertime';
		
		cmp.dialog.loading(cmp.i18n("Attendance.message.uploading"));
		cmp.lbs.takePicture({
			uploadPicUrl: uploadUrl,
			serverDateUrl: serverDateUrl,
			userName: currentUser && currentUser.name ? currentUser.name : '',
			location: address,
			success: function (lbsData) {
				if (typeof lbsData == 'string') {
					lbsData = JSON.parse(lbsData);
				}
				if (lbsData) {
					//上传附件信息放入缓存中
					var attachment = lbsData.listAttachment[0];
					if (_params.imgs == null) {
						_params.imgs = [];
					}
					_params.imgs.push(attachment.fileUrl);
					
					if(_params.img_tpl == null){
						_params.img_tpl = document.querySelector("#img_tpl").innerHTML;
					}
					
					//创建图片Dom
					var imgContainer = document.querySelector(".submit-img .img-all");
					imgContainer.insertAdjacentHTML("beforeEnd",cmp.tpl(_params.img_tpl,{src:attachment.localSource,fileId:attachment.fileUrl}));
					refreshPage();
					cmp.dialog.loading(false);
				}
			},
			cancel : function(){
				cmp.dialog.loading(false);
			},
			error: function (err) {
				cmp.dialog.loading(false);
				console.log(err);
				cmp.notification.toast(cmp.i18n("Attendance.message.picError") + err.msg, "center");
			}
		});
		
	}

	var selectOrgObj = null;
	/**＠他人打开选人页面*/
	function openAt() {		
		var excludeData = [];
		if(currentUser){
			//不能选自己
			excludeData.push({id:currentUser.id,name:currentUser.name,type:"member",disable:true});
		}
		if(selectOrgObj){
			//清空上一次的选人情况			
			cmp.selectOrgDestory(selectOrgObj.id);
		}
		selectOrgObj = cmp.selectOrg("select-member", {
			type: 2,
			excludeData : excludeData,
			jump: false,
			maxSize: -1,
			minSize: 1,
			selectType: 'member',
			callback: function (result) {
				var resultObj = JSON.parse(result);
				var orgResult = resultObj.orgResult;
				if (orgResult.length > 0) {
					var selectids = "";
					var selectName = "";
					for (var i = 0; i < orgResult.length; i++) {
						var orgResultObj = orgResult[i];
						if (i > 0) {
							selectids += ",";
						}
						selectids += orgResultObj.id + "|" + orgResultObj.name;
						selectName += " @" + orgResultObj.name;
					}
					var textarea = document.querySelector("textarea");
					insertValue(textarea, selectName);
					_params.selectids = selectids;
				}
			}
		});
	}

	var isPlaying = false;
	/**打开语音操作*/
	function openRecord() {
		if(isPlaying){
			return;
		}
		isPlaying = true;
		document.querySelector(".record").src = "../img/record_play.gif";
		cmp.audio.playVoice({
	         url:this.getAttribute("src"),
	         initSuccess:function(){},
	         success:function(src){
				document.querySelector(".record").src = "../img/record_3.png";
				isPlaying = false;
	         },
	        error:function(e){
	        	isPlaying = false;
	        }
	   });
	}

	/**获取光标文本中的位置*/
	function getPos(selector) {
		var inputor;
		inputor = typeof selector == "object" ? selector : document.querySelector(selector);
		return inputor.selectionStart;
	}
	/**将光标定位到文本中指定位置*/
	function setPos(selector, pos) {
		var inputor;
		inputor = typeof selector == "object" ? selector : document.querySelector(selector);
		inputor.setSelectionRange(pos, pos);
		return inputor;
	}
	/**获取指定光标位置的字符*/
	function getCharacter(selector, pos) {
		var $input, inputValue, c = "";
		$input = typeof selector == "object" ? selector : document.querySelector(selector);
		if (pos === void 0) {
			pos = CollUtils.getPos($input);
		}
		inputValue = $input.value;
		if (inputValue && pos > 0) {
			c = inputValue.slice(pos - 1, pos);
		}
		return c;
	}
	/**在光标指定位置加文字*/
	function insertValue(selector, insertValue) {
		var inputor;
		inputor = typeof selector == "object" ? selector : document.querySelector(selector);
		//inputor.focus();
		var inputValue = inputor.value;
		var pos = getPos(inputor);
		var startStr = inputValue.slice(0, pos);
		var endStr = inputValue.slice(pos || 0);

		inputor.value = startStr + insertValue + " " + endStr;
	}
	/**刷新页面高度（保证能出滚动条） */
	function refreshPage() {

	}



	var AttendanceSubmit = {};
	AttendanceSubmit.init = init;
	window.AttendanceSubmit = AttendanceSubmit;
} (window, document);


; (function (_) {

	/**
	 * 录音接口
	 * options : {
	 * 	 success : function(){},   //录音结束时触发
	 *   error : function(error){} //录音异常时触发
	 * }
	 */
	function RecordAudio(options) {
		var self = this;
		options = options ? options : {};

		var uuid = _.buildUUID();
		var src = _.os.android ? "cmp_recording_" + uuid + ".wav" : cordova.file.tempDirectory + "cmp_recording" + uuid + ".wav";
		var media = new Media(src, function (a) {
			if (options.success) {
				options.success();
			}
			console.log("record mediaSuccess:" + a);
		}, function (error) {
			if (options.error) {
				options.error(error);
			}
			self.error = true;
			console.log("record mediaError:" + error);
		}, function (c) {
			if(c == 2 && options.running){
				options.running();
			}
			console.log("record mediaStatus:" + c);
		});
		self.src = src;
		self.media = media;
	}

	/**
	 * process : function(sec){} //每秒更新一次进度，sec返回录音时间
	 */
	RecordAudio.prototype.start = function (process) {
		var self = this;
		if (self.media) {
			self.media.startRecord();
			self.times = 1;
			self.interval = setInterval(function () {
				self.times++;
				if (process) {
					process(self.times);
				}
			}, 1000)
		}
	}

	RecordAudio.prototype.stop = function () {
		var self = this;
		if (self.media && self.error != true) {
			self.media.stopRecord();
			clearInterval(self.interval);
			self.src = _.os.android ? cordova.file.externalRootDirectory + self.src : self.src;
			return { "src": self.src, "times": self.times };
		}else{
			return null;
		}
	}

	/**
	 * 放音接口
	 * src : 录音文件路径
	 * options : {
	 * 	success : function(){}    //录音结束时触发
	 *  error : function(error){} //异常信息
	 * }
	 */
	function PlayAudio(src, options) {
		options = options ? options : {};
		var media = new Media(src, function () {
			if (options.success) {
				options.success();
			}
			console.log("play finish!");
		}, function (error) {
			if (options.error) {
				options.error(error);
			}
			console.log("play error!");
		}, function (c) {
			console.log("mediaStatus:" + c);
		});
		this.src = src;
		this.media = media;
	}

	PlayAudio.prototype.start = function (callback) {
		var self = this;
		if (self.media) {
			self.media.play();
			if(callback){
				callback();
			}
			console.log("播放语音");
		}
	}

	PlayAudio.prototype.stop = function (callback) {
		var self = this;
		if (self.media) {
			self.media.stop();
			self.media.release();
			if(callback){
				callback();
			}
		}
	}

	_.RecordAudio = RecordAudio;
	_.PlayAudio = PlayAudio;
})(cmp);





(function(_){

    var initDialogBgDiv = function () {
        var dialogBgDiv = document.createElement("div");
        dialogBgDiv.className = "cmp-backdrop";
        dialogBgDiv.addEventListener('touchmove',function(e){
            e.preventDefault();
        },false);
        return dialogBgDiv;
    };

    var RecordTplHtml='<div class="record-btn-cont "><div class="talk"><i18n key="Attendance.label.talk"></i18n></div>' +
            '<div class="record-btn"><span class="iconfont icon-voice"></span></div>' +
            '</div>';
    var Recordlog='<div class="cmp-loading-bg">' +
            '<span class=" see-icon-record-fill icon"></span><span class="checkinicon icon-checkin-record-vol icon vol"></span><span class="cmp-loading-text"><i18n key="Attendance.label.recording"></i18n></span></div>';
    //cmp-spinner
    var Record=function(id, options){
        var self=this;
        self.options = options ? options : {};
        self.btn=(typeof id == "object") ? id : document.querySelector(id);
        self.init();
    };
    Record.prototype.init=function(){
        var self=this;
        self.windowH=CMPFULLSREENHEIGHT;
        self.wrapper=document.createElement('div');
        self.wrapper.className=" submit-footer-record";
        self.wrapper.innerHTML= _.tpl(RecordTplHtml,{});

        self.backDrap=initDialogBgDiv();
        self.recordBtn=self.wrapper.querySelector('.record-btn');
        self.recordDialog=document.createElement('div');
        self.recordDialog.className='cmp-loading cmp-loading-fixed submit-footer-record-status';
        self.recordDialog.innerHTML= _.tpl(Recordlog,{});

        self.event();
    };

    Record.prototype.event=function(){
        var self=this;
        var container = self.btn.parentNode.parentNode;
        //点击语音按钮弹出语音输入
        _.event.click(self.btn,function(){
        	cmp.audio.checkPermission({
				success : function(){
		            self.backDrap.style.zIndex=10;
		            container.insertBefore(self.wrapper,container.querySelector('.container-footer'));
		            _.i18n.detect();
		            self.backDrap.style.backgroundColor="transparent";
		            document.body.appendChild(self.backDrap);
		            setTimeout(function(){
		                self.wrapper.classList.add('cmp-active');
		            },100);
					self.wrapper.parentNode.style.zIndex = '11';
		            self.recordDialog.style.height = self.windowH + "px";
		            self.recordDialog.style.top = 0;
					var submit_footer=document.querySelector('.submit-footer');
				},
				error : function(e){
					cmp.notification.toast(cmp.i18n("Attendance.message.initVoiceError") + e,"center");
				}
			});
        });
        _.event.click(self.backDrap,function(){
            self.cancel();
        });
        
        //点击常用语++++++++++++++++++++
        //var useful=document.querySelector('.submit-footer-action').querySelector('.useful');
        //var footer_mark;
        //useful.addEventListener('tap',function(){
        //    var textarea=document.querySelector('textarea');
        //    var popover=document.querySelector('.cmp-popover');
         //   var footer_record=document.querySelector('.submit-footer-record');
        //    footer_mark = footer_record ? !footer_record.classList.contains('cmp-active') : true;
            //setTimeout(function(){
             //   if(textarea.blur && popover.classList.contains('cmp-active') && footer_mark ){
             //       popover.style.top="410px";
             //   }
            //},200);
        //},false);
        
        var submit_footer_action=document.querySelector('.submit-footer-action');
        submit_footer_action.addEventListener('click',function(e){
        	if(e.target == document.querySelector("div.item.point.record") || e.target == document.querySelector("span.iconfont.icon-voice")){
        		return;
        	}
            self.cancel();
        },false);
        self.backDrap.addEventListener('click',function(){
            self.cancel();
        },false);
        
        //语音按钮如果往上滑动的话++++++++++++++++++
        var StatusText=self.recordDialog.querySelector('.cmp-loading-text');
        var recordIcon=self.recordDialog.querySelector('.icon');
		var vol = self.recordDialog.querySelector('.vol');
		var topPosition = 480;
		var ofheight = self.recordBtn.offsetHeight/2;
        self.recordBtn.addEventListener('touchmove',function(e){
			e.preventDefault();
            var pageY= e.touches[0].pageY;
            if(pageY < (topPosition - ofheight)){
                StatusText.classList.add('move');
                recordIcon.classList.remove('see-icon-record-fill');
                recordIcon.classList.add('icon-checkin-cancel-voice');
                recordIcon.classList.add('checkinicon');
				vol.classList.add('cmp-hidden');
                StatusText.innerHTML = _.i18n("Attendance.message.release");
                self.recording = false;
            }else{
                StatusText.classList.remove('move');
                recordIcon.classList.add('see-icon-record-fill');
                recordIcon.classList.remove('icon-checkin-cancel-voice');
                recordIcon.classList.remove('checkinicon');
                StatusText.innerHTML = _.i18n("Attendance.message.slideup");
				vol.classList.remove('cmp-hidden');
                self.recording = true;
            }
        },false);
        
        //点击开始语音按钮
        self.recordBtn.addEventListener('touchstart',function(e){
			e.preventDefault();
			topPosition = e.target.getBoundingClientRect().top;
            document.body.appendChild(self.recordDialog);
            _.i18n.detect();
            self.recording = true;
			if (self.options.touchstart) {
				self.options.touchstart();
			}
			self.wrapper.querySelector('.talk').innerHTML = '<span class="checkinicon icon-checkin-tape-left"></span><span class="number">0:00</span><span class="checkinicon icon-checkin-tape-right"></span>';
			self.timeObj = {
				minute : 0,
				second : 0,
				total : "0:00"
			}
			self.timer = setInterval(function(){
				self.timeObj.second++;
				if(self.timeObj.second >= 60){
					self.timeObj.minute++;
					self.timeObj.second = 0;
				}
				var showContent = self.timeObj.minute + ":" + self.timeObj.second;
				if(self.timeObj.second < 10){
					showContent = self.timeObj.minute + ":0" + self.timeObj.second;
				}
				if(self.timeObj.minute){
					self.timeObj.total = self.timeObj.minute + "'" + self.timeObj.second;
				}else{
					self.timeObj.total = self.timeObj.second;
				}				
				document.querySelector(".talk span.number").innerHTML = showContent;
			},1000);
        },false);
        self.recordBtn.addEventListener('touchend',function(e){
			e.preventDefault();
        	StatusText.classList.remove('move');
            recordIcon.classList.add('see-icon-record-fill');
            recordIcon.classList.remove('icon-checkin-cancel-voice');
            recordIcon.classList.remove('checkinicon');
            self.wrapper.classList.remove('cmp-active');
            StatusText.innerHTML = _.i18n("Attendance.label.recording");
            
            clearInterval(self.timer);
            self.recordDialog.remove();
			if (self.options.touchend) {
				self.options.touchend({
					recording : self.recording,
					times : self.timeObj.total
				});
			}
			self.wrapper.querySelector('.talk').innerHTML = cmp.i18n("Attendance.label.talk");
			self.backDrap.remove();
        },false);
        self.recordBtn.addEventListener('touchcancel',function(e){
			e.preventDefault();
        	StatusText.classList.remove('move');
            recordIcon.classList.add('see-icon-record-fill');
            recordIcon.classList.remove('icon-checkin-cancel-voice');
            recordIcon.classList.remove('checkinicon');
            StatusText.innerHTML = _.i18n("Attendance.label.recording");
            
            clearInterval(self.timer);
            self.recordDialog.remove();
			if (self.options.touchend) {
				self.options.touchend({
					recording : false
				});
			}
        },false);
    };
    Record.prototype.cancel=function(){
        var self=this;
        self.wrapper.classList.remove('cmp-active');
		var submit_footer=document.querySelector('.submit-footer'); 
        setTimeout(function(){
            self.wrapper.remove();
        },100);
        self.backDrap.remove();
    };

    _.SubmitRecord=function(id,options){
        return new Record(id,options);
    }

})(cmp);