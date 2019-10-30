var winParams = {};
var pageX = {};
pageX.postData = {"fileUrlIds":[]};
pageX.wfDesigner = null;
pageX.inputUsers = {};
pageX.attachmentInputs = [];
pageX.isSubmitting = false;
pageX.forwardRightId = null;
var _storge_key = "m3_v5_collaboration_colforward_cache_key";
pageX.cache = {
	    "forwardOriginalNote" : "true",
	    "forwardOriginalopinion" : "true",
	    "track" : "true",
	    "content":""
	}
cmp.ready(function(){
    
    cmp.backbutton();
    cmp.backbutton.push(fnGoSummaryListPage);
    // _$("#goBackBtn").addEventListener("tap",fnGoSummaryListPage);
    
	cmp.i18n.init(_collPath + "/i18n/", "Collaboration",function(){
		document.querySelector("#content").placeholder = cmp.i18n("collaboration.page.lable.comments");
		 //国际化title标签
	    _$("title").innerText=cmp.i18n("collaboration.page.lable.button.forward");
	},$verstion);
	
	//页面渲染
	initRender();
	
	initData();
	
	// cmp.HeaderFixed("#hid", document.querySelector("#content"));
	cmp.description.init(document.querySelector("#content"));
    cal_height();
});

function initData() {
	
	document.addEventListener('beforepageredirect', function(e){ 
		_storePageObj();
    });
	
	//清除缓存
	document.addEventListener('deletesessioncache', function(e){
	    
	    /*if(winParams.cache_subfix){
	        CollCacheKey.delCacheKeys(CollCacheKey.summary, winParams.cache_subfix);
	    }*/
    });
	
	pageX.cache = CollUtils.loadCache(_storge_key, true) || pageX.cache;
	
	//缓存页面数据
	winParams  = cmp.href.getParam();
	_$("#sendBtn").addEventListener("tap",_preSubmit);
	_$("#content").addEventListener("input",fnFontCount);
	_bindWfEvent();
	//_documentBack();
	
	var summaryIds = winParams["summaryId"].split("_");
	pageX.forwardRightId= winParams["rightId"];
	//初始化数据，从后端获取
	$s.Coll.forwardParams({"summaryId" : summaryIds[0]},errorBuilder({
		success : function(result) {
            initPage(result);
        }
	}));	
	//请求数据
    
    var templateId = winParams["templateId"] == undefined ? "" : winParams["templateId"]; 
	
	//初始化附件组件
	var initAttComponent = function(data){
		var newPolicy = data["newPolicy"];
	    if(newPolicy.uploadAttachment || newPolicy.uploadRelDoc){
	    	var showAuth;
			if(newPolicy.uploadAttachment && newPolicy.uploadRelDoc){
		    	showAuth = -1;
		    } else if(newPolicy.uploadAttachment){
		    	showAuth = 1;
		    } else if(newPolicy.uploadRelDoc){
		    	showAuth = 2;
		    }
		    //初始化附件组件
			var initParam = {
				showAuth : showAuth,
				uploadId : "picture",
				handler : "#attBtn",
				continueUpload: continueUpload,
				selectFunc : function(fileArray){
		        	//附件选择结果
		        	pageX.attachmentInputs = fileArray;
		        	//展示附件数量
				    var tempCount = pageX.attachmentInputs.length;
				    //关联文档个数
				    var docCount = 0;
				    //附件个数
				    var attCount = 0;
				    
				    if(tempCount > 0){
				        //附件图标有附件时显示蓝色
				        var attDom = document.querySelector("#attBtn");
				        attDom.style="color:#3aadfb";
				        for(var j=0;j<tempCount;j++){
				        	if(pageX.attachmentInputs[j].attachment_fileType=="associated"){
				        		docCount++;
				        	}else{
				        		attCount++;
				        	}
				        }
				    }
				    _$("footer .item").innerHTML = cmp.i18n("collaboration.page.lable.attAnddocContent", [attCount, docCount]);
				}
			}
			new SeeyonAttachment({initParam : initParam});
	    }else{
	        _$(".attachment").remove();
	    }
	    
//	    //微信端， 没有附件
//	    if(!CollUtils.isCMPShell()){
//            document.getElementById("attachment_wrap").remove();
//            document.getElementById('content').style.bottom = "0px";
//            _$(".cmp-content").style.bottom = "60px";
//	    }
	    
	}
    
	$s.Coll.newColl({},{}, errorBuilder({
        success : function(result) {
    		initAttComponent(result);
        }
    }));
	var continueUpload = true;
	
    //附言
    var initialHeight = window.innerHeight;
    document.querySelector("#content").addEventListener("tap",function(){
    	if (/Android/i.test(navigator.userAgent)) {
    		scrollDomToCenter(this,initialHeight);
    	}
	},false);
    
    //回填
    _$("#content").value = pageX.cache.content;
    if(pageX.cache.forwardOriginalNote != "true") {
		_$("#forwardOriginalNote").classList.remove("cmp-active");
    }
    if(pageX.cache.forwardOriginalopinion !="true") {
    	_$("#forwardOriginalopinion").classList.remove("cmp-active");
    }
    if(pageX.cache.track != "true") {
    	_$("#track").classList.remove("cmp-active");
    }
}

function scrollDomToCenter(dom,height){
	setTimeout(function(){
		var windowHeight = window.innerHeight;
		if(windowHeight != height){
			dom.scrollIntoViewIfNeeded(true);
		}else{
			scrollDomToCenter(dom,height);
		}
	},100);
}

function initPage(data) {
	pageX.currentUser = data["currentUser"];
	pageX.defaultNodeName = data["defaultNodeName"];
	pageX.defaultNodeLable = data["defaultNodeLable"];
	
	//快速选人， 需要在流程组件前初始化
    SeeyonTokeninput.init({
        target : "receiver_container",
        editable : true,
        names : null,
        correntAccountId : pageX.currentUser["loginAccount"],
        onChoose : function(u){
                        pageX.inputUsers[u.id] = u;
                    },
        onDelete : function(id){
                        //删除项
                        if(id){
                            delete pageX.inputUsers[id];
                        }
                    },
        onDestroy : function(){
                        delete pageX.inputUsers;
                    }
    });
	
	//流程
    pageX.wfDesigner = new WorkFlowDesigner({
        
        workflow : {
            moduleType : "1"
        },
        info : {
            state : "edit",
            defaultPolicyId : pageX.defaultNodeName,
            defaultPolicyName : pageX.defaultNodeLable,
            currentAccountId : pageX.currentUser["loginAccount"],
            currentAccountName : pageX.currentUser["loginAccountName"],
            currentUserId : pageX.currentUser["id"],
            currentUserName : pageX.currentUser["name"],
            category : "collaboration",//分类 协同 collaboration
            bodyType :"10",
            formData :"",
            templateId :""
        },
        getPermissions : function(callback){
        	var params = {"appName":"collaboration",
  				  "defaultPolicyId" : winParams.defPolicy ? winParams.defPolicy.value : ""};
            //获取节点权限
            $s.Coll.permissions({},params, errorBuilder({
                success : function(ret){
                    callback(ret);
                }
            }))
        },
        onNodeChange : function(names){
            //清空已经选择的人
            SeeyonTokeninput.destroy();
            
            //展示选择人
            SeeyonTokeninput.showNames(names.split(","));
         },
    });
}

function initRender() {
    _$("#content").setAttribute("placeholder",cmp.i18n("collaboration.page.lable.postscript"));
	//var item=document.querySelector('.forward_footer_title').querySelectorAll('.item');
    //var forward_footer_content=document.querySelector('.forward_footer').querySelectorAll('.forward_footer_content');
    cmp('.forward_footer').on('tap','.forward_footer_title .item',function(){
    	 var ContentId=this.href.toString().split('#')[1];
         var content=document.getElementById(ContentId);
         if(ContentId=='item2'){
        	content.classList.add('cmp-active'); 
         }else{
        	document.querySelectorAll('.forward_footer_content ')[0].classList.remove('cmp-active');
         }
   });
    
    //接收人布局
    _$("#receiver_container").style.width = (_$("#receiver_li").clientWidth - 15 - 12
            - _$("#receiver_title").offsetWidth 
            - _$("#edit_receiver").offsetWidth) + "px";
}

function fnGoSummaryListPage(){
	setListViewRefresh("true");
    //向上
    cmp.href.back(1, null,  winParams.WebviewEvent);
}


function _gotoList(){
    
    //触发删除缓存
    //cmp.event.trigger("deletesessioncache", document);
	setListViewRefresh("true");
    var backN = 1 + (winParams.backIndex || 0);
    cmp.href.back(backN);
} 


//流程相关的事件
function _bindWfEvent(){
    //点击编辑流程
    cmp.event.click(_$('#edit_receiver'),function(){
        
        /*_creatWorkflow(function(){
            pageX.wfDesigner.edit();
        }, true);*/
        
        var fillMember = []
        if(pageX.inputUsers){
            for(var k in pageX.inputUsers){
                var m = pageX.inputUsers[k];
                fillMember.push({
                    id : m.id,
                    name : m.name,
                    type:"member"
                  });
            }
        }
        pageX.wfDesigner.edit({
            initMembers : fillMember
        });
    });
}

//检查流程
function _creatWorkflow(callback, drawWf){ 
  //流程
    if(pageX.inputUsers && !cmp.isEmptyObject(pageX.inputUsers)){
        
        var datas = [];
        for(var k in pageX.inputUsers){
            datas.push(pageX.inputUsers[k]);
        }
        
        //快速选人创建流程
        pageX.wfDesigner.createXML({
            jsonData : cmp.toJSON(datas),
            currentNodeId : "",
            drawWf : (drawWf === true),
            type : pageX.wfDesigner.FLOW_TYPE["concurrent"],
            callback : function(names, jsonData){
                callback();
            },
            errorCallback : function(result){
            	_stopSubmit();
            }
        });
    }else{
        callback();
    }
}

//流程预提交()
function _preSubmit(){
	if(pageX.isSubmitting){
	       return; 
	}
	_startSubmit();
	//流程不能为空！
    if(pageX.wfDesigner.isWfEmpty() && (!pageX.inputUsers || cmp.isEmptyObject(pageX.inputUsers))){
        _alert(cmp.i18n("collaboration.colForward.isNotProcess"), function(){_stopSubmit();}, cmp.i18n("collaboration.page.dialog.note"), cmp.i18n("collaboration.page.dialog.OK"));
        return false;
    }
    _creatWorkflow(function(){
	    var options = {
	        "callback" : function(preSubmitResult){
	            if(preSubmitResult["result"] == "true"){
	                //预提交成功
	            	fnSubmit();
	            }else{
	            	_stopSubmit();
	            }
	        }
	    };
	    pageX.wfDesigner.preSubmit(options);
    });
}
function objHasClass(obj,cls){
	var objClass = obj.className;
	var objClassList = objClass.split(/\s+/);
	var x =0;
	for(x in objClassList){
		if(objClassList[x] == cls){
			return true;
		}
	}
	return false;
}
function fnSubmit() {
    var forwardOriginalNote = "0";
    var forwardOriginalopinion = "0";
	var track = "0";
	var _note = document.querySelector("#forwardOriginalNote");
    if(objHasClass(_note,"cmp-active")) {
    	forwardOriginalNote = "1";
    }
    var _opinion = document.querySelector("#forwardOriginalopinion");
    if(objHasClass(_opinion,"cmp-active")) {
    	forwardOriginalopinion = "1";
    }
    var _track = document.querySelector("#track");
    if(objHasClass(_track,"cmp-active")) {
    	track = "1";
    }
	
	var comment = CollUtils.filterUnreadableCode(_$("#content").value);
	var map = {};
	map.MainData = {"affairId":winParams.affairId,
			"summaryId":winParams.summaryId,
			"forwardOriginalNote":forwardOriginalNote,
			"forwardOriginalopinion":forwardOriginalopinion,
			"track":track,
			"comment":comment};
	
	map = cmp.extend(map, pageX.wfDesigner.getDatas());//流程数据
	//附件
	map.attachmentInputs = pageX.attachmentInputs;
	map.forwardRightId = pageX.forwardRightId;
	var p = {"_json_params" : cmp.toJSON(map)}
	$s.Coll.transColForward({},p,errorBuilder({
		success : function(result) {
            if(result){
                _gotoList();
            } else {
            	_stopSubmit();
            }
        },
		error : function(){
			_stopSubmit();
		}
	}));
}


function fnFontCount(){
	var feedback = _$("#content"),maxLength = 2000;
	var content = feedback.value;
	if(content.length > maxLength){
		feedback.value = content.substr(0,maxLength);
		content = feedback.value;
	}
	//剩余可以输入的字数
	//_$("#fontCount").innerHTML = maxLength-content.length;
}

//结束
function _stopSubmit(){
    cmp.dialog.loading(false);
    pageX.isSubmitting = false;
}

//开始提交
function _startSubmit(){
    pageX.isSubmitting = true;
    cmp.dialog.loading(cmp.i18n("collaboration.page.lable.submitting"));//提交中...
}

//计算textare区域的高度
function cal_height(){
    var perp = document.getElementById("colMainData").offsetHeight;
    var op = document.getElementById("trans-opnion").offsetHeight;
    var max_h = document.getElementById("contentView").offsetHeight;
    var h = max_h - op -perp - 90 - 21;//两个间距8px，底部高度44px,附件和关联文档的高度：44px;
    //OA-128614【钉钉、微协同】：转发协同页面出现多余灰色区域
    if (CollUtils.isCMPShell()) {
    	h = h - 23;
    }
    document.getElementById("content").style.height = h +"px";
}

function _storePageObj(){
	if(!_$("#forwardOriginalNote").classList.contains("cmp-active")) {
		pageX.cache.forwardOriginalNote="false";
    }
    if(!_$("#forwardOriginalopinion").classList.contains("cmp-active")) {
    	pageX.cache.forwardOriginalopinion = "false";
    }
    if(!_$("#track").classList.contains("cmp-active")) {
    	pageX.cache.track = "false";
    }
    pageX.cache.content=_$("#content").value;
	cmp.storage.save(_storge_key, cmp.toJSON(pageX.cache), true);
}

//部分安卓端footer挡住输入框的问题 
var wHeight = window.innerHeight;  
window.addEventListener('resize', function(){     
	var hh = window.innerHeight;     
	if(wHeight > hh){           
	     //_$("#footerDiv").style.display = "none";;   
	}else{         
	     _$("#footerDiv").style.display = "block";
	}  
	wHeight = hh;  
}); 