cmp.ready(function(){
    if(!cmp.platform.CMPShell) cmp.platform.wechatOrDD = true;

    cmp.backbutton();//将Android返回按钮劫持
    cmp.backbutton.push(cmp.href.back);//向返回按钮堆栈加入回退到上一个页面的函数
    intiPage();//初始化页面，对页面中的显示进行初始化
    bindEvent();//给页面中的按钮绑定事件
});

function intiPage(){
			var attachments = cmp.storage.get('oldfujian');
            if(attachments!='[]'&&attachments!=null&&attachments!=''){
                var att = new Object();
                att = JSON.parse(attachments) ;
                httpsucess(att);
            }else{
				 cmp.notification.alert("该事项没有附件",function(){  
            cmp.href.back();
        },"提醒","确定","",false,false);				
      }        
}

function bindEvent(){
    //给头部返回按钮绑定事件
    document.getElementById("backBtn").addEventListener("tap",function(){
        cmp.href.back();//返回上一页面
    });
}

/***********************************************分割线***************************************************/
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
            lv1.set(fujian);
            lv1.on('click', function(ele, obj, subobj) {
               appcan.locStorage.val('filename', obj.title);
               appcan.locStorage.val('fileid', obj.code);
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
                    appcan.window.openToast("文件大小:"+(fileSize/(1024*1024)).toFixed(2)+"MB"+",加载进度:"+percent+"%",0,5,1);
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
					cmp.notification.alert("文件下载失败",function(){  
						cmp.href.back();
					},"提醒","确定","",false,false);
                    uexDownloaderMgr.clearTask(filepath, "1");
                    uexDownloaderMgr.closeDownloader(opCode);
                    break;
                }
            }   
            });   
         }

