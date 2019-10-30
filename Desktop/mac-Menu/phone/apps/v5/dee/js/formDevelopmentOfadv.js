var isLoadI18n = false;
function loadI18n(callback){
    var _basePath = "/seeyon/m3/apps/v5/dee";
    if(typeof(cmp.platform.CMPShell) != 'undefined' && cmp.platform.CMPShell){
        _basePath = "http://dee.v5.cmp/v1.0.0";
    }
    if(!isLoadI18n){
        cmp.i18n.load(_basePath + "/i18n/", "DeeResources",function(){
            callback();
            isLoadI18n = true;
        });
    } else {
        callback();
    }
}

 

function beforeSubmit(affairid, attitude, content, object, sucessCallback, failedCallBack,saveContentCallBack,isExecute) {
	//isExecute 用来判断是否需要执行dee任务，如果多人执行，不是最后一个节点，或者竞争执行不是第一个处理，那就不执行
	
	//V6.1sp1 OA-128094 Bug：自定义节点权限，设置不显示态度，微协同开发高级绑定DEE任务不生效，需要设置默认的态度值2017-08-09
    if(typeof (attitude) == 'undefined' ||  attitude == ""){
    	attitude = "collaboration.dealAttitude.haveRead";
	}
    
    if(attitude == "start"){
    	try{
			var params = {"affairid": affairid, "attitude": attitude, "operationId": content};
			 $s.Dee.valiateFormDeeDev({}, params, {
		            success: function (ret) {
		            	
		            	if (ret.success == "false") {
		            		loadI18n(function(){
		            			cmp.dialog.failure("开发高级dee任务与缓存不一致,请检查表单配置！", function (index) {
			                         if (index == 0) {
			                             //关闭
			                             if (failedCallBack && failedCallBack != "undefined") {
			                                 failedCallBack();
			                             }
			                         }
			                     },cmp.i18n("Dee.Development.fail.info"),[cmp.i18n("Dee.Development.button.close")]);
			            	});
		            	}else{
		            		loadI18n(function() {
		            	        var params = {"affairid": affairid, "attitude": attitude, "operationId": content,"isExecute":isExecute};
		            	        $s.Dee.achieveTaskType({}, params, {
		            	            success: function (ret) {
		            	                if (ret.success == "true" && ret.taskType != null) {
		            	                    if ("ext" == ret.taskType) {
		            	                        $s.Dee.preExtHandler({}, params, {
		            	                            success: function (results) {
		            	                                if (results.success == "false") {
		            	                                    if (object != null) {
		            	                                        object.close();
		            	                                    }
		            	                                    var extContent = results.errorMsg.replace(/[\r\n]/g, "");
		            	                                    var items = [cmp.i18n("Dee.Development.Transfer.audit.opinion"), cmp.i18n("Dee.button.cancel")];
		            	                                    cmp.notification.confirm(extContent, function (i) {
		            	                                        if (i == 0) {
		            	                                            if (content != "") {
		            	                                                content = content + "\r\n" + "-----------------------------" + "\r\n";
		            	                                            }
		            	                                            //转审核意见
		            	                                            try {
		            	                                                saveContentCallBack(content+extContent);
		            	                                                failedCallBack();
		            	                                            }catch (e){
		            	
		            	                                            }
		            	                                        }
		            	                                        else {
		            	                                            failedCallBack();
		            	                                        }
		            	                                    }, cmp.i18n("Dee.Development.Audit.Results"), [items[0], items[1]]);
		            	
		            	                                }
		            	                                else {
		            	                                    sucessCallback();
		            	                                }
		            	                            }
		            	                        });
		            	                    }
		            	                    else if ("dee" == ret.taskType) {
		            	                        executeDeeTask(affairid, attitude, content, null, "false", sucessCallback, failedCallBack);
		            	                    }
		            	                    else {
		            	                        sucessCallback();
		            	                    }
		            	                }
		            	                else {
		            	                    sucessCallback();
		            	                }
		            	            },
		            	            error:function(err){
		            	            	failedCallBack();
		            	            }
		            	        });
		            	    });
		            	}
		            },
		            error:function(err){
		            	
		            }
		     });
		}catch(e){}
    	
    	
    }else{
    	loadI18n(function() {
	        var params = {"affairid": affairid, "attitude": attitude, "operationId": content,"isExecute":isExecute};
	        $s.Dee.achieveTaskType({}, params, {
	            success: function (ret) {
	                if (ret.success == "true" && ret.taskType != null) {
	                    if ("ext" == ret.taskType) {
	                        $s.Dee.preExtHandler({}, params, {
	                            success: function (results) {
	                                if (results.success == "false") {
	                                    if (object != null) {
	                                        object.close();
	                                    }
	                                    var extContent = results.errorMsg.replace(/[\r\n]/g, "");
	                                    var items = [cmp.i18n("Dee.Development.Transfer.audit.opinion"), cmp.i18n("Dee.button.cancel")];
	                                    cmp.notification.confirm(extContent, function (i) {
	                                        if (i == 0) {
	                                            if (content != "") {
	                                                content = content + "\r\n" + "-----------------------------" + "\r\n";
	                                            }
	                                            //转审核意见
	                                            try {
	                                                saveContentCallBack(content+extContent);
	                                                failedCallBack();
	                                            }catch (e){
	
	                                            }
	                                        }
	                                        else {
	                                            failedCallBack();
	                                        }
	                                    }, cmp.i18n("Dee.Development.Audit.Results"), [items[0], items[1]]);
	
	                                }
	                                else {
	                                    sucessCallback();
	                                }
	                            }
	                        });
	                    }
	                    else if ("dee" == ret.taskType) {
	                        executeDeeTask(affairid, attitude, content, null, "false", sucessCallback, failedCallBack);
	                    }
	                    else {
	                        sucessCallback();
	                    }
	                }
	                else {
	                    sucessCallback();
	                }
	            },
	            error:function(err){
	            	failedCallBack();
	            }
	        });
	    });
    }
  
}

function executeDeeTask(affairid, attitude, content, currentEventId, skipConcurrent, sucessCallback, failedCallBack) {
    var params = {"affairid":affairid,"attitude":attitude,"operationId":content,"currentEventId":currentEventId,"skipConcurrent":skipConcurrent};
    $s.Dee.preDeeHandler({},params,{
        success: function(ret){
            if (ret.success == "false"){
                //抛出错误信息
                cmp.notification.alert(ret.errorMsg,null,cmp.i18n("Dee.hint"));
            }
            var hasNext = ret["hasNext"];
            var retSkipConcurrent = ret["skipConcurrent"];
            var retCurrentEventId = ret["currentEventId"];
            var blockInfoMsgType = ret["blockInfoMsgType"];
            var blockInfoReason = ret["blockInfoReason"];
            var exception = ret["exception"];
            if (exception) {
                cmp.dialog.failure(exception, function (index) {
                    if (index == 0) {
                        //关闭
                        if (failedCallBack && failedCallBack != "undefined") {
                            failedCallBack();
                        }
                    }
                },cmp.i18n("Dee.Development.fail.info"),[cmp.i18n("Dee.Development.button.close")]);
            } else if (blockInfoMsgType == "error") {
                cmp.dialog.failure(blockInfoReason, function (index) {
                    if (index == 0) {
                        //关闭
                        if (failedCallBack && failedCallBack != "undefined") {
                            failedCallBack();
                        }
                    }
                },cmp.i18n("Dee.Development.fail.info"),[cmp.i18n("Dee.Development.button.close")]);
            } else if (blockInfoMsgType == "info") {
                cmp.dialog.success(blockInfoReason, function (index) {
                    if (index == 0) {
                        //确定
                        if (hasNext == "true") {
                            executeDeeTask(affairid, attitude, content, retCurrentEventId, retSkipConcurrent, sucessCallback, failedCallBack);
                        } else {
                            sucessCallback();
                        }
                    }
                },cmp.i18n("Dee.Development.info"),[cmp.i18n("Dee.button.ok")]);
            } else {
                if (hasNext == "true") {
                    executeDeeTask(affairid, attitude, content, retCurrentEventId, retSkipConcurrent, sucessCallback, failedCallBack);
                } else {
                    sucessCallback();
                }
            }
        },
        error:function(err){
            failedCallBack();
        }
    });
}
