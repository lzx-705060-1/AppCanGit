/**
 * 页面转场效果定义
 */
(function() {
	var vendor = (/webkit/i).test(navigator.appVersion) ? 'webkit'
			: (/firefox/i).test(navigator.userAgent) ? 'Moz'
					: 'opera' in window ? 'O' : '',
	// Browser capabilities
	has3d = 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix(),
	// Helpers
	trnOpen = 'translate' + (has3d ? '3d(' : '('), trnClose = has3d ? ',0)'
			: ')';
	// force use css tran
	hasTransitionEnd = true;
	window.get_trans_pos = function(elem) {
		if (!hasTransitionEnd) {
			var orig_left = parseFloat($(elem).css('left')) || 0;
			var orig_top = parseFloat($(elem).css('top')) || 0;
			return {
				'x' : orig_left,
				'y' : orig_top
			};
		}
		var matrix = getComputedStyle(elem, null)[vendor + 'Transform']
				.replace(/[^0-9-.,]/g, '').split(',');
		return {
			'x' : matrix[4] * 1 || 0,
			'y' : matrix[5] * 1 || 0
		};
	};

	$.fn.extend({
		'imove' : function(stopX, stopY, duration, cb,flag) {
			var that = this, elem = that[0];// matrix, origX, origY
			if (hasTransitionEnd) {
				var orig_pos = get_trans_pos(elem);
				if(flag){
					var headerHeight=document.querySelector('#header').offsetHeight;
					var wrapperArr=document.querySelectorAll('.wrapper');
					var pageframeArr=document.querySelectorAll('.frame');
					var searchDom=pageframeArr[pageframeArr.length-1].querySelector('.cmp-segmented_title_content');
					var contentHeaderDom=pageframeArr[pageframeArr.length-1].querySelector('.form-query-header');
					var i=wrapperArr.length;
					if(searchDom&&contentHeaderDom){
						wrapperArr[i-1].style.top=headerHeight+searchDom.offsetHeight+contentHeaderDom.offsetHeight+"px";
					}else {
						if(!document.querySelector('#report_chart_wrapper')){
							wrapperArr[i-1].style.top=headerHeight+'px';
						}
					}

					flag=false;
				}
				elem.style[vendor + 'TransitionProperty'] = '-'
						+ vendor.toLowerCase() + '-transform';
				elem.style[vendor + 'TransitionDuration'] = duration + 'ms';
				elem.style[vendor + 'Transform'] = trnOpen
						+ (orig_pos.x + stopX) + 'px,' + (orig_pos.y + stopY)
						+ 'px' + trnClose;
				if (!cb)
					return;
				var f = function() {
					cb();
					elem.removeEventListener('webkitTransitionEnd', f);
					if(document.querySelector('#wrapper')){
						document.querySelector('#wrapper').style.top=0;
					}
				};
				elem.addEventListener('webkitTransitionEnd', f, false);
			} else {
				var orig_left = parseFloat(that.css('left')) || 0;
				var orig_top = parseFloat(that.css('top')) || 0;
				that.animate({
					left : orig_left + stopX,
					top : orig_top + stopY
				}, {
					duration : duration,
					complete : cb
				});
			}
			return that;
		}
	});
	
	Date.prototype.format = function(format) {  
	    /* 
	     * eg:format="yyyy-MM-dd hh:mm:ss"; 
	     */  
		format = format == null || format == "" ? "yyyy-MM-dd hh:mm:ss":format;
		
	    var o = {  
	        "M+" : this.getMonth() + 1, // month  
	        "d+" : this.getDate(), // day  
	        "h+" : this.getHours(), // hour  
	        "m+" : this.getMinutes(), // minute  
	        "s+" : this.getSeconds(), // second  
	        "q+" : Math.floor((this.getMonth() + 3) / 3), // quarter  
	        "S" : this.getMilliseconds()  
	        // millisecond  
	    };  
	  
	    if (/(y+)/.test(format)) {  
	        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4  
	                        - RegExp.$1.length));  
	    }  
	  
	    for (var k in o) {  
	        if (new RegExp("(" + k + ")").test(format)) {  
	            format = format.replace(RegExp.$1, RegExp.$1.length == 1  
	                            ? o[k]  
	                            : ("00" + o[k]).substr(("" + o[k]).length));  
	        }  
	    }  
	    return format;  
	};
	
})();
var slide_inExt = function(html, from, target_str, cb,animation) {
}

/**
 * 页面转场效果方法
 */
var slide_in = function(html, from, target_str, cb,boolean,isTableList) {
	if(isTableList){
		var sortContainer,listContainer,sortStatisticsTemp,sortStatistics,fListTemp,FlowForm_view,sortStatisticsDiv,header,headerHTML;
		if(isTableList.isTable==0){
			    sortContainer=$(target_str.sortContainer)[0];
				listContainer=$(target_str.listContainer)[0];
				sortStatisticsTemp=html.sortStatisticsTemp;
				fListTemp=html.listTemp;
				sortStatistics=document.querySelector('#sortStatistics');
				FlowForm_view=document.querySelector('.FlowForm_view.user_select');
			if(!sortStatistics){
				sortStatisticsDiv=document.createElement("div");
				sortStatisticsDiv.setAttribute('id',"sortStatistics");
				sortStatisticsDiv.innerHTML=sortStatisticsTemp;
				sortContainer.insertBefore(sortStatisticsDiv,sortContainer.childNodes[0]);
			}else {
				sortStatistics.innerHTML=sortStatisticsTemp;
			}
			if(!FlowForm_view){
				var listDiv=document.createElement("div");
				listDiv.className="FlowForm_view  user_select";
				listDiv.innerHTML=fListTemp;
				listContainer.insertBefore(listDiv,listContainer.childNodes[0]);
			}else {
				if(M1FormUtils.total==1){
					FlowForm_view.querySelector('ul').innerHTML="";
				}
				FlowForm_view.querySelector('ul').innerHTML+=fListTemp;

			}
			if(M1FormUtils.haveNotCondition){
				header=document.querySelector('#header');
				header.innerHTML=html.headerTemp;
				if(header.querySelector('#header')){
					headerHTML=header.querySelector('#header').innerHTML;
					header.querySelector('#header').remove();
					header.innerHTML=headerHTML;
				}
				M1FormUtils.haveNotCondition=false;
			}

			if(cb){
				cb();
			}
			return;
		}else if(isTableList.isTable==1){
			    sortContainer=$('#refreshPart')[0];
				sortStatisticsTemp=html.sortStatisticsTemp;
				sortStatistics=document.querySelector('#sortStatistics');
			if(!sortStatistics){
				sortStatisticsDiv=document.createElement("div");
				sortStatisticsDiv.setAttribute('id',"sortStatistics");
				sortStatisticsDiv.innerHTML=html.sortStatisticsTemp;
				sortContainer.insertBefore(sortStatisticsDiv,sortContainer.childNodes[0]);
			}else {
				sortStatistics.innerHTML=html.sortStatisticsTemp;
			}
			if(M1FormUtils.haveNotCondition){
				header=document.querySelector('#header');
				header.innerHTML=html.headerTemp;
				if(header.querySelector('#header')){
					headerHTML=header.querySelector('#header').innerHTML;
					header.querySelector('#header').remove();
					header.innerHTML=headerHTML;
				}
				M1FormUtils.haveNotCondition=false;
			}
			if(cb){
				cb();
			}
			return;
		}
	} else {
		target = $(target_str);
		if (!target.length) {
			return;
		}
		if (target.length > 1) {
			for (var i = 0; i < target.length - 1; i++) {
				$(target[i]).remove();
			}
			target = $(target[i]);
		}
		var par = target.parent(); new_frame = $($.parseHTML(html));
	}

	/*var conDiv=document.createElement('div').innerHTML=html;
	var new_frame=$(conDiv);*/


	if (from == 'center') {
		target.after(html);
		cmp.RefreshHeader();
		document.getElementById("contentDiv").innerHTML="";
		target.remove();
		if (cb){
			cb();
		}
	} else if (from == 'right' || from == 'left') {
		var start = target.width() * (from == 'right' ? 1 : -1);
		new_frame.css('left', start);
		target.after(new_frame);
		cmp.RefreshHeader();
		document.getElementById("contentDiv").innerHTML="";
		target.imove(-start, 0, 200, function() {
			target.remove();
		});
		var flag=true;
		new_frame.imove(-start, 0, 200,function(){
			if (cb){
				cb();
			}
		},flag);

	} else if (from == 'bottom') {
		new_frame.css('top', par.height()).css('height', target.height());
		target.after(new_frame);
		cmp.RefreshHeader();
		document.getElementById("contentDiv").innerHTML="";
		new_frame.imove(0, -par.height(), 200, function() {
			target.remove();
			if (cb){
				cb();
			}
		});

	} else if (from == 'bottom_out') {
		target.before(new_frame);
		cmp.RefreshHeader();
		document.getElementById("contentDiv").innerHTML="";
		target.imove(0, par.height(), 200, function() {
			target.remove();
			if (cb){
				cb();
			}
		});
	}
};

/**
 * 页面转场地址分发管理
 */
(function() {
	var routes = [], _his = [], _pos, _ignore;
	window.Router = {
		set_routes : function(r) {
			routes = r;
		},
		history : function(index) {
//			return index <= 0 && _his.length + index - 1 >= 0 ? _his[_his.length+ index - 1] : '';
			_his.pop();
			return index <= 0 && _his.length + index - 1 >= 0 ? _his.pop() : '';
		},
		get_his: function () {
			return _his;
		},
		set_his: function (his) {
			_his=his;
		},
		set_ignore : function(str) {
			_ignore = new RegExp(str);
		},
		record : function(hash) {
			if (!(_ignore && _ignore.test(hash))) {
				_his[_his.length] = hash;
			}
			if (_his.length > 150)
				_his.slice(-100);
		},
		removeAll : function() {
			//_his = [];
			_his = _his.slice(0,1);
		},
		his_length : function() {
			//_his = [];
			//_his = _his.slice(0,1);
			return _his.length;
		},
		set_position : function(pos) {
			_pos = {};
			for (var i = 0; i < pos.length; i++) {
				var p = pos[i][1];
				_pos[pos[i][0]] = {
					reLeft : new RegExp((p['leftOf'] || [ '$.' ]).join('|')),
					reRight : new RegExp((p['rightOf'] || [ '$.' ]).join('|')),
					reAbove : new RegExp((p['above'] || [ '$.' ]).join('|')),
					reBelow : new RegExp((p['below'] || [ '$.' ]).join('|'))
				}
			}
		},
		get_position : function(page, lastHash) {
			return !_pos[page] ? 'center'
					: _pos[page].reLeft.test(lastHash) ? 'left'
							: _pos[page].reRight.test(lastHash) ? 'right'
									: _pos[page].reAbove.test(lastHash) ? 'bottom_out'
											: _pos[page].reBelow.test(lastHash) ? 'bottom'
													: 'center';
		},
		get_back_from : function(pattern) {
			while (_his.length) {
				var hash = _his.pop();
				if (hash === '#login') {
					continue;
				}
				if (!(new RegExp(pattern)).test(hash)) {
					Router.record(location.hash);
					location.hash = hash;
					return;
				}
			}
		},
		check_url : function(hash) {
			if(!M1FormUtils.jumpLocked){
				return;
			}
			if(!hash){
				if(Router.get_his().length>0){
					hash=Router.get_his()[Router.get_his().length-1];
				}else {
					hash="#";
				}
			}
			$.event.trigger('check_url');

			var match, re;
			Router.record(hash);
			for (var i = 0; i < routes.length; i++) {
				re = new RegExp(routes[i][0].replace('/', '\\\/'));
				match = re.exec(hash);
				if (match){
					M1FormUtils.jumpLocked=false;
					return routes[i][1](match);
				}

			}
			alert("not macth url,url="+location.hash);
		}
	};

	document.addEventListener("formqueryreport_nextpage", function (e) {
		var hash='#'+e.data;
		Router.check_url(hash);
	});
	//$(window).bind('hashchange', Router.check_url);

	/**
	 * 模版引擎
	 */
	var cache = {};
	cmp.tmpl = function(str, data) {
		data = data || {};
		if (str[0] == '#')
			str = $(str).html();
		str = str.trim();
		var fn = cache[str]
				|| new Function("o", "var p=[];with(o){p.push('"
						+ str.replace(/[\r\t\n]/g, " ").replace(
								/'(?=[^%]*%})/g, "\t").split("'").join("\\'")
								.split("\t").join("'").replace(/{%=(.+?)%}/g,
										"',$1,'").split("{%").join("');")
								.split("%}").join("p.push('")
						+ "');}return p.join('');");
		return fn.apply(data, [ data ]);
	};
})();