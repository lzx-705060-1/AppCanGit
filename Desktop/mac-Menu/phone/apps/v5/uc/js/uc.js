/**
 * description: 致信模块 
 * author: fut
 * createDate: 2017-03-17
 */
(function(global, factory) {
    //
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = global.document ?
            factory(global, true) :
            function(w) {
                if (!w.document) {
                    throw new Error("uc requires a window with a document");
                }
                return factory(w);
            };
    } else {
        factory(global);
    }

    // Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function(window) {

    var uc = {};

    window.uc = uc;
	uc.curServer = {
		ip : cmp.storage.get("editAddress"),
		port : cmp.storage.get("editPort"),
		model : cmp.storage.get("editModel"),
		getUrl : function() {
			return cmp.storage.get("editModel") + "://"
					+ cmp.storage.get("editAddress") + ":"
					+ cmp.storage.get("editPort");
		}
	};

	uc.userInfo = {

		getId : function() {
			return cmp.storage.get("userId_" + uc.curServer.getUrl());
		},
		getJid : function() {
			return cmp.storage.get("userId_" + uc.curServer.getUrl())+"@localhost/mobile";
		},
		getName : function() {
			var user = uc.userInfo.getCurrentMember();
			return user.loginName; //真实姓名 //登录名
		},
		getRawName : function() {

			return cmp.storage.get("rawName")
		},
		getPwd : function() {
			var user = uc.userInfo.getCurrentMember();
			return user.loginPwd; //真实姓名
		},
		getRealName : function() {
			var user = uc.userInfo.getCurrentMember();
			return user.name; //真实姓名
		},
		getUcIp : function() {
			var user = uc.userInfo.getCurrentMember();
			return user.ucip; //真实姓名
		},
		getUcServerStyle : function() {
			var user = uc.userInfo.getCurrentMember();
			return user.ucServerStyle; //真实姓名
		},
		getUcFilePort : function() {
			var user = uc.userInfo.getCurrentMember();
			return user.ucFilePort; //真实姓名
		},
		setId : function(id) {

			cmp.storage.save("userId_" + uc.curServer.getUrl(), id)
		},
		setName : function(name) {

			cmp.storage.save("name", name)
		},
		setRawName : function(rawName) {
			cmp.storage.save("rawName", rawName)
		},
		setPwd : function(pwd) {
			var user = uc.userInfo.getCurrentMember();
			user.loginPwd = pwd;
			uc.userInfo.setCurrentMember(user);
		},
		setRealName : function(realName) {

			cmp.storage.save("realName", realName)
		},
		setLoginStatus : function(status) {
			var user = uc.userInfo.getCurrentMember();
			user.loginStatus = status;
			uc.userInfo.setCurrentMember(user);
		},
		setShowCategory : function(status) {
			var user = uc.userInfo.getCurrentMember();
			user.showAppCategory = status;
			uc.userInfo.setCurrentMember(user);
		},
		setAppLayout : function(status) {
			var user = uc.userInfo.getCurrentMember();
			user.appLayOut = status;
			uc.userInfo.setCurrentMember(user);
		},
		setRadius : function(radius) {
			var user = uc.userInfo.getCurrentMember();
			user.radius = radius;
			uc.userInfo.setCurrentMember(user);
		},
		setGesture : function(status, gesPwd) {
			var user = uc.userInfo.getCurrentMember();
			user.gesture = status;
			user.gesturePwd = gesPwd;
			uc.userInfo.setCurrentMember(user);
		},
		setPic : function(pic) {
			var user = uc.userInfo.getCurrentMember();
			user.iconUrl = pic;
			uc.userInfo.setCurrentMember(user);
		},
		setUcServerIp:function(){
			// 获取致信服务器ip
		    cmp.chat.chatInfo({
		        success:function(result){
		        	var user = uc.userInfo.getCurrentMember();
					user.ucip = result.ip;
					//访问协议 ，http\https
					if(result.ucServerStyle){
						user.ucServerStyle = result.ucServerStyle;
					}else{
						user.ucServerStyle ="http";
					}
					//文件访问端口 默认是777
					if(result.ucFilePort){
						user.ucFilePort = result.ucFilePort;
					}else{
						user.ucFilePort ="7777";
					}
					uc.userInfo.setCurrentMember(user);
		          
		        },
		        error:function(error){}
		    });
		}
	};

	uc.userInfo.getCurrentMember = function() {
		var user = cmp.storage.get("userId_" + uc.userInfo.getId()
				+ "server_" + uc.curServer.getUrl())
				|| {};
		var returnUser = {};
		try {
			returnUser = JSON.parse(user);
		} catch (e) {
			returnUser = {};
		}

		return returnUser;
	};

	uc.userInfo.setCurrentMember = function(user) {
		return cmp.storage.save("userId_" + user.id + "server_"
				+ uc.curServer.getUrl(), JSON.stringify(user || {}));
	};
	//通过图片id，拼出图片地址
	uc.getImgPath=function(imageId){
		var imgurl=uc.userInfo.getUcServerStyle()+"://"+uc.userInfo.getUcIp()+":"+uc.userInfo.getUcFilePort()+"/download/sessionid=416564985&sessiontype=picturetrans&"+imageId
		return imgurl;
	}
	//获取当前服务信息
    uc.getCurServerInfo = function() {

        var ip = cmp.storage.get("editAddress"),
            port = cmp.storage.get("editPort");
        var info = cmp.storage.get(ip + "_" + port);
        return JSON.parse(info);
    };
    
	uc.setServerInfo = function(ipInfo) {
		//ipInfo {ip:"xxxx",port:"xxxxx".....}
		var serverInfo = uc.getServerInfo(ipInfo) || {};
		$.extend(serverInfo, ipInfo);
		cmp.storage.save(ipInfo.ip + "_" + ipInfo.port, JSON
				.stringify(serverInfo));
	};
	uc.getServerInfo = function(ipInfo) {
		var info = cmp.storage.get(ipInfo.ip + "_" + ipInfo.port);

		var s = null;
		try {
			s = JSON.parse(info) || {};
		} catch (e) {
			s = {};
		}
		return s;
	};
	
	//格式化在消息列表收到的消息
	uc.getFormatResultMessageList=function(msg){
		  var result = {};
		  var nowTime = new Date();
            var h = nowTime.getHours();
            var m = nowTime.getMinutes();
		  result.toId=msg.getAttribute("from").split("@")[0];
	       if(msg.getElementsByTagName("extension").length!=0){
	    	   		result.toname=msg.getElementsByTagName("extension")[0].getElementsByTagName("toname")[0].innerHTML;
	        }else{
	        		result.toname=msg.getElementsByTagName("toname")[0].innerHTML;
	        }
	       if(msg.getElementsByTagName("extension").length!=0){
	    	   		result.name=msg.getElementsByTagName("extension")[0].getElementsByTagName("name")[0].innerHTML;
	       }else{
	       		result.name=msg.getElementsByTagName("name")[0].innerHTML;
	       }   
	             
	       result.time =h + ":" + m;
	         
		  return result;
	};

	//获取当前的日期时间 格式“yyyy-MM-dd HH:MM:SS”
	uc.getNowFormatDate=function () {
	    var date = new Date();
	    var seperator1 = "-";
	    var seperator2 = ":";
	    var month = date.getMonth() + 1;
	    var strDate = date.getDate();
	    var hours = date.getHours();
	    var mins = date.getMinutes();
	    var seconds = date.getSeconds();
	    if (month >= 1 && month <= 9) {
	        month = "0" + month;
	    }
	    if (strDate >= 0 && strDate <= 9) {
	        strDate = "0" + strDate;
	    }
	    if(hours >= 0 && hours <= 9){
	    	hours = "0" + hours;
	    }
	    if(mins >= 0 && mins <= 9){
	    	mins = "0" + mins;
	    }
	    if(seconds >= 0 && seconds <= 9){
	    	seconds = "0" + seconds;
	    }
	    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
	            + " " + hours + seperator2 + mins + seperator2 + seconds;
	    return currentdate;
	}

	//格式化消息成对象
	uc.getFormatMsgInfo = function(curMemberId, msg,blockList) {
		var msgInfo = {};
		msgInfo.type=msg.getAttribute("type");
		msgInfo.id= msg.getAttribute("id");
		msgInfo.fromJid = msg.getAttribute("from");
		if(msgInfo.fromJid==null){
			return null;
		}
		msgInfo.toJid = msg.getAttribute("to");
		//判断对话中最终来着哪里
		if(curMemberId==msgInfo.fromJid.split("@")[0]){
			msgInfo.userId=msgInfo.toJid.split("@")[0];
		}else if(curMemberId==msgInfo.toJid.split("@")[0]){
			msgInfo.userId=msgInfo.fromJid.split("@")[0];
		}else {
			msgInfo.userId=msgInfo.toJid.split("@")[0];
		}
		//判断是否漫游消息
		if(msgInfo.fromJid.split("@")[0]==msgInfo.toJid.split("@")[0]){
			msgInfo.rover=true;
		}
		//获取消息时间
		if(msg.getAttribute("t")!=null&&msg.getAttribute("t")!="undefined"){
			var dateStr=msg.getAttribute("t");
			msgInfo.dateTime=dateStr.substring(0,dateStr.indexOf('.')).replace('T',' ');
		}else if(msg.getAttribute("timestamp")!=null&&msg.getAttribute("timestamp")!="undefined"){
			var dateStr=msg.getAttribute("timestamp");
			msgInfo.dateTime=dateStr.substring(0,dateStr.indexOf('.')).replace('T',' ');
		}else{
			msgInfo.dateTime=uc.getNowFormatDate();
		}
		
		if(msg.getElementsByTagName("extension").length!=0){
			if(msg.getElementsByTagName("extension")[0].getElementsByTagName("toname").length!=0){
	    		msgInfo.toName=msg.getElementsByTagName("extension")[0].getElementsByTagName("toname")[0].innerHTML;
	    	}
        }else{
        	if(msg.getElementsByTagName("toname").length!=0){
        		msgInfo.toName=uc.getElementsByTagName(msg ,"toname");
        	}
        }
        if(msg.getElementsByTagName("extension").length!=0){
        	if(msg.getElementsByTagName("extension")[0].getElementsByTagName("name").length!=0){
    	   		msgInfo.fromName=msg.getElementsByTagName("extension")[0].getElementsByTagName("name")[0].innerHTML;
    	   	}
       	}else{
       		if(msg.getElementsByTagName("name").length!=0){
       			msgInfo.fromName=uc.getElementsByTagName(msg ,"name");
       		}
       		
       	}
       	if(msg.getElementsByTagName("body")[0]){
       		if (msg.getAttribute("type") == "chat" || msg.getAttribute("type") == "groupchat") {
       			var body=msg.querySelector("body").textContent;
       			if (body.indexOf("<br>") != -1) {
       				body = body.replace(/<br>/g," ");
       			}
       		} else {
       			var body=uc.getElementsByTagName(msg ,"body");
       		}
			msgInfo.body=body;
		}else{
			if(msg.getElementsByTagName("microtalk").length!=0){
				msgInfo.fileType="microtalk";
				msgInfo.fileId=msg.getElementsByTagName("microtalk")[0].getElementsByTagName("id")[0].innerHTML;
				msgInfo.fileSize=msg.getElementsByTagName("microtalk")[0].getElementsByTagName("size")[0].innerHTML;
				msgInfo.body="[语音]";
			}else if(msg.getElementsByTagName("image").length!=0){
				msgInfo.fileType="image";

				msgInfo.imageId=msg.getElementsByTagName("image")[0].getElementsByTagName("id")[0].innerHTML;
				msgInfo.fileSize=msg.getElementsByTagName("image")[0].getElementsByTagName("size")[0].innerHTML;
				if(msg.getElementsByTagName("image")[0].getElementsByTagName("hash").length!=0){
					msgInfo.fileHash=msg.getElementsByTagName("image")[0].getElementsByTagName("hash")[0].innerHTML;
				}
				if (msg.getElementsByTagName("image")[0].getElementsByTagName("desc").length!=0) {
					msgInfo.fileDesc=msg.getElementsByTagName("image")[0].getElementsByTagName("desc")[0].innerHTML;
				}
				if (msg.getElementsByTagName("image")[0].getElementsByTagName("name").length!=0) {
					msgInfo.fileName=msg.getElementsByTagName("image")[0].getElementsByTagName("name")[0].innerHTML;
				}
				
				msgInfo.fileDate=msg.getElementsByTagName("image")[0].getElementsByTagName("date")[0].innerHTML;
				msgInfo.body="[图片]";
			}if(msg.getElementsByTagName("filetrans").length!=0){
				msgInfo.fileType="filetrans";
				msgInfo.imageId=msg.getElementsByTagName("filetrans")[0].getElementsByTagName("id")[0].innerHTML;
				msgInfo.fileSize=msg.getElementsByTagName("filetrans")[0].getElementsByTagName("size")[0].innerHTML;
				if (msg.getElementsByTagName("filetrans")[0].getElementsByTagName("hash").length!=0) {
					msgInfo.fileHash=msg.getElementsByTagName("filetrans")[0].getElementsByTagName("hash")[0].innerHTML;
				}
				if (msg.getElementsByTagName("filetrans")[0].getElementsByTagName("desc").length!=0) {
					msgInfo.fileDesc=msg.getElementsByTagName("filetrans")[0].getElementsByTagName("desc")[0].innerHTML;
				}
				if (msg.getElementsByTagName("filetrans")[0].getElementsByTagName("name").length!=0) {
					msgInfo.fileName=msg.getElementsByTagName("filetrans")[0].getElementsByTagName("name")[0].innerHTML;
				}			
				if (msg.getElementsByTagName("filetrans")[0].getElementsByTagName("date").length!=0) {
					msgInfo.fileDate=msg.getElementsByTagName("filetrans")[0].getElementsByTagName("date")[0].innerHTML;
				}
				
				msgInfo.body="[文件]";
			}
		}
		
		if(msg.getElementsByTagName("groupname").length!=0){
			msgInfo.groupName=uc.getElementsByTagName(msg ,"groupname");
		}
		if(msg.getElementsByTagName("count").length!=0){
			msgInfo.count=uc.getElementsByTagName(msg ,"count");
		}
		if(msg.getElementsByTagName("unread").length!=0){
			msgInfo.unread=uc.getElementsByTagName(msg ,"unread");
		}
		if(msg.getElementsByTagName("block").length!=0){
			msgInfo.block=uc.getElementsByTagName(msg ,"block");
		}else{
			if(blockList&&blockList.length != 0){
				if(blockList.inArray(msgInfo.userId)){
                  	msgInfo.block = 1;
                }else{
                  	msgInfo.block = 0;
                }
			}
		}
		return msgInfo;
	};

	//兼容ios8.3版本中的无innerHTML方法 getElementsByTagName
	uc.getElementsByTagName=function(msg,field){
		var textStr =msg.getElementsByTagName(field);
		if (textStr.length!=0) {
			var textValue=textStr[0].innerHTML;
			if(typeof(textValue)=="undefined"){ 
				return textStr[0].textContent
			}else{
				return textValue;
			}
		}
		return "";
	}
	//兼容ios8.3版本中的无innerHTML方法
	uc.innerHTML=function (field){
		var textValue=field.innerHTML;
		if(typeof(textValue)=="undefined"){ 
			return field.textContent
		}else{
			return textValue;
		}
	}

	uc.getFormatMsgInfoForImg = function(image_msg) {
		var msgInfo = {};
		if(image_msg.getElementsByTagName("image").length!=0){
			msgInfo.fileType="image";
			msgInfo.imageId=msg.getElementsByTagName("image")[0].getElementsByTagName("id")[0].innerHTML;
			if(msg.getElementsByTagName("image")[0].getElementsByTagName("id_thumbnail").length!=0){
				msgInfo.fileSize=msg.getElementsByTagName("image")[0].getElementsByTagName("id_thumbnail")[0].innerHTML;
			}
			if(msg.getElementsByTagName("image")[0].getElementsByTagName("size").length!=0){
				msgInfo.fileSize=msg.getElementsByTagName("image")[0].getElementsByTagName("size")[0].innerHTML;
			}
			if(msg.getElementsByTagName("image")[0].getElementsByTagName("hash").length!=0){
				msgInfo.fileHash=msg.getElementsByTagName("image")[0].getElementsByTagName("hash")[0].innerHTML;
			}
			if (msg.getElementsByTagName("image")[0].getElementsByTagName("desc").length!=0) {
				msgInfo.fileDesc=msg.getElementsByTagName("image")[0].getElementsByTagName("desc")[0].innerHTML;
			}
			if (msg.getElementsByTagName("image")[0].getElementsByTagName("name").length!=0) {
				msgInfo.fileName=msg.getElementsByTagName("image")[0].getElementsByTagName("name")[0].innerHTML;
			}
			
			msgInfo.fileDate=msg.getElementsByTagName("image")[0].getElementsByTagName("date")[0].innerHTML;
			msgInfo.body="[图片]";
			}
	}


	uc.getSingleAvatarUrl=function(userId,maxWidth){
		// var imgurl="";
		var imgurl=uc.curServer.getUrl()+"/mobile_portal/seeyon/rest/orgMember/avatar/"+userId;
		if (maxWidth!=null && typeof(maxWidth)!="undefined") {
			imgurl+="?maxWidth="+maxWidth;
		}
		return imgurl;
	};

	//群组获取头像
	uc.getGroupAvatarUrl=function(groupId,groupName,maxWidth){
		// var imgurl="";
		var imgurl=uc.curServer.getUrl()+"/mobile_portal/seeyon/rest/orgMember/groupavatar?groupId="+groupId+"&groupName="+encodeURI(encodeURI(groupName))+"&ucFlag=yes";
		if (maxWidth!=null && typeof(maxWidth)!="undefined") {
			imgurl+="&maxWidth="+maxWidth;
		}
		return imgurl;
	};
	//单人或多人发起聊天时初始化一条数据，方便首页显示
	uc.initChatMessageToDate=function(toId,toName,chatType,groupName){

		  var msgInfo={
		    userId:toId,
		    fromJid:uc.userInfo.getJid(),
		    fromName:uc.userInfo.getRealName(),
		    toName:toName,
		    type:chatType,
		    count:0,
		    groupName:groupName
		  }
		  if(chatType=='chat'){
			  msgInfo.toJid=toId+"@localhost";
		  }else{
			  msgInfo.toJid=toId+"@group.localhost";
		  }
		    
		  //设置内容
		  msgInfo.body="";
		  //设置是否屏蔽
		  msgInfo.block=0;
		  //设置时间
		  msgInfo.dateTime=uc.getNowFormatDate();

		  return msgInfo;

		};
		/*1.用正则表达式实现html转码*/
		uc.htmlEncodeByRegExp=function(str){  
		     var s = "";
		     if(str==null||str.length == 0) return "";

		     s = str.replace(/</g,"&lt;");
		     s = s.replace(/>/g,"&gt;");
		     s = s.replace(/ /g,"&nbsp;");
		     s = s.replace(/\'/g,"&#39;");
		     s = s.replace(/\"/g,"&quot;");
		     s = s.replace(/&amp;amp;/g,"&amp;");
		     //协同V5OA-117975 M3我的群聊：我的群聊界面，群组名字为字符时不显示群组头像且群组名字错误
		     s = s.replace(/&amp;amp;/g,"&amp;").replace(/&amp;nbsp;/g,"&nbsp;").replace(/&amp;lt;/g,"&lt;").replace(/&amp;gt;/g,"&gt;");
		      return s;  
		};
		/*2.用正则表达式实现html解码*/
		uc.htmlDecodeByRegExp=function(str){  
		      var s = "";
		      if(str.length == 0) return "";
		      s = str.replace(/&amp;/g,"&");
		      s = s.replace(/&lt;/g,"<");
		      s = s.replace(/&gt;/g,">");
		      s = s.replace(/&nbsp;/g," ");
		      s = s.replace(/&#39;/g,"\'");
		      s = s.replace(/&quot;/g,"\"");
		      return s;  
		};
		/*
		 * 渲染后转义无法展现，调用这个包
		 * 先将转义文本赋值给innerHTML，然后通过innerText（textContent）获取转义前的文本内容
		 * */
		uc.HTMLDecode=function(text) { 
		    var temp = document.createElement("div"); 
		    temp.innerHTML = text; 
		    var output = temp.innerText || temp.textContent; 
		    temp = null; 
		    return output; 
		} 
		
		//测试服务成功
		uc.checkUCState=function(){
		  cmp.chat.checkChatState({
		    success:function(result){
		    	if(result.state==0){
	    			console.log("连接失败")
		    		document.querySelector(".cmp-title").innerHTML=document.querySelector(".cmp-title").innerText+"<span id='dis_connection'>[未连接]</span>";
		    	}else{
		    		console.log("连接成功:"+result.state);
		    	}
		      
		    },
		    error:function(e){
		    	// "<span id="uc_state" style="display: none">[未连接]</span>"
		      
		      console.log("连接异常:"+e)
		    }
		  });
		}
		
		uc.checkChatListener=function(callback){
			document.addEventListener("chatStateListener", function (event) {
				var data=event.data;
				if(data.state&&data.state==1){
					var dis_connection = document.getElementById("dis_connection");
					dis_connection && (dis_connection.style.display="none");
					console.log("重新连接成功!");
					//重新设置UC服务器IP得治
					uc.userInfo.setUcServerIp();
					callback && callback(data.state)
				}else if(data.state&&data.state==2){
					console.log("连接中...")
					var dis_connection = document.getElementById("dis_connection");
	    			dis_connection && (dis_connection.innerHTML="[连接中]");
	    			callback && callback(data.state)
				}else if (data.state==0) {
					console.log("网络已断开")
					callback && callback(data.state)
				}
				
				
			});
		}
}));