function BatchData(affairId,summaryId,category,subject,processId){
    this.affairId = affairId;
    this.summaryId = summaryId;
    this.category = category;
    this.subject = subject;
    this.processId = processId;
    this.resultCode ;
    this.parameter;
    this.attitude = '1';//态度
    this.opinion = '0';//意见必填
    this.conditionsOfNodes; //分支信息
    this.currentUserId;
    this.message;
}

BatchData.prototype.toInput = function(){
    return "<input type='hidden' name='affairId' value="+this.affairId+">"
        +"<input type='hidden' name='summaryId' value="+this.summaryId+">"
        +"<input type='hidden' name='category' value="+this.category+">"
        +"<input type='hidden' name='processId' value="+this.processId+">"
        +"<input type='hidden' name='resultCode' value="+this.resultCode+">"
        +"<input type='hidden' name='parameter' value='"+(this.attitude+","+this.opinion)+"'>";
}

window.globalBatch = null;

/**
 * 初始化
 */
function BatchProcess(){
	this.batchElement = new ArrayList();
    window.globalBatch = this;
    this.batchAttitude = null;
    this.batchOpinion = null;
    this.doBatchResult = new ArrayList();
}

/**
 * 添加数据，传出affairId,summaryId,category,subject
 */
BatchProcess.prototype.addData = function(affairId,summaryId,category,subject,processId){
    var ele = new BatchData(affairId,summaryId,category,subject,processId);
    this.batchElement.add(ele);
}


//进度条
var proce = null;
function startProcessBar() {
    try {
        proce = $.progressBar();
    } catch (e) {
    }
}
function endProcessBar(){
    if (proce != null) {
        try {
            proce.close();
        } catch (e) {
        }
    }    
}


/**
 * 执行批处理
 */
BatchProcess.prototype.doBatch = function(transObj){
	var _this = this;
    if(_this.batchElement.size() ==0) {
        alert(cmp.i18n("collaboration.batch.batchDataEmpty"));
        return false;
    }
    
    _this.preSend(function(hasNoPass) {
    	if(hasNoPass) {
    		_this.doBatchUI(transObj);
    	} else {
    		var batchList = _this.getCancelData();
    		
    		if(batchList && batchList.size() > 0) {
    			openPreBatchDialog(batchList, batchList.size(), 0,null,true);
    		} 
    	}
    });    
}

function openPreBatchDialog(cancelList, totalCount, batchCount, callback,isPreSend) {
	var cancelCount;
	var batchList;
	if(cancelList.instance){
		cancelCount = cancelList.instance.length;
		batchList = cancelList.instance;
	}else{
		cancelCount = cancelList.length;
		batchList = cancelList;
	}
	
	var paramArr = new Array();
	paramArr[0] = totalCount;
	paramArr[1] = batchCount;
	paramArr[2] = cancelCount;
	
	var html = "";
	//html += "<p>选择"+totalCount+" 个， 批处理 <font color='grant'>"+batchCount+"</font> 个， 以下  <font color='red'>"+cancelCount+"</font> 个不能进行批处理</p>";
	html += cmp.i18n("collaboration.batch.title.info", paramArr);
	html += "<br />";
	
	for(var i =0;i< cancelCount;i++) {
		var data = batchList[i];
		html += "<p style='display:inline-block;line-heigth:24px;color:#333;'>&lt;"+data.subject+"&gt;</p><br/>";
		html += "<p style='color:red;display:inline-block;line-heigth:24px;'>"+cmp.i18n("collaboration.batch.forbidder.reason");
		if (data.msg) {
			html += data.msg;
		}else if(data.message){
			html += data.message;
		}
		html += "</p><br/>";
	}
	if(cancelCount>0){
		unLockH5Workflow(batchList);//点关闭时解锁
	}
	cmp.notification.alert(html,function(){
		if(pageX.isSubmitting){
			pageX.isSubmitting = false;
		}
		//列表页点关闭不能返回
		if(totalCount != batchCount && !isPreSend){
			cmp.href.back();
		}
	},cmp.i18n("collaboration.batch.lable.title"),cmp.i18n("collaboration.button.close.label"));
}
function unLockH5Workflow(data){
	//取消时解锁
    for (var i = 0; i < data.length; i++) {
        try {
        	if(data[i]["processId"] && data[i]["resultCode"] != 28){//特殊处理OA-125884
        		$s.Workflow.unLockH5Workflow({"processId":data[i]["processId"], "action":14}, errorBuilder());
        	}
        } catch(e) {}
    }
}

/**
 * 执行批页面显示
 */
BatchProcess.prototype.doBatchUI = function(transObj) {
	var _this = this;
	
	var affairs = "";
	var summarys = "";
	var categorys = "";
	var memberIds = "";
	var processIds = "";
	var attitudes = "";
	var opinions = "";
	var conditionsOfNodes = [];
	var splitChat = "";
	
	var data = _this.getProcessBatchData();
	
	if(data.size() > 0) {
		var batchAttitude  = "3";
		var batchOpinion = "0";
		for(var i=0; i<data.size(); i++) {
			if(affairs != "") {
			    splitChat = ",";
			}
			affairs += splitChat + data.get(i).affairId;
			summarys += splitChat +  data.get(i).summaryId;
			categorys += splitChat +  data.get(i).category;
			processIds += splitChat +  data.get(i).processId;
			memberIds += splitChat +  data.get(i).memberId;
			attitudes += splitChat +  data.get(i).attitude;
			opinions += splitChat +  data.get(i).opinion;
			conditionsOfNodes.push(data.get(i).conditionsOfNodes || "")
		}
		var params = {
				"batchAttitude" : _this.batchAttitude,
				"batchOpinion" : _this.batchOpinion,
				"affairs" : affairs,
				"conditionsOfNodes" : conditionsOfNodes,
				"summarys" : summarys,
				"categorys" : categorys,
				"processIds" : processIds,
				"memberIds" : memberIds,
				"attitudes" : attitudes,
				"opinions" : opinions,
				"currentUserId" : _this.currentUserId,
				"batchCount" : data.size(),
				"totalCount" : _this.eleSize(),
				"cancelData" : _this.getCancelData(),
				"m3todo" : transObj ? transObj.m3todo : false
		};
		if(!(transObj ? transObj.m3todo : false)){
			cmp.listView(_currentListDiv).updateAdditionalParts(false);//离开时退出批量操作状态
		}
		cmp.event.trigger("beforepageredirect",document);
		cmp.href.next(_collPath + "/html/batchDeal.html"+colBuildVersion, params);
	} else {
		return;
	}
}


BatchProcess.prototype.submitForm = function(param){
	
	startProcessBar();
	
	var __batchManager = new batchManager();
    var rs=__batchManager.transDoBatch(param);
	if(rs != 'ok_success'){
		globalBatch.doBatchResult.add(rs);
	}
	endProcessBar();
}

BatchProcess.prototype.createInput = function(name,value){
    var values = value;
    if (name == "content"){
        values = escapeStringToHTML(value,false,false);
    }
    return "<input type='hidden' name='"+name+"' value='"+values+"'>";
}

//预执行-返回是否全部可以批处理
BatchProcess.prototype.preSend = function(callback) {
	
	var _this = this;
	
    //记录code，如果有不通过的，给提示。选择提示为true，返回true。否则false
    // 全部通过，直接返回true；
    var affairs = [],summarys = [],categorys=[];
    
    var affairs = "";
    for(var i = 0 ; i < _this.batchElement.size();i++){
        var el = _this.batchElement.get(i);
        if(affairs != "") {
        	affairs += ",";
        	summarys += ",";
        	categorys += ",";
        }
        affairs += el.affairId;
        summarys += el.summaryId;
        categorys += el.category;
    }

    cmp.dialog.loading();
    
    var params = {};
    params["affairs"] = affairs;
    params["summarys"] = summarys;
    params["categorys"] = categorys;
    
    $s.Coll.checkPreBatch(params, errorBuilder({
		success : function(rs) {
			
			if(rs) {
				var hasNoPass = false;
				
				_this.currentUserId = rs.currentUserId;
				
				if(rs.result.length > 0) {
					
					for(var i = 0; i<rs.result.length; i++) {
			            var batchResult = rs.result[i];
			            var ele = _this.getBatchData(batchResult.affairId,batchResult.summaryId);
			            if(ele) {
			            	ele.processId =  batchResult.processId;
			                ele.resultCode  = batchResult.resultCode;
			                if(batchResult.message) {
			                    ele.parameter = batchResult.message;
			                    ele.message = batchResult.message;
			                    ele.conditionsOfNodes = batchResult.conditionsOfNodes;
			                    if (ele.parameter.length == 3) {
			                        ele.msg = ele.parameter[2];
			                        ele.message = ele.parameter[2];
			                    };
			                    if(ele.parameter.length == 4){
		                        	ele.message = ele.parameter[3];
		                        }
			                }
			                
			                if(parseInt(ele.resultCode,10) <= 10 && ele.parameter) {
			                    ele.attitude = ele.parameter[0];
			                    ele.opinion = ele.parameter[1];
			                    if(_this.batchAttitude == null || parseInt(ele.attitude) < _this.batchAttitude){
			                    	_this.batchAttitude = parseInt(ele.attitude);
			                    }
			                    if(_this.batchOpinion == null || parseInt(ele.opinion)==parseInt(1)){//|| parseInt(ele.opinion) > this.batchOpinion
			                    	_this.batchOpinion = parseInt(ele.opinion);
			                    }
			                    //只要有能够处理的，都处理
			                	hasNoPass = true;
			                }
			            }
					}
				}
				cmp.dialog.loading(false);
				if(callback) {
					callback(hasNoPass);
				}
			}else{
				cmp.dialog.loading(false);
			}
		}
    }));
}


BatchProcess.prototype.getCancelData = function(){
    var result = new ArrayList();
    for(var i = 0 ; i < this.batchElement.size();i++){
        var ele =  this.batchElement.get(i);
        if(ele && ele.resultCode && parseInt(ele.resultCode,10) > 10){
            result.add(ele);
        }
    }
    return result;
}
BatchProcess.prototype.getProcessBatchData = function(){
    var result = new ArrayList();
    for(var i = 0 ; i < this.batchElement.size();i++){
        var ele =  this.batchElement.get(i);
        try {
        	if(ele && ele.resultCode && parseInt(ele.resultCode,10) < 10) {
                result.add(ele);
            }	
        } catch(e) {}
    }
    return result;
}
BatchProcess.prototype.isEmpty = function(){
    return this.batchElement.size() == 0;
}
BatchProcess.prototype.eleSize = function(){
    return this.batchElement.size();
}
BatchProcess.prototype.getBatchData = function(affairId,summaryId){
    for(var i = 0 ; i < this.batchElement.size();i++){
        var el = this.batchElement.get(i);
        if(el.affairId == affairId && el.summaryId == summaryId){
            return el;
        }
    }
}