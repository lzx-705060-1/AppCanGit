/**
 * 增加发起人附言
 */
var pageX = {}
var _storge_key = "";
var dataArea = "#mainBodyArea";

pageX.isSubmitting = false;//重复提交防护
pageX.MAX_INPUT_LENGTH = 500;
pageX.cache = {
        "postData" : {"fileUrlIds":[], "fileJson" : "[]"}
}

cmp.ready(function() {// 缓存详情页面数据
    
    _initBackEvent();
    cmp.i18n.init(_collPath + "/i18n/", "Collaboration", function(){
        
        _storge_key = CollCacheKey.summary.senderComment;
        
        //加载数据
        _initPageData(function(){
            
            _fillPage();
            _bindEvent();
            
            document.addEventListener('beforepageredirect', function(e){ 
                _storagePageData();
            });
            
          //清空缓存
            document.addEventListener('deletesessioncache', function(e){
               try{
                    //删除协同缓存
                    cmp.storage.removeCacheData(CollCacheKey.summary.summaryBO + pageX.winParams.cache_subfix, true);
                }catch(e){}
            });
            // _$("#mainBodyArea").style.height = window.innerHeight - document.querySelector('header#hid').offsetHeight - document.querySelector('footer.send-colla-div').offsetHeight+1+"px";
            // cmp.HeaderFixed("#hid", document.querySelector("#content"));
            cmp.description.init(document.querySelector("#content"));
        });
    },$verstion);
});

//存储状态数据
function _storagePageData(){
    
    pageX.cache.datas = CollUtils.formPostData(_$(dataArea));
    cmp.storage.save(_storge_key, cmp.toJSON(pageX.cache), true);
}

/**
 * 加载数据
 */
function _initPageData(onDataReady){
        
        pageX.winParams = cmp.href.getParam() || {};
        
        //缓存加载
        window.summaryBO = CollUtils.loadCache(CollCacheKey.summary.summaryBO + pageX.winParams.cache_subfix);
        
        //缓存加载
        _storge_key = _storge_key + pageX.winParams.cache_subfix;
        pageX.cache = CollUtils.loadCache(_storge_key, true) || pageX.cache;
        
        if(onDataReady){
            onDataReady();
        }
};


function _initBackEvent(){
    
    cmp.backbutton();
    cmp.backbutton.push(_goBack);
    _$("#goBackBtn").addEventListener("tap", _goBack);
}


//返回
function _goBack() {
  cmp.href.back();
}


// 页面布局
function _fillPage() {

    //装载数据
    CollUtils.fillDom(dataArea, pageX.cache.datas);
    
     //国际化title
    _$("title").innerText = cmp.i18n("collaboration.page.lable.postscript");
    _$("#content").setAttribute("placeholder", cmp.i18n("collaboration.page.lable.commentsEnter"));
    
    //加载附件相关信息
    loadAttachment();
    
    // 40为常用语这一行的高度
    // _$("#content").style.height = (_$("#comment_div").scrollHeight - 40) + "px";

    //解决头部往下掉的原因
    _$("#title").style.display = 'block';
    _$("#title").style.bottom = '0px';

}

function loadAttachment(){
    
    var newPolicy = summaryBO.newPolicy || {}, showAuth = "";
    if(newPolicy.uploadAttachment && newPolicy.uploadRelDoc){
        showAuth = -1;
    }else if(newPolicy.uploadAttachment){
        showAuth = 1;
    }else if(newPolicy.uploadRelDoc){
        showAuth = 2;
    }
    
    var $attBtn = _$("#btns"), btnClass = $attBtn.classList;
    if(showAuth != ""){
        btnClass.remove("display_none");
    } 
    
    //附件组件
    var initParam = {
        showAuth : showAuth,
        uploadId : "picture",
        handler : "#attachment_btn",
        //initAttData : null,
        selectFunc : function(result){
            pageX.cache.postData.fileJson = cmp.toJSON(result);
            
          //展示附件数量
            _showAttNum(result.length);
        }
    }
    new SeeyonAttachment({"initParam" : initParam});
}

/**
 * 展示附件数量
 */
function _showAttNum(num, $attBtn){
    
    $attBtn = $attBtn || _$("#attachment_btn");
    
    var text = "", color = "#6E6E6E";
    if(num > 0){
        text = num;
        color = "#4A90E2";
    }
    $attBtn.style.color = color;
    _$("#attCount").innerHTML = text;
}

// 事件绑定
function _bindEvent() {
    
    var $content = _$("#content");
    $content.addEventListener('input', function(){
        CollUtils.fnFontCount("#content", "#fontCount", pageX.MAX_INPUT_LENGTH);
    });
    CollUtils.fnFontCount($content, "#fontCount", pageX.MAX_INPUT_LENGTH);
    
    _$("#submitBtn").addEventListener("tap", _submit);
}


function _submit(){
    
    //校验空
    if(_checkCommentIsEmpty()){
        return;
    }
    
    if(pageX.isSubmitting){
        return;
    }
    
    _startSubmitting();
        
    pageX.cache.postData.content = CollUtils.getTextDealComment("#content");
    pageX.cache.postData.ctype = -1;
    pageX.cache.postData.toSendMsg = "true";
    
    $s.Coll.comment(summaryBO.summary.id, {},pageX.cache.postData, errorBuilder({
        success : function(result) {
          //触发删除缓存,  不删这个代码， 删了后添加了附言看不到， 还是有BUG， 表单锁那个不改
            cmp.event.trigger("deletesessioncache", document);
            _goBack();
        },
        error : function(result){
        	//网络问题
        	if(result.code == "-1001"){
        	  	//解除各按钮的绑定
        	  	_removeEvent();
        	}
        }
    }));
}


//检查意见是否允许为空
function _checkCommentIsEmpty(){
    
    var ret = false,
        tempContent = CollUtils.getTextDealComment("#content"),
        isCommentBlank = (tempContent.length == 0);
    
    if(isCommentBlank){
        //{0}内容不能为空
        _alert(cmp.i18n(("collaboration.action.alert.comment_null"), [cmp.i18n("collaboration.page.lable.postscript")]));
        ret = true;
    }
    
    return ret;
}

//开始提交
function _startSubmitting(){
    cmp.dialog.loading();
    pageX.isSubmitting = true;
}

//结束提交
function _stopSubmitting(){
    cmp.dialog.loading(false);
    pageX.isSubmitting = false;
}

function _removeEvent(){
	_$("#submitBtn").removeEventListener("tap", _submit);
}
