;(function ($, window, iSP, undefined) {

	iSP._showDetail = function ($obj){
		var that = this;
		var signatureId = $obj.attr("signatureId");
		var divid = $obj.attr("divid");
		var _signature = that._getSigngaturesBySignatureId(signatureId);
		_signature[0].signature.divId =divid;
		var config = {
				signatureDiv:$obj,
				id:"kg_showDetailWin",
				content:'',
				width:(320*that.defaults.zoom)+'px',
				title :'<div class="aui_loading"><span>执行中</span></div>',
			    padding:0,
			    ok:false,
			    drag:true,
			    cancel:false,
			    fixed:that.defaults.fixed,
			    lock: that.defaults.lock,
			    background: '#000',
			    opacity: 0.6
				};
		that.dialog = artDialog(config);
		that.getSignInfo({signatures:_signature,callback:that._showDetailCallBack,dialog:that.dialog.config.id,"config":config});
		iSP.winopenEvent();
	};
	
	iSP._showDetailCallBack = function (_data,ps,ips){
		var that = ips;
		if(!_data.error) {
			var dialog = that.dialog;
			if(!dialog.config){
				dialog.config = ps.config;
			}
			var $signatureDiv = dialog.config.signatureDiv;
			var dom =that._getDOM(that.templates.detailHTML);
			var _siganture = _data.properties.signatures[0];
			for(var key in _siganture){
				if(dom[key] !== undefined){
					dom[key].text(_siganture[key]);
				}
			}
			if($signatureDiv.attr("ismodified") === "true"){
				dom.signResult.text("\u6587\u4ef6\u5df2\u88ab\u7be1\u6539");
			}
			else{
				dom.signResult.text("\u6587\u4ef6\u5b8c\u597d\u65e0\u635f");
			}
			if(_siganture.mode != '1'){
				if(that.currentKeysn !== $signatureDiv.attr("keysn")){
					if(!that.defaults.deletable){
						dom.removeSignature.remove();
					}
					dom.runCert.remove();
					dom.certVerify.remove();
				}else{
				}
			}else{
				var keysn = $signatureDiv.attr("keysn");
				if(that.defaults.deletable){
					try{
						var obj = getKeysn();
						if(keysn !=obj.keysn ){
							dom.removeSignature.remove();
						}
					}catch (e) {
					}
				}else{
					dom.removeSignature.remove();
				}
			}
			$signatureDiv.data('mode',_siganture.mode);
			if(that.defaults.certDetail){
				dom.cert.show();
			}
			var _certificate = _data.properties.certificates[0];
			if(_certificate.signed === "false"){
				dom.certTable.hide();
				dom.signVerify.remove();
				dom.certVerify.remove();
				dom.certTip.html(_certificate.errorMsg).show();
			}else{
				if(_siganture.mode == '1'){
					dom.certVerify.remove();
					$signatureDiv.data('signdata',_certificate.signdata);
					$signatureDiv.data('certdata',_certificate.certdata);
				}
				dom.runCert.remove();
				for(var key in _certificate){
					if(dom[key] !== undefined){
						dom[key].text(_certificate[key]);
					}
				}
			}
			var height = dom.content.height();
			dialog.size(that.dialog.config.width,height);
		}else{
			that._alertX(_data.errorMsg); 
			iSP.winClose();
		}
	};
	
	
	iSP._verifyCertCall = function(data,dialog) {
		var that = this;
		if(data.error){
			that._alertX(data.errorMsg);
		}else{
			that._alertX("\u8bc1\u4e66\u9a8c\u8bc1\u6b63\u5e38\uff01");
		}
		
	};
	
	iSP._changePwdCallBack = function (action){
		var that=this;
		var dialog = that._getDialog(action);
		var _s_ps = dialog.config.kgparam;
		var dom = dialog.config.kgdom;
		_s_ps.oldPwd = dom.oldpwdInput.val();
		_s_ps.newPwd = dom.newpwdInput.val();
		if(_s_ps.signName){
			_s_ps.signMethod = "1";
			_s_ps.signVal = _s_ps.signName;
		}else if(_s_ps.signIndex){
			_s_ps.signMethod = "0";
			_s_ps.signVal = _s_ps.signIndex;
		}
		that.ajax(that.urls.changePwdUrl,_s_ps,function(_data){
				if(_s_ps.callback){
					_s_ps.callback(_data);
				}else{
					if(_data.error){
						that._alertX(_data.errorMsg); 
					}else{
						that._alertX("\u5bc6\u7801\u4fee\u6539\u6210\u529f\uff01"); 
						iSP.winClose();
					}
				}
			},true
		);
	};

	iSP.changePwd = function (ps){
		var that = this;
		that.dialog = artDialog({
			content: null,
			id:"kg_changePwdWin",
			title:'\u7535\u5b50\u7b7e\u7ae0',
			width:(300*that.defaults.zoom)+'px',
			padding:10,
			fixed:that.defaults.fixed,
		    lock: that.defaults.lock,
		    ok:false,
		    cancel:false
			});
		var dom = that._getDOM(that.templates.changeHTML);
		if(ps.signName||ps.signIndex){
			dom.keysn.text(ps.keySN+"("+(ps.signName?ps.signName:ps.signIndex)+")");
		}else{
			dom.keysn.text.text(ps.keySN);
		}
		that.dialog.config.kgdom = dom;
		that.dialog.config.kgparam = ps;
		iSP.winopenEvent();
	};

	iSP._delSignatureWin = function (){
		var that = this;
		var $obj = that.dialog.config.signatureDiv;
		that.dialog.close();
		var _ps = {
		    		"signatureId":$obj.attr("signatureId"),
		    		"documentId":$obj.attr("documentid"),
		    		"signVal":$obj.attr('signName'),
		    		'mode':$obj.data('mode')
		    	};
		var delSignatureHTML = that.templates.delSignatureHTML.replace("@SIGNNAME@",$obj.attr("signname"));
		that.dialog = artDialog({
			cancel:false,
			fixed:that.defaults.fixed,
		    lock: that.defaults.lock,
			content: delSignatureHTML,
			id:"kg_delSignatureWin",
			title:'\u64a4\u9500\u7b7e\u7ae0',
			width:(320*that.defaults.zoom)+'px',
			padding:10
			});
		that.dialog.config.kgparam = _ps;
		iSP.winopenEvent();
	};

	iSP._delSignature = function (action){
		if(!kgId("kg_pwdInput222").value){
			iSP._alertX('请输入密码！');
			return;
		}
		var that=this;
		var dialog = that._getDialog(action);
		var _ps = dialog.config.kgparam;
		_ps.keyPassword = kgId("kg_pwdInput222").value;
		var kgparam = dialog.config.kgparam;
		dialog.close();
		if(kgparam.mode == '1'){
			var seal = getSeals();
			if(seal){
				var test = signCryptAPICtrl(_ps.signatureId,_ps.keyPassword);
				if(test){
					_ps.encodedata=that._encodeData(_ps.signatureId+"@kinggrid","lr7V9+0XCEhZ5KUijesavRASMmpz/JcFgNqW4G2x63IPfOy=YudDQ1bnHT8BLtwok");
					that.loadingwin();
					that.deleteSignature(_ps);
				}else{
					iSP._alertX("验证密码失败！");
				}
			}
		}else{
			that.loadingwin();
			that.deleteSignature(_ps,dialog);
		}
		
		
	};
	
	iSP.loadingwin =  function (){
		var that = this;
		var dom = '<div class="aui_loading"><span>执行中</span></div>';
		that.dialog = artDialog({
			fixed:that.defaults.fixed,
		    lock: that.defaults.lock,
		    id:'kgloading',
			content: dom,
			title:'\u7535\u5b50\u7b7e\u7ae0',
			width:'220px',
			padding:10,
		    ok:false,
		    cancel: false
			});
		iSP.winopenEvent();
	};
	iSP.winClose = function(dialog){
		var that = this;
		that.wincloseEvent(dialog);
		dialog?dialog.close():that.dialog.close();
	};
	
	iSP.winopenEvent = function(dialog){
		var that = this;
		//console.log("open:"+(dialog?dialog:that.dialog).config.id);
		if(that.defaults.forceScale){
			if(!document.getElementById('kgviewport')){
				//console.log("add:kgviewport")
				$('head').append('<meta id="kgviewport" content="width=device-width; initial-scale=1.0; user-scalable=no;" />');
			}
		}
	};
	iSP.wincloseEvent = function(dialog){
		var that = this;
		//console.log("close:"+(dialog?dialog:that.dialog).config.id);
		//console.log("forceScale:"+that.defaults.forceScale);
		if(that.defaults.forceScale && 'kgloading' !== that.dialog.config.id){
			//console.log("remove;kgviewport")
			$('#kgviewport').remove();
		}
	};
	
	iSP._showSignatureDiv =  function (config,properties){
		var that = this;
		var dom = null;
		that.dialog = artDialog({
			fixed:that.defaults.fixed,
		    lock: that.defaults.lock,
			content: '',
			id:"kg_showSignatureWin",
			title:'\u7535\u5b50\u7b7e\u7ae0',
			width:(320*that.defaults.zoom)+'px',
			padding:10,
		    ok:false,
		    cancel: false
			});
		that.dialog.show();
		
		var hideEl =[];
		if(config.backGetPwd){
			hideEl.push("noPwd_tr");
			hideEl.push("memory_pwd");
		}
		if(!config.remenberSign){
			hideEl.push("memory_sign");
		}
		if(!config.remenberPwd){
			hideEl.push("memory_pwd");
		}
		dom = that._getDOM(that.templates.signatureHTML,hideEl);
		dom.signnameSelect.focus();
		var keysn = properties.keySN;
		var _signatures=properties.signatures;
		var signnameSelect = dom.signnameSelect[0];
		for(var key=0; key < _signatures.length;key++){
			var signature = _signatures[key];
			var option=new Option(signature.signName,signature.signSn);  
			signnameSelect.options.add(option);  
			option.id = signature.signSn;
			if(config.runSignatureParams.signMethod === '0'){
				option.setAttribute("signname",signature.signIndex);
			}else{
				option.setAttribute("signname",signature.signName);
			}
			option.setAttribute("unique",keysn+"_"+key);
		}
		if(!config.backGetPwd && config.remenberPwd){
			var kg_memory_pwd_text = that._getLocal('kg_memory_pwd_text');
			if(kg_memory_pwd_text!= null){
				dom.pwdInput.val(kg_memory_pwd_text);
				dom.memory_pwd_input.attr("checked",true);
			}
		}
		if(config.remenberSign){
			var signname_val = that._getLocal('kg_memory_sign_text');
			if(signname_val != null ){
				kgId(signname_val).setAttribute("selected",true);
				dom.memory_sign_input.attr("checked",true);
			}
		}
		if(config.runSignatureParams.signValue){
			$("option[signname='"+config.runSignatureParams.signValue+"']").attr("selected",true);
		}
		that.dialog.config.kgdom = dom;
		that.dialog.config.kgparam = config;
		/***/
		//iSP.winopenEvent();
	};
	
	iSP._signVerifyCall = function(data,dialog) {
		var that = this;
		if(data.error){
			that._alertX(data.errorMsg);
		}else{
			that._alertX(data.errorMsg);
		}
		
	};
	if(iSP.defaults.skin === 'blue'){
		
	
	iSP.templates = {
		changeHTML : '<div id="kg_change" class="kg_signature kg_change" style="text-align: center;">'+
				'<table class="kg_form">'+
					'<tr>'+
						'<td class="kg_field">\u5bc6\u94a5\u76d8\uff1a</td>'+
						'<td class="kg_value" id="kg_keysn" >'+
						'</td>'+
					'</tr>'+
					'<tr >'+
						'<td class="kg_field">\u539f\u5bc6\u7801\uff1a</td>'+
						'</td>'+
					'</tr>'+
					'<tr >'+
						'<td class="kg_field">\u65b0\u5bc6\u7801\uff1a</td>'+
						'<td class="kg_value"><input  type="password" class="kg_pwdInput" maxlength="20" name="kg_pwdInput" id="kg_newpwdInput" /> '+
						'</td>'+
					'</tr>'+
					'<tr >'+
						'<td class="kg_field">\u786e\u8ba4\u5bc6\u7801\uff1a</td>'+
						'<td class="kg_value"><input  type="password" class="kg_pwdInput" maxlength="20" name="kg_pwdInput" id="kg_confirmPwdInput" /> '+
						'</td>'+
					'</tr>'+
				'</table>'+
				'<div class="kg_buttons">'+
					/**'<button  class="kg_close" winId="kg_changePwdWin" >&nbsp;\u5173&nbsp;\u95ed&nbsp;</button>'+*/
					'<button class="kg_changePwd" winId="kg_changePwdWin" >&nbsp;\u786e&nbsp;\u5b9a&nbsp;</button>'+
				'</div>'+
		  '</div>',
			
	   signatureHTML : '<div id="kg_showSignature" class="kg_signature kg_showSignature" style="text-align: center;" >'+
				'<table class="kg_form">'+
					'<tr>'+
						'<td class="kg_field">\u7b7e\u7ae0\uff1a</td>'+
						'<td class="kg_value" ><select name="kg_signname" class="kg_select" id="kg_signnameSelect" />'+
						'</td>'+
					'</tr>'+
					'<tr id="kg_noPwd_tr" class="">'+
						'<td class="kg_field">\u5bc6\u7801\uff1a</td>'+
						'<td class="kg_value"><input  type="password" class="kg_pwdInput" maxlength="20" name="kg_pwdInput" id="kg_pwdInput" /> '+
						'</td>'+
					'</tr>'+
				'</table>'+
					'<div class="kg_tip" id="kg_noPwd_div" >'+
						'<label class="inputSpan " id="kg_memory_sign" for="memory_sign_input">'+
							'<input type="checkbox" id="kg_memory_sign_input"  class="kg_inputBox" />\u8bb0\u4f4f\u7b7e\u7ae0</label>'+
						'<label class="inputSpan " for="memory_pwd_input" id="kg_memory_pwd" >'+
							'<input type="checkbox" id="kg_memory_pwd_input"  class="kg_inputBox"  />\u8bb0\u4f4f\u5bc6\u7801</label>'+
					'</div>'+
					'<div class="kg_buttons">'+
						'<button class="kg_runSignature" winId="kg_showSignatureWin" >&nbsp;\u786e&nbsp;\u5b9a&nbsp;</button>'+
					'</div>'+
					'<div class="kg_buttons">'+
						'<button  class="kg_close" winId="kg_showSignatureWin" >&nbsp;\u5173&nbsp;\u95ed&nbsp;</button>'+
					'</div>'+
			  '</div>',
	   delSignatureHTML : '<div id="kg_delSignature" class="kg_signature" >'+
	   				'<table class="kg_form">'+
		   				'<tr>'+
							'<td class="kg_field">\u7b7e\u7ae0\uff1a</td>'+
							'<td id="kg_signname" class="kg_value">@SIGNNAME@'+
							'</td>'+
						'</tr>'+
						'<tr>'+
							'<td class="kg_field">\u5bc6\u7801\uff1a</td>'+
							'<td id="kg_pwd" class="kg_value"><input type="password" maxlength="20" name="kg_pwdInput" id="kg_pwdInput222" /> '+
							'</td>'+
						'</tr>'+
					'</table>'+
					'<div class="kg_buttons">'+
						'<button class="kg_delSignature" winId="kg_delSignatureWin" >&nbsp;\u786e&nbsp;\u5b9a&nbsp;</button>'+
					'</div>'+
					'<div class="kg_buttons">'+
						'<button  class="kg_close" winId="kg_delSignatureWin" >&nbsp;\u5173&nbsp;\u95ed&nbsp;</button>'+
					'</div>'+
			  '</div>',
		detailHTML : '<div class="kg_winDetail" id="kg_winDetail kg_signature" >' +
					'<div class="kg_module " id="kg_module" >' +
						'<div class="kg_tabs">' +
							'<ul>' +
								'<li class="kg_current kg_sign" id="kg_sign" ><a class=" kg_sign kg_tab_a" href="javascript:void(0);"><span>\u7b7e\u7ae0\u4fe1\u606f</span></a></li>' +
								'<li id="kg_cert" class ="kg_cert kg_none" ><a class="kg_a_cert kg_tab_a"  href="javascript:void(0);"><span>\u8bc1\u4e66\u4fe1\u606f</span></a></li>' +
							'</ul>' +
						'</div>' +
					'</div>' +
					'<div class="kg_module kg_content" id="kg_content">' +
						'<div class="kg_signDetail" id="kg_signDetail">' +
							'<table class="kg_table ">'+
								'<tr>'+
									'<td class="kg_field2">\u68c0\u6d4b\u7ed3\u679c\uff1a</td>'+
									'<td id="kg_signResult" class="kg_value">'+
									'</td>'+
								'</tr>'+
								'<tr>'+
									'<td class="kg_field2">\u5e94\u7528\u7a0b\u5e8f\uff1a</td>'+
									'<td id="kg_appName" class="kg_value">'+
									'</td>'+
								'</tr>'+
								'<tr>'+
									'<td class="kg_field2">\u6388\u6743\u5355\u4f4d\uff1a</td>'+
									'<td id="kg_unitName" class="kg_value">'+
									'</td>'+
								'</tr>'+
								'<tr>'+
									'<td class="kg_field2">\u7528\u6237\u540d\u79f0\uff1a</td>'+
									'<td id="kg_userName" class="kg_value">'+
									'</td>'+
								'</tr>'+
								'<tr>'+
									'<td class="kg_field2">\u7b7e\u7ae0\u540d\u79f0\uff1a</td>'+
									'<td id="kg_signName" class="kg_value">'+
									'</td>'+
								'</tr>'+
								'<tr>'+
									'<td class="kg_field2">\u7b7e\u7ae0\u5e8f\u53f7\uff1a</td>'+
									'<td id="kg_signSn" class="kg_value">'+
									'</td>'+
								'</tr>'+
								'<tr>'+
									'<td class="kg_field2">\u7b7e\u7ae0\u65f6\u95f4\uff1a</td>'+
									'<td id="kg_datetime" class="kg_value">'+
									'</td>'+
								'</tr>'+
								'<tr>'+
									'<td class="kg_field2">\u7b7e\u7ae0IP\uff1a</td>'+
									'<td id="kg_signatureIp" class="kg_value">'+
									'</td>'+
								'</tr>'+
							'</table>'+
							'<div class="kg_buttons">'+
								'<button id="kg_removeSignature" class="kg_removeSignature"  winId="kg_showDetailWin" >\u5220\u9664\u7b7e\u7ae0</button>'+
							'</div>'+
							'<div class="kg_buttons">'+
								'<button class="kg_close" winId="kg_showDetailWin">\u5173\u95ed</button>'+
							'</div>'+
						'</div>' +
						'<div class="kg_certDetail kg_none" id="kg_certDetail" >' +
							'<div id="kg_certTip" class="kg_none" style="text-align: center;height:60px;line-height:60px;">'+
								
							'</div>'+
							'<table class="kg_table " id="kg_certTable">'+
								'<tr>'+
									'<td class="kg_field">\u7248\u672c\uff1a</td>'+
									'<td id="kg_version" class="kg_value">'+
									'</td>'+
								'</tr>'+
								'<tr>'+
									'<td class="kg_field">\u9881\u53d1\u8005\uff1a</td>'+
									'<td id="kg_issuerName" class="kg_value">'+
									'</td>'+
								'</tr>'+
								'<tr>'+
									'<td class="kg_field">\u9881\u53d1\u7ed9\uff1a</td>'+
									'<td id="kg_subjectName" class="kg_value">'+
									'</td>'+
								'</tr>'+
								'<tr>'+
									'<td class="kg_field">\u5e8f\u5217\u53f7\uff1a</td>'+
									'<td id="kg_serialNumber" class="kg_value">'+
									'</td>'+
								'</tr>'+
								'<tr>'+
									'<td class="kg_field">\u7b7e\u540d\u7b97\u6cd5\uff1a</td>'+
									'<td id="kg_sigAlgName" class="kg_value">'+
									'</td>'+
								'</tr>'+
								'<tr>'+
									'<td class="kg_field">\u6709\u6548\u8d77\u59cb\u65e5\u671f\uff1a</td>'+
									'<td id="kg_notBefore" class="kg_value">'+
									'</td>'+
								'</tr>'+
								'<tr>'+
									'<td class="kg_field">\u6709\u6548\u7ec8\u6b62\u65e5\u671f\uff1a</td>'+
									'<td id="kg_notAfter" class="kg_value">'+
									'</td>'+
								'</tr>'+
								
							'</table>'+
							
							'<div class="kg_buttons">'+
								'<button id="kg_signVerify" class="kg_signVerify" winId="kg_showDetailWin" >\u7b7e\u540d\u9a8c\u8bc1</button>'+
								'<button id="kg_certVerify" class="kg_certVerify" winId="kg_showDetailWin" >\u8bc1\u4e66\u9a8c\u8bc1</button>'+
								'<button id="kg_runCert"  class="kg_runCert" winId="kg_showDetailWin" >\u6570\u5b57\u7b7e\u540d</button>'+
							'</div>'+
							'<div class="kg_buttons">'+
								'<button  class="kg_close" winId="kg_showDetailWin" >\u5173\u95ed</button>'+
							'</div>'+
						'</div>' +
					'</div>' +
				'</div>'
	};
	}else{
	iSP.templates = {
			changeHTML : '<div id="kg_change" class="kg_signature kg_change" style="text-align: center;">'+
					'<table class="kg_form">'+
						'<tr>'+
							'<td class="kg_field">\u5bc6\u94a5\u76d8\uff1a</td>'+
							'<td class="kg_value" id="kg_keysn" >'+
							'</td>'+
						'</tr>'+
						'<tr >'+
							'<td class="kg_field">\u539f\u5bc6\u7801\uff1a</td>'+
							'<td class="kg_value"><input style="width:145px;" type="password" class="kg_pwdInput" maxlength="20" name="kg_pwdInput" id="kg_oldpwdInput" /> '+
							'</td>'+
						'</tr>'+
						'<tr >'+
							'<td class="kg_field">\u65b0\u5bc6\u7801\uff1a</td>'+
							'<td class="kg_value"><input style="width:145px;" type="password" class="kg_pwdInput" maxlength="20" name="kg_pwdInput" id="kg_newpwdInput" /> '+
							'</td>'+
						'</tr>'+
						'<tr >'+
							'<td class="kg_field">\u786e\u8ba4\u5bc6\u7801\uff1a</td>'+
							'<td class="kg_value"><input style="width:145px;" type="password" class="kg_pwdInput" maxlength="20" name="kg_pwdInput" id="kg_confirmPwdInput" /> '+
							'</td>'+
						'</tr>'+
					'</table>'+
					'<div class="kg_buttons">'+
						'<button  class="kg_close" winId="kg_changePwdWin" >&nbsp;\u5173&nbsp;\u95ed&nbsp;</button>'+
						'<button class="kg_changePwd" winId="kg_changePwdWin" >&nbsp;\u786e&nbsp;\u5b9a&nbsp;</button>'+
					'</div>'+
			  '</div>',
				
		   signatureHTML : '<div id="kg_showSignature" class="kg_signature kg_showSignature" style="text-align: center;" >'+
					'<table class="kg_form">'+
						'<tr>'+
							'<td class="kg_field">\u7b7e\u7ae0\uff1a</td>'+
							'<td class="kg_value" ><select style="width:147px;" name="kg_signname" class="kg_pwdInput" id="kg_signnameSelect" />'+
							'</td>'+
						'</tr>'+
						'<tr id="kg_noPwd_tr" class="">'+
							'<td class="kg_field">\u5bc6\u7801\uff1a</td>'+
							'<td class="kg_value"><input style="width:145px;" type="password" class="kg_pwdInput" maxlength="20" name="kg_pwdInput" id="kg_pwdInput" /> '+
							'</td>'+
						'</tr>'+
					'</table>'+
						'<div class="kg_tip" id="kg_noPwd_div" >'+
							'<label class="inputSpan " id="kg_memory_sign" for="memory_sign_input">'+
								'<input type="checkbox" id="kg_memory_sign_input"  class="kg_inputBox" />\u8bb0\u4f4f\u7b7e\u7ae0</label>'+
							'<label class="inputSpan " for="memory_pwd_input" id="kg_memory_pwd" >'+
								'<input type="checkbox" id="kg_memory_pwd_input"  class="kg_inputBox"  />\u8bb0\u4f4f\u5bc6\u7801</label>'+
						'</div>'+
						'<div class="kg_buttons">'+
							'<button  class="kg_close" winId="kg_showSignatureWin" >&nbsp;\u5173&nbsp;\u95ed&nbsp;</button>'+
							'<button class="kg_runSignature" winId="kg_showSignatureWin" >&nbsp;\u786e&nbsp;\u5b9a&nbsp;</button>'+
						'</div>'+
				  '</div>',
		   delSignatureHTML : '<div id="kg_delSignature" class="kg_signature" >'+
		   				'<table class="kg_form">'+
			   				'<tr>'+
								'<td class="kg_field">\u7b7e\u7ae0\uff1a</td>'+
								'<td id="kg_signname" class="kg_value">@SIGNNAME@'+
								'</td>'+
							'</tr>'+
							'<tr>'+
								'<td class="kg_field">\u5bc6\u7801\uff1a</td>'+
								'<td id="kg_pwd" class="kg_value"><input type="password" maxlength="20" name="kg_pwdInput" id="kg_pwdInput222" /> '+
								'</td>'+
							'</tr>'+
						'</table>'+
						'<div class="kg_buttons">'+
							'<button  class="kg_close" winId="kg_delSignatureWin" >&nbsp;\u5173&nbsp;\u95ed&nbsp;</button>'+
							'<button class="kg_delSignature" winId="kg_delSignatureWin" >&nbsp;\u786e&nbsp;\u5b9a&nbsp;</button>'+
						'</div>'+
				  '</div>',
			detailHTML : '<div class="kg_winDetail" id="kg_winDetail" style="width:320px;height:auto;" >' +
						'<div class="kg_module " id="kg_module" >' +
							'<div class="kg_tabs">' +
								'<ul>' +
									'<li class="kg_current kg_sign" id="kg_sign" ><a class=" kg_sign kg_tab_a" href="javascript:void(0);"><span>\u7b7e\u7ae0\u4fe1\u606f</span></a></li>' +
									'<li id="kg_cert" class ="kg_cert kg_none" ><a class="kg_a_cert kg_tab_a"  href="javascript:void(0);"><span>\u8bc1\u4e66\u4fe1\u606f</span></a></li>' +
								'</ul>' +
							'</div>' +
						'</div>' +
						'<div class="kg_module kg_content" id="kg_content">' +
							'<div class="kg_signDetail" id="kg_signDetail">' +
								'<table class="kg_table ">'+
									'<tr>'+
										'<td class="kg_field2">\u68c0\u6d4b\u7ed3\u679c\uff1a</td>'+
										'<td id="kg_signResult" class="kg_value">'+
										'</td>'+
									'</tr>'+
									'<tr>'+
										'<td class="kg_field2">\u5e94\u7528\u7a0b\u5e8f\uff1a</td>'+
										'<td id="kg_appName" class="kg_value">'+
										'</td>'+
									'</tr>'+
									'<tr>'+
										'<td class="kg_field2">\u6388\u6743\u5355\u4f4d\uff1a</td>'+
										'<td id="kg_unitName" class="kg_value">'+
										'</td>'+
									'</tr>'+
									'<tr>'+
										'<td class="kg_field2">\u7528\u6237\u540d\u79f0\uff1a</td>'+
										'<td id="kg_userName" class="kg_value">'+
										'</td>'+
									'</tr>'+
									'<tr>'+
										'<td class="kg_field2">\u7b7e\u7ae0\u540d\u79f0\uff1a</td>'+
										'<td id="kg_signName" class="kg_value">'+
										'</td>'+
									'</tr>'+
									'<tr>'+
										'<td class="kg_field2">\u7b7e\u7ae0\u5e8f\u53f7\uff1a</td>'+
										'<td id="kg_signSn" class="kg_value">'+
										'</td>'+
									'</tr>'+
									'<tr>'+
										'<td class="kg_field2">\u7b7e\u7ae0\u65f6\u95f4\uff1a</td>'+
										'<td id="kg_datetime" class="kg_value">'+
										'</td>'+
									'</tr>'+
									'<tr>'+
										'<td class="kg_field2">\u7b7e\u7ae0IP\uff1a</td>'+
										'<td id="kg_signatureIp" class="kg_value">'+
										'</td>'+
									'</tr>'+
								'</table>'+
								'<div class="kg_buttons">'+
									'<button class="kg_close" winId="kg_showDetailWin">\u5173\u95ed</button>'+
									'<button id="kg_removeSignature" class="kg_removeSignature"  winId="kg_showDetailWin" >\u5220\u9664\u7b7e\u7ae0</button>'+
								'</div>'+
							'</div>' +
							'<div class="kg_certDetail kg_none" id="kg_certDetail" >' +
								'<div id="kg_certTip" class="kg_none" style="text-align: center;height:60px;line-height:60px;">'+
									
								'</div>'+
								'<table class="kg_table " id="kg_certTable">'+
									'<tr>'+
										'<td class="kg_field">\u7248\u672c\uff1a</td>'+
										'<td id="kg_version" class="kg_value">'+
										'</td>'+
									'</tr>'+
									'<tr>'+
										'<td class="kg_field">\u9881\u53d1\u8005\uff1a</td>'+
										'<td id="kg_issuerName" class="kg_value">'+
										'</td>'+
									'</tr>'+
									'<tr>'+
										'<td class="kg_field">\u9881\u53d1\u7ed9\uff1a</td>'+
										'<td id="kg_subjectName" class="kg_value">'+
										'</td>'+
									'</tr>'+
									'<tr>'+
										'<td class="kg_field">\u5e8f\u5217\u53f7\uff1a</td>'+
										'<td id="kg_serialNumber" class="kg_value">'+
										'</td>'+
									'</tr>'+
									'<tr>'+
										'<td class="kg_field">\u7b7e\u540d\u7b97\u6cd5\uff1a</td>'+
										'<td id="kg_sigAlgName" class="kg_value">'+
										'</td>'+
									'</tr>'+
									'<tr>'+
										'<td class="kg_field">\u6709\u6548\u8d77\u59cb\u65e5\u671f\uff1a</td>'+
										'<td id="kg_notBefore" class="kg_value">'+
										'</td>'+
									'</tr>'+
									'<tr>'+
										'<td class="kg_field">\u6709\u6548\u7ec8\u6b62\u65e5\u671f\uff1a</td>'+
										'<td id="kg_notAfter" class="kg_value">'+
										'</td>'+
									'</tr>'+
									
								'</table>'+
								'<div class="kg_buttons">'+
									'<button  class="kg_close" winId="kg_showDetailWin" >\u5173\u95ed</button>'+
									'<button id="kg_signVerify" class="kg_signVerify" winId="kg_showDetailWin" >\u7b7e\u540d\u9a8c\u8bc1</button>'+
									'<button id="kg_certVerify" class="kg_certVerify" winId="kg_showDetailWin" >\u8bc1\u4e66\u9a8c\u8bc1</button>'+
									'<button id="kg_runCert"  class="kg_runCert" winId="kg_showDetailWin" >\u6570\u5b57\u7b7e\u540d</button>'+
								'</div>'+
							'</div>' +
						'</div>' +
					'</div>'
		};
	}
}(window.jQuery, this,iSP));