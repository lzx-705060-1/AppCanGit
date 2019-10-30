var chat = {
	userId : cmp.member.id,
	panel : _$(".uc-chat-tool-panel"),
	tools : querySelectorAll(".uc-chat-toolbar span"),
	screenH : window.screen.height,
  	headerH : _$("header").clientHeight,
  	footerH : _$("footer").clientHeight,
  	ucInputH : _$(".uc-input").clientHeight,
  	toolbarH : _$(".uc-chat-toolbar").clientHeight,
  	content : _$(".cmp-control-content"),
  	input_text : _$("#uc-input-text"),
  	sendBtn : _$(".uc-send"),
	isFirstIn:true,
	// 手指滑屏，隐藏工具栏
	figerHideTools : function(){
		chat.content.addEventListener('touchend',function(){
		    if(chat.panel.style.display == "block"){
		      	chat.hideTools();
		    }
		});
	},
	// 隐藏工具栏
	hideTools : function(){
		if(chat.panel.style.display == "block"){
		    chat.panel.style.display = "none";
		    chat.panel.innerHTML = "";
		    for(var i = 0;i < chat.tools.length;i++){
		        var cn = chat.tools[i];
		        if(cn.className.indexOf(" icon-blue") != -1){
		        	cn.className = cn.className.replace(" icon-blue", "");
		        }
		    }
		    chat.refreshPage("#all_chat","#cmp-control",200);
		}
	},
	// 输入框有焦点时，滑屏隐藏键盘
	hideKeyBorad : function(){
		if(chat.input_text == document.activeElement && chat.panel.style.display == "none"){
			chat.input_text.blur();
			chat.refreshPage("#all_chat","#cmp-control",200);
		}
	},
	/**  刷新页面位置
	* animationTime:滚动动画时间
	* position:页面滚动位置，默认是0，可传可不传
	*/
	refreshPage : function(ele1,ele2,animationTime,position){
        var h = document.body.clientHeight - chat.headerH - parseInt(_$("#header").style.paddingTop);
        if(chat.panel && chat.panel.style.display == "block"){
            h = (h - chat.panel.clientHeight - (chat.ucInputH + 10) - chat.toolbarH) + "px";
            _$(ele2).style.height = h;
        }
        else{
            h = (h - chat.footerH) + "px";
            _$(ele2).style.height = h;
        }
        var page = cmp.listView(ele1);
        page.refresh();
        if(page.scrollerH > page.wrapperH){
        	// 如果传了position参数，并且不等于0
        	if(position && position != 0){
        		var dis = -(cmp(".cmp-scroll")[0].scrollHeight+position)
				setTimeout(function () {
					position == 0 ? page.scrollTo(0,page.maxScrollY,animationTime) : page.scrollTo(0,dis);
				},10)

        	}
        	else{
        		page.scrollTo(0,page.maxScrollY,animationTime);
        	}
        }
        //ios固定头部
        var headerF = cmp.HeaderFixed("#header",chat.input_text);
        if(cmp.os.ios){
       		headerF.refresh();
        }
        $("img[imgid]").load(function(){
        	if(chat.isFirstIn){
				var scrollTop = parseFloat($("#chat_list").css("height"))-($(window).height()-$("header").height()-$("footer").height())+20;
				$(".cmp-scroll").css("transform","translate(0px, -"+scrollTop+"px) scale(1) translateZ(0px)");
				chat.isFirstIn = false;
        	}

		});
    },
    // 初始化表情
    initEmojiObj : function(){
        return new $emoji();
    },
	initEmoji : function(){
	  	$chatView.emoji.init_emoji_ontainer("uc-input-text","emoji_ontainer",function() {
		    chat.input_text.value = chat.input_text.value + "["+ this.getAttribute("_title")+ "]";
		    chat.initInputHeight(chat.input_text);
		    chat.sendText(chat.input_text);
	  	});
	},
	// 递归下载图片
    initChatImg : function() {
		if(chat.doneCount >= chat.imgDomList.length){
			return;
		}
		var nowDom = chat.imgDomList[chat.doneCount];
		var nowId = nowDom.getAttribute("imgId");
		var nowTitle = nowDom.getAttribute("imgTitle");
		chatFileDownload.getDownloadUrl(cmp.member.id, nowId, "image", function (d) {
			var dom = getIqXml(d);
			if (dom.xmlIq.getAttribute("type") == "result") {
				chat.doneCount ++;
				var url = getImgPath(dom.xmlDoc,$chatView.uc_url);
				nowDom.setAttribute("src",url);
				nowDom.setAttribute("imgLoad","true");
				$ucChatToolsFunction.picture.initPic(".uc-chat-img");
				chat.initChatImg();
			}
		},function(data){
			if (data) {
				if(data.code == "36005"){
	                cmp.notification.alert(data.message,function(){
	                    cmp.href.closePage();
	                },"","确定");
	            }
			} else {
				cmp.notification.toast("服务器失去连接","center",2000);
			}
			
		});
	},
	// 输入框获取焦点时，隐藏聊天工具栏
	focusInput : function(e){
		chat.hideTools();//隐藏工具栏
	  	chat.initKeybPagePos("#all_chat","#cmp-control",200);
	  	if(parseFloat($("#chat_list").css("height"))<$(window).height()-250-$("header").height()-$("footer").height()){
			setTimeout(function () {
				$("#chat_list").css("marginTop",$("body")[0].scrollTop);
			},300)
		}
	  	// 监控输入框输入状态
	  	e.addEventListener("input",function(){
	  		chat.inputPaste(e);
	  		chat.initInputHeight(e);
	    	chat.sendText(e);
	  	});
	},
	initInputHeight : function(e){
		var inputWrap = document.getElementsByClassName("uc-input")[0];
		if(e.scrollHeight > e.clientHeight){
			if(e.scrollHeight == 94){
				inputWrap.style.height = "104px";
				e.style.height = "94px";
				e.style.overflowY = "hidden";
			}
			else if(e.scrollHeight > 94){
				inputWrap.style.height = "104px";
				e.style.height = "94px";
				e.style.overflowY = "auto";
			}
			else{
				inputWrap.style.height = (e.scrollHeight + 10) + "px";
				e.style.height = e.scrollHeight + "px";
				e.style.overflowY = "hidden";
			}
		}else if(e.clientHeight > 32){
			if((e.clientHeight - 20) < 32 || (e.clientHeight - 20) == 32){
				inputWrap.style.height = "44px";
				e.style.height = "34px";
			}else{
				inputWrap.style.height = ((e.clientHeight - 20) + 10) + "px";
				e.style.height = (e.clientHeight - 20) + "px";
			}
			e.style.overflowY = "hidden";
		}
		e.scrollTop = e.scrollHeight; 
	},
	inputPaste : function(e){
		var v = e.value;
    	if(v.indexOf("<span class=\"show-emoji-5-") != -1){
    		e.value = $chatView.emoji.emojiToM3(v.replace(/<span class=\"show-emoji-5-/g,"[5_").replace(/\"><\/span>/g,"]"));
    	}
	},
	// 调用键盘时，初始化聊天窗口位置
	initKeybPagePos : function(ele1,ele2,animationTime){
		window.onresize = function(){
	    	chat.refreshPage(ele1,ele2,animationTime);
	  	}
	},
	// 长按消息后，出现对话框
	popBubble : function(chatId){
		var mess = document.getElementById(chatId);
		if(mess){
			var textChat = mess.querySelector(".uc-bubble-arrow").nextSibling;
			var type = textChat.getAttribute("data-type");
			var textChatEmoji = textChat.querySelector(".show-emoji-all");
			if(textChat){
				var timeout = null;
				textChat.addEventListener("touchstart", function(event) {
				    timeout = setTimeout(function(){
				    	var li = mess;
				    	// if(li.getAttribute("isown") == "true"){
			    			// cmp.notification.bubble(function(index){
			    				// 本期不加该功能
			                    // if(index == 0){
			                        // console.log("撤消msgId：" + chatId);
			                        // var oldTime = chat.getMillisecond(li.getAttribute("timestamp"));
						    		// var nowTime = new Date().getTime();
						    		// var flag = 2 * 60 * 1000;//2分钟
			                        // if((nowTime - oldTime) > flag){
			                        	// chat.bubbleRevokeMsg(chatId);
			                        // }
			                    // }
			                    // else if(index == 1){
			                    // 	chat.bubbleForwardMsg();
			                    // }
			                    // else if(index == 1){
		                            // chat.bubbleDelMsg(chatId);
			                    // }
			                // },["撤销","删除"]);
				    	// }
		                // else{
		                	// chat.bubbleDel(chatId);
		                // }
		                if(type == 'text' && !textChatEmoji){
		                	cmp.notification.bubble(function(index){
		       //          		$(".cmp_bubble_btn").attr("data-clipboard-action","copy").attr("data-clipboard-target","#text_"+chatId);
									// var clipboard = new Clipboard('.cmp_bubble_btn');
									// clipboard.on('success', function(e) {
									// 	console.log(e);
									// });
		                		var text = $("#text_"+chatId)[0].textContent;
		                		if (text.indexOf("<br/>") != -1) {
		                			text = text.replace(/<br\/>/g,"\n");
		                		}
		                		$(".cmp_bubble_btn").attr("data-clipboard-action","copy").attr("data-clipboard-target","#text_"+chatId).attr("data-clipboard-text",text);
									var clipboard = new Clipboard('.cmp_bubble_btn');
									clipboard.on('success', function(e) {
										console.log(e);
									});
		                	},["复制"]);
		                }else{
		                	// chat.bubbleDel(chatId);
		                }
						if(type!= "filetrans" && type != "image"){
							chat.bubblePosition(event);
						}
			    	}, 500);
				});
			  	textChat.addEventListener("touchmove", function() {
			  		clearTimeout(timeout);
			  	});
			  	textChat.addEventListener("touchend", function() {
			  		clearTimeout(timeout);
			  	});
			}
		}
	},

	// 气泡相对消息显示的位置
	bubblePosition : function(event){
        var positionX = event.touches[0].pageX;
        var positionY = event.touches[0].pageY;
        var bodyWidth = document.documentElement.clientWidth ;
        var upperTriangle = _$("div.cmp_upper_triangle");
        var bubbleContainer = _$("div.cmp_bubble_container");
        if (bubbleContainer) {
        	var bubbleContainerWidth = bubbleContainer.offsetWidth;
        	if(positionX < 25){
	            positionX = 25;
	            bubbleContainer.style.left = positionX - 20 + 'px';
	        }else if(bodyWidth - positionX + 10 < bubbleContainerWidth || bodyWidth - positionX < 35){
	            positionX = positionX - 25;
	            bubbleContainer.style.left = bodyWidth - bubbleContainerWidth - 10 + 'px';
	        }else if(positionX < bubbleContainerWidth/2){
	            bubbleContainer.style.left = 5 + 'px';
	        }else{
	            bubbleContainer.style.left = positionX - bubbleContainerWidth / 2 + 10 + 'px';
	        }
	        upperTriangle.style.top = positionY + 'px';
	        upperTriangle.style.left = positionX + 'px';
	        bubbleContainer.style.top = positionY + 20 +'px';
        }
    },
    // 移出弹出气泡样式
	removeBubble : function(){
		var arrow = _$(".cmp_upper_triangle");
		var btns = _$(".cmp_bubble_container");
		if(arrow){
			document.body.removeChild(arrow);
		}
		if(btns){
			document.body.removeChild(btns);
		}
	},
	// 删除消息
	bubbleDel : function(chatId){
		cmp.notification.bubble(function(index){
            if(index == 0){
            	chat.bubbleDelMsg(chatId);
            }
        },["删除"]);
	},
	// 气泡撤销消息
	bubbleRevokeMsg : function(chatId){
        cancelChat(chat.uuid(),chatId,$chatView.states.toId,$chatView.states.toName,
        	function (result) {
                var dom = document.getElementById(chatId);
                if (dom.parentNode) {
                    dom.parentNode.removeChild(dom);
                }
            },
			function (result) {
        		alert("撤消失败！" + result);
			}
		);
	},
	// 气泡删除消息
	bubbleDelMsg : function(chatId){
		var dom = document.getElementById(chatId);
        var timestamp = dom.getAttribute("timestamp");
        var isGroup = ($chatView.states.chatType == "groupchat");
        delChat(cmp.member.id,$chatView.states.toId,isGroup,timestamp,function (data) {
            if (dom.parentNode) {
            	if(dom.previousSibling && dom.previousSibling.querySelector(".uc-chat-date")){
                	dom.parentNode.removeChild(dom.previousSibling);
                }
                dom.parentNode.removeChild(dom);
            }
        },function(data){
        	if (data) {
        		if(data.code == "36005"){
	                cmp.notification.alert(data.message,function(){
	                    cmp.href.closePage();
	                },"","确定");
	            }
        	} else {
        		cmp.notification.toast("服务器失去连接","center",2000);
        	}
        });
	},
	bubbleCopyMsg : function(chatId){
		var id = "text_" + chatId;
		var copyEle = document.getElementById(id);
		copyEle.select(); 
		document.execCommand("Copy");
	},
	// 转发功能，显示转发页面浮层
	bubbleForwardMsg : function(){
	    _$("#forwardDiv").className += " cmp-active";
        if(_$("#uc-forward")){
		    cmp.listView("#uc-forward", {});
		}
		// 创建转发弹出框，默认不显示
		chat.createDialog();
		// 点击最近联系人列表
		cmp(".uc-recent-member").on('tap', ".cmp-table-view-cell", function(e) {
			// 显示弹出框
			chat.showDialog(type,textChat,this);
		});
	},	
	// 关闭转发浮层
	closeDiv : function(){
		if(_$("#cancelDiv")){
			_$("#cancelDiv").addEventListener("tap",function(){
				if(_$("#forwardDiv").className.indexOf("cmp-active") > -1){
					_$("#forwardDiv").className = _$("#forwardDiv").className.replace(" cmp-active", "");
				}
				// 删除转发弹出框
				document.body.removeChild(_$("#sendTo"));
				document.body.removeChild(_$(".cmp-backdrop"));
			});
		}
	},
	// 创建转发弹出框
	createDialog : function(){
		var sendToHTML='<div class="window_alert_content text">' +
					        '<div class="container cmp-text-left">' +
					        	'<div class="sendTo">'+
						        	'<h5 class="window_alert_title ">发送给</h5>' +
						        	'<div class="user-info"> '+
						        		'<img src="" alt="" style="background:#ccc;border-radius:25%;"/> <span></span>' +
						        	'</div>'+
							        '<div class="user-text">' +
							        	'<span></span> ' +
							        '</div>'+
							        '<div class="window_alert_cont">' +
							        	'<input type="text" placeholder="给同事留言">' +
							        	'<span class="cmp-icon iconfont icon-roundclosefill input_clear"></span>' +
							        '</div>'+
						        '</div>'+
						        '<div class="window_alert_sub">' +
						        	'<button class="cmp-btn cmp-btn-primary uc-cancel-btn">取消</button>' +
						        	'<button class="cmp-btn cmp-btn-primary uc-confirm-btn">确定</button>' +
						        '</div>'+
					    	'</div>'+
					    '</div>';
		var wrapper = document.createElement("div");
		var drapHTML = document.createElement("div");
		wrapper.className = "window_alert cmp_bomb_box cmp-hidden";
		wrapper.id = "sendTo";
		wrapper.innerHTML = sendToHTML;
		drapHTML.className = "cmp-backdrop cmp_bomb_box_backdrop cmp-hidden";
		drapHTML.id = "backDrop";
		document.body.appendChild(wrapper);
		document.body.appendChild(drapHTML);
	},
	// 显示弹出框
	showDialog : function(type,parentEle,_self){
		var head = _$(".user-info");
		var backdrop = _$(".cmp-backdrop");
		var send = _$("#sendTo");
		// 人员头像
		head.querySelector("img").src = _self.querySelector(".uc-head").querySelector("img").src;
		// 人名名称
		head.querySelector("span").innerText = _self.querySelector(".username").innerText;
		// 转发显示内容
		_$(".user-text").querySelector("span").innerText = chat.showInfo(type,parentEle);
		// 显示弹出框
		backdrop.className = backdrop.className.replace("cmp-hidden","");
		_$(".window_alert").className = _$(".window_alert").className.replace("cmp-hidden","");
		// 点击遮罩层，隐藏弹出框
		backdrop.addEventListener("tap",function(){
			send.className += " cmp-hidden";
			backdrop.className = backdrop.className.replace("cmp-hidden","");
		},false);
		// 点击取消按钮，隐藏弹出框
		_$(".uc-cancel-btn").addEventListener("tap",function(){
			send.className += " cmp-hidden";
			backdrop.className = backdrop.className.replace("cmp-hidden","");
		},false);
	},
	// 根据消息类型，展现弹出框body的内容
	showInfo : function(chatType,parentEle){
		// TODO:type类型暂时写死，后期需要根据后台对称统一
		switch(chatType){
			case "text":
			  	return parentEle.querySelector(".uc-chat-text").innerText;
			case "voice":

			  	break;
			case "image":

			  	break;
			case "card":

			  	break;
			case "filetrans":

			  	break;
			case "new":

			  	break;
			case "a8":

			  	break;
		}
	},
    // 创建转发弹出框
    createAtDialog : function(){
        cmp("#atHeader").on('tap', "#atCancelDiv", function(e) {
           chat.closeAtDialog();
        });
        cmp.listView("#uc-sel", {
            config: {
                params: {},
                pageSize: 20,
                renderFunc: chat.renderAtData,
                dataFunc: function (params, option) {
                    var memberList = cmp.parseJSON(cmp.storage.get("nowGroupMap",true));
                    var listData = {};
					listData.data = memberList;
                    listData.total = memberList.memberNum;
                    option.success(listData);
                },
                isClear: true
            },
            down: {
                contentdown: '',
                contentover: '',
                contentrefresh: '',
                contentprepage: ''
            },
            up: {
                contentdown: '',
                contentrefresh: '',
                contentnomore: '',
                contentnextpage: ''
            }
        });
    },
	searchAtDialog : function(searchStr){

	},
    // 显示弹出框
    openAtDialog : function(){
    	_$("#selGroupMemDiv").className += " cmp-active";
        // _$("#selGroupMemDiv").classList.add('cmp-active');
    },
	closeAtDialog : function () {
		_$("#selGroupMemDiv").className = _$("#selGroupMemDiv").className.replace("cmp-active","");
    },
    renderAtData : function (result,isRefresh){
        var table = document.getElementById("atTable");
    	if(isRefresh){
            table.innerHTML = "";
		}
//        var pendingTPL = document.getElementById("atRows").innerHTML;
		var pendingTPL = uc.innerHTML(document.getElementById("atRows"));
        var uc_chat = cmp.storage.get("uc_chat",true);
        var html = cmp.tpl(pendingTPL, result);
        var htmlDom = parseDom(html);
        for(var i = 0;i<htmlDom.length;i++){
        	if(htmlDom[i].nodeName != "#text" && (htmlDom[i].getAttribute("data-id") != cmp.member.id)){
                document.getElementById("atTable").appendChild(htmlDom[i].cloneNode(true));
            }
        }
        document.getElementById("uc-sel").style.height = window.innerHeight - document.getElementsByTagName("header")[0].clientHeight + "px";
        cmp.listView("#uc-sel").refresh();
        cmp("#atTable").on('tap', ".username", function(e) {
            document.getElementById("uc-input-text").value += e.target.innerHTML + " ";
            _$("#uc-input-copy").value += e.target.innerHTML + " ";
            chat.closeAtDialog();
        });
	},
	// 显示聊天窗口title
	showTitle : function(){
		_$("#title").innerText = uc.HTMLDecode(uc.htmlEncodeByRegExp($chatView.states.toName));
		if($chatView.states.block == "1"){
		
			var span = document.createElement("span");
			span.className = "uc-block-msg cmp-icon iconfont icon-dont";
			_$("#title").appendChild(span);
		}
	},
	// 发送文本消息  已将输入框换成div模拟的文本框了，没有发送按钮
	// clickKeybord : function(){
	//   	chat.input_text.addEventListener("keydown",function(event){
	// 	    if(event.keyCode == "13") {
	// 	    	chat.sendTextMsg(chat.input_text);
	// 	    }else if(event.keyCode == '229'){
 //                console.log("@");
 //                //留坑
 //            }
	//   	});
	// },
	initParams : function (argument) {
		// 从M3穿透过来
	    if(location.search.indexOf("?") != -1){
	        $chatView.globalParams = GetParams(); 
	        $chatView.states.toName = decodeURI($chatView.globalParams.toName);
	    }
	    else{//从致信最近交流列表穿透过来
	        $chatView.globalParams = cmp.href.getParam();
	        $chatView.states.toName = $chatView.globalParams.toName;
	    }
	    $chatView.states.chatType = $chatView.globalParams.chatType;
	    $chatView.states.toId = $chatView.globalParams.toId;
	    if($chatView.states.chatType == "groupchat"){
	    	$chatView.states.block = cmp.storage.get("groupInfoBlock");
    		$chatView.createGroup = $chatView.globalParams.createGroup ? true : false;
    		$chatView.reFreshGroupMember();//向缓存中存取群成员信息
    		// 从下一个页面返回时带的参数
		    var p = cmp.href.getBackParam();
		    if(p){
		        if(p.block != null){
		            $chatView.states.block = p.block;
		        }
		        $chatView.states.toName = p.groupName;
		    }
	    }
	    // 获取致信服务器ip
	    cmp.chat.chatInfo({
	        success:function(result){
	            $chatView.uc_url = result.ip;
	        },
	        error:function(error){}
	    });
	    $chatView.emoji = chat.initEmojiObj();// 初始化表情对象
	},
	// 获取聊天窗口的历史消息
	loadHisData : function () {
		cmp.listView("#all_chat", {
	        config: {
	            params: {},
	            pageSize: 20,
	            renderFunc: chat.renderData,
	            dataFunc: chat.getListData,
	            isClear: true
	        },
	        down: {
	            contentdown: '',
	            contentover: '',
	            contentrefresh: '',
	            contentprepage: "上一页"
	        },
	        up: {
	            contentdown: '上拉显示更多',
	            contentrefresh: '',
	            contentnomore: '没有更多',
	            contentnextpage: "下一页"
	        }
	    });
	},
	// 根据协议获取窗口中的历史消息数据
	getListData : function (params, option) {
		var end = null;
	    if ($chatView.states.endTime != "") {
	        end = $chatView.states.endTime;
	    }
	    getRecentChat($chatView.userId, $chatView.states.toId, $chatView.states.chatType, end, function (result) {
	        var dom = getMessageXml(result);
	        var listData = {};
	        if(dom.xmlMsg.length == 0){
	        	listData.data = [1];
	        }else{
	        	var msg = dom.xmlDoc.getElementsByTagName("message")[0];
	        	var msgId = msg.getAttribute("id");
	        	var li = document.getElementById(msgId);
	        	if (!li) {
	        		listData.data = dom.xmlMsg;
	        	} else {
	        		listData.data = [1];
	        	}
	        }
	        listData.total =uc.getElementsByTagName(dom.xmlDoc,"totalnum");
	       	option.success(listData);
	    },function(result){
	        if(result.code == "36005"){
	            cmp.notification.alert(result.message,function(){
	                cmp.href.closePage();
	            },"","确定");
	        }
	    });
	},
	imgDomList : [],
	doneCount : 0,
	renderData : function (result, isRefresh) {
		chat.imgDomList = [];
	    chat.doneCount = 0;
	    if (isRefresh && result[0] != 1) {
	        var len = result.length - 1;
//	        for (var i = len; i >= 0; i--) {
	        for (var i = 0; i <= len; i++) {
	            (function(arg){
	                var msg = result[arg];
	                var uuid = cmp.buildUUID();//显示时间戳id
	                var msgId = msg.getAttribute("id");//消息id
	                if(msg.getAttribute("from")!=null){
						fromId = msg.getAttribute("from").split("@")[0];
	                }else{
	                	fromId ="";
	                }
	                var to = msg.getAttribute("to").split("@")[0];
	                var time = msg.getAttribute("timestamp");
	                var type = msg.getAttribute("type");
	                var isRead = msg.getAttribute("isRead");
	                var showText = "";
	                if(msg.getElementsByTagName("body").length > 0){
	                	if (msg.getAttribute("type") == "chat" || msg.getAttribute("type") == "groupchat") {
	                		showText = msg.querySelector("body").textContent;
	                	} else {
	                		showText = uc.getElementsByTagName(msg,"body");
	                	}
	                }
	                
	                if (arg == len) {
	                    $chatView.states.endTime = time;
	                }
	                // 计算时间毫秒值
	                var timeDom = null;
	                var datetime = chat.hrTime(time);
	                var nowM, upM;
	                if (result[arg - 1]) {
	                    nowM = chat.getMillisecond(time);
	                    upM = chat.getMillisecond(result[arg - 1].getAttribute("timestamp"));
	                }
	                // 第一条消息要显示时间
	                if(arg == 0){
	                    timeDom = parseDom(msgType({msgType:"time",body:datetime,chatId:uuid,timestamp:''}))[0];
	                }else{
	                    // 当前消息和上一条消息的时间差超过1分钟，显示时间
	                	if ((upM - nowM) / 1000 >= 60) {
		                        timeDom = parseDom(msgType({msgType:"time",body:datetime,chatId:uuid,timestamp:''}))[0];
		              }
	                }
	                //聊天实体dom
	                var chatDom = null;
	                var data = {
	                    memberId: $chatView.userId,
	                    from: fromId,
	                    chatType: $chatView.states.chatType,
	                    chatId: msgId,
	                    timestamp : time,
	                    toId : arg,
	                    isRead : isRead,
	                    toJid : to,
	                    headSrc : uc.getSingleAvatarUrl(fromId,100)
	                };
	                if($chatView.states.chatType == "groupchat"){
	                    data.name = uc.getElementsByTagName(msg,"name");
	                }
	                if($chatView.states.chatType == "chat"){
	                    // 此处不能用上面的nowM参数，否则页面中的第一条数据是自己发的，那么永远都是未读
	                    if(chat.getMillisecond(time) < $chatView.readTime){
	                        data.readStateClass = "uc-chat-readed";
	                        data.readState = "已读";
	                    }else{
	                        data.readStateClass = "uc-chat-unread";
	                        data.readState = "未读";
	                    }
	                }
	                //展现语音
	                if(type == "microtalk"){
	                	chat.showResiveVoice(data,msg,chatDom,"send",timeDom);
	                }
	                // 显示图片
	                else if(type == "image"){
	                	chat.showPic(data,msg,chatDom,timeDom);
	                }
	                // 显示文档
	                else if(type == "filetrans"){
	                	chat.showResiveDoc(data,msg,chatDom,"send",timeDom);
	                }
	                //显示系统消息
	                else if(type=="system"){
                		data.msgType = "system";
                		data.body = showText.replace(/&amp;nbsp;/g,"&nbsp;").replace(/&amp;lt;/g,"&lt;").replace(/&amp;gt;/g,"&gt;").replace(/&lt;br\/&gt;/g,"<br/>").escapeHTML();
                		chatDom = parseDom(msgType(data))[0];
						if ($chatView.chatList.hasChildNodes()) {
						    $chatView.chatList.insertBefore(chatDom, $chatView.chatList.firstChild)
						} else {
						    $chatView.chatList.appendChild(chatDom);
						}
						if(timeDom){
						    $chatView.chatList.insertBefore(timeDom,chatDom);
						}
					
	                }
	                // 展现文本
	                else{
	                    data.msgType = "text";
	                    // 显示表情
	                    data.body = $chatView.emoji.emojiToM3Icon(showText);
	                    if (data.body.indexOf("\n") != -1) {
							data.body = data.body.replace(/\n/g,"<br/>");
						}
	                    // data.body = showText.replace(/&amp;nbsp;/g,"&nbsp;").replace(/&amp;lt;/g,"&lt;").replace(/&amp;gt;/g,"&gt;").escapeHTML();
	                    chatDom = parseDom(msgType(data))[0];
	                    if ($chatView.chatList.hasChildNodes()) {
	                        $chatView.chatList.insertBefore(chatDom, $chatView.chatList.firstChild)
	                    } else {
	                        $chatView.chatList.appendChild(chatDom);
	                    }
	                    if(timeDom){
		                    $chatView.chatList.insertBefore(timeDom,chatDom);
		                }
	                    chat.popBubble(data.chatId);
	                }
	            })(i);   
	        }

	        // 将img全部放到数组中
//	        var imgList = document.getElementsByClassName("uc-chat-img");
//	        chat.downloadPic(imgList);

	        $chatView.timestamp = chat.getMillisecond(result[len].getAttribute("timestamp"));
				console.log($chatView.pos)
				chat.refreshPage("#all_chat","#cmp-control",0,$chatView.pos);

	        $chatView.pos = -(cmp('.cmp-scroll')[0].scrollHeight);
			console.log($chatView.pos);
	    }
	},
	showPic : function(data,msg,chatDom,timeDom){
		var img = msg.getElementsByTagName("image")[0];
		var thumbnailId = img.getElementsByTagName("id_thumbnail")[0];
//        var mId =  thumbnailId ? thumbnailId.innerHTML : img.getElementsByTagName("id")[0].innerHTML;
        var mId =  thumbnailId ? uc.innerHTML(thumbnailId) : uc.getElementsByTagName(img,"id");
        mId = mId.indexOf("_1") != -1 ? mId : mId+"_1"; 
        var imgUrl=uc.getImgPath(mId);
        var mTitle = img.getElementsByTagName("name")[0].innerHTML;
        data.mId = mId;
        data.msgType = "image";
        data.mTitle = mTitle;
        data.imgUrl = imgUrl;
        chatDom = parseDom(msgType(data))[0];
        if ($chatView.chatList.hasChildNodes()) {
            $chatView.chatList.insertBefore(chatDom, $chatView.chatList.firstChild)
        } else {
            $chatView.chatList.appendChild(chatDom);
        }
        if(timeDom){
            $chatView.chatList.insertBefore(timeDom,chatDom);
        }
        chat.popBubble(data.chatId);
	},
	// 发送消息，并判断输入框是否有值，并改变相应样式
	sendText : function(e){
		if(e.value && e.value != " "){
		    if(chat.sendBtn.className.indexOf(" uc-send-gray") > -1){
		      	chat.sendBtn.className = chat.sendBtn.className.replace(" uc-send-gray", " uc-send-blue");
		    	chat.sendBtn.addEventListener("touchstart",function(event){
		    		event.stopPropagation();
		    		event.preventDefault();
		    		if(e.value && e.value != " "){
		    			if(e.value.trim() != ""){
				    		chat.sendTextMsg(e);//发送文本消息
				    	}else{
				    		cmp.notification.toast("不能发送空白消息");
				    		e.value = "";
	    					e.blur();
				    	}
		    			if(_$("#uc-look").className.indexOf("icon-blue") == -1){
				          	// chat.input_text.focus();
				        }
				        if(chat.sendBtn.className.indexOf(" uc-send-blue") > -1){
				          	chat.sendBtn.className = chat.sendBtn.className.replace(" uc-send-blue", " uc-send-gray");
				        }
		    		}
		      	},false);
		    }
		}else{
		    if(chat.sendBtn.className.indexOf(" uc-send-blue") > -1){
		      	chat.sendBtn.className = chat.sendBtn.className.replace(" uc-send-blue", " uc-send-gray");
		    }
		}
	},
	// 发送文本消息
	sendTextMsg : function(e){
		var chatId = chat.uuid();
		var content = e.value;
    	if (content != "" && content.length > 0) {
    		if(content.trim() != ""){
    			// content = content.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g,"<br/>").replace(/\s/g,"&nbsp;");
    			content = content.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/ /g,"&nbsp;");
	    		// 先显示发送消息样式
	    		chat.showSuccessTextStyle(chatId,content);
	    		// 向后台服务器发送消息
	    		chat.sendTextToServer(chatId,content);
	    	}else{
	    		cmp.notification.toast("不能发送空白消息");
	    		document.getElementsByClassName("uc-input")[0].style.height = "44px";
	    		e.value = "";
	    		e.style.height = "34px";
	    		e.blur();
	    	}
    	}
      	// 长按消息
      	chat.popBubble(chatId);
      	// 将蓝色的发送按钮置灰
      	if(chat.sendBtn.className.indexOf(" uc-send-blue") > -1){
        	chat.sendBtn.className = chat.sendBtn.className.replace(" uc-send-blue", " uc-send-gray");
      	}
	},
	// 发送成功显示文本消息样式
	showSuccessTextStyle : function(liId,val){
		// 显示发送的时间
		var timeHtml = "";
        var timeDom = null;
        timeDom = parseDom(chat.showSendMsgTime(timeHtml))[0];
		// 发送表情
		val = $chatView.emoji.emojiToPC(val);
		// 显示表情
		val = $chatView.emoji.emojiToM3Icon(val);
		if (val.indexOf("\n") != -1) {
			val = val.replace(/\n/g,"<br/>");
		}
		var data = {
			memberId:chat.userId,
			from:chat.userId,
			chatType: $chatView.states.chatType,
            msgType : "text",
			body:val,
			chatId:liId,
			name : cmp.member.name,
			timestamp : new Date().format("yyyy-MM-ddThh:mm:ss.000000+08:00")
		};
		if(data.chatType == "chat"){
			data.readStateClass = "uc-chat-unread";
			data.readState = "未读";
		}
        var chatDom = parseDom(msgType(data))[0];
        if(timeDom){
            $chatView.chatList.appendChild(timeDom);
        }
        $chatView.chatList.appendChild(chatDom);
        document.getElementsByClassName("uc-input")[0].style.height = "44px";
        chat.input_text.value = "";
        chat.input_text.style.height = "34px";
        // 群组独有的
        if(_$("#uc-input-copy")){
        	_$("#uc-input-copy").value = "";
        }
        $chatView.timestamp = new Date().getTime();
		chat.refreshPage("#all_chat","#cmp-control",0);
	},
	// 发送失败的样式
	sendFailStyle : function(chatid){
		cmp.notification.toast("服务器失去连接,消息发送失败","center",2000);
		if($chatView.states.chatType == "chat"){
			var li = document.getElementById(chatid);
			var span = li.querySelector(".uc-chat-read-state");
			span.className = "uc-chat-read-state iconfont icon-PC-warning redWarning";
			span.innerText = "";
		}
	},
	// 去掉失败样式
	removeFailStyle : function(chatid){
		if($chatView.states.chatType == "chat"){
			var li = document.getElementById(chatid);
			var span = li.querySelector(".uc-chat-read-state");
			span.className = "uc-chat-read-state uc-chat-unread";
			span.innerText = "未读";
		}
	},
	sendTextToServer : function(chatId,content){
		var atList = [];
		if($chatView.states.chatType == "groupchat"){
			if(cmp.storage.get("nowGroupMap",true)){
	            var memberMap = cmp.parseJSON(cmp.storage.get("nowGroupMap",true));
	            for(var memberId in memberMap.memberMap){
	            	if(content.indexOf("@"+memberMap.memberMap[memberId].name + " ")>-1){
	            	    atList.push(memberId);
					}
				}
			}
		}
    	chatForSingleDog({
            id:chatId,
			toId:$chatView.states.toId,
			toName:$chatView.states.toName,
            chatType:$chatView.states.chatType,
			content:$chatView.emoji.emojiToPC(content),
			atList:atList,
            errorFunc : function(data){
    			chat.sendFailStyle(chatId);
    		}
    	});
    	chat.delStorage();
    	$chatView.sendMsgId = chatId;//记录刚刚发送消息的id，待接收对方已读消息协议，返回时间戳时用这个id改变该消息的已读和未读状态
	},
    // 接收对方发送消息
    receiveMsg: function () {
        document.addEventListener("UC_getMessage", function (e) {
            var data = e.data;
            var result = data.params;
            var domParser = new DOMParser();
            var xmlDoc = domParser.parseFromString(result, 'text/xml');
            if (xmlDoc.getElementsByTagName("message")[0]) {
            	var flag = "receive";
            	var msg = xmlDoc.getElementsByTagName("message")[0];
                var fileId = chat.uuid();
            	var formId = msg.getAttribute("from").split("@")[0];
            	var to = msg.getAttribute("to").split("@")[0];
            	if ($chatView.states.toId == formId) {
            		// 如果是群组的话，from的id是user属性的值
            		if(msg.getElementsByTagName("groupname")[0]){
            			var fromUserId = msg.getElementsByTagName("user")[0];
	            		if(fromUserId){
	            			formId = uc.innerHTML(fromUserId).split("@")[0];
	            		}
            		}
            		if (msg.getAttribute("type") == "destroy_group") {
            			uc.db.delGroupMessage($chatView.states.toId,function(userId){
		                  cmp.notification.alert("该群组已解散!",function(){
		                        cmp.href.back();
		                    },"","确定");          
		                });
            		} else if (msg.getAttribute("type") == "kitout_group") {
            			uc.db.delGroupMessage($chatView.states.toId,function(userId){
		                  cmp.notification.alert("您已不在该群中!",function(){
		                        cmp.href.back();
		                    },"","确定");          
		                });
            		} else {
            			var data = {
		                    memberId: chat.userId,
		                    from: formId,
		                    chatId: fileId,
		                    toId : cmp.buildUUID(),
		                    toJid : to,
		                    timestamp : new Date().format("yyyy-MM-ddThh:mm:ss.000000+08:00"),
		                	headSrc : uc.getSingleAvatarUrl(formId,100)
		                };
					    var chatDom = null;
		                // 语音
		                if(msg.getElementsByTagName("microtalk")[0]){
		                	chat.showResiveVoice(data,msg,chatDom,flag);
		                }
		                // 图片
		                else if(msg.getElementsByTagName("image")[0]){
		                	chat.imgDomList = [];
							chat.doneCount = 0;
		                	chat.showResivePic(data,msg,chatDom);
	//	                	var imgList = document.getElementById(data.chatId).getElementsByClassName("uc-chat-img");
	//	                	chat.downloadPic(imgList);
		                }
		                // 文件
		                else if(msg.getElementsByTagName("filetrans")[0]){
		                	chat.showResiveDoc(data,msg,chatDom,flag);
		                }
		                // 文本
		                else{
			                chat.showResiveText(data,msg,chatDom,formId);
		                }
		                chat.popBubble(data.chatId);
		                $chatView.timestamp = new Date().getTime();
			            chat.refreshPage("#all_chat", "#cmp-control", 0);
			            if($chatView.states.chatType != "groupchat"){
			            	chat.listenerReadMsg();// 接收消息时，需要向服务器获取对方读取消息的状态
			            }
            		}
		        } else {
		        	var msgInfo=uc.getFormatMsgInfo(uc.userInfo.getId(),msg);
		        	if(msg.getAttribute("type") == 'destroy_group' || msg.getAttribute("type") == 'kitout_group'){
						uc.db.delGroupMessage(msgInfo.userId,function(userId){
							if(userId&&userId!='undefined'){
								// delItem(userId);
							}
						});
					} else {
						if (formId != to) {//不是PC端发消息，移动端登录该账号查看的情况
							//默认未读数为1
				            msgInfo.count=1;
				            uc.db.insertUcIndexMsg(msgInfo,false, function(res) {
								uc.db.getUcIndexMsg(msgInfo.userId ,function(resultObj){
									//添加子元素
									// addItem(resultObj);
								});
				            });
						} else {
							
						}
					}
		        }
            }
            // 接收对方查看消息的已读时间协议
            else if(xmlDoc.getElementsByTagName("iq")[0]){
            	if($chatView.states.chatType == "chat"){
            		var iq = xmlDoc.getElementsByTagName("iq")[0];
	            	var type = iq.getAttribute("type");
	            	if(type == "set"){
	            		var timeEle = iq.getElementsByTagName("last_time")[0];
	            		if(timeEle){
							$chatView.readTime = Number(timeEle.innerHTML);
							if($chatView.sendMsgId){
								var currentLi = document.getElementById($chatView.sendMsgId);
								var fromId = currentLi.querySelector(".uc-me-chat-base").getAttribute('data-from');
								var nowMsgs = document.querySelectorAll("div[data-from='"+fromId+"']");
								for (var i=0;i<nowMsgs.length;i++) {
									var isReaded = nowMsgs[i].querySelector(".uc-chat-unread");
									if (isReaded) {
										isReaded.className = isReaded.className.replace("uc-chat-unread","uc-chat-readed");
										isReaded.innerHTML = "已读";
									}
								}
							}
	            		}
	            	}
            	}
            }
        });
    },
    showResivePic : function(data,msg,chatDom){
    	var img = msg.getElementsByTagName("image")[0];
        if(img.getElementsByTagName("id_thumbnail")[0]){//移动端发的图片缩略图id
    			mId = uc.innerHTML(img.getElementsByTagName("id_thumbnail")[0]);
	    	}else{//PC端发的图片id
	    		mId = uc.innerHTML(img.getElementsByTagName("id")[0]);
	    		mId = mId.indexOf("_1") != -1 ? mId : mId+"_1"; 
	    	}
        var imgUrl = uc.getImgPath(mId)
        var mTitle = img.getElementsByTagName("name")[0].innerHTML;
        data.mId = mId;
        data.msgType = "image";
        data.mTitle = mTitle;
        data.imgUrl = imgUrl;
        if (msg.getElementsByTagName("groupname")[0]) {
            data.name = msg.getElementsByTagName("name")[0].innerHTML;
        }
        chatDom = parseDom(msgType(data))[0];
        $chatView.chatList.appendChild(chatDom);
    	chat.popBubble(data.chatId);
    },
    downloadPic : function(imgList){
    	for (var i = 0; i < 20 && i < imgList.length; i++) {
            var imgDom = imgList[imgList.length - 1 - i];
            if (imgDom.getAttribute("imgLoad") == "false") {
                chat.imgDomList.push(imgDom);
            } else {
                break;
            }
        }
        chat.initChatImg();
    },
    showResiveVoice : function(data,msg,chatDom,flag,timeDom){
    	var microtalk = msg.getElementsByTagName("microtalk")[0];
        if(microtalk){
            var mId = uc.innerHTML(microtalk.getElementsByTagName("id")[0]);
            var mTime = uc.innerHTML(microtalk.getElementsByTagName("size")[0]);
            data.msgType = "voice";
            data.body = {id:mId,src:"",times:mTime};
            if (msg.getElementsByTagName("groupname")[0]) {
	            data.name = uc.innerHTML(msg.getElementsByTagName("name")[0]);
	        }
            chatDom = parseDom(msgType(data))[0];
            if(flag == "receive"){
            	$chatView.chatList.appendChild(chatDom);
            }else if(flag == "send"){
            	if ($chatView.chatList.hasChildNodes()) {
	                $chatView.chatList.insertBefore(chatDom, $chatView.chatList.firstChild)
	            } else {
	                $chatView.chatList.appendChild(chatDom);
	            }
            }
            var w = $ucChatToolsFunction.record.voiceProgressWidth(data);
            var pn = document.getElementById(data.chatId);
            var voice = pn.querySelector(".voice");
            voice.style.width = w;
            pn.querySelector(".uc-chat-base").style.display = "block";
            if(flag == "send"){
            	if(timeDom){
	                $chatView.chatList.insertBefore(timeDom,chatDom);
	            }
            }
            chat.popBubble(data.chatId);
        }
    },
    showResiveDoc : function(data,msg,chatDom,flag,timeDom){
    	var f = msg.getElementsByTagName("filetrans")[0];
        var fname = uc.getElementsByTagName(f,"name");
        var ftype = fname.substring(fname.lastIndexOf(".") + 1,fname.length).toLowerCase();
        var fsize = f.getElementsByTagName("size")[0].innerHTML;
        var fid = f.getElementsByTagName("id")[0].innerHTML;
        data.fid = fid;
        data.msgType = "filetrans";
        data.fname = fname;
        data.size = (fsize != "") ? bytesToSize(fsize) : "";
        data.fileSize = (fsize != "") ? fsize : "";
        var icon = showDocIcon(ftype);
        data.icon = icon;
        if (msg.getElementsByTagName("groupname")[0]) {
            data.name = msg.getElementsByTagName("name")[0].innerHTML;
        }
        chatDom = parseDom(msgType(data))[0];
        if(flag == "receive"){
        	$chatView.chatList.appendChild(chatDom);
        	document.getElementById(data.chatId).querySelector(".uc-doc-s").innerHTML = "下载";
        }else if(flag == "send"){
        	if ($chatView.chatList.hasChildNodes()) {
	            $chatView.chatList.insertBefore(chatDom, $chatView.chatList.firstChild)
	        } else {
	            $chatView.chatList.appendChild(chatDom);
	        }
	        if(cmp.member.id == data.from){
	            document.getElementById(data.chatId).querySelector(".uc-doc-s").innerHTML = "已上传";
	        }
        }
        if(flag == "send"){
        	if(timeDom){
	            $chatView.chatList.insertBefore(timeDom,chatDom);
	        }
        }
        chat.popBubble(data.chatId);
    },
    showResiveText : function(data,msg,chatDom,formId){
    	var chatType = msg.getAttribute("type");
        if(chatType && chatType != null){
        	// var showText = uc.innerHTML(msg.getElementsByTagName("body")[0]);
        	var showText = msg.getElementsByTagName("body")[0].textContent;
	        //修改android传过来的message包含extension，ios没有
	   //      if(msg.getElementsByTagName("extension").length!=0){
				// name = msg.getElementsByTagName("extension")[0].getElementsByTagName("name")[0].innerHTML;
	   //      }else{
				name = uc.innerHTML(msg.getElementsByTagName("name")[0]);
	        // }
	        if (msg.getElementsByTagName("user").length > 0) {
	            var nameId = uc.innerHTML(msg.getElementsByTagName("user")[0]).split("@")[0];
	        }
            var _html = "";
            _html = chat.showSendMsgTime(_html);
            // showText = $chatView.emoji.emojiToM3Icon(showText.escapeHTML());
            showText = $chatView.emoji.emojiToM3Icon(showText);
            data.chatType = chatType;
            data.msgType = "text";
            // data.body = showText.replace(/&amp;nbsp;/g,"&nbsp;").replace(/&amp;lt;/g,"&lt;").replace(/&amp;gt;/g,"&gt;").replace(/&lt;br\/&gt;/g,"<br/>");
            // data.body = showText.replace(/&amp;nbsp;/g,"&nbsp;").replace(/&amp;lt;/g,"&lt;").replace(/&amp;gt;/g,"&gt;").replace(/\n/g,"<br/>").escapeHTML();
            if (showText.indexOf("\n") != -1) {
				showText = showText.replace(/\n/g,"<br/>");
			}
            data.body = showText
            if (chatType == $chatView.states.chatType) {
                data.nameId = nameId;
                data.name = name;
            }
            chatDom = parseDom(msgType(data))[0];
            $chatView.chatList.appendChild(chatDom);
        }
    },
	// 显示发送消息的时间
	showSendMsgTime : function(_html){
		var msgId = cmp.buildUUID();
		var nowM = new Date().getTime();
        var upM = Number($chatView.timestamp);
		if($chatView.chatList.querySelectorAll("li").length == 0){
			_html += msgType({msgType:"time",body:chat.getNewDate(),chatId:msgId});
        }else if($chatView.chatList.querySelectorAll("li").length > 0){
        	if(!upM){
        		_html += msgType({msgType:"time",body:chat.getNewDate(),chatId:msgId});
        	}else if(upM != null && (nowM - upM)/1000 >= 60){
        		_html += msgType({msgType:"time",body:chat.getNewDate(),chatId:msgId});
        	}
        }
        return _html;
	},
	// 显示当前时间
	getNewDate : function() {
		var _date = new Date();
		var _y = _date.getFullYear();
		var _m = _date.getMonth() + 1;
		var _d = _date.getDate();
		var _h = _date.getHours();
		_h = (parseInt(_h) < 10 ? ("0" + _h) : _h);
		var _min = _date.getMinutes();
		_min = (parseInt(_min) < 10 ? ("0" + _min) : _min);
		var _s = _date.getSeconds();
		_s = (parseInt(_s) < 10 ? ("0" + _s) : _s);
		return _h + ':' + _min;
	},
	// 显示时间 格式：2017-02-07T12:34:07.205443+07:00
	hrTime : function(ts) {
	    var messageYear = ts.substr(0,ts.indexOf('T')).split('-')[0];
	    var messagemounth = ts.substr(0,ts.indexOf('T')).split('-')[1];
	    messagemounth = (messagemounth.substr(0,1) == '0' ? messagemounth.substr(1) : messagemounth);
	    var messageDate = ts.substr(0,ts.indexOf('T')).split('-')[2];
	    messageDate = (messageDate.substr(0,1) == '0' ? messageDate.substr(1) : messageDate);
	    var year = new Date().getFullYear();
	    var mounth = new Date().getMonth() + 1;
	    var date = new Date().getDate();
    	var ts1 = ts.substr(0,ts.indexOf('.'));
    	if(date == messageDate && mounth == messagemounth){
    		return  ts1.substr(ts.indexOf('T')+1).slice(0,-3);
    	}else if (parseInt(date)-1 == parseInt(messageDate) && mounth == messagemounth){
    		return  "昨天"+ ts1.substr(ts.indexOf('T')+1).slice(0,-3);
    	}else{
    		return messageYear + "-" + messagemounth + "-" + messageDate + " " + ts1.substr(ts.indexOf('T')+1).slice(0,-3);
    	}
	},
	// 计算毫秒时间   ts 参数值格式：2017-02-15T13:33:07.346973+08:00
	getMillisecond : function(ts) {
		var millisencod=new Date(ts).getTime();
		if(isNaN(millisencod)){
			if(ts.indexOf(".") > -1 && ts.indexOf("T") > -1){
				var s = ts.substring(0,ts.indexOf(".")).replace(new RegExp("T","gm")," ");
				return new Date(s).getTime();
			}
		}else{
			 return millisencod;
		}
	   
	},
	// 上传附件
	upLoad : function(options){
		cmp.att.upload({
	        url:options.url,  //附件上传的服务器地址
	        fileList:options.fileList,//需要上传的附件列表
	        title:options.title ? options.title : "",  //上传进度显示名称
			imgIndex : options.imgIndex ? options.title : null,
	        progress:function(result){
	        	if(options.progress){
	        		options.progress(result);
	        	}
	        },
	        success:function(result){  //服务器端返回的相应数据
	        	if(options.success){
	        		options.success(result);
	        	}
	        },
	        error:function(error){
	            if(options.error){
	        		options.error(result);
	        	}
	        }
	    });
	},
	// 下载附件
	download : function (options) {
        cmp.att.download({
            url:options.url,  //下载地址
            title:options.title ? options.title : "",  //上传进度显示名称
            extData : {
                fileId : options.extData.fileId,
                lastModified : options.extData.lastModified,
                origin : options.extData.ucUrl,
                isVoice : options.extData.isVoice
            },
            progress:function(result){
                if(options.progress){
                    options.progress(result);
                }
            },
            success:function(result){  //服务器端返回的相应数据
                if(options.success){
                    options.success(result);
                }
            },
            error:function(result){
                if(options.error){
                    options.error(result);
                }
            }
        });
    },
    // 打开本地离线文档
    openOfflineFiles : function(opt){
    	cmp.att.getOfflineFiles({
            success:function(result){
                if(opt.success){
                    opt.success(result);
                }
            },
            error:function(result){
                if(opt.error){
                    opt.error(result);
                }
            }
        });
    },
    // 查看附件内容
    readFile : function(opt){
    	cmp.att.read({
	        path:opt.path,
	        filename:opt.fname,
	        edit:false,
	        extData:{
	            fileId:opt.fid,
	            lastModified:opt.lastModified,
	            origin: opt.ucUrl
	        },
	        success:function(result){
	            if(opt.success){
                    opt.success(result);
                }
	        },
	        error:function(error){
	            if(opt.error){
                    opt.error(error);
                }
	        }
	    });
    },
	back : function(id){
		_$(id).addEventListener("tap", function(){
			if(location.search.indexOf("?") != -1){
				cmp.href.close();
			}else{
				chat.saveHisCon();
				if($chatView.createGroup){
					cmp.href.next(ucPath + "/html/ucIndex.html",{
		                animated : true,
		                direction : "left"
		            });
				}else{
					cmp.href.back();
				}
			}
		});
	},
	// 离开窗口之前检测一下input输入框是否有值,有值将值保存到缓存中
	saveHisCon : function(){
		var val = chat.input_text.value.replace(/(^\s*)|(\s*$)/g, "");
		if(val != ""){
			var uc_chat = cmp.storage.get("uc_chat",true);
			if(!uc_chat){
				uc_chat = {};
			}else{
                uc_chat = JSON.parse(uc_chat);
            }
			uc_chat[$chatView.states.toId] = val;
			cmp.storage.save("uc_chat",JSON.stringify(uc_chat),true);
		}else if(val == ""){
			// 当input框内的值为空时，要清除缓存
			chat.delStorage();
		}
	},
	// 清空缓存
	delStorage : function(){
		var uc_chat = cmp.storage.get("uc_chat",true);
		if(uc_chat){
		    uc_chat = JSON.parse(uc_chat);
		    if(uc_chat && uc_chat[$chatView.states.toId]){
		    	delete uc_chat[$chatView.states.toId];
		    	cmp.storage.save("uc_chat",JSON.stringify(uc_chat),true);
		    }
		}
	},
	// 取出缓存，并判断是否存在缓存，有值的话，input框内需要显示hisContent值，并获取焦点
	getStorage : function(){
		var uc_chat = cmp.storage.get("uc_chat",true);
	    if(uc_chat){
	        uc_chat = JSON.parse(uc_chat);
	        if(uc_chat && uc_chat[$chatView.states.toId]){
	            chat.input_text.value = uc_chat[$chatView.states.toId];
                chat.input_text.focus();
                if(chat.sendBtn.className.indexOf(" uc-send-gray") > -1){
		          	chat.sendBtn.className = chat.sendBtn.className.replace(" uc-send-gray", " uc-send-blue");
		        }
	        }
	    }
	},
	// set协议：打开窗口后，告诉服务器此刻已经读了所有消息
	listenerReadMsg : function(){
		sendToServerLastReadMsgTime($chatView.userId, $chatView.states.toId, $chatView.states.chatType, function(result){
	        var obj = getIqXml(result);
	        if(obj.xmlIq == "result"){}
		},function(data){
			if (data) {
				if(data.code == "36005"){
	                cmp.notification.alert(data.message,function(){
	                    cmp.href.closePage();
	                },"","确定");
	            }
			} else {
				cmp.notification.toast("服务器失去连接","center",2000);
			}
			
		});
	},
	// get协议：给对方发送消息后，向服务器发送请求，得知对方最后一次读取消息的时间戳
	knowOtherReadMsg : function(){
		requestLastReadMsgTime($chatView.userId, $chatView.states.toId, $chatView.states.chatType, function(result){
	        var obj = getIqXml(result);
	        if(obj.xmlIq.getAttribute("type") == "result"){
	        	$chatView.readTime = Number(obj.xmlIq.querySelector("last_time").innerHTML);
	        	return $chatView.readTime;
	        }
		},function(data){
			if (data) {
				if(data.code == "36005"){
	                cmp.notification.alert(data.message,function(){
	                    cmp.href.closePage();
	                },"","确定");
	            }
			} else {
				cmp.notification.toast("服务器失去连接","center",2000);
			}
			
		});
	},
	// 生成每条li消息上的id
	uuid : function(){
		var uuidList = cmp.buildUUID().split("-");
        var fileId = cmp.member.id + uuidList[0] + uuidList[1];
        return fileId;
	},
	// 再次发送消息
	reSend : function(){
		var _self = this.querySelector(".uc-me-chat-base");
		if(_self){
			var toid = _self.getAttribute("data-from");
			if($chatView.userId == toid){
				if(this.querySelector(".redWarning")){
					var chatId = this.getAttribute("id");
					var type = this.querySelector(".uc-me-chat-base").getAttribute("data-type");
					if(type == "text"){
						chat.sendTextToServer(chatId,this.querySelector(".uc-chat-text").innerHTML);
					}
					else if(type == "voice"){
						var filePath = this.querySelector(".voice").getAttribute("src");
						var fn = filePath.substring(filePath.lastIndexOf("/") + 1);
						var vParams = {
							src : this.querySelector(".voice").getAttribute("src"),
							times : this.querySelector(".vtime").innerHTML,
							filename : fn,
							fileId : chatId
						};
						$ucChatToolsFunction.record.sendRecordToServer(vParams);
					}
					else if(type == "image"){
						$ucChatToolsFunction.picture.uploadSendImg(chatId);
					}
					else if(type == "filetrans"){
						var src = this.querySelector(".uc-doc").getAttribute("data-path");
						var fname = src.substring(src.lastIndexOf("/") + 1);
						var fileSize = this.querySelector(".uc-doc").getAttribute("data-size");
						$ucChatToolsFunction.doc.sendDocToserver(fname,fileSize,chatId,src);
					}
					chat.removeFailStyle(chatId);
				}
			}
		}
	}
};
