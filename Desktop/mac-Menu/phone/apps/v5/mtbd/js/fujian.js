cmp.ready(function() {
            //var titHeight = $('#header').offset().height;
            var attachments = cmp.storage.get('attachments');
            console.log(attachments);
            if (attachments) {
                var att = new Object();
                att['attachments'] = JSON.parse(attachments);
                httpsucess(att)
            } else {
                getFujian();
            }
			cmp.backbutton();//将Android返回按钮劫持
			cmp.backbutton.push(cmp.href.back);//向返回按钮堆栈加入回退到上一个页面的函数
        });
        
		
		
		function getFujian() {
		    var affairid = cmp.storage.get('affairid');
		    var summaryid = cmp.storage.get('summaryid');
		    var serviceUrl = cmp.storage.get('serviceUrl');
		    var phoneid = cmp.storage.get('phoneid');
		    var loginname = cmp.storage.get('loginname');
		    var password = cmp.storage.get('password');
		    var url = serviceUrl + "/servlet/PublicServiceServlet?stype=attachments&message_id=nhoa_edoc";
		    url = url + "&username=" + loginname + "&password=" + password + "&pageNo=1&PHONE_ID=" + phoneid + "&affairid=" + affairid + "&summaryid=" + summaryid;
		    console.log(url);
		    ajaxJson(url, httpsucess);
		}
		
		function httpsucess(info_list) {
		    console.log(info_list['attachments']);
		    var info_list_mode = new Array(info_list['attachments'].length);
		    console.log(info_list['attachments'].length);
		    if (info_list['attachments'].length == 0) {
		        cmp.notification.alert("该事项没有附件",function(){
		            //do something after tap button
		            cmp.href.back();
		        },"提示","确定","",false,false);
		    }
		    for ( i = 0; i < info_list['attachments'].length; i++) {
		        var info_mode = new Object();
		        info_mode.fileid = info_list['attachments'][i].file_url;
		        info_mode.filename = info_list['attachments'][i].filename;
		        info_mode.title = info_list['attachments'][i].filename;
		        info_list_mode.push(info_mode);
		    }
		
		    var html=""
		    html+='<ul>'
		    for ( i = 0; i < info_list_mode.length; i++) {
		        if(info_list_mode[i]==null){
		            continue;
		        }
		        html+='<li class="ubb ub bc-border t-bla ub-ac lis" data-index="'+i+'">'
		        html+='<ul class="ub-f1 ub ub-pj ub-ac">'
		        html+='<ul class="ub-f1 ub ub-ver marg-l">'
		        html+='<li class="bc-text ub ub-ver ut-m line2">'
		        html+=info_list_mode[i].title
		        html+='</li>'
		        html+='</ul>'
		        html+='</ul>'
		        html+='</li>'
		    }
		    html+='</ul>'
		    $("#listview").html(html);
		    $("#listview>ul>li").on('tap',function(event){
		        var obj = info_list_mode[event.currentTarget.attributes["data-index"].value]
		        openfujian(obj.fileid, obj.filename);
		    });
		
		    function openDetail(fileid, filename) {
		        /*appcan.window.open({
		            name : 'zhengwen',
		            data : 'zhengwen.html',
		            aniId : 10
		        });*/
		        cmp.href.next({
		           name : 'new_fujian_zw',
		           data : 'new_fujian_zw.html',
		            aniId : 10
		       });
		        console.log(fileid, filename);
		        cmp.storage.save('fileid', fileid);
		        //cmp.storage.save('city', city);
		    }
		    function openfujian(fileid, filename)
		    {
		    var serviceUrl = cmp.storage.get('serviceUrl'); 
		    var phoneid = cmp.storage.get('phoneid'); 
		    var fileid = cmp.storage.get('fileid'); 
		    var loginname = cmp.storage.get('loginname'); 
		    var password =  cmp.storage.get('password'); 
		    var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=newoa_file" ;
		    url = url + "&username="+loginname+"&password="+password+"&PHONE_ID="+phoneid+"&fileid="+fileid;
		    ajaxJson(url,httpopensucess);  
		    }
		    function httpopensucess(data){
		              
		         
		       
		    var serviceUrl = cmp.storage.get('serviceUrl'); 
		    var filepath = "wgt://data/down/"+data.xzurl.URL;
		    var filedownloadpath = serviceUrl+data.xzurl.URL;
		   // console.log(filepath,filedownloadpath);
		    //uexWidget.startApp("1", "android.intent.action.VIEW", '{"data":{"scheme":"'+filedownloadpath+'"}}')
		    var filenum = getFileNum();
		   
		    uexDownloaderMgr.createDownloader(filenum);
		    //console.log('调用前：'+filenum);
		  //  console.log(serviceUrl+downLoadUlr);
		  console.log(filedownloadpath);
		  console.log(filepath);
		    uexDownloaderMgr.download(filenum,filedownloadpath,filepath, '1');
		    uexDownloaderMgr.onStatus = function(opCode, fileSize, percent, status) {
		        switch (status) {
		        case 0:
		            cmp.href.nextToast("文件大小:"+(fileSize/(1024*1024)).toFixed(2)+"MB"+",加载进度:"+percent+"%",0,5,1);
		            break;
		        case 1:
		         
		            cmp.href.back();
		            uexDownloaderMgr.closeDownloader(opCode);
		            //console.log('完成时：'+num);
		            //alert("下载成功");
		            uexDocumentReader.openDocumentReader(filepath);
		            break;
		        case 2:
		            cmp.href.back();
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
		    
		    
		    };
		}