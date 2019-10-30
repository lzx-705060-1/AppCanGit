cmp.ready(function() {
            //var titHeight = $('#header').offset().height;
			getInfo();
			cmp.backbutton.push(cmp.href.back);//向返回按钮堆栈加入回退到上一个页面的函数
			bindEvent();//给页面中的按钮绑定事件
        });
		
		
		function bindEvent(){
		    document.getElementById("fujian").addEventListener("tap",function(){
		        getFuJian();
		
		    });
		}
		
		var height = document.getElementById("content").offsetHeight;
		function getInfo() {
			var paramObj = cmp.href.getParam();
			var title = paramObj.title;
			var newsid = paramObj.newsid;
			$(".cmp-title").html(title)
			// var newsid = cmp.storage.get(newsid);
			//var serviceUrl = cmp.storage.get('serviceUrl');
			var serviceUrl = "https://mportal.agile.com.cn:8443";
			var phoneid = cmp.storage.get('phoneid');
			var loginname = cmp.storage.get('loginname');
			//var password =  cmp.storage.get('password');
			var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=nhoa_news" ;
			url = url + "&username="+loginname +"&PHONE_ID="+phoneid+"&newsid="+newsid;
			var obj = new Object();
			obj.url = url;
			obj.successFun = "httpInfosucess";
			ajaxJson_v1(obj);
		}
		function httpInfosucess(info_list){
		    console.log(info_list);
		    var info = info_list['info'];
		    var fileid = info.content;
		    $('#deptname').html('发起部门：'+info.name);
		    $('#read_count').html('阅读量：'+info.read_count);
		    $('#sendername').html('发起人：'+info.name);
		    $('#create_time').html('发起时间：'+info.publish_date);
		    //保存附件列表
			var attachments_list =info_list['attachments'];
			cmp.storage.save('fileid', fileid);
			var homeObj = JSON.stringify(attachments_list);
			console.log(homeObj)
			var num = attachments_list.length;
			cmp.storage.save('attachments', homeObj);
			cmp.storage.save('fileid', fileid);
			$("footer .cmp-tab-label").eq(0).html('附件(' + attachments_list.length + ')');
			if(fileid){
			    getDetail();
			}
		}
		function getDetail() {
			var obj = new Object();
		    var serviceUrl = cmp.storage.get('serviceUrl'); 
		    var phoneid = cmp.storage.get('phoneid'); 
		    var loginname = cmp.storage.get('loginname'); 
		    //var password =  cmp.storage.get('password'); 
		    var fileid =  cmp.storage.get('fileid'); 
		    var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=nhoa_file&checktype=text" ;
		    url = url + "&username="+loginname+"&PHONE_ID="+phoneid+"&fileid="+fileid;
			obj.url = url;
			obj.successFun = "httpsucess";
		    ajaxJson_v1(obj);
		}
		 function httpsucess(info_list){
		     console.log(info_list)
		    var content = info_list['content'].CONTENT ;
		    /*var content = info_list ;
		    console.log(content);
		    console.log(cmp.storage.get('serviceUrl'));
		    //content = content.replace(/docCache/g,cmp.storage.get('serviceUrl')+'/docCache');
		    content = content.replace('/docCache/',cmp.storage.get('serviceUrl')+'/docCache/');
		    content = content.replace('"/docCache/','"'+cmp.storage.get('serviceUrl')+'/docCache/');
		    content = content.replace('"/docCache/','"'+cmp.storage.get('serviceUrl')+'/docCache/');
		    content = content.replace('/servlet/',cmp.storage.get('serviceUrl')+'/servlet/');
		    content = content.replace('http://127.0.0.1:8443/','https://127.0.0.1:8443');*/
		    //console.log(content);
		    $("#content").html(content);
		    height = document.body.scrollHeight
		    var loginname = cmp.storage.get('loginname');
			waterMarkNotIe$()
		}
		
		function waterMarkNotIe$() {
            var loginname = cmp.storage.get('loginname');
            var winwidth$ = document.body.clientWidth;
            var winheight$ = document.body.scrollHeight;
            var waterSum$ = 30;
            var oldleft$ = 0;
            var maxI$ = 0;
            var k$ = 0;
            $("body").append("<div class='cover-Blink-area'> </div>");
            $('.cover-Blink-area').css('height', height);
            for (var i = 1; i <= waterSum$; i++) {
                $(".cover-Blink-area").append("<p id='waterSum_" + i + "' class='cover_through cover-Blink js-click-to-alert'>"+loginname+"  "+"</p>");
                var left = Number(document.getElementById("waterSum_" + i).offsetLeft);
                if (left > oldleft$) {
                    oldleft$ = left;
                    maxI$ = i;
                }
                if (left < oldleft$ && k$ == 0) {
                    var top = $("#waterSum_1").css("margin-top").substring(0, $("#waterSum_1").css("margin-top").indexOf('p'));
                    var bottom = $("#waterSum_1").css("margin-bottom").substring(0, $("#waterSum_1").css("margin-bottom").indexOf('p'));
                    var pHeight = $("#waterSum_1").height();
                    var totalHeight = Number(top) + Number(pHeight) + Number(bottom);
                    var Hnum = Math.round(height / (totalHeight / 1.5));
                    waterSum$ = Hnum * maxI$;
                    console.log("waterSum$:"+waterSum$+" maxI$:"+maxI$)
                    k$++;
                }
            }
        }
		
		function getFuJian(){
		    var extData = {
		
		    }
		     cmp.href.next("/seeyon/m3/apps/v5/mtbd/html/fujian.html",extData,{openWebViewCatch: true,nativeBanner: true})
		
		}
		