cmp.ready(function(){
	var cmpData = new UrlSearch(); //取参数
	if(cmpData["state"] != undefined && !cmpData["state"]){
		cmp.href.closePage();
		return;
	}
	initOpen(cmpData);
})

function UrlSearch(){
	var name, value;
	var str = location.href; // 取得整个地址栏
	var num = str.indexOf("?")
	str = str.substr(num + 1); // 取得所有参数 stringvar.substr(start [, length ]
	var arr = str.split("&"); // 各个参数放到数组里
	for (var i = 0; i < arr.length; i++) {
		num = arr[i].indexOf("=");
		if(num == -1){
			name = "state";
			value = false;
			this[name] = value;
			return;
		}
		if (num > 0) {
			name = arr[i].substring(0, num);
			value = arr[i].substr(num + 1);
			this[name] = value;
		}
	}
}


function initOpen(cmpData) {
    var frId = cmpData["fr_id"];
	var entranceType = cmpData["entranceType"];
	var fr_type = cmpData["fr_mine_type"];
	var isShareAndBorrowRoot = cmpData["isShareAndBorrowRoot"];
	obj = {};
	obj.cmpData = cmpData;
	cmp.dialog.loading();
	$s.Doc.canOppen({
		"drId": frId,
		"frType": cmpData["fr_type"],
		"entranceType":entranceType
	}, {repeat:true,
		success: function(result) {
			if(result == "1"){
				//当前文档不存在
				cmp.notification.alert(cmp.i18n("doc.h5.noExist"), function(){
					//cmp.listView("#allPending").pullupLoading(1);
					cmp.dialog.loading(false);
					cmp.href.closePage();
				}, cmp.i18n("doc.h5.alert"), cmp.i18n("doc.h5.OK"));
				return;
			} else if(result == "2"){
				//没有打开文档的权限
				cmp.notification.alert(cmp.i18n("doc.h5.noAuthoir"), function(){
				    cmp.dialog.loading(false);
				    cmp.href.closePage();
				}, cmp.i18n("doc.h5.alert"), cmp.i18n("doc.h5.OK"));
				return;
			} else if(result == "0"){
				var source_fr_type = fr_type;
				if (fr_type == 51) { //映射文件
					$s.Docs.getDosBySourceId(cmpData["source_id"], "", {
						repeat:true,
						success: function(docsData) {
							fr_type = docsData.frType;
							var doc_id = docsData.id;
							var isPig = docsData.isPig;
							if(isPig == 'true'){
								cmpData["source_id"] = docsData.sourceId;
							}
							docCanOpen(fr_type,doc_id,cmpData,source_fr_type);
						},
				        error: function(error){
				        	var cmpHandled = cmp.errorHandler(error,cmp.href.closePage);
			                if(cmpHandled){
			                    
			                }else{
			                }
				        }
					});
				} else {
					docCanOpen(fr_type,frId,cmpData,source_fr_type);
				}
			}
			cmp.dialog.loading(false);
		},
        error: function(error){
        	var cmpHandled = cmp.errorHandler(error,cmp.href.closePage);
            if(cmpHandled){
                
            }else{
            }
            cmp.dialog.loading(false);
        }
	});
}

function docCanOpen(fr_type,frId,cmpData,source_fr_type) {
	var backPageInfo = _docPath + "/html/doc4xz.html";//请求的页面地址,留给小智
    if ((fr_type >= 101 && fr_type <= 122) || (fr_type >= 21 && fr_type <= 26)) {
        openRealDoc(frId,source_fr_type);
    } else { //讨论
        var source_id = cmpData["source_id"];
        $s.Doc.insertOpLog4Doc({
            "drId": frId
        }, {
            success: function() {
            	if(fr_type == 8){//讨论
            		bbsApi.jumpToBbs(source_id, "pigeonhole", backPageInfo,true);
            	}else if(fr_type == 7){//调查
            		inquiryApi.jumpToInquiry(source_id, "1", backPageInfo,true);
            	}else if(fr_type == 6){//公告
            		bulletinApi.jumpToBulletin(source_id, "1", backPageInfo,true);
            	}else if(fr_type == 5){//新闻
            		newsApi.jumpToNews(source_id, "1", backPageInfo,true);
            	}else if(fr_type == 1 || fr_type == 9){//协同、流程表单
            	    collApi.openSummary({
            	        summaryId : source_id,
            	        openFrom : "docLib",
            	        operationId : "1",
            	        docResId : cmpData["fr_id"],
            	        fromXz : true
            	    });
            	}else if(fr_type == 2){//公文
            		edocApi.openSummary({
                        summaryId : source_id,
                        openFrom : "lenPotent",
                        docResId : cmpData["fr_id"],
            	        fromXz : true
                    });
            	}else if(fr_type == 4){//会议
            		meetingApi.jumpToMeetingSummary(source_id, "docLib", backPageInfo,true);
            	}else{//暂时其他的类型
            		cmp.notification.alert(cmp.i18n("doc.h5.docTypeError"), null, cmp.i18n("doc.h5.alert"), cmp.i18n("doc.h5.OK"));
            	}
            },
            error: function(error){
            	var cmpHandled = cmp.errorHandler(error,cmp.href.closePage);
                if(cmpHandled){
                    
                }else{
                }
            }
        });
    }
}


function openRealDoc(drId,type) {
    var docParam = {
        "drId": drId,
        "isForm":false,
		"isFormCol":false,
		"source_fr_type":type,
        "pageInfo": _getCurrentPageInfo(),
        "fromXZ":true
    }
    $s.Doc.insertOpLog4Doc({
        "drId": drId
    }, {
        success: function() {
        	cmp.href.next(_docPath + "/html/docView.html", docParam);
        },
        error: function(error){
        	var cmpHandled = cmp.errorHandler(error,cmp.href.closePage);
            if(cmpHandled){
                
            }else{
            }
        }
    });
}

//获取当前页面信息,用于页面返回使用
function _getCurrentPageInfo(){
    var _thisPage = {
    		"url" : _docPath + "/html/doc4xz.html" //请求的页面地址,留给小智
    }
    return _thisPage;
}