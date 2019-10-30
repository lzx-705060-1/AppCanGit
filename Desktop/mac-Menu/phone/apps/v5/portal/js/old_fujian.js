cmp.ready(function() {
            var titHeight = $('#header').offset().height;
			appcan.initBounce();
			           
			var attachments = cmp.storage.get('oldfujian') ;
			           
			if(attachments!='[]'&&attachments!=null&&attachments!=''){
			    var att = new Object();
			    att = JSON.parse(attachments) ;
			    httpsucess(att);
			}else{
			   cmp.notification.alert({
			        title : "提醒",
			        content : "该事项没有附件",
			        buttons : '确定',
			        callback : function(err, data, dataType, optId) {
			            console.log(err, data, dataType, optId);
			            appcan.window.evaluateScript({
			                name : 'old_fujian',
			                scriptContent : 'cmp.href.back()'
			            });
			        }
			    });
			}
			waterMark2("shuiyin");
        });
		$("#nav-left").on("tap", function(){
            cmp.href.back();
        })
		
		var lv1 = appcan.listview({
		         selector : "#listview",
		         type : "thinLineTmp",
		         hasIcon : false,
		         hasAngle : false,
		         hasSubTitle : false,
		         multiLine : 2
		     });
		 
		 function getFujian() {
		     var serviceUrl = cmp.storage.get('serviceUrl');
		     var phoneid = cmp.storage.get('phoneid');
		     var olduser = cmp.storage.get('olduser');
		     var oldpwd = cmp.storage.get('oldpwd');
		     var processGUID = cmp.storage.get("processGUID") ;
		     var oid = cmp.storage.get("link_uniqueid");
		     var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=oldoa_detail&stype=fujian";
		     url = url + "&username=" + olduser + "&password=" + oldpwd + "&PHONE_ID=" + phoneid + "&processGUID=" + processGUID+"&oid="+oid;
		     ajaxJson(url, httpsucess);
		 }
		
		 function httpsucess(data) {
		     console.log(data);
		     var fujian=data;
		     //var fujian = data.attach.RESULT ;
		   //  console.log(fujian);
		  //   console.log(fujian.length);
		       
		     lv1.set(fujian);
		     lv1.on('tap', function(ele, obj, subobj) {
		        // console.log(ele, obj, subobj);
		        // console.log(obj);
		        cmp.storage.save('filename', obj.title);
		        cmp.storage.save('fileid', obj.code);
		        // cmp.href.next({
		         //       name : 'old_fujian_zw',
		         //        data : 'old_fujian_zw.html',
		         //        aniId : 10
		        // });
		       openfujian();
		     });
		 }
		  function openfujian()
		  {
		    var serviceUrl = cmp.storage.get('serviceUrl'); 
		     var title = cmp.storage.get('filename'); 
		     var fileid = cmp.storage.get('fileid'); 
		     var phoneid = cmp.storage.get('phoneid');
		     var olduser = cmp.storage.get('olduser');
		     var oldpwd = cmp.storage.get('oldpwd');
		     //根据名字得到类型
		    // var ext = title.substring(title.indexOf('.')+1)+'text';
		     var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=oldoa_detail";
		     url = url + "&username=" + olduser + "&password=" + oldpwd + "&PHONE_ID=" + phoneid;
		     url = url + "&code="+fileid + "&title=" + title;
		     //console.log(url);
		     ajaxJson(url, function(data){
		         
		     var filepath = "wgt://data/down/"+cmp.storage.get('filename');
		     var filedownloadpath = serviceUrl+data.xzurl.RESULT;
		  //   console.log(downLoadUlr,filepath,filedownloadpath);
		     //uexWidget.startApp("1", "android.intent.action.VIEW", '{"data":{"scheme":"'+filedownloadpath+'"}}')
		     var filenum = getFileNum();
		     uexDownloaderMgr.createDownloader(filenum);
		     //console.log('调用前：'+filenum);
		//     console.log(serviceUrl+downLoadUlr);
		     uexDownloaderMgr.download(filenum, filedownloadpath,filepath, '1');
		     uexDownloaderMgr.onStatus = function(opCode, fileSize, percent, status) {
		         switch (status) {
		         case 0:
		             cmp.href.nextToast("文件大小:"+(fileSize/(1024*1024)).toFixed(2)+"MB"+",加载进度:"+percent+"%",0,5,1);
		             break;
		         case 1:
		             appcan.window.closeToast();
		             uexDownloaderMgr.closeDownloader(opCode);
		             //console.log('完成时：'+num);
		             //alert("下载成功");
		             uexDocumentReader.openDocumentReader(filepath);
		             break;
		         case 2:
		             appcan.window.closeToast();
		             cmp.notification.alert({
		                     title : "提醒",
		                     content : "文件下载失败",
		                     buttons : '确定',
		                     callback : function(err, data, dataType, optId) {
		                         console.log(err, data, dataType, optId);
		                         return ;
		                     }
		                 });
		             uexDownloaderMgr.clearTask(filepath, "1");
		             uexDownloaderMgr.closeDownloader(opCode);
		             break;
		         }
		     }
		     
		         
		        
		     });   
		  }