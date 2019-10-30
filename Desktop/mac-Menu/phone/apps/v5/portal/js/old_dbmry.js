cmp.ready(function() {
            var titHeight = $('#header').offset().height;
            // appcan.frame.open("content", "old_dbmry_content.html", 0, titHeight);
            // window.onorientationchange = window.onresize = function() {
            //     appcan.frame.resize("content", 0, titHeight);
            // }
			appcan.initBounce();
			getDeptlist();
			getMemberList('79625beb-1218-4766-a550-194d7911d6dd');
        });
		$("#nav-left").on("tap", function(){
            cmp.href.back();
        })
		$("#nav-right").on("tap", function(){
            uexWindow.evaluatePopoverScript("", "content", "submitok();");
        })
		
		//var members = [{},{title : "<div class='btn ub ub-ac bc-text-head ub-pc bc-btn'  id='submit'>提交 </div>",oid : "0"}];;
		var members = [];
		var platform = cmp.storage.get('platform');
		function qcRepet(obj){
		 
		    if (obj.oid!='0')
		    {
		    members.splice(0,1,obj);
		    }
		   
		    
		}
		
		function getDeptlist(){
		    var serviceUrl = cmp.storage.get('serviceUrl');
		    var phoneid = cmp.storage.get('phoneid');
		    var olduser = cmp.storage.get('olduser');
		    var oldpwd = cmp.storage.get('oldpwd');
		    var url = serviceUrl+"/servlet/PublicServiceServlet?message_id=oldoa_bmry";
		    url = url + "&username=" + olduser + "&password=" + oldpwd + "&PHONE_ID=" + phoneid;
		    ajaxJson(url,deptsucess);
		}
		
		function deptsucess(data){
		    console.log(data);
		    var first = [{title : "<div style='font-weight:bold;color:#00A1EA;'>已选人员</div>",id : "0"}];
		    var types = data.deptList.LIST ;
		    console.log(types);
		    lv2.set(first.concat(types));
		    first = types = null ;
		}
		
		function getMemberList(deptid,key){
		    var serviceUrl = cmp.storage.get('serviceUrl');
		    var phoneid = cmp.storage.get('phoneid');
		    var olduser = cmp.storage.get('olduser');
		    var oldpwd = cmp.storage.get('oldpwd');
		    var url = serviceUrl+"/servlet/PublicServiceServlet?message_id=oldoa_bmry&stype=user";
		    url = url + "&username=" + olduser + "&password=" + oldpwd + "&PHONE_ID=" + phoneid;
		    url = url + "&deptid="+deptid ;
		    if(key){
		        url = url + "&key="+key ;
		    }
		    ajaxJson(url,membersucess);
		}
		
		function membersucess(data){
		    console.log(data);
		    var users = data.userList.LIST ;
		    userlist=new Array();
		    for (i=0;i<users.length;i++)
		    {
		        var tempuser=new Object();
		        tempuser.oid=users[i].oid;
		        var deptname=users[i].dept;
		        tempuser.title=users[i].title+"("+deptname+")";
		        tempuser.name=users[i].title;
		        userlist.push(tempuser);
		        
		    }
		    lv1.set(userlist);   
		    lv1.on('tap', function(ele, obj, subobj) {
		       console.log(ele, obj, subobj);
		       // console.log($(ele).find("input").attr('checked'));
		       qcRepet(obj);
		    });   
		}
		var lv1 = appcan.listview({
		    selector : "#listview",
		    type : "thinLine",
		    hasIcon : true,
		    hasAngle : false,
		    multiLine : 3,
		    hasRadiobox : true,
		    hasSmallIcon : true,
		    align : 'right'
		});
		lv1.on('radio:change', function(ele, obj) {
		        console.log(ele, obj);
		        //console.log(obj.checked);
		        qcRepet(obj);
		    });
		var lv2 = appcan.listview({
		    selector : "#column",
		    type : "thinLine",
		    hasAngle : false,
		    touchClass : "bc-btn"
		});
		lv2.on('tap', function(ele, obj, subobj) {
		        console.log(ele, obj, subobj);
		        if(obj.id!='0'){
		            getMemberList(obj.id);
		        }else{
		            //console.log(members);
		            lv1.set(members);
		            console.log($("input"));
		            //console.log($("#submit").parent().siblings());
		            $("input").eq(1).attr("checked", "true");
		            /*
		            $("#submit").parent().siblings().hide();
		            appcan.button("#submit", "ani-act", function() {
		               
		                if(members[0].oid==null||members[0].oid==''){
		                    cmp.notification.alert({
		                        title : '提示',
		                        content : '请选择人员',
		                        buttons : '确定'
		                    });
		                    return ;
		                }
		               submit();
		            })
		            */
		        }
		    });
		     function submitok() {
		         console.log(members.length);
		               
		                if(members.length==0){
		                    cmp.notification.alert({
		                        title : '提示',
		                        content : '请选择人员',
		                        buttons : '确定'
		                    });
		                    return ;
		                }
		               submit();
		            }
		//lv2.set(types);
		$("#search").on("tap", function(){
		        var infoName = $('#infoName').val();
		        if (infoName == "" || infoName == null) {
		            cmp.notification.alert({
		                title : '提示',
		                content : '输入条件不能为空！',
		                buttons : '确定'
		            });
		        } else {
		            //查找人员
		            getMemberList('11b11db4-e907-4f1f-8835-b9daab6e1f23',infoName);
		        }
		    })
		    
		    function submit(){
		        //根据类型提交
		        var submitType = cmp.storage.get('submitType');
		        if(submitType!=null&&submitType=='next'){
		            var auditor = members[0].oid ;
		            var auditorname = members[0].name;
		            var oid = cmp.storage.get("link_uniqueid").toUpperCase();
		            var serviceUrl = cmp.storage.get('serviceUrl');
		            var phoneid = cmp.storage.get('phoneid');
		            var olduser = cmp.storage.get('olduser');
		            var oldpwd = cmp.storage.get('oldpwd');
		            var StationGUID = cmp.storage.get('StationGUID', StationGUID);
		            var url = serviceUrl+"/servlet/PublicServiceServlet?message_id=oldoa_cz&passValue=1&stype=submitgo";
		            url = url + "&username=" + olduser + "&password=" + oldpwd + "&PHONE_ID=" + phoneid + "&content=" + cmp.storage.get('content') + "&oid=" + oid;
		            url = url + "&auditor=" + auditor + "&auditorname=" + auditorname;
		            url = url + "&StationGUID=" + StationGUID;
		            //console.log(url);
		            ajaxJson(url, sucessJh);
		        }else{
		            var oid = cmp.storage.get("link_uniqueid").toUpperCase();
		            var content = cmp.storage.get('content');
		            var serviceUrl = cmp.storage.get('serviceUrl');
		            var phoneid = cmp.storage.get('phoneid');
		            var olduser = cmp.storage.get('olduser');
		            var oldpwd = cmp.storage.get('oldpwd');
		            var StationGUID = cmp.storage.get('StationGUID', StationGUID);
		            var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=oldoa_zb";
		            url = url + "&username=" + olduser + "&password=" + oldpwd + "&PHONE_ID=" + phoneid + "&content=" + content+"&oid="+oid;
		            var userguid = members[0].oid ;
		            var userguname = members[0].name ;
		            url = url + "&userguid="+userguid+"&userguname="+userguname;
		            url = url + "&StationGUID=" + StationGUID;
		            url = url + "&platform=" + platform;
		            console.log(url);
		            ajaxJson(url, sucessJh);
		        }
		    }
		    
		    function sucessJh(data){
		        cmp.storage.save("link_uniqueid","");
		        cmp.storage.save('dbtabindex',1);
		        console.log(data);
		        cmp.notification.alert({
		            title : "提醒",
		            content : "办理成功",
		            buttons : '确定',
		            callback : function(err, data, dataType, optId) {
		        appcan.window.evaluateScript({
		            name : 'old_dbmry',
		            scriptContent : 'cmp.href.back()'
		        });
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