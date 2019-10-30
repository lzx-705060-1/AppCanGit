(function(global,factory){
	global.AttendanceSlide = factory();
})(this,function(){
	function Component(item,config){
		var me = this;
		me.config = config || {};
		//初始化Dom
		me.initialize(item);
		//绑定事件
		me.bindEvents();
	}
	Component.prototype = {
		initialize : function(item){
			var me = this;
			me.handler = (typeof item == "object") ? item : document.querySelector(item);
			me.container = me.handler.parentNode;
			//计算高度
			var header = document.querySelector('header.cmp-bar.cmp-bar-nav');
			var windowH = window.innerHeight;
			me.windowH = windowH;
			me.headerH = !header ? 0 : cmp.os.ios?64:44;
			me.containerH = windowH - me.headerH;
			me.container.style.height = windowH - me.headerH +"px";
			me.container.style.top = (me.containerH/2) + (me.handler.offsetHeight/2) +"px";
			me.topH = (me.containerH/2) + (me.handler.offsetHeight/2);
			
			 //中间大主容器计算高度
			var cmp_content=document.querySelector('.cmp-content'); 
			var windowH= window.innerHeight;
			var headerH;
			headerH = !header ? 0 : header.offsetHeight; 
			if(cmp_content){
				cmp_content.style.height = windowH - headerH + "px";
			}	
			
		},
		bindEvents : function(){
			var me = this;
			//滑动处理
			me.slidePosition = "middle";
		   	var startY,moveEndY,moveY,Y;
		   	me.handler.addEventListener('touchstart', function(e) {
		   		e.preventDefault();
		   		startY = e.touches[0].pageY;
		   		me.startY = startY;
		   	}, false);
		   	me.handler.addEventListener('touchmove',function(e){
		   		e.preventDefault();
		   		moveY= e.touches[0].pageY;
	            var translate;
	            if(moveY<me.headerH+(me.handler.offsetHeight/2)){
	                moveY=me.headerH;
	                translate=moveY;
	            }else if(moveY>me.containerH){
	                moveY = me.containerH + (me.handler.offsetHeight/2);
	                translate=moveY;
	            }else{
	                translate=moveY - (me.handler.offsetHeight/2);
	            }
	            me.container.style.top = translate +"px";
		   	});
		   	me.handler.addEventListener('touchend', function(e) {
		   		e.preventDefault();
		   		moveEndY = e.changedTouches[0].pageY;
		   		Y = moveEndY - startY;
		   		me.moveEndY = moveEndY;
				if(Y < 0) {
					if(me.slidePosition == "middle"){
						me.slidePosition = "top";
						me.slideTop(); 
					}else if(me.slidePosition == "boottom"){
						me.slidePosition = "middle";
						me.slideMiddle(); 
					}
		   		}else{
					if(me.slidePosition == "middle"){
						me.slidePosition = "boottom";
						me.slideBottom(); 
					}else if(me.slidePosition == "top"){
						me.slidePosition = "middle";
						me.slideMiddle(); 
					}else if(me.slidePosition == "boottom"){
						me.slidePosition = "middle";
						me.slideMiddle(); 
					}
		   		}
		   	});
		},
		slideTop : function(){
			var me = this;
			me.container.style.transition = "top 200ms linear";
			me.container.style.webkitTransition = "top 200ms linear";
   			me.container.style.top = me.headerH + "px";
   			me.topH = me.headerH;
   			//回调
   			me.config.backFunc && me.config.backFunc.apply(me);
		},
		slideMiddle : function(){
			var me = this;
			me.container.style.transition = "top 200ms linear";
			me.container.style.webkitTransition = "top 200ms linear";
   			me.container.style.top = (me.containerH/2) + (me.handler.offsetHeight/2) +"px";
   			me.topH = (me.containerH/2) + (me.handler.offsetHeight/2);
   			//回调
   			me.config.backFunc && me.config.backFunc.apply(me);
		},
		slideBottom : function(){
			var me = this;
			me.container.style.transition = "top 200ms linear";
			me.container.style.webkitTransition = "top 200ms linear";
   			me.container.style.top = me.windowH - me.handler.offsetHeight + "px";
   			me.topH = me.windowH - me.handler.offsetHeight;
   			//回调
   			me.config.backFunc && me.config.backFunc.apply(me);
		}
	}
	return Component;
});
