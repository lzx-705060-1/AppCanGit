cmp.ready(function() {
             $("#title").html(cmp.storage.get("link_title"));
            var titHeight = $('#header').offset().height;
			var title = cmp.storage.get("link_title");
			//console.log(title);
			//console.log(title.indexOf('[沟通]'));
			if(title.indexOf('[沟通]')==0){
			    $("#submit").removeClass('ub');
			    $("#submit").hide();
			    $("#back").removeClass('ub');
			    $("#back").hide();
			    $("#over").removeClass('ub');
			    $("#over").hide();
			    $("#gotong").removeClass('ub');
			    $("#gotong").hide();
			    $("#zhuanb").removeClass('ub');
			    $("#zhuanb").hide();
			    $("#cxgt").removeClass('ub');
			    $("#cxgt").hide();
			}else{
			    $("#tijiao").removeClass('ub');
			    $("#tijiao").hide();
			}
			if (cmp.storage.get('oldformid').indexOf("C-CW-018")!=-1)
			{
			    $("#back").removeClass('ub');
			    $("#back").hide();
			    $("#over").removeClass('ub');
			    $("#over").hide();  
			}
        });
        /*var tabview = appcan.tab({
            selector : "#footer",
            hasIcon : true,
            hasAnim : false,
            hasLabel : true,
            hasBadge : false,
            data : [{
                label : "提交",
                icon : "fa-check"
            }, {
                label : "回退",
                icon : "fa-undo ",
                badge : "1"
            }, {
                label : "终止",
                icon : "fa-ban"
            }]
        });*/
		$("#nav-left").on("tap", function(){
            cmp.href.back();
        })
        
        function openPopover() {
            var titHeight = $('#header').offset().height;
            var s = window.getComputedStyle($('#page_0')[0], null);
            var w = parseInt(s.width);
            var h = parseInt(s.height);
            uexWindow.openPopover("bh_content", "0", "bh_content.html", "", "0", titHeight, w, h, "5", "0");
        }
        
        function openSubmitPopover() {
            var titHeight = $('#header').offset().height;
            var s = window.getComputedStyle($('#page_0')[0], null);
            var w = parseInt(s.width);
            var h = parseInt(s.height);
            uexWindow.openPopover("old_submit_content", "0", "old_submit_content.html", "", "0", titHeight, w, h, "5", "0");
        }
		
		var platform = cmp.storage.get('platform');
		function showButton(data) {
		    console.log(data);
		}
		
		function checkGT(){
		    var r = false ;
		    var oid = cmp.storage.get("link_uniqueid").toUpperCase();
		    var serviceUrl = cmp.storage.get('serviceUrl');
		    var phoneid = cmp.storage.get('phoneid');
		    var olduser = cmp.storage.get('olduser');
		    var oldpwd = cmp.storage.get('oldpwd');
		    var url = serviceUrl+"/servlet/PublicServiceServlet?message_id=oldoa_cz&stype=check";
		    url = url + "&username=" + olduser + "&password=" + oldpwd + "&PHONE_ID=" + phoneid + "&oid=" + oid;
		    ajaxJson(url, function(data){
		        console.log(data);
		        if(data.Is_submit.RESULT){
		            cmp.notification.alert({
		                title : "提醒",
		                content : "您有沟通还未返回所有意见",
		                buttons : '确定',
		                callback : function(err, data, dataType, optId) {
		                    console.log(err, data, dataType, optId);
		                    r = true;
		                    }
		            });
		            r = true;
		        }
		    });
		    return r;
		}
		
		$("#tijiao").on("tap", function(){
		    //需要判断能不能提交
		    var msg = cmp.storage.get('msg');
		   /*
		    if(msg!=''){
		        cmp.notification.alert({
		            title : "提醒",
		            content : msg,
		            buttons : '确定',
		            callback : function(err, data, dataType, optId) {
		                console.log(err, data, dataType, optId);
		                return ;
		            }
		        });
		        return ;
		    }
		    */
		    if(!checkOpin()){
		        return ;
		    }
		    var oid = cmp.storage.get("link_uniqueid").toUpperCase();
		    var content = $("#content").val();
		    var serviceUrl = cmp.storage.get('serviceUrl');
		    var phoneid = cmp.storage.get('phoneid');
		    var olduser = cmp.storage.get('olduser');
		    var oldpwd = cmp.storage.get('oldpwd');
		    var StationGUID = cmp.storage.get('StationGUID', StationGUID);
		    var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=oldoa_jh&passValue=&stype=jbtj";
		    url = url + "&username=" + olduser + "&password=" + oldpwd + "&PHONE_ID=" + phoneid + "&content=" + content+"&oid="+oid;
		    url = url + "&StationGUID=" + StationGUID;
		    url = url + "&platform=" + platform;
		    ajaxJson(url,function(data){
		        console.log(data);
		        cmp.notification.alert({
		            title : "提醒",
		            content : "提交成功",
		            buttons : '确定',
		            callback : function(err, data, dataType, optId) {
		                console.log(err, data, dataType, optId);
		                cmp.storage.save('dbtabindex',1);
		                cmp.href.next({
		                    name : 'myApply',
		                    data : 'myApply.html',
		                    aniId : 10,
		                    type:4
		                });
		                appcan.window.evaluateScript({
		                    name : 'old_banli',
		                    scriptContent : 'cmp.href.back()'
		                });
		                appcan.window.evaluateScript({
		                    name : 'gw_atricle',
		                    scriptContent : 'cmp.href.back()'
		                });
		            }
		        });
		    });            
		})
		
		$("#submit").on("tap", function(){
		    //if(!checkOpin()){
		    //    return ;
		    //}
		    //需要判断能不能提交
		    var msg = cmp.storage.get('msg');
		    if(msg!=''&&msg!=null){
		        cmp.notification.alert({
		            title : "提醒",
		            content : msg,
		            buttons : '确定',
		            callback : function(err, data, dataType, optId) {
		                console.log(err, data, dataType, optId);
		                return ;
		            }
		        });
		        return ;
		    }
		    if(checkGT()) return;
		    var oid = cmp.storage.get("link_uniqueid").toUpperCase();
		    var serviceUrl = cmp.storage.get('serviceUrl');
		    var phoneid = cmp.storage.get('phoneid');
		    var olduser = cmp.storage.get('olduser');
		    var oldpwd = cmp.storage.get('oldpwd');
		    var StationGUID = cmp.storage.get('StationGUID', StationGUID);
		    var url = serviceUrl+"/servlet/PublicServiceServlet?message_id=oldoa_cz&passValue=1&stype=submit";
		    url = url + "&username=" + olduser + "&password=" + oldpwd + "&PHONE_ID=" + phoneid + "&oid=" + oid;
		    url = url + "&content="+$("#content").val();
		    url = url + "&StationGUID=" + StationGUID;
		    url = url + "&platform=" + platform;
		    //console.log(url);
		    ajaxJson(url,httpsucess);
		})
		
		$("#gotong").on("tap", function(){
		    if(!checkOpin()){
		        return ;
		    }
		    cmp.storage.save('content',$("#content").val());
		    cmp.href.next({
		            name : 'old_bmry',
		            data : 'old_bmry.html',
		            aniId : 10
		        });
		})
		
		$("#cxgt").on("tap", function(){
		    if(!checkOpin()){
		        return ;
		    }
		    cmp.notification.alert({
		        title : "提醒",
		        content : "您确定要撤销沟通吗？",
		        buttons : ['确定', '取消'],
		        callback : function(err, data, dataType, optId) {
		            console.log(err, data, dataType, optId);
		            if (data == 0) {
		                var oid = cmp.storage.get("link_uniqueid").toUpperCase();
		                var serviceUrl = cmp.storage.get('serviceUrl');
		                var phoneid = cmp.storage.get('phoneid');
		                var olduser = cmp.storage.get('olduser');
		                var oldpwd = cmp.storage.get('oldpwd');
		                var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=oldoa_jh&stype=cxgt";
		                url = url + "&username=" + olduser + "&password=" + oldpwd + "&PHONE_ID=" + phoneid + "&content=" + $("#content").val()+"&oid="+oid;
		                url = url + "&platform=" + platform;
		                ajaxJson(url, function(data){
		                    console.log(data);
		                    if(data.cxsubmit.RESULT){
		                        cmp.notification.alert({
		                            title : "提醒",
		                            content : data.cxsubmit.RESULT,
		                            buttons : '确定',
		                            callback : function(err, data, dataType, optId) {
		                                console.log(err, data, dataType, optId);
		                                cmp.storage.save('dbtabindex',1);
		                                
		                               
		                            }
		                        });
		                    }
		                });
		            }
		        }
		    });
		})
		
		$("#zhuanb").on("tap", function(){
		    if(!checkOpin()){
		        return ;
		    }
		    if(checkGT()) return;
		    cmp.storage.save('content',$("#content").val());
		     cmp.storage.save('submitType',"zb");
		    cmp.href.next({
		            name : 'old_dbmry',
		            data : 'old_dbmry.html',
		            aniId : 10
		        });
		})
		
		function httpsucess(data){
		    console.log(data);
		    if (data['stepXml'].DATA.step.billcode=='true')
		    {
		       cmp.notification.alert({
		            title : "提醒",
		            content : "此单据审批通过后需要调用外部接口，移动端审批暂不支持，请到电脑端审批。",
		            buttons : '确定',
		            callback : function(err, data, dataType, optId) {
		                console.log(err, data, dataType, optId);
		                cmp.storage.save('dbtabindex',1);
		                appcan.window.evaluateScript({
		                    name : 'old_banli',
		                    scriptContent : 'cmp.href.back()'
		                });
		                appcan.window.evaluateScript({
		                    name : 'gw_atricle',
		                    scriptContent : 'cmp.href.back()'
		                });
		                cmp.href.next({
		                    name : 'myApply',
		                    data : 'myApply.html',
		                    aniId : 10,
		                    type:4
		                });
		            }
		        });  
		    }
		    if (data['submit']&&data['submit'].RESULT=='true') {
		        cmp.notification.alert({
		            title : "提醒",
		            content : "办理成功",
		            buttons : '确定',
		            callback : function(err, data, dataType, optId) {
		                console.log(err, data, dataType, optId);
		                cmp.storage.save('dbtabindex',1);
		                appcan.window.evaluateScript({
		                    name : 'old_banli',
		                    scriptContent : 'cmp.href.back()'
		                });
		                appcan.window.evaluateScript({
		                    name : 'gw_atricle',
		                    scriptContent : 'cmp.href.back()'
		                });
		                cmp.href.next({
		                    name : 'myApply',
		                    data : 'myApply.html',
		                    aniId : 10,
		                    type:4
		                });
		            }
		        });
		    }else if(data['submit']&&data['submit'].RESULT=='false'){
		        cmp.notification.alert({
		            title : "提醒",
		            content : "此单据暂不支持在移动端审批，请到电脑端审批。",
		            buttons : '确定',
		            callback : function(err, data, dataType, optId) {
		                console.log(err, data, dataType, optId);
		                cmp.storage.save('dbtabindex',1);
		                appcan.window.evaluateScript({
		                    name : 'old_banli',
		                    scriptContent : 'cmp.href.back()'
		                });
		                appcan.window.evaluateScript({
		                    name : 'gw_atricle',
		                    scriptContent : 'cmp.href.back()'
		                });
		                cmp.href.next({
		                    name : 'myApply',
		                    data : 'myApply.html',
		                    aniId : 10,
		                    type:4
		                });
		            }
		        });
		    }
		    else{
		        //弹出选人框
		        var opxml = data['persons'].RESULT;
		        var option = '' ;
		        
		        console.log(opxml);
		        console.log(opxml.length);
		        //从此处开始应有两种
		        console.log($(opxml).attr("result"));
		        var xmlresult = $(opxml).attr("result");
		        //console.log();
		        if(xmlresult!=null&&typeof(xmlresult)!="undefined"&&xmlresult!="NONE"){
		            var setp = xmlresult.split('$');
		            for(var i=0;i<setp.length;i++){
		                //console.log(setp[i]);
		                var setpTemp = setp[i].split('^');
		                var setpid = setpTemp[0];
		                var setpname = setpTemp[1];
		                option += "<option value='"+setpid+","+setpname+"'>"+setpname+"</option>";
		                //console.log(setpid,setpname);
		            }
		            cmp.storage.save('option',option);
		            cmp.storage.save('content',$("#content").val());
		            appcan.execScriptInWin('old_banli', 'openSubmitPopover()');
		        }else if(opxml!=null&&opxml.length>0&&xmlresult!="NONE"){
		            for(var i=0;i<opxml.length;i++){
		                option += "<option value='"+opxml[i].setpid+","+opxml[i].setpname+"'>"+opxml[i].setpname+"</option>";
		            }
		            cmp.storage.save('option',option);
		            cmp.storage.save('content',$("#content").val());
		            appcan.execScriptInWin('old_banli', 'openSubmitPopover()'); 
		        }else{
		            //跳到单选
		            cmp.storage.save('submitType',"next");
		            cmp.storage.save('content',$("#content").val());
		            cmp.href.next({
		                    name : 'old_dbmry',
		                    data : 'old_dbmry.html',
		                    aniId : 10
		            });
		        }
		    }
		}
		
		$("#back").on("tap", function(){
		    if(checkGT()) return;
		    cmp.notification.alert({
		        title : "提醒",
		        content : "您确定要驳回吗？",
		        buttons : ['确定', '取消'],
		        callback : function(err, data, dataType, optId) {
		            console.log(err, data, dataType, optId);
		            if (data == 0) {
		                if(!checkOpin()){
		                    return ;
		                }
		                var oid = cmp.storage.get("link_uniqueid").toUpperCase();
		                var serviceUrl = cmp.storage.get('serviceUrl');
		                var phoneid = cmp.storage.get('phoneid');
		                var olduser = cmp.storage.get('olduser');
		                var oldpwd = cmp.storage.get('oldpwd');
		                var StationGUID = cmp.storage.get('StationGUID', StationGUID);
		                var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=oldoa_ht";
		                url = url + "&username=" + olduser + "&password=" + oldpwd + "&PHONE_ID=" + phoneid + "&content=" + $("#content").val()+"&oid="+oid;
		                url = url + "&StationGUID=" + StationGUID;
		                url = url + "&platform=" + platform;
		                ajaxJson(url, sucessBack);
		            }
		        }
		    });
		})
		function sucessBack(data) {
		    console.log(data);
		    //如果Is_submit不为空
		    if(data.Is_submit.RESULT!=''){
		        //不能处理
		        cmp.notification.alert({
		            title : "提醒",
		            content : "您发起的OA还未返回所有意见;"+data.Is_submit.RESULT,
		            buttons : '确定',
		            callback : function(err, data, dataType, optId) {
		                console.log(err, data, dataType, optId);
		                return ;
		            }
		        });
		        return ;
		    }
		    //console.log(data.approve.ROLLBACKXML);
		    var rollbackxml = data.approve.ROLLBACKXML ;
		    var option="";
		    $(rollbackxml).find("Step").each(function() {
		        //var xmlAttr = $(this).attr("name");
		        //var xmlText = $(this).text();
		        //$("#" + xmlAttr).val(xmlText);
		        option += "<option value='"+$(this).attr("StepPathGUID")+","+$(this).attr("Auditors")+","+$(this).attr("AuditorNames")+"'>"+$(this).attr("StepName");+"</option>";
		    });
		    cmp.storage.save('option',option);
		    cmp.storage.save('content',$("#content").val());
		    appcan.execScriptInWin('old_banli', 'openPopover()');
		}
		
		function sucessZuof(data){
		    console.log(data);
		    cmp.notification.alert({
		            title : "提醒",
		            content : "作废成功",
		            buttons : '确定',
		            callback : function(err, data, dataType, optId) {
		                console.log(err, data, dataType, optId);
		                cmp.storage.save('dbtabindex',1);
		                appcan.window.evaluateScript({
		                    name : 'old_banli',
		                    scriptContent : 'cmp.href.back()'
		                });
		                appcan.window.evaluateScript({
		                    name : 'gw_atricle',
		                    scriptContent : 'cmp.href.back()'
		                });
		                cmp.href.next({
		                    name : 'myApply',
		                    data : 'myApply.html',
		                    aniId : 10,
		                    type:4
		                });
		            }
		        });
		}
		
		
		$("#over").on("tap", function(){
		    cmp.notification.alert({
		        title : "提醒",
		        content : "您确定要作废吗？",
		        buttons : ['确定', '取消'],
		        callback : function(err, data, dataType, optId) {
		            console.log(err, data, dataType, optId);
		            if (data == 0) {
		                if(!checkOpin()){
		                    return ;
		                }
		                var oid = cmp.storage.get("link_uniqueid").toUpperCase();
		                var serviceUrl = cmp.storage.get('serviceUrl');
		                var phoneid = cmp.storage.get('phoneid');
		                var olduser = cmp.storage.get('olduser');
		                var oldpwd = cmp.storage.get('oldpwd');
		                var StationGUID = cmp.storage.get('StationGUID', StationGUID);
		                var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=oldoa_zf&passValue=";
		                url = url + "&username=" + olduser + "&password=" + oldpwd + "&PHONE_ID=" + phoneid + "&content=" + $("#content").val()+"&oid="+oid;
		                url = url + "&StationGUID=" + StationGUID;
		                url = url + "&platform=" + platform;
		                ajaxJson(url, sucessZuof);
		            }
		        }
		    });
		})