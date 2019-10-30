(function(){
	var pageParam,attComponent;
	cmp.ready(function(){
		//微协同端也能上传附件
		document.querySelector(".att-area").classList.remove("reply-hide");

		//绑定返回事件
		bindBackEvent();
		//页面高度计算
		initDom();
		//国际化
		loadPageParam();
		//页面事件
		initDomEvent();

//        cmp.HeaderFixed(document.getElementById("reply_header"), document.getElementById("reply-area"));
	});
	function getCommentPath(){
		if(cmp.platform.CMPShell === true ){
			if (/iphone|ipod/gi.test(navigator.userAgent)){
				return "iphone";
			}else if (/ipad/gi.test(navigator.userAgent)){
				return "ipad";
			}else{
				return "androidphone";
			}
		}
		return "weixin"
	}
	var bindBackEvent = function(){
		pageParam = cmp.href.getParam() || {};
		/*cmp("body").on("tap","#backBtn",function(){
			cmp.href.back();
		});*/
		cmp.backbutton();
        cmp.backbutton.push(cmp.href.back);
	}
	var initDom = function(){
		//主容器高度
	    var cmp_content=document.querySelector('.cmp-content');
	    var reply_area=document.querySelector("#reply-area");
	    var header=document.querySelector('header');
	    var footer=document.querySelector('footer');
	    var windowH= window.innerHeight;
	    var headerH,footerH;
	    headerH = !header ? 0 : header.offsetHeight;
	    footerH = !footer ? 0 : footer.offsetHeight;
	    if(cmp_content){
//	        cmp_content.style.height = windowH - headerH - footerH + "px";
//	        reply_area.style.height = windowH - headerH - footerH -41 + "px";
	    }
	}
	var loadPageParam = function(){
		pageParam = cmp.href.getParam() || {};
		var content = cmp.storage.get("task_reply_content",true);
		if(content){
			cmp.storage.delete("task_reply_content",true);
			document.querySelector("#reply-area").value = content;
			var num = content.length;
			document.querySelector("#reply-remain").innerHTML = 500 - num;
		}
	}
	var initDomEvent = function(){
		//添加文本框输入字数监听
		document.querySelector("#reply-area").addEventListener("input", function(){
			var num = this.value.length;
			if(num > 500){
				this.value = this.value.substr(0,500);
				this.blur();
				document.querySelector("#reply-remain").innerHTML = 0;
				cmp.notification.toast(cmp.i18n("Taskmanage.label.nomorethan500"), "center");
			}else{
				document.querySelector("#reply-remain").innerHTML = 500 - num;
			}
		});
        document.querySelector("#reply-area").addEventListener("focus", function(){
            setTimeout(function(){
                document.body.scrollTop = 0;
			},0);
		});
		//回复按钮
        var CommintTaskCommenting = false;
		cmp.event.click(document.querySelector("#task-reply-area .task-save-btn"),function(){
			if(CommintTaskCommenting){
				return;
			}
			CommintTaskCommenting = true;
			var content = document.querySelector("#reply-area").value;
			if(content.replace(/(^\s*)|(\s*$)/g,"") === "" && attComponent.getFileArray() == 0){
				cmp.notification.toast(cmp.i18n("Taskmanage.label.inputcomment"), "center");
				CommintTaskCommenting = false;
				return;
			}
			var pid = pageParam.replyCommentId != undefined ? pageParam.replyCommentId : 0;
			var params = {
				pid :pid,
				content : content,
				path : getCommentPath(),
				attachList : cmp.toJSON(attComponent.getFileArray())
			}
			if(cmp.Emoji){
				var cemoji = cmp.Emoji();
				if(params.content){
					params.content = cemoji.EmojiToString(params.content);
				}
			}
			$s.Task.taskComment(pageParam.taskId,{},params,{
				success : function(result){                                                                                                                      
					if(result.success === "true"){
						result = result.data;
						cmp.storage.save("task_reply_tag","reply",true);
						cmp.href.back();
					}else{
						CommintTaskCommenting = false;
						cmp.notification.alert(result.error_msg,function(){
							cmp.href.go(_taskmanagePath + "/html/task_index.html");
						},cmp.i18n("Taskmanage.label.tips"),cmp.i18n("Taskmanage.label.backtohome"));
						return;
					}
				},
				error : function(error){
					CommintTaskCommenting = false;
					var cmpHandled = cmp.errorHandler(error);
					if(!cmpHandled){
						console.log(error);
						cmp.notification.alert(error);							
					}
				}
			});
		},false);
		/**
		 * 初始化附件组件
		 */
	    var initParam = {
			uploadId : "picture",
			handler : "#attBtn",
			selectFunc : function(fileArray){
				document.querySelector("#attNum").innerHTML = fileArray.length;
			}
		}
		attComponent = new SeeyonAttachment({initParam : initParam});
		/**
		 * 监听beforepageredirect事件用于选择附件时调用
		 */
		document.addEventListener("beforepageredirect",function(){
			cmp.storage.save("task_reply_content",document.querySelector("#reply-area").value,true);
		},false);
	}
})();
