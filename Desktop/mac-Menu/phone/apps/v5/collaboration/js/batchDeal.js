var urlParam = {};

var pageX = {}
pageX.MAX_INPUT_LENGTH = 2000;

cmp.ready(function() {// 缓存详情页面数据
	
	urlParam = cmp.href.getParam();
	
	_initBackEvent();
	
	cmp.i18n.init(_collPath + "/i18n/", "Collaboration", function(){

		//国际化title
		_$("title").innerText=cmp.i18n("collaboration.page.lable.button.batchDeal");
		
		_initHTML();
	    
		_initEvent();
		
		var $content = _$("#content");
		// cmp.HeaderFixed("#hid", $content);
		cmp.description.init(document.querySelector("#content"));
	},$verstion);
    
});

/**
 * 返回事件
 */
function _initBackEvent() {
    
    cmp.backbutton();
    cmp.backbutton.push(goBackWithoutRefresh);
    
    // _$("#goBackBtn").addEventListener("tap", goBackWithoutRefresh);
}

//返回协同首页，并且不刷新listview
function goBackWithoutRefresh() {
    setListViewRefresh("false");
    _goBack();
}

//返回协同首页，并且不刷新listview
function gotoList() {
    setListViewRefresh("true");
    pageX.isSubmitting = false;
    _goBack();
}

//返回上一个页面
function _goBack() {
    _releaseBatchLock();
	cmp.href.back();
}

/**
 * 解锁
 */
function _releaseBatchLock(){
    
    var processIdArr = urlParam["processIds"].split(",");
    var memberIdArr = urlParam["memberIds"].split(",");
    for(var i=0; i<processIdArr.length; i++) {
        WorkFlowDesigner.prototype.releaseWorkflowByAction(processIdArr[i], 14);
    }
}


function _initHTML() {
	_initAttitude();
	
	//加载意见框
    _initContent();
    
    _initCommonPhrase();
}

function _initEvent() {
	cmp.event.click(_$("#submitBtn"), function(){
        
		var batchOpinion = urlParam["batchOpinion"];
		
    	var replyAttitude = "1";
		var inputs = document.querySelectorAll(".cmp-radio2");
		for(var i=0; i<inputs.length; i++) {
			if(inputs[i].checked) {
				replyAttitude = inputs[i].getAttribute("attitude");
				break;
			}
		}
		
		var content = document.getElementById("content");
    	if(content.value.trim() == "") {
    		if(batchOpinion == '1' || (batchOpinion=="3" && replyAttitude=="3")) {
    			//您选择的待办事项必须填写处理意见！
    			cmp.notification.alert(cmp.i18n("collaboration.batchDeal.mustComment"), function(){
    				var content = document.getElementById("content");
    				if(content) {
    					content.focus();
    				}
    			}, cmp.i18n("collaboration.page.dialog.note"), cmp.i18n("collaboration.page.dialog.OK"));
	    		pageX.isSubmitting = false;
	    		return false;
    		}
    	}
    	

		
		var params = {
				"content":CollUtils.getTextDealComment("#content"),
				"attitude": replyAttitude,
				"attitudes": urlParam["attitudes"],
				"opinions": urlParam["opinions"],
				"affairs":urlParam["affairs"],
				"conditionsOfNodes":urlParam["conditionsOfNodes"],
				"summarys":urlParam["summarys"],
				"categorys":urlParam["categorys"],
				"isM3":"1"
		};
		
		if(replyAttitude =="3"){
			 //是
        	 $s.Coll.checkOperation({},params,errorBuilder({
		            success : function(result) {
		            	var btns = [];
		    			
		    			var hasTerminate = false;
		    			var hasstepback = false;
		    			var hasstepstop = false;
		    			var hasContinue = false;
                    	for (var a = 0; a < result.length; a++) {
                            var str = result[a];
                            if (str.indexOf("Terminate") > -1 && !hasTerminate) {
                                btns.push({
                                    key : "Terminate",
                                    name : cmp.i18n("collaboration.page.lable.button.terminate")
                                });
                                hasTerminate = true;
                            }
                            if (str.indexOf("Return") > -1 && !hasstepback) {
                                btns.push({
                                    key : "Return",
                                    name : cmp.i18n("collaboration.page.lable.button.return")
                                });
                                hasstepback = true;
                            }
                            if (str.indexOf("Cancel") > -1 && !hasstepstop) {
                                btns.push({
                                    key : "Repeal",
                                    name : cmp.i18n("collaboration.page.lable.button.cancel1")
                                });
                                hasstepstop = true;
                            }
                            if (str.indexOf("Continue") > -1 && !hasContinue) {
                                btns.push({
                                    key : "Continue",
                                    name : cmp.i18n("collaboration.page.lable.button.continue")
                                });
                                hasContinue = true;
                            }
                            if (btns.length >= 4) {
                                break;
                            }
                        }
		            	
		    			cmp.dialog.actionSheet(btns, cmp.i18n("collaboration.page.lable.button.cancel"), function(item) {
		    	 			   //点击操作
		    					cmp.dialog.loading();
		    					if(pageX.isSubmitting){
		    				        return; 
		    				    }
		    				    pageX.isSubmitting = true;
		    	 			   switch (item.key) {
		    	 			   case "Continue":
		    	 			      params.action = "Continue";
		    	 				  commonBatchDeal(params);
		    	 			   	   break;
		    	 			   case "Return":
		    	 				   
		    	 			        var _cofirmHtml  = cmp.i18n("collaboration.page.notrollback.confirm.label", [item.name])+"<br>"+ "<span class='trace_span'>" +cmp.i18n("collaboration.page.wftrace.label");
		    	 			        _cofirmHtml+='<input id="isWFTrace" style="color:#2EAEF7" type="checkbox" class="select-put cmp-checkbox2">' + '</span>';
		    	 			            
		    	 			        //cmp.dialog.loading(false);
		    	 			        cmp.notification.confirm(_cofirmHtml,function(e){ //e==1是/e==0 否
		    	 			            
		    	 			           var isWfTrace = document.querySelector("#isWFTrace");
		    	 			           var doTrace = isWfTrace && isWfTrace.checked  ? "1" : "0";
		    	 			           params.trackWorkflowType = doTrace;
		    	 			          if(e==1){ //是
		    	 			        	 $s.Coll.doBatchStepbackColl({},params,errorBuilder({

		    	  	 			            success : function(result) {
		    	  	 			            	var batchList = urlParam["cancelData"];
		    	  	 			            	var _batchList = new Array();
		    	  	 			            	if(batchList && batchList.instance.length > 0){
		    	  	 			            		for(var i = 0; i < batchList.instance.length; i++){
		    	  	 			            			_batchList.push(batchList.instance[i]);
		    	  	 			            		}
		    	  	 			            	}
		    	  	 			            	if(result && result.batchResult && result.batchResult.length>0){
		    	  	 			            		for(var j = 0; j < result.batchResult.length; j++){
		    	  	 			            			if(result.batchResult[j] != "ok_success"){
		    	  	 			            				_batchList.push(result.batchResult[j]);
		    	  	 			            			}
		    	  	 			            		}
		    	  	 			            	}
		    	  	 			            	cmp.dialog.loading(false);
		    	  	 			            	if(_batchList.length>0){
		    	  	 			            		_releaseBatchLock();
		    	  	 			            		var batchCount = urlParam["totalCount"]-_batchList.length;
		    	  	 			        			openPreBatchDialog(_batchList, urlParam["totalCount"], batchCount, gotoList);
		    	  	 			            	}else{
		    	  	 			            		gotoList();
		    	  	 			            	}
		    	  	 			            	triggM3todoFun();
		    	  	 			            },
		    	  	 			         exeSelfError : true,
		    	  	 			            error : function(msg){
		    	  	 			                pageX.isSubmitting = false;
		    	  	 			                cmp.dialog.loading(false);
		    	  	 			            }
		    	  	 			        
		    	 			        	 	}));
		    	 			            }else if(e==0){
		    	 			            	cmp.dialog.loading(false);
		    	 			            	pageX.isSubmitting =false;
		    	 			            }
		    	 			        }, cmp.i18n("collaboration.page.dialog.note2"), [cmp.i18n("collaboration.page.lable.button.cancel"), cmp.i18n("collaboration.page.dialog.OK") ],null,null,0);
		    	 				   
		    	 				   break;
		    	 			   case "Repeal":
		    	 				   
		    	 				  var _cofirmHtml  = cmp.i18n("collaboration.page.notrollback.confirm.label", [item.name])+"<br>"+ "<span class='trace_span'>" +cmp.i18n("collaboration.page.wftrace.label");
		    				        _cofirmHtml+='<input id="isWFTrace" style="color:#2EAEF7" type="checkbox" class="select-put cmp-checkbox2">' + '</span>';
		    				            
		    				        //cmp.dialog.loading(false);
		    				        cmp.notification.confirm(_cofirmHtml,function(e){ //e==1是/e==0 否
		    				            
		    				           var isWfTrace = document.querySelector("#isWFTrace");
		    				           var doTrace = isWfTrace && isWfTrace.checked  ? "1" : "0";
		    				           params.trackWorkflowType = doTrace;
		    				          if(e==1){ //是
		    				        	 $s.Coll.doBatchRepealColl({},params,errorBuilder({

		    		 			            success : function(result) {
		    		 			            	var batchList = urlParam["cancelData"];
		    		 			            	var _batchList = new Array();
		    		 			            	if(batchList && batchList.instance.length > 0){
		    		 			            		for(var i = 0; i < batchList.instance.length; i++){
		    		 			            			_batchList.push(batchList.instance[i]);
		    		 			            		}
		    		 			            	}
		    		 			            	if(result && result.batchResult && result.batchResult.length>0){
		    		 			            		for(var j = 0; j < result.batchResult.length; j++){
		    		 			            			if(result.batchResult[j] != "ok_success"){
		    		 			            				_batchList.push(result.batchResult[j]);
		    		 			            			}
		    		 			            		}
		    		 			            	}
		    		 			            	cmp.dialog.loading(false);
		    		 			            	if(_batchList.length>0){
		    		 			            		_releaseBatchLock();
		    		 			            		var batchCount = urlParam["totalCount"]-_batchList.length;
		    		 			        			openPreBatchDialog(_batchList, urlParam["totalCount"], batchCount, gotoList);
		    		 			            	}else{
		    		 			            		gotoList();
		    		 			            	}
		    		 			            	triggM3todoFun();
		    		 			            },
		    		 			           exeSelfError : true,
		    		 			            error : function(msg){
		    		 			                pageX.isSubmitting = false;
		    		 			                cmp.dialog.loading(false);
		    		 			            }
		    		 			        
		    				        	 	}));
		    				            }else if(e==0){
		    	 			            	cmp.dialog.loading(false);
		    	 			            	pageX.isSubmitting=false;
		    	 			            }
		    				        }, cmp.i18n("collaboration.page.dialog.note2"), [cmp.i18n("collaboration.page.lable.button.cancel"), cmp.i18n("collaboration.page.dialog.OK") ],null,null,0);
		    					   
		    					   
		    	 				   
		    	 				   break;
		    	 			   case "Terminate":
		    	 				   
		    	 				  //是
		    			        	 $s.Coll.doBatchTerminateColl({},params,errorBuilder({

		    				            success : function(result) {
		    				            	var batchList = urlParam["cancelData"];
		    				            	var _batchList = new Array();
		    				            	if(batchList && batchList.instance.length > 0){
		    				            		for(var i = 0; i < batchList.instance.length; i++){
		    				            			_batchList.push(batchList.instance[i]);
		    				            		}
		    				            	}
		    				            	if(result && result.batchResult && result.batchResult.length>0){
		    				            		for(var j = 0; j < result.batchResult.length; j++){
		    				            			if(result.batchResult[j] != "ok_success"){
		    				            				_batchList.push(result.batchResult[j]);
		    				            			}
		    				            		}
		    				            	}
		    				            	cmp.dialog.loading(false);
		    				            	if(_batchList.length>0){
		    				            		_releaseBatchLock();
		    				            		var batchCount = urlParam["totalCount"]-_batchList.length;
		    				        			openPreBatchDialog(_batchList, urlParam["totalCount"], batchCount, gotoList);
		    				            	}else{
		    				            		gotoList();
		    				            	}
		    				            	triggM3todoFun();
		    				            },
		    				            exeSelfError : true,
		    				            error : function(msg){
		    				                pageX.isSubmitting = false;
		    				                cmp.dialog.loading(false);
		    				            }
		    				        
		    			        	 	}));
		    			            
		    	 				   break;
		    	 			   default:
		    	 				   break;
		    	 			   }
		    	 		   },function(){
		    	 			  pageX.isSubmitting = false;
		    	 		   });
		    			
		            },
		            error : function(msg){}
		        
        	 	}));
			
			
		}else{
			//点提交的时候
			if(pageX.isSubmitting){
		        return; 
		    }
			cmp.dialog.loading();
		    pageX.isSubmitting = true;
			commonBatchDeal(params);
		}
		
    });
}
function triggM3todoFun(){
	if(urlParam.m3todo){
	    cmp.router.notify('M3ProcessFinish', {
            type: 'batchProcess',
            success: true
        });
	}
}
function commonBatchDeal(params){

	$s.Coll.doBatchColl({}, params, errorBuilder({
        success : function(result) {
        	var batchList = urlParam["cancelData"];
        	var _batchList = new Array();
        	if(batchList && batchList.instance.length > 0){
        		for(var i = 0; i < batchList.instance.length; i++){
        			_batchList.push(batchList.instance[i]);
        		}
        	}
        	if(result && result.batchResult && result.batchResult.length>0){
        		for(var j = 0; j < result.batchResult.length; j++){
        			if(result.batchResult[j] != "ok_success"){
        				_batchList.push(result.batchResult[j]);
        			}
        		}
        	}
        	cmp.dialog.loading(false);
        	if(_batchList.length>0){
        		_releaseBatchLock();
        		var batchCount = urlParam["totalCount"]-_batchList.length;
    			openPreBatchDialog(_batchList, urlParam["totalCount"], batchCount, gotoList);
        	}else{
        		gotoList();
        	}
        	triggM3todoFun();
        },
        exeSelfError : true,
        error : function(msg){
            pageX.isSubmitting = false;
            cmp.dialog.loading(false);
            cmp.notification.alert("批处理异常，请重试。");
        }
    }));

}

/**
 * 加载意见框
 */
function _initContent(){
    
    var $content = _$('#content');
    
    function showContentCount(){
        CollUtils.fnFontCount("#content", "#fontCount", pageX.MAX_INPUT_LENGTH);
    }
    $content.addEventListener('input', showContentCount);
    showContentCount();
}


/**
 * 初始化态度
 */
function _initAttitude(){
    var attitudeBtns = [];
    
    var batchAttitude = urlParam["batchAttitude"];
    
    if(batchAttitude == "1") {
    	var att_readed = {
                "lable" : cmp.i18n("collaboration.page.lable.att_readed"),//已阅
                "value" : "collaboration.dealAttitude.haveRead",
                "attitude" : "1"
        }
        att_readed.state = "on";
    	
    	attitudeBtns.push(att_readed);
    }
    
    if(batchAttitude == "1" || batchAttitude == "2") {
	    var att_agree = {
	            "lable" : cmp.i18n("collaboration.page.lable.att_agree"),//同意
	            "value" : "collaboration.dealAttitude.agree",
	            "attitude" : "2"
	    }
	    if(batchAttitude == "2") {
	    	att_agree.state = "on";
	    }
	    attitudeBtns.push(att_agree);
	        
	    var att_disagree = {
	            "lable" : cmp.i18n("collaboration.page.lable.att_disagree"),//不同意
	            "value" : "collaboration.dealAttitude.disagree",
	            "attitude" : "3"
	    }
	    attitudeBtns.push(att_disagree);
    }
    if(attitudeBtns.length > 0) {
    	_$("#button_list_nav").innerHTML = cmp.tpl(_$("#attitude_templage").innerHTML, attitudeBtns);
        _$("#button_list_nav").style.display = "block";
        _$("#comment_div").style.top="70px";
        
        //顶部按钮的切换点击
        cmp("#button_list_nav").on("tap", "li", function(){
            //var $input = _$("input", false, this);
            //pageX.cache.postData["attitude"] = $input.value;
        });
        
    }
}


/**
 * 加载常用语
 */
function _initCommonPhrase() {
    
    var $phrasesBtn = _$("#phrasesBtn"); 
    $phrasesBtn.classList.remove("display_none");
    
    $s.CommonPhrase.phrases({}, errorBuilder({
        success : function(result) {
            if(result && result.length > 0){
                _$("#phrases_ul").innerHTML = cmp.tpl(_$("#phrases_template").innerHTML, result);
                cmp("#phrases_ul").on("tap", "li", function(){
                    _$("#content").value = CollUtils.getTextDealComment("#content") + this.innerText;
                    _switchPhrases();
                    CollUtils.fnFontCount("#content", "#fontCount", pageX.MAX_INPUT_LENGTH);
                });
            }
        }
    }));
    
    var phrases_container = _$('#phrases_container');
    // var header = phrases_container.querySelector('header');
    var navLeft = phrases_container.querySelector('#phrase_goback');
    var phrases_div = _$('#phrases_div');
    
    phrases_div.style.height = phrases_container.offsetHeight+"px";
    
    //点击常用语
    $phrasesBtn.addEventListener('tap',function(){
        _switchPhrases();
    });
   
    //点击常用语弹出容器的回退按钮
    // navLeft.addEventListener('tap',function(){
    //     _switchPhrases();
    // });
}

//常用语切换
function _switchPhrases(phrases_container){
  phrases_container = phrases_container || _$('#phrases_container');
  if(phrases_container.classList.contains('cmp-active')){
      phrases_container.classList.remove('cmp-active');
      cmp.backbutton.pop();
  }else{
      cmp.backbutton.push(_switchPhrases);
      phrases_container.classList.add('cmp-active');
  }
}