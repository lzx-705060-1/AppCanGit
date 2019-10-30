var taskCommon = {
	/**
	 * 根目录
	 */
	getRoot : function(){
		return cmp.serverIp ? cmp.serverIp : "";
	},
	/**
	 * 根据后台返回格式(yyyy-MM-dd HH:mm:ss或者时间戳)初始化日期
	 * 返回 指定格式
	 * @param {Object} date
	 */
	getTimeByPattern : function(date,pattern){
		date = date ? /-|:/g.test(date) ? new Date(date.replace(/-/g,"/")) : new Date(parseInt(date)) : new Date();
		return date.format(pattern);
	},
	/*
	 * ajax请求error处理
	 */
	dealAjaxError : function(error){
		var cmpHandled = cmp.errorHandler(error);
		if(!cmpHandled){
			console.log(error);
			cmp.notification.alert(error);							
		}
	}
}
/**
 * 弹出层
 * @param {Object} options
 * {
 * 	tag : 标识
 * 	title : 弹出层标题
 * 	placeholder : 提示语
 *  validate : {message:没有内容时提示语}
 *  buttons : 按钮{id : 按钮id,name : 名称,html : html字符串,fun : 点击回调}
 * }
 * 
 */
function InsBox(options){
	this.options = options;
	this.init();
	this.events();
}
InsBox.prototype = {
	init : function(){
		var me = this;
		var container = document.createElement("div");
		container.classList.add("Animated-Container");
		container.classList.add("right-go");
		container.classList.add("animated");
		
		var getBtnDom = function(){
			var html = '<div class="task-save-bottom">';
			var btns = me.options.buttons;
			var width;
			for(var i = 0;i < btns.length;i++){
				width = 100/btns.length + "%";
				html += '<div id="btn_' + me.options.tag + "_" + btns[i].id + '" style="display: -webkit-box;-webkit-box-align: center;-webkit-box-pack: center;width:' + width + '">';
				if(btns[i].html){
					html += btns[i].html;
				}else{
					html += '<div class="task-save-btn"><span>' + btns[i].name + '</span></div>';
				}
				html += '</div>';
			}
			html += '</div>'
			return html;
		}
		
		
		var tpl_body = '<div class="cmp-content position_relative" style="position: fixed;bottom: 91px;width: 100%;">'+
	        				'<textarea id="' + me.options.tag + 'Area" placeholder="' + me.options.placeholder + '" maxlength="500" style="border: none;height: 100%;width: 100%;"></textarea>'+
	    				'</div>'+
	    				'<div style="width: 100%;padding: 10px;position: fixed;bottom: 50px;left: 0;background-color: #efeff4;">'+
            				'<div style="float: left;font-size: 16px;color: #999;">'+
                				'<span id="' + me.options.tag + 'Remain">500</span>'+
            				'</div>'+
            				'<div style="clear: both;"></div>'+
        				'</div>';
		
		var tpl_footer = '<footer style="bottom: 0;position:fixed;z-index: 11px;background-color: #fff;width: 100%;">' + getBtnDom() + '</footer>';
	    
	    container.innerHTML = tpl_body + tpl_footer;
		document.getElementsByTagName('body')[0].appendChild(container);
		cmp.i18n.detect();
		me.container = container;
		
		me.open();
	},
	open : function(){
		var me = this;
		me.container.classList.add("cmp-active");
		cmp.backbutton();
    	cmp.backbutton.push(function(){
    		me.close();
    	});
    	
    	me.container.querySelector("#" + me.options.tag + "Area").value = "";
    	me.container.querySelector("#" + me.options.tag + "Remain").innerHTML = 500;
	},
	close : function(){
		var me = this;
		me.container.classList.remove("cmp-active");
		cmp.backbutton.pop();
	},
	destroy : function(){
		var me = this;
		me.container.parentNode.removeChild(me.container);
		me = null;
	},
	events : function(){
		var me = this,container = me.container;
		//字数控制
		container.querySelector("#" + me.options.tag + "Area").addEventListener("input", function(){
			var num = this.value.length;
			if(num > 500){
				this.value = this.value.substr(0,500);
				this.blur();
				container.querySelector("#" + me.options.tag + "Remain").innerHTML = 0;
				cmp.notification.toast(cmp.i18n("Taskmanage.label.nomorethan500"), "center");
			}else{
				container.querySelector("#" + me.options.tag + "Remain").innerHTML = 500 - num;
			}
		});
		//按钮
		var btns = me.options.buttons;
		me.btnMap = {};
		for(var i = 0;i < btns.length;i++){
			var btn = btns[i];
			me.btnMap["btn_" + me.options.tag + "_" + btn.id] = btn;
			container.querySelector("#btn_" + me.options.tag + "_" + btn.id).addEventListener("click",function(){
				var content = container.querySelector("#" + me.options.tag + "Area").value;
				var btnIns = me.btnMap[this.id];
				if(btnIns.validate && !content.replace(/(^\s*)|(\s*$)/g, "")){
					cmp.notification.toast(btnIns.validate.message, "center", 1000);
					return;
				}
				if(btnIns.fun && typeof btnIns.fun == 'function'){
					btnIns.fun.call(me,{content : content});
				}
				me.close();
			});
		}
	}
}
//添加webview监听
var addWebviewEvent = function(callback){
	cmp.webViewListener.addEvent("taskmanage_webview_event",function(e){
		if(typeof callback === 'function'){
			callback(e);
		}
    });
}
//触发webview监听
var fireWebviewEvent = function(data){
	cmp.webViewListener.fire({
        type:"taskmanage_webview_event",
        data:data,
        success:function(){
        },
        error:function(error){
			console.log(error);
        }
    });
}