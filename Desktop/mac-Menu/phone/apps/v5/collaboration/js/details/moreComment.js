/**
 * 意见更多列表
 */

var pageX = {};
pageX.cache = {
    "count" : {
        "like" : 0,
        "agree" : 0,
        "disagree" : 0,
        "all" : 0
    },
    "currentTab" : "all"
}
pageX.winParams = {}//页面初始化参数
pageX.isMoreComment = true;
var _storge_key = "";
var _isContentInit = true;


cmp.ready(function(){
    
    _storge_key = CollCacheKey.summary.moreComment;
    _initBackEvent();
    
    cmp.i18n.init(_collPath + "/i18n/", "Collaboration", function(){
        
        //加载数据
        _initPageData(function(){
            
          //初始化处理相关
            __initDeal__(function(){
            	//__hasOffice();
                //装载页面
                _fillPage();
                
                _bindEvent();//绑定事件
            });
            
            document.addEventListener('beforepageredirect', function(e){ 
                _storagePageData();
            });

          //重新渲染
            document.addEventListener('refreshWebView', function(e){ 
                CollUtils.loadCache(_storge_key, true);
                window.summaryBO = CollUtils.loadCache(CollCacheKey.summary.summaryBO + pageX.winParams.cache_subfix);
            });
            
            //头部偏上的适配
            _$("header").style.display = "block";
        });
    },$verstion);
});

//刷新页面
function _refreshPage(){
    cmp.event.trigger("refreshWebView", document);
}

/*function __hasOffice(){
	//Office正文
    if(window.summaryBO && summaryBO.content && summaryBO.content.hasOffice){
    	if(_$("#footer_btns")){
    		_$("#footer_btns").style.display = "none";
    	}
    }
}*/


function _fillPage(){
    
    //是否允许点赞
    if(summaryBO.summary.canPraise){
        _$("#like_tab").classList.remove("display_none");
    }
    
    //加载数量
    var $tabs = _$("#tab_container");
    for(var key in pageX.cache.count){
        _updateCount(key, pageX.cache.count[key], $tabs);
    }
    
    //定位到当前页签
    _$("#" + pageX.cache.currentTab + "_tab", false, $tabs).classList.add("cmp-active");
    _$("#" + pageX.cache.currentTab + "Comment").classList.add("cmp-active");
    
    //加载列表
    _initMoreCommentList(pageX.cache.currentTab);
}

/**
 * 更新数量
 * @param type 类型
 * @param count 数量
 */
function _updateCount(type, count, container){
    _$("#" + type + "_Count", false, container).innerHTML = count;
}

/**
 * 绑定事件
 */
function _bindEvent(){
    
  //分类页签点击事件
    cmp("#tab_container").on("tap",".cmp-control-item",function(e){
        
        var tHref = this.getAttribute("href");
        var tagType = tHref.substring(1).replace("Comment", "");
        pageX.cache.currentTab = tagType;
        _initMoreCommentList(tagType);
    });
    
  //回复和点赞设置
    if(summaryBO.pageConfig.canReply){
        _showReplyBtns("#allComment");
        if(summaryBO.summary.canPraise){
            _showReplyBtns("#likeComment");
        }
        _showReplyBtns("#agreeComment");
        _showReplyBtns("#disagreeComment");
    }
}

/**
 * 保存缓存
 */
function _storagePageData(){
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
        
        var cacheData = CollUtils.loadCache(_storge_key, true);
        pageX.cache = cacheData || pageX.cache;
        
        if(!cacheData){
            
            var types = "agree,disagree";
            if(summaryBO.summary.canPraise){
                types += ",like";
            }
            
            //获取同意和不同意意见数量
            $s.Coll.commentsCount(summaryBO.summary.id, {"types" : types}, errorBuilder({
                success : function(result) {
                    pageX.cache.count = cmp.extend(true, pageX.cache.count, result);
                    onDataReady();
                },
                error : function(e){
                    onDataReady();
                }
            }));
        }else{
            onDataReady();
        }
};

/**
 * 返回事件
 */
function _initBackEvent(){
    
    cmp.backbutton();
    cmp.backbutton.push(_goBack);
    
    _$("#goAheadBtn").addEventListener("tap", _goBack);
}

//返回上一个页面
function _goBack(){
    
    summaryBO.backIndex = summaryBO.backIndex - 1;
    cmp.storage.save(CollCacheKey.summary.summaryBO + pageX.winParams.cache_subfix, cmp.toJSON(window.summaryBO), true);
    
    cmp.href.back(1, null,  pageX.winParams.WebviewEvent);
}


function _gotoList(){
    
    //触发删除缓存
    cmp.event.trigger("deletesessioncache", document);
    
    var backN = 1;
    if(window.summaryBO && summaryBO.backIndex){
        backN += summaryBO.backIndex;
    }
    cmp.href.back(backN);
}
/**
 * 意见分类初始化listView
 */
function _initMoreCommentList(type){
    
 // 滚动容器
    cmp.listView("#" + type + "CommentScroller", {
        imgCache:true,
        config : {
            pageSize : 20,
            params : {
                "type" : type,
                "summaryId" :  summaryBO["summary"].id,
                "affairId" : summaryBO.summary.affairId,
                "openFrom" : summaryBO.openFrom
            },
            dataFunc : _getCommentDataList,
            renderFunc : function(result, isRefresh){
                _renderMoreCommentData(type, result, isRefresh);
            }
        },
        down: {
            contentprepage:cmp.i18n("collaboration.page.lable.prePage"),//上一页
            contentdown: cmp.i18n("collaboration.page.lable.refresh_down"),
            contentover: cmp.i18n("collaboration.page.lable.refresh_release"),
            contentrefresh: cmp.i18n("collaboration.page.lable.refresh_ing")
        },
        up: {
            contentnextpage:cmp.i18n("collaboration.page.lable.nextPage"),//下一页
            contentdown: cmp.i18n("collaboration.page.lable.load_more"),
            contentrefresh: cmp.i18n("collaboration.page.lable.load_ing"),
            contentnomore: cmp.i18n("collaboration.page.lable.load_nodata")
        }
    });
}

//分页获取所有意见
function _getCommentDataList(pDatas, options) {
    
    $s.Coll.summaryComment(pDatas["type"], pDatas["summaryId"], pDatas, errorBuilder({
        success : function(result) {
            
            if(pDatas.pageNo == 1){
                //更新数量
                pageX.cache.count[pDatas["type"]] = result.total;
                _updateCount(pDatas["type"], result.total)
            }
            var successFn = options.success;
            successFn(result);
        }
    }));
}

/**
 * 刷新意见列表
 */
function _renderMoreCommentData(type, result, isRefresh){
    
    __rendList(result, type + "CommentContainer", summaryBO.pageConfig.canReply, isRefresh, "");
    
    //刷新列表
    setTimeout(function(){
        cmp.listView("#" + type + "CommentScroller").refresh();
    }, 500);
}

/**
 * 意见显示公共函数，只是做合并使用
 */

/**
 * 渲染意见列表
 */
function __rendList(comments, containerId, replyFlag, isRefresh, _containerId, newStyle){
    
	//表情转换
	var emojiUtil = cmp.Emoji();
    for (var i = 0; i < comments.length; i++) {
    	comments[i].content = emojiUtil.StringToEmoji(comments[i].content);
    }
    var tplParams = {"comments" : comments, 
            "replyFlag": replyFlag,
            "containerId" : containerId,
            "canPraise" : summaryBO.summary.canPraise,
            "subState" : summaryBO.subState,
            "openFrom" :summaryBO.openFrom,
            "width" : "100%"
           }
    
    var commentHTML = "";
    var $commentContainer = _$("#" + containerId);
    
    //容器宽度
    var containerWidth = $commentContainer.clientWidth;
    if(containerWidth > 0){
        tplParams.width = containerWidth;
    }
    
    if(newStyle === true){
        commentHTML = mplus_apps_collaboration.form_comment_template(tplParams);
    }else {
        commentHTML = mplus_apps_collaboration.comment_template(tplParams); 
    }
    
    
    if(isRefresh){
        $commentContainer.innerHTML = commentHTML;
    }else{
        $commentContainer.insertAdjacentHTML("beforeEnd",commentHTML); 
    }
    
    if(comments.length == 0 && _$("#"+ _containerId)){
        _$("#" + _containerId).remove();
    }
    
    // 人员头像
    for(var t = 0; t < comments.length; t++){
        (function(){
            var createId=comments[t].createId;
            var _replyColUser="#replyColUser_"+t;
            if(_containerId){ // 处理转发
                _$(_replyColUser).id="replyColUser_"+t+_containerId;
                _replyColUser="#replyColUser_"+t+_containerId;
            }
            _$(_replyColUser).addEventListener("tap", function(){
                if(/^-?\d+$/.test(createId)){
                    cmp.visitingCard(createId);
                }
            });
        }(t));
    }
    
    //意见附件
    for(var i = 0; i < comments.length; i++){
        var comment = comments[i];
        var attrs = cmp.parseJSON(comment["attachments"]);
        if(attrs.length > 0 && comment.canView){
            CollUtils.initAttStyle("#" + containerId + "_commentAttr" + comment["id"],attrs);
        }else{
            _$("#" + containerId + "_commentAttr" + comment["id"]).remove();
        }
        //回复
        var subReplys = comment["subReplys"];
        if(subReplys && subReplys.length > 0){
            for(var j = 0; j < subReplys.length; j++){
                var subComment = subReplys[j];
                var subAttrsArray = subComment["attachments"] || "[]";
                var subAttrs = cmp.parseJSON(subAttrsArray);
                if(subAttrs.length > 0 && subComment.canView){
                    CollUtils.initAttStyle("#" + containerId + "_subCommentAttr" + subComment["id"], subAttrs);
                }else{
                    _$("#" + containerId + "_subCommentAttr" + subComment["id"]).remove();
                }
            }
        }
    }
}


/**
 * 意见点赞
 */
function _doLikeComment(){
    
    var commentId = this.getAttribute("commentId");
    var likeNum =parseInt(this.getAttribute("likeNum"), 10);
    var isAdd = true;
    if(this.classList.contains('cmp-active')){
        likeNum = likeNum - 1;
        isAdd = false;
    }else{
        //增加赞
        likeNum = likeNum + 1;
    }
    var likeBtns = document.querySelectorAll('.comment_like_btn_' + commentId);
    var likeNums = document.querySelectorAll('.comment_like_num_' + commentId);
    for(var i = 0, len = likeBtns.length;i<len;i++){
        likeNums[i].innerText = likeNum;
        likeBtns[i].setAttribute("likeNum", likeNum);
        if(isAdd){
            likeBtns[i].classList.add('cmp-active');
            likeNums[i].style.color = "#3AADFB";
        }else{
            likeBtns[i].classList.remove('cmp-active');
            likeNums[i].style.color = "#C7C7CC";
        }
    }
    $s.Coll.likeComment(commentId, {}, errorBuilder({
        success : function(result) {
            //
        }
    }));
}

//意见回复
function _showReplyBtns(container){
    
    //回复意见
    cmp(container).on("tap", ".replay_btn", function(){
        _replyComment(this.getAttribute("commentId"));
    });
    //点赞
    cmp(container).on("tap", ".comment_like_btn", _doLikeComment);
}

//回复意见
function _replyComment(commentId){
    
    var nextPageData = {
            "cache_subfix" : pageX.winParams.cache_subfix,
            "WebviewEvent" : WebEvents.M3_EVENT_SUMMARY + pageX.winParams.cache_subfix,
            "commentId" : commentId
    }
    cmp.event.trigger("beforepageredirect", document);
    cmp.href.next(_collPath + "/html/details/replyComment.html"+colBuildVersion, nextPageData);
}