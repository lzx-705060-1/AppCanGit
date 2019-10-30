/**
 * 增加发起人附言
 */
var pageX = {}
var _storge_key = "";
var dataArea = "#mainBodyArea";

pageX.isSubmitting = false;//重复提交防护
pageX.MAX_INPUT_LENGTH = 500;
pageX.winParams = {}
pageX.cache = {
        postData : {"fileUrlIds":[], 
                    "fileJson" : "[]",
                    "hide" : false,
                    "toSendMsg" : true,
                    "hideToSender" : false
                    }
}

cmp.ready(function() {// 缓存详情页面数据
    
    _storge_key = CollCacheKey.summary.replyComment; 
    
        _initBackEvent();
    cmp.i18n.init(_collPath + "/i18n/", "Collaboration", function(){
        
        //加载数据
        _initPageData(function(){
            
            _fillPage();
            _bindEvent();
            
            document.addEventListener('beforepageredirect', function(e){ 
                _storagePageData();
            });
            
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
        
         pageX.winParams = cmp.href.getParam();
     
         //缓存加载
        _storge_key = _storge_key + pageX.winParams.cache_subfix;
        pageX.cache = CollUtils.loadCache(_storge_key, true) || pageX.cache;
        
        //缓存加载
        window.summaryBO = CollUtils.loadCache(CollCacheKey.summary.summaryBO + pageX.winParams.cache_subfix);
        
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
    _$("title").innerText = cmp.i18n("collaboration.page.lable.opinionReply");
    _$("#content").setAttribute("placeholder", cmp.i18n("collaboration.page.info.inputHuifuComment"));
    
    //加载附件相关信息
    loadAttachment();
    
    //加载开关
    var swContainer = _$("#switch_container");
    _setSwitch("hide", pageX.cache.postData.hide, swContainer);
    _setSwitch("hideToSender", pageX.cache.postData.hideToSender, swContainer);
    //_setSwitch("toSendMsg", pageX.cache.postData.toSendMsg, swContainer);
    
    // 40为常用语这一行的高度
    // _$("#content").style.height = (_$("#comment_div").scrollHeight - 40) + "px";

    //头部加载慢的适配
    _$("#title").style.display = "block";
    _$("#title").style.bottom = "0px";
}


/**
 * 切换开关
 */
function _setSwitch(code, value, container){
    var $switchs = container || _$("#switch_container"),
        sws = _$(".cmp-switch", true, $switchs);
    
    for(var i = 0; i < sws.length; i++){
        var sw = sws[i];
        if(sw.getAttribute("code") == code){
            var isActive = sw.classList.contains("cmp-active");
            if(value != isActive){
                if(value){
                    sw.classList.add("cmp-active");
                    if(code == "hide"){
                        //如果没有勾选隐藏，也不能对发起人隐藏
                        _$("#switch_container .cmp-switch[code='hideToSender']").classList.remove("cmp-disabled");
                    }
                }else{
                    sw.classList.remove("cmp-active");
                }
            }
            break;
        }
    }
}

function loadAttachment(){
    
    var nodeActions = summaryBO.pageConfig.nodeActions || [];
        
    var showAuth = "";
    if(CollUtils.isInArray(nodeActions, "UploadAttachment") && CollUtils.isInArray(nodeActions, "UploadRelDoc")){
        showAuth = -1;
    }else if(CollUtils.isInArray(nodeActions, "UploadAttachment")){
        showAuth = 1;
    }else if(CollUtils.isInArray(nodeActions, "UploadRelDoc")){
        showAuth = 2;
    }
    
    var $attBtn = _$("#attachment_btn");
    if(showAuth != ""){
        $attBtn.classList.remove("display_none");
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
    
    var text = "", color = "#A2ACC7";
    if(num > 0){
        text = num;
        color = "#3AADFB";
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
    
    //开关显示
    _$("#switch_pop_btn").addEventListener('tap', function(e){
        _$("#switch_container").classList.remove("display_none");
    });
    
    //开关事件
    cmp('#switch_container .cmp-switch').each(function() { //循环所有toggle

        this.addEventListener('toggle', function(event) {
            
            var code = this.getAttribute("code"),
                value = this.classList.contains("cmp-active"),
                method;
            if(code == 'hide'){
                var hideToSender = _$("#switch_container .cmp-switch[code='hideToSender']");
                if(value){
                    method = "remove";
                }else{
                    method = "add";
                    if(hideToSender.classList.contains("cmp-active")){
                        hideToSender.classList.remove("cmp-active");
                        with(_$(".cmp-switch-handle", false, hideToSender).style){
                            transform = "";
                            webkitTransform = "";
                        }
                        pageX.cache.postData["hideToSender"] = false;
                    }
                }
                hideToSender.classList[method]("cmp-disabled");
            }
            
            pageX.cache.postData[code] = value;
        });
    });
    
    //影藏开关
    _$("#switch_container").addEventListener('tap', function(e){
        
        /*var className = e.target.getAttribute("class");
        if(!className || className.indexOf("cmp-switch") == -1){
            _$("#switch_container").classList.add("display_none");
        }*/
        if(e.target == this){
            this.classList.add("display_none");
        }
    });
    
    //初始化atWho
    _initAtWho();
    
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
        
    //回复意见
    var _oldcomment = CollUtils.getTextDealComment("#content");
    try{
    	var paramData = {};
    	var emojiUtil = cmp.Emoji();
    	pageX.cache.postData.content = emojiUtil.EmojiToString(_oldcomment);
    }catch(e){
    	pageX.cache.postData.content = _oldcomment;
    }
    
    pageX.cache.postData.ctype = 1;
    pageX.cache.postData.affairId = summaryBO.summary.affairId;
    pageX.cache.postData.commentId = pageX.winParams["commentId"];
    //at信息
    pageX.cache.postData.atWhoSelected = _mergeAtWho(pageX.cache.postData.content)
    
    $s.Coll.comment(summaryBO.summary.id, {}, pageX.cache.postData, errorBuilder({
        success : function(result) {
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
        isCommentBlank = (tempContent.length == 0) || (tempContent.trim().length == 0);
    
    if(isCommentBlank){
        //{0}内容不能为空
        _alert(cmp.i18n(("collaboration.action.alert.comment_null"), [cmp.i18n("collaboration.page.lable.opinionReply")]));
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
}/**
 * 
 */

pageX.atDialog = null;
pageX.hasAtWhoMembers = true;
pageX.cache.atWhoSelected = [];
pageX.atWhoPage = {"pageNo":1, "pageSize":50}
pageX.atWhoIsLast = false;
pageX.atWhoIsSearching = false;
pageX.pushMessageMembersList = [];
pageX.searchValue = "";
pageX.options = {
	showAll : true,
	showState : true,
	showMeetingInfo : false,
	showNoDataImage : false
};

function _initAtWho(){
    //at功能
    var $content = _$('#content');
    var $atBtn =  _$("#atBtn");
    
    if($atBtn.classList.contains("display_none")){
        $atBtn.classList.remove("display_none") 
    }
    
    $content.addEventListener('keyup', _atWho);
    $atBtn.addEventListener('tap', _exeAtWho);
}

function _atWho(e){
    
    if(e.keyCode == KEY_CODE.BACKSPACE){
        //删除
        return;
    }
    
    var c = CollUtils.getCharacter(this);
    if(c === "@"){
        this.blur();
        setTimeout(_exeAtWho, 10);
    }
}

function _mergeConfig(options){
    var newOptions = pageX.options
    newOptions.title = cmp.i18n("collaboration.page.lable.msgPushTitle");
    for(var key in options){
        if(options && typeof(options[key]) != "undefined"){
        	newOptions[key] = options[key];
        }
    }
    return newOptions;
}

function _exeAtWho(options){
	pageX.options = _mergeConfig(options);
    if(pageX.atDialog == null){
        
        var dialogConfig = {
                initHeader : false,
                title : pageX.options.title,//选择消息推送的人
                dir : "bottom-go",
                hideType : 'hide',
                show : true,
                initHTML : function() {
                    
                    var dialogHtml = '<div class="cmp-search-content" style="position:absolute;padding: 5px;width:100%;">'
                        + '<form action="javascript:void(0)">'
                        
                        + '<div class="cmp-input-row cmp-search">'
                        + '  <input id="at-who-input" type="search" autocomplete="off" class="cmp-input-clear" placeholder="">'
                        + '  <span id="at-who-delete" class="cmp-icon cmp-icon-clear cmp-hidden"></span>'
                        + '  <span id="at-who-placeholder" class="cmp-placeholder" style="height:34px!important; font-size:16px!important; line-height:34px!important; border-radius:6px!important; background:none!important;">'
                        + '      <span class="cmp-icon cmp-icon-search"></span>'
                        + '      <span>'+ cmp.i18n("collaboration.page.lable.msgPlaceholder") +'</span>'
                        + '  </span>'
                        + '</div>'
                    
                        +'</form>'
                        +'</div>'
                        
                        + '<div class="back_white search_box" style="height: 100%;padding-top: 44px">'
                        + '<ul id="at-who-ul" class="cmp-list-content cmp-list-opinion-reply" style="width: 100%;height: 100%;overflow: auto;">'
                        + '</ul>'
                        +'</div>';
                    return dialogHtml;
                },
                onInit : function() {
                    
                        
                  //加载数据, 加载第一页数据
                    _searchAtWhoItem("", true);
                    
                    pageX.atDialog.mainDiv.querySelector("#at-who-ul").addEventListener("scroll", function(e){

                        //检测向上向下滚动
                        var sTop = this.scrollTop, viewHeight = this.clientHeight;
                        var hideHeight = this.scrollHeight - (sTop + viewHeight);
                        if(hideHeight < 300 && pageX.atWhoIsSearching === false){
                            //请求下一页
                            _searchAtWhoItem(pageX.searchValue, false);
                        }
                    });
                    
                    var atWhoInput = pageX.atDialog.mainDiv.querySelector("#at-who-input");
                    var atWhoDelete = pageX.atDialog.mainDiv.querySelector("#at-who-delete");
                    var atWhoPlaceholder = pageX.atDialog.mainDiv.querySelector("#at-who-placeholder");
                    
                    atWhoInput.addEventListener("keyup", function(e){
                        if(e.keyCode == 13 || e.which == 13) {
                        	pageX.searchValue = this.value;
                        	pageX.pushMessageMembersList = [];
                            _searchAtWhoItem(pageX.searchValue, true);
                        }
                    });
                    atWhoInput.addEventListener("focus", function(e){
                        var pNode = this.parentNode;
                        var pNodeCL = pNode.classList;
                        if(!pNodeCL.contains("cmp-active")){
                            pNodeCL.add("cmp-active");
                        }
                        pNode.querySelector("#at-who-delete").classList.remove("cmp-hidden");
                    });
                    atWhoInput.addEventListener("blur", function(e){
                        var pNode = this.parentNode;
                        if(this.value == ""){
                            var pNodeCL = pNode.classList;
                            if(pNodeCL.contains("cmp-active")){
                                pNodeCL.remove("cmp-active");
                            }
                        }
                        pNode.querySelector("#at-who-delete").classList.add("cmp-hidden");
                    });
                    atWhoDelete.addEventListener("tap", function(e){
                        var atInput = this.parentNode.querySelector("#at-who-input");
                        var oldValue = atInput.value;
                        if(oldValue != ""){
                            atInput.value = "";
                            _searchAtWhoItem("", true);
                        }
                    });
                    atWhoPlaceholder.addEventListener("tap", function(e){
                        this.parentNode.querySelector("#at-who-input").focus();
                    });
                    
                    //
                    cmp("#at-who-ul").on("tap", "li", function(e){
                        var srcEle = e.target, tagName = srcEle.tagName.toLocaleLowerCase();
                        if(tagName !== "input"){
                            e.stopPropagation();
                            var liInput = this.querySelector("input");
                            if(liInput){
                                if(liInput.checked){
                                    liInput.checked = false;
                                }else{
                                    liInput.checked = true;
                                }
                            }
                        }
                    });
                },
                bottonConfig : {
                    buttons :[
                        {
                            type : 1,
                            isPopBtn : true,
                            label : cmp.i18n("collaboration.page.cancelFavorite"),
                            hander : function(){
                                _$("#at-who-input").blur();
                                pageX.atDialog.hide();
                            }
                        },
                        { 
                            label : cmp.i18n("collaboration.page.dialog.OK"),
                            hander : function(){
                                //
                                var inputs = _$("input", true, pageX.atDialog.mainDiv);
                                if(inputs){
                                    var selecteds = [];
                                    for(var i = 0; i < inputs.length; i++){
                                        var input = inputs[i];
                                        if(input.checked){
                                        	if(pageX.options.showMeetingInfo){
                                        		selecteds.push({
                                        			"name" : input.getAttribute("data-name"), 
                                        			"phone" : input.getAttribute("data-phone")
                                        		});
                                        	}else{
                                        		selecteds.push({
                                        			"affairId" : input.getAttribute("data-affairid"),
                                        			"memberId" : input.value,
                                        			"name" : input.getAttribute("data-name") 
                                        		});
                                        		
                                        	}
                                            input.checked = false;
                                        }
                                    }
                                    if(typeof(pageX.options.callback) == "function"){
                                    	pageX.options.callback(cmp.toJSON(selecteds));
                                    }else{
                                    	_pushAtWhoItem(selecteds);
                                    }
                                }
                                pageX.atDialog.hide();
                            }
                        }
                    ]
                 }
            }
        
        //弹出框
        pageX.atDialog = CollUtils.openDialog(dialogConfig);
    }else {//OA-117955 M3端处理协同点击@按钮后，关闭弹出框再次点击@按钮无反应
        pageX.atDialog.show();
    }
}

function _mergeAtWho(content){
    
    var ret = [];
    if(pageX.cache.atWhoSelected && pageX.cache.atWhoSelected.length > 0){
        for(var i = 0, len = pageX.cache.atWhoSelected.length; i < len; i++){
            var atItem = pageX.cache.atWhoSelected[i];
            if(content.indexOf("@" + atItem.name) != -1){
                ret.push(atItem);
            }
        }
    }
    return cmp.toJSON(ret);
}

function _pushAtWhoItem(datas){
    
    if(datas && datas.length > 0){
        
        var $content, pos, startStr, endStr, source;
        
        $content = _$("#content");
        //$content.focus();
        source = $content.value;
        
        pos = CollUtils.getPos($content);
        startStr = source.slice(0, pos);
        endStr = source.slice(pos || 0);
        
        var c = CollUtils.getCharacter($content, pos);
        c = c != "@" ? "@" : "";
        
        var atStr = "";
        
        for(var i = 0; i < datas.length; i++){
            var data = datas[i], atAffairId, atMemberId, atName;
            
            atAffairId = data.affairId;
            atMemberId = data.memberId;
            atName = data.name;
            
            if(i != 0){
                atStr += "@";
            }
            atStr += atName + " "
            
            pageX.cache.atWhoSelected.push({
                "affairId" : atAffairId,
                "memberId" : atMemberId,
                "name" : atName
            });
        }
        
        $content.value = startStr + c + atStr + endStr;
        //CollUtils.setPos($content, pos + atStr.length + 1);
        //$content.blur();
        
        CollUtils.fnFontCount("#content", "#fontCount", pageX.MAX_INPUT_LENGTH);
        //$content.selectionStart = $content.selectionEnd = pos + atName.length + 1;
    }
}

function _searchAtWhoItem(val, refresh){
    
    if(pageX.hasAtWhoMembers === false || (pageX.atWhoIsLast === true && !refresh)){
        return;
    }
    
    pageX.atWhoIsLast = false;
    val = val || "";
    
    //加载数据
    cmp.dialog.loading();
    pageX.atWhoIsSearching = true;
    if(refresh === true){
        pageX.atWhoPage.pageNo = 1;
    }else{
        pageX.atWhoPage.pageNo += 1;
    }
    
    pageX.atWhoPage.summaryId = summaryBO.summary.id;
    pageX.atWhoPage.name = val;
    $s.Coll.pushMessageToMembersList(pageX.atWhoPage, errorBuilder({
        success : function(ret){
            cmp.dialog.loading(false);
            pageX.atWhoIsSearching = false;
            ret = ret || [];
            if(refresh){
            	var assignNodeMember  = _findAssignNodeMember(val);
            	ret = assignNodeMember.concat(ret);
            }
            if((!val || pageX.options.showMeetingInfo) && ret.length == 0 && pageX.atWhoPage.pageNo == 1){
                pageX.hasAtWhoMembers = false;
                var msg = '<div class="StatusContainer"><div class="nocontent"></div><span class="text nocontent_text">'+cmp.i18n("collaboration.page.lable.msgNoMembers")+'</span></div>';
                pageX.atDialog.mainDiv.querySelector("#at-who-ul").innerHTML = msg;//没有消息推送的人
            }
            
            if(pageX.hasAtWhoMembers){
                
                if(ret.length < pageX.atWhoPage.pageSize){
                    pageX.atWhoIsLast = true;
                }
                var searchResults = null;
                if(refresh && pageX.options.showAll){
                    searchResults = [{
                        "name" : "All",
                        "id" : "All",
                        "i18n" : cmp.i18n("collaboration.page.lable.msgAllMember"),//所有人
                        "memberId" : "All"
                    }].concat(ret);
                }else{
                    searchResults = ret;
                }
                //取当前登录人
                $s.User.getUserId({}, errorBuilder({
                    success : function(ret){
                    	searchResults = _removeRepeatMember(searchResults,ret);
                        _renderAtWhoList(searchResults, refresh);
                    },
                    error : function(){
                        cmp.dialog.loading(false);
                        pageX.atWhoIsSearching = false;
                    }
                }))
                
            }
        },
        error : function(){
            cmp.dialog.loading(false);
            pageX.atWhoIsSearching = false;
        }
    }))
}

function _renderAtWhoList(memberList, refresh){
    
    var h = "";
    
    if(memberList && memberList.length > 0){
        
        var htmlTemplate = '<%for(var i = 0, len = this.length; i < len; i++){'
            +'  var item = this[i];'
            +'%>'
            +'<li class="cmp-list-cell ">'
            +' <div class="cmp-list-cell-img cmp-checkbox cmp-left">'
            +'     <input class="select-put" type="checkbox" value="<%=item.memberId%>" data-affairid="<%=item.id%>" data-phone="<%=item.phone%>" data-name="<%=item.name%>"/>'
            +'<%if(item.id != "All"){%>'
            +'     <img class="cmp-pull-left img_setting" width="40px" height="40px" src="<%=item.headshotURL%>"/>'
            +'<%if(item.id.indexOf("activity")==-1){%>'
            +'<%    var affairInfo = CollUtils.showAffairState(item.state, item.subState, item.backFromId); item.i18n=affairInfo.label;%>';
        if(pageX.options.showState){
        	htmlTemplate += '<%if(affairInfo.color != "sent"){%>'
                +'     <div style="left:52px;top:28px" class="read-states <%=affairInfo.color%>">'
                +'        <div class="state-bg">'
                +'           <span class="<%=affairInfo.icon%> state-color"></span>'
                +'        </div>'
                +'     </div>'
                +'<%}%>';
        }
        htmlTemplate += '<%}%>';
        htmlTemplate += '<%}%>'
            +' </div>';
        if(pageX.options.showMeetingInfo){
        	htmlTemplate += ' <div class="cmp-list-cell-info" >';
        }else{
        	htmlTemplate += ' <div class="cmp-list-cell-info" style="width:50%">';
        }
        htmlTemplate += '<%if(item.postName){%>'
            +'     <span class="cmp-ellipsis cmp-pull-left list_title_name width_69"><%=item.name%></span>';
        if(pageX.options.showMeetingInfo){
        	htmlTemplate += '     <span class="cmp-ellipsis cmp-pull-left list_title_name width_69">('
        	+'<%if(item.phone){%>'
        		+'<%=item.phone%>'
        	+'<%}else{%>'
        		+ cmp.i18n("collaboration.multicall.none")
        	+'<%}%>)'
        }
        htmlTemplate += '     <h6 class="cmp-ellipsis list_cont_info"><%=item.postName%></h6>'
            +'<%}else{%>'
            +'     <span style="margin-top:10px;" class="cmp-ellipsis cmp-pull-left list_title_name width_69"><%=item.name%></span>'
            +'<%}%>'
            +' </div>';
        if(pageX.options.showState){
        	htmlTemplate += '        <div class="handler-states common-state right" style="width:20%;"><span style="width:100%;margin-top:6px;"><%=item.i18n%></span></div>';
        }
        htmlTemplate += ' </li>'
            +'<%}%>';
        
        //设置头像
        for(var k = 0; k < memberList.length; k++){
            memberList[k]["headshotURL"] = cmp.origin + "/rest/orgMember/avatar/" + memberList[k]["memberId"] + "?maxWidth=200";
        }
        
        h = cmp.tpl(htmlTemplate, memberList);
    }
    
    if(refresh){
        pageX.atDialog.mainDiv.querySelector("#at-who-ul").innerHTML = h;
    }else if(h != ""){
        pageX.atDialog.mainDiv.querySelector("#at-who-ul").insertAdjacentHTML("beforeEnd", h);
    }
}

/**
 * 获取流程当前会签的人员
 * @returns {Array}
 */
function _findAssignNodeMember(searchName){
	var assignNodeMember = new Array();
	var wfDesigner = pageX.wfDesigner;
	if(!wfDesigner){
		return assignNodeMember;
	}
	var jsonFileds = wfDesigner.jsonFileds;
	if(!jsonFileds){
		return assignNodeMember;
	}
	var processChangeMessage = jsonFileds.processChangeMessage;
	if(processChangeMessage){
		var processChangeMessageJson = cmp.parseJSON(processChangeMessage);
		var addNodeInfos = processChangeMessageJson["nodes"];
		if(addNodeInfos){
			for(var i = 0;i<addNodeInfos.length;i++){
				var addNodeInfo  = addNodeInfos[i];
				//当前会签的是人员时才进行解析
				if(addNodeInfo["fromType"]=="3" && addNodeInfo["eleType"]=="user" 
					&& addNodeInfo["eleName"] && addNodeInfo["eleName"].indexOf(searchName)!=-1){
					var memeber = {};
					memeber["memberId"] = addNodeInfo["eleId"];
					memeber["name"] = addNodeInfo["eleName"];
					memeber["state"] = "";
					memeber["subState"] = "";
					memeber["id"] = "activity|"+addNodeInfo["id"];
					memeber["i18n"] = "";
					assignNodeMember.push(memeber);
				}
			}
		}
	}
	return assignNodeMember;
}

/**
 * 去除重复的人员
 * @param memberList
 * @param currentUserId
 * @returns {Array}
 */
function _removeRepeatMember(memberList,currentUserId){
	var returnMemebrList = new Array();
	for(i=0;i<memberList.length;i++){
		var member = memberList[i];
		var memberId = member["memberId"];
		if(!CollUtils.isInArray(pageX.pushMessageMembersList,memberId) && memberId != currentUserId){
			returnMemebrList.push(member);
			pageX.pushMessageMembersList.push(memberId);
		}
	}
	return returnMemebrList;
}