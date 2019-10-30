var ShowComment = {};
//秀评论数据
ShowComment.from = cmp.platform.CMPShell ? "M3" : "Weixin";
//评论
ShowComment._cache_ = {}
ShowComment.doComment=function(replyToId,pId,rootId,showPostId,replyToName){
	ShowComment._cache_ = {
		"replyToId":replyToId,
		"pId":pId,
		"rootId":rootId,
		"showPostId":showPostId,
		"replyToName":replyToName
	};
	ShowComment.commentDiv.classList.add("cmp-bar-footer");
	ShowComment.commentDiv.classList.remove("show-hide");
	document.getElementById("reply_shade").style.display = "block";
	ShowComment.isHide = false;
	//  回复  xx
	ShowComment.ccinput.value = "";
	ShowComment.ccinput.setAttribute("placeholder",cmp.i18n("Show.comment.reply") + " " + replyToName);
	ShowComment.ccinput.focus();
	
}

//列表事件初始化
ShowComment.listInit=function(){
	cmp.append(document.body,ShowComment.commentdiv);
	
	//初始化列表和评论事件
	cmp(".showpost_list").on('tap', ".comment-item", function(e) {
		var event = e || window.event;
		if(event.stopPropagation){
			event.stopPropagation();
		}
		event.cancelBubble = true;
		
		var replyId = this.getAttribute("replyId");
		var commentId = this.getAttribute("commentId");
		var rootId = this.getAttribute("rootId");
		var showPostId = this.getAttribute("showPostId");
		if(rootId == 0 || rootId == -1){
			rootId  =commentId;
		}
		var replyToName = this.querySelector(".username").innerText;
		var deleAuth = this.getAttribute("deleAuth");
		
		var items = [ {
			key : "2",
			name : cmp.i18n("Show.comment.reply")
		} ];
		// 如果有删除权限
		if (deleAuth != "true") {
			ShowComment.doComment(replyId,commentId,rootId,showPostId,replyToName);
		}else{
			items.push({
				key : "1",
				name : "<span style='color:red'>"+ cmp.i18n("Show.page.button.delete") +"</span>"
			});
			
			// 点击
			cmp.dialog.actionSheet(items,cmp.i18n("Show.cancel"),function(item) {
				switch (item.key) {
					case "1":
						setTimeout(function(){
							cmp.notification.confirm(cmp.i18n("Show.interactive.deleteComment"),
									function(e1) {
								e1 == 1 && ShowComment.deleteComment({"replyId":commentId,"showPostId":showPostId});
							},
							null,[ cmp.i18n("Show.cancel"),cmp.i18n("Show.page.button.confirm") ]);
						},500);
						break;
					case "2":
						ShowComment.doComment(replyId,commentId,rootId,showPostId,replyToName);
						break;
					default:
						break;
				}
			});
		}
		
	}).on('tap', ".doComment", function(e) {
		var event = e || window.event;
		if(event.stopPropagation){
			event.stopPropagation();
		}
		event.cancelBubble = true;
		this.parentElement.style.display = "none";
		
		
		var replyId = this.getAttribute("createUserId");
		var showPostId = this.getAttribute("showPostId");
		var replyToName = document.getElementById("showpost" + showPostId).querySelector(".showpostCreator").innerText;
		ShowComment.doComment(replyId,0,0,showPostId,replyToName);
	});
	
	ShowComment.commentDiv = document.getElementById("comment_div");
	ShowComment.ccinput = ShowComment.commentDiv.querySelector("#ccinput");
	
	//初始化表情容器
	ShowComment.$comment_emoji = new $emoji();
	ShowComment.$comment_emoji.init_emoji_ontainer("ccinput","emoji_ontainer",function() {
		ShowComment.ccinput.value = ShowComment.ccinput.value + "["+ this.getAttribute("_title")+ "]";
		ShowComment.adjustHeight();
	});
	
	// 输入框/表情选择器
	document.querySelector('#comment_enmotion').addEventListener('tap', function() {
		if (this.classList.contains('see-icon-v5-common-expression')) {
			ShowComment.display_emoji();
		} else if (this.classList.contains('see-icon-v5-common-keyboard')) {
			ShowComment.hide_emoji();
			ShowComment.ccinput.focus();
		}
	});
	ShowComment.ccinput.addEventListener('focus',function() {
		var emoji_ontainer_div = document.getElementById("comment_enmotion");
		if (emoji_ontainer_div.classList.contains('see-icon-v5-common-keyboard')) {
			ShowComment.hide_emoji();
			document.querySelector("#comment_div").style.bottom = "0px";
		}
	});
	document.querySelector('#send_button').addEventListener('tap',function() {
		ShowComment.saveComment(function(rs){
			 var html = cmp.tpl(ShowComment.commentTpl, [rs]);
			 var comments = document.getElementById("comments" + rs.showPostId);
			 cmp.append(comments,ShowComment.$comment_emoji.covert(html));
			 comments.style.display = "block";
			 ShowComment.hide();
		});
	});

	//textarea高度自适应
	ShowComment.ccinput.addEventListener('input', ShowComment.adjustHeight);
	
	
	//固定头部
/*	var jses = [cmpPath + "/js/cmp-headerFixed.js" + $buildversion];
	cmp.asyncLoad.js(jses,function(){
		var header = document.querySelector("header");
		cmp.HeaderFixed(header,ShowComment.ccinput);
	});*/
	
	/** @ 事件 */
	if(cmp.selectOrg){
		ShowComment.atComponent = new AtComponent({
			handlerId : 'openAt',
			containerId : 'ccinput'
		});
	}else{
		cmp.asyncLoad.css([cmpPath+"/css/cmp-selectOrg.css" + $buildversion]);
		cmp.asyncLoad.js([cmpPath+"/js/cmp-selectOrg.js" + $buildversion],function(){
			ShowComment.atComponent = new AtComponent({
				handlerId : 'openAt',
				containerId : 'ccinput'
			});
		});
	}
	
	//点击其他地方隐藏
	cmp("body").on('tap', "#comment_div", function(e) {
		var event = e || window.event;
		if(event.stopPropagation){
			event.stopPropagation();
		}
		event.cancelBubble = true;
		if(event.target.getAttribute("id") == "ccinput"){
			event.target.focus();
		}
	}).on('tap', "#reply_shade", function(e) {
		ShowComment.hide();
	}).on('touchmove', "#reply_shade", function(e) {
		ShowComment.hide();
	});
	ShowComment.contentHeight = window.innerHeight;;
}

//textarea自适应高度到max-height
ShowComment.adjustHeight = function(){
	var maxHeight;
	var heightOffset;
	var style = window.getComputedStyle(ShowComment.ccinput, null);
	maxHeight = style.maxHeight !== 'none' ? parseFloat(style.maxHeight) : false;
	if (style.boxSizing === 'content-box') {
		heightOffset = -(parseFloat(style.paddingTop)+parseFloat(style.paddingBottom));
	} else {
		heightOffset = parseFloat(style.borderTopWidth)+parseFloat(style.borderBottomWidth);
	}

	ShowComment.ccinput.style.height = 'auto';
	var endHeight = ShowComment.ccinput.scrollHeight+heightOffset;
	if (maxHeight !== false && maxHeight < endHeight) {
		endHeight = maxHeight;
		if (ShowComment.ccinput.style.overflowY !== 'scroll') {
			ShowComment.ccinput.style.overflowY = 'scroll';
		}
	} else if (ShowComment.ccinput.style.overflowY !== 'hidden') {
		ShowComment.ccinput.style.overflowY = 'hidden';
	}
	ShowComment.ccinput.style.height = endHeight+'px';
}
//隐藏评论区域
ShowComment.isHide = true;
ShowComment.hide = function(){
	if(ShowComment.isHide){
		return;
	}
	ShowComment.isHide = true;
	
	ShowComment.ccinput.blur();
	//去掉之前自适应高度加上的样式
	ShowComment.ccinput.removeAttribute("style");

	ShowComment.commentDiv.classList.remove("cmp-bar-footer");
	ShowComment.commentDiv.classList.add("show-hide");
	document.getElementById("reply_shade").style.display = "none";
	
	try{
		if(document.querySelector(".content_details")){
			document.getElementById("showpost-list").style.height = (ShowComment.contentHeight -50) + "px";
		}else{
			document.getElementById("showpost-list").style.height = ShowComment.contentHeight + "px";
		}
	}catch(e){}
}
ShowComment.deleteComment = function(params){
	//{"replyId":replyId,"showPostId":showPostId}
	$s.Show.removeComment(params.showPostId, params.replyId,"","",{
		success : function(result){
			if (result.success) {
				if(result.data.length > 0){
					cmp.notification.toast(cmp.i18n("Show.comment.delete.success"), "center");// "删除评论成功"
					var html = cmp.tpl(ShowComment.commentTpl, result.data);
					var comments = document.getElementById("comments" + params.showPostId);
					comments.innerHTML = ShowComment.$comment_emoji.covert(html);
				}else{
					var comments = document.getElementById("comments" + params.showPostId);
					comments.innerHTML = "";
					comments.style.display = "none";
				}
			} else {
				cmp.notification.toast(cmp.i18n("Show.comment.delete.failure"), "center");// "删除评论失败"
			}
		},
		error :function(e){
			var cmpHandled = cmp.errorHandler(e);
			if(!cmpHandled){
				cmp.notification.toast(cmp.i18n("Show.comment.delete.failure"), "center");// "删除评论失败"
			}
		}
	});
}
// 当前为键盘输入时
ShowComment.display_emoji = function() {
	document.querySelector('#comment_enmotion').classList.remove('see-icon-v5-common-expression');
	document.querySelector('#comment_enmotion').classList.add('see-icon-v5-common-keyboard');
	document.querySelector(".emoji_ontainer").classList.remove('display_none');
	document.querySelector("#comment_div").classList.add("emoji_div");
}
// 当前为表情输入时
ShowComment.hide_emoji = function() {
	document.querySelector('#comment_enmotion').classList.remove('see-icon-v5-common-keyboard');
	document.querySelector('#comment_enmotion').classList.add('see-icon-v5-common-expression');
	document.querySelector(".emoji_ontainer").classList.add('display_none');
	document.querySelector("#comment_div").classList.remove('emoji_div');
}


// 添加秀评论
ShowComment.submitFlag = true;
// 验证秀圈评论的内容
ShowComment.validateContent = function(content) {
	var success = true;
	if (content.length > 200) {
		cmp.notification.toast(cmp.i18n("Show.comment.validate.lt200"), "bottom");// "评论长度不能大于200"
		success = false
	} else if (content.length == 0) {
		cmp.notification.toast(cmp.i18n("Show.comment.validate.notnull"), "bottom");// "评论不能为空"
		success = false
	}
	return success;
}
ShowComment.saveComment = function(callback) {
	if(!ShowComment.submitFlag){
		return;
	}
	//提交标志，防止表单重复提交
	ShowComment.submitFlag = false;
	var content = ShowComment.ccinput.value;
	if (!ShowComment.validateContent(content)) {
		ShowComment.submitFlag = true;
		return;
	}
	if(cmp.Emoji){
		var cemoji = cmp.Emoji();
		if(content){
			content = cemoji.EmojiToString(content);
		}
	}
	//from  来自微协同（需要M3提供判断）
	var from = cmp.platform.CMPShell ? "M3" : "Weixin";
	var params = {
			"showpostId" : ShowComment._cache_.showPostId,
			"content" : content,
			"replyToId" : ShowComment._cache_.replyToId,
			"pId" : ShowComment._cache_.pId,
			"rootId" : ShowComment._cache_.rootId,
			"from":ShowComment.from
		}
	//@
	if(ShowComment.atComponent){
		var atMembers = ShowComment.atComponent.getResult();
		params.atInfo = cmp.toJSON(atMembers);
	}
	
	//权限验证字段，没办法rest只能传一个Map(针对消息穿透)
	if(ShowComment.authParams){
		for(var cc in ShowComment.authParams){
			var value = ShowComment.authParams[cc];
			params["auth_" + cc] = value;
		}
	}
	$s.Show.saveComment({},params,{
		success : function(result){
			//提交标志，防止表单重复提交
			ShowComment.submitFlag = true;
			if (result.success) {
				//cmp.notification.toast(cmp.i18n("Show.comment.comment.success"), "center");// "评论成功"
				// 将内容回填到列表中
				ShowComment.ccinput.value = "";
				ShowComment.hide_emoji();
				callback(result.data);
			} else {
				cmp.notification.toast(cmp.i18n("Show.comment.failure"), "bottom");// "评论失败"
			}
		},
		error :function(e){
			ShowComment.submitFlag = true;
			var cmpHandled = cmp.errorHandler(e);
			if(!cmpHandled){
				cmp.notification.toast(cmp.i18n("Show.comment.failure"), "center");// "评论失败"
			}
		}
	});
}

ShowComment.commentTpl =
  '<%                                                           '
+ '	for(var ci = 0,clen = this.length;ci < clen; ci++){     	'
+ '		var comment = this[ci];                             	'
+ '%>                                                           '
+ '<div class="comment-item" replyId="<%=comment.replyId %>"    '
+ '	commentId="<%=comment.id %>"                                '
+ '	rootId="<%=comment.rootId %>"                               '
+ '	deleAuth="<%=comment.deleAuth %>"                           '
+ '	showPostId="<%=comment.showPostId %>">                      '
+ '	<span class="username"><%=comment.replyName.escapeHTML(true) %></span>       '
+ '	<%if(comment.pId != "0" ){%>                                '
+ '		<span class="replyTo">' + cmp.i18n("Show.comment.reply") + '</span>        '
+ '		<span class="username"><%=comment.replyToName.escapeHTML(true) %></span> '
+ '	<% } %>                                                     '
+ '	<span class="replyContent"> : <%=comment.content.escapeHTML(true) %></span>  '
+ '</div>                                                       '
+ '<% }	%>';

ShowComment.commentdiv =
 '<footer class="cmp-bar cmp-bar-tab but_custom_content Big_Comment footer_comment_container cmp-comment-footer show-hide" id="comment_div">'
+ '<div style="position: relative;margin: 0 20px">                                                                                              '
+ '	<textarea class="cmp-not-trans input_comment" id="ccinput" type="text" placeholder=""></textarea>                                           '
+ ' <div class="but_custom Praise" >                                                                                                            '
+ '	<span class="cmp-icon iconfont see-icon-v5-common-expression kittyorkey footer_kitty"  id="comment_enmotion"></span>                        '
+ ' </div>                                                                                                                                      '
+ ' <div class="but_custom matter">                                                                                                             '
+ '	 <div class="but_custom send" id="send_button">                                                                                             '
+ '		<button class="send_button"><i18n key="Show.page.button.send"></i18n></button>                                                              '
+ '	 </div>                                                                                                                                     '
+ ' </div>                                                                                                                                      '
+ '</div>                                                                                                                                       '
+ '<div class="emoji_ontainer HelloKittyContainer display_none kitty_container" style="overflow-y:auto; " id="emoji_ontainer">                  '
+ '</div>                                                                                                                                       '
+ '</footer>                                                                                                                                    '
+ '<div id="reply_shade" style="display:none; position: fixed; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.2); z-index: 9; top: 0px;"></div>';