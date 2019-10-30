var $emoji;	//	表情容器相关
(function(){
	$emoji =  function(){};
	/**
	 * 初始化表情
	 */
	$emoji.prototype._init =  function(){
		this.face ={};
		for(var j = 0; j < this._config.face_titles.length; j++) {
			var key = this._config.face_titles[j];
			this.face[key] = "<span class='show-emoji-5-" + (j + 1) + "'></span>";
		}
	}
	
	/**
	 * content_container:内容回填容器
	 * emoji_container：表情选择器容器
	 * selected ：表情选择器
	 */
	$emoji.prototype._config = {
		"content_container":"commemnt_content_input11",
		"emoji_container":"emoji_ontainer11",
		"face_texts":["[5_1]", "[5_2]", "[5_3]", "[5_4]", "[5_5]", "[5_6]", "[5_7]", "[5_8]","[5_9]", "[5_10]", "[5_11]", "[5_12]", "[5_13]", "[5_14]", "[5_15]", "[5_16]","[5_17]", "[5_18]", "[5_19]", "[5_20]", "[5_21]", "[5_22]", "[5_23]", "[5_24]","[5_25]", "[5_26]", "[5_27]", "[5_28]", "[5_29]", "[5_30]", "[5_31]", "[5_32]"],
		"face_titles":["微笑","呲牙","坏笑","偷笑","可爱","调皮","爱心","鼓掌","疑问","晕","再见","抓狂","难过","流汗","流泪","得意","发怒","嘘","惊恐","鸭梨","赞","奖状","握手","胜利","祈祷","强","蛋糕","礼物","OK","饭","咖啡","玫瑰"],
		"face_texts_replace":[ /\[5_1\]/g, /\[5_2\]/g, /\[5_3\]/g, /\[5_4\]/g, /\[5_5\]/g, /\[5_6\]/g, /\[5_7\]/g, /\[5_8\]/g,/\[5_9\]/g, /\[5_10\]/g, /\[5_11\]/g, /\[5_12\]/g, /\[5_13\]/g, /\[5_14\]/g, /\[5_15\]/g, /\[5_16\]/g, /\[5_17\]/g, /\[5_18\]/g, /\[5_19\]/g, /\[5_20\]/g, /\[5_21\]/g, /\[5_22\]/g, /\[5_23\]/g, /\[5_24\]/g,/\[5_25\]/g, /\[5_26\]/g, /\[5_27\]/g, /\[5_28\]/g, /\[5_29\]/g, /\[5_30\]/g, /\[5_31\]/g, /\[5_32\]/g,/\[wx\]/g, /\[cy\]/g, /\[dx\]/g, /\[tl\]/g, /\[huaix\]/g,/\[hx\]/g, /\[xa\]/g, /\[wq\]/g, /\[dk\]/g, /\[sx\]/g,/\[sq\]/g, /\[han\]/g, /\[zk\]/g, /\[jy\]/g, /\[yw\]/g,  /\[gz\]/g, /\[bb\]/g, /\[jb\]/g, /\[yl\]/g, /\[ws\]/g,  /\[hao\]/g, /\[fd\]/g, /\[dg\]/g, /\[jz\]/g, /\[zan\]/g ],
		"face_texts_replaze":[ /\[5_1\]/g, /\[5_2\]/g, /\[5_3\]/g, /\[5_4\]/g, /\[5_5\]/g, /\[5_6\]/g, /\[5_7\]/g, /\[5_8\]/g,/\[5_9\]/g, /\[5_10\]/g, /\[5_11\]/g, /\[5_12\]/g, /\[5_13\]/g, /\[5_14\]/g, /\[5_15\]/g, /\[5_16\]/g, /\[5_17\]/g, /\[5_18\]/g, /\[5_19\]/g, /\[5_20\]/g, /\[5_21\]/g, /\[5_22\]/g, /\[5_23\]/g, /\[5_24\]/g,/\[5_25\]/g, /\[5_26\]/g, /\[5_27\]/g, /\[5_28\]/g, /\[5_29\]/g, /\[5_30\]/g, /\[5_31\]/g, /\[5_32\]/g],
		"face_titles_replace":[/\[微笑]/g,/\[呲牙]/g,/\[坏笑]/g,/\[偷笑]/g,/\[可爱]/g,/\[调皮]/g,/\[爱心]/g,/\[鼓掌]/g,/\[疑问]/g,/\[晕]/g,/\[再见]/g,/\[抓狂]/g,/\[难过]/g,/\[流汗]/g,/\[流泪]/g,/\[得意]/g,/\[发怒]/g,/\[嘘]/g,/\[惊恐]/g,/\[鸭梨]/g,/\[赞]/g,/\[奖状]/g,/\[握手]/g,/\[胜利]/g,/\[祈祷]/g,/\[强]/g,/\[蛋糕]/g,/\[礼物]/g,/\[OK]/g,/\[饭]/g,/\[咖啡]/g,/\[玫瑰]/g]
	}
	/**
	 * 表情选择器初始化
	 * content_container ：表情回填的input输入框的Id
	 * emoji_container   ：表情选择器容器的Id
	 */
	$emoji.prototype.init_emoji_ontainer = function(content_container,emoji_container,selected){
		if(!this.face){
			this._init()
		}
		if(content_container){
			this._config.content_container = content_container;
		}
		if(emoji_container){
			this._config.emoji_container = emoji_container;
		}
		if(selected && typeof selected === "function"){
			this._config.selected = selected;
		}
		var content = "<div class=\"addIcon_face hideDialog\">";
		content += " <ul id=\"\" class=\"faces_list_hot clearfix\">";
		for(var index in this.face){
			content += "<li action-type=\"select\" _title=\"" + index + "\">";
			content += this.face[index];
			content += "</li>";
		}
		content += "</ul>";
		content += "</div>";
		var emoji_container_div = document.getElementById(this._config.emoji_container);
		emoji_container_div.innerHTML = content;
		var e_list = emoji_container_div.getElementsByTagName("li");
		var content_container_input = document.getElementById(this._config.content_container);
		var thisObj = this;
		for(var i= 0 ; i < e_list.length ; i++){
			e_list[i].addEventListener("tap",function(e){
				if(thisObj._config.selected && typeof thisObj._config.selected === "function"){
					thisObj._config.selected.apply(this,this)
				}else{
					if(content_container_input){
						content_container_input.value = content_container_input.value + "[" + this.getAttribute("_title") + "]";
					}
				}
			});
		}
	}

	// 发送消息时以[5_1]样式发送
	$emoji.prototype.emojiToPC = function(content){
	    if (content != "" && content.length > 0) {
	        for (var i = 0; i < this._config.face_titles_replace.length; i++) {
	            content = content.replace(this._config.face_titles_replace[i], "[5_" + parseInt((i + 1), 10) + "]");
	        }
	    }
	    return content;
	}

	// 列表中的表情显示[微笑]样式
	$emoji.prototype.emojiToM3 = function(content){
	    if (content != "" && content.length > 0) {
	        for (var i = 0; i < this._config.face_texts_replaze.length; i++) {
	            content = content.replace(this._config.face_texts_replaze[i], "[" + this._config.face_titles[i] + "]");
	        }
	    }
	    return content;
	}

	// 聊天窗口中的表情以图标样式展现
	$emoji.prototype.emojiToM3Icon = function(content){
	    if (content != "" && content.length > 0) {
	        for (var i = 0; i < this._config.face_texts_replaze.length; i++) {
				content = content.replace(this._config.face_texts_replaze[i], "<span class=\"show-emoji-all show-emoji-talk-5-" + (i + 1 ) +"\"></span>");
			}
	    }
	    return content;
	}
})();