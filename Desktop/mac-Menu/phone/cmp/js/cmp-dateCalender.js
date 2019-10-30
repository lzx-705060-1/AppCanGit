/************
 * 日历控件
 * **********/
;(function(cmp){
	/*************滑动**************/
	//判断是pc端还是移动端
	var isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
		hasTouch = 'ontouchstart' in window && !isTouchPad,
		START_EV = hasTouch ? 'touchstart' : 'mousedown',
		MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
		END_EV = hasTouch ? 'touchend' : 'mouseup';
	//获得CSS3前缀
	var _elementStyle = document.createElement('div').style;
	var _vendor = function (style) {
		if(style in _elementStyle) return style;
		var vendors = ['webkit', 'Moz', 'ms', 'O'],
			i = 0,
			l = vendors.length;

		for ( ; i < l; i++ ) {
			var _style=vendors[i] + style.charAt(0).toUpperCase() + style.substr(1);
			if ( _style in _elementStyle ) return vendors[i];
		}
		return false;
	};
	function css3Style(style) {
		var vendor=_vendor(style);
		if ( vendor === false ) return false;
		if ( vendor === style ) return style;
		return vendor + style.charAt(0).toUpperCase() + style.substr(1);
	}
	//常用css3参数
	var _transform=css3Style("transform");
	var _transition=css3Style("transition");
	var _transformOrigin=css3Style("transformOrigin");

	function Move(ele,options){
		//参数
		this.ele=typeof ele==="object"?ele:document.querySelector(ele);
		this.options={
			zoom:false,
			scale:false,
			//参数
			zoomNum:1,
			minZoom:1,
			maxZoom:5,
			minX:0,
			minY:0,
			maxX:0,
			maxY:0,
			onRefresh:null,
			useCapture:true
		};
		for (i in options) this.options[i] = options[i];
		this.refresh();
		this.events();

	}
	//刷新数据
	Move.prototype.refresh=function(){
		if (this.options.onRefresh) this.options.onRefresh.call(this);
	};
	//获取匹配元素在当前视口的相对偏移
	Move.prototype.offset=function(){
		if ( !this.ele ) return null;
		var box = this.ele.getBoundingClientRect(),
		top  = box.top  + window.pageYOffset,
		left = box.left + window.pageXOffset;
		return {left:left, top:top};
	};
	//获取css3矩形变换值
	Move.prototype.transform=function(){
		var matrix = window.getComputedStyle(this.ele, null)[_transform],
			x, y, sx, sy , deg ,skX ,skY;
		if(matrix=="none" || !matrix) return { x: 0, y: 0, sx:1, sy:1, deg:0, skX:0, skY:0};
		var str=matrix.match(/\(.+?\)/g)[0];
		matrix = str.substring(1,(str.length-1)).split(",");
		if(matrix.length==6){
			x = +(matrix[4]);
			y = +(matrix[5]);
			sx = +(matrix[0]);
			sy = +(matrix[3]);
			deg=Math.round(Math.acos(+(matrix[0]))/Math.PI*180);
			skX=Math.round(Math.atan(+(matrix[2]))/Math.PI*180);
			skY=Math.round(Math.atan(+(matrix[1]))/Math.PI*180);
		}else{
			x = +(matrix[12]);
			y = +(matrix[13]);
			sx = +(matrix[0]);
			sy = +(matrix[5]);
		}
		return { x: x, y: y, sx:sx, sy:sy, deg:deg, skX:skX, skY:skY};
	};
	//滑动开始
	Move.prototype.start=function(event){
		this.options.scale=false;
		var touch = hasTouch ? event.targetTouches[0] : event;
		if(hasTouch && event.touches.length > 1){
			this.options.scale=true;
			if(this.options.zoom){
				var touch1 = event.touches[0];
				var touch2 = event.touches[1];
				var moveX=touch1.pageX-touch2.pageX;
				var moveY=touch1.pageY-touch2.pageY;
				var c1=Math.abs(moveX);
				var c2=Math.abs(moveY);
				this.options.touchesDistStart = Math.sqrt(c1*c1+c2*c2);
				this.options.scaleStart=this.options.zoomNum;

				var pageX=touch2.pageX+moveX/2;
				var pageY=touch2.pageY+moveY/2;
				var offsetX=this.offset().left;
				var offsetY=this.offset().top;
				this.options.x0=pageX-offsetX+this.transform().x;
				this.options.y0=pageY-offsetY+this.transform().y;
				this.options.x1=(this.options.x0-this.transform().x)/this.options.zoomNum;
				this.options.y1=(this.options.y0-this.transform().y)/this.options.zoomNum;
			}
		}else{
			this.options.scale=false;
			//取第一个touch的坐标值
			this.startPos = {
				events:event,
				pageX:touch.pageX,
				pageY:touch.pageY,
				time:+new Date,
				zoomNum:this.options.zoomNum,
				translateX:this.transform().x,
				translateY:this.transform().y
			};
			//判断横向滑动还是纵向滑动
			this.options.prePageX = touch.pageX;
			this.options.prePageY = touch.pageY;
			if(this.options.startFn){
				this.options.startFn.call(this,this.startPos);
			}
		}
	};
	//移动
	Move.prototype.move=function(event){
		var touch = hasTouch ? event.targetTouches[0] : event;
		if(hasTouch && event.touches.length > 1){
			if(this.options.zoom){
				var touch1 = event.touches[0];
				var touch2 = event.touches[1];
				var moveX=touch1.pageX-touch2.pageX;
				var moveY=touch1.pageY-touch2.pageY;
				var c1=Math.abs(moveX);
				var c2=Math.abs(moveY);
				this.options.touchesDist = Math.sqrt(c1*c1+c2*c2);
				this.options.zoomNum = this.options.touchesDist / this.options.touchesDistStart *this.options.scaleStart;
				if(this.options.zoomNum < this.options.minZoom) this.options.zoomNum = this.options.minZoom;
				else if(this.options.zoomNum > this.options.maxZoom) this.options.zoomNum = this.options.maxZoom;

				var x=this.options.x1*this.options.zoomNum-this.options.x0;
				var y=this.options.y1*this.options.zoomNum-this.options.y0;

				if(this.options.zoomFn){
					this.zoomPos={
						events:event,
						x:-x,
						y:-y,
						zoomNum: this.options.zoomNum
					}
					this.options.zoomFn.call(this,this.zoomPos);
				}
			}
		}else{
			this.movePos = {
				events:event,
				x:touch.pageX - this.startPos.pageX,
				y:touch.pageY - this.startPos.pageY,
				scale:this.options.scale,
				zoomNum: this.options.zoomNum,
				startPointX:this.startPos.translateX,
				startPointY:this.startPos.translateY,
				translateX:this.transform().x,
				translateY:this.transform().y,
				deltaX:touch.pageX-this.options.prePageX,
				deltaY:touch.pageY-this.options.prePageY
			};
			this.isScrolling = Math.abs(touch.pageX-this.options.prePageX) < Math.abs(touch.pageY-this.options.prePageY) ? 1:0;    //isScrolling为1时，表示纵向滑动，0为横向滑动
			this.options.prePageX = touch.pageX;
			this.options.prePageY = touch.pageY;
			if(this.options.moveFn){
				this.options.moveFn.call(this,this.movePos,this.isScrolling);
			}
		}
	};
	//滑动释放
	Move.prototype.end=function(event){
		var touch = hasTouch ? event.changedTouches[0] : event;
		this.endPos = {
			events:event,
			x:touch.pageX - this.startPos.pageX,
			y:touch.pageY - this.startPos.pageY,
			duration:Number(+new Date - this.startPos.time),
			scale:this.options.scale,
			zoomNum: this.options.zoomNum,
			startPointX:this.startPos.translateX,
			startPointY:this.startPos.translateY,
			translateX:this.transform().x,
			translateY:this.transform().y
		};
		if(this.options.endFn){
			this.options.endFn.call(this,this.endPos,this.isScrolling);
		}
	};

	//事件
	Move.prototype.events=function(){
		//绑定事件
		var that=this;
		//开始
		function _start(event){
			that.start(event);   
			that.ele.addEventListener(MOVE_EV,_move,that.options.useCapture);
			that.ele.addEventListener(END_EV,_end,that.options.useCapture);
		}
		//滑动
		function _move(event){
			that.move(event);
		}
		//结束
		function _end(event){
			that.end(event);
			that.ele.removeEventListener(MOVE_EV,_move,that.options.useCapture);
			that.ele.removeEventListener(END_EV,_end,that.options.useCapture);
		}
		that.ele.addEventListener(START_EV,_start,that.options.useCapture);
	};


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

	function DateCalender(ele,options){
		var date=new Date();
		var lang=cmp.language;
		this.ele=document.querySelector(ele);
		this.options=cmp.extend({
			y:date.getFullYear(),
			m:date.getMonth()+1,
			d:date.getDate(),
			type:"week",
			yText:'年',
			mText:'月',
			dText:'日',
			nText:'今天',
			wArr:['日','一','二','三','四','五','六'],
			mArr:[31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
			orderD:[],  //["2016-12-07","2016-12-10"]
			beginYear:2000, //开始年
			endYear:2050, //结束年
            uichangeToCallback:true,//是否只要ui改变了就要回调函数
			dateSwitch:true//是否点击日期切换按钮就切换日期
		},options);
		if(lang==="en"){
            this.options =  cmp.extend(this.options,{
				yText:'Year',
				mText:'Month',
				dText:'Day',
				nText:'today',
				wArr:['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
			});
		}

		//今天
		this.options.nowDate=this.dateStr(date.getFullYear(),date.getMonth()+1,date.getDate());
        var choosedDate = this.dateStr(this.options.y,this.options.m,this.options.d);
        this.choosedDate = choosedDate == this.options.nowDate?null:choosedDate;//判断是否已经有已选日期了
		this.init();
		this.events();
	}
	//刷新
	DateCalender.prototype.refresh=function(options){
        options = cmp.extend(this.options,options);
		this.setTitle(this.options.y,this.options.m,this.options.d);
        if(typeof options == "undefined"){
            var now = new Date(), ny = now.getFullYear(),nm = now.getMonth() + 1,nd = now.getDate();
            this.options.selectDate = this.dateStr(ny,nm,nd);
        }else {
            this.options.selectDate = this.dateStr(options.y,options.m,options.d);
        }


		if(this.options.type==="week"){
			this.weekRender(this.options.y,this.options.m,this.options.d);
			removeClass(this.show,"hide");
		}else if(this.options.type==="month"){
			this.monthRender(this.options.y,this.options.m);
			addClass(this.show,"hide");
		}
	};
    //重置预定数据----供开发者调用
    DateCalender.prototype.setOrderD = function(orderDs){
        var self = this;
        self.options.orderD = orderDs;
        self.orderD2Map();
        var li=self.content.querySelectorAll(".li1")[-self.pos];
        var dateBlock = li.querySelector(".ul_dateBlock");
        var dateLiDoms = dateBlock.querySelectorAll("li");
        var orderLiDoms = dateBlock.querySelectorAll(".order");
        if(orderLiDoms.length > 0){
            var j = 0,length = orderLiDoms.length;
            for(;j<length;j++){
                removeClass(orderLiDoms[j],"order");

            }
        }
        if(orderDs.length > 0){
            var i = 0,len = dateLiDoms.length,count = Object.keys(self.orderDMap).length;
            for(;i<len;i++){
                if(!count) break;
                var key = dateLiDoms[i].getAttribute("data-ymd");
                if(self.orderDMap[key]){
                    addClass(dateLiDoms[i],"order");
                    count --
                }
            }
        }

    };
	//初始化
	DateCalender.prototype.init=function(){
		var that=this;
		var weekHtml="";
		for(var i=0,len=that.options.wArr.length;i<len;i++){
			weekHtml+='<li class="week">'+that.options.wArr[i]+'</li>';
		}
		/*头部*/
		var hHtml='<div class="cmp-dtcHeader">'
						+'<div class="title dateswitch"></div>'
						+'<div class="right today">'+this.options.nText+'</div>'
					+'</div>';

		/*内容*/
		var cHtml='<div class="cmp-dtcContent">'
					+'<ul class="ul_weekLine">'+weekHtml+'</ul>'
					+'<ul class="ul_content">'
					+'</ul>'
					+'<div class="show"><i class="m3-icon-unorup"></i></div>'
				+'</div>';
		this.ele.innerHTML=hHtml+cHtml;
		this.title=this.ele.querySelector(".title");
		this.today=this.ele.querySelector(".today");
        this.dateswitch = this.ele.querySelector(".dateswitch");
		this.content=this.ele.querySelector(".ul_content");
		this.show=this.ele.querySelector(".show");
		this.box=this.ele.querySelector(".cmp-dtcContent");
		this.boxW=this.box.offsetWidth;
        this.orderD2Map();
		this.refresh();

        this.callback(this.options.y,this.options.m,this.options.d);


	};
    DateCalender.prototype.orderD2Map = function(){
        var self = this;
        self.orderDMap = {};
        if(self.options.orderD && self.options.orderD.length > 0){
            var i = 0,len = self.options.orderD.length;
            for(;i<len;i++){
                self.orderDMap[self.options.orderD[i]] = self.options.orderD[i];
            }
        }
    };
	//设置头部标题
	DateCalender.prototype.setTitle=function(y,m,d){
		var lang=cmp.language;
		var moths = ['January','February','March','April','May','June','July',
			'August','September','October','November','December'];
		var i= 0,len=moths.length;
		if(lang === "en"){  //英文状态
			for(i;i<len;i++){
				this.title.innerHTML='On '+ moths[(m-1)] + d +', '+ y;
			}
		}else{
			this.title.innerHTML=y+this.options.yText+m+this.options.mText+d+this.options.dText;
		}
	};
	//时间格式
	DateCalender.prototype.dateStr=function(y,m,d){
		m=m<10?"0"+m:m;
		d=d<10?"0"+d:d;
		var dateStr=y+"-"+m+"-"+d;
		return dateStr;
	};
	//时间对象
	DateCalender.prototype.dateObj=function(str){
		var arr=str.split("-");
		return [+arr[0],+arr[1],+arr[2]];
	};
	//是否是平年
	DateCalender.prototype.IsPinYear=function(year){
		return(0 == year%4 && (year%100 !=0 || year%400 == 0));
	};
	//当前月
	DateCalender.prototype.mDays=function(y,m){
		var n = this.options.mArr[m-1];
		if (m==2 && this.IsPinYear(y)) n++;
		return n;
	};
	//单个节点
	DateCalender.prototype.li=function(y,m,d,gray){
		if(y===0){
			return '<li class="date null"></li>';
		}
		var date= new Date(y,m-1,d);
		var dateStr=this.dateStr(y,m,d);
		var liClass="date";
		if(dateStr===this.options.nowDate){
			liClass+=" now";
            if(this.options.type == "week" && !this.choosedDate){
                liClass += " selected";
            }
		}

		if(dateStr===this.options.selectDate){
            liClass+=" selected";
		}
        if(dateStr === this.choosedDate){
            liClass += " choosed";
        }
        if(this.orderDMap[dateStr]){
            liClass+=" order";
        }

		if(gray){
			liClass+=" gray";
		}
		if(d===1){
			liClass+=" first";
		}

		var LunarDate = {
			madd: new Array(0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334),
			HsString: '甲乙丙丁戊己庚辛壬癸',
			EbString: '子丑寅卯辰巳午未申酉戌亥',
			NumString: "一二三四五六七八九十",
			MonString: "正二三四五六七八九十冬腊",
			CalendarData: new Array(0xA4B, 0x5164B, 0x6A5, 0x6D4, 0x415B5, 0x2B6, 0x957, 0x2092F, 0x497, 0x60C96, 0xD4A, 0xEA5, 0x50DA9, 0x5AD, 0x2B6, 0x3126E, 0x92E, 0x7192D, 0xC95, 0xD4A, 0x61B4A, 0xB55, 0x56A, 0x4155B, 0x25D, 0x92D, 0x2192B, 0xA95, 0x71695, 0x6CA, 0xB55, 0x50AB5, 0x4DA, 0xA5B, 0x30A57, 0x52B, 0x8152A, 0xE95, 0x6AA, 0x615AA, 0xAB5, 0x4B6, 0x414AE, 0xA57, 0x526, 0x31D26, 0xD95, 0x70B55, 0x56A, 0x96D, 0x5095D, 0x4AD, 0xA4D, 0x41A4D, 0xD25, 0x81AA5, 0xB54, 0xB6A, 0x612DA, 0x95B, 0x49B, 0x41497, 0xA4B, 0xA164B, 0x6A5, 0x6D4, 0x615B4, 0xAB6, 0x957, 0x5092F, 0x497, 0x64B, 0x30D4A, 0xEA5, 0x80D65, 0x5AC, 0xAB6, 0x5126D, 0x92E, 0xC96, 0x41A95, 0xD4A, 0xDA5, 0x20B55, 0x56A, 0x7155B, 0x25D, 0x92D, 0x5192B, 0xA95, 0xB4A, 0x416AA, 0xAD5, 0x90AB5, 0x4BA, 0xA5B, 0x60A57, 0x52B, 0xA93, 0x40E95),
			Year: null,
			Month: null,
			Day: null,
			TheDate: null,
			GetBit: function(m, n){
				return (m >> n) & 1;
			},
			e2c: function(){
				this.TheDate = (arguments.length != 3) ? new Date(): new Date(arguments[0], arguments[1], arguments[2]);
				var total, m, n, k;
				var isEnd = false;
				var tmp = this.TheDate.getFullYear();
				total = (tmp - 1921) * 365 + Math.floor((tmp - 1921) / 4) + this.madd[this.TheDate.getMonth()] + this.TheDate.getDate() - 38;
				if (this.TheDate.getYear() % 4 == 0 && this.TheDate.getMonth() > 1) {
					total++;
				}
				for (m = 0; ; m++) {
					k = (this.CalendarData[m] < 0xfff) ? 11: 12;
					for (n = k; n >= 0; n--) {
						if (total <= 29 + this.GetBit(this.CalendarData[m], n)) {
							isEnd = true;
							break;
						}
						total = total - 29 - this.GetBit(this.CalendarData[m], n);
					}
					if (isEnd)
						break;
				}
				this.Year = 1921 + m;
				this.Month = k - n + 1;
				this.Day = total;
				if (k == 12) {
					if (this.Month == Math.floor(this.CalendarData[m] / 0x10000) + 1) {
						this.Month = 1 - this.Month;
					}
					if (this.Month > Math.floor(this.CalendarData[m] / 0x10000) + 1) {
						this.Month--;
					}
				}
			},
			GetcDateString: function(){
				var tmp = "";
				//tmp += this.HsString.charAt((this.Year - 4) % 10);
				//tmp += this.EbString.charAt((this.Year - 4) % 12);
				//tmp += "年 ";
				var MonthString = '';
				if(this.Day == 1){
					if (this.Month < 1) {
						MonthString += "(闰)";
						MonthString += this.MonString.charAt(-this.Month - 1);
					} else {
						MonthString += this.MonString.charAt(this.Month - 1);
					}
					MonthString += "月";
				}

				tmp += (this.Day == 1 ) ? MonthString : ((this.Day < 11) ? "初": ((this.Day < 20) ? "十": (this.Day == 20) ? "二十" :  ((this.Day < 30) ? "廿": "三十")   ));
				if(this.Day != 1){
					if (this.Day % 10 != 0 || this.Day == 10) {
						tmp += this.NumString.charAt((this.Day - 1) % 10);
					}
				}
				return tmp;
			},
			GetLunarDay: function(solarYear, solarMonth, solarDay) {
				if (solarYear < 1921 || solarYear > 2050) {
					return "";
				} else {
					solarMonth = (parseInt(solarMonth) > 0) ? (solarMonth - 1): 11;
					this.e2c(solarYear, solarMonth, solarDay);
					return this.GetcDateString();
				}
			}
		};
		var li='<li class="'+liClass+'" data-ymd='+dateStr+'>';
			if(cmp.language == "zh-CN"){
				li += '<div class="number-day">'+d;
				li += '<span class="lunar-week">'+LunarDate.GetLunarDay(y, m, d)+'</span>';
			}else {
				li += '<div class="number-day" style="line-height: 40px;">'+d;
			}
			li += '<i class="dot"></i></div>'
				+'</li>';
		return li;
	};
	//拼字符串
	DateCalender.prototype.ulHtml=function(arrs,y,m,d){
			var cHtml="",ulHtml="";
		var dateStr=this.dateStr(y,m,d);

		for(var i=0,len=arrs.length;i<len;i++){
			ulHtml+='<ul class="ul_dateLine cmp-after-line">';
			for(var j=0,jlen=arrs[i].length;j<jlen;j++){
				ulHtml+=this.li.apply(this,arrs[i][j]);
			}
			ulHtml+='</ul>';
		}
		cHtml+='<li class="li1" style="width:'+this.boxW+'px" data-ymd='+dateStr+'>'
					+'<div class="ul_dateBlock">'+ulHtml+'</div>'
				+'</li>';
		return cHtml;
	};
	//周
	DateCalender.prototype.weekRender=function(y,m,d,choosed){
		var cHtml="";
		var pWeek=[[]],cWeek=[[]],nWeek=[[]];
		var pWeek=this.weekHtml(y,m,d,-1);
		var cWeek=this.weekHtml(y,m,d,0);
		var nWeek=this.weekHtml(y,m,d,1);
		cHtml=pWeek+cWeek+nWeek;
		this.content.innerHTML=cHtml;
		if(!pWeek){
			this.isBegin=true;
			this.pos=0;
		}else{
			this.isBegin=false;
			this.pos=-1;
		}
		if(!nWeek){
			this.isEnd=true;
		}else{
			this.isEnd=false;
		}
		this.content.style[_transform]='translate('+(this.pos*this.boxW)+'px,0px)';
		var index=this.content.querySelectorAll(".li1").length;
		this.content.style['width']=this.boxW*index+'px';
	}
	//周html
	DateCalender.prototype.weekHtml=function(y,m,d,num){
		var date= new Date(y,m-1,d);
		var index=date.getDay();
		var wArr=[[]];
		var pDays=this.pDays(y,m,d,(7+index));
		var nDays=this.nDays(y,m,d,(13-index));
		var allDays=[];
		var cHtml="";
		pDays.forEach(function(day){
			allDays.push(day);
		});
		allDays.push([y,m,d]);
		nDays.forEach(function(day){
			allDays.push(day);
		});

		var startD=allDays[7*num+7];
		var endD=allDays[7*num+13];
		if(!endD[0]&&!startD[0]){
			return "";
		}else{
			for(var i=0;i<7;i++){
				wArr[0].push(allDays[7*num+7+i]);
			}
		}
		return this.ulHtml(wArr,endD[0]||startD[0],endD[1]||startD[1],endD[2]||startD[2]);
	};
	//月
	DateCalender.prototype.monthRender=function(y,m){
		var cHtml="";
		var pMouth=this.mouthHtml(y,m,-1);
		var cMouth=this.mouthHtml(y,m,0);
		var nMouth=this.mouthHtml(y,m,1);
		cHtml=pMouth+cMouth+nMouth;
		this.content.innerHTML=cHtml;
		if(!pMouth){
			this.isBegin=true;
			this.pos=0;
		}else{
			this.isBegin=false;
			this.pos=-1;
		}
		if(!nMouth){
			this.isEnd=true;
		}else{
			this.isEnd=false;
		}
		this.content.style[_transform]='translate('+(this.pos*this.boxW)+'px,0px)';
		var index=this.content.querySelectorAll(".li1").length;
		this.content.style['width']=this.boxW*index+'px';

	};
	//月html
	DateCalender.prototype.mouthHtml=function(y,m,num){ //不会出现联跳两个月的情况
		var mArr=[];
		var yy,mm=m+num;
		if(mm<1){
			yy=y-1;
			mm=12;
		}else if(mm>12){
			yy=y+1;
			mm=1;
		}else{
			yy=y;
		}

		if(yy<this.options.beginYear){
			return "";
		}else if(yy>this.options.endYear){
			return "";
		}

		var date= new Date(yy,mm-1,1);
		var index=date.getDay();
		var pDays=this.pDays(yy,mm,1,index);
		var nDays=this.nDays(yy,mm,1,(41-index));
		var mDays=this.mDays(yy,mm);
		var allDays=[];
		var cHtml="";
		pDays.forEach(function(day){
			day.push(true);
			allDays.push(day);
		});
		allDays.push([yy,mm,1]);
		nDays.forEach(function(day,i){
			if(i>=(mDays-1)){
				day.push(true);
			}
			allDays.push(day);
		});
		for(var i=0;i<6;i++){
			if(!mArr[i]){
				mArr[i]=[];
			}
			for(var j=0;j<7;j++){
				mArr[i].push(allDays[i*7+j]);
			}
		}
		return this.ulHtml(mArr,yy,mm,1);

	};
	//前面的几天
	DateCalender.prototype.pDays=function(y,m,d,len){
		var pDaysArr=[];
		if(d>len){
			for(var i=0;i<len;i++){
				var num=len-i;
				var ymd=[y,m,d-num];
				pDaysArr.push(ymd);
			}
		}else{
			var ymd,mm,yy,dd;
			if(m==1){
				mm=12;
				yy=y-1;
			}else{
				mm=m-1;
				yy=y;
			}
			var pDays=this.mDays(yy,mm);

			for(var i=1;i<=len;i++){
				if(d-i>=1){
					ymd=[y,m,d-i];
				}else{
					dd=pDays+d-i;
					ymd=[yy,mm,dd];
					if(yy<this.options.beginYear){
						ymd=[0,0,0];
					}
				}
				pDaysArr.unshift(ymd);
			}
		}
		return pDaysArr;
	};
	//后面的几天
	DateCalender.prototype.nDays=function(y,m,d,len){
		var nDaysArr=[];
		if(d+len<=days){
			for(var i=1;i<=len;i++){
				var ymd=[y,m,d+i];
				nDaysArr.push(ymd);
			}
		}else{
			var ymd,mm,yy,dd;
			var days=this.mDays(y,m);
			if(m==12){
				mm=1;
				yy=y+1;
			}else{
				mm=m+1;
				yy=y;
			}

			for(var i=1;i<=len;i++){
				if(d+i<=days){
					ymd=[y,m,d+i];
				}else{
					dd=d+i-days;
					ymd=[yy,mm,dd];
					if(yy>this.options.endYear){
						ymd=[0,0,0];
					}
				}
				nDaysArr.push(ymd);
			}
		}
		return nDaysArr;
	};
	//回调函数
	DateCalender.prototype.callback=function(y,m,d){
		var that = this;
		var data= this.assemblyResult(y,m,d);
		var cmp_dtcContent = that.ele.querySelector('.cmp-dtcContent');
		var ul_weekLine = cmp_dtcContent.querySelector('.ul_weekLine');
		var ul_dateBlock = that.content.querySelectorAll('.li1')[1].querySelector('.ul_dateBlock');
		var ul_dateLine = ul_dateBlock.querySelectorAll('.ul_dateLine');
		var lastUl = ul_dateLine[ul_dateLine.length-1];

		if(that.options.type == "month" ){   //月视图
			var dateAll = lastUl.querySelectorAll('.gray');
			if(dateAll.length == 7){
				lastUl.remove();
				cmp_dtcContent.style.height = "360px";
				that.content.style.height = "300px";
			}else{
				cmp_dtcContent.style.height = "auto";
				that.content.style.height = "auto";
			}

		}else if(that.options.type == "week"){  //周视图
			var choosed = ul_dateLine[0].querySelector('.choosed');
			var selected = ul_dateLine[0].querySelector('.selected');
			var now = ul_dateLine[0].querySelector('.now');
			var date=new Date();
			if(that.choosedDate && choosed){  //传递了值得情况
				var choosedYMD = that.dateObj(that.choosedDate);
				that.setTitle(choosedYMD[0],choosedYMD[1],choosedYMD[2]);
				data.y = choosedYMD[0];
				data.m = choosedYMD[1];
				data.d = choosedYMD[2];
			}else{
				if(!selected){
					var first=that.ele.querySelectorAll(".li1")[0];
					var firstYMD=that.dateObj(first.getAttribute("data-ymd"));
					ul_dateLine[0].querySelectorAll('.date')[0].classList.add('selected');
					if(date.getFullYear() == firstYMD[0] && (date.getMonth()+1) ==firstYMD[1] && (date.getDate()+1) == (firstYMD[2]+1) ){
						that.setTitle(date.getFullYear(),(date.getMonth()+1),date.getDate()+1);
						data.y = date.getFullYear();
						data.m = (date.getMonth()+1);
						data.d = date.getDate()+1;
					}else{
						firstYMD = that.transeDiffDate4Title(firstYMD);
						that.setTitle(firstYMD[0],firstYMD[1],firstYMD[2]);
						data.y = firstYMD[0];
						data.m = firstYMD[1];
						data.d = firstYMD[2];
					}
				}else{
					that.setTitle(date.getFullYear(),(date.getMonth()+1),date.getDate());
					if(!(data.y && data.m && data.d)){
						data.y = date.getFullYear();
						data.m = date.getMonth()+1;
						data.d = date.getDate();
					}

				}
			}
			cmp_dtcContent.style.height = "auto";
			that.content.style.height = "auto";

		}

        if(typeof this.options.callback==="function") this.options.callback.call(this,data);
	};
	DateCalender.prototype.transeDiffDate4Title= function(firstYMD){
		var bigM = [1,3,5,7,8,10,12];
		var smallM = [4,6,9,11];
		var y =firstYMD[0], m = firstYMD[1],d = firstYMD[2];
		if(bigM.indexOf(m) != -1){
			if(d == 31){
				if(m == 12){
					firstYMD[0] ++;
					firstYMD[1]=1;
					firstYMD[2]=1;
				}else {
					firstYMD[1] ++;
					firstYMD[2]=1;
				}
			}else {
				firstYMD[2] ++;
			}
		}else if(smallM.indexOf(m) != -1){
			if(d == 30){
				firstYMD[1] ++;
				firstYMD[2]=1;
			}else {
				firstYMD[2] ++;
			}
		}else {
			var febDayNum = ((y%4 == 0 && y%100 != 0) || y%400 == 0)?29:28;
			if(d == febDayNum){
				firstYMD[1] ++;
				firstYMD[2]=1;
			}else {
				firstYMD[2] ++;
			}
		}
		return firstYMD;
	};
	//初始化
	DateCalender.prototype.events=function(){
		var that=this;
		var transitionend="ontransitionend" in window?'transitionend':'onwebkittransitionend';
		new Move(this.content,{
			startFn:function(obj){
				this.ele.style[_transition]="all 0ms";
				this.ele.style[_transform]="translate("+obj.translateX+"px,0px) translateZ(0px)";
			},
			moveFn:function(obj,isScrolling){
				if(obj.scale) return;  //多个触摸点的时候禁止滑动

				if(isScrolling === 0){
					obj.events.preventDefault();  //阻止默认事件
					var newX=obj.translateX+obj.deltaX;

					this.ele.style[_transform]="translate("+newX+"px,0px) translateZ(0px)";
				}

			},
			endFn:function(obj,isScrolling){
				var length=this.ele.querySelectorAll(".li1").length;
				var first=this.ele.querySelectorAll(".li1")[0];
				var firstYMD=that.dateObj(first.getAttribute("data-ymd"));
				var last=this.ele.querySelectorAll(".li1")[length-1];
				var lastYMD=that.dateObj(last.getAttribute("data-ymd"));
				//右
				if(obj.x>50){
					if(that.isBegin){
						this.ele.style[_transition]="all 60ms cubic-bezier(0.1, 0.57, 0.1, 1)";
						this.ele.style[_transform]="translate(0px,0px) translateZ(0px)";
					}else{
						this.ele.style[_transition]="all 300ms";
						this.ele.style[_transform]="translate(0px,0px) translateZ(0px)";
						function _transitionendFirst(){
							this.style[_transition]="all 0ms";
                            var preDomSelected = first.querySelector("li.choosed");
                            var choosedYMD = [null,null,null];
							//周
							if(that.options.type==="week"){
                                if(preDomSelected) {
                                    that.options.selectDate = that.choosedDate;
                                    choosedYMD = that.dateObj(that.choosedDate);
                                }
                                that.weekRender(firstYMD[0],firstYMD[1],firstYMD[2]);
							}else if(that.options.type==="month"){
								that.setTitle(firstYMD[0],firstYMD[1],1);

                                if(preDomSelected){
                                    that.options.selectDate = that.choosedDate;
                                    choosedYMD = that.dateObj(that.choosedDate);
                                }else {
                                    that.options.selectDate = that.dateStr(firstYMD[0],firstYMD[1],1);
                                    firstYMD[2] = 1;
                                    choosedYMD = firstYMD;
                                }

								that.monthRender(firstYMD[0],firstYMD[1]);
							}
                            //if(that.options.uichangeToCallback){
                                that.callback(choosedYMD[0],choosedYMD[1],choosedYMD[2]);
                            //}
							this.removeEventListener(transitionend,_transitionendFirst,false);
						}
						this.ele.addEventListener(transitionend,_transitionendFirst,false);
					}
				}else if(obj.x<-50){ //左
					if(that.isEnd){
						this.ele.style[_transition]="all 60ms cubic-bezier(0.1, 0.57, 0.1, 1)";
						this.ele.style[_transform]="translate("+(-that.boxW)+"px,0px) translateZ(0px)";
					}else{
						this.ele.style[_transition]="all 300ms";
						this.ele.style[_transform]="translate("+(that.pos-1)*that.boxW+"px,0px) translateZ(0px)";
						function _transitionendLast(){
							this.style[_transition]="all 0ms";
							//周
                            var nextDomSelected = last.querySelector("li.choosed");
                            var choosedYMD = [null,null,null];
							if(that.options.type==="week"){
                                if(nextDomSelected) {
                                    that.options.selectDate = that.choosedDate;
                                    choosedYMD = that.dateObj(that.choosedDate);
                                }
                                that.weekRender(lastYMD[0],lastYMD[1],lastYMD[2]);

							}else if(that.options.type==="month"){
								that.setTitle(lastYMD[0],lastYMD[1],1);
                                if(nextDomSelected){
                                    that.options.selectDate = that.choosedDate;
                                    choosedYMD = that.dateObj(that.choosedDate);
                                }else {
                                    that.options.selectDate = that.dateStr(lastYMD[0],lastYMD[1],1);
                                    lastYMD[2] = 1;
                                    choosedYMD = lastYMD;
                                }
								that.monthRender(lastYMD[0],lastYMD[1]);
							}
                            //if(that.options.uichangeToCallback){
                                that.callback(choosedYMD[0],choosedYMD[1],choosedYMD[2]);
                            //}
							this.removeEventListener(transitionend,_transitionendLast,false);
						}
						this.ele.addEventListener(transitionend,_transitionendLast,false);
					}
				}else{
					this.ele.style[_transition]="all 60ms cubic-bezier(0.1, 0.57, 0.1, 1)";
					this.ele.style[_transform]="translate("+that.pos*that.boxW+"px,0px) translateZ(0px)";
				}


			}
		});

		//点击
		this.content.addEventListener("click",function(event){
			var parent = event.target;
			while ( parent && parent.nodeType !== 9) {
				if ( parent.nodeType === 1 && new RegExp("(^|\\s)date(\\s|$)", 'g').test(parent.className)) {
					var ymd=that.dateObj(parent.getAttribute("data-ymd"));
                    that.choosedDate = that.dateStr(ymd[0],ymd[1],ymd[2]);
					that.refresh({
						y:ymd[0],
						m:ymd[1],
						d:ymd[2]
					});
                    that.callback(ymd[0],ymd[1],ymd[2]);
					that.setTitle(ymd[0],ymd[1],ymd[2]);
					break;
				}
			parent = parent.parentNode;
			}
		},false);

		//今天
		that.today.addEventListener("click",function(event){
			var date=new Date();
			that.refresh({
				y:date.getFullYear(),
				m:date.getMonth()+1,
				d:date.getDate()
			});
			var mark = false;
            that.choosedDate = that.dateStr(date.getFullYear(),date.getMonth()+1,date.getDate());
            that.callback(date.getFullYear(),(date.getMonth()+1),date.getDate(),mark);
		},false);
		if(that.options.dateSwitch){
			//给日期切换按钮绑定事件
			cmp.event.click(that.dateswitch,function(){
				var datePicker = new cmp.DtPicker({
					type:"date",
					"value":that.dateStr(that.options.y,that.options.m,that.options.d),
					"beginYear":that.options.beginYear,
					"endYear":that.options.endYear
				});

				datePicker.show(function(rs) {
					var value = rs.value;
					var ymd=that.dateObj(value);
					that.choosedDate = that.dateStr(ymd[0],ymd[1],ymd[2]);
					that.refresh({
						y:ymd[0],
						m:ymd[1],
						d:ymd[2]
					});
					that.callback(ymd[0],ymd[1],ymd[2]);

				});
			});
		}



		//类型
		function typeChange(){
			var li=that.content.querySelectorAll(".li1")[-that.pos];
			var selectLi=li.querySelector(".selected");
			var selectObj=that.dateObj(that.options.selectDate);
			var y,m,d;
			if(selectLi){
				li=selectLi;
			}
			var ymd=that.dateObj(li.getAttribute("data-ymd"));
			if(ymd[0]===selectObj[0]&&ymd[1]===selectObj[1]){
				y=selectObj[0];
				m=selectObj[1];
				if(ymd[2] === selectObj[2]){
					d=selectObj[2];
				}else{
					d=ymd[2];
				}
			}else{
				y=ymd[0];
				m=ymd[1];
				d=1;
			}
			that.refresh({
				y:y,
				m:m,
				d:d
			});
            //if(that.options.uichangeToCallback){
            //
            //}
			that.callback(y,m,d);
			that.setTitle(y,m,d);
		}
        cmp.event.click(that.show,function(){
            if(that.options.type==="week"){
                that.options.type="month";
            }else if(that.options.type==="month"){
                that.options.type="week"
            }
            typeChange();

        });

		new Move(this.show,{
			startFn:function(obj){
				this.options.startH=that.box.offsetHeight;
			},
			moveFn:function(obj,isScrolling){
				if(obj.scale) return;  //多个触摸点的时候禁止滑动

				if(isScrolling === 1){
					obj.events.preventDefault();  //阻止默认事件
					var boxH=that.box.offsetHeight;
					boxH+=obj.deltaY/3;
					that.box.style["height"]=boxH+"px";
				}
			},
			endFn:function(obj,isScrolling){
				var boxH=that.box.offsetHeight;
				that.box.style["height"]="auto";
				if(that.options.type==="week"&&boxH-this.options.startH>5){
					that.options.type="month";
                    typeChange();
				}else if(that.options.type==="month"&&boxH-this.options.startH<-5){
					that.options.type="week";
                    typeChange();
				}
			}
		});
	};
    DateCalender.prototype.assemblyResult= function(y,m,d){
        var that = this;
        var selectedData;
        if(y != null && m != null && d != null){
            selectedData = that.dateStr(y,m,d);
        }
        var targetLi = that.content.querySelectorAll(".li1")[-that.pos];
        var dateLineUl = targetLi.querySelector("div.ul_dateBlock").querySelectorAll("ul.ul_dateLine");
        var beginLi = dateLineUl[0].firstChild;
        var lastLi = dateLineUl[dateLineUl.length-1].lastChild;
        var beginymd = that.dateObj(beginLi.getAttribute("data-ymd"));
        var endymd = that.dateObj(lastLi.getAttribute("data-ymd"));

        return {
            y:y,
            m:m,
            d:d,
            type:that.options.type,
            by:beginymd[0],
            bm:beginymd[1],
            bd:beginymd[2],
            ey:endymd[0],
            em:endymd[1],
            ed:endymd[2],

            value:selectedData
        };
    };
	cmp.DateCalender=DateCalender;
})(cmp);


