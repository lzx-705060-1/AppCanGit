var $emoji;	

(function(){
	//=======================================================
	//		表情容器相关
	//=======================================================
	$emoji =  function(){};
	//初始化秀吧的表情
	$emoji.prototype._init =  function(){
		this.face ={};
		for(var j = 0; j < this._config.face_titles.length; j++) {
			var key = this._config.face_titles[j];
			this.face[key] = "<span class='show-emoji show-emoji-5-" + (j + 1) + "'></span>";
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
			//"selected":function(){},
			"face_texts":["[5_1]", "[5_2]", "[5_3]", "[5_4]", "[5_5]", "[5_6]", "[5_7]", "[5_8]","[5_9]", "[5_10]", "[5_11]", "[5_12]", "[5_13]", "[5_14]", "[5_15]", "[5_16]","[5_17]", "[5_18]", "[5_19]", "[5_20]", "[5_21]", "[5_22]", "[5_23]", "[5_24]","[5_25]", "[5_26]", "[5_27]", "[5_28]", "[5_29]", "[5_30]", "[5_31]", "[5_32]"],
			"face_titles":["微笑","呲牙","坏笑","偷笑","可爱","调皮","爱心","鼓掌","疑问","晕","再见","抓狂","难过","流汗","流泪","得意","发怒","嘘","惊恐","鸭梨","赞","奖状","握手","胜利","祈祷","强","蛋糕","礼物","OK","饭","咖啡","玫瑰"],
			"face_texts_replace":[ /\[5_1\]/g, /\[5_2\]/g, /\[5_3\]/g, /\[5_4\]/g, /\[5_5\]/g, /\[5_6\]/g, /\[5_7\]/g, /\[5_8\]/g,/\[5_9\]/g, /\[5_10\]/g, /\[5_11\]/g, /\[5_12\]/g, /\[5_13\]/g, /\[5_14\]/g, /\[5_15\]/g, /\[5_16\]/g, /\[5_17\]/g, /\[5_18\]/g, /\[5_19\]/g, /\[5_20\]/g, /\[5_21\]/g, /\[5_22\]/g, /\[5_23\]/g, /\[5_24\]/g,/\[5_25\]/g, /\[5_26\]/g, /\[5_27\]/g, /\[5_28\]/g, /\[5_29\]/g, /\[5_30\]/g, /\[5_31\]/g, /\[5_32\]/g,/\[wx\]/g, /\[cy\]/g, /\[dx\]/g, /\[tl\]/g, /\[huaix\]/g,/\[hx\]/g, /\[xa\]/g, /\[wq\]/g, /\[dk\]/g, /\[sx\]/g,/\[sq\]/g, /\[han\]/g, /\[zk\]/g, /\[jy\]/g, /\[yw\]/g,  /\[gz\]/g, /\[bb\]/g, /\[jb\]/g, /\[yl\]/g, /\[ws\]/g,  /\[hao\]/g, /\[fd\]/g, /\[dg\]/g, /\[jz\]/g, /\[zan\]/g ]
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
		var content = "";//"<div class=\"addIcon_face hideDialog\" style=\"display: block;\">";
		content += " <ul id=\"\" class=\"faces_list_hot clearfix\">";
		for(var index in this.face){
			content += "<li action-type=\"select\" _title=\"" + index + "\" style=\"margin: 2px 2px;list-style: none;\">";
			content += this.face[index];
			content += "</li>";
		}
		content += "</ul>";
		//content += "</div>";
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
	
	$emoji.prototype.covert =  function(txt){
		return this.covert_to_emoji(txt);
	}
	/**
	 * 将页面[微笑] 装换为对应的img标签
	 * @param txt 要转换的原始字符串
	 * @return 返回转换后的字符串
	 */
	$emoji.prototype.covert_to_emoji =  function(txt){
		if(!this.face){
			this._init()
		}
		var faces = this.face;
		var contentStr = "";
		if (txt && txt.length > 0) {
			contentStr = txt;
			var reg = /\[.+?\]/g; 
			contentStr = contentStr.replace(reg,function(key,index){
				var con_key = key.substring(1,key.length-1);
				var txt = faces[con_key];
				if (txt == undefined || txt == "undefined") {
					txt = key;
				}
				return txt; 
			});
		}
		return contentStr;
	}
	//初始化
})();

//eee = new $emoji()
//eee._init();
//eee.init_emoji_ontainer();
//var eee;