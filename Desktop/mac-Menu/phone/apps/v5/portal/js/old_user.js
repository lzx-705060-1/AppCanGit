cmp.ready(function() {
            var titHeight = $('#header').offset().height;
            appcan.initBounce();
                   
            var olduser;
            if(cmp.storage.get('olduser'))
            {
                olduser=cmp.storage.get('olduser');
            }else{
                olduser=cmp.storage.get('adcode');
            };
            var oldpwd; 
            if(cmp.storage.get('oldpwd'))
            {
                oldpwd=cmp.storage.get('oldpwd');
            }else{
                oldpwd=cmp.storage.get('password');
            };
            $("#olduser").val(olduser);
            //console.log(oldpwd);
            $("#oldpwd").val(oldpwd);
        });
		$("#nav-left").on("tap", function(){
            appcan.window.publish('index2');
            cmp.href.back();
        })
        function closethis(){
            appcan.window.publish('index2');
            cmp.href.back();
        }
		
		var StationGUID ;
		        var istest = false ;
				$("#test").on("tap", function(){
		            var olduser = $("#olduser").val();
		            var oldpwd = $("#oldpwd").val();
		            if (olduser == '') {
		                cmp.notification.alert({
		                    title : "提醒",
		                    content : "请输入AD用户",
		                    buttons : '确定',
		                    callback : function(err, data, dataType, optId) {
		                        console.log(err, data, dataType, optId);
		                    }
		                });
		            } else if (oldpwd == '') {
		                cmp.notification.alert({
		                    title : "提醒",
		                    content : "请输入AD密码",
		                    buttons : '确定',
		                    callback : function(err, data, dataType, optId) {
		                        console.log(err, data, dataType, optId);
		                    }
		                });
		            } else {
		                var serviceUrl = cmp.storage.get('serviceUrl');
		                var phoneid = cmp.storage.get('phoneid');
		                var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=oldoa_login_new&username="+olduser+"&password="+oldpwd;
		                ajaxJson(url, httpsucess);
		            }
		        })
		        function httpsucess(info_list) {
		            console.log(info_list);
		            if(info_list['login'].RESULT=='false'){
		                 cmp.notification.alert({
		                    title : "提醒",
		                    content : "AD帐号或密码不正确",
		                    buttons : '确定',
		                    callback : function(err, data, dataType, optId) {
		                        console.log(err, data, dataType, optId);
		                    }
		                });
		            }else{
		                
		                //cmp.storage.save('oldpwd', oldpwd);
		                //StationGUID
		               // istest = true ;
		                 var olduser = $("#olduser").val();
		                var oldpwd = $("#oldpwd").val();
		            if (olduser && oldpwd) {
		                cmp.storage.save('olduser', olduser);
		                cmp.storage.save('oldpwd', oldpwd);
		               // jzuser();
		               // if(StationGUID){
		                //    cmp.storage.save('StationGUID', StationGUID);
		              //  }
		                cmp.storage.save('olddblist','');
		                cmp.storage.save('newdblist','');
		                cmp.storage.save('olddbCount','');
		                //cmp.storage.save('jzdbCount','');
		                uexWindow.evaluateScript("main", 0, "getNewTotal();");
		                uexWindow.evaluatePopoverScript("chatmain", "content0", "getdaibanTotalCount();");
		                uexWindow.evaluateScript('old_user',0,'cmp.href.back();');
		               // StationGUID = info_list['stationguid'].GW.guid ;
		            }
		             cmp.notification.alert({
		                    title : "提醒",
		                    content : "AD账号绑定成功",
		                    buttons : '确定',
		                    callback : function(err, data, dataType, optId) {
		                        console.log(err, data, dataType, optId);
		                    }
		                });
		        }
		}
		
				$("#submit").on("tap", function(){
		            var olduser = $("#olduser").val();
		            var oldpwd = $("#oldpwd").val();
		            if (istest && olduser && oldpwd) {
		                cmp.storage.save('olduser', olduser);
		                cmp.storage.save('oldpwd', oldpwd);
		               // if(StationGUID){
		                //    cmp.storage.save('StationGUID', StationGUID);
		              //  }
		                cmp.storage.save('olddblist','');
		                cmp.storage.save('newdblist','');
		                uexWindow.evaluateScript("main", 0, "getNewTotal();");
		                appcan.window.evaluateScript({
		                    name : 'old_user',
		                    scriptContent : 'closethis();'
		                });
		            } else if(!istest){
		                cmp.notification.alert({
		                    title : "提醒",
		                    content : "请先测试",
		                    buttons : '确定',
		                    callback : function(err, data, dataType, optId) {
		                        console.log(err, data, dataType, optId);
		                    }
		                });
		            }else{
		                cmp.notification.alert({
		                    title : "提醒",
		                    content : "AD帐号和密码不能为空！",
		                    buttons : '确定',
		                    callback : function(err, data, dataType, optId) {
		                        console.log(err, data, dataType, optId);
		                    }
		                });
		            }
		        })
		          function jzuser(){
		          
		            var serviceUrl = cmp.storage.get('serviceUrl');
		            var phoneid = cmp.storage.get('phoneid');
		            var oauser = cmp.storage.get('loginname');
		            var aduser = cmp.storage.get('olduser');
		            var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=jeezuser";
		            url = url + "&oauser=" + oauser + "&aduser=" + aduser + "&PHONE_ID=" + phoneid;
		            ajaxJson(url, httpjzuser);
		        }   
		         function httpjzuser(data) {
		              cmp.storage.save('jeezqx',0);  
		             if (data.jeezuser.length>0)
		             {
		             cmp.storage.save('jeezqx',1);
		             }
		            
		             if(cmp.storage.get('dbtabindex')==2)
		             cmp.storage.save('dbtabindex',0);
		             
		          }