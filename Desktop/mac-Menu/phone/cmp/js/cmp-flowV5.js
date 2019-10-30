!function(a,b){"function"==typeof define&&define.amd?define(function(){return b(a,a.document)}):"object"==typeof exports?module.exports=a.document?b(a,a.document):function(a){return b(a,a.document)}:a.SVG=b(a,a.document)}("undefined"!=typeof window?window:this,function(b,c){function d(a,b,c,d){return c+d.replace(v.regex.dots," .")}function e(a){for(var b=a.slice(0),c=b.length;c--;)Array.isArray(b[c])&&(b[c]=e(b[c]));return b}function f(a,b){return a instanceof b}function g(a,b){return(a.matches||a.matchesSelector||a.msMatchesSelector||a.mozMatchesSelector||a.webkitMatchesSelector||a.oMatchesSelector).call(a,b)}function h(a){return a.toLowerCase().replace(/-(.)/g,function(a,b){return b.toUpperCase()})}function i(a){return a.charAt(0).toUpperCase()+a.slice(1)}function j(a){return 4==a.length?["#",a.substring(1,2),a.substring(1,2),a.substring(2,3),a.substring(2,3),a.substring(3,4),a.substring(3,4)].join(""):a}function k(a){var b=a.toString(16);return 1==b.length?"0"+b:b}function l(a,b,c){if(null==b||null==c){var d=a.bbox();null==b?b=d.width/d.height*c:null==c&&(c=d.height/d.width*b)}return{width:b,height:c}}function m(a,b,c){return{x:b*a.a+c*a.c+0,y:b*a.b+c*a.d+0}}function n(a){return{a:a[0],b:a[1],c:a[2],d:a[3],e:a[4],f:a[5]}}function o(a){return a instanceof v.Matrix||(a=new v.Matrix(a)),a}function p(a,b){a.cx=null==a.cx?b.bbox().cx:a.cx,a.cy=null==a.cy?b.bbox().cy:a.cy}function q(a){return a=a.replace(v.regex.whitespace,"").replace(v.regex.matrix,"").split(v.regex.matrixElements),n(v.utils.map(a,function(a){return parseFloat(a)}))}function r(a){for(var b=0,c=a.length,d="";c>b;b++)d+=a[b][0],null!=a[b][1]&&(d+=a[b][1],null!=a[b][2]&&(d+=" ",d+=a[b][2],null!=a[b][3]&&(d+=" ",d+=a[b][3],d+=" ",d+=a[b][4],null!=a[b][5]&&(d+=" ",d+=a[b][5],d+=" ",d+=a[b][6],null!=a[b][7]&&(d+=" ",d+=a[b][7])))));return d+" "}function s(a){for(var b=a.childNodes.length-1;b>=0;b--)a.childNodes[b]instanceof SVGElement&&s(a.childNodes[b]);return v.adopt(a).id(v.eid(a.nodeName))}function t(a){return null==a.x&&(a.x=0,a.y=0,a.width=0,a.height=0),a.w=a.width,a.h=a.height,a.x2=a.x+a.width,a.y2=a.y+a.height,a.cx=a.x+a.width/2,a.cy=a.y+a.height/2,a}function u(a){var b=a.toString().match(v.regex.reference);return b?b[1]:void 0}var v=this.SVG=function(a){return v.supported?(a=new v.Doc(a),v.parser.draw||v.prepare(),a):void 0};if(v.ns="http://www.w3.org/2000/svg",v.xmlns="http://www.w3.org/2000/xmlns/",v.xlink="http://www.w3.org/1999/xlink",v.svgjs="http://svgjs.com/svgjs",v.supported=function(){return!!c.createElementNS&&!!c.createElementNS(v.ns,"svg").createSVGRect}(),!v.supported)return!1;v.did=1e3,v.eid=function(a){return"Svgjs"+i(a)+v.did++},v.create=function(a){var b=c.createElementNS(this.ns,a);return b.setAttribute("id",this.eid(a)),b},v.extend=function(){var a,b,c,d;for(a=[].slice.call(arguments),b=a.pop(),d=a.length-1;d>=0;d--)if(a[d])for(c in b)a[d].prototype[c]=b[c];v.Set&&v.Set.inherit&&v.Set.inherit()},v.invent=function(a){var b="function"==typeof a.create?a.create:function(){this.constructor.call(this,v.create(a.create))};return a.inherit&&(b.prototype=new a.inherit),a.extend&&v.extend(b,a.extend),a.construct&&v.extend(a.parent||v.Container,a.construct),b},v.adopt=function(a){if(!a)return null;if(a.instance)return a.instance;var b;return b="svg"==a.nodeName?a.parentNode instanceof SVGElement?new v.Nested:new v.Doc:"linearGradient"==a.nodeName?new v.Gradient("linear"):"radialGradient"==a.nodeName?new v.Gradient("radial"):v[i(a.nodeName)]?new(v[i(a.nodeName)]):new v.Element(a),b.type=a.nodeName,b.node=a,a.instance=b,b instanceof v.Doc&&b.namespace().defs(),b.setData(JSON.parse(a.getAttribute("svgjs:data"))||{}),b},v.prepare=function(){var a=c.getElementsByTagName("body")[0],b=(a?new v.Doc(a):new v.Doc(c.documentElement).nested()).size(2,0);v.parser={body:a||c.documentElement,draw:b.style("opacity:0;position:absolute;left:-100%;top:-100%;overflow:hidden"),poly:b.polyline().node,path:b.path().node,"native":v.create("svg")}},v.parser={"native":v.create("svg")},c.addEventListener("DOMContentLoaded",function(){v.parser.draw||v.prepare()},!1),v.regex={numberAndUnit:/^([+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?)([a-z%]*)$/i,hex:/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i,rgb:/rgb\((\d+),(\d+),(\d+)\)/,reference:/#([a-z0-9\-_]+)/i,matrix:/matrix\(|\)/g,matrixElements:/,*\s+|,/,whitespace:/\s/g,isHex:/^#[a-f0-9]{3,6}$/i,isRgb:/^rgb\(/,isCss:/[^:]+:[^;]+;?/,isBlank:/^(\s+)?$/,isNumber:/^[+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i,isPercent:/^-?[\d\.]+%$/,isImage:/\.(jpg|jpeg|png|gif|svg)(\?[^=]+.*)?/i,delimiter:/[\s,]+/,hyphen:/([^e])\-/gi,pathLetters:/[MLHVCSQTAZ]/gi,isPathLetter:/[MLHVCSQTAZ]/i,numbersWithDots:/((\d?\.\d+(?:e[+-]?\d+)?)((?:\.\d+(?:e[+-]?\d+)?)+))+/gi,dots:/\./g},v.utils={map:function(a,b){var c,d=a.length,e=[];for(c=0;d>c;c++)e.push(b(a[c]));return e},filter:function(a,b){var c,d=a.length,e=[];for(c=0;d>c;c++)b(a[c])&&e.push(a[c]);return e},radians:function(a){return a%360*Math.PI/180},degrees:function(a){return 180*a/Math.PI%360},filterSVGElements:function(a){return this.filter(a,function(a){return a instanceof SVGElement})}},v.defaults={attrs:{"fill-opacity":1,"stroke-opacity":1,"stroke-width":0,"stroke-linejoin":"miter","stroke-linecap":"butt",fill:"#000000",stroke:"#000000",opacity:1,x:0,y:0,cx:0,cy:0,width:0,height:0,r:0,rx:0,ry:0,offset:0,"stop-opacity":1,"stop-color":"#000000","font-size":16,"font-family":"Helvetica, Arial, sans-serif","text-anchor":"start"}},v.Color=function(a){var b;this.r=0,this.g=0,this.b=0,a&&("string"==typeof a?v.regex.isRgb.test(a)?(b=v.regex.rgb.exec(a.replace(/\s/g,"")),this.r=parseInt(b[1]),this.g=parseInt(b[2]),this.b=parseInt(b[3])):v.regex.isHex.test(a)&&(b=v.regex.hex.exec(j(a)),this.r=parseInt(b[1],16),this.g=parseInt(b[2],16),this.b=parseInt(b[3],16)):"object"==typeof a&&(this.r=a.r,this.g=a.g,this.b=a.b))},v.extend(v.Color,{toString:function(){return this.toHex()},toHex:function(){return"#"+k(this.r)+k(this.g)+k(this.b)},toRgb:function(){return"rgb("+[this.r,this.g,this.b].join()+")"},brightness:function(){return this.r/255*.3+this.g/255*.59+this.b/255*.11},morph:function(a){return this.destination=new v.Color(a),this},at:function(a){return this.destination?(a=0>a?0:a>1?1:a,new v.Color({r:~~(this.r+(this.destination.r-this.r)*a),g:~~(this.g+(this.destination.g-this.g)*a),b:~~(this.b+(this.destination.b-this.b)*a)})):this}}),v.Color.test=function(a){return a+="",v.regex.isHex.test(a)||v.regex.isRgb.test(a)},v.Color.isRgb=function(a){return a&&"number"==typeof a.r&&"number"==typeof a.g&&"number"==typeof a.b},v.Color.isColor=function(a){return v.Color.isRgb(a)||v.Color.test(a)},v.Array=function(a,b){a=(a||[]).valueOf(),0==a.length&&b&&(a=b.valueOf()),this.value=this.parse(a)},v.extend(v.Array,{morph:function(a){if(this.destination=this.parse(a),this.value.length!=this.destination.length){for(var b=this.value[this.value.length-1],c=this.destination[this.destination.length-1];this.value.length>this.destination.length;)this.destination.push(c);for(;this.value.length<this.destination.length;)this.value.push(b)}return this},settle:function(){for(var a=0,b=this.value.length,c=[];b>a;a++)-1==c.indexOf(this.value[a])&&c.push(this.value[a]);return this.value=c},at:function(a){if(!this.destination)return this;for(var b=0,c=this.value.length,d=[];c>b;b++)d.push(this.value[b]+(this.destination[b]-this.value[b])*a);return new v.Array(d)},toString:function(){return this.value.join(" ")},valueOf:function(){return this.value},parse:function(a){return a=a.valueOf(),Array.isArray(a)?a:this.split(a)},split:function(a){return a.trim().split(v.regex.delimiter).map(parseFloat)},reverse:function(){return this.value.reverse(),this},clone:function(){var a=new this.constructor;return a.value=e(this.value),a}}),v.PointArray=function(a,b){v.Array.call(this,a,b||[[0,0]])},v.PointArray.prototype=new v.Array,v.PointArray.prototype.constructor=v.PointArray,v.extend(v.PointArray,{toString:function(){for(var a=0,b=this.value.length,c=[];b>a;a++)c.push(this.value[a].join(","));return c.join(" ")},toLine:function(){return{x1:this.value[0][0],y1:this.value[0][1],x2:this.value[1][0],y2:this.value[1][1]}},at:function(a){if(!this.destination)return this;for(var b=0,c=this.value.length,d=[];c>b;b++)d.push([this.value[b][0]+(this.destination[b][0]-this.value[b][0])*a,this.value[b][1]+(this.destination[b][1]-this.value[b][1])*a]);return new v.PointArray(d)},parse:function(a){var b=[];if(a=a.valueOf(),Array.isArray(a)){if(Array.isArray(a[0]))return a}else a=a.trim().split(/[\s,]+/);a.length%2!==0&&a.pop();for(var c=0,d=a.length;d>c;c+=2)b.push([parseFloat(a[c]),parseFloat(a[c+1])]);return b},move:function(a,b){var c=this.bbox();if(a-=c.x,b-=c.y,!isNaN(a)&&!isNaN(b))for(var d=this.value.length-1;d>=0;d--)this.value[d]=[this.value[d][0]+a,this.value[d][1]+b];return this},size:function(a,b){var c,d=this.bbox();for(c=this.value.length-1;c>=0;c--)d.width&&(this.value[c][0]=(this.value[c][0]-d.x)*a/d.width+d.x),d.height&&(this.value[c][1]=(this.value[c][1]-d.y)*b/d.height+d.y);return this},bbox:function(){return v.parser.poly.setAttribute("points",this.toString()),v.parser.poly.getBBox()}}),v.PathArray=function(a,b){v.Array.call(this,a,b||[["M",0,0]])},v.PathArray.prototype=new v.Array,v.PathArray.prototype.constructor=v.PathArray,v.extend(v.PathArray,{toString:function(){return r(this.value)},move:function(a,b){var c=this.bbox();if(a-=c.x,b-=c.y,!isNaN(a)&&!isNaN(b))for(var d,e=this.value.length-1;e>=0;e--)d=this.value[e][0],"M"==d||"L"==d||"T"==d?(this.value[e][1]+=a,this.value[e][2]+=b):"H"==d?this.value[e][1]+=a:"V"==d?this.value[e][1]+=b:"C"==d||"S"==d||"Q"==d?(this.value[e][1]+=a,this.value[e][2]+=b,this.value[e][3]+=a,this.value[e][4]+=b,"C"==d&&(this.value[e][5]+=a,this.value[e][6]+=b)):"A"==d&&(this.value[e][6]+=a,this.value[e][7]+=b);return this},size:function(a,b){var c,d,e=this.bbox();for(c=this.value.length-1;c>=0;c--)d=this.value[c][0],"M"==d||"L"==d||"T"==d?(this.value[c][1]=(this.value[c][1]-e.x)*a/e.width+e.x,this.value[c][2]=(this.value[c][2]-e.y)*b/e.height+e.y):"H"==d?this.value[c][1]=(this.value[c][1]-e.x)*a/e.width+e.x:"V"==d?this.value[c][1]=(this.value[c][1]-e.y)*b/e.height+e.y:"C"==d||"S"==d||"Q"==d?(this.value[c][1]=(this.value[c][1]-e.x)*a/e.width+e.x,this.value[c][2]=(this.value[c][2]-e.y)*b/e.height+e.y,this.value[c][3]=(this.value[c][3]-e.x)*a/e.width+e.x,this.value[c][4]=(this.value[c][4]-e.y)*b/e.height+e.y,"C"==d&&(this.value[c][5]=(this.value[c][5]-e.x)*a/e.width+e.x,this.value[c][6]=(this.value[c][6]-e.y)*b/e.height+e.y)):"A"==d&&(this.value[c][1]=this.value[c][1]*a/e.width,this.value[c][2]=this.value[c][2]*b/e.height,this.value[c][6]=(this.value[c][6]-e.x)*a/e.width+e.x,this.value[c][7]=(this.value[c][7]-e.y)*b/e.height+e.y);return this},equalCommands:function(a){var b,c,d;for(a=new v.PathArray(a),d=this.value.length===a.value.length,b=0,c=this.value.length;d&&c>b;b++)d=this.value[b][0]===a.value[b][0];return d},morph:function(a){return a=new v.PathArray(a),this.equalCommands(a)?this.destination=a:this.destination=null,this},at:function(a){if(!this.destination)return this;var b,c,d,e,f=this.value,g=this.destination.value,h=[],i=new v.PathArray;for(b=0,c=f.length;c>b;b++){for(h[b]=[f[b][0]],d=1,e=f[b].length;e>d;d++)h[b][d]=f[b][d]+(g[b][d]-f[b][d])*a;"A"===h[b][0]&&(h[b][4]=+(0!=h[b][4]),h[b][5]=+(0!=h[b][5]))}return i.value=h,i},parse:function(a){if(a instanceof v.PathArray)return a.valueOf();var b,c,e,f,g,h,i=0,j=0,k={M:2,L:2,H:1,V:1,C:6,S:4,Q:4,T:2,A:7};a="string"==typeof a?a.replace(v.regex.numbersWithDots,d).replace(v.regex.pathLetters," $& ").replace(v.regex.hyphen,"$1 -").trim().split(v.regex.delimiter):a.reduce(function(a,b){return[].concat.apply(a,b)},[]);var h=[];do{for(v.regex.isPathLetter.test(a[0])?(f=a[0],a.shift()):"M"==f?f="L":"m"==f&&(f="l"),g=[f.toUpperCase()],b=0;b<k[g[0]];++b)g.push(parseFloat(a.shift()));f==g[0]?"M"==f||"L"==f||"C"==f||"Q"==f||"S"==f||"T"==f?(i=g[k[g[0]]-1],j=g[k[g[0]]]):"V"==f?j=g[1]:"H"==f?i=g[1]:"A"==f&&(i=g[6],j=g[7]):"m"==f||"l"==f||"c"==f||"s"==f||"q"==f||"t"==f?(g[1]+=i,g[2]+=j,null!=g[3]&&(g[3]+=i,g[4]+=j),null!=g[5]&&(g[5]+=i,g[6]+=j),i=g[k[g[0]]-1],j=g[k[g[0]]]):"v"==f?(g[1]+=j,j=g[1]):"h"==f?(g[1]+=i,i=g[1]):"a"==f&&(g[6]+=i,g[7]+=j,i=g[6],j=g[7]),"M"==g[0]&&(c=i,e=j),"Z"==g[0]&&(i=c,j=e),h.push(g)}while(a.length);return h},bbox:function(){return v.parser.path.setAttribute("d",this.toString()),v.parser.path.getBBox()}}),v.Number=v.invent({create:function(a,b){this.value=0,this.unit=b||"","number"==typeof a?this.value=isNaN(a)?0:isFinite(a)?a:0>a?-3.4e38:3.4e38:"string"==typeof a?(b=a.match(v.regex.numberAndUnit),b&&(this.value=parseFloat(b[1]),"%"==b[5]?this.value/=100:"s"==b[5]&&(this.value*=1e3),this.unit=b[5])):a instanceof v.Number&&(this.value=a.valueOf(),this.unit=a.unit)},extend:{toString:function(){return("%"==this.unit?~~(1e8*this.value)/1e6:"s"==this.unit?this.value/1e3:this.value)+this.unit},toJSON:function(){return this.toString()},valueOf:function(){return this.value},plus:function(a){return a=new v.Number(a),new v.Number(this+a,this.unit||a.unit)},minus:function(a){return a=new v.Number(a),new v.Number(this-a,this.unit||a.unit)},times:function(a){return a=new v.Number(a),new v.Number(this*a,this.unit||a.unit)},divide:function(a){return a=new v.Number(a),new v.Number(this/a,this.unit||a.unit)},to:function(a){var b=new v.Number(this);return"string"==typeof a&&(b.unit=a),b},morph:function(a){return this.destination=new v.Number(a),a.relative&&(this.destination.value+=this.value),this},at:function(a){return this.destination?new v.Number(this.destination).minus(this).times(a).plus(this):this}}}),v.Element=v.invent({create:function(a){this._stroke=v.defaults.attrs.stroke,this._event=null,this.dom={},(this.node=a)&&(this.type=a.nodeName,this.node.instance=this,this._stroke=a.getAttribute("stroke")||this._stroke)},extend:{x:function(a){return this.attr("x",a)},y:function(a){return this.attr("y",a)},cx:function(a){return null==a?this.x()+this.width()/2:this.x(a-this.width()/2)},cy:function(a){return null==a?this.y()+this.height()/2:this.y(a-this.height()/2)},move:function(a,b){return this.x(a).y(b)},center:function(a,b){return this.cx(a).cy(b)},width:function(a){return this.attr("width",a)},height:function(a){return this.attr("height",a)},size:function(a,b){var c=l(this,a,b);return this.width(new v.Number(c.width)).height(new v.Number(c.height))},pos:function(a,b){return this.x(new v.Number(a)).y(new v.Number(b))},clone:function(a,b){this.writeDataToDom();var c=s(this.node.cloneNode(!0));return a?a.add(c):this.after(c),c},remove:function(){return this.parent()&&this.parent().removeElement(this),this},replace:function(a){return this.after(a).remove(),a},addTo:function(a){return a.put(this)},putIn:function(a){return a.add(this)},id:function(a){return this.attr("id",a)},inside:function(a,b){var c=this.bbox();return a>c.x&&b>c.y&&a<c.x+c.width&&b<c.y+c.height},show:function(){return this.style("display","")},hide:function(){return this.style("display","none")},visible:function(){return"none"!=this.style("display")},toString:function(){return this.attr("id")},classes:function(){var a=this.attr("class");return null==a?[]:a.trim().split(/\s+/)},hasClass:function(a){return-1!=this.classes().indexOf(a)},addClass:function(a){if(!this.hasClass(a)){var b=this.classes();b.push(a),this.attr("class",b.join(" "))}return this},removeClass:function(a){return this.hasClass(a)&&this.attr("class",this.classes().filter(function(b){return b!=a}).join(" ")),this},toggleClass:function(a){return this.hasClass(a)?this.removeClass(a):this.addClass(a)},reference:function(a){return v.get(this.attr(a))},parent:function(a){var b=this;if(!b.node.parentNode)return null;if(b=v.adopt(b.node.parentNode),!a)return b;for(;b&&b.node instanceof SVGElement;){if("string"==typeof a?b.matches(a):b instanceof a)return b;b=v.adopt(b.node.parentNode)}},doc:function(){return this instanceof v.Doc?this:this.parent(v.Doc)},parents:function(a){var b=[],c=this;do{if(c=c.parent(a),!c||!c.node)break;b.push(c)}while(c.parent);return b},matches:function(a){return g(this.node,a)},"native":function(){return this.node},svg:function(a){var b=c.createElement("svg");if(!(a&&this instanceof v.Parent))return b.appendChild(a=c.createElement("svg")),this.writeDataToDom(),a.appendChild(this.node.cloneNode(!0)),b.innerHTML.replace(/^<svg>/,"").replace(/<\/svg>$/,"");b.innerHTML="<svg>"+a.replace(/\n/,"").replace(/<(\w+)([^<]+?)\/>/g,"<$1$2></$1>")+"</svg>";for(var d=0,e=b.firstChild.childNodes.length;e>d;d++)this.node.appendChild(b.firstChild.firstChild);return this},writeDataToDom:function(){if(this.each||this.lines){var a=this.each?this:this.lines();a.each(function(){this.writeDataToDom()})}return this.node.removeAttribute("svgjs:data"),Object.keys(this.dom).length&&this.node.setAttribute("svgjs:data",JSON.stringify(this.dom)),this},setData:function(a){return this.dom=a,this},is:function(a){return f(this,a)}}}),v.easing={"-":function(a){return a},"<>":function(a){return-Math.cos(a*Math.PI)/2+.5},">":function(a){return Math.sin(a*Math.PI/2)},"<":function(a){return-Math.cos(a*Math.PI/2)+1}},v.morph=function(a){return function(b,c){return new v.MorphObj(b,c).at(a)}},v.Situation=v.invent({create:function(a){this.init=!1,this.reversed=!1,this.reversing=!1,this.duration=new v.Number(a.duration).valueOf(),this.delay=new v.Number(a.delay).valueOf(),this.start=+new Date+this.delay,this.finish=this.start+this.duration,this.ease=a.ease,this.loop=0,this.loops=!1,this.animations={},this.attrs={},this.styles={},this.transforms=[],this.once={}}}),v.FX=v.invent({create:function(a){this._target=a,this.situations=[],this.active=!1,this.situation=null,this.paused=!1,this.lastPos=0,this.pos=0,this.absPos=0,this._speed=1},extend:{animate:function(a,b,c){"object"==typeof a&&(b=a.ease,c=a.delay,a=a.duration);var d=new v.Situation({duration:a||1e3,delay:c||0,ease:v.easing[b||"-"]||b});return this.queue(d),this},delay:function(a){var b=new v.Situation({duration:a,delay:0,ease:v.easing["-"]});return this.queue(b)},target:function(a){return a&&a instanceof v.Element?(this._target=a,this):this._target},timeToAbsPos:function(a){return(a-this.situation.start)/(this.situation.duration/this._speed)},absPosToTime:function(a){return this.situation.duration/this._speed*a+this.situation.start},startAnimFrame:function(){this.stopAnimFrame(),this.animationFrame=requestAnimationFrame(function(){this.step()}.bind(this))},stopAnimFrame:function(){cancelAnimationFrame(this.animationFrame)},start:function(){return!this.active&&this.situation&&(this.active=!0,this.startCurrent()),this},startCurrent:function(){return this.situation.start=+new Date+this.situation.delay/this._speed,this.situation.finish=this.situation.start+this.situation.duration/this._speed,this.initAnimations().step()},queue:function(a){return("function"==typeof a||a instanceof v.Situation)&&this.situations.push(a),this.situation||(this.situation=this.situations.shift()),this},dequeue:function(){return this.stop(),this.situation=this.situations.shift(),this.situation&&(this.situation instanceof v.Situation?this.start():this.situation.call(this)),this},initAnimations:function(){var a,b,c=this.situation;if(c.init)return this;for(a in c.animations)b=this.target()[a](),c.animations[a]instanceof v.Number&&(b=new v.Number(b)),c.animations[a]=b.morph(c.animations[a]);for(a in c.attrs)c.attrs[a]=new v.MorphObj(this.target().attr(a),c.attrs[a]);for(a in c.styles)c.styles[a]=new v.MorphObj(this.target().style(a),c.styles[a]);return c.initialTransformation=this.target().matrixify(),c.init=!0,this},clearQueue:function(){return this.situations=[],this},clearCurrent:function(){return this.situation=null,this},stop:function(a,b){var c=this.active;return this.active=!1,b&&this.clearQueue(),a&&this.situation&&(!c&&this.startCurrent(),this.atEnd()),this.stopAnimFrame(),this.clearCurrent()},reset:function(){if(this.situation){var a=this.situation;this.stop(),this.situation=a,this.atStart()}return this},finish:function(){for(this.stop(!0,!1);this.dequeue().situation&&this.stop(!0,!1););return this.clearQueue().clearCurrent(),this},atStart:function(){return this.at(0,!0)},atEnd:function(){return this.situation.loops===!0&&(this.situation.loops=this.situation.loop+1),"number"==typeof this.situation.loops?this.at(this.situation.loops,!0):this.at(1,!0)},at:function(a,b){var c=this.situation.duration/this._speed;return this.absPos=a,b||(this.situation.reversed&&(this.absPos=1-this.absPos),this.absPos+=this.situation.loop),this.situation.start=+new Date-this.absPos*c,this.situation.finish=this.situation.start+c,this.step(!0)},speed:function(a){return 0===a?this.pause():a?(this._speed=a,this.at(this.absPos,!0)):this._speed},loop:function(a,b){var c=this.last();return c.loops=null!=a?a:!0,c.loop=0,b&&(c.reversing=!0),this},pause:function(){return this.paused=!0,this.stopAnimFrame(),this},play:function(){return this.paused?(this.paused=!1,this.at(this.absPos,!0)):this},reverse:function(a){var b=this.last();return"undefined"==typeof a?b.reversed=!b.reversed:b.reversed=a,this},progress:function(a){return a?this.situation.ease(this.pos):this.pos},after:function(a){var b=this.last(),c=function d(c){c.detail.situation==b&&(a.call(this,b),this.off("finished.fx",d))};return this.target().on("finished.fx",c),this._callStart()},during:function(a){var b=this.last(),c=function(c){c.detail.situation==b&&a.call(this,c.detail.pos,v.morph(c.detail.pos),c.detail.eased,b)};return this.target().off("during.fx",c).on("during.fx",c),this.after(function(){this.off("during.fx",c)}),this._callStart()},afterAll:function(a){var b=function c(b){a.call(this),this.off("allfinished.fx",c)};return this.target().off("allfinished.fx",b).on("allfinished.fx",b),this._callStart()},duringAll:function(a){var b=function(b){a.call(this,b.detail.pos,v.morph(b.detail.pos),b.detail.eased,b.detail.situation)};return this.target().off("during.fx",b).on("during.fx",b),this.afterAll(function(){this.off("during.fx",b)}),this._callStart()},last:function(){return this.situations.length?this.situations[this.situations.length-1]:this.situation},add:function(a,b,c){return this.last()[c||"animations"][a]=b,this._callStart()},step:function(a){if(a||(this.absPos=this.timeToAbsPos(+new Date)),this.situation.loops!==!1){var b,c,d;b=Math.max(this.absPos,0),c=Math.floor(b),this.situation.loops===!0||c<this.situation.loops?(this.pos=b-c,d=this.situation.loop,this.situation.loop=c):(this.absPos=this.situation.loops,this.pos=1,d=this.situation.loop-1,this.situation.loop=this.situation.loops),this.situation.reversing&&(this.situation.reversed=this.situation.reversed!=Boolean((this.situation.loop-d)%2))}else this.absPos=Math.min(this.absPos,1),this.pos=this.absPos;this.pos<0&&(this.pos=0),this.situation.reversed&&(this.pos=1-this.pos);var e=this.situation.ease(this.pos);for(var f in this.situation.once)f>this.lastPos&&e>=f&&(this.situation.once[f].call(this.target(),this.pos,e),delete this.situation.once[f]);return this.active&&this.target().fire("during",{pos:this.pos,eased:e,fx:this,situation:this.situation}),this.situation?(this.eachAt(),1==this.pos&&!this.situation.reversed||this.situation.reversed&&0==this.pos?(this.stopAnimFrame(),this.target().fire("finished",{fx:this,situation:this.situation}),this.situations.length||(this.target().fire("allfinished"),this.target().off(".fx"),this.active=!1),this.active?this.dequeue():this.clearCurrent()):!this.paused&&this.active&&this.startAnimFrame(),this.lastPos=e,this):this},eachAt:function(){var a,b,c=this,d=this.target(),e=this.situation;for(a in e.animations)b=[].concat(e.animations[a]).map(function(a){return"string"!=typeof a&&a.at?a.at(e.ease(c.pos),c.pos):a}),d[a].apply(d,b);for(a in e.attrs)b=[a].concat(e.attrs[a]).map(function(a){return"string"!=typeof a&&a.at?a.at(e.ease(c.pos),c.pos):a}),d.attr.apply(d,b);for(a in e.styles)b=[a].concat(e.styles[a]).map(function(a){return"string"!=typeof a&&a.at?a.at(e.ease(c.pos),c.pos):a}),d.style.apply(d,b);if(e.transforms.length){for(b=e.initialTransformation,a=0,len=e.transforms.length;a<len;a++){var f=e.transforms[a];f instanceof v.Matrix?b=f.relative?b.multiply((new v.Matrix).morph(f).at(e.ease(this.pos))):b.morph(f).at(e.ease(this.pos)):(f.relative||f.undo(b.extract()),b=b.multiply(f.at(e.ease(this.pos))))}d.matrix(b)}return this},once:function(a,b,c){return c||(a=this.situation.ease(a)),this.situation.once[a]=b,this},_callStart:function(){return setTimeout(function(){this.start()}.bind(this),0),this}},parent:v.Element,construct:{animate:function(a,b,c){return(this.fx||(this.fx=new v.FX(this))).animate(a,b,c)},delay:function(a){return(this.fx||(this.fx=new v.FX(this))).delay(a)},stop:function(a,b){return this.fx&&this.fx.stop(a,b),this},finish:function(){return this.fx&&this.fx.finish(),this},pause:function(){return this.fx&&this.fx.pause(),this},play:function(){return this.fx&&this.fx.play(),this},speed:function(a){if(this.fx){if(null==a)return this.fx.speed();this.fx.speed(a)}return this}}}),v.MorphObj=v.invent({create:function(a,b){return v.Color.isColor(b)?new v.Color(a).morph(b):v.regex.numberAndUnit.test(b)?new v.Number(a).morph(b):(this.value=a,void(this.destination=b))},extend:{at:function(a,b){return 1>b?this.value:this.destination},valueOf:function(){return this.value}}}),v.extend(v.FX,{attr:function(a,b,c){if("object"==typeof a)for(var d in a)this.attr(d,a[d]);else this.add(a,b,"attrs");return this},style:function(a,b){if("object"==typeof a)for(var c in a)this.style(c,a[c]);else this.add(a,b,"styles");return this},x:function(a,b){if(this.target()instanceof v.G)return this.transform({x:a},b),this;var c=new v.Number(a);return c.relative=b,this.add("x",c)},y:function(a,b){if(this.target()instanceof v.G)return this.transform({y:a},b),this;var c=new v.Number(a);return c.relative=b,this.add("y",c)},cx:function(a){return this.add("cx",new v.Number(a))},cy:function(a){return this.add("cy",new v.Number(a))},move:function(a,b){return this.x(a).y(b)},center:function(a,b){return this.cx(a).cy(b)},size:function(a,b){if(this.target()instanceof v.Text)this.attr("font-size",a);else{var c;a&&b||(c=this.target().bbox()),a||(a=c.width/c.height*b),b||(b=c.height/c.width*a),this.add("width",new v.Number(a)).add("height",new v.Number(b))}return this},plot:function(){return this.add("plot",arguments.length>1?[].slice.call(arguments):arguments[0])},leading:function(a){return this.target().leading?this.add("leading",new v.Number(a)):this},viewbox:function(a,b,c,d){return this.target()instanceof v.Container&&this.add("viewbox",new v.ViewBox(a,b,c,d)),this},update:function(a){if(this.target()instanceof v.Stop){if("number"==typeof a||a instanceof v.Number)return this.update({offset:arguments[0],color:arguments[1],opacity:arguments[2]});null!=a.opacity&&this.attr("stop-opacity",a.opacity),null!=a.color&&this.attr("stop-color",a.color),null!=a.offset&&this.attr("offset",a.offset)}return this}}),v.Box=v.invent({create:function(a,b,c,d){return"object"!=typeof a||a instanceof v.Element?(4==arguments.length&&(this.x=a,this.y=b,this.width=c,this.height=d),void t(this)):v.Box.call(this,null!=a.left?a.left:a.x,null!=a.top?a.top:a.y,a.width,a.height)},extend:{merge:function(a){var b=new this.constructor;return b.x=Math.min(this.x,a.x),b.y=Math.min(this.y,a.y),b.width=Math.max(this.x+this.width,a.x+a.width)-b.x,b.height=Math.max(this.y+this.height,a.y+a.height)-b.y,t(b)},transform:function(a){var b=1/0,c=-(1/0),d=1/0,e=-(1/0),f=[new v.Point(this.x,this.y),new v.Point(this.x2,this.y),new v.Point(this.x,this.y2),new v.Point(this.x2,this.y2)];return f.forEach(function(f){f=f.transform(a),b=Math.min(b,f.x),c=Math.max(c,f.x),d=Math.min(d,f.y),e=Math.max(e,f.y)}),bbox=new this.constructor,bbox.x=b,bbox.width=c-b,bbox.y=d,bbox.height=e-d,t(bbox),bbox}}}),v.BBox=v.invent({create:function(a){if(v.Box.apply(this,[].slice.call(arguments)),a instanceof v.Element){var b;try{if(c.documentElement.contains){if(!c.documentElement.contains(a.node))throw new Exception("Element not in the dom")}else{for(var d=a.node;d.parentNode;)d=d.parentNode;if(d!=c)throw new Exception("Element not in the dom")}b=a.node.getBBox()}catch(e){if(a instanceof v.Shape){var f=a.clone(v.parser.draw).show();b=f.bbox(),f.remove()}else b={x:a.node.clientLeft,y:a.node.clientTop,width:a.node.clientWidth,height:a.node.clientHeight}}v.Box.call(this,b)}},inherit:v.Box,parent:v.Element,construct:{bbox:function(){return new v.BBox(this)}}}),v.BBox.prototype.constructor=v.BBox,v.extend(v.Element,{tbox:function(){return console.warn("Use of TBox is deprecated and mapped to RBox. Use .rbox() instead."),this.rbox(this.doc())}}),v.RBox=v.invent({create:function(a){v.Box.apply(this,[].slice.call(arguments)),a instanceof v.Element&&v.Box.call(this,a.node.getBoundingClientRect())},inherit:v.Box,parent:v.Element,extend:{addOffset:function(){return this.x+=b.pageXOffset,this.y+=b.pageYOffset,this}},construct:{rbox:function(a){return a?new v.RBox(this).transform(a.screenCTM().inverse()):new v.RBox(this).addOffset()}}}),v.RBox.prototype.constructor=v.RBox,v.Matrix=v.invent({create:function(a){var b,c=n([1,0,0,1,0,0]);for(a=a instanceof v.Element?a.matrixify():"string"==typeof a?q(a):6==arguments.length?n([].slice.call(arguments)):Array.isArray(a)?n(a):"object"==typeof a?a:c,b=x.length-1;b>=0;--b)this[x[b]]=a&&"number"==typeof a[x[b]]?a[x[b]]:c[x[b]]},extend:{extract:function(){var a=m(this,0,1),b=m(this,1,0),c=180/Math.PI*Math.atan2(a.y,a.x)-90;return{x:this.e,y:this.f,transformedX:(this.e*Math.cos(c*Math.PI/180)+this.f*Math.sin(c*Math.PI/180))/Math.sqrt(this.a*this.a+this.b*this.b),transformedY:(this.f*Math.cos(c*Math.PI/180)+this.e*Math.sin(-c*Math.PI/180))/Math.sqrt(this.c*this.c+this.d*this.d),skewX:-c,skewY:180/Math.PI*Math.atan2(b.y,b.x),scaleX:Math.sqrt(this.a*this.a+this.b*this.b),scaleY:Math.sqrt(this.c*this.c+this.d*this.d),rotation:c,a:this.a,b:this.b,c:this.c,d:this.d,e:this.e,f:this.f,matrix:new v.Matrix(this)}},clone:function(){return new v.Matrix(this)},morph:function(a){return this.destination=new v.Matrix(a),this},at:function(a){if(!this.destination)return this;var b=new v.Matrix({a:this.a+(this.destination.a-this.a)*a,b:this.b+(this.destination.b-this.b)*a,c:this.c+(this.destination.c-this.c)*a,d:this.d+(this.destination.d-this.d)*a,e:this.e+(this.destination.e-this.e)*a,f:this.f+(this.destination.f-this.f)*a});return b},multiply:function(a){return new v.Matrix(this["native"]().multiply(o(a)["native"]()))},inverse:function(){return new v.Matrix(this["native"]().inverse())},translate:function(a,b){return new v.Matrix(this["native"]().translate(a||0,b||0))},scale:function(a,b,c,d){return 1==arguments.length?b=a:3==arguments.length&&(d=c,c=b,b=a),this.around(c,d,new v.Matrix(a,0,0,b,0,0))},rotate:function(a,b,c){return a=v.utils.radians(a),this.around(b,c,new v.Matrix(Math.cos(a),Math.sin(a),-Math.sin(a),Math.cos(a),0,0))},flip:function(a,b){return b="number"==typeof a?a:b,"x"==a?this.scale(-1,1,b,0):"y"==a?this.scale(1,-1,0,b):this.scale(-1,-1,b,b)},skew:function(a,b,c,d){return 1==arguments.length?b=a:3==arguments.length&&(d=c,c=b,b=a),a=v.utils.radians(a),b=v.utils.radians(b),this.around(c,d,new v.Matrix(1,Math.tan(b),Math.tan(a),1,0,0))},skewX:function(a,b,c){return this.skew(a,0,b,c)},skewY:function(a,b,c){return this.skew(0,a,b,c)},around:function(a,b,c){return this.multiply(new v.Matrix(1,0,0,1,a||0,b||0)).multiply(c).multiply(new v.Matrix(1,0,0,1,-a||0,-b||0))},"native":function(){for(var a=v.parser["native"].createSVGMatrix(),b=x.length-1;b>=0;b--)a[x[b]]=this[x[b]];return a},toString:function(){return"matrix("+this.a+","+this.b+","+this.c+","+this.d+","+this.e+","+this.f+")"}},parent:v.Element,construct:{ctm:function(){return new v.Matrix(this.node.getCTM())},screenCTM:function(){if(this instanceof v.Nested){var a=this.rect(1,1),b=a.node.getScreenCTM();return a.remove(),new v.Matrix(b)}return new v.Matrix(this.node.getScreenCTM())}}}),v.Point=v.invent({create:function(a,b){var c,d={x:0,y:0};c=Array.isArray(a)?{x:a[0],y:a[1]}:"object"==typeof a?{
    x:a.x,y:a.y}:null!=a?{x:a,y:null!=b?b:a}:d,this.x=c.x,this.y=c.y},extend:{clone:function(){return new v.Point(this)},morph:function(a,b){return this.destination=new v.Point(a,b),this},at:function(a){if(!this.destination)return this;var b=new v.Point({x:this.x+(this.destination.x-this.x)*a,y:this.y+(this.destination.y-this.y)*a});return b},"native":function(){var a=v.parser["native"].createSVGPoint();return a.x=this.x,a.y=this.y,a},transform:function(a){return new v.Point(this["native"]().matrixTransform(a["native"]()))}}}),v.extend(v.Element,{point:function(a,b){return new v.Point(a,b).transform(this.screenCTM().inverse())}}),v.extend(v.Element,{attr:function(a,b,c){if(null==a){for(a={},b=this.node.attributes,c=b.length-1;c>=0;c--)a[b[c].nodeName]=v.regex.isNumber.test(b[c].nodeValue)?parseFloat(b[c].nodeValue):b[c].nodeValue;return a}if("object"==typeof a)for(b in a)this.attr(b,a[b]);else if(null===b)this.node.removeAttribute(a);else{if(null==b)return b=this.node.getAttribute(a),null==b?v.defaults.attrs[a]:v.regex.isNumber.test(b)?parseFloat(b):b;"stroke-width"==a?this.attr("stroke",parseFloat(b)>0?this._stroke:null):"stroke"==a&&(this._stroke=b),("fill"==a||"stroke"==a)&&(v.regex.isImage.test(b)&&(b=this.doc().defs().image(b,0,0)),b instanceof v.Image&&(b=this.doc().defs().pattern(0,0,function(){this.add(b)}))),"number"==typeof b?b=new v.Number(b):v.Color.isColor(b)?b=new v.Color(b):Array.isArray(b)&&(b=new v.Array(b)),"leading"==a?this.leading&&this.leading(b):"string"==typeof c?this.node.setAttributeNS(c,a,b.toString()):this.node.setAttribute(a,b.toString()),!this.rebuild||"font-size"!=a&&"x"!=a||this.rebuild(a,b)}return this}}),v.extend(v.Element,{transform:function(a,b){var c,d=this;if("object"!=typeof a)return c=new v.Matrix(d).extract(),"string"==typeof a?c[a]:c;if(c=new v.Matrix(d),b=!!b||!!a.relative,null!=a.a)c=b?c.multiply(new v.Matrix(a)):new v.Matrix(a);else if(null!=a.rotation)p(a,d),c=b?c.rotate(a.rotation,a.cx,a.cy):c.rotate(a.rotation-c.extract().rotation,a.cx,a.cy);else if(null!=a.scale||null!=a.scaleX||null!=a.scaleY){if(p(a,d),a.scaleX=null!=a.scale?a.scale:null!=a.scaleX?a.scaleX:1,a.scaleY=null!=a.scale?a.scale:null!=a.scaleY?a.scaleY:1,!b){var e=c.extract();a.scaleX=1*a.scaleX/e.scaleX,a.scaleY=1*a.scaleY/e.scaleY}c=c.scale(a.scaleX,a.scaleY,a.cx,a.cy)}else if(null!=a.skew||null!=a.skewX||null!=a.skewY){if(p(a,d),a.skewX=null!=a.skew?a.skew:null!=a.skewX?a.skewX:0,a.skewY=null!=a.skew?a.skew:null!=a.skewY?a.skewY:0,!b){var e=c.extract();c=c.multiply((new v.Matrix).skew(e.skewX,e.skewY,a.cx,a.cy).inverse())}c=c.skew(a.skewX,a.skewY,a.cx,a.cy)}else a.flip?c=c.flip(a.flip,null==a.offset?d.bbox()["c"+a.flip]:a.offset):(null!=a.x||null!=a.y)&&(b?c=c.translate(a.x,a.y):(null!=a.x&&(c.e=a.x),null!=a.y&&(c.f=a.y)));return this.attr("transform",c)}}),v.extend(v.FX,{transform:function(a,b){var c,d=this.target();return"object"!=typeof a?(c=new v.Matrix(d).extract(),"string"==typeof a?c[a]:c):(b=!!b||!!a.relative,null!=a.a?c=new v.Matrix(a):null!=a.rotation?(p(a,d),c=new v.Rotate(a.rotation,a.cx,a.cy)):null!=a.scale||null!=a.scaleX||null!=a.scaleY?(p(a,d),a.scaleX=null!=a.scale?a.scale:null!=a.scaleX?a.scaleX:1,a.scaleY=null!=a.scale?a.scale:null!=a.scaleY?a.scaleY:1,c=new v.Scale(a.scaleX,a.scaleY,a.cx,a.cy)):null!=a.skewX||null!=a.skewY?(p(a,d),a.skewX=null!=a.skewX?a.skewX:0,a.skewY=null!=a.skewY?a.skewY:0,c=new v.Skew(a.skewX,a.skewY,a.cx,a.cy)):a.flip?c=(new v.Matrix).flip(a.flip,null==a.offset?d.bbox()["c"+a.flip]:a.offset):(null!=a.x||null!=a.y)&&(c=new v.Translate(a.x,a.y)),c?(c.relative=b,this.last().transforms.push(c),this._callStart()):this)}}),v.extend(v.Element,{untransform:function(){return this.attr("transform",null)},matrixify:function(){var a=(this.attr("transform")||"").split(/\)\s*,?\s*/).slice(0,-1).map(function(a){var b=a.trim().split("(");return[b[0],b[1].split(v.regex.matrixElements).map(function(a){return parseFloat(a)})]}).reduce(function(a,b){return"matrix"==b[0]?a.multiply(n(b[1])):a[b[0]].apply(a,b[1])},new v.Matrix);return a},toParent:function(a){if(this==a)return this;var b=this.screenCTM(),c=a.screenCTM().inverse();return this.addTo(a).untransform().transform(c.multiply(b)),this},toDoc:function(){return this.toParent(this.doc())}}),v.Transformation=v.invent({create:function(a,b){if(arguments.length>1&&"boolean"!=typeof b)return this.constructor.call(this,[].slice.call(arguments));if(Array.isArray(a))for(var c=0,d=this.arguments.length;d>c;++c)this[this.arguments[c]]=a[c];else if("object"==typeof a)for(var c=0,d=this.arguments.length;d>c;++c)this[this.arguments[c]]=a[this.arguments[c]];this.inversed=!1,b===!0&&(this.inversed=!0)},extend:{arguments:[],method:"",at:function(a){for(var b=[],c=0,d=this.arguments.length;d>c;++c)b.push(this[this.arguments[c]]);var e=this._undo||new v.Matrix;return e=(new v.Matrix).morph(v.Matrix.prototype[this.method].apply(e,b)).at(a),this.inversed?e.inverse():e},undo:function(a){for(var b=0,c=this.arguments.length;c>b;++b)a[this.arguments[b]]="undefined"==typeof this[this.arguments[b]]?0:a[this.arguments[b]];return a.cx=this.cx,a.cy=this.cy,this._undo=new(v[i(this.method)])(a,!0).at(1),this}}}),v.Translate=v.invent({parent:v.Matrix,inherit:v.Transformation,create:function(a,b){this.constructor.apply(this,[].slice.call(arguments))},extend:{arguments:["transformedX","transformedY"],method:"translate"}}),v.Rotate=v.invent({parent:v.Matrix,inherit:v.Transformation,create:function(a,b){this.constructor.apply(this,[].slice.call(arguments))},extend:{arguments:["rotation","cx","cy"],method:"rotate",at:function(a){var b=(new v.Matrix).rotate((new v.Number).morph(this.rotation-(this._undo?this._undo.rotation:0)).at(a),this.cx,this.cy);return this.inversed?b.inverse():b},undo:function(a){this._undo=a}}}),v.Scale=v.invent({parent:v.Matrix,inherit:v.Transformation,create:function(a,b){this.constructor.apply(this,[].slice.call(arguments))},extend:{arguments:["scaleX","scaleY","cx","cy"],method:"scale"}}),v.Skew=v.invent({parent:v.Matrix,inherit:v.Transformation,create:function(a,b){this.constructor.apply(this,[].slice.call(arguments))},extend:{arguments:["skewX","skewY","cx","cy"],method:"skew"}}),v.extend(v.Element,{style:function(a,b){if(0==arguments.length)return this.node.style.cssText||"";if(arguments.length<2)if("object"==typeof a)for(b in a)this.style(b,a[b]);else{if(!v.regex.isCss.test(a))return this.node.style[h(a)];a=a.split(";");for(var c=0;c<a.length;c++)b=a[c].split(":"),this.style(b[0].replace(/\s+/g,""),b[1])}else this.node.style[h(a)]=null===b||v.regex.isBlank.test(b)?"":b;return this}}),v.Parent=v.invent({create:function(a){this.constructor.call(this,a)},inherit:v.Element,extend:{children:function(){return v.utils.map(v.utils.filterSVGElements(this.node.childNodes),function(a){return v.adopt(a)})},add:function(a,b){return null==b?this.node.appendChild(a.node):a.node!=this.node.childNodes[b]&&this.node.insertBefore(a.node,this.node.childNodes[b]),this},put:function(a,b){return this.add(a,b),a},has:function(a){return this.index(a)>=0},index:function(a){return[].slice.call(this.node.childNodes).indexOf(a.node)},get:function(a){return v.adopt(this.node.childNodes[a])},first:function(){return this.get(0)},last:function(){return this.get(this.node.childNodes.length-1)},each:function(a,b){var c,d,e=this.children();for(c=0,d=e.length;d>c;c++)e[c]instanceof v.Element&&a.apply(e[c],[c,e]),b&&e[c]instanceof v.Container&&e[c].each(a,b);return this},removeElement:function(a){return this.node.removeChild(a.node),this},clear:function(){for(;this.node.hasChildNodes();)this.node.removeChild(this.node.lastChild);return delete this._defs,this},defs:function(){return this.doc().defs()}}}),v.extend(v.Parent,{ungroup:function(a,b){return 0===b||this instanceof v.Defs?this:(a=a||(this instanceof v.Doc?this:this.parent(v.Parent)),b=b||1/0,this.each(function(){return this instanceof v.Defs?this:this instanceof v.Parent?this.ungroup(a,b-1):this.toParent(a)}),this.node.firstChild||this.remove(),this)},flatten:function(a,b){return this.ungroup(a,b)}}),v.Container=v.invent({create:function(a){this.constructor.call(this,a)},inherit:v.Parent}),v.ViewBox=v.invent({create:function(a){var b,c,d,e,f,g,h,i,j=[0,0,0,0],k=1,l=1,m=/[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?/gi;if(a instanceof v.Element){for(h=a,i=a,g=(a.attr("viewBox")||"").match(m),f=a.bbox,d=new v.Number(a.width()),e=new v.Number(a.height());"%"==d.unit;)k*=d.value,d=new v.Number(h instanceof v.Doc?h.parent().offsetWidth:h.parent().width()),h=h.parent();for(;"%"==e.unit;)l*=e.value,e=new v.Number(i instanceof v.Doc?i.parent().offsetHeight:i.parent().height()),i=i.parent();this.x=0,this.y=0,this.width=d*k,this.height=e*l,this.zoom=1,g&&(b=parseFloat(g[0]),c=parseFloat(g[1]),d=parseFloat(g[2]),e=parseFloat(g[3]),this.zoom=this.width/this.height>d/e?this.height/e:this.width/d,this.x=b,this.y=c,this.width=d,this.height=e)}else a="string"==typeof a?a.match(m).map(function(a){return parseFloat(a)}):Array.isArray(a)?a:"object"==typeof a?[a.x,a.y,a.width,a.height]:4==arguments.length?[].slice.call(arguments):j,this.x=a[0],this.y=a[1],this.width=a[2],this.height=a[3]},extend:{toString:function(){return this.x+" "+this.y+" "+this.width+" "+this.height},morph:function(a,b,c,d){return this.destination=new v.ViewBox(a,b,c,d),this},at:function(a){return this.destination?new v.ViewBox([this.x+(this.destination.x-this.x)*a,this.y+(this.destination.y-this.y)*a,this.width+(this.destination.width-this.width)*a,this.height+(this.destination.height-this.height)*a]):this}},parent:v.Container,construct:{viewbox:function(a,b,c,d){return 0==arguments.length?new v.ViewBox(this):this.attr("viewBox",new v.ViewBox(a,b,c,d))}}}),["click","dblclick","mousedown","mouseup","mouseover","mouseout","mousemove","touchstart","touchmove","touchleave","touchend","touchcancel"].forEach(function(a){v.Element.prototype[a]=function(b){var c=this;return this.node["on"+a]="function"==typeof b?function(){return b.apply(c,arguments)}:null,this}}),v.listeners=[],v.handlerMap=[],v.listenerId=0,v.on=function(a,b,c,d){var e=c.bind(d||a.instance||a),f=(v.handlerMap.indexOf(a)+1||v.handlerMap.push(a))-1,g=b.split(".")[0],h=b.split(".")[1]||"*";v.listeners[f]=v.listeners[f]||{},v.listeners[f][g]=v.listeners[f][g]||{},v.listeners[f][g][h]=v.listeners[f][g][h]||{},c._svgjsListenerId||(c._svgjsListenerId=++v.listenerId),v.listeners[f][g][h][c._svgjsListenerId]=e,a.addEventListener(g,e,!1)},v.off=function(a,b,c){var d=v.handlerMap.indexOf(a),e=b&&b.split(".")[0],f=b&&b.split(".")[1];if(-1!=d)if(c){if("function"==typeof c&&(c=c._svgjsListenerId),!c)return;v.listeners[d][e]&&v.listeners[d][e][f||"*"]&&(a.removeEventListener(e,v.listeners[d][e][f||"*"][c],!1),delete v.listeners[d][e][f||"*"][c])}else if(f&&e){if(v.listeners[d][e]&&v.listeners[d][e][f]){for(c in v.listeners[d][e][f])v.off(a,[e,f].join("."),c);delete v.listeners[d][e][f]}}else if(f)for(b in v.listeners[d])for(namespace in v.listeners[d][b])f===namespace&&v.off(a,[b,f].join("."));else if(e){if(v.listeners[d][e]){for(namespace in v.listeners[d][e])v.off(a,[e,namespace].join("."));delete v.listeners[d][e]}}else{for(b in v.listeners[d])v.off(a,b);delete v.listeners[d],delete v.handlerMap[d]}},v.extend(v.Element,{on:function(a,b,c){return v.on(this.node,a,b,c),this},off:function(a,b){return v.off(this.node,a,b),this},fire:function(a,b){return a instanceof Event?this.node.dispatchEvent(a):this.node.dispatchEvent(a=new y(a,{detail:b,cancelable:!0})),this._event=a,this},event:function(){return this._event}}),v.Defs=v.invent({create:"defs",inherit:v.Container}),v.G=v.invent({create:"g",inherit:v.Container,extend:{x:function(a){return null==a?this.transform("x"):this.transform({x:a-this.x()},!0)},y:function(a){return null==a?this.transform("y"):this.transform({y:a-this.y()},!0)},cx:function(a){return null==a?this.gbox().cx:this.x(a-this.gbox().width/2)},cy:function(a){return null==a?this.gbox().cy:this.y(a-this.gbox().height/2)},gbox:function(){var a=this.bbox(),b=this.transform();return a.x+=b.x,a.x2+=b.x,a.cx+=b.x,a.y+=b.y,a.y2+=b.y,a.cy+=b.y,a}},construct:{group:function(){return this.put(new v.G)}}}),v.extend(v.Element,{siblings:function(){return this.parent().children()},position:function(){return this.parent().index(this)},next:function(){return this.siblings()[this.position()+1]},previous:function(){return this.siblings()[this.position()-1]},forward:function(){var a=this.position()+1,b=this.parent();return b.removeElement(this).add(this,a),b instanceof v.Doc&&b.node.appendChild(b.defs().node),this},backward:function(){var a=this.position();return a>0&&this.parent().removeElement(this).add(this,a-1),this},front:function(){var a=this.parent();return a.node.appendChild(this.node),a instanceof v.Doc&&a.node.appendChild(a.defs().node),this},back:function(){return this.position()>0&&this.parent().removeElement(this).add(this,0),this},before:function(a){a.remove();var b=this.position();return this.parent().add(a,b),this},after:function(a){a.remove();var b=this.position();return this.parent().add(a,b+1),this}}),v.Mask=v.invent({create:function(){this.constructor.call(this,v.create("mask")),this.targets=[]},inherit:v.Container,extend:{remove:function(){for(var a=this.targets.length-1;a>=0;a--)this.targets[a]&&this.targets[a].unmask();return this.targets=[],this.parent().removeElement(this),this}},construct:{mask:function(){return this.defs().put(new v.Mask)}}}),v.extend(v.Element,{maskWith:function(a){return this.masker=a instanceof v.Mask?a:this.parent().mask().add(a),this.masker.targets.push(this),this.attr("mask",'url("#'+this.masker.attr("id")+'")')},unmask:function(){return delete this.masker,this.attr("mask",null)}}),v.ClipPath=v.invent({create:function(){this.constructor.call(this,v.create("clipPath")),this.targets=[]},inherit:v.Container,extend:{remove:function(){for(var a=this.targets.length-1;a>=0;a--)this.targets[a]&&this.targets[a].unclip();return this.targets=[],this.parent().removeElement(this),this}},construct:{clip:function(){return this.defs().put(new v.ClipPath)}}}),v.extend(v.Element,{clipWith:function(a){return this.clipper=a instanceof v.ClipPath?a:this.parent().clip().add(a),this.clipper.targets.push(this),this.attr("clip-path",'url("#'+this.clipper.attr("id")+'")')},unclip:function(){return delete this.clipper,this.attr("clip-path",null)}}),v.Gradient=v.invent({create:function(a){this.constructor.call(this,v.create(a+"Gradient")),this.type=a},inherit:v.Container,extend:{at:function(a,b,c){return this.put(new v.Stop).update(a,b,c)},update:function(a){return this.clear(),"function"==typeof a&&a.call(this,this),this},fill:function(){return"url(#"+this.id()+")"},toString:function(){return this.fill()},attr:function(a,b,c){return"transform"==a&&(a="gradientTransform"),v.Container.prototype.attr.call(this,a,b,c)}},construct:{gradient:function(a,b){return this.defs().gradient(a,b)}}}),v.extend(v.Gradient,v.FX,{from:function(a,b){return"radial"==(this._target||this).type?this.attr({fx:new v.Number(a),fy:new v.Number(b)}):this.attr({x1:new v.Number(a),y1:new v.Number(b)})},to:function(a,b){return"radial"==(this._target||this).type?this.attr({cx:new v.Number(a),cy:new v.Number(b)}):this.attr({x2:new v.Number(a),y2:new v.Number(b)})}}),v.extend(v.Defs,{gradient:function(a,b){return this.put(new v.Gradient(a)).update(b)}}),v.Stop=v.invent({create:"stop",inherit:v.Element,extend:{update:function(a){return("number"==typeof a||a instanceof v.Number)&&(a={offset:arguments[0],color:arguments[1],opacity:arguments[2]}),null!=a.opacity&&this.attr("stop-opacity",a.opacity),null!=a.color&&this.attr("stop-color",a.color),null!=a.offset&&this.attr("offset",new v.Number(a.offset)),this}}}),v.Pattern=v.invent({create:"pattern",inherit:v.Container,extend:{fill:function(){return"url(#"+this.id()+")"},update:function(a){return this.clear(),"function"==typeof a&&a.call(this,this),this},toString:function(){return this.fill()},attr:function(a,b,c){return"transform"==a&&(a="patternTransform"),v.Container.prototype.attr.call(this,a,b,c)}},construct:{pattern:function(a,b,c){return this.defs().pattern(a,b,c)}}}),v.extend(v.Defs,{pattern:function(a,b,c){return this.put(new v.Pattern).update(c).attr({x:0,y:0,width:a,height:b,patternUnits:"userSpaceOnUse"})}}),v.Doc=v.invent({create:function(a){a&&(a="string"==typeof a?c.getElementById(a):a,"svg"==a.nodeName?this.constructor.call(this,a):(this.constructor.call(this,v.create("svg")),a.appendChild(this.node),this.size("100%","100%")),this.namespace().defs())},inherit:v.Container,extend:{namespace:function(){return this.attr({xmlns:v.ns,version:"1.1"}).attr("xmlns:xlink",v.xlink,v.xmlns).attr("xmlns:svgjs",v.svgjs,v.xmlns)},defs:function(){if(!this._defs){var a;(a=this.node.getElementsByTagName("defs")[0])?this._defs=v.adopt(a):this._defs=new v.Defs,this.node.appendChild(this._defs.node)}return this._defs},parent:function(){return"#document"==this.node.parentNode.nodeName?null:this.node.parentNode},spof:function(a){var b=this.node.getScreenCTM();return b&&this.style("left",-b.e%1+"px").style("top",-b.f%1+"px"),this},remove:function(){return this.parent()&&this.parent().removeChild(this.node),this}}}),v.Shape=v.invent({create:function(a){this.constructor.call(this,a)},inherit:v.Element}),v.Bare=v.invent({create:function(a,b){if(this.constructor.call(this,v.create(a)),b)for(var c in b.prototype)"function"==typeof b.prototype[c]&&(this[c]=b.prototype[c])},inherit:v.Element,extend:{words:function(a){for(;this.node.hasChildNodes();)this.node.removeChild(this.node.lastChild);return this.node.appendChild(c.createTextNode(a)),this}}}),v.extend(v.Parent,{element:function(a,b){return this.put(new v.Bare(a,b))}}),v.Symbol=v.invent({create:"symbol",inherit:v.Container,construct:{symbol:function(){return this.put(new v.Symbol)}}}),v.Use=v.invent({create:"use",inherit:v.Shape,extend:{element:function(a,b){return this.attr("href",(b||"")+"#"+a,v.xlink)}},construct:{use:function(a,b){return this.put(new v.Use).element(a,b)}}}),v.Rect=v.invent({create:"rect",inherit:v.Shape,construct:{rect:function(a,b){return this.put(new v.Rect).size(a,b)}}}),v.Circle=v.invent({create:"circle",inherit:v.Shape,construct:{circle:function(a){return this.put(new v.Circle).rx(new v.Number(a).divide(2)).move(0,0)}}}),v.extend(v.Circle,v.FX,{rx:function(a){return this.attr("r",a)},ry:function(a){return this.rx(a)}}),v.Ellipse=v.invent({create:"ellipse",inherit:v.Shape,construct:{ellipse:function(a,b){return this.put(new v.Ellipse).size(a,b).move(0,0)}}}),v.extend(v.Ellipse,v.Rect,v.FX,{rx:function(a){return this.attr("rx",a)},ry:function(a){return this.attr("ry",a)}}),v.extend(v.Circle,v.Ellipse,{x:function(a){return null==a?this.cx()-this.rx():this.cx(a+this.rx())},y:function(a){return null==a?this.cy()-this.ry():this.cy(a+this.ry())},cx:function(a){return null==a?this.attr("cx"):this.attr("cx",a)},cy:function(a){return null==a?this.attr("cy"):this.attr("cy",a)},width:function(a){return null==a?2*this.rx():this.rx(new v.Number(a).divide(2))},height:function(a){return null==a?2*this.ry():this.ry(new v.Number(a).divide(2))},size:function(a,b){var c=l(this,a,b);return this.rx(new v.Number(c.width).divide(2)).ry(new v.Number(c.height).divide(2))}}),v.Line=v.invent({create:"line",inherit:v.Shape,extend:{array:function(){return new v.PointArray([[this.attr("x1"),this.attr("y1")],[this.attr("x2"),this.attr("y2")]])},plot:function(a,b,c,d){return null==a?this.array():(a="undefined"!=typeof b?{x1:a,y1:b,x2:c,y2:d}:new v.PointArray(a).toLine(),this.attr(a))},move:function(a,b){return this.attr(this.array().move(a,b).toLine())},size:function(a,b){var c=l(this,a,b);return this.attr(this.array().size(c.width,c.height).toLine())}},construct:{line:function(a,b,c,d){return v.Line.prototype.plot.apply(this.put(new v.Line),null!=a?[a,b,c,d]:[0,0,0,0])}}}),v.Polyline=v.invent({create:"polyline",inherit:v.Shape,construct:{polyline:function(a){return this.put(new v.Polyline).plot(a||new v.PointArray)}}}),v.Polygon=v.invent({create:"polygon",inherit:v.Shape,construct:{polygon:function(a){return this.put(new v.Polygon).plot(a||new v.PointArray)}}}),v.extend(v.Polyline,v.Polygon,{array:function(){return this._array||(this._array=new v.PointArray(this.attr("points")))},plot:function(a){return null==a?this.array():this.attr("points",this._array=new v.PointArray(a))},move:function(a,b){return this.attr("points",this.array().move(a,b))},size:function(a,b){var c=l(this,a,b);return this.attr("points",this.array().size(c.width,c.height))}}),v.extend(v.Line,v.Polyline,v.Polygon,{morphArray:v.PointArray,x:function(a){return null==a?this.bbox().x:this.move(a,this.bbox().y)},y:function(a){return null==a?this.bbox().y:this.move(this.bbox().x,a)},width:function(a){var b=this.bbox();return null==a?b.width:this.size(a,b.height)},height:function(a){var b=this.bbox();return null==a?b.height:this.size(b.width,a)}}),v.Path=v.invent({create:"path",inherit:v.Shape,extend:{morphArray:v.PathArray,array:function(){return this._array||(this._array=new v.PathArray(this.attr("d")))},plot:function(a){return null==a?this.array():this.attr("d",this._array=new v.PathArray(a))},move:function(a,b){return this.attr("d",this.array().move(a,b))},x:function(a){return null==a?this.bbox().x:this.move(a,this.bbox().y)},y:function(a){return null==a?this.bbox().y:this.move(this.bbox().x,a)},size:function(a,b){var c=l(this,a,b);return this.attr("d",this.array().size(c.width,c.height))},width:function(a){return null==a?this.bbox().width:this.size(a,this.bbox().height)},height:function(a){return null==a?this.bbox().height:this.size(this.bbox().width,a)}},construct:{path:function(a){return this.put(new v.Path).plot(a||new v.PathArray)}}}),v.Image=v.invent({create:"image",inherit:v.Shape,extend:{load:function(a){if(!a)return this;var b=this,d=c.createElement("img");return d.onload=function(){var c=b.parent(v.Pattern);null!==c&&(0==b.width()&&0==b.height()&&b.size(d.width,d.height),c&&0==c.width()&&0==c.height()&&c.size(b.width(),b.height()),"function"==typeof b._loaded&&b._loaded.call(b,{width:d.width,height:d.height,ratio:d.width/d.height,url:a}))},d.onerror=function(a){"function"==typeof b._error&&b._error.call(b,a)},this.attr("href",d.src=this.src=a,v.xlink)},loaded:function(a){return this._loaded=a,this},error:function(a){return this._error=a,this}},construct:{image:function(a,b,c){return this.put(new v.Image).load(a).size(b||0,c||b||0)}}}),v.Text=v.invent({create:function(){this.constructor.call(this,v.create("text")),this.dom.leading=new v.Number(1.3),this._rebuild=!0,this._build=!1,this.attr("font-family",v.defaults.attrs["font-family"])},inherit:v.Shape,extend:{x:function(a){return null==a?this.attr("x"):this.attr("x",a)},y:function(a){var b=this.attr("y"),c="number"==typeof b?b-this.bbox().y:0;return null==a?"number"==typeof b?b-c:b:this.attr("y","number"==typeof a?a+c:a)},cx:function(a){return null==a?this.bbox().cx:this.x(a-this.bbox().width/2)},cy:function(a){return null==a?this.bbox().cy:this.y(a-this.bbox().height/2)},text:function(a){if("undefined"==typeof a){for(var a="",b=this.node.childNodes,c=0,d=b.length;d>c;++c)0!=c&&3!=b[c].nodeType&&1==v.adopt(b[c]).dom.newLined&&(a+="\n"),a+=b[c].textContent;return a}if(this.clear().build(!0),"function"==typeof a)a.call(this,this);else{a=a.split("\n");for(var c=0,e=a.length;e>c;c++)this.tspan(a[c]).newLine()}return this.build(!1).rebuild()},size:function(a){return this.attr("font-size",a).rebuild()},leading:function(a){return null==a?this.dom.leading:(this.dom.leading=new v.Number(a),this.rebuild())},lines:function(){var a=(this.textPath&&this.textPath()||this).node,b=v.utils.map(v.utils.filterSVGElements(a.childNodes),function(a){return v.adopt(a)});return new v.Set(b)},rebuild:function(a){if("boolean"==typeof a&&(this._rebuild=a),this._rebuild){var b=this,c=0,d=this.dom.leading*new v.Number(this.attr("font-size"));this.lines().each(function(){this.dom.newLined&&(b.textPath()||this.attr("x",b.attr("x")),"\n"==this.text()?c+=d:(this.attr("dy",d+c),c=0))}),this.fire("rebuild")}return this},build:function(a){return this._build=!!a,this},setData:function(a){return this.dom=a,this.dom.leading=new v.Number(a.leading||1.3),this}},construct:{text:function(a){return this.put(new v.Text).text(a)},plain:function(a){return this.put(new v.Text).plain(a)}}}),v.Tspan=v.invent({create:"tspan",inherit:v.Shape,extend:{text:function(a){return null==a?this.node.textContent+(this.dom.newLined?"\n":""):("function"==typeof a?a.call(this,this):this.plain(a),this)},dx:function(a){return this.attr("dx",a)},dy:function(a){return this.attr("dy",a)},newLine:function(){var a=this.parent(v.Text);return this.dom.newLined=!0,this.dy(a.dom.leading*a.attr("font-size")).attr("x",a.x())}}}),v.extend(v.Text,v.Tspan,{plain:function(a){return this._build===!1&&this.clear(),this.node.appendChild(c.createTextNode(a)),this},tspan:function(a){var b=(this.textPath&&this.textPath()||this).node,c=new v.Tspan;return this._build===!1&&this.clear(),b.appendChild(c.node),c.text(a)},clear:function(){for(var a=(this.textPath&&this.textPath()||this).node;a.hasChildNodes();)a.removeChild(a.lastChild);return this},length:function(){return this.node.getComputedTextLength()}}),v.TextPath=v.invent({create:"textPath",inherit:v.Parent,parent:v.Text,construct:{path:function(a){for(var b=new v.TextPath,c=this.doc().defs().path(a);this.node.hasChildNodes();)b.node.appendChild(this.node.firstChild);return this.node.appendChild(b.node),b.attr("href","#"+c,v.xlink),this},array:function(){var a=this.track();return a?a.array():null},plot:function(a){var b=this.track(),c=null;return b&&(c=b.plot(a)),null==a?c:this},track:function(){var a=this.textPath();return a?a.reference("href"):void 0},textPath:function(){return this.node.firstChild&&"textPath"==this.node.firstChild.nodeName?v.adopt(this.node.firstChild):void 0}}}),v.Nested=v.invent({create:function(){this.constructor.call(this,v.create("svg")),this.style("overflow","visible")},inherit:v.Container,construct:{nested:function(){return this.put(new v.Nested)}}}),v.A=v.invent({create:"a",inherit:v.Container,extend:{to:function(a){return this.attr("href",a,v.xlink)},show:function(a){return this.attr("show",a,v.xlink)},target:function(a){return this.attr("target",a)}},construct:{link:function(a){return this.put(new v.A).to(a)}}}),v.extend(v.Element,{linkTo:function(a){var b=new v.A;return"function"==typeof a?a.call(b,b):b.to(a),this.parent().put(b).put(this)}}),v.Marker=v.invent({create:"marker",inherit:v.Container,extend:{width:function(a){return this.attr("markerWidth",a)},height:function(a){return this.attr("markerHeight",a)},ref:function(a,b){return this.attr("refX",a).attr("refY",b)},update:function(a){return this.clear(),"function"==typeof a&&a.call(this,this),this},toString:function(){return"url(#"+this.id()+")"}},construct:{marker:function(a,b,c){return this.defs().marker(a,b,c)}}}),v.extend(v.Defs,{marker:function(a,b,c){return this.put(new v.Marker).size(a,b).ref(a/2,b/2).viewbox(0,0,a,b).attr("orient","auto").update(c)}}),v.extend(v.Line,v.Polyline,v.Polygon,v.Path,{marker:function(a,b,c,d){var e=["marker"];return"all"!=a&&e.push(a),e=e.join("-"),a=arguments[1]instanceof v.Marker?arguments[1]:this.doc().marker(b,c,d),this.attr(e,a)}});var w={stroke:["color","width","opacity","linecap","linejoin","miterlimit","dasharray","dashoffset"],fill:["color","opacity","rule"],prefix:function(a,b){return"color"==b?a:a+"-"+b}};["fill","stroke"].forEach(function(a){var b,c={};c[a]=function(c){if("undefined"==typeof c)return this;if("string"==typeof c||v.Color.isRgb(c)||c&&"function"==typeof c.fill)this.attr(a,c);else for(b=w[a].length-1;b>=0;b--)null!=c[w[a][b]]&&this.attr(w.prefix(a,w[a][b]),c[w[a][b]]);return this},v.extend(v.Element,v.FX,c)}),v.extend(v.Element,v.FX,{rotate:function(a,b,c){return this.transform({rotation:a,cx:b,cy:c})},skew:function(a,b,c,d){return 1==arguments.length||3==arguments.length?this.transform({skew:a,cx:b,cy:c}):this.transform({skewX:a,skewY:b,cx:c,cy:d})},scale:function(a,b,c,d){return 1==arguments.length||3==arguments.length?this.transform({scale:a,cx:b,cy:c}):this.transform({scaleX:a,scaleY:b,cx:c,cy:d})},translate:function(a,b){return this.transform({x:a,y:b})},flip:function(a,b){return b="number"==typeof a?a:b,this.transform({flip:a||"both",offset:b})},matrix:function(a){return this.attr("transform",new v.Matrix(6==arguments.length?[].slice.call(arguments):a))},opacity:function(a){return this.attr("opacity",a)},dx:function(a){return this.x(new v.Number(a).plus(this instanceof v.FX?0:this.x()),!0)},dy:function(a){return this.y(new v.Number(a).plus(this instanceof v.FX?0:this.y()),!0)},dmove:function(a,b){return this.dx(a).dy(b)}}),v.extend(v.Rect,v.Ellipse,v.Circle,v.Gradient,v.FX,{radius:function(a,b){var c=(this._target||this).type;return"radial"==c||"circle"==c?this.attr("r",new v.Number(a)):this.rx(a).ry(null==b?a:b)}}),v.extend(v.Path,{length:function(){return this.node.getTotalLength()},pointAt:function(a){return this.node.getPointAtLength(a)}}),v.extend(v.Parent,v.Text,v.Tspan,v.FX,{font:function(a,b){if("object"==typeof a)for(b in a)this.font(b,a[b]);return"leading"==a?this.leading(b):"anchor"==a?this.attr("text-anchor",b):"size"==a||"family"==a||"weight"==a||"stretch"==a||"variant"==a||"style"==a?this.attr("font-"+a,b):this.attr(a,b)}}),v.Set=v.invent({create:function(a){Array.isArray(a)?this.members=a:this.clear()},extend:{add:function(){var a,b,c=[].slice.call(arguments);for(a=0,b=c.length;b>a;a++)this.members.push(c[a]);return this},remove:function(a){var b=this.index(a);return b>-1&&this.members.splice(b,1),this},each:function(a){for(var b=0,c=this.members.length;c>b;b++)a.apply(this.members[b],[b,this.members]);return this},clear:function(){return this.members=[],this},length:function(){return this.members.length},has:function(a){return this.index(a)>=0},index:function(a){return this.members.indexOf(a)},get:function(a){return this.members[a]},first:function(){return this.get(0)},last:function(){return this.get(this.members.length-1)},valueOf:function(){return this.members},bbox:function(){if(0==this.members.length)return new v.RBox;var a=this.members[0].rbox(this.members[0].doc());return this.each(function(){a=a.merge(this.rbox(this.doc()))}),a}},construct:{set:function(a){return new v.Set(a)}}}),v.FX.Set=v.invent({create:function(a){this.set=a}}),v.Set.inherit=function(){var a,b=[];for(var a in v.Shape.prototype)"function"==typeof v.Shape.prototype[a]&&"function"!=typeof v.Set.prototype[a]&&b.push(a);b.forEach(function(a){v.Set.prototype[a]=function(){for(var b=0,c=this.members.length;c>b;b++)this.members[b]&&"function"==typeof this.members[b][a]&&this.members[b][a].apply(this.members[b],arguments);return"animate"==a?this.fx||(this.fx=new v.FX.Set(this)):this}}),b=[];for(var a in v.FX.prototype)"function"==typeof v.FX.prototype[a]&&"function"!=typeof v.FX.Set.prototype[a]&&b.push(a);b.forEach(function(a){v.FX.Set.prototype[a]=function(){for(var b=0,c=this.set.members.length;c>b;b++)this.set.members[b].fx[a].apply(this.set.members[b].fx,arguments);return this}})},v.extend(v.Element,{data:function(a,b,c){if("object"==typeof a)for(b in a)this.data(b,a[b]);else if(arguments.length<2)try{return JSON.parse(this.attr("data-"+a))}catch(d){return this.attr("data-"+a)}else this.attr("data-"+a,null===b?null:c===!0||"string"==typeof b||"number"==typeof b?b:JSON.stringify(b));return this}}),v.extend(v.Element,{remember:function(a,b){if("object"==typeof arguments[0])for(var b in a)this.remember(b,a[b]);else{if(1==arguments.length)return this.memory()[a];this.memory()[a]=b}return this},forget:function(){if(0==arguments.length)this._memory={};else for(var a=arguments.length-1;a>=0;a--)delete this.memory()[arguments[a]];return this},memory:function(){return this._memory||(this._memory={})}}),v.get=function(a){var b=c.getElementById(u(a)||a);return v.adopt(b)},v.select=function(a,b){return new v.Set(v.utils.map((b||c).querySelectorAll(a),function(a){return v.adopt(a)}))},v.extend(v.Parent,{select:function(a){
    return v.select(a,this.node)}});var x="abcdef".split("");if("function"!=typeof y){var y=function(a,b){b=b||{bubbles:!1,cancelable:!1,detail:void 0};var d=c.createEvent("CustomEvent");return d.initCustomEvent(a,b.bubbles,b.cancelable,b.detail),d};y.prototype=b.Event.prototype,b.CustomEvent=y}return function(a){for(var c=0,d=["moz","webkit"],e=0;e<d.length&&!b.requestAnimationFrame;++e)a.requestAnimationFrame=a[d[e]+"RequestAnimationFrame"],a.cancelAnimationFrame=a[d[e]+"CancelAnimationFrame"]||a[d[e]+"CancelRequestAnimationFrame"];a.requestAnimationFrame=a.requestAnimationFrame||function(b){var d=(new Date).getTime(),e=Math.max(0,16-(d-c)),f=a.setTimeout(function(){b(d+e)},e);return c=d+e,f},a.cancelAnimationFrame=a.cancelAnimationFrame||a.clearTimeout}(b),v.ForiegnObject=function(){this.constructor.call(this,v.create("foreignObject")),this.type="foreignObject"},v.ForiegnObject.prototype=new v.Shape,v.extend(v.ForiegnObject,{appendChild:function(b,d){var e="string"==typeof b?c.createElement(b):b;if("object"==typeof d)for(a in d)e[a]=d[a];return this.node.appendChild(e),this},getChild:function(a){return this.node.childNodes[a]}}),v.extend(v.Container,{foreignObject:function(a,b){return this.put(new v.ForiegnObject).size(null==a?100:a,null==b?100:b)}}),v});

(function(_,s){
    _.i18n.load(cmpBASEPATH+'/i18n/', 'cmp-flowV5',null,cmpBuildversion);
    var flowChartConstant = {
        C_iFlowNodeType_preNode:-12,//前置节点
        C_iFlowNodeType_nextNode:-11,//后置节点
        C_iFlowNodeType_Not_Null:-10,
        C_iFlowNodeType_Start:-9,
        C_iFlowNodeType_Null: -1,
        C_iFlowNodeType_Split: -2,
        C_iFlowNodeType_Join: -3,
        C_iFlowNodeType_End: -4,
        C_iFlowNodeType_DeparturePerson: -5,
        C_iFlowNodeType_DepartureWFDynamicForm:-6,//动态表单节点（停用）
        C_iFlowNodeType_Person: 0,
        C_iFlowNodeType_Department: 1,
        C_iFlowNodeType_SubGrouping: 2,
        C_iFlowNodeType_OType: 3,
        C_iFlowNodeType_Occupation: 4,
        C_iFlowNodeType_Company: 5,
        C_iFlowNodeType_RelativeRole: 6,
        C_iFlowNodeType_FormControls_org: 7,
        C_iFlowNodeType_Inform: 8,
        C_iFlowNodeType_Level:9,
        C_iFlowNodeType_FormControls:10,
        C_iFlowNodeType_MultiNode:15, //多级会签节点
        C_iFlowNodeType_WFDynamicForm:16,
		C_iFlowNodeType_JoinAccountTag:17,//单位标签
        C_iFlowNodeType_SuperNode:100,//超级节点
        //节点状态
        C_iFlowHandleState_UnDone: 0,
        C_iFlowHandleState_Done: 1,
        C_iFlowHandleState_DoException: 2,//终止（红色）
        C_iFlowHandleState_Doing: 3,
        C_iFlowHandleState_Saw: 4,
        C_iFlowHandleState_UnReach: 5,
        C_iFlowHandleState_ZDTG: 6,//自动跳过
        C_iFlowHandleState_ZCDB:7,//暂存待办
        C_iFlowHandleState_BZZDR:22,//被终止的人（灰色）
        C_iFlowHandleState_ZDHT_left:41,//指定回退左边
        C_iFlowHandleState_ZDHT_right:61,//指定回退右边
        //红旗
        C_iNodeperformMode_Strive: 3,//竞争执行

        //处理节点类型
        C_iHanderNodeType_EndNode: -1,//新建时end 节点
        C_iHanderNodeType_StartNode: 9,//新建时的开始节点   处理时的当前节点
        C_iHanderNodeType_ShowNode: 1,//一般的显示流程节点 用于服务器端返回
        C_iHanderNodeType_CreatNode: 2,//新建时的流程节点
        C_iHanderNodeType_AddNode: 3,//加签时的流程节点
        C_iHanderNodeType_HQNode: 4,//会签时的流程节点
        C_iHanderNodeType_ZHNode: 5,//知会时的流程节点
        C_iHanderNodeType_CYNode: 6,//传阅时的流程节点
        C_iHanderNodeType_FrontNode: 7,//处理时  前置节点
        C_iHanderNodeType_RearNode: 8,//处理时  后置节点
        C_iHanderNodeType_DJHQNode: 21,//多级会签的流程节点
        C_iHanderNodeType_DJHQNode_Cruu: 22,//多级会签时的当前节点流程节点

        /*分支条件*/
        C_iConditionType_ZDFZ1:1, //自动分支
        C_iConditionType_ZDFZ4:4, //自动分支
        C_iConditionType_NONE:3,  //无分支条件
        C_iConditionType_SDFZ:2,   //手动分支

        /*人员状态*/
        C_iNodeMemberState_delete:0,//删除
        C_iNodeMemberState_level:1,//离职
        C_iNodeMemberState_undistributed:2,//未分配
        C_iNodeMemberState_stop:3,//停用

        C_sProcessMode_single:"single",
        C_sProcessMode_all:"all",
        C_sProcessMode_competition:"competition"//竞争执行

    };

    var drawFitVal = {
        node_v_center:63,
        node_baseLine:80,
        node_half_width:30,
        node_half_height:30
    };

    var flowChart = function (id, opts) {
        var self = this;
        self.opts = _.extend({
            cWidth: window.innerWidth,
            cHeight: window.innerHeight,
            callback: null,
            completeCallback:null//画图画完后的回调函数
        }, opts);
        self.id = id;
        self.container = document.getElementById(id);
        self.cmpPath = cmpIMGPath;
        self.nodeImgCache = {};
        self.container.classList.add("cmp-scroll-wrapper");
        self.scrollDiv = document.createElement("div");
        self.scrollDiv.classList.add("cmp-scroll");
        _.append(self.scrollDiv,"<svg id='CMPFLOWSVG'  width='100%' height='100%'></svg>");
        self.container.appendChild(self.scrollDiv);
    };


    /**
     * 根据计算出的node的最大尺寸，进行创建Konva
     */
    flowChart.prototype.createStage = function () {
        var self = this;
        self.container.style.height = self.opts.cHeight + "px";
        self.scrollDiv.style.width = self.stageWidth + "px";
        self.scrollDiv.style.height = self.stageHeight + "px";
        self.zoomContainer = _.zoom(self.container,{
            doubleTapZoom:false,
            zoomMax:2,
            zoomMin:0.8,
            zoomMinBounce:false
        });
        self.svg = SVG("CMPFLOWSVG");




        _.event.orientationChange(function(){
            var header = document.getElementsByTagName("header")[0],
                footer = document.getElementsByTagName("footer")[0],
                titleContent = document.querySelector(".cmp-segmented_title_content"),
                tab = document.querySelector(".cmp-segmented-control");
            var headerH = header?header.offsetHeight:0,
                footerH = footer?footer.offsetHeight:0,
                titleContentH = titleContent?titleContent.offsetHeight:0,
                tabH = tab?tab.offsetHeight:0,
                winH = window.innerHeight,
                winW = window.innerWidth;
            var newH = winH - headerH - footerH - titleContentH - tabH;
            self.zoomContainer.refreshWrapper({
                wrapperW:winW,
                wrapperH:newH
            });
            if(self.circleLayerSwitch){
                self.circleLayerSwitch.style.top = (newH-130)+"px";
                self.circleLayerSwitch.style.left = (winW-50)+"px";
            }
        });

    };

    flowChart.prototype.updateStage = function(){
        var self = this;
        self.svg.clear();
        self.scrollDiv.style.width = self.stageWidth + "px";
        self.scrollDiv.style.height = self.stageHeight + "px";
        self.zoomContainer.refresh();
    }

    flowChart.prototype.createCircleLayerSwitch = function(){
        var self = this;
        var circleLayerSwitch = document.createElement("img");
        var positionX = self.opts.cWidth - 50;
        var positionY = self.opts.cHeight -130;
        circleLayerSwitch.style.cssText = "position:absolute;z-index:2;left:"+positionX+"px;top:"+positionY+"px;width:42px;height:42px";
        circleLayerSwitch.src = self.cmpPath + "/flow/ic_circle_switch_open.png";
        circleLayerSwitch.className = "open";
        circleLayerSwitch.addEventListener("tap",function(e){
            e.stopPropagation();
            if(this.classList.contains("open")){
                this.src = self.cmpPath + "/flow/ic_circle_switch_close.png";
                this.classList.remove("open");
                self.circleGroup.stroke({
                    opacity:"0"
                })
            }else {
                this.src = self.cmpPath + "/flow/ic_circle_switch_open.png";
                this.classList.add("open");
                self.circleGroup.stroke({
                    opacity:1
                })
            }
        },false);
        self.container.appendChild(circleLayerSwitch);
        self.circleLayerSwitch = circleLayerSwitch;
    };

    //初始移动容器到当前节点
    flowChart.prototype.initMoveToCurrentNodePos = function(x,y){
        var self = this;
        var goldenSectionX = self.opts.cWidth/ 2,
            goldenSectionY= self.opts.cHeight/ 3;//容器高度和宽度的三分之一作为当前节点显示的黄金位置
        var moveX = goldenSectionX - x,
            moveY = goldenSectionY - y;
        self.zoomContainer.scrollTo(moveX,moveY,0);
    };


    /**
     * 画图方法
     */
    var preClickTime = 0;
    flowChart.prototype.draw = function (flowNodeData) {
        var self = this, i;
        var nodeDataMap = new flowChartData(flowNodeData);
        var currentNodeID = flowNodeData.currentNodeID;
        var circleNode = nodeDataMap.circleNode;
        var baseLine = nodeDataMap.baseLine + drawFitVal.node_v_center;
        var maxSize = nodeDataMap.size;
        var cWidth = self.opts.cWidth;
        var cHeight = self.opts.cHeight;
        var stageWidth = maxSize.mc_width > cWidth?maxSize.mc_width:cWidth,
            stageHeight = maxSize.mc_height > cHeight?maxSize.mc_height:cHeight;
        stageWidth += 50;
        stageHeight += 50;
        self.stageWidth =stageWidth;
        self.stageHeight =stageHeight;
        if(!self.svg){
            self.createStage(nodeDataMap.size);
            if(circleNode.length > 0){//如果有环形流程的话，需要创建环形流程显示与隐藏的开关
                self.createCircleLayerSwitch();
            }
        }else {
            self.updateStage();
        }
        var flowNodeMapValueArr = nodeDataMap.flowNode;
        var lineArray = [];
        var nodeArray = [];
        var splitBranchArray = [];
        var imgPaths = new _.map();
        for (var i in flowNodeMapValueArr) {
            var node = flowNodeMapValueArr[i];
            if (!node.isSplit && !node.isJoin) {//将普通节点添加到画板上
                self.handleNodeArray(nodeArray, imgPaths, node, nodeDataMap.startNodeID, currentNodeID);
            }
            self.handleLineArray(lineArray, splitBranchArray, node);
        }
        imgPaths.put("currentNodeImg",self.cmpPath + "/flow/ic_current_node.png");
        self.drawLine(lineArray);
        if(circleNode.length > 0) {
            self.drawCircle(circleNode,baseLine);
        }
        self.drawImg(nodeArray,imgPaths);
        self.drawSplitBranch(splitBranchArray,imgPaths);
        if(self.currentNodePos){
            self.initMoveToCurrentNodePos(self.currentNodePos.x,self.currentNodePos.y);
        }else if(self.startNodePos){//如果没有当前节点的位置的话就滚动到开始节点
            self.initMoveToCurrentNodePos(self.startNodePos.x,self.startNodePos.y);
        }
        if(typeof self.opts.completeCallback == "function"){
            self.opts.completeCallback({success:true,message:_.i18n("cmp.flowV5.drawComplete"),code:60002,detail:"draw complete"});
        }
    };
    flowChart.prototype.handleNodeArray = function(nodeArray,imgPaths,node,startNodeID,currentNodeID){
        var self = this;
        node.startNodeID = startNodeID;
        var  nodeObj = {};
        nodeObj.x = node.x;
        nodeObj.y = node.y + drawFitVal.node_half_height;
        var nodeInfo = node;
        nodeObj.nodeInfo = nodeInfo;
        if (currentNodeID == node.nodeID) {
            self.currentNodePos = {x:node.x,y:node.y};
            nodeObj.isCurrent = true;
        }
        if(startNodeID == node.nodeID){
            self.startNodePos = {x:node.x,y:node.y};
        }
        /* draw name start */
        var textShow = nodeInfo.entityName || "";
        if(nodeInfo.belongCompany != null && (nodeInfo.belongCompany.accountShortname != "" || nodeInfo.belongCompany.accountShortname.length > 0)) {
            textShow += "(" + nodeInfo.belongCompany.accountShortname + ")";
        }

        nodeObj.title = textShow;
        /* draw name end */
        /* draw node permission start */
        if (nodeInfo.flowNodeType != flowChartConstant.C_iFlowNodeType_Null && nodeInfo.nodePermission != null && nodeInfo.nodePermission.description != null && nodeInfo.nodePermission.description != "") {//添加权限
            var permission = nodeInfo.nodePermission.description;
            if(permission.strLen() > 8) {
                permission = permission.subCHStr(0,8) + "...";
            }
            permission  = "["+permission+"]";
            nodeObj.nodePermission = permission;
        }
        /* draw node permission end */
        /* draw node img start */
        var imgName = "ic_def_member.png";
        switch (nodeInfo.flowNodeType) {
            case flowChartConstant.C_iFlowNodeType_Person:
            case flowChartConstant.C_iFlowNodeType_Start:
                switch(parseInt(nodeInfo.partyStatus)) {
                    case flowChartConstant.C_iNodeMemberState_delete:
                    case flowChartConstant.C_iNodeMemberState_level:
                    case flowChartConstant.C_iNodeMemberState_stop:
                    case flowChartConstant.C_iNodeMemberState_undistributed:
                        imgName = "ic_member_leave.png";
                        break;
                    default:
                        imgName = nodeInfo.partyId? _.origin + "/rest/orgMember/avatar" + "/" + nodeInfo.partyId + "?maxWidth=200":"ic_member_leave.png";
                        break;

                }
                break;
            case flowChartConstant.C_iFlowNodeType_End:
                imgName = "ic_end.png";
                break;

            case flowChartConstant.C_iFlowNodeType_SubGrouping:
                imgName = "ic_team.png";
                break;
            case flowChartConstant.C_iFlowNodeType_Department:
                imgName = "ic_dept.png";
                break;
            case flowChartConstant.C_iFlowNodeType_Company:
                imgName = "ic_unit.png";
                break;
            case flowChartConstant.C_iFlowNodeType_Occupation:
                imgName = "ic_post.png";
                break;
            case flowChartConstant.C_iFlowNodeType_Level:
                imgName = "ic_level.png";
                break;
            case flowChartConstant.C_iFlowNodeType_OType:
                imgName = "ic_role.png";
                break;
            case flowChartConstant.C_iFlowNodeType_RelativeRole:
                imgName = "ic_relative_role.png";
                break;
            case flowChartConstant.C_iFlowNodeType_Null:
                imgName = "ic_empty_node.png";
                break;
            case flowChartConstant.C_iFlowNodeType_FormControls:
            case flowChartConstant.C_iFlowNodeType_Not_Null:
                imgName = "ic_relative_role.png";
                break;
            case flowChartConstant.C_iFlowNodeType_FormControls_org:
            case flowChartConstant.C_iFlowNodeType_WFDynamicForm:
                imgName = "ic_relative_role_org.png";
                break;
            case flowChartConstant.C_iFlowNodeType_Null:
                imgName = "ic_empty_node.png";
                break;
            case flowChartConstant.C_iFlowNodeType_DeparturePerson:
                imgName = "ic_quit.png";
                break;
            case flowChartConstant.C_iFlowNodeType_preNode:
                imgName = "ic_pre.png";
                break;
            case flowChartConstant.C_iFlowNodeType_nextNode:
                imgName = "ic_real.png";
                break;
            case flowChartConstant.C_iFlowNodeType_MultiNode:
                imgName = "ic_select_people.png";
                break;
            case flowChartConstant.C_iFlowNodeType_DepartureWFDynamicForm:
                imgName = "ic_relative_role_org_delete.png";
                break;
            case flowChartConstant.C_iFlowNodeType_SuperNode:
                imgName = "ic_super_node.png";
                break;
            default:
                imgName = "ic_def_member.png";
                break;
        }
        switch (node.handerNodeType) {
            case flowChartConstant.C_iHanderNodeType_FrontNode:
                imgName = "ic_pre.png";
                break;
            case flowChartConstant.C_iHanderNodeType_RearNode:
                imgName = "ic_real.png";
                break;
            default:
                break;
        }
		if(nodeInfo.vj && (nodeInfo.vj=="1" || nodeInfo.vj=="2" || nodeInfo.vj=="3")){
			if(nodeInfo.vj == "2" && nodeInfo.flowNodeType == flowChartConstant.C_iFlowNodeType_Department){  //vjoin机构组下面的单位
				imgName = "ic_vj_account.png";
			}
			else if(nodeInfo.flowNodeType == flowChartConstant.C_iFlowNodeType_Department || nodeInfo.flowNodeType == flowChartConstant.C_iFlowNodeType_Company ){
				imgName = "ic_vj_wai.png";
			}
			else if(nodeInfo.flowNodeType == flowChartConstant.C_iFlowNodeType_JoinAccountTag){
				imgName = "ic_vj_tag.png";
			}
			else if(nodeInfo.flowNodeType == flowChartConstant.C_iFlowNodeType_Occupation){ //岗位
				imgName = "ic_vj_post.png";
			}
			else if(nodeInfo.flowNodeType == flowChartConstant.C_iFlowNodeType_Not_Null){ //角色
				imgName = "ic_vj_node.png";
			}
			else if(nodeInfo.flowNodeType == flowChartConstant.C_iFlowNodeType_FormControls_org){
				imgName = "ic_vj_form.png";
			}
		}
        
        if (imgName.indexOf(_.origin) >= 0) {//TODO  cmp路径设置
            nodeObj.nodeImg = imgName;
        } else {
            nodeObj.nodeImg = self.cmpPath + "/flow/" + imgName;
        }
        imgPaths.put(nodeObj.nodeImg, nodeObj.nodeImg);
        /* draw node img end */
        /* draw node state img start */
        var handleStateImgName = "";
        switch (nodeInfo.handleState) {
            case flowChartConstant.C_iFlowHandleState_UnDone:
                handleStateImgName = "ic_handle_untreated.png";
                break;
            case flowChartConstant.C_iFlowHandleState_Done:
            case flowChartConstant.C_iFlowHandleState_ZDTG:
                handleStateImgName = "ic_handle_todo.png";
                break;
            case flowChartConstant.C_iFlowHandleState_DoException:
                handleStateImgName = "ic_handle_stop.png";
                break;
            case flowChartConstant.C_iFlowHandleState_BZZDR:
                handleStateImgName = "ic_handle_be_stoped.png";
                break;
            case flowChartConstant.C_iFlowHandleState_ZCDB:
                handleStateImgName = "ic_handle_temporary.png";
                break;
            case flowChartConstant.C_iFlowHandleState_Saw:
                handleStateImgName = "ic_handle_read.png";
                break;
            case flowChartConstant.C_iFlowHandleState_UnReach:
                handleStateImgName = "";
                break;
            case flowChartConstant.C_iFlowHandleState_ZDHT_left:
                handleStateImgName = "ic_state_zdht_left.png";
                break;
            case flowChartConstant.C_iFlowHandleState_ZDHT_right:
                handleStateImgName = "ic_state_zdht_right.png";
                break;
            default:
                handleStateImgName = "";
                break;
        }
        if(nodeInfo.flowNodeType == flowChartConstant.C_iFlowNodeType_End){
            handleStateImgName = "";
        }
        if(nodeInfo.nodeID == node.startNodeID){
            if(handleStateImgName.indexOf("zdht") == -1){
                handleStateImgName = "";
            }
        }
        if (handleStateImgName != "") {
            if(handleStateImgName.indexOf("zdht") != -1){
                nodeObj.handleStateImgBig = self.cmpPath + "/flow/" + handleStateImgName;
                imgPaths.put(nodeObj.handleStateImgBig, nodeObj.handleStateImgBig);
            }else {
                nodeObj.handleStateImg = self.cmpPath + "/flow/" + handleStateImgName;//TODO  cmp路径设置
                imgPaths.put(nodeObj.handleStateImg, nodeObj.handleStateImg);
            }

        }
//                if()
        /* draw node state img end */
        /* draw node branch img start */
        if (nodeInfo.condition != null && nodeInfo.condition.forceType != 0) {
            switch(parseInt(nodeInfo.condition.forceType)) {
                case flowChartConstant.C_iConditionType_ZDFZ1:
                case flowChartConstant.C_iConditionType_ZDFZ4:
                case flowChartConstant.C_iConditionType_SDFZ:
                    nodeObj.branchImg = self.cmpPath + "/flow/ic_branch_node.png";
                    imgPaths.put(nodeObj.branchImg, nodeObj.branchImg);
                    break;

            }
        }
        /* draw node branch img end */
        /*draw node processMode start*/
        if(nodeInfo.processMode != "" && nodeInfo.processMode == flowChartConstant.C_sProcessMode_competition) {
            nodeObj.processModeImg = self.cmpPath + "/flow/ic_compete_comply.png";
            imgPaths.put(nodeObj.processModeImg,nodeObj.processModeImg);
        }
        if(nodeInfo.flowNodeType == flowChartConstant.C_iFlowNodeType_MultiNode){
            imgPaths.put("multiImg",self.cmpPath + "/flow/ic_select_remind.png");
            nodeObj.multiText = _.i18n("cmp.flowV5.choose");
            nodeObj.isMultiNode = true;
        }
        if(nodeInfo.isHasten){
            imgPaths.put("remindesImg",self.cmpPath + "/flow/ic_remindes.png");
            nodeObj.isHasten = true;
            nodeObj.hastenText = _.i18n("cmp.flowV5.reminders");
        }
        /*draw node processMode end*/
        nodeArray.push(nodeObj);
    };
    flowChart.prototype.handleLineArray = function(lineArray,splitBranchArray,node){
        var self = this;
        var max = 0, min = 100000, j,jLen, cNode,w_half = 20, h_half = drawFitVal.node_half_height +50;
        if (node.isJoin) {//画出join节点的线
            var parentNodes = node.parentNode;
            for (j = 0; j < (jLen = parentNodes.length); j++) {
                var pNode = parentNodes[j];
                if (pNode.y > max) {
                    max = pNode.y;
                }
                if (pNode.y < min) {
                    min = pNode.y;
                }
            }
            if (node.childNode != null && node.childNode.length >= 1) {
                cNode = node.childNode[0];
                lineArray.push([node.x + w_half, node.y + h_half, cNode.x + w_half, node.y + h_half]);
            }
            if(self.isBrokenPoint(node.y,max,min)){//如果是断点情况（即不在父节点的y轴之内）
                lineArray.push([node.x+w_half,node.y+h_half,node.x+w_half,max+h_half]);
            }
            lineArray.push([node.x + w_half, min + h_half, node.x + w_half, max + h_half]);
        } else if (node.isSplit) {//画出split节点的连线
            var childNodes = node.childNode;
            for (j = 0; j < (jLen = childNodes.length); j++) {
                cNode = childNodes[j];
                if (cNode.y > max) {
                    max = cNode.y;
                }
                if (cNode.y < min) {
                    min = cNode.y;
                }
                lineArray.push([cNode.x + w_half, cNode.y + h_half, node.x + w_half, cNode.y + h_half]);
            }
            lineArray.push([node.x + w_half, min + h_half, node.x + w_half, max + h_half]);
            if (node.condition != null && node.condition.forceType != 0) {
                switch(parseInt(node.condition.forceType)) {
                    case flowChartConstant.C_iConditionType_ZDFZ1:
                    case flowChartConstant.C_iConditionType_ZDFZ4:
                    case flowChartConstant.C_iConditionType_SDFZ:
                        node.branchImg = self.cmpPath + "/flow/ic_branch_node.png";
                        splitBranchArray.push(node);
                        break;

                }
            }
        } else if (node.isEnd) {//画出结束节点的连线
            lineArray.push([node.x, node.y + h_half, node.x + w_half + 10, node.y + h_half]);
        } else {//画出一般节点的连线
            if (node.childNode != null && node.childNode.length >= 1) {
                cNode = node.childNode[0];
                if (node.childNode.length == 1) {
                    lineArray.push([node.x + w_half, node.y + h_half, cNode.x + w_half, node.y + h_half]);
                } else {
                    lineArray.push([node.x + w_half, node.y + h_half, cNode.x + w_half, node.y + h_half]);
                }
            }
        }
    };
    flowChart.prototype.drawLine = function(lineArray){
        var self = this;
        var i = 0,len = lineArray.length;
        for(;i<len;i++){
            var x1 = lineArray[i][0],y1 = lineArray[i][1],x2 = lineArray[i][2],y2 = lineArray[i][3];
            self.svg.line(x1, y1, x2, y2).stroke({ color: '#dddddd', width: 1 });
        }
    };
    var preClickTime = 0;
    flowChart.prototype.drawImg = function(nodeArray,imgPaths){
        var self = this;
        var i = 0,len = nodeArray.length;
        for(;i<len;i++){
            var nodeObj = nodeArray[i];
            var remindesBtn = null;//催办按钮
            var disabled = nodeObj.nodeInfo.disabled;
            //创建group
            var nodeGroup = self.svg.group().x(nodeObj.x).y(nodeObj.y+30);

            //设置显示的name文字
            var titleText = nodeObj.title;
            var bigTitle = false;
            if(titleText.toLocaleLowerCase() == "end") {
                titleText = "";
            }
            var tileLen = titleText.strLen();
            if(tileLen >= 10)bigTitle = true;
            if(tileLen > 20)titleText = titleText.subCHString(0,18) + "...";
            var titleColor = disabled?"#cccccc":"#000000";
            var foreignObject = self.svg.foreignObject(61,27).move(-14,42);//使用foreignObject来自动换行
            foreignObject.appendChild("div", { innerText: titleText});
            var n = foreignObject.getChild(0);
            // n.style.cssText = "height:27px;overflow:hidden;text-align:center;font-size:12px;line-height:1.1em;color:" + titleColor+";font-family:Calibri";
            n.style.cssText = "-webkit-line-clamp:2;display:-webkit-box; overflow:hidden;text-overflow:ellipsis;-webkit-box-orient:vertical;word-wrap:bred-word; text-align:center;font-size:12px;line-height:1.1em;color:" + titleColor+";font-family:Calibri";
            nodeGroup.add(foreignObject);
            if (nodeObj.nodePermission) {
                var y = 56;
                if(bigTitle){
                    y = 70;
                }
                var nodePermission = self.svg.text(nodeObj.nodePermission).move(18,y).font({
                    family:   'Calibri'
                    , size:     12
                    , anchor:   'middle'
                    , leading:  '1.5em',
                    fill:"#9f9f9f"
                });
                nodeGroup.add(nodePermission);
            }
            if (nodeObj.isCurrent) {
                var current = self.svg.circle(40).move(-2.5,-2.5).fill("#44c0ff");
                nodeGroup.add(current);
            }
            if (nodeObj.nodeImg) {
                (function(){
                    var imgSrc = imgPaths.get(nodeObj.nodeImg);
                    var errorTime = 0;
                    var id = nodeObj.nodeInfo.x + "_" + nodeObj.nodeInfo.y + "_" + nodeObj.nodeInfo.nodeID;
                    var image = self.svg.image(imgSrc,35,35).error(function(){
                        if(errorTime == 0){//避免死循环重复加载
                            self.nodeImgCache[id] = self.cmpPath + "/flow/ic_def_member.png";
                            this.load(self.cmpPath + "/flow/ic_def_member.png");
                            errorTime ++;
                        }
                    }).loaded(function(head){
                        if(errorTime == 0){
                            self.nodeImgCache[id] = imgSrc;
                            var ratio = head.ratio,width = head.width,height = head.height,temp;
                            if(ratio >= 1){
                                temp = (35-height)/height;
                                height = 35;
                                width = width*(1+temp);
                            }else {
                                temp = (35-width)/width;
                                width = 35;
                                height = height*(1+temp);
                            }
                            this.size(width,height);
                        }
                    });
                    var nodeImg = self.svg.circle(35).fill(image);
                    nodeImg.attr({id:id});
                    nodeGroup.add(nodeImg);
                })();


                if(disabled){
                    var disableMask = self.svg.circle(35);
                    disableMask.attr({
                        fill: '#ffffff',
                        'fill-opacity': 0.7
                    });
                    nodeGroup.add(disableMask);
                }
            }
            if (nodeObj.handleStateImg) {
                var imgSrc = imgPaths.get(nodeObj.handleStateImg);
                var image = self.svg.image(imgSrc,12,12);
                var nodeImg = self.svg.circle(12).fill(image).move(24,24);
                nodeGroup.add(nodeImg);
            }
            if(nodeObj.handleStateImgBig){//指定回退的图标
                var handleStateMask = self.svg.circle(35);
                handleStateMask.attr({
                    'fill-opacity': 0.3
                });
                nodeGroup.add(handleStateMask);
                var imgSrc = imgPaths.get(nodeObj.handleStateImgBig);
                var image = self.svg.image(imgSrc,35,35);
                var nodeImg = self.svg.circle(35).fill(image);
                nodeGroup.add(nodeImg);
            }

            if (nodeObj.branchImg) {//分支节点图标
                var imgSrc = imgPaths.get(nodeObj.branchImg);
                var image = self.svg.image(imgSrc,15,15).move(-40,13);
                nodeGroup.add(image);
            }

            if(nodeObj.processModeImg) {//竞争执行（小红旗）
                var imgSrc = imgPaths.get(nodeObj.processModeImg);
                var image = self.svg.image(imgSrc,18,18).move(22,-8);
                nodeGroup.add(image);
            }
            var u_agent = navigator.userAgent; 
			var leadingNum = 1.5;
			if(u_agent.indexOf('HUAWEI ALE-CL00')>-1){
				leadingNum = 1.1;
			}
            if(nodeObj.isMultiNode) {//【请选择】按钮
                var imgSrc = imgPaths.get("multiImg");
                var image = self.svg.image(imgSrc,32,18).move(13,-13);
                nodeGroup.add(image);

                var mnodeText = self.svg.text(nodeObj.multiText).move(28,-10).font({
                    family:   'Calibri'
                    , size:     8
                    , anchor:   'middle'
                    , leading:  leadingNum, //以前是1.5em ，我看是自动换算乘以10，改成1.5
                    fill:"#ffffff"
                });
                nodeGroup.add(mnodeText);
            }

            if(nodeObj.isHasten){//【催办】按钮
                var remindesBtn = self.svg.group().x(50).y(25);
                var imgSrc = imgPaths.get("remindesImg");
                var image = self.svg.image(imgSrc,30,15).move(-15,-2);
                remindesBtn.add(image);

                var remindesText = self.svg.text(nodeObj.hastenText).move(0,0).font({
                    family:   'Calibri'
                    , size:     10
                    , anchor:   'middle'
                    , leading:  leadingNum //以前是1.5em ，我看是自动换算乘以10，改成1.5
                });
                remindesBtn.add(remindesText);
                nodeGroup.add(remindesBtn);
            }
            if(nodeObj.nodeInfo.hasAdvanceEvent){
                var imgSrc = self.cmpPath + "/flow/ic_node_event.png";
                var image = self.svg.image(imgSrc,18,18).move(-4,20);
                nodeGroup.add(image);
            }
            (function(nodeObj){
                nodeGroup.on("tap",function(e){
                    e.stopPropagation();
                    var currentClickTime = new Date().getTime();
                    if((currentClickTime - preClickTime)<500) return;
                    if (self.opts.callback) {
                        self.opts.callback(nodeObj.nodeInfo);
                        preClickTime = currentClickTime;
                    }
                });
                if(remindesBtn){
                    remindesBtn.on("tap",function(e){
                        e.stopPropagation();
                        var currentClickTime = new Date().getTime();
                        if((currentClickTime - preClickTime)<500) return;
                        if (self.opts.callback) {
                            self.opts.callback(nodeObj.nodeInfo,"remindes");
                            preClickTime = currentClickTime;
                        }
                    });
                }
            })(nodeObj);
        }
    };
    flowChart.prototype.drawSplitBranch = function(splitBranchArray,imgPaths){
        var self = this;
        for(var i = 0;i<splitBranchArray.length;i++){
            var splitNode = splitBranchArray[i];
            var nodeGroup = self.svg.group().x(splitNode.x-30).y(splitNode.y+72);
            var imgSrc = imgPaths.get(splitNode.branchImg);
            var image = self.svg.image(imgSrc,30,15);
            nodeGroup.add(image);
        }
    };
    flowChart.prototype.drawCircle = function(circleNode,baseLine){
        var self = this;
        var i = 0,len = circleNode.length;
        self.circleGroup = self.svg.group().x(0).y(0);
        for(;i<len;i++){
            var circleDrawObj = circleNode[i];
            var startX = circleDrawObj.x,startY = circleDrawObj.y;
            startX += 50/5;
            startY += drawFitVal.node_v_center;
            var circleChildren = circleDrawObj.circleChildren;
            var j = 0,length = circleChildren.length;
            for(;j<length;j++){
                var endX = circleChildren[j].x,endY = circleChildren[j].y;
                endX += 118/5;
                endY += drawFitVal.node_v_center;
                var curvePoint = self.countCurvePoint(startX,startY,endX,endY,baseLine);
                var pointX = curvePoint.pointX,pointY = curvePoint.pointY,startY = curvePoint.startY,endY = curvePoint.endY,extY = curvePoint.extY;
                (function(sx,sy,ex,ey,px,py){
                    var arc = self.circleGroup.path('M'+sx+' '+ sy+' Q'+px + " " + py+" " +ex+" "+ey);
                    arc.fill('none');
                    arc.stroke({ color: '#0000ff', width: 1, linecap: 'round', linejoin: 'round' });
                })(startX,startY,endX,endY,pointX,pointY);
            }
        }
    };
    flowChart.prototype.countCurvePoint = function(startX,startY,endX,endY,baseLine){
        var pointX,pointY;
        var adjValX = Math.ceil((startX-endX)/85);
        if(adjValX > 2) adjValX = 2;
        var adjValY = Math.ceil((Math.abs(startY-endY))/85);
        var littleAdjValY = Math.abs(startY-endY)/85;
        adjValY = adjValY == 0?1:adjValY;
        var extY = 0;//根据baseline不同的y向位置度
        if(startY == endY){
            pointY = startY-50*adjValX;
            pointX = endX +  (startX - endX)/2;
        }else if(startY < endY) {
            if(startY < baseLine) {
                pointY = startY;
                pointX =  endX + (startX - endX)/2;
                if(adjValY >= 2){
                    extY = -45;
                    if(littleAdjValY > 1.5){
                        extY = -90;
                    }
                }
            } else {
                pointY = endY + (endY - startY)/2;
                pointX =  endX + (startX - endX)/2;
                startY += 20;//环形流程幅度经验值是20
                endY += 20;
                if(adjValY >= 2){
                    extY = -180;
                }
            }

        }else {
            if(startY <= baseLine) {
                pointY = endY + ((startY-endY)/2);
                pointX =  endX + (startX - endX);
                extY = 55;
            }else {
                if(adjValY >= 2){
                    pointY = endY + ((startY-endY))/2;
                    extY = 55;
                }else {
                    pointY = endY - ((startY-endY));
                    if(adjValY == 1){
                        extY = 55;
                    }
                }
                pointX =  endX + (startX - endX)/2;
            }

        }
        //pointX =  endX + (startX - endX);
        return {
            startY:startY,
            endY:endY,
            pointX:pointX,
            pointY:pointY,
            extY:extY
        }
    };
    flowChart.prototype.isBrokenPoint = function(nodeY,maxY,minY){
        if( nodeY > maxY || nodeY < minY) return true;
        return false;
    };
    var flowChartGougou,gougouWidth,gougouHeight,quondamImgCache = {};
    flowChart.prototype.updateNode = function(nodeObj){
        var self = this;
        var i = 0,len = nodeObj.length;
        for(;i<len;i++){
            var id = nodeObj[i].x + "_" + nodeObj[i].y + "_" + nodeObj[i].nodeID;
            var node = SVG.get(id);
            var state = nodeObj[i].state;
            switch(state){
                case "select":
                    var gou = self._getGouImg();
                    node.fill(gou);
                    break;
                case "reset"://将原来的钩钩去掉又恢复到头像的样子
                    var nodeImg = self._getQuondamNodeImg(self.nodeImgCache[id]);
                    node.fill(nodeImg);
                    break;
                default :
                    break;
            }
        }

    };

    flowChart.prototype._getGouImg = function (){
        var self = this;
        return self.svg.image(self.cmpPath + "/flow/ic_gougou.png",35,35);
    };
    flowChart.prototype._getQuondamNodeImg = function(imgSrc){
        var self = this;
        var image = self.svg.image(imgSrc,35,35).error(function(){
            if(errorTime == 0){//避免死循环重复加载
                this.load(self.cmpPath + "/flow/ic_def_member.png");
                errorTime ++;
            }
        }).loaded(function(head){
            var ratio = head.ratio,width = head.width,height = head.height,temp;
            if(ratio >= 1){
                temp = (35-height)/height;
                height = 35;
                width = width*(1+temp);
            }else {
                temp = (35-width)/width;
                width = 35;
                height = height*(1+temp);
            }
            this.size(width,height);
        });
        return image;
    };
    /**
     * 数据处理对象类
     * @param flowNode
     * @param isLocal
     * @returns {{size, flowNode, startNodeID}|{size: {mc_width: (number|*), mc_height: (number|*)}, flowNode: (*|Map), startNodeID: (number|*|string|string)}}
     */
    var flowChartData = function (flowNode) {
        var self = this;
        self.x_distance = 80;
        self.y_distance = 100;
        self.startNodeId = 0;
        self.startNode = null;
        self.flowNodeMap = {};
        self.levelH = {};
        self.maxLevel_V = flowNode.maxLevel_V;
        self.mc_width = 0;
        self.mc_height = 0;
        self.circleNode = [];
        self.baseLine = 0;
        return self.convertToVo(flowNode);
    };

    /**
     * 将所有计算好的数据转场对象便于画图操作
     * @param flowNode
     * @param isLocal
     * @returns {{size: {mc_width: (number|*), mc_height: (number|*)}, flowNode: (*|Map), startNodeID: (number|*|string|string)}}
     */
    flowChartData.prototype.convertToVo = function (flowNode) {
        var self = this;
        self.putNodeToMap(flowNode);
        self.handleNodeData();
        self.countDistance(flowNode);
        return {
            size: {
                mc_width: self.mc_width,
                mc_height: self.mc_height
            },
            flowNode: self.flowNodeMap,
            startNodeID: self.startNodeId,
            circleNode:self.circleNode,
            baseLine:self.baseLine
        }
    };

    /**
     * 将节点数据转成cmp所需数据类型
     * @param flowNode
     */
    flowChartData.prototype.putNodeToMap = function (flowNode) {
        var self = this;
        var flowNodes = flowNode.nodes;
        for (var i = 0, len = flowNodes.length; i < len; i++) {
            flowNodes[i].childNode =[];
            flowNodes[i].parentNode = [];
            self.flowNodeMap[flowNodes[i].nodeID] = flowNodes[i];
        }
    };

    /**
     * 处理节点关系
     */
    flowChartData.prototype.handleNodeData = function () {
        var self = this;
        for (var key in self.flowNodeMap) {
            var node = self.flowNodeMap[key];
            if ("split" == node.entityName) {
                node.isSplit = true;
            } else if ("join" == node.entityName) {
                node.isJoin = true;
            } else if ("end" == node.entityName ||"nextNodes" == node.nodeID) {
                node.isEnd = true;
            }
            var ps = node.parentIDList;
            if (ps == null || ps.length == 0) {//处理parentNode
                self.startNodeId = key;
                self.startNode = node;
                node.isStart = true;
                if("preNodes" ==  node.nodeID){
                    node.isPreNodes = true;
                }
            } else {
                for (var j = 0, jLen = ps.length; j < jLen; j++) {
                    var pNode = self.flowNodeMap[ps[j]];
                    if (pNode != null) {
                        node.parentNode.push(pNode);
                        pNode.childNode.push(node);
                    }
                }
            }
            self.setNodePosition(node);
            var circleTransitionList = node.circleTransitionList;
            if (circleTransitionList.length > 0) {
                var circleArr = [], j = 0, length = circleTransitionList.length;
                for (; j < length; j++) {
                    var child = self.flowNodeMap[circleTransitionList[j].toNodeId];
                    var x = child.x;
                    var y = child.y;
                    var circleChildNode = new circleChild(child,x,y);
                    circleArr.push(circleChildNode);
                }
                node.circleChildren = circleArr;
                var currentCircleObj = new circleDrawObj(node.nodeID,node.x,node.y,circleArr);
                self.circleNode.push(currentCircleObj);
            }


        }
    }



    /**
     * 计算最终的距离
     */
    flowChartData.prototype.countDistance = function (data) {
        var self = this;
        self.mc_width = self.x_distance * data.maxLevel_H;
        self.mc_height = self.y_distance * (data.maxLevel_V+2);
    };

    /**
     * 计算节点的位置
     * @param node
     * @param isNew
     */
    flowChartData.prototype.setNodePosition = function (node) {
        var self = this;
        if(node.isStart && !node.isPreNodes){
            node.x = 60;
            node.y = self.maxLevel_V * self.y_distance / 2+10;
            self.baseLine = node.y;
        }else{
            node.x = node.level_H * self.x_distance;
            node.y = node.level_V * self.y_distance + 10 - 50;
        }

    };
    var circleDrawObj = function(nodeID,x,y,circleChildren){
        this.nodeID = nodeID;
        this.x = x;
        this.y = y;
        this.circleChildren = circleChildren;
    };
    var circleChild = function(nodeID,x,y){
        this.nodeID = nodeID;
        this.x = x;
        this.y = y;
    };

    /**
     * 获取中英文字符串
     * @returns {number}
     */
    String.prototype.strLen = function () {
        var len = 0;
        for (var i = 0; i < this.length; i++) {
            if (this.charCodeAt(i) > 255 || this.charCodeAt(i) < 0) len += 2; else len++;
        }
        return len;
    };
    /**
     * 将字符串拆成字符，并存到数组中
     * @returns {Array}
     */
    String.prototype.strToChars = function () {
        var chars = [];
        for (var i = 0; i < this.length; i++) {
            chars[i] = [this.substr(i, 1), this.isCHS(i)];
        }
        String.prototype.charsArray = chars;
        return chars;
    };
    /**
     * 判断某个字符是否是汉字
     * @param i
     * @returns {boolean}
     */
    String.prototype.isCHS = function (i) {
        return this.charCodeAt(i) > 255 || this.charCodeAt(i) < 0;
    };
    /**
     * 截取中文字符串（从start字节到end字节）
     * @param start
     * @param end
     * @returns {string}
     */
    String.prototype.subCHString = function (start, end) {
        var len = 0;
        var str = "";
        this.strToChars();
        for (var i = 0; i < this.length; i++) {
            if (this.charsArray[i][1])
                len += 2;
            else
                len++;
            if (end < len)
                return str;
            else if (start < len)
                str += this.charsArray[i][0];
        }
        return str;
    };
    /**
     *
     * 截取中文字符串（从start字节截取length个字节）
     * @param start
     * @param length
     */
    String.prototype.subCHStr = function (start, length) {
        return this.subCHString(start, start + length);
    };

    /**
     * 流程图组件
     */
    _.flowChart = function (id, opts) {
        return new flowChart(id, opts);
    }

    //=================================================================================m1 数据格式 end========================//

    //=================================================================================v5 数据格式 start=====================//
    var flowDataConstant = {
        C_sFlowNodeType_Start:"start",
        C_sFlowNodeType_Node: "Node",
        C_sFlowNodeType_Split: "split",
        C_sFlowNodeType_Join: "join",
        C_sFlowNodeType_End: "end",
        C_sFlowNodeType_humen:"humen",
        C_sFlowNodeType_DeparturePerson: "departurePerson",
        C_sFlowNodeType_Person: "user",
        C_sFlowNodeType_Department: "Department",
        C_sFlowNodeType_SubGrouping: "Team",
        C_sFlowNodeType_OType: "oType",
        C_sFlowNodeType_Occupation: "Post",
        C_sFlowNodeType_Level:"Level",
        C_sFlowNodeType_Company: "Account",
        C_sFlowNodeType_RelativeRole: "Department_Role",
        C_sFlowNodeType_FormControls: "FormField",
        C_sFlowNodeType_WFDynamicForm:"WFDynamicForm",
        C_sFlowNodeType_Inform: "inform",
        C_sFlowNodeType_BlankNode:'BlankNode',//空节点
		C_sFlowNodeType_JoinAccountTag:'JoinAccountTag',//单位标签
        C_sFlowNodeType_SuperNode:"WF_SUPER_NODE",//超级节点


        C_sFlowNodeType_FormControls_Manager:'#DepManager',
        C_sFlowNodeType_FormControls_Leader:'#DepLeader',
        C_sFlowNodeType_FormControls_Admin:'#DepAdmin',
        C_sFlowNodeType_FormControls_Departmentexchange:'#Departmentexchange',
        C_sFlowNodeType_FormControls_Memeber:'#DeptMember',

        C_sFlowNodeType_normal:"normal", //人员状态---正常
        C_sFlowNodeType_delete:"delete",//人员状态---删除
        C_sFlowNodeType_truce:"truce",//人员状态---停用
        C_sFlowNodeType_dimission:"dimission",//人员状态---离职

        C_sFlowNodeType_preNode:"preNodes",//前置节点
        C_sFlowNodeType_nextNode:"nextNodes",//后置节点



        C_iFlowNodeType_Not_Null:-10,
        C_iFlowNodeType_Start:-9,
        C_iFlowNodeType_Null: -1,
        C_iFlowNodeType_Split: -2,
        C_iFlowNodeType_Join: -3,
        C_iFlowNodeType_End: -4,
        C_iFlowNodeType_DeparturePerson: -5,
        C_iFlowNodeType_DepartureWFDynamicForm:-6,//动态表单节点停用
        C_iFlowNodeType_Person: 0,
        C_iFlowNodeType_Department: 1,
        C_iFlowNodeType_SubGrouping: 2,
        C_iFlowNodeType_OType: 3,
        C_iFlowNodeType_Occupation: 4,
        C_iFlowNodeType_Company: 5,
        C_iFlowNodeType_RelativeRole: 6,
        C_iFlowNodeType_FormControls_org: 7,
        C_iFlowNodeType_Inform: 8,
        C_iFlowNodeType_Level:9,
        C_iFlowNodeType_FormControls:10,

        C_iFlowNodeType_normal:11,
        C_iFlowNodeType_delete:12,
        C_iFlowNodeType_truce:13,
        C_iFlowNodeType_dimission:14,
        C_iFlowNodeType_MultiNode:15,//多级会签节点
        C_iFlowNodeType_WFDynamicForm:16,//动态表控件节点
        C_iFlowNodeType_JoinAccountTag:17,//单位标签
        C_iFlowNodeType_SuperNode:100,//超级节点

		C_iFlowNodeType_nextNode:-11,//后置节点
        C_iFlowNodeType_preNode:-12,//前置节点


        C_iFlowHandleState_UnDone: 0,
        C_iFlowHandleState_Done: 1,
        C_iFlowHandleState_DoException: 2,//终止的人（红色）
        C_iFlowHandleState_Doing: 3,
        C_iFlowHandleState_Saw: 4,
        C_iFlowHandleState_UnReach: 5,
        C_iFlowHandleState_ZDTG: 6,//自动跳过
        C_iFlowHandleState_ZCDB:7,//暂存待办
        C_iFlowHandleState_BZZDR:22,//被终止的人（灰色）
        C_iFlowHandleState_ZDHT_left:41,//指定回退左边
        C_iFlowHandleState_ZDHT_right:61//指定回退右边
    };
    var flowData = function(data,opts){
        var self = this;
        self.opts = _.extend({
            id:"",  //容器id
            cWidth: -1,//展示区域宽度
            cHeight: -1,//展示区域高度
            callback: null,     //回调函数
            completeCallback:null//画图完成或者不能画图的回调函数
        },opts);
        self._sortNode(data);
        if(data.maxLevel_H > 200 || data.maxLevel_V > 200){
            _.notification.alert(_.i18n("cmp.flowV5.nodesOverSize"),null,_.i18n("cmp.flowV5.tips"),_.i18n("cmp.flowV5.ok"));
            if(typeof self.opts.completeCallback == "function"){
                self.opts.completeCallback({success:false,message:_.i18n("cmp.flowV5.errorMsgOverSize"),code:60002,detail:"size exceed size"});
            }
            return;
        }
        data = self._convertVO(data);
        if(self.opts.cWidth == -1 && self.opts.cHeight == -1) {
            var header = document.getElementsByTagName("header")[0],
                footer = document.getElementsByTagName("footer")[0],
                titleContent = document.querySelector(".cmp-segmented_title_content"),
                tab = document.querySelector(".cmp-segmented-control");
            var headerH = header?header.offsetHeight:0,
                footerH = footer?footer.offsetHeight:0,
                titleContentH = titleContent?titleContent.offsetHeight:0,
                tabH = tab?tab.offsetHeight:0,
                winH = window.innerHeight,
                winW = window.innerWidth;

            self.opts.cHeight = winH - headerH - footerH - titleContentH - tabH;
            self.opts.cWidth = winW;
        }
        self.flowChart = cmp.flowChart(self.opts.id,self.opts);
        self.flowChart.draw(data);//画图调用

    };
    flowData.prototype._sortNode = function(result){
        var self = this;
        var _sortArray = function(array){
            var i = 0;
            var j = array.length - 1;
            var Sort = function(i, j) {
                var level_V = (parseInt(array[i].y)+50)/100;
                array[i].level_V = level_V;
                if (i == j) {
                    return
                };
                var cha = array[i];
                var key = parseInt(array[i].y);
                var stepi = i; // 记录开始位置
                var stepj = j; // 记录结束位置
                while (j > i) {
                    if (parseInt(array[j].y) >= key) {
                        j--;
                    } else {
                        array[i] = array[j];
                        while (j > ++i) {
                            if (parseInt(array[i].y) > key) {
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
                array[i] = cha;
                Sort(stepi, i);
                Sort(j, stepj);
            }
            Sort(i, j);
            return array;
        }
        var nodes = result.nodes;
        var sortNodes = [];
        var series = {};
        var maxY = 0;
        for(var i = 0;i <nodes.length;i++){
            var x = nodes[i].x;
            var y = nodes[i].y;
            y = parseInt(y);
            if(y >= maxY){
                maxY = y;
            }
            var seriesGroupKey = "group_" + x;
            if(!series[seriesGroupKey]){
                series[seriesGroupKey] = [];
                series[seriesGroupKey].push(nodes[i]);
            }else {
                series[seriesGroupKey].push(nodes[i]);
            }
        }
        var maxLevel_V = (maxY+50)/100;
        if(maxLevel_V < 1) {
            maxLevel_V = 1;
        }
        for(var key in series){
            var nodeGroup = series[key];
            nodeGroup = _sortArray(nodeGroup);
            sortNodes.push({key:key,nodeGroup:nodeGroup});
        }
        var i = 0,len = sortNodes.length,tmp,k = 0;
        for(;i<len-1;i++){
            for(var j=0;j<len-1-i;j++){
                var x1 = parseInt(sortNodes[j].key.replace("group_",""));
                var x2 = parseInt(sortNodes[j+1].key.replace("group_",""));
                if(x1 > x2){
                    tmp = sortNodes[j];
                    sortNodes[j] = sortNodes[j+1];
                    sortNodes[j+1] = tmp;
                }
            }
        }
        result.nodes = sortNodes;
        result.maxLevel_H = len;//x向的最大刻度就是分组后的大小；
        result.maxLevel_V = maxLevel_V;
    }
    flowData.prototype._convertVO = function(data){
        var self = this;
        var voNodes = {},nodes = data.nodes,i = 0,len = nodes.length,level_H = 1;
        voNodes.currentNodeID = data.activityId; //todo 需要将当前节点传入
        voNodes.nodes = [];

        for(;i < len; i ++) {
            var node = nodes[i], nodeGroup = node.nodeGroup,j = 0, length = nodeGroup.length;
            for(;j<length;j++){
                var voNode = {},condition = nodeGroup[j].condition,members = nodeGroup[j].members;
                voNode.condition =  self._convertCondition(condition);
                voNode.belongCompany = {};
                voNode.nodePermission = {};
                voNode["nodeID"] = nodeGroup[j].id;
                voNode["entityName"] = nodeGroup[j].name;
                var flowNodeType = self._convertFlowNodeType(nodeGroup[j].type,nodeGroup[j]);
                voNode["flowNodeType"] = flowNodeType;
				voNode["vj"] = nodeGroup[j].vj;
                voNode["handleState"] = self._convertHandleState(parseInt(nodeGroup[j].state),nodeGroup[j].read);
                voNode["hasChild"] = nodeGroup[j].nf;
                voNode["parentIDList"] = nodeGroup[j].pids;
                voNode["policyId"] = nodeGroup[j].policyId;
                voNode["policyName"] = nodeGroup[j].policyName;
                voNode["partyType"] = nodeGroup[j].partyType;
                voNode["partyName"] = nodeGroup[j].partyName;
                voNode["partyId"] = nodeGroup[j].partyId;
                voNode["partyStatus"] = nodeGroup[j].partyStatus;
                voNode["read"] = nodeGroup[j].read;
                voNode["state"] = nodeGroup[j].state;
                voNode["formAppId"] = nodeGroup[j].formAppId;
                voNode["formViewOperation"] = nodeGroup[j].formViewOperation;
                voNode["processMode"] = nodeGroup[j].processMode;
                voNode["circleTransitionList"] = self._convertCircleNodeList(nodeGroup[j]);

                voNode["isHasten"] = (nodeGroup[j].isHasten && (nodeGroup[j].isHasten == "true" || nodeGroup[j].isHasten == true))?true:false;//是否显示催办按钮
                voNode["hasAdvanceEvent"] = nodeGroup[j].hasAdvanceEvent;
                voNode.belongCompany["accountShortname"] = nodeGroup[j].accountName;
                voNode.belongCompany["groupID"] = nodeGroup[j].accountId;
                voNode.nodePermission["description"] = (nodeGroup[j].type == "start")?null: nodeGroup[j].policyName;
                voNode.level_H = level_H;
                voNode.level_V = nodeGroup[j].level_V;
                voNode.disabled = nodeGroup[j].disabled;//置灰状态
                voNodes.nodes.push(voNode);
            }
            level_H ++;
        }
        voNodes.maxLevel_H = data.maxLevel_H;
        voNodes.maxLevel_V = data.maxLevel_V;
        return voNodes;
    };

    flowData.prototype._convertFlowNodeType = function(nodeType,node){
        var flowNodeType = -99999;
        switch (nodeType){
            case flowDataConstant.C_sFlowNodeType_Split:
                flowNodeType = flowDataConstant.C_iFlowNodeType_Split;
                break;
            case flowDataConstant.C_sFlowNodeType_Join:
                flowNodeType = flowDataConstant.C_iFlowNodeType_Join;
                break;
            case flowDataConstant.C_sFlowNodeType_End:
                flowNodeType = flowDataConstant.C_iFlowNodeType_End;
                if(node.id == flowDataConstant.C_sFlowNodeType_nextNode){
                    flowNodeType = flowDataConstant.C_iFlowNodeType_nextNode;
                }
                break;
            case flowDataConstant.C_sFlowNodeType_Start:
                flowNodeType = flowDataConstant.C_iFlowNodeType_Start;
                if(node.id == flowDataConstant.C_sFlowNodeType_preNode) {
                    flowNodeType = flowDataConstant.C_iFlowNodeType_preNode;
                }
                if (node.status!=flowDataConstant.C_sFlowNodeType_normal){
                    flowNodeType = flowDataConstant.C_iFlowNodeType_DeparturePerson;
                }
                break;
            case flowDataConstant.C_sFlowNodeType_humen:
                switch (node.partyType){
                    case flowDataConstant.C_sFlowNodeType_DeparturePerson:
                        flowNodeType = flowDataConstant.C_iFlowNodeType_DeparturePerson;
                        break;
                    case flowDataConstant.C_sFlowNodeType_Person:
                        flowNodeType = flowDataConstant.C_iFlowNodeType_Person;
                        break;
                    case flowDataConstant.C_sFlowNodeType_Department:
                        flowNodeType = flowDataConstant.C_iFlowNodeType_Department;
                        break;
                    case flowDataConstant.C_sFlowNodeType_SubGrouping:
                        flowNodeType = flowDataConstant.C_iFlowNodeType_SubGrouping;
                        break;
                    case flowDataConstant.C_sFlowNodeType_OType:
                        flowNodeType = flowDataConstant.C_iFlowNodeType_OType;
                        break;
                    case flowDataConstant.C_sFlowNodeType_Occupation:
                        flowNodeType = flowDataConstant.C_iFlowNodeType_Occupation;
                        break;
                    case flowDataConstant.C_sFlowNodeType_Level:
                        flowNodeType = flowDataConstant.C_iFlowNodeType_Level;
                        break;
                    case flowDataConstant.C_sFlowNodeType_Company:
                        flowNodeType = flowDataConstant.C_iFlowNodeType_Company;
                        break;
                    case flowDataConstant.C_sFlowNodeType_RelativeRole:
                        flowNodeType = flowDataConstant.C_iFlowNodeType_RelativeRole;
                        break;
                    case flowDataConstant.C_sFlowNodeType_FormControls:
                        if(node.partyId.indexOf(flowDataConstant.C_sFlowNodeType_FormControls_Manager) > -1
                            ||node.partyId.indexOf(flowDataConstant.C_sFlowNodeType_FormControls_Leader) > -1
                            ||node.partyId.indexOf(flowDataConstant.C_sFlowNodeType_FormControls_Admin) > -1
                            ||node.partyId.indexOf(flowDataConstant.C_sFlowNodeType_FormControls_Memeber) > -1
                            ||node.partyId.indexOf(flowDataConstant.C_sFlowNodeType_FormControls_Departmentexchange) > -1){
                            flowNodeType = flowDataConstant.C_iFlowNodeType_FormControls;
                        }else {
                            flowNodeType = flowDataConstant.C_iFlowNodeType_FormControls_org;
                        }
                        break;
                    case flowDataConstant.C_sFlowNodeType_WFDynamicForm:
                        flowNodeType = flowDataConstant.C_iFlowNodeType_WFDynamicForm;
                        break;
                    case flowDataConstant.C_sFlowNodeType_Inform:
                        flowNodeType = flowDataConstant.C_iFlowNodeType_Inform;
                        break;
                    case flowDataConstant.C_sFlowNodeType_Node:
                        if(node.partyId == flowDataConstant.C_sFlowNodeType_BlankNode){
                            flowNodeType = flowDataConstant.C_iFlowNodeType_Null;
                        }else {
                            flowNodeType = flowDataConstant.C_iFlowNodeType_Not_Null;
                        }
                        break;
					case flowDataConstant.C_sFlowNodeType_JoinAccountTag:
						flowNodeType = flowDataConstant.C_iFlowNodeType_JoinAccountTag;
                        break;
                    case flowDataConstant.C_sFlowNodeType_SuperNode:
                        flowNodeType = flowDataConstant.C_iFlowNodeType_SuperNode;
                        break;
                }
                switch (node.status){
                    case flowDataConstant.C_sFlowNodeType_delete:
                    case flowDataConstant.C_sFlowNodeType_dimission:
                    case flowDataConstant.C_sFlowNodeType_truce:
                        if(node.partyType == flowDataConstant.C_sFlowNodeType_WFDynamicForm){
                            flowNodeType = flowDataConstant.C_iFlowNodeType_DepartureWFDynamicForm;
                        }else {
                            flowNodeType = flowDataConstant.C_iFlowNodeType_DeparturePerson;
                        }
                        break;
                }
                break;
        }
        if(node.isMultiNode && (node.isMultiNode == true || node.isMultiNode == "true")){
            flowNodeType = flowDataConstant.C_iFlowNodeType_MultiNode;
        }
        return flowNodeType;
    };
    flowData.prototype._convertHandleState = function(state,read) {
        var voState = -9999;
        switch (state) {
            case 6:    //终止
            case 24:
                voState = flowDataConstant.C_iFlowHandleState_DoException;
                break;
            case 7:   //暂存待办
                voState = flowDataConstant.C_iFlowHandleState_ZCDB;
                break;
            case 3:   //已办
            case 27://合并处理
                voState = flowDataConstant.C_iFlowHandleState_Done;
                break;
            case 0://未到达
                voState = flowDataConstant.C_iFlowHandleState_UnReach;
                break;
            case 22://被终止的人
                voState = flowDataConstant.C_iFlowHandleState_BZZDR;
                break;
            case 41://指定回退左边
                voState = flowDataConstant.C_iFlowHandleState_ZDHT_left;
                break;
            case 61://指定回退右边
                voState = flowDataConstant.C_iFlowHandleState_ZDHT_right;
                break;
            default :
                if(read && (read == true || read == "true")) {
                    voState = flowDataConstant.C_iFlowHandleState_Saw; //已读
                }else if(read == false || read == "false") {
                    voState = flowDataConstant.C_iFlowHandleState_UnDone; //未办
                }

        }
        return voState;
    };
    flowData.prototype._convertCondition = function(condition){
        var voCondition;
        if(condition) {
            voCondition = {};
            voCondition["forceType"] = condition.type;
            voCondition["base"] = condition.base;
            voCondition["expression"] = condition.expression;
            voCondition["title"] = condition.title;
        }else {
            voCondition = null;
        }
        return voCondition;
    };
    flowData.prototype._convertCircleNodeList = function(node){
        var circleChildren = node.clcids;
        var circleNodeList = [];
        if(circleChildren && circleChildren.length > 0){
            var i = 0,len = circleChildren.length;
            for(;i<len;i++){
                circleNodeList.push({
                    toNodeId:circleChildren[i],
                    fromNodeId:node.id
                });
            }
        }
        return circleNodeList;
    };
    flowData.prototype.draw = function(data){
        var self = this;
        self._sortNode(data);
        data = self._convertVO(data);

        self.flowChart.draw(data);//画图调用
    };
    //提供给开发者更新节点的方法
    flowData.prototype.updateNode = function(nodeObj){
        var self = this;
        self.flowChart.updateNode(nodeObj);
    };
    var flowObjCache = {};
    /**
     * 流程图组件（v5数据格式适配版）
     */
    _.flowV5 = function(data,opts){
        if(!flowObjCache[opts.id]){
            flowObjCache[opts.id] = new flowData(data,opts);
        }else {
            flowObjCache[opts.id].draw(data);
        }
        return flowObjCache[opts.id];
    }
    //==========================================================================v5 数据格式 end=======================//
})(cmp,SVG);


