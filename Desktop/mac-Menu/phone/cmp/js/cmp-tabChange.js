/****************
	选项卡切换
****************/
(function(cmp){
	var rtrim=new RegExp("(^\\s*)|(\\s*$)", 'g'); //去掉前后空格
	//判断是否有class
	function hasClass(ele,selector){
		var re = new RegExp("(^|\\s)" + selector + "(\\s|$)", 'g');  //匹配相应的class
		return re.test(ele.className);
	}
	//添加class
	function addClass(ele,selector ) {
		if (!ele || hasClass(ele,selector)) {
			return;
		}
		var newclass = ele.className.split(' ');
		newclass.push(selector);
		ele.className = newclass.join(' ').replace(rtrim,"");
	}
	//移除class
	function removeClass(ele,selector) {
		if (!ele || !hasClass(ele,selector)) {
			return;
		}
		var re = new RegExp("(^|\\s)" + selector + "(\\s|$)", 'g');  //匹配相应的class
		ele.className = ele.className.replace(re, ' ').replace(rtrim,"");
	}
	function TabChange(options){
		this.options={
			addClassName:"selected"
		}
		for(var i in options){
			this.options[i]=options[i];
		}
		this.events();
		
	}
	TabChange.prototype.events=function(){
		var that=this;
		var navs=[].slice.call(document.querySelectorAll(that.options.nav));
		var sections=[].slice.call(document.querySelectorAll(that.options.section));
		navs.forEach(function(nav,i){
			var section=sections[i];
			nav.addEventListener("click",function(){
				if(hasClass(nav,that.options.addClassName)){
					return;
				}
				navs.forEach(function(nav){
					removeClass(nav,that.options.addClassName);
				});
				addClass(nav,that.options.addClassName);
				
				sections.forEach(function(section){
					removeClass(section,that.options.addClassName);
				});
				var tabData=nav.getAttribute("data-nav");
				if(tabData){
					for(var i=0,len=sections.length;i<len;i++){
						if(sections[i].getAttribute("data-section")===tabData){
							section=sections[i];
							break;
						}
					}
				}
				addClass(section,that.options.addClassName);
				
				if(typeof that.options.fn=="function"){
					that.options.fn(nav,section);
				}
			},false);
		})
	}
	cmp.TabChange=TabChange;
})(cmp);