function getOpenFrom(){
	return "listPending";
}
function addOneSub(n){
    return parseInt(n)+1;
}
var isDeleteCount = 0;
// 列表删除
function _deleteList(paramObj){
	isDeleteCount = addOneSub(isDeleteCount);
	//不能重复提交，
	if(parseInt(isDeleteCount)>=2) {
		_alert(cmp.i18n("collaboration.list.notRepeat"));
		//alert("请不要重复点击！");
	    return;
	}
	
    var affairIds = "";
    var deleteSubject1 = "";// 未处理的协同模板
    var deleteSubject2 = "";// 意见不能为空
    var deleteSubject3 = "";
    var deleteSubject4 = "";//指定回退到发起人
    var deleteSubject5 = "";//当前节点设置不允许删除
    var isCanDeleteORarchive = false;
    var params = [];
    var _map = {};
    var isCanSubmitWorkFlowRe = false;
    var data = paramObj;
    if(data.length<1){
        _alert(cmp.i18n("collaboration.grid.alert.selectOneDelete"));//请选择要删除的协同！
        isDeleteCount = 0;
        return;
    }
    var _listTab = getOpenFrom();
    if("listPending"==_listTab){
        _listTab = "pending";
    }
    
    var objSummarys = [];
	var objAffairs =[];
	  
    for(var i = 0; i < data.length; i++){
    	objSummarys.push(data[i].summaryId);
    	objAffairs.push(data[i].affairId);
    	
        affairIds += data[i]["affairId"] + ",";
        
        //当前节点设置不允许删除
        if ("false" == data[i]["canReMove"]){
        	if (data.length == 1) {
        		_alert(cmp.i18n('collaboration.grid.alert.CantReMoveOne'));
        		isDeleteCount = 0;
        	  	 return;
        	} else {
        		deleteSubject5 += "<br>&lt;"+escapeStringToHTML(data[i]["subject"])+"&gt;";
        	}
        }
        // 指定回退状态状态不能删除
        if("listWaitSend" == _listTab){
             if(data[i].subState == '16' ){
                 deleteSubject4 += "<br>&lt;"+escapeStringToHTML(data[i]["subject"])+"&gt;";
              }
         }
        if("pending" == _listTab){
            if(data[i]["templateId"] && data[i]["templateId"]!="null"){
                // 未办理的模板协同不允许直接删除!
                deleteSubject1 += "<br>&lt;"+escapeStringToHTML(data[i]["subject"])+"&gt;";
            }
            if ("true" == data[i]["canDeleteORarchive"]) {
                isCanDeleteORarchive = true;
                deleteSubject2 += "<br>&lt;"+escapeStringToHTML(data[i]["subject"])+"&gt;";
            }
          //封装判断指定回退与锁的变量
            var map = {};
            map["workitemId"] = data[i]["workitemId"];
            map["processId"] = data[i]["processId"];
            params.push(map);
        }
       
    }
    _map["_DEL_KEYS_"] = params;
    //节点权限控制是否删除
    if(deleteSubject5.length > 1){
  	  _alert(cmp.i18n('collaboration.grid.alert.CantReMove') + "<br/>" + deleteSubject5);
  	  isDeleteCount = 0;
  	  return;
    }
    if ("listWaitSend" == _listTab) {
        if (deleteSubject4.length > 1) {
            //当前流程处于指定回退状态,你不能进行此操作!
            _alert(cmp.i18n("collaboration.grid.alert.CantModifyBecauseOfAppointStepBack") + "<br/>" + deleteSubject4);
            isDeleteCount = 0;
            return;
        }
    }
    if ("pending" == _listTab) {
        // 判断事项是待办还是其它
        if(deleteSubject1.length > 1){
            // "未办理的模板协同不允许直接归档或删除!"
            _alert(cmp.i18n("collaboration.grid.alert.NotDeleteCol1") + "<br>" + deleteSubject1);
            isDeleteCount = 0;
            return;
        }
        // 以下事项要求意见不能为空，不能直接归档或删除:
        if(isCanDeleteORarchive){ 
            _alert(cmp.i18n("collaboration.grid.alert.NotDeleteCol2") + "<br>" + deleteSubject2);
            isDeleteCount = 0;
            return;
        }
        // 指定回退与锁
        $s.Workflow.canBatchDelete({}, _map, errorBuilder({
            success:function(result){
                for(var i = 0; i < data.length; i++){
                    if (result[i][0] == "false") {
                        isCanSubmitWorkFlowRe = true;
                        deleteSubject3 += "<br><"+ data[i]["subject"] + ">" + result[i][1];
                    }
                }
                if(isCanSubmitWorkFlowRe) { 
                    _alert(deleteSubject3);
                    isDeleteCount = 0;
                } else {
                    _doDelete(affairIds, _listTab, data);
                }
            }
        }));
    } else {
    	var idMap = {
    		"summaryID" : objSummarys,
    		"affairID" : objAffairs
    	}
    	//协同待发列表删除前事件
        var eventParams={
        	funName : "beforeWaitSendDelete",
        	data : idMap,
        	success : function(){
        		_doDelete(affairIds, _listTab, data);
        	},
        	error : function(){
        		
        	}
        }
        cmp.funProxy.getter(eventParams);
    }
    
}
function _doDelete(affairIds, _listTab, data) {

    //"该操作不能恢复，是否进行删除操作?"
    cmp.notification.confirm(cmp.i18n("collaboration.grid.alert.sureToDelete"),function(e){ // e==1是/e==0 否
        if(e==1){ // 是
        	isDeleteCount = 0;
            // 判断是否能够删除
            $s.Coll.checkCanDelete({"affairIds" : affairIds, "from" : _listTab}, errorBuilder({
                success:function(ret){
                    if (ret["success"]=="false") {
                        _alert(ret["error_msg"]);
                        //流程不能删除时解锁
                    	unLockH5Workflow(data);
                    	isDeleteCount = 0;
                    } else {
                        $s.Coll.deleteAffairs(_listTab,affairIds,{},errorBuilder({ //{"from":_listTab,"affairIds":affairIds}, {// 执行删除
                            success:function(result){// 删除成功以后
                                if (result["success"]){
                                    _alert(cmp.i18n("collaboration.grid.alert.Deletesuccess"));//"删除成功！"
                                    cmp.router.notify('M3ProcessFinish', {
        								type: 'delete',
        								success: true
        							});
                                }
                            }
                        }));
                     }
                 }
            }));
        } else {
            //取消时解锁
        	unLockH5Workflow(data);
        	isDeleteCount = 0;
        }
    },null, [cmp.i18n("collaboration.page.lable.button.cancel") , cmp.i18n("collaboration.page.dialog.OK")],null,null,0);

}

function _alert(message, completeCallback, title, buttonLabel, popExeCallback) {
    if(!title) {
        title = cmp.i18n("collaboration.page.dialog.note");
    }
    if(!buttonLabel) {
        buttonLabel = cmp.i18n("collaboration.page.dialog.OK");
    }
    
    var popCallback = true;
    if(popExeCallback === false){
        popCallback = false;
    }
    var exeCallback = completeCallback;
    if(!completeCallback)
        exeCallback = function(){}
    
    cmp.notification.alert(message, exeCallback, title, buttonLabel, popCallback);
}

var forwardCount = 0;
//列表转发
function listForwards(paramObj){
	
	forwardCount = addOneSub(forwardCount);
	//不能重复提交，
	if(parseInt(forwardCount)>=2) {
		_alert(cmp.i18n("collaboration.list.notRepeat"));
	    return;
	}

	var summaryIds = "";
	var affairIds = "";
	var dataStr = "";
	var temDataStr ="";
	var data = paramObj;
	var nMap = new Object();
	var needCheck = false;
	if(data.length<1){
		_alert(cmp.i18n("collaboration.forward.alert.select"));
		forwardCount = 0;
		return;
	}
	var _list = getOpenFrom();
	for(var i = 0; i < data.length; i++){
        dataStr += data[i]["affairId"] + ",";
        summaryIds += data[i]["summaryId"]+"_";
        affairIds += data[i]["affairId"]+"_";
        if(_list =="listWaitSend" &&  (data[i].templateId && data[i].templateId !="null" )){
        	nMap[data[i]["affairId"]+"_"+data[i].templateId] = data[i].subject;
        	if(temDataStr != ""){
        	    temDataStr += ",";
        	}
        	temDataStr += data[i]["templateId"];
        	needCheck = true;
        }
    }
	if(needCheck){
    	$s.Coll.isTemplateDeleted({"templateIds":temDataStr},errorBuilder({
        	 success: function(ret){
        	     var delTemplateIds = ret["data"]["delTemplateIds"];
        	     
        	     if(ret &&  ret.code=="0"){
        	         if(delTemplateIds.length>0){
        	             for(var i = 0; i < data.length; i++){
                             for(var j = 0; j < delTemplateIds.length; ji++){
                                 if(data[i]["templateId"] == delTemplateIds[j]){
                                     _alert(cmp.i18n('collaboration.forword.errorTemplate',[data[i]["subject"]]));
                                     forwardCount =0;
                                     return;
                                 }
                             }
                         }
        	         }
                     var _forwardParam = {
                             summaryId : summaryIds,
                             affairId : affairIds
                     };
                     var selectedData = {
                             "data":dataStr
                     }
                     // 校验能否转发
                     $s.Coll.checkForwardPermission({},selectedData,errorBuilder({
                         success: function(result){
                              if(result.code == 1){ 
                                   // 以下协同不能转发，请重新选择
                                  _alert(cmp.i18n("collaboration.pighole.alert.noCanForward")+"<br><br>" + result.message);
                                  forwardCount =0;
                                  return;
                               }else{
                                   cmp.event.trigger("beforepageredirect",document);
                                   cmp.href.next(_collPath + "/html/colForward.html"+colBuildVersion, _forwardParam);
                                 
                                   //新开webview，直接设置标记
                                   setTimeout(function(){
                                       forwardCount = 0;
                                   }, 500)
                               }
                         }
                     }));
               
           	      }
        	     else{
        	         _alert(result.message);
                     forwardCount =0;
                     return;
        	     }
           },
           error : function (result){
               _alert(result.message);
               forwardCount =0;
               return;
           }
       }));
    	
    
    
	}else{
		var _forwardParam = {
	    		summaryId : summaryIds,
	    		affairId : affairIds
	    };
	    var selectedData = {
	    		"data":dataStr
	    }
	    //校验能否转发
	    $s.Coll.checkForwardPermission({},selectedData,errorBuilder({
	    	success: function(result){
	    		 if(result.code == 1){
	    	          //以下协同不能转发，请重新选择
	    			 _alert(cmp.i18n("collaboration.pighole.alert.noCanForward")+"<br><br>" +result.message);
	    			 forwardCount =0;
	    	         return;
	    	      }else{
	    	    	  cmp.event.trigger("beforepageredirect",document);
	    	    	  cmp.href.next(_collPath + "/html/colForward.html"+colBuildVersion, _forwardParam);
	    	    	  
	    	    	//新开webview，直接设置标记
                      setTimeout(function(){
                          forwardCount = 0;
                      }, 500)
	    	      }
	        }
	    }));
	}
}

var archivePigeonholeCount = 0;
//归档
function archivePigeonhole(paramArray){
	
	archivePigeonholeCount = addOneSub(archivePigeonholeCount);
	//不能重复提交，
	if(parseInt(archivePigeonholeCount)>=2) {
		_alert(cmp.i18n("collaboration.list.notRepeat"));
		
		cmp.router.notify('M3ProcessFinish', {
            type: 'archive',
            success: false
        });
		
	    return;
	}
	//获取归档数据
	_affairIds = "";
	var archiveSubject = "";
	var opinionSubject = "";
	var isCanarchive = false;
	var para = [];
	var _map = {};
	var isCanSubmitWorkFlowRe = false;
	var workflowSubject = "";
	var data = paramArray;
	if(data.length<1){
		_alert(cmp.i18n("collaboration.pighole.alert.select"));
		archivePigeonholeCount = 0;
		
		cmp.router.notify('M3ProcessFinish', {
            type: 'archive',
            success: false
        });
		
		return;
	}
	_listType = getOpenFrom();
	if("listPending"==_listType){
		_listType = "pending";
	}
	for(var i = 0; i < data.length; i++){
		_affairIds += data[i]["affairId"] + ",";
		if("pending"==_listType){
			if(data[i]["templateId"] && data[i]["templateId"]!="null"){
				// 未办理的模板协同不允许直接归档!
				archiveSubject += "<br>&lt;"+escapeStringToHTML(data[i]["subject"])+"&gt;";
			}
			if("true" == data[i]["canDeleteORarchive"]){
				opinionSubject += "<br>&lt;"+escapeStringToHTML(data[i]["subject"])+"&gt;";
				isCanarchive = true;
			}
			var map = {};
			map["workitemId"] = data[i]["workitemId"];
	        map["processId"] = data[i]["processId"];
	        para.push(map);
		}
	}
	if("pending"==_listType){
		//待办时模板不能归档
		if(archiveSubject.length > 1){
			_alert(cmp.i18n("collaboration.pighole.alert.noCanArchive") + "<br>" +archiveSubject);
			archivePigeonholeCount = 0;
			
			cmp.router.notify('M3ProcessFinish', {
                type: 'archive',
                success: false
            });
			
			return;
		}
		//待办时判断意见是否能为空
		if(opinionSubject.length > 1){
			_alert(cmp.i18n("collaboration.grid.alert.NotDeleteCol2") + "<br>" +opinionSubject);
			archivePigeonholeCount = 0;
			
			cmp.router.notify('M3ProcessFinish', {
                type: 'archive',
                success: false
            });
			
			return;
		}
		_map["_DEL_KEYS_"] = para;
		$s.Workflow.canBatchDelete({}, _map, errorBuilder({//并发节点归档时判断锁
          success:function(result){
              for(var i = 0; i < data.length; i++){
                  if (result[i][0] == "false") {
                      isCanSubmitWorkFlowRe = true;
                      workflowSubject += result[i][1]+"<br>&lt;"+ escapeStringToHTML(data[i]["subject"]) + "&gt;";
                  }
              }
              if(isCanSubmitWorkFlowRe) { 
                  _alert(workflowSubject);
                  archivePigeonholeCount = 0;
                  
                  cmp.router.notify('M3ProcessFinish', {
                      type: 'archive',
                      success: false
                  });
                  
                  return;
              }else{
              	// 判断是否能够归档
              	$s.Coll.checkCanDelete({"affairIds" : _affairIds, "from" : _listType}, errorBuilder({
                      success:function(ret){
                          if (ret["success"]=="false") {
                              _alert(ret["error_msg"]);
                              unLockH5Workflow(data);
                              archivePigeonholeCount = 0;
                              
                              cmp.router.notify('M3ProcessFinish', {
                                  type: 'archive',
                                  success: false
                              });
                              
                              return;
                          } else {
                          	pigeonhole(_listType,data);
                           }
                       }
                  }));
              	
              }
            
          }
      }));
	}else{
		pigeonhole(_listType,data);
	}
	
}

function pigeonhole(_listType,data){

	//归档前判断是否满足归档条件
	var params = {"affairIds":_affairIds};
	$s.Coll.getPigeonholeRight({},params,errorBuilder({
		success: function(result){
			if(result.success && result.success !=""){
				_alert(result.success,null,cmp.i18n("collaboration.pigeonhole.alert.note"),null);
				archivePigeonholeCount = 0;
				unLockH5Workflow(data);
				
				cmp.router.notify('M3ProcessFinish', {
                    type: 'archive',
                    success: false
                });
				
				return;
			}
			archivePigeonholeCount = 0;
			//调文档中心接口获取归档目录的ID
			_getDestFolderId(data,function (destFolderId,folderName){
				if(destFolderId=="-1"){
					archivePigeonholeCount = 0;
					cmp.router.notify('M3ProcessFinish', {
                        type: 'archive',
                        success: false
                    });
					
					return;
				}else{
					//归档
					var _params = {
							"affairIds":_affairIds,
							"destFolderId":destFolderId,
							"listType":_listType
					};
					$s.Coll.transPigeonhole({},_params,errorBuilder({
						success:function(ret){//归档成功以后
							if(ret.success_msg){
								_alert(ret.success_msg);
							}
							if(ret.success != "false"){
								_alert(cmp.i18n("collaboration.grid.alert.archiveSuccess", [folderName]));
							}
							
							cmp.router.notify('M3ProcessFinish', {
								type: 'archive',
								success: true
							});
							
							unLockH5Workflow(data);
						}
					}));
				}
			});
		}
	}));
}

function _getDestFolderId(data,calback){
	docPigehole4Col(data,function (_result){
		if(_result && _result.msg=="OK"){
			var params = {
					affairId : _affairIds,
		            destFolderId : _result.id
		    }
			//校验同一个人是否将协同归档到同一个目录
			$s.Coll.getIsSamePigeonhole({},params,errorBuilder({
				success: function(result){
		            if(result["retMsg"]){
		                cmp.notification.confirm(result["retMsg"],function(e){ //e==1是/e==0 否
		        	        if(e==1){ //是
		        	        	calback(_result.id,_result.fullPath);
		        	        }else{
		        	        	calback("-1","");  
		        	        }
		        	    },null, [ cmp.i18n("collaboration.page.lable.button.cancel"), cmp.i18n("collaboration.page.dialog.OK")],null,null,0);
		            }else{
		            	calback(_result.id,_result.fullPath);
		            }
		        }
			}));
		}else{//点取消
			unLockH5Workflow(data);
			_$("#docPigeonhole").classList.remove('cmp-active');
			calback("-1","");
		}
	});
}

function unLockH5Workflow(data){
	//取消时解锁
    for (var i = 0; i < data.length; i++) {
        try {
            $s.Workflow.unLockH5Workflow({"processId":data[i]["processId"], "action":14}, errorBuilder());
        } catch(e) {}
    }
}
