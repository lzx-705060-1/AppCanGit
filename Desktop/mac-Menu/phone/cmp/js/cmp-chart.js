window.JingleChart=JChart={version:"0.1",animationOptions:{linear:function(a){return a},easeInQuad:function(a){return a*a},easeOutQuad:function(a){return-1*a*(a-2)},easeInOutQuad:function(a){return(a/=.5)<1?.5*a*a:-0.5*(--a*(a-2)-1)},easeInCubic:function(a){return a*a*a},easeOutCubic:function(a){return 1*((a=a/1-1)*a*a+1)},easeInOutCubic:function(a){return(a/=.5)<1?.5*a*a*a:.5*((a-=2)*a*a+2)},easeInQuart:function(a){return a*a*a*a},easeOutQuart:function(a){return-1*((a=a/1-1)*a*a*a-1)},easeInOutQuart:function(a){return(a/=.5)<1?.5*a*a*a*a:-0.5*((a-=2)*a*a*a-2)},easeInQuint:function(a){return 1*(a/=1)*a*a*a*a},easeOutQuint:function(a){return 1*((a=a/1-1)*a*a*a*a+1)},easeInOutQuint:function(a){return(a/=.5)<1?.5*a*a*a*a*a:.5*((a-=2)*a*a*a*a+2)},easeInSine:function(a){return-1*Math.cos(a/1*(Math.PI/2))+1},easeOutSine:function(a){return 1*Math.sin(a/1*(Math.PI/2))},easeInOutSine:function(a){return-0.5*(Math.cos(Math.PI*a/1)-1)},easeInExpo:function(a){return 0==a?1:1*Math.pow(2,10*(a/1-1))},easeOutExpo:function(a){return 1==a?1:1*(-Math.pow(2,-10*a/1)+1)},easeInOutExpo:function(a){return 0==a?0:1==a?1:(a/=.5)<1?.5*Math.pow(2,10*(a-1)):.5*(-Math.pow(2,-10*--a)+2)},easeInCirc:function(a){return a>=1?a:-1*(Math.sqrt(1-(a/=1)*a)-1)},easeOutCirc:function(a){return 1*Math.sqrt(1-(a=a/1-1)*a)},easeInOutCirc:function(a){return(a/=.5)<1?-0.5*(Math.sqrt(1-a*a)-1):.5*(Math.sqrt(1-(a-=2)*a)+1)},easeInElastic:function(a){var b=1.70158,c=0,d=1;if(0==a)return 0;if(1==(a/=1))return 1;if(c||(c=.3),d<Math.abs(1)){d=1;var b=c/4}else var b=c/(2*Math.PI)*Math.asin(1/d);return-(d*Math.pow(2,10*(a-=1))*Math.sin((1*a-b)*(2*Math.PI)/c))},easeOutElastic:function(a){var b=1.70158,c=0,d=1;if(0==a)return 0;if(1==(a/=1))return 1;if(c||(c=.3),d<Math.abs(1)){d=1;var b=c/4}else var b=c/(2*Math.PI)*Math.asin(1/d);return d*Math.pow(2,-10*a)*Math.sin((1*a-b)*(2*Math.PI)/c)+1},easeInOutElastic:function(a){var b=1.70158,c=0,d=1;if(0==a)return 0;if(2==(a/=.5))return 1;if(c||(c=1*(.3*1.5)),d<Math.abs(1)){d=1;var b=c/4}else var b=c/(2*Math.PI)*Math.asin(1/d);return 1>a?-.5*(d*Math.pow(2,10*(a-=1))*Math.sin((1*a-b)*(2*Math.PI)/c)):d*Math.pow(2,-10*(a-=1))*Math.sin((1*a-b)*(2*Math.PI)/c)*.5+1},easeInBack:function(a){var b=1.70158;return 1*(a/=1)*a*((b+1)*a-b)},easeOutBack:function(a){var b=1.70158;return 1*((a=a/1-1)*a*((b+1)*a+b)+1)},easeInOutBack:function(a){var b=1.70158;return(a/=.5)<1?.5*(a*a*(((b*=1.525)+1)*a-b)):.5*((a-=2)*a*(((b*=1.525)+1)*a+b)+2)},easeInBounce:function(a){return 1-JChart.animationOptions.easeOutBounce(1-a)},easeOutBounce:function(a){return(a/=1)<1/2.75?1*(7.5625*a*a):2/2.75>a?1*(7.5625*(a-=1.5/2.75)*a+.75):2.5/2.75>a?1*(7.5625*(a-=2.25/2.75)*a+.9375):1*(7.5625*(a-=2.625/2.75)*a+.984375)},easeInOutBounce:function(a){return.5>a?.5*JChart.animationOptions.easeInBounce(2*a):.5*JChart.animationOptions.easeOutBounce(2*a-1)+.5}},requestAnimFrame:function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(a){window.setTimeout(a,1e3/60)}}(),isNumber:function(a){return!isNaN(parseFloat(a))&&isFinite(a)},isEqual:function(a,b,c){return c=void 0==c?10:c,a.toFixed(c)===b.toFixed(c)},capValue:function(a,b,c){return this.isNumber(b)&&a>b?b:this.isNumber(c)&&c>a?c:a},getDecimalPlaces:function(a){return a%1!=0?a.toString().split(".")[1].length:0},extend:function(a){function b(a,c){for(var d in c){var e=c[d];e instanceof Array?a[d]=b([],e):e instanceof Object?a[d]=b({},e):a[d]=e}return a}var c=Array.prototype.slice.call(arguments,1);return this.each(c,function(c,d){b(a,c)}),a},clone:function(a){var b;if("object"==typeof a)if(null===a)b=null;else if(a instanceof Array){b=[];for(var c=0,d=a.length;d>c;c++)b.push(this.clone(a[c]))}else{b={};for(var e in a)b[e]=this.clone(a[e])}else b=a;return b},each:function(a,b,c){for(var d=0,e=a.length;e>d;d++){var f=b.call(c,a[d],d,a);if(f!==!0&&f===!1)break}},getOffset:function(a){var b=a.getBoundingClientRect(),c=a.ownerDocument,d=c.body,e=c.documentElement,f=e.clientTop||d.clientTop||0,g=e.clientLeft||d.clientLeft||0,h=b.top+(self.pageYOffset||e.scrollTop||d.scrollTop)-f,i=b.left+(self.pageXOffset||e.scrollLeft||d.scrollLeft)-g;return{top:h,left:i}},hex2Rgb:function(a,b){var c,d,e;if(/rgb/.test(a)){var f=a.match(/\d+/g);c=parseInt(f[0]),d=parseInt(f[1]),e=parseInt(f[2])}else{if(!/#/.test(a))return a;var g=a.length;7===g?(c=parseInt(a.slice(1,3),16),d=parseInt(a.slice(3,5),16),e=parseInt(a.slice(5),16)):4===g&&(c=parseInt(a.charAt(1)+val.charAt(1),16),d=parseInt(a.charAt(2)+val.charAt(2),16),e=parseInt(a.charAt(3)+val.charAt(3),16))}return"rgba("+c+","+d+","+e+","+(b?b:1)+")"},tmpl:function(){function a(c,d){var e=/\W/.test(c)?new Function("obj","var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('"+c.replace(/[\r\t\n]/g," ").split("<%").join("	").replace(/((^|%>)[^\t]*)'/g,"$1\r").replace(/\t=(.*?)%>/g,"',$1,'").split("	").join("');").split("%>").join("p.push('").split("\r").join("\\'")+"');}return p.join('');"):b[c]=b[c]||a(document.getElementById(c).innerHTML);return d?e(d):e}var b={};return a}()},function(a){function b(b,c){function d(a,b,c){var d=e(a,b);d&&h.trigger(c,[h.chartData.datasets[d[5]].data[d[4]],d[4],d[5]])}function e(b,c){var d;return a.each(g,function(a){return b>=a[0]&&b<=a[1]&&c>=a[3]&&c<=a[2]?(d=a,!1):void 0}),d}function f(a){for(var b=0,c=a.datasets,d=c.length;d>b;b++)for(var e=c[b].data,f=0,g=e.length;g>f;f++)if(parseFloat(e[f])<0)return!0;return!1}a.Scale.apply(this);var g=[];this._type_="bar";var h=this;this.data=b,this.chartData=null,this.isSymmetric=f(b),a.extend(this.config,{showBarBorder:!0,barBorderWidth:2,barSpacing:1,barSetSpacing:5,datasetGesture:!1,datasetShowNumber:12}),this.bindEvents=function(){this.on("_tap",function(a,b){d(a,b,"tap.bar")}),this.on("_longTap",function(a,b){d(a,b,"longTap.bar")}),this.config.datasetGesture&&this.bindDataGestureEvent()},this.draw=function(a){this.config.datasetGesture&&this.data.labels.length>h.config.datasetShowNumber?this.chartData=this.sliceData(this.data,0,this.data.labels.length,this.config.datasetShowNumber):this.chartData=this.data,this.mergeFont(["scaleFont","textFont"]),this.initScale(!0),a?(this.drawScale(),this.drawBars(1)):this.doAnim(this.drawScale,this.drawBars)},this.redraw=function(a){this.chartData=a,this.clear(),this.initScale(!0),this.drawScale(),this.drawBars(1)},this.drawBars=function(b){b>=1&&(g=[]);var c=h.ctx,d=h.config,e=h.scaleData,f=h.isSymmetric;a.each(h.chartData.datasets,function(i,j){d.showBarBorder||(borderColor=null),a.each(i.data,function(k,l){var m,n=e.x+d.barSetSpacing+e.xHop*l+e.barWidth*j+d.barSpacing*j+d.barBorderWidth*j,o=e.y,p=e.barWidth,q=b*h.calcOffset(k,e.yScaleValue,e.yHop)+d.barBorderWidth/2,r=i.color,s=a.hex2Rgb(r,.6),t=e.pny;if(d.showBarBorder&&(m=i.borderColor||r),f){if(0!=t){if(o=t,q=b*h.calcOffset2(k,e.yScaleValue,e.yHop)+d.barBorderWidth/2,c.rect(n,o,p,q,s,m,d.barBorderWidth),b>=1){var u=Math.abs(q),v=q>=0?o+u:o-u;q>=0?g.push([n,n+p,v,o,l,j]):g.push([n,n+p,o,v,l,j])}var w=0>k?o+q+18:o+q-3;d.showText&&h.drawText(k,n+p/2,w,[l,j])}}else c.rect(n,o,p,-q,s,m,d.barBorderWidth),b>=1&&g.push([n,n+p,o,o-q,l,j]),d.showText&&h.drawText(k,n+p/2,o-q-3,[l,j])})})},c&&this.initial(c)}a.Bar=b}(JChart),function(a){function b(a){function b(){this.el=a="string"==typeof a?document.getElementById(a):a,this.ctx=a.getContext("2d"),this.width=a.width,this.height=a.height,c(this.ctx)}function c(a){for(var c in CanvasRenderingContext2D.prototype)b.prototype[c]||(b.prototype[c]=function(b){return function(){var c=Array.prototype.slice.call(arguments),e=a[b].apply(a,c);return d.indexOf(b)>-1?e:this}}(c))}var d=["isPointInPath","measureText","getImageData"];return b.prototype={set:function(a,b){if("object"==typeof a)for(var c in a)this.ctx[c]&&(this.ctx[c]=a[c]);else this.ctx[a]&&(this.ctx[a]=b);return this},get:function(a){return this.ctx[a]},fill:function(a){return"string"==typeof a&&this.set("fillStyle",a),this.ctx.fill(),this},stroke:function(a,b){return"string"==typeof a&&(this.set("strokeStyle",a),b&&this.set("lineWidth",b)),this.ctx.stroke(),this},fillText:function(a,b,c,d){if(this.ctx.save(),d&&"object"==typeof d)for(var e in d)this.set(e,d[e]);var f=(a+"").split("\n");if(f.length>1)for(var g=this.getFontSize(),h=0;h<f.length;h++)this.ctx.fillText(f[h],b,c+h*g);else this.ctx.fillText(a,b,c);return this.ctx.restore(),this},clear:function(a,b,c,d){return a=a||0,b=b||0,c=c||this.width,d=d||this.height,this.ctx.clearRect(a,b,c,d),this},resize:function(a,b){return this.el.width=a,this.el.height=b,this.width=a,this.height=b,this},line:function(a,b,c,d,e,f){return this.beginPath().moveTo(a,b).lineTo(c,d),e&&this.stroke(e,f),this},rect:function(a,b,c,d,e,f,g){return this.ctx.beginPath(),this.ctx.rect(a,b,c,d),this.ctx.closePath(),e&&this.fill(e),f&&this.stroke(f,g),this},circle:function(a,b,c,d,e,f){return this.beginPath(),this.ctx.arc(a,b,c,0,2*Math.PI,!1),this.closePath(),d&&this.fill(d),e&&this.stroke(e,f),this},sector:function(a,b,c,d,e,f,g,h){return this.beginPath().arc(a,b,c,d,e,!1).lineTo(a,b).closePath(),f&&this.fill(f),g&&this.stroke(g,h),this},dountSector:function(a,b,c,d,e,f,g,h,i){return this.beginPath().arc(a,b,d,e,f,!1).arc(a,b,c,f,e,!0).closePath(),g&&this.fill(g),h&&this.stroke(h,i),this},image:function(a){var b=this,c=Array.prototype.slice.call(arguments),d=function(){b.ctx.drawImage.apply(b.ctx,c)};return"string"==typeof a?(c[0]=new Image,c[0].onload=d,c[0].src=a):d(),this},getFontSize:function(){var a=this.ctx.font.match(/\d+(?=px)/i);return a&&(a=parseInt(a[0])),a}},new b}a.Canvas=b}(JChart||window),function(a){var b=function(){this.isAnimating=!1,this.config={width:0,height:0,bgColor:"#fff",drawScaleFirst:!0,showText:!0,textFont:{},animation:!0,animationSteps:60,animationEasing:"easeOutBounce"},this.defaultFont={family:"Arial",size:16,style:"normal",color:"#5b5b5b",textAlign:"center",textBaseline:"middle"},this.events={},this.initial=function(b){"string"==typeof b?this.config.id=b:a.extend(this.config,b),this.ctx=a.Canvas(this.config.id);var c=this.ctx.el;this.config.width&&(c.width=this.config.width),this.config.height&&(c.height=this.config.height),this.config.fit,this.width=c.width,this.height=c.height,window.devicePixelRatio&&(c.style.width=this.width+"px",c.style.height=this.height+"px",c.height=this.height*window.devicePixelRatio,c.width=this.width*window.devicePixelRatio,this.ctx.scale(window.devicePixelRatio,window.devicePixelRatio)),this.bindTouchEvents(),this.bindEvents(),this.setBg()},this.setBg=function(){this.ctx.set("fillStyle",this.config.bgColor),this.ctx.fillRect(0,0,this.width,this.height)},this.resize=function(a,b){},this.clear=function(){this.ctx.clear(),this.setBg()},this.refresh=function(a){this.update(null,a,!0)},this.load=function(a){this.update(a,null,!1)},this.update=function(b,c,d){c&&a.extend(this.config,c),b&&(this.data=b),this.dataOffset=0,this.clear(),this.draw(d)},this.mergeFont=function(b){if(b instanceof Array)a.each(b,function(a){this.mergeFont(a)},this);else{var c=this.config[b],d=a.extend({},this.defaultFont,c);d.font=d.style+" "+d.size+"px "+d.family,d.fillStyle=d.color,this.config[b]=d}},this.doAnim=function(b,c,d){function e(){k+=i,f(),1>=k?a.requestAnimFrame.call(window,e):(h.isAnimating=!1,d&&d.call(h),h.trigger("animationComplete"))}function f(){h.clear();var d=g.animation?a.capValue(j(k),1,0):1;c.call(h,d),h.config.drawScaleFirst?(b.call(h),c.call(h,d)):(c.call(h,d),b.call(h))}this.isAnimating=!0;var g=this.config,h=this,i=g.animation?1/a.capValue(g.animationSteps,1e3,1):1,j=a.animationOptions[g.animationEasing],k=g.animation?0:1,h=this;"function"!=typeof b&&(b=function(){}),a.requestAnimFrame.call(window,e)},this.on=function(a,b){this.events[a]=b},this.trigger=function(a,b){var c=this.events[a];return c?c.apply(this,b):null},this.drawText=function(a,b,c,d,e){this.ctx.set(this.config.textFont),e&&this.ctx.set(e),d=d?[a].concat(d):[a];var f=this.trigger("renderText",d);f=null==f?a:f,this.ctx.fillText(f,b,c)},this.bindTouchEvents=function(){function b(b){j=Date.now(),b=b.touches?b.touches[0]:b,k=j-(m.last||j),h&&clearTimeout(h),l=a.getOffset(t.ctx.el),m.x1=b.pageX-l.left,m.y1=b.pageY-l.top,k>0&&250>=k&&(m.isDoubleTap=!0),m.last=j,i=setTimeout(e,n)}function c(a){if(m.last){var b=a.touches?a.touches[0]:a;m.x2=b.pageX-l.left,m.y2=b.pageY-l.top,Math.abs(m.x1-m.x2)>15&&(a.preventDefault(),g())}}function d(a){f(),"last"in m&&(t.trigger("_tap",[m.x1,m.y1]),t.trigger("tap",[m.x1,m.y1]),m.isDoubleTap?(g(),t.trigger("_doubleTap",[m.x1,m.y1]),t.trigger("doubleTap",[m.x1,m.y1])):h=setTimeout(function(){h=null,t.trigger("_singleTap",[m.x1,m.y1]),t.trigger("singleTap",[m.x1,m.y1]),m={}},250))}function e(){i=null,m.last&&(t.trigger("_longTap",[m.x1,m.y1]),t.trigger("longTap",[m.x1,m.y1]),m={})}function f(){i&&clearTimeout(i),i=null}function g(){h&&clearTimeout(h),i&&clearTimeout(i),h=i=null,m={}}var h,i,j,k,l,m={},n=750,o="ontouchstart"in window,p=o?"touchstart":"mousedown",q=o?"touchmove":"mousemove",r=o?"touchend":"mouseup",s=o?"touchcancel":"mouseup",t=this;this.ctx.el.addEventListener(p,b),this.ctx.el.addEventListener(q,c),this.ctx.el.addEventListener(r,d),this.ctx.el.addEventListener(s,g)}};a.Chart=b}(JChart),function(a){function b(b,c){function d(a,b){var c=e(a,b);c&&g.trigger("tap.point",[g.chartData.datasets[c[3]].data[c[2]],c[2],c[3]])}function e(b,c){var d,e=g.config.pointClickBounds;return a.each(f,function(a){return b>=a[0]-e&&b<=a[0]+e&&c>=a[1]-e&&c<=a[1]+e?(d=a,!1):void 0}),d}a.Scale.apply(this);var f=[];this._type_="line",this.data=b,this.chartData=null;var g=this;a.extend(this.config,{smooth:!0,showPoint:!0,pointRadius:4,pointBorderWidth:2,pointClickBounds:20,lineWidth:2,fill:!0,datasetGesture:!1,datasetShowNumber:12}),this.bindEvents=function(){this.on("_tap",d),this.config.datasetGesture&&this.bindDataGestureEvent()},this.draw=function(a){this.mergeFont(["textFont","scaleFont"]),this.config.datasetGesture&&this.data.labels.length>g.config.datasetShowNumber?this.chartData=this.sliceData(this.data,0,this.data.labels.length,this.config.datasetShowNumber):this.chartData=this.data,g.initScale(!0),a?(this.drawScale(),this.drawLines(1)):this.doAnim(this.drawScale,this.drawLines)},this.redraw=function(a){this.chartData=a,this.clear(),this.initScale(!0),this.drawScale(),this.drawLines(1)},this.drawLines=function(b){function c(a,c){return j.y-b*g.calcOffset(i[a].data[c],j.yScaleValue,j.yHop)}function d(a){return j.x+j.xHop*a}b>=1&&(f=[]);var e=g.ctx,h=g.config,i=g.chartData.datasets,j=g.scaleData;a.each(i,function(i,k){e.beginPath().moveTo(j.x,c(k,0)),a.each(i.data,function(a,g){var i=d(g),j=c(k,g);h.smooth?e.bezierCurveTo(d(g-.5),c(k,g-1),d(g-.5),j,i,j):e.lineTo(i,j),b>=1&&f.push([i,j,g,k])}),e.stroke(i.color,h.lineWidth),h.fill?e.lineTo(j.x+j.xHop*(i.data.length-1),j.y).lineTo(j.x,j.y).closePath().fill(i.fillColor?i.fillColor:a.hex2Rgb(i.color,.6)):e.closePath(),a.each(i.data,function(a,b){var e=d(b),f=c(k,b);h.showPoint&&g.drawPoint(e,f,i),h.showText&&g.drawText(a,e,f-3,[b,k])})})},c&&this.initial(c)}a.Line=b}(JChart),function(a){function b(b,c){function d(){var b=0;n=[],a.each(o.data,function(a,c){var d=b,e=a.value/q;b+=e*o.config.totalAngle;var f=b;n.push([d,f,a,c,e])})}function e(a){f(a,"rotate")}function f(b,c){o.clear(),b=o.config.animation?b:1,a.each(n,function(a){h(a,b,c)}),o.config.isDount&&o.config.dountText&&j()}function g(a,b,c){var d=a[0],e=a[1];return"rotate"==c?(d=d+r+s*b,e=e+r+s*b):(d=d*b+r,e=e*b+r),{start:d,end:e}}function h(a,b,c){var d=u.x,e=u.y,f=o.config,h=a[3],j=g(a,b,c);if(h==t){var k=(a[0]+a[1])/2+r;d+=Math.cos(k)*f.pullOutDistance,e+=Math.sin(k)*f.pullOutDistance}f.isDount?o.ctx.dountSector(d,e,p*f.dountRadiusPercent,p,j.start,j.end,o.data[h].color):o.ctx.sector(d,e,p,j.start,j.end,o.data[h].color),f.showBorder&&o.ctx.stroke(f.borderColor,f.borderWidth),f.showText&&i(d,e,p,j.start,j.end,a)}function i(a,b,c,d,e,f){var g=(d+e)/2,h=c/2,i=f[4],j=f[2];o.config.isDount&&(h=c/2+c*o.config.dountRadiusPercent/2),i=(100*i).toFixed(1)+"%";var k=Math.cos(g)*h+a,l=Math.sin(g)*h+b;o.drawText(i,k,l,[j,f[3],f[4]])}function j(){o.ctx.fillText(o.config.dountText,u.x,u.y,o.config.dountFont)}function k(a,b,c){var d=o.config.clickType,e=l(a,b);if(e)if("tap.pie"==c){if(!o.trigger(c,[e[2],e[3]]))return;"rotate"==d?o.rotate(e[3]):"pullOut"==d&&o.toggleSegment(e[3])}else o.trigger(d,[e[2],e[3]])}function l(b,c){var d,e=b-u.x,f=c-u.y,g=Math.sqrt(Math.pow(Math.abs(e),2)+Math.pow(Math.abs(f),2)),h=p>=g;if(h&&o.config.isDount&&(h=g>=p*o.config.dountRadiusPercent),h){var i=Math.atan2(f,e)-r;return 0>i&&(i+=2*Math.PI),i>2*Math.PI&&(i-=2*Math.PI),a.each(n,function(a){return i>=a[0]&&i<a[1]?(d=a,!1):void 0}),d}}function m(){o.config.totalAngle==Math.PI?(u={x:o.width/2,y:o.height-20},p=Math.min(u.x,u.y)-10):(u={x:o.width/2,y:o.height/2},p=Math.min(u.x,u.y)-10)}a.Chart.apply(this);var n,o=this;this.data=b;var p,q=0,r=0,s=0,t=-1,u={};a.extend(this.config,{showBorder:!0,borderColor:"#fff",borderWidth:2,startAngle:-Math.PI/2,rotateAngle:Math.PI/2,pullOutDistance:10,clickType:"pullOut",isDount:!1,dountRadiusPercent:.4,totalAngle:2*Math.PI,dountText:"",dountFont:{size:20,style:600,color:"#3498DB"}}),this.bindEvents=function(){this.on("_tap",function(a,b){k(a,b,"tap.pie")}),this.on("_longTap",function(a,b){k(a,b,"longTap.pie")}),this.on("tap.pie",function(){return!0})},this.toggleSegment=function(a){a==t?this.pushIn():this.pullOut(a)},this.pushIn=function(){t=-1,f(1),this.trigger("pushIn")},this.pullOut=function(a){t!=a&&(t=a,f(1),this.trigger("pullOut",[o.data[a],a,n[a][4]]))},this.rotate=function(b){if(!o.isAnimating){var c=(n[b][0]+n[b][1])/2+r,d=o.config.rotateAngle-c;a.isEqual(d,0)||(this.pushIn(),s=d,this.doAnim(null,e,function(){r+=s,o.trigger("rotate",[o.data[b],b,n[b][4]])}))}},this.setDountText=function(a){o.config.dountText=a,f(1)},this.draw=function(b){this.mergeFont(["textFont","dountFont"]),m(),q=0,t=-1,a.each(o.data,function(a){q+=a.value}),d(),r=o.config.startAngle,b?f(1):this.doAnim(null,f)},c&&this.initial(c)}a.Pie=b}(JChart),function(a){function b(b,c){function d(a,b){var c=e(a,b);c>-1&&this.trigger("tap.pie",[this.data[c],c])}function e(a,b){var c=-Math.PI/2,d=2*Math.PI/this.data.length,a=a-f.width/2,b=b-f.height/2,e=Math.sqrt(Math.pow(Math.abs(a),2)+Math.pow(Math.abs(b),2)),g=e<=f.scaleData.yHeight;if(!g)return-1;var h=Math.atan2(b,a)-c;return 0>h&&(h=2*Math.PI+h),h>2*Math.PI&&(h-=2*Math.PI),Math.floor(h/d)}a.Scale.apply(this);var f=this;this.data=this.chartData=b,a.extend(this.config,{drawScaleFirst:!1,showScaleLabelBackdrop:!0,scaleBackdropColor:"rgba(255,255,255,0.75)",scaleBackdropPaddingY:2,scaleBackdropPaddingX:2,showAngleLine:!0,angleLineColor:"rgba(0,0,0,.1)",showBorder:!0,borderColor:"#fff",borderWidth:1,textFont:{size:16,color:"#666",textBaseline:"middle"},angleLineWidth:1,animateRotate:!0,animateScale:!1}),this.bindEvents=function(){this.on("_tap",d)},this.draw=function(a){this.mergeFont(["scaleFont","textFont"]),this.initScale(),a&&(this.drawAllSegments(1),this.drawScale()),this.doAnim(this.drawScale,this.drawAllSegments)},this.calcDrawingSizes=function(){var a=Math.min(this.width,this.height)/2,b=this.config,c=b.scaleFont.size,d=2*c;a-=Math.max(.5*c,.5*b.scaleLineWidth),b.showScaleLabelBackdrop&&(d+=2*b.scaleBackdropPaddingY,a-=1.5*b.scaleBackdropPaddingY),this.scaleData.yHeight=a-10,this.scaleData.yLabelHeight=d},this.drawScale=function(){var b=this.config,c=this.scaleData,d=this.width/2,e=this.height/2;size=b.scaleFont.size,px=b.scaleBackdropPaddingX,py=b.scaleBackdropPaddingY,this.ctx.save().translate(d,e);for(var f=0;f<c.yScaleValue.step;f++){var g=c.yHop*(f+1);if(b.showGridLine&&this.ctx.circle(0,0,g,!1,b.gridLineColor,b.gridLineWidth),b.showScaleLabel){var h=c.yScaleValue.labels[f];if(b.showScaleLabelBackdrop){var i=this.ctx.measureText(h).width;this.ctx.rect(Math.round(-i/2-px),Math.round(-g-size/2-py),Math.round(i+2*px),Math.round(size+2*py),b.scaleBackdropColor)}this.ctx.fillText(h,0,-g,b.scaleFont)}}var j=this.data.labels.length,k=2*Math.PI/j;this.ctx.rotate(-Math.PI/2-k),a.each(this.data.labels,function(a,d){this.ctx.rotate(k),b.showAngleLine&&this.ctx.line(0,0,c.yHeight,0,b.angleLineColor,b.angleLineWidth),b.showLabel&&(this.ctx.save().translate(c.yHeight+10,0).rotate(Math.PI/2-k*d),this.ctx.fillText(a,0,0,b.textFont),this.ctx.restore())},this),this.ctx.restore()},this.drawAllSegments=function(b){var c,d,e=-Math.PI/2,f=2*Math.PI/this.data.datasets.length,g=1,h=1,i=this.scaleData,j=this.config;j.animation&&(j.animateScale&&(g=b),j.animateRotate&&(h=b)),j.showBorder&&(c=j.borderColor,d=j.borderWidth),a.each(this.data.datasets,function(b){var j=g*this.calcOffset(b.value,i.yScaleValue,i.yHop);this.ctx.sector(this.width/2,this.height/2,j,e,e+h*f,a.hex2Rgb(b.color,.6),c,d),e+=h*f},this)},this.getValueBounds=function(a){for(var b=Number.MIN_VALUE,c=Number.MAX_VALUE,d=0;d<a.length;d++)a[d].value>b&&(b=a[d].value),a[d].value<c&&(c=a[d].value);var e=this.scaleData.yHeight,f=this.scaleData.yLabelHeight,g=Math.floor(e/(.66*f)),h=Math.floor(e/f*.5);return{maxValue:b,minValue:c,maxSteps:g,minSteps:h}},c&&this.initial(c)}a.Polar=b}(JChart),function(a){function b(b,c){function d(a,b){var c=f(a,b);c&&h.trigger("tap.point",[h.data.datasets[c[3]].data[c[2]],c[2],c[3]])}function e(){a.each(g,function(a){var b=a[1];b>h.height/2&&(b+=6),h.drawText(h.data.datasets[a[3]].data[a[2]],a[0],b,[a[2],a[3]])})}function f(b,c){var d,e=h.config.pointClickBounds;return a.each(g,function(a){return b>=a[0]-e&&b<=a[0]+e&&c>=a[1]-e&&c<=a[1]+e?(d=a,!1):void 0}),d}a.Scale.apply(this);var g=[],h=this;this.data=this.chartData=b,a.extend(this.config,{drawScaleFirst:!1,scaleShowLabelBackdrop:!0,scaleBackdropColor:"rgba(255,255,255,0.75)",scaleBackdropPaddingY:2,scaleBackdropPaddingX:2,graphShape:"circle",showAngleLine:!0,angleLineColor:"rgba(0,0,0,.1)",angleLineWidth:1,showPoint:!0,pointRadius:3,pointBorderWidth:1,pointClickBounds:20,lineWidth:2,fill:!0,showScaleLabel:!0,showText:!1,gridLineColor:"rgb(0,0,0,.5)"}),this.bindEvents=function(){this.on("_tap",d)},this.draw=function(a){this.mergeFont(["scaleFont","textFont"]),this.initScale(),a?(this.drawAllDataPoints(1),this.drawScale()):this.doAnim(this.drawScale,this.drawAllDataPoints)},this.calcDrawingSizes=function(){var b=Math.min(this.width,this.height)/2,c=this.config,d=2*c.scaleFont.size,e=0;a.each(h.data.labels,function(a){this.ctx.set(c.textFont);var b=this.ctx.measureText(a).width;b>e&&(e=b)},this),b-=Math.max(e,c.textFont.size/2*1.5),b-=c.textFont.size,b=a.capValue(b,null,0),this.scaleData.yHeight=b,this.scaleData.yLabelHeight=d},this.drawScale=function(){var a=this.ctx,b=this.config,c=this.scaleData,d=b.scaleFont.size,e=b.textFont.size,f=this.data.labels.length,g=b.scaleBackdropPaddingX,h=b.scaleBackdropPaddingY,i=2*Math.PI/f;if(a.save().translate(this.width/2,this.height/2),b.showAngleLine)for(var j=c.yHeight-c.yHeight%c.yHop,k=0;f>k;k++)a.rotate(i).line(0,0,0,-j,b.angleLineColor,b.angleLineWidth);for(var l=0;l<c.yScaleValue.step;l++){var m=c.yHop*(l+1);if(a.beginPath(),b.showGridLine){if(a.set({strokeStyle:b.gridLineColor,lineWidth:b.gridLineWidth}),"diamond"==b.graphShape){a.moveTo(0,-m);for(var n=0;f>n;n++)a.rotate(i).lineTo(0,-m)}else a.circle(0,0,m);a.closePath().stroke()}if(b.showScaleLabel){var o=c.yScaleValue.labels[l];if(b.showScaleLabelBackdrop){var p=this.ctx.measureText(o).width;this.ctx.rect(Math.round(-p/2-g),Math.round(-m-d/2-h),Math.round(p+2*g),Math.round(d+2*h),b.scaleBackdropColor)}this.ctx.fillText(o,0,-m,b.scaleFont)}}this.ctx.set(b.textFont);for(var q=0;f>q;q++){var r,s=Math.sin(i*q)*(c.yHeight+e),t=Math.cos(i*q)*(c.yHeight+e);r=i*q==Math.PI||i*q==0?"center":i*q>Math.PI?"right":"left",this.ctx.fillText(this.data.labels[q],s,-t,{textAlign:r})}a.restore()},this.drawAllDataPoints=function(c){function d(a){return-c*h.calcOffset(a,k.yScaleValue,k.yHop)}function f(a,b){a=Math.abs(a);var c,d,e=-Math.PI/2+b*j;return c=Math.cos(e)*a+h.width/2,d=Math.sin(e)*a+h.height/2,[c,d]}c>=1&&(g=[]);var i=b.datasets[0].data.length,j=2*Math.PI/i,k=this.scaleData,l=this.ctx,m=this.config;l.save().translate(this.width/2,this.height/2),a.each(this.data.datasets,function(b,e){l.beginPath().moveTo(0,d(b.data[0])),a.each(b.data,function(a,b){return 0==b?!0:void l.rotate(j).lineTo(0,d(a))}),l.closePath(),m.fill&&l.fill(b.fillColor||a.hex2Rgb(b.color,.6)),l.stroke(b.color,m.lineWidth),a.each(b.data,function(a,h){var i=d(a);if(m.showPoint&&l.rotate(j).circle(0,i,m.pointRadius,b.pointColor,b.pointBorderColor,m.pointBorderWidth),c>=1){var k=f(i,h);g.push([k[0],k[1],h,e])}}),l.rotate(j)},this),l.restore(),m.showText&&e()},c&&this.initial(c)}a.Radar=b}(JChart),function(a){function b(){var b=5,c=5,d=20,e=10;a.Chart.apply(this),a.extend(this.config,{scale:null,scaleLineColor:"rgba(0,0,0,.3)",scaleLineWidth:1,showScaleLabel:!0,showLabel:!0,scaleFont:{size:12,color:"#666"},textFont:{size:14,textBaseline:"bottom"},showGridLine:!0,gridLineColor:"rgba(0,0,0,.1)",gridLineWidth:1}),this.dataOffset=0,this.scaleData={x:0,y:0,xHop:0,yHop:0,xLength:0,yHeight:0,yLabelHeight:0,yScaleValue:null,labelRotate:0,xLabelWidth:0,xLabelHeight:0,barWidth:0,pny:0},this.calcDrawingSizes=function(){var c=this.height,d=0,f=this.config.scaleFont.size,g=0,h=f,i=0,j=this.chartData.labels.length;this.ctx.set(this.config.scaleFont),a.each(this.chartData.labels,function(a){var b=this.ctx.measureText(a).width;d=b>d?b:d},this),g=d,this.width/j<d&&(i=45,g=Math.cos(i*Math.PI/180)*d,h=Math.sin(i*Math.PI/180)*d,this.width/j<h&&(i=90,g=f,h=d)),c-=h,c-=e,c-=b,c-=this.config.showText?f:0,this.scaleData.yHeight=c,this.scaleData.yLabelHeight=f,this.scaleData.labelRotate=i,this.scaleData.xLabelWidth=g,this.scaleData.xLabelHeight=h},this.getValueBounds=function(b){var c=Number.MIN_VALUE,d=Number.MAX_VALUE;a.each(b,function(b){a.each(b.data,function(a){a>c&&(c=a),d>a&&(d=a)})});var e=this.scaleData.yHeight,f=this.scaleData.yLabelHeight,g=Math.floor(e/(.66*f)),h=Math.floor(e/f*.5);return{maxValue:c,minValue:d,maxSteps:g,minSteps:h}},this.calcYAxis=function(){var a=this.config.scale;if(a)a.start=a.start||0,a.labels=this.populateLabels(a.step,a.start,a.stepValue);else{var b=this.getValueBounds(this.chartData.datasets);a=this.calcScale(this.scaleData.yHeight,b.maxSteps,b.minSteps,b.maxValue,b.minValue)}this.scaleData.yScaleValue=a,this.scaleData.yHop=Math.floor(this.scaleData.yHeight/a.step)},this.calcXAxis=function(){var b,f,g=this.config,h=this.scaleData,i=0;if(g.showScaleLabel&&(a.each(h.yScaleValue.labels,function(a){var b=this.ctx.measureText(a).width;i=b>i?b:i},this),i+=d),b=this.width-i-c-(this.config.showText?this.config.textFont.size:0),"bar"==this._type_){f=Math.floor(b/this.chartData.labels.length);var j=this.chartData.datasets.length;h.barWidth=(f-2*g.gridLineWidth-2*g.barSetSpacing-(g.barSpacing*j-1)-(g.barBorderWidth/2*j-1))/j}else f=Math.floor(b/(this.chartData.labels.length-1));h.x=i,h.y=this.height-h.xLabelHeight-e,h.xWidth=b,h.xHop=f},this.drawScale=function(){var b,c=this.ctx,f=this.config,g=this.scaleData;c.set({strokeStyle:f.scaleLineColor,lineWidth:f.scaleLineWidth}),c.line(g.x-3,g.y,g.x+g.xWidth,g.y,!0),c.line(g.x,g.y+3,g.x,g.y-g.yHeight,!0),g.labelRotate>0?(c.save(),b="right"):b="center",c.set({fillStyle:f.scaleFont.color,textAlign:b,textBaseline:"hanging",strokeStyle:f.gridLineColor,lineWidth:f.gridLineWidth}),a.each(this.chartData.labels,function(a,b){c.save();var d=g.x+b*g.xHop,h=g.y+e/2,i="bar"==this._type_?d+g.xHop/2:d;if(g.labelRotate>0?c.translate(i,h).rotate(-(g.labelRotate*(Math.PI/180))).fillText(a,0,0).restore():c.fillText(a,i,h),f.showGridLine){var j="bar"==this._type_?d+g.xHop:d;c.line(j,g.y,j,g.y-g.yHeight,!0)}},this),c.set({textAlign:"right",textBaseline:"middle"});for(var h=0,i=g.yScaleValue.labels.length,j=parseFloat(g.yScaleValue.labels[0])<0?!0:!1;i>h;h++){var k=g.y-(h+1)*g.yHop;!j||0!=g.yScaleValue.labels[h]&&"0"!=g.yScaleValue.labels[h]?c.ctx.strokeStyle="rgba(0,0,0,.1)":(c.ctx.strokeStyle="rgba(0,0,0,.4)",g.pny=k),f.showGridLine&&c.line(g.x,k,g.x+g.xWidth,k,!0),f.showScaleLabel&&c.fillText(g.yScaleValue.labels[h],g.x-d/2,k)}},this.initScale=function(a){this.calcDrawingSizes(),this.calcYAxis(),a&&this.calcXAxis()},this.drawPoint=function(a,b,c){this.ctx.beginPath().circle(a,b,this.config.pointRadius,c.pointColor||"#fff",c.pointBorderColor||c.color,this.config.pointBorderWidth)},this.calcScale=function(a,b,c,d,e){function f(a){return Math.floor(Math.log(a)/Math.LN10)}var g,h,i,j,k,l,m;for(l=d-e,m=f(l),g=0,h=Math.ceil(d/(1*Math.pow(10,m)))*Math.pow(10,m),i=h-g,j=Math.pow(10,m),k=Math.round(i/j);c>k||k>b;)c>k?(j/=2,k=Math.round(i/j)):(j*=2,k=Math.round(i/j));var n=this.populateLabels(k,g,j);return{step:k,stepValue:j,start:g,labels:n}},this.populateLabels=function(b,c,d){for(var e=[],f=1;b+1>f;f++)if(this.config.showScaleLabel){var g=(c+d*f).toFixed(a.getDecimalPlaces(d)),h=this.trigger("renderYLabel",[g]);h=h?h:g,e.push(h)}else e.push("");return e},this.calcOffset=function(b,c,d){var e=c.step*c.stepValue,f=b-c.start,g=a.capValue(f/e,1,0);return d*c.step*g},this.calcOffset2=function(b,c,d){var e=c.step*c.stepValue,f=Math.abs(b),g=a.capValue(f/e,1,0);return 0>b?d*c.step*g:-(d*c.step)*g},this.sliceData=function(b,c,d,e){var f=a.clone(b),g=c,h=c+e;return h>d&&(g=d-e,h=d),f.labels=f.labels.slice(g,h),a.each(f.datasets,function(a){a.data=a.data.slice(g,h)}),f},this.bindDataGestureEvent=function(){function a(a){a=a.touches?a.touches[0]:a,e={x:a.pageX,y:a.pageY},d=0,f=!0}function b(a){if(f&&g.config.datasetGesture){a=a.touches?a.touches[0]:a;var b=a.pageX;a.pageY;d=b-e.x;var c=g.data.labels.length,j=g.dataOffset-Math.floor(d/g.scaleData.xHop);0>j||j==h||j+i>c||(h=j,setTimeout(function(){g.redraw(g.sliceData(g.data,j,c,i))},0))}}function c(a){f=!1,g.dataOffset=h}var d,e,f,g=this,h=0,i=this.config.datasetShowNumber,j="ontouchstart"in window,k=j?"touchstart":"mousedown",l=j?"touchmove":"mousemove",m=j?"touchend":"mouseup";this.ctx.el.addEventListener(k,a),this.ctx.el.addEventListener(l,b),this.ctx.el.addEventListener(m,c)}}a.Scale=b}(JChart);
//=====================================================================JChart end=====================================//

(function(_,j){
    var chartConstant = {
        C_iChartType_line:1,//统计图类型---折线图
        C_iChartType_bar:2,//统计图类型---柱状图
        C_iChartType_pie:3,//统计图类型---饼图
        C_iChartType_radar:4,//统计图类型---雷达图

        C_iChartScale_BarLine:13,//柱状图和折线图刻度数
        C_iChartScale_Radar:6,//雷达图刻度数
        C_iChartScale_DigitLimit:3,//刻度增量值小数位数最多3位
        C_iChartShowNum_Default:10//数据组默认显示数量
    };
    var chart = function(container,data){
        var self = this;
        self.stepValueCache = [];//缓存所有数据
        self.chart = null;//jchart对象
        self.basicDiv = null;//组件
        self.scroller = null;//滚动对象
        self.legend = null;//图例
        var container = document.querySelector(container);
        if(!container) throw "please defined a container by id or class name way";
        self.basicDiv = self._assemble(container,data);
        self.legend = self.basicDiv.querySelector("#chart_legend");
        self._setLegend(self.legend);
        self._createChart(self.basicDiv,data);

    };
    /**
     * 组装html
     * @param container
     * @param data
     * @returns {*}
     */
    chart.prototype._assemble = function(container,data){
        var basicDiv = document.createElement("div");
        basicDiv.classList.add("cmp-chart-basicDiv");
        var content = _.tpl(temp,data);
        basicDiv.innerHTML = content;
        container.appendChild(basicDiv);
        return basicDiv;
    };
    /**
     * 创建统计图
     * @param basicDiv
     * @param data
     */
    chart.prototype._createChart = function(basicDiv,data){
        var self = this;
        var canvas = basicDiv.getElementsByTagName("canvas")[0];
        var container = basicDiv.parentNode;
        var header = basicDiv.querySelector(".cmp-chart-title");
        var legend = basicDiv.querySelector(".cmp-chart-legend");
        var id = canvas.getAttribute("id");
        var width = container.offsetWidth;
        var height = container.offsetHeight - header.offsetHeight - legend.offsetHeight;
        var chartType = self._chartType(data);
        var vo = self._convertVO(data,chartType);
        var voData = vo.data;
        var renderData = vo.render;
        renderData.id = id;
        renderData.width = width;
        renderData.height = height;
        switch (chartType){
            case chartConstant.C_iChartType_line:
                self.chart = new j.Line(voData,renderData);
                self._bindTapEvent(chartConstant.C_iChartType_line,self.chart,voData,basicDiv);
                break;
            case chartConstant.C_iChartType_bar:
                self.chart = new j.Bar(voData,renderData);
                self._bindTapEvent(chartConstant.C_iChartType_bar,self.chart,voData,basicDiv);
                break;
            case chartConstant.C_iChartType_pie:
                renderData.height = height - 50;
                self.chart = new j.Pie(voData,renderData);
                self.chart.on('rotate', function (data, i, j) {
                    var arrow = basicDiv.querySelector("#chart_arrow_container");
                    arrow.style.display = "block";
                    arrow.innerHTML = data.name + "<br/>" + data.value;
                });
                break;
            case chartConstant.C_iChartType_radar:
                self.chart = new j.Radar(voData,renderData);
                self._bindTapEvent(chartConstant.C_iChartType_radar,self.chart,voData,basicDiv);
                break;
            default :
                break;
        }
        self.chart.draw();
    };
    /**
     * 渲染图例
     * @param data
     * @private
     */
    chart.prototype._renderLegend = function(data){
        var self = this;
        var scroller = self.legend.querySelector(".scroller");
        var newLegend = _.tpl(glyphlinex,data);
        scroller.innerHTML = newLegend;
        self._setLegend(self.legend);
    };
    chart.prototype._handleCanvasContainer = function(){
        var self = this;
        var canvas = self.basicDiv.getElementsByTagName("canvas")[0];
        if(canvas) self.basicDiv.removeChild(canvas);
        var newCanvas = document.createElement("canvas");
        newCanvas.setAttribute("id","chart_canvas");
        self.basicDiv.appendChild(newCanvas);
    };
    /**
     * 处理饼图提示容器
     * @param data
     * @private
     */
    chart.prototype._handlePieContainer = function(data){
        var self = this;
        var type = data.option.series[0].type;
        type = type.toLocaleLowerCase();
        var arrowContainer = self.basicDiv.querySelector("#chart_arrow_container");
        if(type == "pie"){
            if(!arrowContainer) {
                var arrowContainer = document.createElement("div");
                arrowContainer.classList.add("cmp-chart-arrow-container");
                arrowContainer.setAttribute("id","chart_arrow_container");
                self.basicDiv.appendChild(arrowContainer);
            }
            arrowContainer.style.display = "none";
        }else {
            var oldArrowContainer = self.basicDiv.querySelector("#chart_arrow_container");
            if(oldArrowContainer) self.basicDiv.removeChild(oldArrowContainer);
        }
    };
    /**
     * 处理折线图+柱状图提示容器
     * @private
     */
    chart.prototype._handleDetailContainer = function(data){
        var self = this;
        var type = data.option.series[0].type;
        type = type.toLocaleLowerCase();
        var detail = self.basicDiv.querySelector("#chart_detail_container");
        if(type == "line" || type == "bar" || type == "radar") {
            if(detail) {
                if(detail.classList.contains("cmp-chart-div-show")) detail.classList.remove("cmp-chart-div-show");
                detail.style.opacity = 0;
            }else {
                var detailParent = document.createElement("div");
                detailParent.classList.add("cmp-chart-detail-container-parent");
                detailParent.innerHTML = '<div class="cmp-chart-detail-container" id="chart_detail_container" style="opacity:0;"></div>';
                self.basicDiv.appendChild(detailParent);
            }
        }else {
            if(detail){
                self.basicDiv.removeChild(detail.parentNode);
            }
        }


    };
    /**
     * 折线图+柱状图绑定点击事件
     * @param type
     * @param chart
     * @param voData
     * @param basicDiv
     * @private
     */
    chart.prototype._bindTapEvent = function(type,chart,voData,basicDiv){
        var detail = basicDiv.querySelector("#chart_detail_container");
        var event = (type == chartConstant.C_iChartType_bar)?"tap.bar":"tap.point";
        chart.on(event,function(data,i,j){
            var html = (type == chartConstant.C_iChartType_radar)?(voData.datasets[j].name+"<br/>" + voData.labels[i] + "：" + data):(voData.labels[i]+"<br/>" + voData.datasets[j].name + "：" + data);
            detail.style.color = voData.datasets[j].color;
            detail.innerHTML = html;
            if(detail.classList.contains("cmp-chart-div-hidden")) detail.classList.remove("cmp-chart-div-hidden");
            detail.classList.add("cmp-chart-div-show");
        });
        chart.ctx.el.addEventListener("touchmove",function(){
            if(detail.classList.contains("cmp-chart-div-show")) detail.classList.remove("cmp-chart-div-show");
            detail.classList.add("cmp-chart-div-hidden");
        });
    };
    /**
     * 将服务器传的数据转换成展示数据
     * @param data
     * @param chartType
     * @returns {{data: *, render: {}}}
     */
    chart.prototype._convertVO = function(data,chartType){
        var self = this;
        var renderData = {};
        renderData.scale = {};
        var voData;
        switch (chartType){
            case chartConstant.C_iChartType_line:
            case chartConstant.C_iChartType_bar:
                voData ={};
                voData.labels = self._labels_LB(data);
                voData.datasets = self._datasets_LB(data);
                renderData.datasetShowNumber = self._setShowNumber(data);
                break;
            case chartConstant.C_iChartType_pie:
                voData = [];
                var pieData = data.option.series[0].data,i = 0,len = pieData.length;
                for(;i<len;i ++){
                    pieData[i].color = data.option.color[i];
                    pieData[i].value = parseFloat(pieData[i].value);
                    voData.push(pieData[i]);
                }
                break;
            case chartConstant.C_iChartType_radar:
                voData = {};
                voData.labels = self._labels_R(data);
                voData.datasets = self._datasets_R(data);
                renderData.textFont = {size:12};
        }
        if(self.stepValueCache.length > 0) {
            var scale = self._setScale(self.stepValueCache,chartType);
            renderData.scale = scale;
        }
        renderData.bgColor = data.option.backgroundColor?data.option.backgroundColor:"#ffffff";
        renderData.fill = (chartType == chartConstant.C_iChartType_radar)?true:false;
        renderData.datasetGesture = true;
        renderData.animation = false;
        renderData.showPoint = (chartType == chartConstant.C_iChartType_radar)?false:true;
        renderData.pointRadius = 3;
        if(chartType == chartConstant.C_iChartType_pie){
            renderData.clickType="rotate";
            var radius = data.option.series[0].radius;
            if(_.isArray(radius)){
                renderData.isDount = true;
                var name = data.option.series[0].name;
                name = (name.length > 4)?name.substring(0,4) + "...":name;
                renderData.dountText = name;
            }
        }
        return {
            data:voData,
            render:renderData
        }
    }

    //======================================工具===================================//
    /**
     * 判断统计图类型
     * @param data
     * @returns {string}
     */
    chart.prototype._chartType = function(data){
        var chartType = '';
        var type = data.option.series[0].type;
        switch (type){
            case 'line':
                chartType = chartConstant.C_iChartType_line;
                break;
            case 'bar' :
                chartType = chartConstant.C_iChartType_bar;
                break;
            case 'pie':
                chartType = chartConstant.C_iChartType_pie;
                break;
            case 'radar':
                chartType = chartConstant.C_iChartType_radar;
                break;
            default :
                break;
        }
        return chartType;
    };
    /**
     * 获取折线或柱状图的展示label
     * @param data
     * @returns {Array}
     */
    chart.prototype._labels_LB = function(data){
        var list = [],i= 0,labelData = data.option.xAxis[0].data,len = labelData.length;
        for(;i< len;i ++){
            list.push(labelData[i]);
        }
        return list;
    };
    /**
     * 获取折线或柱状图的绘图数据
     * @param data
     * @returns {Array}
     */
    chart.prototype._datasets_LB = function(data){
        var self = this;
        var seriesList = [],i = 0,seriesDatas = data.option.series,len = seriesDatas.length;
        for(;i < len;i++){
            var itemData = {};
            itemData.color = data.option.color[i];
            itemData.data = self._data_LB(seriesDatas[i]);
            itemData.name = seriesDatas[i].name;
            seriesList.push(itemData);
        }
        return seriesList;
    };
    /**
     * 获取折线或柱状图的数组数据
     * @param items
     * @returns {Array}
     */
    chart.prototype._data_LB = function(items){
        var self = this;
        var itemList = [],j = 0,itemsChildrenDatas = items.data,length = itemsChildrenDatas.length;
        for(;j<length;j++){
            itemList.push(parseFloat(itemsChildrenDatas[j].value));
            self.stepValueCache.push(parseFloat(itemsChildrenDatas[j].value));
        }
        return itemList;
    };
    /**
     * 获取雷达图的label
     * @param data
     * @returns {Array}
     */
    chart.prototype._labels_R = function(data){
        var list = [],i = 0,radarLabel = data.option.polar[0].indicator,len = radarLabel.length;
        for(;i<len;i ++){
            var text = radarLabel[i].text;
            text = (text.length > 4)?text.substring(0,4)+"...":text;
            list.push(text);
        }
        return list;
    };
    /**
     * 获取雷达图的展示数据
     * @param data
     * @returns {Array}
     */
    chart.prototype._datasets_R = function(data){
        var self = this;
        var radarList = [],i = 0,radarData = data.option.series[0].data,len = radarData.length;
        for(;i<len;i ++){
            var item = {};
            var name = radarData[i].name;
            item.color = data.option.color[i];
            item.data = radarData[i].value;
            item.pointColor = '#95A5A6';
            item.pointStrokeColor = '#fff';
            item.name = (name.length > 4)?name.substring(0,4)+"...":name;
            radarList.push(item);
            var j= 0,length = radarData[i].value.length;
            for(;j<length;j++){
                self.stepValueCache.push(parseFloat(radarData[i].value[j]));
            }
        }
        return radarList;
    };
    /**
     * 设置图例容器的样式
     * @param legend
     */
    chart.prototype._setLegend = function(legend) {
        var self = this;
        var items = legend.getElementsByClassName("transverse-mark");
        var page = legend.querySelector(".scroller");
        var id = legend.getAttribute("id");
        var windowWid = _.os.android?document.body.clientWidth : window.innerWidth;
        var itemsWid = 0,i = 0,len = items.length;
        for(;i < len; i ++) {
            itemsWid += items[i].offsetWidth;
        }
        if(itemsWid > windowWid) {
            legend.style.width = '100%';
            legend.style.left = 0;
            legend.style.marginLeft = 0;
            page.style.width = itemsWid + 'px';
            if(self.scroller == null){
                self.scroller = new _.iScroll("#"+id,{
                    vScroll:false,
                    hScroll:true,
                    x:0,
                    y:0,
                    bounce: true,
                    bounceLock: false,
                    momentum: true,
                    lockDirection: true,
                    useTransform: true,
                    useTransition: false,
                    handleClick: true
                });
            }
            self.scroller.refresh();
        }else {
            legend.style.width = itemsWid + 'px';
            page.style.width = itemsWid + 'px';
            legend.style.left = "50%";
            legend.style.marginLeft = (-parseInt(itemsWid/2)-10) + 'px';
            if(self.scroller != null) self.scroller.refresh();
        }
    };
    /**
     * 设置刻度对象（柱状图+折线图+雷达图）
     * @param stepValCache
     * @param stepVal
     * @returns {{step: number, stepValue: *, start: number}}
     * @private
     */
    chart.prototype._setScale = function(stepValCache,chartType){
        var self = this;
        var stepValueCache = self._uniqueArray(stepValCache);
        stepValueCache = self._sortArray(stepValueCache);
        var minVal = parseFloat(stepValueCache[0]);
        var maxVal = parseFloat(stepValueCache[stepValueCache.length -1]);
        var start = 0,scaleStep = 0,stepVal = self._setBound(minVal,maxVal,chartType);
        if(minVal >=0){
            start = 0;
        }else {
            var absMinVal = Math.abs(minVal);
            var mo = absMinVal%stepVal;
            if(( mo< stepVal) &&(mo > 0)){
                start = minVal + mo - stepVal;
            }else {
                start = minVal;
            }
        }
        return {
            step : (chartType == chartConstant.C_iChartType_radar)?chartConstant.C_iChartScale_Radar:chartConstant.C_iChartScale_BarLine,
            stepValue:stepVal,
            start:start
        }
    };
    /**
     * 设置刻度增量阀值
     * @param minVal
     * @param maxVal
     * @param chartType
     * @returns {number}
     * @private
     */
    chart.prototype._setBound = function(minVal,maxVal,chartType){
        var absMinVal = Math.abs(minVal),absMaxVal = Math.abs(maxVal),
            bound = 1,stepVal = -1,temp = -1,integerBit = 0,decimalBit = 0,isMinus = (minVal < 0)?true:false,scaleNum= 0,
            scaleNum = (chartType == chartConstant.C_iChartType_radar)?chartConstant.C_iChartScale_Radar:chartConstant.C_iChartScale_BarLine;
        if(isMinus){//是否是负数
            temp = (maxVal >=0)?(absMaxVal+absMinVal)/scaleNum:absMinVal/scaleNum;
        }else {
            temp = absMaxVal/scaleNum;
        }
        var isDecimal = (temp > 0 && temp < 1) ? true : false;
        if(isDecimal) {//是否是小数
            var digitLimit = chartConstant.C_iChartScale_DigitLimit;
            while((((temp*10 + "").indexOf(".")) != -1) && digitLimit > 0){
                bound = bound/10;
                temp = temp*10;
                digitLimit --;
            }
        }else {
            while(temp/10 >=1){
                bound *= 10;
                temp = temp/10;
            }
        }
        temp = (bound >= 1) ? temp : temp*bound;
        temp += "";
        integerBit = parseInt(temp.substring(0,temp.indexOf(".")));
        decimalBit = parseInt(temp.substring(temp.indexOf(".")+1,3));
        var newTemp = 0;
        if(decimalBit >= 5){
            newTemp = (integerBit > 0)?parseFloat(integerBit + "." + decimalBit):parseInt(decimalBit);
            stepVal = (bound >= 1) ? (Math.ceil(newTemp)*bound):(Math.ceil(newTemp*bound) * bound);
        }else {
            newTemp = (integerBit > 0)?parseFloat(integerBit + ".5"):(5/bound)/10;
            stepVal = newTemp*bound;
        }
        return stepVal;
    };
    /**
     * 设置数据组显示数量（折线图+柱状图）
     * @param data
     * @returns {number}
     * @private
     */
    chart.prototype._setShowNumber = function(data){
        var len = data.option.series.length+1,showNum = 0;
        showNum = chartConstant.C_iChartShowNum_Default - len;
        return showNum <=0 ? 1:showNum;
    };
    /**
     * 除去数组中相同的元素
     * @param array
     * @returns {*|Array}
     */
    chart.prototype._uniqueArray = function(array){
        array = array || [];
        var a = {};
        var i = 0,len = array.length;
        for (; i<len; i++) {
            var v = array[i];
            if (typeof(a[v]) == 'undefined'){
                a[v] = 1;
            }
        };
        array.length=0;
        for (var i in a){
            array[array.length] = parseFloat(i);
        }
        return array;
    };
    /**
     * 从小到大排列数组
     * @param array
     * @returns {*}
     */
    chart.prototype._sortArray = function(array){
        var i = 0;
        var j = array.length - 1;
        var Sort = function(i, j) {
            if (i == j) {
                return
            };
            var key = array[i];
            var stepi = i;
            var stepj = j;
            while (j > i) {
                if (array[j] >= key) {
                    j--;
                } else {
                    array[i] = array[j];
                    while (j > ++i) {
                        if (array[i] > key) {
                            array[j] = array[i];
                            break;
                        }
                    }
                }
            }
            if (stepi == i) {
                Sort(++i, stepj);
                return;
            }
            array[i] = key;
            Sort(stepi, i);
            Sort(j, stepj);
        }
        Sort(i, j);
        return array;
    }
    //==============================模板==============================================//
    var temp =
        '<div class="cmp-chart-title"><%=this.option.title.text %></div>'+
        '<div class="cmp-chart-legend" id="chart_legend">' +
        '<div class="scroller">' +
        '<% var i=0, legendData=this.option.legend.data, len=legendData.length,type=this.option.series[0].type; %>'+
        '<% for(;i < len;i++){ %>' +
        '<div class="cmp-chart-glyphlinex transverse-mark"><span class="cmp-icon iconfont icon-stop" style="width: 16px;color: <%=this.option.color[i] %>"></span><span class="chart-glyphtext"><%=legendData[i].name %></span></div>'+
        '<% } %>'+
        '</div>'+
        '</div>'+
        '<canvas id="chart_canvas"></canvas>'+
        '<% if(type == "pie"){ %>'+
        '<div class="cmp-chart-arrow-container" id="chart_arrow_container" style="display: none;"></div>'+
        '<% }else if(type == "line" || type == "bar"){ %>'+
        '<div class="cmp-chart-detail-container-parent">' +
        '<div class="cmp-chart-detail-container" id="chart_detail_container" style="opacity:0;"></div>'+
        '</div>'+
        '<% } %>';
    var glyphlinex =
        '<% var i=0, legendData=this.option.legend.data, len=legendData.length; %>'+
        '<% for(;i < len;i++){ %>' +
        '<div class="cmp-chart-glyphlinex transverse-mark"><span class="cmp-icon iconfont icon-stop" style="width: 16px;color: <%=this.option.color[i] %>"></span><span class="chart-glyphtext"><%=legendData[i].name %></span></div>'+
        '<% } %>';
    /**
     * 统计图
     * @namespace cmp
     * @class chart
     * @requires JChart插件
     * @constructor
     * @demo cmp-chart.html
     * @show true
     * @param {string} container 绘制统计图的容器,可以接受以id或class名查询到的容器，格式如："#id"或".class"
     * @param {object} data 统计图数据
     * @returns {Object} 统计图对象
     */
    _.chart = function(container,data){
        var chartWidget = new chart(container,data);
        return chartWidget;
    };
    /**
     * 公有方法，提供给外部调用，用于重新绘图
     * @method draw
     * @param {object} data 统计图数据
     * @example
     *      <script>
     *          var chart = cmp.chart(container,oldData);   //实例化chart对象
     *          chart.draw(newData);   //调用draw方法
     *      </script>
     */
    chart.prototype.draw = function(data){
        var self = this;
        if(self.chart != null) self.chart = null;
        self.stepValueCache = [];
        self._handleCanvasContainer();
        self._handlePieContainer(data);
        self._handleDetailContainer(data);
        self._createChart(self.basicDiv,data);
        self._renderLegend(data);
    };
})(cmp,JChart);
