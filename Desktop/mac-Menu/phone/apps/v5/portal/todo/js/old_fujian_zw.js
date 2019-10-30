cmp.ready(function() {
            var titHeight = $('#header').offset().height;
			appcan.initBounce();
			appcan.execScriptInWin('old_fujian_zw', 'setTitle()');
			getFuJianContent();
        });
        var downLoadUlr = "" ;
		$("#nav-left").on("tap", function(){
            cmp.href.back();
        })
		$("#nav-right").on("tap", function(){
            var serviceUrl = cmp.storage.get('serviceUrl'); 
            var filepath = "wgt://data/down/"+cmp.storage.get('filename');
            var filedownloadpath = serviceUrl+downLoadUlr;
            console.log(downLoadUlr,filepath,filedownloadpath);
            //uexWidget.startApp("1", "android.intent.action.VIEW", '{"data":{"scheme":"'+filedownloadpath+'"}}')
            uexDownloaderMgr.onStatus = function(opCode, fileSize, percent, status) {
                switch (status) {
                case 0:
                    cmp.href.nextToast("文件大小:"+(fileSize/(1024*1024)).toFixed(2)+"MB"+",加载进度:"+percent+"%",15000,5,1);
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
                    alert("下载失败");
                    uexDownloaderMgr.clearTask(filepath, "1");
                    uexDownloaderMgr.closeDownloader(opCode);
                    break;
                }
            }
            var filenum = getFileNum();
            uexDownloaderMgr.createDownloader(filenum);
            //console.log('调用前：'+filenum);
            console.log(serviceUrl+downLoadUlr);
            uexDownloaderMgr.download(filenum, filedownloadpath,filepath, '1');
        })
        function setTitle(){
            $("#title").html(cmp.storage.get('filename'));
        }
        function setDownLoadURL(){
            downLoadUlr=cmp.storage.get('fileurl');
        }
		
		//同一个url请求，1、或者下载链接；2、获得附件正文
		function getFuJianContent(){
		    var serviceUrl = cmp.storage.get('serviceUrl'); 
		    var title = cmp.storage.get('filename'); 
		    var fileid = cmp.storage.get('fileid'); 
		    var phoneid = cmp.storage.get('phoneid');
		    var olduser = cmp.storage.get('olduser');
		    var oldpwd = cmp.storage.get('oldpwd');
		    //根据名字得到类型
		    var ext = title.substring(title.indexOf('.')+1)+'text';
		    var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=oldoa_detail";
		    url = url + "&username=" + olduser + "&password=" + oldpwd + "&PHONE_ID=" + phoneid;
		    url = url + "&code="+fileid + "&title=" + title+"&ext="+ext;
		    console.log(url);
		    ajaxJson(url, function(data){
		        console.log(data);
		        cmp.storage.save('fileurl',data.xzurl.RESULT); 
		        appcan.execScriptInWin('old_fujian_zw', 'setDownLoadURL()');
		        $("#content").html(data.content.CONTENT);
		    });
		}