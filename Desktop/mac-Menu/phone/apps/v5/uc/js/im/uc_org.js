	// var connWin = window.parent.window.opener;
	var connWin = window;
	var _CurrentUser = null;
	// var sendJid = "";
	// var sendName = "";
	var sendJid = '2380826758543920147@localhost';
	var sendName = "3";
	var personPhotoMap = new Properties();
	var deleteUserMap = new Properties();
	var jid = connWin.jid;
	var currentName = connWin.currentName;
	var clientHeight = 0;
	var formUserPhoto = connWin.currentUserPhoto;
	var	toUserPhoto = connWin.sendUserPhoto;
	var face_texts_replace = [/\[5_1\]/g, /\[5_2\]/g, /\[5_3\]/g, /\[5_4\]/g, /\[5_5\]/g, /\[5_6\]/g, /\[5_7\]/g, /\[5_8\]/g,
	               /\[5_9\]/g, /\[5_10\]/g, /\[5_11\]/g, /\[5_12\]/g, /\[5_13\]/g, /\[5_14\]/g, /\[5_15\]/g, /\[5_16\]/g,
	               /\[5_17\]/g, /\[5_18\]/g, /\[5_19\]/g, /\[5_20\]/g, /\[5_21\]/g, /\[5_22\]/g, /\[5_23\]/g, /\[5_24\]/g,
	               /\[5_25\]/g, /\[5_26\]/g, /\[5_27\]/g, /\[5_28\]/g, /\[5_29\]/g, /\[5_30\]/g, /\[5_31\]/g, /\[5_32\]/g];
	var face_titles_replace = [/\[微笑]/g,/\[呲牙]/g,/\[坏笑]/g,/\[偷笑]/g,/\[可爱]/g,/\[调皮]/g,/\[爱心]/g,/\[鼓掌]/g,
	           /\[疑问]/g,/\[晕]/g,/\[再见]/g,/\[抓狂]/g,/\[难过]/g,/\[流汗]/g,/\[流泪]/g,/\[得意]/g,
	           /\[发怒]/g,/\[嘘]/g,/\[惊恐]/g,/\[鸭梨]/g,/\[赞]/g,/\[奖状]/g,/\[握手]/g,/\[胜利]/g,
	           /\[祈祷]/g,/\[强]/g,/\[蛋糕]/g,/\[礼物]/g,/\[OK]/g,/\[饭]/g,/\[咖啡]/g,/\[玫瑰]/g];
	var face_titles = ["[微笑]","[呲牙]","[坏笑]","[偷笑]","[可爱]","[调皮]","[爱心]","[鼓掌]",
	           "[疑问]","[晕]","[再见]","[抓狂]","[难过]","[流汗]","[流泪]","[得意]",
	           "[发怒]","[嘘]","[惊恐]","[鸭梨]","[赞]","[奖状]","[握手]","[胜利]",
	           "[祈祷]","[强]","[蛋糕]","[礼物]","[OK]","[饭]","[咖啡]","[玫瑰]"];

	function newJSJaCIQ() {
		return new JSJaCIQ();
	}

	function newJSJaCMessage() {
		return new JSJaCMessage();
	}
	
	function handleIQ(aIQ) {
	}

	function handlePresence(aPresence) {
	}


		function childHandleMessage(oMsg) {
			var from = cutResource(oMsg.getFrom());
			var msgType = oMsg.getType();
			if (msgType ==  "filetrans_result" || msgType == "group_system" || msgType == "group_info_notice_update" || msgType == "group_delete_file" || msgType == "group_info_update") { 
				return ;
			}
			if (msgType == 'error') {
				var errorType = oMsg.getNode().getElementsByTagName('service-unavailable');
				if (errorType.length < 1) {
					return;
				} else { 
					deleteUserMap.put(from,true);
				}
			}
			if (msgType == 'no_tip_kitout_group' || msgType == 'no_tip_destroy_group') {
				deleteUserMap.put(from, true);
				return ;
			}
			if (msgType == 'no_tip_add_group') { 
				deleteUserMap.remove(from);
				return ;
			}
			if (msgType == 'add_group' || msgType == 'destroy_group' || msgType == 'exit_group' || msgType == 'kitout_group') {
				if (msgType == 'add_group') {
					deleteUserMap.remove(from);
				} else if (msgType == 'destroy_group') {
					deleteUserMap.put(from, true);
				} else if (msgType == 'kitout_group') {
					deleteUserMap.put(from, true);
				}
				return ;
			}

			console.log(oMsg)
			addMessageByIndex(oMsg);
			addMessageByChat(oMsg);
		}
		
		function addMessageByChat(oMsg) {
			console.log("addMessageByChat",oMsg);
			var from = cutResource(oMsg.getFrom());
			// if (from != $("#chatBox").attr("senderid")) { 
			// 	return ;
			// }
			var type = oMsg.getType();
			var body = oMsg.getBody();
			var random = Math.floor(Math.random() * 100000000);
			var datetime = "今天" + parseDateTime();
			var showPhoto = "images/person.jpg";
			if (from.indexOf("@group") > -1) { 
				from = oMsg.getUser();
			}
			var itemPhoto = personPhotoMap.get(from);
			if (itemPhoto != null && itemPhoto != "") { 
				showPhoto = itemPhoto;
			} else { 
				if (from.indexOf("@group") < 0) {
					var photoiq = newJSJaCIQ();
					photoiq.setIQ(from, 'get');
					photoiq.appendNode(photoiq.buildNode('vcard', {
						'xmlns': 'vcard-photo'
					}));
					connWin.con.send(photoiq, flushPhoto, random);
				}
			}
			if (type == 'filetrans') {
				var items = oMsg.getNode().getElementsByTagName('filetrans');
				if (typeof(items) != 'undefined' && items.length > 0) { 
					try{ 
						body = "文件 : "
						var item = items.item(0);
						var attName = item.getElementsByTagName('name').item(0).firstChild.nodeValue;
						var attSize = item.getElementsByTagName('size').item(0).firstChild.nodeValue;
						var fileId = item.getElementsByTagName('id').item(0).firstChild.nodeValue;
						// body = body + attName +" ("+attSize+"KB) ";
						body = body + attName +" ("+attSize+"KB) " + "<span class='downFileBtn' onclick=downLoadFile('"+fileId+"','"+attName+"','file')>下载</span>";
					}catch(e){
						body = "发送了文件";
					}
				} else { 
					body = "发送了文件";
				}
			} else if (type == 'microtalk') {
				body = "发送了语音";
			} else if (type == 'vcard') {
				var items = oMsg.getNode().getElementsByTagName('vcard');
				try {
					var item = items.item(0);
					var iphone = new ArrayList();
					var workPhone = new ArrayList();
					var name = new ArrayList();
					var mobliePhone = new ArrayList();
					var address = new ArrayList();
					name = getChildValue(item,'N');
					mobliePhone = getChildValue(item,'MT');
					iphone = getChildValue(item,'IPH');
					workPhone = getChildValue(item,'WK');
					address = getChildValue(item,'AD');
				 	var vcardStr = "<b style='font-weight: bold;'>名片</b><br/>";
				 	if (name && name.size() > 0) {
	                	vcardStr += addBr("姓名" ,name);
	                }
					if (mobliePhone && mobliePhone.size() > 0) {
						vcardStr += addBr("手机", mobliePhone);
					}
					if (iphone && iphone.size() > 0) {
						vcardStr += addBr("iphone电话", iphone);
					}
					if (address && address.size() > 0) {
						vcardStr += addBr("家庭电话", address);
					}
					if (workPhone && workPhone.size() > 0) {
						vcardStr += addBr("工作电话", workPhone);
					}
					body = vcardStr;
				}catch(e){
					body = "发送了名片";
				}
			} else if (type == 'image') {
				var items = oMsg.getNode().getElementsByTagName('image');
				if (typeof(items) != 'undefined' && items.length > 0) { 
					try{
						var item = items.item(0);
						var attId = item.getElementsByTagName('id').item(0).firstChild.nodeValue;
						var randomImage = Math.floor(Math.random() * 100000000);
						queryShowImgPath(attId,randomImage);
						queryImgPath(attId,randomImage);
						body = "<img src='' name='"+randomImage+"_img' fid='"+attId+"' class='mui-action-preview maxHeight_300' id='"+randomImage+"_img' />";
					}catch(e){
						body = "图片信息";
					}
				} else { 
					body = "图片信息";
				}
			} else {
				body = body;
				for ( var j = 0; j < face_texts_replace.length; j++) {
					body = body.replace(face_texts_replace[j],"<img src='images/face/5_"+(j+1)+".png' width='24px' height='24px' style='min-width:24px;'/>");
				}
			}
			var nowM = new Date().getTime();
			var upM = localStorage.getItem("oldTime");
			var _html = "";
			if($("#chat_list li").length = 0){
				_html += '<li class="cmp-table-view-cell"><div class="uc-chat-date">' + getNewDate() + '</div></li>';
	        }else if($("#chat_list li").length > 0){
	        	if(upM != null && (nowM - upM)/1000 >= 120) {
					_html += '<li class="cmp-table-view-cell"><div class="uc-chat-date">' + getNewDate() + '</div></li>';
				}
	        }
			_html += msgType("4313083234476772638@localhost",type,{body:body});
			$("#chat_list").append(_html);
			chat.refreshPage("#all_chat","#cmp-control",0);
			localStorage.setItem("oldTime", new Date().getTime());
		}
		
		function getChildValue (item,name) {
	   	    var valueList = new ArrayList();
	   		var nodeVal = '';
	        if (item.getElementsByTagName(name).length > 0) {
	            var nameChild = item.getElementsByTagName(name).item(0).firstChild;
	            if (nameChild && typeof(nameChild) != 'undefined') {
	            	nodeVal = nameChild.nodeValue;
	            	var nodeVals = nodeVal.split(",");
	            	for (var i = 0; i < nodeVals.length; i ++) {
	            		valueList.add(nodeVals[i]);
	            	}
	            }
	        }
	        return valueList;
	   	}
		
		function addMessageByIndex(oMsg) { 
			var from = cutResource(oMsg.getFrom());
			var msgObj = $("#msg_list_tab").find("li[id='"+from+"']");
			var unReadCount = 1;
			//先查找
			if (typeof(msgObj) != 'undefined' && msgObj.length > 0) {
				var oldUnReadCount = msgObj.find(".headBadge").attr("unReadCount");
				if (typeof(oldUnReadCount) != "undefined" && oldUnReadCount != "") { 
					unReadCount = unReadCount + parseInt(oldUnReadCount,10);
				}
				//删除原来的
				msgObj.remove();
			}
			var msgType = oMsg.getType();
			var body = oMsg.getBody();
			var showName = "";
			if (msgType == 'filetrans') {
				body = "发送了文件";
			} else if (msgType == 'microtalk') {
				body = "发送了语音";
			} else if (msgType == 'vcard') {
				body = "发送了名片";
			} else if (msgType == 'image') {
				body = "发送了图片";
			} else {
				body = body;
			}
			if (from.indexOf("@group") > -1) {
				showName = oMsg.getGroupname();
				body = oMsg.getName() + ": " + body;
			} else { 
				showName = oMsg.getName();
			}
			var time = oMsg._getAttribute('timestamp');
			if (time != null) { 
				time = hrTime(time);
			} else { 
				time = "今天" + parseDateTime();
			}
			var random = Math.floor(Math.random() * 100000000);
			var showPhoto = "images/person.jpg";
			var itemPhoto = personPhotoMap.get(from);
			if (itemPhoto != null && itemPhoto != "") { 
				showPhoto = itemPhoto;
			} else { 
				if (from.indexOf("@group") < 0) { 
					var photoiq = newJSJaCIQ();
					photoiq.setIQ(from, 'get');
					photoiq.appendNode(photoiq.buildNode('vcard', {
						'xmlns' : 'vcard-photo'
					}));
					connWin.con.send(photoiq, flushPhoto, random);
				}
			}
			if (from == $("#chatBox").attr("senderid")) { 
				//如果已经打开了聊天窗口了
				unReadCount = 0;
			}
			$("#msg_list_tab").prepend(getIndexMsgHtml(from,showName,random,showPhoto,body,time,unReadCount));
		}



	// function getChatCurrentUser(){
	// 	console.log("获取当前登录人的信息");
	//     var iq = newJSJaCIQ();
	//     iq.setIQ(null, 'get');
	//     var query = iq.setQuery('jabber:iq:seeyon:office-auto');
	//     var organization = iq.buildNode('organization', {'xmlns': 'organization:staff:info:query'});
	//     var staff = iq.buildNode('staff', {'dataType': 'json'});
	//     staff.appendChild(iq.buildNode('jid', {'deptid': ''}, jid));
	//     organization.appendChild(staff);
	//     query.appendChild(organization);
	//     connWin.con.send(iq, getCurrentAccount);
	// }
	/**
	 * uc返回当前登录人信息  
	 */
	// function getCurrentAccount(iq){
	// 	console.log("处理当前登录人信息");
	// 	console.log("【打开类型】："+connWin.ucfrom);
	// 	console.log("【FormID】：" + jid);
	// 	console.log("【FromName】:" + currentName);
	// 	console.log("【ToId】：" +sendJid);
	// 	console.log("【ToName】：" +sendName);

	// 	// 添加头像url
	// 	personPhotoMap.put(jid,formUserPhoto);
	// 	personPhotoMap.put(sendJid,toUserPhoto);



	// 	_CurrentUser = initOrgMembers(iq.getNode().getElementsByTagName('staff')).get(0);
		
	// 	// 获取最近聊天记录
	// 	queryTalk();
	// 	// if (typeof(jid) != 'undefined' && jid != "" && jid != null) { 
	// 	// 	$("#uc_left").removeClass("hidden");
	// 	// 	$("#uc_container").css("width","890px");
	// 	// 	// 如果是有用户id的则打开大的窗口，显示人员列表，
	// 	// 	if (connWin.ucfrom == "index") {
	// 	// 		// 如果直接打开聊天窗口，则加载左侧联系人，和相应的聊天消息
	// 	// 		if ("1" != $("#msg_list_tab").attr("load")) { 
	// 	// 			queryTalk();
	// 	// 		}
	// 	// 	} else {
	// 	// 		queryTalk();
	// 	// 		// 如果与指定人聊天打开的窗口，则加载消息的同时，新增或者选中，指定人的聊天窗口
	// 	// 		getNewChatInfoForId(sendJid,sendName);
	// 	// 	}
	// 	// }else{
	// 	// 	$("#uc_left").addClass("hidden");
	// 	// 	$("#uc_container").css("width","610px");
	// 	// 	// 如果是没有用户ID的匿名用户，则只通过id和name创建聊天窗口
	// 	// 	getNewChatInfoForId(sendJid,sendName);
	// 	// }
	// }

	// 通过toid获取与指定人的聊天消息
	function getNewChatInfoForId(sendJid,sendName){
		$("#msg-item").empty();
		$("#chatBox").attr("senderid",sendJid);
		$("#chatBox").attr("sendername",sendName);
		$(".chat_title").text(sendName);
		// appendNewChatList(sendJid,sendName);
		// $("#msgBox").hide();
		// $("#chatBox").slideDown();
		queryHistory(sendJid);
	}

	function appendNewChatListItem(sendJid,sendName){
		var random = Math.floor(Math.random() * 100000000);
		var showPhoto = "images/person.jpg";
		var itemPhoto = personPhotoMap.get(sendJid);
		if (itemPhoto != null && itemPhoto != "") { 
			showPhoto = itemPhoto;
		} 
		$("#msg_list_tab").prepend(getIndexMsgHtml(sendJid,sendName,random,showPhoto,"","",""));
	}
	/**
	 * 从iq协议中解析出人员实体对象封装
	 */
	function initOrgMembers(items){
	    var result = new ArrayList();
	    if (items && items.length > 0) {
	        try {
	        	var item = '';
	        	item = items.item(0).firstChild.nodeValue;
	            var json = null;
	            try {
					eval("json = " + item);
				} catch (e) {
				}
	            var membersJson = json["M"];
	            for (var i = 0; i < membersJson.length; i++) {
	            	var memberJson = membersJson[i];
	            	
	                var member = new OrgMember();
	                member.jid = memberJson['J'];
	                member.memberid = memberJson['I'];
	                member.name = memberJson['N'];
	                member.unitid = memberJson['A'];
	                member.deptid = memberJson['D'];
	                member.postid = memberJson['P'];
	                member.levelid = memberJson['L'];
	                member.unitname = memberJson['AM'];
	                member.deptname = memberJson['DM'];
	                member.postname = memberJson['PM'];
	                member.levelname = memberJson['LM'];
	                member.sex = memberJson['G'];
	                member.mobile = memberJson['Y'];
	                member.telephone = memberJson['T'];
	                member.email = memberJson['E'];
	                member.isinternal = memberJson['W'];
	                member.sortid = parseInt(memberJson['S']);
	                member.online = memberJson['O'];
	                
	                var photo = memberJson['H'];
	                if (photo) {
	                	var re = /&amp;/g; 
	                	member.photo = photo.replace(re,"&");
	                }
	                
	                var mood = memberJson['M'];
	                if (mood) {
	                    member.mood = mood;
	                }
	                
	                result.add(member);
	            }
	        } catch (e) {}
	    }
	    return result;
	}


	/**
	 * 聊天页面获取与某人的最近交流历史
	 */
	function queryHistory (toId) {
		console.log("聊天页面获取与某人的最近交流历史");
		iq = newJSJaCIQ();
		iq.setFrom(jid);
		iq.setIQ(cutResource(toId), 'get', 'history:msg');
		var query = iq.setQuery('history:msg:query');
		query.appendChild(iq.buildNode('begin_time', ''));
		query.appendChild(iq.buildNode('end_time', ''));
		query.appendChild(iq.buildNode('count', '20'));
		connWin.con.send(iq, showHistotyMessage);
	}

		/**
		 * uc 返回与某人的聊天记录 queryHistory 方法的返回值
		 * youhb
		 * @param {Object} iq
		 * 2015年7月3日15:00:12
		 */
		function showHistotyMessage(iq) {
			console.log("uc 返回与某人的聊天记录 queryHistory 方法的返回值");
			var messages = initMessageByIq(iq);
			messages = endArraybyIndex(messages);
			console.log(messages);
			for (var i = messages.length - 1;i >= 0;i --) {
				var random = Math.floor(Math.random() * 100000000);
				var _html = "";
				 var item = messages[i];
	             if (typeof(item) == "undefined") {
	                continue;
	             }
	             var body = item.body;
	             var datetime = hrTime(item.time);
	             var nowM,upM;
	             if(messages[i+1]){
	             	nowM = getMillisecond(messages[i].time);
	             	upM = getMillisecond(messages[i+1].time);
	             }
	             var type = item.type;
	             var showPhoto = "images/person.jpg";
	             var itemPhoto = personPhotoMap.get(item.from);
				 if (itemPhoto != null && itemPhoto != "") { 
					 showPhoto = itemPhoto;
				 } else {
				 	if (item.from.indexOf("@group") < 0) { 
						var photoiq = newJSJaCIQ();
						photoiq.setIQ(item.from, 'get');
						photoiq.appendNode(photoiq.buildNode('vcard', {
							'xmlns': 'vcard-photo'
						}));
						connWin.con.send(photoiq, flushPhoto, random);
				 	}
				 }
				 if (type == 'filetrans') {
				 	body = "文件 : ";
				 	for(var k = 0 ; k < item.files.length ;k++){ 
				 		body = body + item.files[k].fileName +" ("+item.files[k].size+"KB) " + "<span class='downFileBtn' onclick=downLoadFile('"+item.files[k].fileId+"','"+item.files[k].fileName+"','file')>下载</span>";
				 	}
				 } else if (type == 'microtalk') {
					body = "发送了语音";
				 } else if (type == 'vcard') {
				 	var vcard = item.vcard;
				 	var vcardStr = "<b style='font-weight: bold;'>名片</b><br/>";
				 	if (vcard && vcard.name != '') {
	                	vcardStr += addBr("姓名" ,vcard.name);
	                }
					if (vcard && vcard.mobliePhone != '') {
						vcardStr += addBr("手机", vcard.mobliePhone);
					}
					if (vcard && vcard.iphone != '') {
						vcardStr += addBr("iphone电话", vcard.iphone);
					}
					if (vcard && vcard.address != '') {
						vcardStr += addBr("家庭电话", vcard.address);
					}
					if (vcard && vcard.workPhone != '') {
						vcardStr += addBr("工作电话", vcard.workPhone);
					}
					body = vcardStr;
				 } else if (type == 'image') {
					if (item.files.length > 0) { 
						// var randomImage = Math.floor(Math.random() * 100000000);
						// queryShowImgPath(item.files[0].fileId,randomImage);
						// queryImgPath(item.files[0].fileId,randomImage);
						// body = "<img src='' name='"+randomImage+"_img' fid='"+item.files[0].fileId+"' class='mui-action-preview maxHeight_300' id='"+randomImage+"_img' />";
					} else { 
						body = "发送了图片";
					}
				 } else {
				 	// 将表情替换成图片，并赋值给item.body
				 	body = body;
					for ( var j = 0; j < face_texts_replace.length; j++) {
					    body = body.replace(face_texts_replace[j],"<span class=\"show-emoji-5-" + (j + 1 ) +"\"></span>");
					}
					item.body = body;
				 }
				// 第一条消息要显示时间
				if(i === messages.length - 1){
					_html += '<li class="cmp-table-view-cell"><div class="uc-chat-date">'+datetime+'</div></li>';
				}
				// 当前消息和上一条消息的时间差超过2分钟，显示时间
				if((nowM - upM)/1000 >= 120) {
					_html += '<li class="cmp-table-view-cell"><div class="uc-chat-date">'+datetime+'</div></li>';
				}
				 _html += msgType("4313083234476772638@localhost",type,item);
				 $("#chat_list").append(_html);
			}
			chat.refreshPage("#all_chat","#cmp-control",0);
		}


	/**
	 * 获取最新聊天信息
	 */
	function queryTalk () { 
		console.log("获取最新聊天消息");
		iq = newJSJaCIQ();
		iq.setIQ(jid, 'get');
		var query = iq.setQuery('recently:msg:query');
		query.appendChild(iq.buildNode('begin_time'));
		query.appendChild(iq.buildNode('type', ""));
		query.appendChild(iq.buildNode('end_time'));
		query.appendChild(iq.buildNode('count', '', '10'));
		connWin.con.send(iq, cacheCommunication, true);
	}



	/**
	 * uc返回最近聊天对象xml 页面显示渲染
	 */
	function cacheCommunication(iq) { 
		console.log("uc返回最近聊天");
		$("#msg_list_tab").empty();
		var messageArray = initMessageByIq(iq);
		messageArray = endArraybyIndex(messageArray);

		console.log("返回最近聊天:");
		console.log(messageArray);
		// for ( var i = 0; i < messageArray.length; i++) { 
		// 	var random = Math.floor(Math.random() * 100000000);
		// 	var items = messageArray[i];
		// 	var itemid = "";
		// 	var type = items.type;
		// 	var body = items.body;
		// 	var sendTo = items.to;
		// 	var sendFrom = items.from;
		// 	var showName = items.name;
		// 	var showPhoto = "images/person.jpg";
		// 	if (type == 'filetrans') {
		// 		body = "发送了文件";
		// 	} else if (type == 'microtalk') { 
		// 		body = "发送了语音";
		// 	} else if (type == 'vcard') { 
		// 		body = "发送了名片";
		// 	} else if (type == 'image') { 
		// 		body = "发送了图片";
		// 	} else {
		// 		body = body;
		// 	}
		// 	if (sendTo.indexOf('@group') > 0) { 
		// 		if (sendFrom != jid) { 
		// 			body = items.name+": " + body;
		// 		}
		// 		showName = items.groupname;
		// 		itemid = sendTo;
		// 	} else if (sendFrom.indexOf('@group') > 0) { 
		// 		body = items.name+": " + body;
		// 		showName = items.groupname;
		// 		itemid = sendFrom;
		// 	} else { 
		// 		if (sendFrom == jid) {
		// 			showName = items.toname;
		// 			itemid = sendTo;
		// 		} else {
		// 			showName = items.name;
		// 			itemid = sendFrom;
		// 		}
		// 		var itemPhoto = personPhotoMap.get(itemid);
		// 		if (itemPhoto != null && itemPhoto != "") { 
		// 			showPhoto = itemPhoto;
		// 		} else { 
		// 			if (itemid.indexOf("@group") < 0) { 
		// 				var photoiq = newJSJaCIQ();
		// 				photoiq.setIQ(itemid, 'get');
		// 				photoiq.appendNode(photoiq.buildNode('vcard', {
		// 						'xmlns' : 'vcard-photo'
		// 				}));
		// 				connWin.con.send(photoiq, flushPhoto, random);
		// 			}
		// 		}
		// 	}
		// 	$("#msg_list_tab").append(getIndexMsgHtml(itemid,showName,random,showPhoto,body,hrTime(items.time),"0"));
		// }
		// $("#msg_list_tab").attr("load","1");
		// 当直接打开聊天窗口时，选中第一个人聊天
		if (connWin.ucfrom == "index"){
			openNewChat($("#msg_list_tab").find("li:first").attr("id"));
		}else{
			var msgObj = $("#msg_list_tab").find("li[id='"+sendJid+"']");
			//先查找
			if (typeof(msgObj) != 'undefined' && msgObj.length > 0) { 
				openNewChat(sendJid);
			}else{
				appendNewChatListItem(sendJid,sendName);
			}
		}
		$("#msg_list_tab").find("li:first").addClass("current");
	}


	// 发送消息
	function sendMessage(imgPath) { 
		// var senderid = $("#chatBox").attr("senderid");
		// var itemname = $("#chatBox").attr("sendername");
		var senderid = "2380826758543920147@localhost";
		var itemname = "3";
		var textBox = $("#uc-input-text");
		var chatId = cmp.buildUUID();
		
		// if (deleteUserMap.get(senderid)) {
		if (typeof(senderid) == 'undefined' || senderid == "" || senderid == null) {
			alert("该人员已不存在无法发起交流");
			textBox.val("");
			return ;
		}
		// 发送的消息内容
		// var sendText = "李四发送的消息" + datenow;
		var sendText = $("#uc-input-text").val();
		// 从页面获取到需要发送的内容
		var today=new Date();
		var h=today.getHours();
		var m=today.getMinutes();
		var s=today.getSeconds();
		var datenow = h+':'+m+":"+s;

		var nowM = new Date().getTime();
        var upM = localStorage.getItem("oldTime");
		var _html = "";
		if($("#chat_list li").length = 0){
			_html += '<li class="cmp-table-view-cell"><div class="uc-chat-date">' + getNewDate() + '</div></li>';
        }else if($("#chat_list li").length > 0){
        	if(!upM){
        		_html += '<li class="cmp-table-view-cell"><div class="uc-chat-date">' + getNewDate() + '</div></li>';
        	}else if(upM != null && (nowM - upM)/1000 >= 120){
        		_html += '<li class="cmp-table-view-cell"><div class="uc-chat-date">' + getNewDate() + '</div></li>';
        	}
        }

		// 发送文本消息
		if (sendText != "" && sendText.length > 0) { 
			for (var i = 0 ; i < face_titles_replace.length ; i ++) { 
				sendText = sendText.replace(face_titles_replace[i] , "[5_" + parseInt((i + 1),10) + "]");
			}
			var showText = sendText;
			for (var j = 0; j < face_texts_replace.length; j++) {
				showText = showText.replace(face_texts_replace[j], "<span class=\"show-emoji-5-" + (j + 1 ) +"\"></span>");
			}
			
			var data = {from:"4313083234476772638@localhost",body:showText}
			_html += msgType("4313083234476772638@localhost","chat",data,chatId);
			textBox.val("");
			console.log(showText);

			var aMessage = newJSJaCMessage();
			if(senderid.indexOf('@group')>=0){
				aMessage.setType('groupchat');
			} else { 
				aMessage.setType('chat');
			}
			localStorage.setItem("oldTime", new Date().getTime());
			aMessage.setFrom(jid);
			aMessage.setTo(senderid);
			aMessage.setBody(sendText);
			aMessage.setName(currentName);
			aMessage.appendNode(aMessage.buildNode('toname',itemname));
			connWin.con.send(aMessage);
		}
		else if(imgPath && imgPath != null){// 发送图片
			var data = {from:"4313083234476772638@localhost",src:imgPath}
			_html += msgType("4313083234476772638@localhost","image",data,chatId);
		}
		$("#chat_list").append(_html);

		if(imgPath && imgPath != null){
            $ucChatToolsFunction.initPic();
		}
		chat.refreshPage("#all_chat","#cmp-control",0);
		return chatId;
	}

	function getNewDate() { 
		var _date = new Date();
		var _y = _date.getFullYear();
		var _m = _date.getMonth() + 1;
		var _d = _date.getDate();
		var _h = _date.getHours();
		var _min = _date.getMinutes();
		var _s = _date.getSeconds();
		if (parseInt(_h) < 10) {
			_h = "0" + _h;
		}
		if (parseInt(_min) < 10) {
			_min = "0" + _min;
		}
		if (parseInt(_s) < 10) {
			_s = "0" + _s;
		}
		return _h + ':' + _min;
	}
	function hrTime(ts) {
		try{
		    var messageYear = ts.substr(0,ts.indexOf('T')).split('-')[0];
		    var messagemounth = ts.substr(0,ts.indexOf('T')).split('-')[1];
		    var messageDate = ts.substr(0,ts.indexOf('T')).split('-')[2];
		    if(messageDate.substr(0,1) == '0'){
		    	messageDate = messageDate.substr(1);
		    }
		    var year = new Date().getFullYear();
		    var mounth = new Date().getMonth() +1;
		    var date = new Date().getDate();
		    // if(year == messageYear ){
		    	var ts1 = ts.substr(0,ts.indexOf('.'));
		    	if(date == messageDate && mounth == messagemounth){
		    		return  ts1.substr(ts.indexOf('T')+1).slice(0,-3);
		    	}else if (parseInt(date)-1 == parseInt(messageDate) && mounth == messagemounth){
		    		return  "昨天"+ ts1.substr(ts.indexOf('T')+1).slice(0,-3);
		    	}else{
		    		return messageYear + "-" + messagemounth + "-" + messageDate + " " + ts1.substr(ts.indexOf('T')+1).slice(0,-3);
		    	}
		    // }else{
		    // 	return jab2date(ts).toLocaleString();
		    // }		
		}catch(e){
			console.log(e);
		}
	}
	function getMillisecond(ts) {
		try{
		    var year = ts.substring(0,ts.indexOf('T')).split('-')[0];
		    var mounth = ts.substring(0,ts.indexOf('T')).split('-')[1];
		    var date = ts.substring(0,ts.indexOf('T')).split('-')[2];
		    var h = ts.substring(ts.indexOf('T')+1,ts.indexOf('.')).split(":")[0];
		    var minute = ts.substring(ts.indexOf('T')+1,ts.indexOf('.')).split(":")[1];
		    var s = ts.substring(ts.indexOf('T')+1,ts.indexOf('.')).split(":")[2];
		    if(date.substring(0,1) == '0'){
		    	date = date.substring(1);
		    }	
		    return Date.UTC(year,mounth,date,h,minute,s);
		}catch(e){
			console.log(e);
		}
	}

	function getFace() { 
		var faceArray = new Array();
		for (var i = 1 ; i < 32; i ++) {
			 var faceItem = { 
				 faceName : face_titles[i-1],
				 facePath : "5_" + i + ".gif"
			 }
			 faceArray[i-1] = faceItem;
		}
		return faceArray;
	}
	
	function faceInit () { 
		$(".input-text").on("focus",function() { 
			isShowImg = false;
			$(".faceDiv").css("height","0px");
		});
		var facePath = getFace();
		if ($(".faceDiv").children().length == 0) {
			for (var i = 0; i < facePath.length; i++) {
				$(".faceDiv").append("<img title=\"" + facePath[i].faceName + "\" src=\"images/face/" + facePath[i].facePath + "\" />");
			}
			$(".faceDiv>img").click(function() {
				isShowImg = false;
				$(".faceDiv").animate({
					height: "0px"
				}, 300);
				insertAtCursor($(".input-text")[0], $(this).attr("title"));
				$(".input-text").blur();
			});
		};
		
		$("#msg-image").click(function(event) {
			if (isShowImg == false) {
				isShowImg = true;
				$(".faceDiv").css("height","0px");
				if (document.body.clientHeight < clientHeight) { 
					setTimeout(function () { 
						$(".faceDiv").animate({
							height: "200px"
						}, 300);
					},300);
				} else { 
					$(".faceDiv").animate({
						height: "200px"
					}, 300);
				}
			} else {
				isShowImg = false;
				$(".faceDiv").animate({
					height: "0px"
				}, 300);
			}
			event.stopPropagation();
		});
		$("body").click(function(){
				isShowImg = false;
				$(".faceDiv").animate({
					height: "0px"
				}, 300);
		});

		$("#msg_list_tab").on("click","li",function(){
			$(this).addClass("current");
			$(this).siblings().removeClass("current");
		})

		$("#msg-history").click(function(){
			console.log($("#uc_right").css("display")=="none");
			if ($("#uc_right").css("display")=="none") {
				$("#uc_right").removeClass("hidden");
				$("#uc_container").css("width","1190px");
				window.resizeTo(1210,610);
			} else {
				$("#uc_right").addClass("hidden");
				$("#uc_container").css("width","890px");
				window.resizeTo(910,610);
			}
			var sendJid = $("#chatBox").attr("senderid");
			getHisMessage(sendJid,"","");
		})

	}

	function insertAtCursor(myField, myValue) { 
		if (document.selection) {
		    myField.focus();
		    sel = document.selection.createRange();
		    sel.text = myValue;
		    sel.select();
		} else if (myField.selectionStart || myField.selectionStart == "0") {
		    var startPos = myField.selectionStart;
		    var endPos = myField.selectionEnd;
		    var restoreTop = myField.scrollTop;
		    myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length);
			if (restoreTop > 0) {
			    myField.scrollTop = restoreTop;
			}
			myField.focus();
		    myField.selectionStart = startPos + myValue.length;
		    myField.selectionEnd = startPos + myValue.length;
		 } else {
		    myField.value += myValue;
		    myField.focus();
		 }
	}

	function endArraybyIndex(array) {
		var array1 = new Array();
		var k = 0;
		for ( var i = array.length - 1; i >= 0; i--) {
			array1[k] = array[i];
			k++;
		}
		return array1;
	}


/**
 * 打开与某人的聊天页签
 */
function openNewChat(itemid) {
	$("#uc_right").addClass("hidden");
	$("#uc_container").css("width","890px");
	window.resizeTo(910,610);
	console.log("打开与某人的聊天页签");
	if (deleteUserMap.get(itemid)) { 
		alert("该人员已不存在无法发起交流");
		return ;
	}
	imgSliderArray = new ArrayList();
	var countObj = $("li[id='"+itemid+"']").find(".headBadge");
	if (typeof(countObj) != "undefined" &&countObj.length > 0) { 
		  countObj.attr("unReadCount","0");
		  countObj.text("0");
		  countObj.hide();
	}
	$("#msg-item").empty();
	var itemname = $("li[id='"+itemid+"']").attr("itemname");
	$("#chatBox").attr("senderid",itemid);
	$("#chatBox").attr("sendername",itemname);
	$(".chat_title").text(itemname);
	sendJid = itemid;
	sendName = itemname;
	// $("#msgBox").hide();
	// $("#chatBox").slideDown();
	console.log("打开与某人的聊天页签end");
	queryHistory(itemid);
}

	// function flushPhoto(iq,memberId) { 
	// 	var photo = "images/person.jpg";
	// 	var item = iq.getNode().getElementsByTagName('photo').item(0);
	// 	if (item && item.firstChild) {
	// 		photo = item.firstChild.nodeValue;
	// 	}
	// 	personPhotoMap.put(iq.getFrom(),photo);
	// 	$('#' + memberId + 'Img').attr("src", photo);
	// }
	function flushPhoto(userId,photoUrl) { 
		if (typeof(photoUrl) != 'undefined' && photoUrl != "" && photoUrl != null) {
			personPhotoMap.put(userId,photoUrl);
		}
	}

	/**
	 * 通过参数获取最近交流页面生成的html用于来新消息和获取全部消息
	 * @param {Object} from 来自谁
	 * @param {Object} showName 显示的名称
	 * @param {Object} random 头像生成的随机数
	 * @param {Object} showPhoto 显示的头像如果本地没有就是默认头像
	 * @param {Object} body 聊天的正文内容
	 * @param {Object} time 时间
	 * @param {Object} unReadCount 为读数
	 * @return contentHtml 返回拼装好的html
	 */
	function getIndexMsgHtml (from,showName,random,showPhoto,body,time,unReadCount) { 
		for ( var j = 0; j < face_texts_replace.length; j++) {
			 body = body.replace(face_texts_replace[j],"<img src='images/face/5_"+(j+1)+".png' width='15px' height='15px' style='min-width:15px;'/>");
		}
		var contentHtml = "";
		contentHtml += '<li id="' + from + '" itemname="' + showName + '">';
		contentHtml += "<a href=\"javaScript:openNewChat('" + from + "')\">";
		contentHtml += '<img id="' + random + 'Img" class="personImg" src="' + showPhoto + '">';
		var hiddenClass = "hidden";
		if (typeof(unReadCount) == 'undefined' || unReadCount == "") { 
			unReadCount = "0";
		}
		if (parseInt(unReadCount,10) > 0) {
			hiddenClass = "";
		}
		var showReadCount = unReadCount;
		if (parseInt(unReadCount,10) > 99) { 
			showReadCount = "99+";
		}
		contentHtml += '<span class="unreadcountBox"><em unReadCount="'+unReadCount+'" class="headBadge '+hiddenClass+'">'+showReadCount+'</em></span>';
		contentHtml += '<div class="msg_list_body"><span class="msg_list_content">' + showName + '</span>';
		contentHtml += '<p class="msg_list_ellipsis">' + body + '</p>';
		contentHtml += '<p class="msg_list_time">' + time + '</p>';
		contentHtml += '</div></a></li>';
		return contentHtml;
	}

	/**
	 * 将图片添加入查看大图队列
	 * @param {Object} tagger 图片name的随机数
	 */
	function viewImg (tagger) { 
		var imgs = document.getElementsByName(tagger+"_img");
		imgs = mui.slice.call(imgs);
		imgSliderArray.add(tagger);
		if(imgs&&imgs.length>0){
			imgs.forEach(function (value,index,array) {
				value.removeEventListener("tap");
				value.addEventListener('tap', function() {
					slider.style.display = "block";
					_slider.refresh();
					_slider.gotoItem(imgSliderArray.size() -1, 0);
				})
				var item = document.createElement("div");
				item.classList.add("mui-slider-item");
				var a = document.createElement("a");
				var img = document.createElement("img");
				img.setAttribute("src",value.getAttribute("viewSrc"));
				a.appendChild(img);
				item.appendChild(a);
				slider_group.appendChild(item);
			});
			slider.appendChild(slider_group);
			_slider = mui(slider).slider();
		}
	}

	/**
	 * 从uc获取图片大图的路径
	 * @param {Object} fid 图片id
	 * @param {Object} tagger 页面生成的图片id随机数用户获取完成后加载图片
	 */
	// function  queryImgPath (fid,tagger) {
	// 	var iqs = newJSJaCIQ();
	// 	iqs.setFrom(jid);
	// 	iqs.setIQ('filetrans.localhost', 'get');
	// 	var query1 = iqs.setQuery('filetrans');
	// 	query1.setAttribute('type' ,'get_picture_download_url');
	// 	query1.appendChild(iqs.buildNode('id', '', fid));
	// 	connWin.con.send(iqs, showImgFun,tagger);
	// }
	/**
	 * queryImgPath 方法的返回值方法  主动执行 返回大图路径
	 * @param {Object} iq //返回协议的xml对象
	 * @param {Object} tagger//图片对象的随机数
	 */
	// function showImgFun (iq,tagger) {
	// 	if (iq && iq.getType() != 'error') {
	// 		var url = iq.getNode().getElementsByTagName('downloadurl')[0].firstChild.data;
	// 		$("#"+ tagger + "_img").attr("viewSrc",url);
	// 		viewImg(tagger);
	// 	}
	// }
	
	// function queryShowImgPath(fid, tagger) {
	// 	var iqs = newJSJaCIQ();
	// 	iqs.setFrom(jid);
	// 	iqs.setIQ('filetrans.localhost', 'get');
	// 	var query1 = iqs.setQuery('filetrans');
	// 	query1.setAttribute('type', 'get_picture_download_url');
	// 	query1.appendChild(iqs.buildNode('id', '', fid + "_1"));
	// 	connWin.con.send(iqs, showImgFunByIm, tagger);
	// }
	// function showImgFunByIm(iq, tagger) {
	// 	if (iq && iq.getType() != 'error') {
	// 		var url = iq.getNode().getElementsByTagName('downloadurl')[0].firstChild.data;
	// 		document.getElementById(tagger + "_img").src = url;
	// 	}
	// }
	
	function addBr(name, nodeList) {
		var htmlStr = '';
		if (nodeList != null && nodeList.size() > 0) {
			for (var i = 0; i < nodeList.size(); i++) {
				var showName = name;
				htmlStr += showName + ":" + nodeList.get(i).getLimitLength(11,"...") + "<br/>";
			}
		}
		return htmlStr;
	}


// 文件下载
function downLoadFile(fid,fname,type){
	downFilePath(fid,fname,connWin.con,parent.window.opener,type);
}


function openChatForOldWin(formtype,formId,fromName,formUserPhoto,toId,toName,toUserPhoto){
	// $()
	console.log(formId);
	console.log(fromName);
	console.log(formUserPhoto);
	console.log(toId);
	console.log(toName);
	console.log(toUserPhoto);

	if (formtype != "chat") {
		// if (Uc_Chat_Win != null && Uc_Chat_Win.opener != null) {}
		alert("聊天窗口已打开");
	} else {
		var msgObj = $("#msg_list_tab").find("li[id='"+toId+"']");
		// 如果需要的打开的聊天窗口已存在，则选中，
		if (typeof(msgObj) != 'undefined' && msgObj.length > 0) {
			msgObj.click();
			openNewChat(toId);
			window.focus();
		}else{
		// 如果没有，则添加
		console.log("新添加");
			
		}

	}

	// 添加头像url
	personPhotoMap.put(formId,formUserPhoto);
	personPhotoMap.put(toId,toUserPhoto);
}


// 历史纪录
        /********************历史记录********************/
        var messgaeMap;
        var totalPage = 0;
        var startNum = 0;
        var endNum = 0;
        var currentPage = 1;
        var _toID = '';
		var isShowStartPage = false;
        var startLimeTime = null;
        var endLimeTime = null;

        function getHisMessage(toId,startTime,endTime){
            _toID = toId;
            startLimeTime = startTime;
            endLimeTime  = endTime;
            // iq = window.opener.newJSJaCIQ();
            iq = window.newJSJaCIQ();
            iq.setFrom(jid);
            iq.setIQ(cutResource(toId), 'get', 'history:msg');
            var query = iq.setQuery('history:msg:query');
            query.appendChild(iq.buildNode('begin_time',startTime));
            query.appendChild(iq.buildNode('end_time',endTime));
            query.appendChild(iq.buildNode('count', '100'));
            connWin.con.send(iq, showHistMessage,true);
        }
        
        /**
         * 初始化历史记录总页数，数据缓存
         */
        function showHistMessage(iq,iscount){
            var flag = false;
            //缓存总记录数
            if(iscount){
            	if (iq.getNode().getElementsByTagName('totalnum').length != 0) {
            			count = iq.getNode().getElementsByTagName('totalnum')[0].firstChild.nodeValue;
                  	  	var intCount = parseInt(count);
                    	if (intCount % 20 == 0) {
                        	totalPage = parseInt(intCount / 20);
                    	}
                    	else {
                        	totalPage = parseInt(intCount / 20 + 1);
                    	}
                   		currentPage = totalPage;
                   		flag = true;
            	}
            }
            _toID = iq.getFrom();
            var messages = initMessageByIq(iq);
            messages = endArray(messages);
            initHistMessage(messages, flag);
        }

        function endArray(array){
            var array1 = new Array();
            var k = 0;
            for (var i = array.length - 1; i >= 0; i--) {
                array1[k] = array[i];
                k++;
            }
            return array1;
        }



/**
 * 缓存历史记录
 */
function initHistMessage(messages, flag){
	
    if (flag) {
        endNum = totalPage;
    }
    messgaeMap = new Properties();
    if (messages.length % 20 == 0) {
        leng = parseInt(messages.length / 20);
    }
    else {
        leng = parseInt(messages.length / 20 + 1);
    }
    startNum = endNum - leng + 1;
    var b = startNum + 1;
    if (b <= 1) {
        b = 2;
    }
    //计算最后一页改显示的内容
	
    var nums = startNum;
    if (nums <= 0) {
        nums = 1;
    }
	var g = 0; 
    var isShow = true;
    if (messages.length % 20 != 0) {
        messgaeMap.put(nums, messages.slice(0, messages.length % 20));
        isShow = false;
    }
    else {
        messgaeMap.put(nums, messages.slice(0, 20));
    }
    var s = 1;
	
    for (var i = endNum; i >= startNum; i--) {
        var array = new Array();
        var j = 0;
        if (!isShow) {
            j = messages.length % 20;
            isShow = true;
        }
        else {
			if (g == 0) {
				j = s * 20;
			}else{
				j = g;
			}
        }
        g = j + 20;
        if (g > messages.length) {
            g = messages.length;
        }
        s++;
        j = parseInt(j);
        g = parseInt(g);
        messgaeMap.put(b, messages.slice(j, g));
        b++;
    }
	
    if(isShowStartPage){
	console.log(startNum);
		addHistorys(startNum);
		isShowStartPage = false;
	}else{
	console.log(endNum);
		addHistorys(endNum);
	}
}

/**
 * 设置聊天消息记录
 */
function addHistorys(num){
	console.log(num);
    currentPage = num;
    var items = messgaeMap.get(currentPage);
    console.log(items.length);
	var lengths = 0;
	try {
		lengths = items.length;
	}catch(e){
		lengths = 0;
	}
	
    $('#historytabbodytop').empty();
    var strTemp = "";
    for (var i = 0; i < lengths; i++) {

        var item = items[i];
        if (typeof(item) == "undefined" || item.type == "cancel_chat_re") {
        	continue;
        }
        var body = item.body;
        for (var j = 0; j < face_texts_replace.length; j++) {
            body = body.replace(face_texts_replace[j],"<img src='images/face/5_"+(j+1)+".png' width='24px' height='24px' style='min-width:24px;'/>");
        }
        var datetime = hrTime(item.time);
        var type = item.type;
        strTemp += "<div class='border_b padding_b_5 padding_t_5 font_size12 clearfix'>";
        strTemp += "<ul>";
        strTemp += "<li class='padding_0'>";
        strTemp += "<div><span class='color_gray margin_l_5'>" + item.name + "</span><span class='color_gray margin_r_5 margin_l_5'>" + datetime + "</span>";
        strTemp += "</div>";
    	if(type == 'filetrans'){    		
    		 var str ="";
    		 var _type = "file";
             for(var k = 0 ; k < item.files.length ;k++){
           	  str+="<span class ='"+querySpanClass(item.files[k].fileName)+"' style='cursor: default;'></span><font size ='2px'>"+item.files[k].fileName +"("+item.files[k].size+"KB)&nbsp;&nbsp;&nbsp;<a href='#'  id='12232' fid='"+item.files[k].fileId+"''  fname = '"+item.files[k].fileName+" 'onclick='downLoadFile(\""+item.files[k].fileId+"\", \""+item.files[k].fileName+"\", \""+_type+"\")'>下载</a> </font><br/>";
             }
             var fileNames ='';
             if(body.length > 0 && body != ''){
            	 body = body + "<br/>";
             }
             strTemp += "<div class='margin_t_10 word_break_all' style='margin-left:5px;word-wrap:break-word'><span class='font_size12'>" + body + fileNames+str + "</span></div>";
        }else{
        	strTemp += "<div class='margin_t_10 word_break_all' style='margin-left:5px;word-wrap:break-word'><span class='font_size12'>" + body + "</span></div>";
        }
      

        strTemp += "</li>";
        strTemp += "</ul>";
        strTemp += "</div>";
    }
    console.log(strTemp);
    $('#historytabbodytop').append(strTemp);
    $("#historytabbody").scrollTop($("#historytabbodytop")[0].scrollHeight);
    //分页
    $('#historytabbodybottom').empty();

    var x = startNum;
    if (x == 0) {
        x = 1;
    }

    var htmlstr = "";
    //在ie7低分辨率下因为不出滚动条，所以如果按照 padding_t_10 就会使分页整体下移
	htmlstr+="<div class='common_over_page right margin_r_10 padding_t_3 padding_r_5'>";

	if(startNum > 1){
    }else{
	}
	if(currentPage > 1){

		htmlstr+="<a href='#' class='common_over_page_btn' title='上一页' onclick='javaScript:pageTurning(" + 2 + ")'><em class='pagePrev'></em></a>";
	}else{

	}
	htmlstr += "&nbsp;";

	if(endNum - x < 5){
		var c = 5-endNum - x;
		for(var g = 0; g < c; g++){
			htmlstr += "&nbsp;&nbsp;";
		}
	}

	for (var x; x <= endNum; x++) {
        if (x == currentPage) {
console.log(x);
            htmlstr += "<u>"+x + "</u>&nbsp;";
        }
        else {
console.log(x);
            htmlstr += "<a href='#' onclick='javaScript:addHistorys(" + x + ")'>" + x + "</a>&nbsp;";
        }
    }

	if(currentPage < totalPage){

		htmlstr+="<a href='#' class='common_over_page_btn' title='下一页' onclick='javaScript:pageTurning(" + 3 + ")'><em class='pageNext'></em></a>";
   	}else{

	}
	if(endNum < totalPage){

	}else{

	}
	 htmlstr +=  totalPage + "页";

	htmlstr+="</div>";
	console.log(htmlstr);
    $('#historytabbodybottom').append(htmlstr);
    var ex = document.getElementById("historytabbodytop"); 
    ex.scrollTop = ex.scrollHeight; 
}

/**
 * 翻页操作
 */
function pageTurning(actions){
	try{ //异常处理 ，防止后台请求总数据条数不为0 ，而数据为空时翻页报错
		 if (actions == 1) {//向后翻页
             getA8Top().startProc();
             var endMessage = messgaeMap.get(endNum);
             var endMessage1 = messgaeMap.get(endNum);
             var mes = endMessage[endMessage.length - 1];
             iq = window.opener.newJSJaCIQ();
             iq.setFrom(window.opener.parent.jid);
             iq.setIQ(_toID, 'get', 'history_msg2');
             var query = iq.setQuery('history:msg:query');
             query.appendChild(iq.buildNode('begin_time', mes.time));
             query.appendChild(iq.buildNode('end_time'));
             if (startLimeTime != null && endLimeTime != null) {
                query.appendChild(iq.buildNode('limit_begin_time', startLimeTime));
                query.appendChild(iq.buildNode('limit_end_time', endLimeTime));
             }
             query.appendChild(iq.buildNode('count', '100'));
             endNum = endNum + 5;
				if(endNum > totalPage){
					endNum = totalPage;
				}
				connWin.con.send(iq, showHistMessage,false);
         }
         else if(actions == 0) {//向前翻页
             getA8Top().startProc();
             endNum = startNum - 1;
             var endMessage = messgaeMap.get(startNum);
             var mes = endMessage[0];
             iq = window.opener.newJSJaCIQ();
             iq.setFrom(window.opener.parent.jid);
             iq.setIQ(_toID, 'get', 'history_msg1');
             var query = iq.setQuery('history:msg:query');
             query.appendChild(iq.buildNode('begin_time'));
             query.appendChild(iq.buildNode('end_time',mes.time));
             if (startLimeTime != null && endLimeTime != null) {
                query.appendChild(iq.buildNode('limit_begin_time', startLimeTime));
                query.appendChild(iq.buildNode('limit_end_time', endLimeTime));
             }
             query.appendChild(iq.buildNode('count', '100'));
             connWin.con.send(iq, showHistMessage,false);
             
         }
			else if(actions == 3){//后一页
				var pageCont = currentPage + 1;
				var endMessage = messgaeMap.get(pageCont);
				if(endMessage.length > 0){
					addHistorys(pageCont);
				}else{
					pageTurning(1);
					isShowStartPage = true;
				}
				
			}else if(actions == 2){//前一页
				var pageCont = currentPage - 1;
				var endMessage = messgaeMap.get(pageCont);
				try {
					if (endMessage.length > 0) {
						addHistorys(pageCont);
					}
					else {
						pageTurning(0);
					}
				}catch(e){
					pageTurning(0);
				}
			}
	}catch(e){
		
	}
}

var spanSpanClassMap = new Properties();
spanSpanClassMap.put('.avi','ico16 music_16');
spanSpanClassMap.put('.mp4','ico16 music_16');
spanSpanClassMap.put('.rmvb','ico16 music_16');
spanSpanClassMap.put('.mp3','ico16 music_16');
spanSpanClassMap.put('.flv','ico16 music_16');
spanSpanClassMap.put('.awr','ico16 music_16');
spanSpanClassMap.put('.wav','ico16 music_16');
spanSpanClassMap.put('.wav','ico16 music_16');
spanSpanClassMap.put('.pdf','ico16 pdf_16');
spanSpanClassMap.put('.ppt','ico16 ppt_16');
spanSpanClassMap.put('.pptx','ico16 ppt_16');
spanSpanClassMap.put('.doc','ico16 wps_16');
spanSpanClassMap.put('.docx','ico16 wps_16');
spanSpanClassMap.put('.xlsx','ico16 export_excel_16');
spanSpanClassMap.put('.xls','ico16 export_excel_16');
spanSpanClassMap.put('.txt','ico16 txt_16');
spanSpanClassMap.put('.jpg','ico16 images_16');
spanSpanClassMap.put('.bmp','ico16 images_16');
spanSpanClassMap.put('.gif','ico16 images_16');
spanSpanClassMap.put('.png','ico16 images_16');
spanSpanClassMap.put('.exe','ico16 exe_16');
spanSpanClassMap.put('.rar','ico16 rar_16');
spanSpanClassMap.put('.zip','ico16 rar_16');
spanSpanClassMap.put('.other','ico16 file_16');
function querySpanClass(fieName){
	var strs = fieName.split('.');
	var neStr = "."+strs[strs.length-1];
	var spancClass = spanSpanClassMap.get(neStr);
	if(!spancClass){
		spancClass = spanSpanClassMap.get('.other');
	}
	return spancClass;
} 