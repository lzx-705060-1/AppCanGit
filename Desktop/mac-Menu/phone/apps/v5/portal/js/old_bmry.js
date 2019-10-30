cmp.ready(function() {
            var titHeight = $('#header').offset().height;
            // appcan.frame.open("content", "old_bmry_content.html", 0, titHeight);
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
		
		// var members = [{title : "<div class='btn ub ub-ac bc-text-head ub-pc bc-btn'  id='submit'>提交 </div>",oid : "0"}];;
		 var members = [];
		 var platform = cmp.storage.get('platform');
		 function qcRepet(obj){
		     console.log(obj.checked);
		     if(obj.checked==false){
		         members.splice(isRept(obj),1);
		     }else{
		         console.log(isRept(obj));
		         if(isRept(obj)<0){
		             members.splice(0,0,obj);
		             //members.push(obj);
		         }
		     }
		     
		 }
		 
		 function isRept(obj){
		     var result = -1;
		     for(var i=0;i<members.length;i++){
		         if(members[i].oid==obj.oid){
		             result = i;
		         }
		     }
		     return result ;
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
		     hasCheckbox : true,
		     multiLine : 3,
		     hasSmallIcon : true,
		     align : 'right'
		 });
		 lv1.on('checkbox:change', function(ele, obj) {
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
		             console.log(members);
		             lv1.set(members);
		             //console.log($("#submit").parent());
		             //console.log($("#submit").parent().siblings());
		             $("input").attr("checked", "checked");
		             /*
		             $("#submit").parent().siblings().hide();
		             appcan.button("#submit", "ani-act", function() {
		                 var oid = cmp.storage.get("link_uniqueid").toUpperCase();
		                 var content = cmp.storage.get('content');
		                 var serviceUrl = cmp.storage.get('serviceUrl');
		                 var phoneid = cmp.storage.get('phoneid');
		                 var olduser = cmp.storage.get('olduser');
		                 var oldpwd = cmp.storage.get('oldpwd');
		                 var StationGUID = cmp.storage.get('StationGUID', StationGUID);
		                 var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=oldoa_jh&passValue=";
		                 url = url + "&username=" + olduser + "&password=" + oldpwd + "&PHONE_ID=" + phoneid + "&content=" + content+"&oid="+oid;
		                 url = url + "&StationGUID=" + StationGUID;
		                 url = url + "&platform=" + platform;
		                 var userlist = "" ;
		                 if(members.length<2){
		                     cmp.notification.alert({
		                         title : '提示',
		                         content : '请选择人员',
		                         buttons : '确定'
		                     });
		                     return ;
		                 }
		                 for(var i=0;i<members.length-1;i++){
		                     userlist += "\\\\"+members[i].oid+","+members[i].name;
		                 }
		                 url = url + "&userlist="+userlist.substring(2);
		                 console.log(url);
		                 ajaxJson(url, sucessJh);
		             })
		             */
		          
		         }
		     });
		               function submitok() {
		                 var oid = cmp.storage.get("link_uniqueid").toUpperCase();
		                 var content = cmp.storage.get('content');
		                 var serviceUrl = cmp.storage.get('serviceUrl');
		                 var phoneid = cmp.storage.get('phoneid');
		                 var olduser = cmp.storage.get('olduser');
		                 var oldpwd = cmp.storage.get('oldpwd');
		                 var StationGUID = cmp.storage.get('StationGUID', StationGUID);
		                 var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=oldoa_jh&passValue=";
		                 url = url + "&username=" + olduser + "&password=" + oldpwd + "&PHONE_ID=" + phoneid + "&content=" + content+"&oid="+oid;
		                 url = url + "&StationGUID=" + StationGUID;
		                 url = url + "&platform=" + platform;
		                 var userlist = "" ;
		                 console.log(members.length);
		                 if(members.length<1){
		                     cmp.notification.alert({
		                         title : '提示',
		                         content : '请选择人员',
		                         buttons : '确定'
		                     });
		                     return ;
		                 }
		                 for(var i=0;i<members.length;i++){
		                     userlist += "\\\\"+members[i].oid+","+members[i].name;
		                 }
		                 url = url + "&userlist="+userlist.substring(2);
		                 console.log(url);
		                 ajaxJson(url, sucessJh);
		             }
		                function sucessJh(data){
		                 console.log(data);
		                 cmp.storage.save("link_uniqueid","");
		                 cmp.storage.save('dbtabindex',1);
		                 cmp.notification.alert({
		             title : "提醒",
		             content : "办理成功",
		             buttons : '确定',
		             callback : function(err, data, dataType, optId) {
		                 appcan.window.evaluateScript({
		                     name : 'old_bmry',
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