cmp.ready(function() {
            var titHeight = $('#header').offset().height;
			appcan.initBounce();
			getLiucheng();
        });
		$("#nav-left").on("tap", function(){
            cmp.href.back();
        })
		 
		function getLiucheng() {
		    var serviceUrl = cmp.storage.get('serviceUrl');
		    var phoneid = cmp.storage.get('phoneid');
		    var olduser = cmp.storage.get('olduser');
		    var oldpwd = cmp.storage.get('oldpwd');
		    var processGUID = cmp.storage.get("processGUID") ;
		    var oid = cmp.storage.get("link_uniqueid");
		    var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=oldoa_detail&stype=liucheng";
		    url = url + "&username=" + olduser + "&password=" + oldpwd + "&PHONE_ID=" + phoneid + "&processGUID=" + processGUID+"&oid="+oid;
		    ajaxJson(url, httpsucess);
		    //var data = '{"input":{"stype":"liucheng","SESSION_ID":"04E42CA1F2F0C707593B2EFF529EE6B4","message_id":"oldoa_detail","processGUID":"9d034eb7-bf7e-440c-b518-676ddfaef738"},"liucheng":{"NODE":["1 发起 [步骤类型:开始]", "OA单点登陆用户", "2 人事审批抄送 [步骤类型:审批]", "OA单点登陆用户", "3 发起 [步骤类型:开始]", "OA单点登陆用户"],"ATTR":["完成", "", "", "", "", "", "2015-10-22 17:12:43", "2015-10-22 17:12:43", "2015-10-22 17:12:43", "", "打回", "", "", "", "", "打回", "2015-10-22 17:12:43", "2015-10-28 13:16:10", "2015-12-9 16:26:33", "244小时14分钟", "在办", "", "", "", "", "在办", "2015-12-9 16:26:33", "2015-12-10 9:00:06", "", "32小时34分钟"]}}';
		    //httpsucess(JSON.parse(data));
		}
		
		function httpsucess(data) {
		    console.log(data);
		    var node = data.liucheng.NODE ;
		    var attr = data.liucheng.ATTR ;
		    for(var i=0;i < node.length; i++){
		        if(i%2==0){
		            var html = '<ul ontouchstart="appcan.touch(\'btn-act\')" class="ubb ub bc-border t-bla lis"><li class="ulev-2 t-gre-tL uinn-tL">';
		            if (attr[5*i]=='')
		            {
		                attr[5*i]="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
		            }
		            html += attr[5*i] ;
		            html += '</li><li class="uwh-tL ub ub-ac ub-pc umar-ar3 uabs-tL">' ;
		            if(attr[5*i]=='在办'){
		                html += '<div class="uwh-tL uc-a-tL c-org-tL"></div>' ;
		            }else{
		                html += '<div class="uwh-tL uc-a-tL c-gre-tL"></div>' ;
		            }
		            if(attr[5*i]=='办结'){
		                html += '</li><li class="ub-f1 ub ub-ver ut-s mar-ar1"><div class="ulev-app1">' ;
		            html += node[i];
		            html += '</div><div class="t-gra-tL ub-f1 ulev-4 line-hei uinn-t-tL  uof">' ;
		            html += node[i-1]+'<br />' ;
		            html += '系统激活时间:'+attr[5*i+1]+'<br />' ;
		            html += '用户激活时间:'+attr[5*i+2]+'<br />' ;
		            html += '完成时间:'+attr[5*i+3]+'<br />' ;
		            html += '停留时间:'+attr[5*i+4]+'<br />' ;
		            html += '</div></li><li class="mar-ar1 ub-ac ub"><div class="lis-sw ub-img arrow "></div></li></ul>' ;
		            }else{
		            html += '</li><li class="ub-f1 ub ub-ver ut-s mar-ar1"><div class="ulev-app1">' ;
		            html += node[i];
		            html += '</div><div class="t-gra-tL ub-f1 ulev-4 line-hei uinn-t-tL uof">' ;
		            html += node[i+1]+'<br />' ;
		            html += '系统激活时间:'+attr[5*i+6]+'<br />' ;
		            html += '用户激活时间:'+attr[5*i+7]+'<br />' ;
		            html += '完成时间:'+attr[5*i+8]+'<br />' ;
		            html += '停留时间:'+attr[5*i+9]+'<br />' ;
		            html += '</div></li><li class="mar-ar1 ub-ac ub"><div class="lis-sw ub-img arrow "></div></li></ul>' ;
		            }  
		            $("#listview").append(html);   
		        }
		        //不管手机如何滑动，竖线始终能到达底部
		        var box = document.getElementById('shuxian');
		        var pageHeight = document.body.scrollHeight;
		        shuxian.style.height = pageHeight + "px";
		    }
		}