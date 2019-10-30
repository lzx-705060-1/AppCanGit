﻿;(function ($, window, undefined) {
	var CryptoJS=CryptoJS||function(h,o){var f={},j=f.lib={},k=j.Base=function(){function a(){}return{extend:function(b){a.prototype=this;var c=new a;b&&c.mixIn(b);c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.$super.extend(this)}}}(),i=j.WordArray=k.extend({init:function(a,b){a=
		this.words=a||[];this.sigBytes=b!=o?b:4*a.length},toString:function(a){return(a||p).stringify(this)},concat:function(a){var b=this.words,c=a.words,d=this.sigBytes,a=a.sigBytes;this.clamp();if(d%4)for(var e=0;e<a;e++)b[d+e>>>2]|=(c[e>>>2]>>>24-8*(e%4)&255)<<24-8*((d+e)%4);else if(65535<c.length)for(e=0;e<a;e+=4)b[d+e>>>2]=c[e>>>2];else b.push.apply(b,c);this.sigBytes+=a;return this},clamp:function(){var a=this.words,b=this.sigBytes;a[b>>>2]&=4294967295<<32-8*(b%4);a.length=h.ceil(b/4)},clone:function(){var a=
		k.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var b=[],c=0;c<a;c+=4)b.push(4294967296*h.random()|0);return i.create(b,a)}}),l=f.enc={},p=l.Hex={stringify:function(a){for(var b=a.words,a=a.sigBytes,c=[],d=0;d<a;d++){var e=b[d>>>2]>>>24-8*(d%4)&255;c.push((e>>>4).toString(16));c.push((e&15).toString(16))}return c.join("")},parse:function(a){for(var b=a.length,c=[],d=0;d<b;d+=2)c[d>>>3]|=parseInt(a.substr(d,2),16)<<24-4*(d%8);return i.create(c,b/2)}},n=l.Latin1={stringify:function(a){for(var b=
		a.words,a=a.sigBytes,c=[],d=0;d<a;d++)c.push(String.fromCharCode(b[d>>>2]>>>24-8*(d%4)&255));return c.join("")},parse:function(a){for(var b=a.length,c=[],d=0;d<b;d++)c[d>>>2]|=(a.charCodeAt(d)&255)<<24-8*(d%4);return i.create(c,b)}},q=l.Utf8={stringify:function(a){try{return decodeURIComponent(escape(n.stringify(a)))}catch(b){throw Error("Malformed UTF-8 data");}},parse:function(a){return n.parse(unescape(encodeURIComponent(a)))}},m=j.BufferedBlockAlgorithm=k.extend({reset:function(){this._data=i.create();
		this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=q.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var b=this._data,c=b.words,d=b.sigBytes,e=this.blockSize,f=d/(4*e),f=a?h.ceil(f):h.max((f|0)-this._minBufferSize,0),a=f*e,d=h.min(4*a,d);if(a){for(var g=0;g<a;g+=e)this._doProcessBlock(c,g);g=c.splice(0,a);b.sigBytes-=d}return i.create(g,d)},clone:function(){var a=k.clone.call(this);a._data=this._data.clone();return a},_minBufferSize:0});j.Hasher=m.extend({init:function(){this.reset()},
		reset:function(){m.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);this._doFinalize();return this._hash},clone:function(){var a=m.clone.call(this);a._hash=this._hash.clone();return a},blockSize:16,_createHelper:function(a){return function(b,c){return a.create(c).finalize(b)}},_createHmacHelper:function(a){return function(b,c){return r.HMAC.create(a,c).finalize(b)}}});var r=f.algo={};return f}(Math);
		(function(){var h=CryptoJS,i=h.lib.WordArray;h.enc.Base64={stringify:function(b){var e=b.words,f=b.sigBytes,c=this._map;b.clamp();for(var b=[],a=0;a<f;a+=3)for(var d=(e[a>>>2]>>>24-8*(a%4)&255)<<16|(e[a+1>>>2]>>>24-8*((a+1)%4)&255)<<8|e[a+2>>>2]>>>24-8*((a+2)%4)&255,g=0;4>g&&a+0.75*g<f;g++)b.push(c.charAt(d>>>6*(3-g)&63));if(e=c.charAt(64))for(;b.length%4;)b.push(e);return b.join("")},parse:function(b){var b=b.replace(/\s/g,""),e=b.length,f=this._map,c=f.charAt(64);c&&(c=b.indexOf(c),-1!=c&&(e=c));
		for(var c=[],a=0,d=0;d<e;d++)if(d%4){var g=f.indexOf(b.charAt(d-1))<<2*(d%4),h=f.indexOf(b.charAt(d))>>>6-2*(d%4);c[a>>>2]|=(g|h)<<24-8*(a%4);a++}return i.create(c,a)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}})();
		
	var md5 = function(val){
		var CryptoJS=CryptoJS||function(q,r){var k={},g=k.lib={},p=function(){},t=g.Base={extend:function(b){p.prototype=this;var j=new p;b&&j.mixIn(b);j.hasOwnProperty("init")||(j.init=function(){j.$super.init.apply(this,arguments)});j.init.prototype=j;j.$super=this;return j},create:function(){var b=this.extend();b.init.apply(b,arguments);return b},init:function(){},mixIn:function(b){for(var j in b)b.hasOwnProperty(j)&&(this[j]=b[j]);b.hasOwnProperty("toString")&&(this.toString=b.toString)},clone:function(){return this.init.prototype.extend(this)}},
		n=g.WordArray=t.extend({init:function(b,j){b=this.words=b||[];this.sigBytes=j!=r?j:4*b.length},toString:function(b){return(b||u).stringify(this)},concat:function(b){var j=this.words,a=b.words,l=this.sigBytes;b=b.sigBytes;this.clamp();if(l%4)for(var h=0;h<b;h++)j[l+h>>>2]|=(a[h>>>2]>>>24-8*(h%4)&255)<<24-8*((l+h)%4);else if(65535<a.length)for(h=0;h<b;h+=4)j[l+h>>>2]=a[h>>>2];else j.push.apply(j,a);this.sigBytes+=b;return this},clamp:function(){var b=this.words,j=this.sigBytes;b[j>>>2]&=4294967295<<
		32-8*(j%4);b.length=q.ceil(j/4)},clone:function(){var b=t.clone.call(this);b.words=this.words.slice(0);return b},random:function(b){for(var j=[],a=0;a<b;a+=4)j.push(4294967296*q.random()|0);return new n.init(j,b)}}),v=k.enc={},u=v.Hex={stringify:function(b){var a=b.words;b=b.sigBytes;for(var h=[],l=0;l<b;l++){var m=a[l>>>2]>>>24-8*(l%4)&255;h.push((m>>>4).toString(16));h.push((m&15).toString(16))}return h.join("")},parse:function(b){for(var a=b.length,h=[],l=0;l<a;l+=2)h[l>>>3]|=parseInt(b.substr(l,
		2),16)<<24-4*(l%8);return new n.init(h,a/2)}},a=v.Latin1={stringify:function(b){var a=b.words;b=b.sigBytes;for(var h=[],l=0;l<b;l++)h.push(String.fromCharCode(a[l>>>2]>>>24-8*(l%4)&255));return h.join("")},parse:function(b){for(var a=b.length,h=[],l=0;l<a;l++)h[l>>>2]|=(b.charCodeAt(l)&255)<<24-8*(l%4);return new n.init(h,a)}},s=v.Utf8={stringify:function(b){try{return decodeURIComponent(escape(a.stringify(b)))}catch(h){throw Error("Malformed UTF-8 data");}},parse:function(b){return a.parse(unescape(encodeURIComponent(b)))}},
		h=g.BufferedBlockAlgorithm=t.extend({reset:function(){this._data=new n.init;this._nDataBytes=0},_append:function(b){"string"==typeof b&&(b=s.parse(b));this._data.concat(b);this._nDataBytes+=b.sigBytes},_process:function(b){var a=this._data,h=a.words,l=a.sigBytes,m=this.blockSize,k=l/(4*m),k=b?q.ceil(k):q.max((k|0)-this._minBufferSize,0);b=k*m;l=q.min(4*b,l);if(b){for(var g=0;g<b;g+=m)this._doProcessBlock(h,g);g=h.splice(0,b);a.sigBytes-=l}return new n.init(g,l)},clone:function(){var b=t.clone.call(this);
		b._data=this._data.clone();return b},_minBufferSize:0});g.Hasher=h.extend({cfg:t.extend(),init:function(b){this.cfg=this.cfg.extend(b);this.reset()},reset:function(){h.reset.call(this);this._doReset()},update:function(b){this._append(b);this._process();return this},finalize:function(b){b&&this._append(b);return this._doFinalize()},blockSize:16,_createHelper:function(b){return function(a,h){return(new b.init(h)).finalize(a)}},_createHmacHelper:function(b){return function(a,h){return(new m.HMAC.init(b,
		h)).finalize(a)}}});var m=k.algo={};return k}(Math);
		(function(q){function r(a,m,b,j,g,l,k){a=a+(m&b|~m&j)+g+k;return(a<<l|a>>>32-l)+m}function k(a,m,b,j,g,l,k){a=a+(m&j|b&~j)+g+k;return(a<<l|a>>>32-l)+m}function g(a,m,b,j,g,l,k){a=a+(m^b^j)+g+k;return(a<<l|a>>>32-l)+m}function p(a,g,b,j,k,l,p){a=a+(b^(g|~j))+k+p;return(a<<l|a>>>32-l)+g}for(var t=CryptoJS,n=t.lib,v=n.WordArray,u=n.Hasher,n=t.algo,a=[],s=0;64>s;s++)a[s]=4294967296*q.abs(q.sin(s+1))|0;n=n.MD5=u.extend({_doReset:function(){this._hash=new v.init([1732584193,4023233417,2562383102,271733878])},
		_doProcessBlock:function(h,m){for(var b=0;16>b;b++){var j=m+b,n=h[j];h[j]=(n<<8|n>>>24)&16711935|(n<<24|n>>>8)&4278255360}var b=this._hash.words,j=h[m+0],n=h[m+1],l=h[m+2],q=h[m+3],t=h[m+4],s=h[m+5],u=h[m+6],v=h[m+7],w=h[m+8],x=h[m+9],y=h[m+10],z=h[m+11],A=h[m+12],B=h[m+13],C=h[m+14],D=h[m+15],c=b[0],d=b[1],e=b[2],f=b[3],c=r(c,d,e,f,j,7,a[0]),f=r(f,c,d,e,n,12,a[1]),e=r(e,f,c,d,l,17,a[2]),d=r(d,e,f,c,q,22,a[3]),c=r(c,d,e,f,t,7,a[4]),f=r(f,c,d,e,s,12,a[5]),e=r(e,f,c,d,u,17,a[6]),d=r(d,e,f,c,v,22,a[7]),
		c=r(c,d,e,f,w,7,a[8]),f=r(f,c,d,e,x,12,a[9]),e=r(e,f,c,d,y,17,a[10]),d=r(d,e,f,c,z,22,a[11]),c=r(c,d,e,f,A,7,a[12]),f=r(f,c,d,e,B,12,a[13]),e=r(e,f,c,d,C,17,a[14]),d=r(d,e,f,c,D,22,a[15]),c=k(c,d,e,f,n,5,a[16]),f=k(f,c,d,e,u,9,a[17]),e=k(e,f,c,d,z,14,a[18]),d=k(d,e,f,c,j,20,a[19]),c=k(c,d,e,f,s,5,a[20]),f=k(f,c,d,e,y,9,a[21]),e=k(e,f,c,d,D,14,a[22]),d=k(d,e,f,c,t,20,a[23]),c=k(c,d,e,f,x,5,a[24]),f=k(f,c,d,e,C,9,a[25]),e=k(e,f,c,d,q,14,a[26]),d=k(d,e,f,c,w,20,a[27]),c=k(c,d,e,f,B,5,a[28]),f=k(f,c,
		d,e,l,9,a[29]),e=k(e,f,c,d,v,14,a[30]),d=k(d,e,f,c,A,20,a[31]),c=g(c,d,e,f,s,4,a[32]),f=g(f,c,d,e,w,11,a[33]),e=g(e,f,c,d,z,16,a[34]),d=g(d,e,f,c,C,23,a[35]),c=g(c,d,e,f,n,4,a[36]),f=g(f,c,d,e,t,11,a[37]),e=g(e,f,c,d,v,16,a[38]),d=g(d,e,f,c,y,23,a[39]),c=g(c,d,e,f,B,4,a[40]),f=g(f,c,d,e,j,11,a[41]),e=g(e,f,c,d,q,16,a[42]),d=g(d,e,f,c,u,23,a[43]),c=g(c,d,e,f,x,4,a[44]),f=g(f,c,d,e,A,11,a[45]),e=g(e,f,c,d,D,16,a[46]),d=g(d,e,f,c,l,23,a[47]),c=p(c,d,e,f,j,6,a[48]),f=p(f,c,d,e,v,10,a[49]),e=p(e,f,c,d,
		C,15,a[50]),d=p(d,e,f,c,s,21,a[51]),c=p(c,d,e,f,A,6,a[52]),f=p(f,c,d,e,q,10,a[53]),e=p(e,f,c,d,y,15,a[54]),d=p(d,e,f,c,n,21,a[55]),c=p(c,d,e,f,w,6,a[56]),f=p(f,c,d,e,D,10,a[57]),e=p(e,f,c,d,u,15,a[58]),d=p(d,e,f,c,B,21,a[59]),c=p(c,d,e,f,t,6,a[60]),f=p(f,c,d,e,z,10,a[61]),e=p(e,f,c,d,l,15,a[62]),d=p(d,e,f,c,x,21,a[63]);b[0]=b[0]+c|0;b[1]=b[1]+d|0;b[2]=b[2]+e|0;b[3]=b[3]+f|0},_doFinalize:function(){var a=this._data,g=a.words,b=8*this._nDataBytes,j=8*a.sigBytes;g[j>>>5]|=128<<24-j%32;var k=q.floor(b/
		4294967296);g[(j+64>>>9<<4)+15]=(k<<8|k>>>24)&16711935|(k<<24|k>>>8)&4278255360;g[(j+64>>>9<<4)+14]=(b<<8|b>>>24)&16711935|(b<<24|b>>>8)&4278255360;a.sigBytes=4*(g.length+1);this._process();a=this._hash;g=a.words;for(b=0;4>b;b++)j=g[b],g[b]=(j<<8|j>>>24)&16711935|(j<<24|j>>>8)&4278255360;return a},clone:function(){var a=u.clone.call(this);a._hash=this._hash.clone();return a}});t.MD5=u._createHelper(n);t.HmacMD5=u._createHmacHelper(n)})(Math);
		(function(){var q=CryptoJS,r=q.enc.Utf8;q.algo.HMAC=q.lib.Base.extend({init:function(k,g){k=this._hasher=new k.init;"string"==typeof g&&(g=r.parse(g));var p=k.blockSize,q=4*p;g.sigBytes>q&&(g=k.finalize(g));g.clamp();for(var n=this._oKey=g.clone(),v=this._iKey=g.clone(),u=n.words,a=v.words,s=0;s<p;s++)u[s]^=1549556828,a[s]^=909522486;n.sigBytes=v.sigBytes=q;this.reset()},reset:function(){var k=this._hasher;k.reset();k.update(this._iKey)},update:function(k){this._hasher.update(k);return this},finalize:function(k){var g=
		this._hasher;k=g.finalize(k);g.reset();return g.finalize(this._oKey.clone().concat(k))}})})();
		return CryptoJS.MD5(val, { asString: true })
	}
		
window.kgId = function(id){
	return document.getElementById(id);
};
window.kgNames = function(name){
	return document.getElementsByName(name);
};

var k64 = "ABCDEFGHIJKLMNOPQRSTUVWXYzabcdefghijklmnopqrstuvwxyZ0123456789+/=";

var _encode = function(ori , ba64){
	if(ba64){
		var oribase = CryptoJS.enc.Base64._map;
		CryptoJS.enc.Base64._map = ba64;
		var str=CryptoJS.enc.Utf8.parse(ori);
		var rstr = CryptoJS.enc.Base64.stringify(str);
		CryptoJS.enc.Base64._map = oribase;
		return rstr;
	}else{
		var str=CryptoJS.enc.Utf8.parse(ori);
		return CryptoJS.enc.Base64.stringify(str);
	}
	
};
var _decode = function(ori){
	var words  = CryptoJS.enc.Base64.parse(ori);
	return words.toString(CryptoJS.enc.Utf8);
};

var $window = $(window);
var $document = $(document);



var html = document.documentElement;
var isTouch =  "ontouchend" in document ? true : false;

var isIE6 = !('minWidth' in html.style);
var isLosecapture = !isIE6 && 'onlosecapture' in html;
var isSetCapture = 'setCapture' in html;
var _IE = (!!window.ActiveXObject)?true:false;
var isMobile = 'createTouch' in document && !('onmousemove' in html)|| /(iPhone|iPad|iPod)/i.test(navigator.userAgent);


$.noop = $.noop || function () {};
var _path,_thisScript = null;

_hp = true ,
isArtAlert = true;
_path = window['signaturePhone'] || (function (script, i, me) {
	for (i in script) {
		if (script[i].src && script[i].src.indexOf('signaturePhone') !== -1 &&script[i].src.indexOf("dialog")==-1) {
			me = script[i];
			break;
		}
	};
	_thisScript = me || script[script.length - 1];
	me = _thisScript.src.replace(/\\/g, '/');
	return me.lastIndexOf('/') < 0 ? '.' : me.substring(0, me.lastIndexOf('/'));
}(document.getElementsByTagName('script')));
var _skin = _thisScript.src.split('skin=')[1];
_skin =(_skin && _skin!== 'null')?_skin: (_skin='default');

Array.prototype.sm_remove = function(dx) { 
    if(isNaN(dx)||dx>this.length){return false;} 
    this.splice(dx,1); 
};


var types = {
	click: isTouch ? 'touchend':'click',
    start: isTouch ? 'touchstart' : 'mousedown',
    over: isTouch ? 'touchmove' : 'mousemove',
    end: isTouch ? 'touchend' : 'mouseup'
};

var getEvent = isTouch ? function (event) {
    if (!event.touches) {
        event = event.originalEvent.touches.item(0);
    }
    return event;
} : function (event) {
    return event;
};


var DragEvent = function () {
    this.start = $.proxy(this.start, this);
    this.over = $.proxy(this.over, this);
    this.end = $.proxy(this.end, this);
    this.onstart = this.onover = this.onend = $.noop;
};

DragEvent.types = types;

DragEvent.prototype = {
    start: function (event) {
    	this.onstartbefore();
        event = this.startFix(event);
        $document
        .on(types.over, this.over)
        .on(types.end, this.end);
        this.onstart(event);
        return false;
    },

    over: function (event) {
        event = this.overFix(event);
        this.onover(event);
        return false;
    },

    end: function (event) {
        event = this.endFix(event);
        $document
        .off(types.over, this.over)
        .off(types.end, this.end);
        this.onend(event);
        return false;
    },

    startFix: function (event) {
        event = getEvent(event);
        this.target = $(event.target);
        this.selectstart = function () {
            return false;
        };
        $document
        .on('selectstart', this.selectstart)
        .on('dblclick', this.end);

        if (isLosecapture) {
            this.target.on('losecapture', this.end);
        } else {
            $window.on('blur', this.end);
        }

        if (isSetCapture) {
            this.target[0].setCapture();
        }
        return event;
    },

    overFix: function (event) {
        event = getEvent(event);
        return event;
    },

    endFix: function (event) {
        event = getEvent(event);

        $document
        .off('selectstart', this.selectstart)
        .off('dblclick', this.end);

        if (isLosecapture) {
            this.target.off('losecapture', this.end);
        } else {
            $window.off('blur', this.end);
        }

        if (isSetCapture) {
            this.target[0].releaseCapture();
        }

        return event;
    }
    
};


/**
 * 启动拖拽
 * @param   {HTMLElement}   被拖拽的元素
 * @param   {Event} 触发拖拽的事件对象。可选，若无则监听 elem 的按下事件启动
 */
DragEvent.create = function (elem, event) {
    var $elem = $(elem);
    var dragEvent = new DragEvent();
    var startType = DragEvent.types.start;
    var noop = function () {};
    var className = elem.className
        .replace(/^\s|\s.*/g, '') + '-drag-start';
    
    
   
    

    var minX;
    var minY;
    var maxX;
    var maxY;

    var api = {
        onstart: noop,
        onover: noop,
        onstartbefore:noop,
        ontap: noop,
        onend: noop,
        off: function () {
            $elem.off(startType, dragEvent.start);
        },
        setXY: function(X, Y){
           dragEvent.rangX = X;
           dragEvent.rangY = Y;
        }
    };
    

    var style = $elem[0].style;
    var elemid = $elem.attr('elemid');
    
    var dividEle = $(document.getElementById(elemid));
    var relavte = dividEle.css('position') === 'relative';
    
    var w = $elem.width();
    var h = $elem.height();
    
    var maxwidth = dividEle.width()-w;
    var maxheight = dividEle.height()-h;
    
    
    dragEvent.onstartbefore = function(){
		/*var elemid = $elem.attr('elemid');
		if(elemid && elem){
			var offset = $elem.offset();
			var parent = $elem.parent();
			if(!parent.is('body')){
				$elem.appendTo('body');
				$elem.offset(offset);
				parent.remove();
			}
			$elem.removeAttr('elemid');
			$elem.attr('temp_elemid',elemid);
		}*/
    };
    
    var marginLeft;
    var marginTop;
    var oriLeft;
	var oriTop ;
    
    if(dividEle.css('position') === 'relative'){
    	var offset = dividEle.offset();
    	oriLeft = offset.left;
   	 	oriTop = offset.top;
    }else{
    	 oriLeft = parseInt($elem.parent().css('left'));
    	 oriTop = parseInt($elem.parent().css('top'));
    }
    
    var w1 =  $elem.width();
    var h1 = $elem.height();
    
    var w =  $elem.parent()[0].scrollWidth;
    var h = $elem.parent()[0].scrollHeight;
    minX = 0;
    minY = 0;
    maxX = w-w1;
    maxY = h-h1;
    
    var newmarginLeft = marginLeft;
    var newmarginTop = marginTop;
    
    //console.log();
    //alert($elem.parent()[0].scrollHeight);
    dragEvent.onstart = function (event) {
        if(!relavte){
        	var isFixed = $elem.css('position') === 'fixed';
        	var dl = $document.scrollLeft();
            var dt = $document.scrollTop();
            var w = $elem.width();
            var h = $elem.height();

            minX = 0;
            minY = 0;
            maxX = isFixed ? $window.width() - w + minX : $document.width() - w;
            maxY = isFixed ? $window.height() - h + minY : $document.height() - h;

            var offset = $elem.offset();
            var left = this.startLeft = isFixed ? offset.left - dl : offset.left;
            var top = this.startTop = isFixed ? offset.top - dt  : offset.top;
            minX = minX-oriLeft;
            minY = minY-oriTop;

            marginLeft = parseInt($elem.css('marginLeft'));
            marginTop = parseInt($elem.css('marginTop'));
            //console.log(minX , maxX , minY , maxY , left);
            maxX = maxX -oriLeft;
            maxY = maxY -oriTop;
        }else{
        	maxX = dividEle.width()+w1/1.2;//修改签章拖动范围
            maxY = dividEle.height()+h1/2;

            minX = 0;
            minY = 0;
            
            marginLeft = parseInt($elem.css('marginLeft'));
            marginTop = parseInt($elem.css('marginTop'));
            //console.log(maxX , maxY,marginLeft , marginLeft);
        }
        
       
        this.clientX = event.clientX;
        this.clientY = event.clientY;

        $elem.addClass(className);
        this.moved = false;
    };
    
    dragEvent.onover = function (event) { 
        var left = event.clientX - this.clientX  + marginLeft;
        var top = event.clientY - this.clientY + marginTop;
        var style = $elem[0].style;
       
        
        left = Math.max(minX, Math.min(this.rangX == 0 ? maxX : this.rangX, left));//Math.max(minX, Math.min(maxX, left));
        top = Math.max(minY, Math.min(this.rangY == 0 ? maxX : this.rangY, top));//Math.max(minY, Math.min(maxY, top));

        style.marginLeft = (left) + 'px';
        style.marginTop = (top ) + 'px';
        api.onover.call(elem, event, left, top);
       
    };
    

    dragEvent.onend = function (event) {
        var left = parseInt($elem.css('marginLeft'));
        var top = parseInt($elem.css('marginTop'));
        $elem.removeClass(className);
        
        if((Math.abs(left - marginLeft)>6 || Math.abs(top-marginTop)>6)){
        	this.moved  = true;
        }
        //console.log(left, top,this.moved);
        api.onend.call(elem, event, left, top,this.moved);
        if(!this.moved){
        	api.ontap.call(elem, event);
        }
    };

    dragEvent.off = function () {
        $elem.off(startType, dragEvent.start);
    };

    if (event) {
        dragEvent.start(event);
    } else {
        $elem.on(startType, dragEvent.start);
    }

    return api;
};

function stringToHex(str){//转成16进制
	var val="";
		for(var i = 0; i < str.length; i++){

		if(val == ""){
			val = str.charCodeAt(i).toString(16);
		}
		else{
			val += str.charCodeAt(i).toString(16);
		}
		}
	return val;
	}

function getSeals(imgTag){
	var SMObj = document.getElementById("SMObj");
	try{
		var mResult = SMObj.LoadSignature(true);
		if (mResult != 0) {
			iSP._alertX('没有检测到电子钥匙盘！');
			return false;
		};
	}catch(e){
		iSP._alertX("请安装签章客户端！");
		return false;
	}
	
	for(var i=0;i<SMObj.SignCount;i++){
		var signObj = SMObj.HeadInformations(i);
		if(imgTag){
			if(signObj.ImgTag == imgTag){
				return signObj;
			}
		}else{
			return signObj;
		}
	}
	iSP._alertX('电子密钥盘没有印章！');
	return false;
	
}

function certCryptAPICtrl(_cspName){//获取密钥盘中公钥证书
	var cspName = "EnterSafe ePass3003 CSP v1.0";
	if(_cspName){
		cspName = _cspName;
	}
	var CryptAPICtrl = document.getElementById("CryptAPICtrl");
	try{
		CryptAPICtrl.KGCryptInitialize(cspName, "", 1, 0xf0000000);
	}catch (e) {
		iSP._alertX("请安装签章客户端！");
		return false;
	}
	var ctns = CryptAPICtrl.KGCryptGetContainers(0);
	var ctnArray = ctns.split("\n");		
	CryptAPICtrl.KGCryptFinalize(0);
	CryptAPICtrl.KGCryptInitialize(cspName, ctnArray[0], 1, 0);
	var keyspec = 2;
	var ret = CryptAPICtrl.KGCryptGetUserKey(2);
	if (ret){
		ret = CryptAPICtrl.KGCryptGetUserKey(1);
		if(!ret) keyspec = 1;
	}
	var cer = CryptAPICtrl.KGCryptExportKey(0, 1, 0);
	CryptAPICtrl.KGCryptFinalize(0);
	return cer;
}


function pdfsignCryptAPICtrl(hash,_cspName,pwd){//客户端数字签名
	var cspName = "EnterSafe ePass3003 CSP v1.0";
	if(_cspName){
		cspName = _cspName;
	}
	var CryptAPICtrl = document.getElementById("CryptAPICtrl");
	CryptAPICtrl.KGCryptInitialize(cspName, "", 1, 0xf0000000);
	var ctns = CryptAPICtrl.KGCryptGetContainers(0);
	var ctnArray = ctns.split("\n");		
	CryptAPICtrl.KGCryptFinalize(0);

	// 连接到相应的证书，默认获取第一个
	if(pwd){
		CryptAPICtrl.KGCryptInitialize(cspName, ctnArray[0], 1, 0x40);
		var mima =  stringToHex(pwd)+"00";
		CryptAPICtrl.KGCryptSetPin(mima,mima.length,32);
	}else{
		CryptAPICtrl.KGCryptInitialize(cspName, ctnArray[0], 1, 0);
	}
	
	var keyspec = 2;
	var ret = CryptAPICtrl.KGCryptGetUserKey(2);
	if (ret){
		ret = CryptAPICtrl.KGCryptGetUserKey(1);
		if(!ret) keyspec = 1;
	}
	
	var hashf = function(data11,len){
		/*------------------------start：可以循环调用-------------------------------*/
		// 需要签名数据的16进制
		var data = hash;
		//MD5: 0x00008003; SHA1: 0x00008004
		CryptAPICtrl.KGCryptCreateHash(0x00008004);
		CryptAPICtrl.KGCryptSetHashValue(data11, len);
		// 签名后的数据			
		var signedData = CryptAPICtrl.KGCryptSignHash(keyspec, 0);
		CryptAPICtrl.KGCryptDestroyHash();
		return signedData;
		/*------------------------结束：可以循环调用-------------------------------*/
	};
	var r;
	if(typeof(hash) === 'object'){
		r = [];
		for ( var i = 0; i < hash.length; i++) {
			var h =  hashf(hash[i],hash[i].length);
			if(h){
				r[i] = h;
			}else{
				break;
			}
			
		}
	}else{
		r = hashf(hash,hash.length);
	}
	CryptAPICtrl.KGCryptFinalize(0);
	return r;
}


function signCryptAPICtrl(hash,_cspName,pwd){//客户端数字签名
	var cspName = "EnterSafe ePass3003 CSP v1.0";
	if(_cspName){
		cspName = _cspName;
	}
	var CryptAPICtrl = document.getElementById("CryptAPICtrl");
	try{
		CryptAPICtrl.KGCryptInitialize(cspName, "", 1, 0xf0000000);
	}catch (e) {
		iSP._alertX("客户端未安装");
	}
	
	var ctns = CryptAPICtrl.KGCryptGetContainers(0);
	var ctnArray = ctns.split("\n");		
	CryptAPICtrl.KGCryptFinalize(0);

	if(pwd){
		CryptAPICtrl.KGCryptInitialize(cspName, ctnArray[0], 1, 0x40);
		var mima =  stringToHex(pwd)+"00";
		CryptAPICtrl.KGCryptSetPin(mima,mima.length,32);
	}else{
		CryptAPICtrl.KGCryptInitialize(cspName, ctnArray[0], 1, 0);
	}
	var keyspec = 2;
	var ret = CryptAPICtrl.KGCryptGetUserKey(2);
	if (ret){
		ret = CryptAPICtrl.KGCryptGetUserKey(1);
		if(!ret) keyspec = 1;
	}
	var data = hash;
	CryptAPICtrl.KGCryptCreateHash(0x00008004);
	CryptAPICtrl.KGCryptHashData(data, data.length);
		
	var signedData = CryptAPICtrl.KGCryptSignHash(keyspec, 0);
	CryptAPICtrl.KGCryptDestroyHash();
	CryptAPICtrl.KGCryptFinalize(0);
	return signedData;
}

function verifyCryptAPICtrl(signdata,oridata,cert,_cspName){
	var cspName = "Microsoft Enhanced Cryptographic Provider v1.0";
	var CryptAPICtrl = document.getElementById("CryptAPICtrl");
	try{
		CryptAPICtrl.KGCryptInitialize(cspName, "", 1, 0xf0000000);
	}catch (e) {
		iSP._alertX("客户端未安装");
	}
	CryptAPICtrl.KGCryptCreateHash(0x00008004);
	CryptAPICtrl.KGCryptHashData(oridata, oridata.length);
	CryptAPICtrl.KGCryptImportKey(cert, cert.length, 1);
	var r = CryptAPICtrl.KGCryptVerifySignHash(signdata, signdata.length);
	CryptAPICtrl.KGCryptDestroyHash();
	CryptAPICtrl.KGCryptFinalize(0);
	return r == 0?true:false;
}



var SignaturePhone = function(){
	this.defaults = {
		scale:100,
		deletable:true,
		display:undefined,
		backgroundImage : true,
		isGet : false,
		certDetail : true,
		zindex : 10,
		detail : true,
		crossDomain : undefined,
		encode:false,
		lock:true,
		fixed:true,
		drag:false,
		protectedHash:false,
		moveable:false,
		movecall:undefined,
		delcall:undefined,
		checkDataCallBack:undefined,
		checkOnce:false,
		skin:'default',
		zoom:1,
		delcallback:undefined,
		forceScale:false,
		skin:_skin,
		html5:false,
		cspName:"EnterSafe ePass3003 CSP v1.0"
	},
	this.urls = {
		checkUrl : "m-signature/CheckSignature",//\u9a8c\u8bc1\u8bf7\u6c42\u5730\u5740
		getImgUrl : "m-signature/GetSignImg",//\u83b7\u53d6\u7b7e\u7ae0\u56fe\u7247\u8bf7\u6c42\u5730\u5740
		runSignatureUrl : "m-signature/RunSignature",//\u6267\u884c\u7b7e\u7ae0\u8bf7\u6c42\u5730\u5740
		getSignatureByKeyUrl : "m-signature/GetSignatureByKey",//\u83b7\u53d6\u5370\u7ae0\u5217\u8868\u5730\u5740
		removeSignatureUrl : "m-signature/RemoveSignature",//\u5220\u9664\u7b7e\u7ae0
		delSignatureUrl : "m-signature/DelSignature",//\u5220\u9664\u7b7e\u7ae0
		
		getSignInfoUrl : "m-signature/GetSignInfo",//\u83b7\u53d6\u7b7e\u7ae0\u4fe1\u606f(\u5305\u62ec\u8bc1\u4e66\u4fe1\u606f)\u5730\u5740
		getSignaturesByDocument : "m-signature/GetSignaturesByDocument",//\u83b7\u53d6\u7b7e\u7ae0\u4fe1\u606f\u8bf7\u6c42\u5730\u5740
		runCertUrl : "m-signature/RunCert",//\u6570\u5b57\u7b7e\u540d\u8bf7\u6c42\u5730\u5740
		verifyCertUrl : "m-signature/VerifyCert",//\u9a8c\u8bc1\u8bc1\u4e66\u8bf7\u6c42\u5730\u5740
		verifySignUrl : "m-signature/VerifySign",//\u9a8c\u8bc1\u7b7e\u540d\u6570\u636e\u8bf7\u6c42\u5730\u5740
		changePwdUrl : "m-signature/ChangePwd",//\u4fee\u6539\u5bc6\u7801
		updateUrl : "m-signature/UpdateProp"
	};
	this._init();
};

SignaturePhone.fn = SignaturePhone.prototype = {
	loadjs:[],
	currentKeysn : undefined,
	spPATH : _path,
	isComplate : false,
	initComplate:false,
	signatures : [],
	geographyLocation  : [],
	signType : null ,
	isonlypdf :false,
	dialog : [],
	base64:false,
	init : function(config){
		var that = this;
		that.conf = config;
		var _default = that.defaults;
		for ( var key in _default) {
			if(config[key] !== undefined){
				_default[key] = config[key];
			}
		}
		if(_default.crossDomain && _default.crossDomain.substring(_default.crossDomain.length-1, _default.crossDomain.length)!="/"){
			_default.crossDomain += "/";
		}
		that._setUrl();
		
		var j_param = {
			documentId : config.documentId,
			xmlValue : config.xmlValue
		};
		if(config.signatureIds){
			j_param.signatureIds = config.signatureIds;
		}
		
		var loadJs = that._addRes(config);
		var _getSignature  = function (){
			if(that._checkJsObj(loadJs)){
				that._getSignaturesByDocument(j_param,config);
			}else{
				setTimeout(function(){_getSignature();},40);
			}
		};
		_getSignature();
		
	},
	
	_checkJsObj : function(js){
		for(var i=0;i<js.length;i++){
			try{
				eval(js[i]);
			}catch(e){
				return false;
			}
		}
		return true;
	},
	
	_$addRes:function(id,respath,type,name){
		if(!kgId(id)){
			var __script = document.createElement('script');
			__script.type = type;
			__script.id=id;
			__script.src = _path + respath;
			_thisScript.parentNode.insertBefore(__script, _thisScript);
		}
		return name;
	},
	
	_addRes: function(config){
		var that = this;
		//that.defaults.protectedHash &&(that.loadjs.push(that._$addRes("isp_md5", '/hmac-md5.js', 'text/javascript' ,'CryptoJS.MD5')));
		isArtAlert = false === config.aAlert?false:true;
		isArtAlert &&(that.loadjs.push(that._$addRes("isp_dialog_plugin", '/dialog/dialog.plugin.js', 'text/javascript' ,'artDialog.tips')));
		//that.loadjs.push(that._$addRes("isp_Base64", '/base64.js', 'text/javascript','CryptoJS'));
		return that.loadjs;
	},
	
	_getSignaturesByDocument : function (j_param,config){
		var that = this;
		that.ajax(that.urls.getSignaturesByDocument,j_param,function(data){
			if(data.error){
				that._alertX(data.errorMsg);return ;
			}
			///if(typeof(config.callback) != "undefined" && config.callback != null){
			//	config.callback.call(this, data);
			//}
			that.signType = data.signType || data.properties.signType;
			that.isonlypdf = data.signType || data.properties.signType;
			that.isonlypdf  = data.isonlypdf || data.properties.isonlypdf;
			config.currentKeysn?(that.currentKeysn = config.currentKeysn):(that.currentKeysn = data.currentKeySn ||data.properties.currentKeySn);
			if(data.properties.signatures&&data.properties.signatures.length>0){
				for ( var k = 0; k < data.properties.signatures.length; k++) {
					that._pushSignature(data.properties.signatures[k]);
				}
				var checkSignatureParams = {"signatures":data.properties.signatures};
				var siganture = data.properties.signatures[0];
				siganture.xmlValue?(checkSignatureParams.xmlValue=siganture.xmlValue):(checkSignatureParams.protectedData = siganture.protectedData);
				config.callback&&(checkSignatureParams.callback=config.callback);
				that.checkSignature(checkSignatureParams);
			}
		}
	);
	},
	
	_getDialog : function(action){
		var that = this;
		try{
			var dialogId = action.getAttribute("winId");
			return artDialog.list[dialogId];
		}catch(e){
			return that.dialog;
		}
	},
	
	_bind : function(){
		var that = this;
		$(document).on(types.click,".kg_signVerify",function(){
			
			that.signVerify(this);
			return false;
		});
		$(document).on(types.click,".kg_certVerify",function(){
			that.certVerify(this);
			return false;
		});
		$(document).on(types.click,".kg_removeSignature",function(){
			 var dialog = that._getDialog(this);
			 var $signatureDiv = dialog.config.signatureDiv;
			 var signatureId = $signatureDiv.attr("signatureId");
			 var signature = that._getSigngaturesBySignatureId(signatureId)[0];
			
			 that._delSignatureWin(this);
			 return false;
			
		});
		$(document).on(types.click,".kg_delSignature",function(){
			that._delSignature(this);
			return false;
		});
		
		$(document).on(types.click,".kg_runCert",function(){
			that.runCert(this);
			return false;
		});
		$(document).on(types.click,".kg_close", function(){
			var dialog = artDialog.list[this.getAttribute("winId")];
			if(dialog){
				that.winClose(dialog);
			}
			return false;
		});
		
		var a = function(b, c) {
			c.preventDefault();
			var b_parent =b.parent("li");
			b_parent.siblings("li").removeClass("kg_current");
			b_parent.addClass("kg_current");
			var d = $("#"+b.parent("li").attr("id")+"Detail").removeClass("kg_none");
			d.siblings().addClass("kg_none");
			var height = $(".kg_content").height();
			//alert(that.dialog.config.width);
			that.dialog.size(that.dialog.config.width,height);
		};
		$(document).on(types.click,".kg_tab_a", function(c) {
				var b = $(this);
				a(b, c);
			}
		);
		$(document).on(types.click,".kg_runSignature", function() {
				var dialog = that._getDialog(this);
				dialog.target = true;
				var ps = dialog.config.kgparam;
				var dom = dialog.config.kgdom;

				dom.signSN=dom.signnameSelect.val();
				dom.signVal = kgId(dom.signSN).getAttribute("signname");
				if(dom.pwdInput){
					dom.keypassword=dom.pwdInput.val();
				}
				that._runSignature(dialog);
			}
		);
		$(document).on(types.click,".kg_changePwd", function() {
				var newPwd = kgId("kg_newpwdInput").value;
				if(newPwd == ''){
					that._alertX("\u65b0\u5bc6\u7801\u4e0d\u80fd\u4e3a\u7a7a\uff01");
					return false;
				}
				if(newPwd.length<4){
					that._alertX("\u65b0\u5bc6\u7801\u957f\u5ea6\u4e0d\u80fd\u5c0f\u4e8e4\u4f4d\u6570\uff01");
					return false;
				}
				if(newPwd !== kgId("kg_confirmPwdInput").value){
					that._alertX("\u4e24\u6b21\u8f93\u5165\u7684\u5bc6\u7801\u4e0d\u5339\u914d\uff01");
					return false;
				}
		    	that._changePwdCallBack(this);
			}
		);
	},
	
	_tipX:function(id,msg){
		this._alertX(msg);
	},
	
	_getProtectedData: function(old_pd,needDesc,signature){
		var getVal = function(element){
			var val = '';
			if(element){
				var $e = $(element);
				if($e.is('input')){
					val = element.value;
				}else if($e.is('textarea')){
					if(signature && signature.signature && signature.signature.appName && signature.signature.appName.indexOf('JXKG')==-1){
						var appname = signature.signature.appName;
						var isie8above = appname.indexOf('/5.0')!=-1 || appname.indexOf('/4.0')!=-1 || appname.indexOf('/3.0')!=-1 || appname.indexOf('SLCC2')!=-1;
						var mode8above = document.documentMode==undefined?true:document.documentMode>8;
						
						//alert(document.documentMode);
						//alert(mode8above+":"+isie8above);
						if(mode8above && isie8above){
							val = element.value.replace(/\n/ig,"\r\n");
							//val = '\r'+element.value;
						}else{
							val = element.value;
						}
					}else{
						var test = element.value;
						test=test.replace(/\r\n/ig,"\n")  
						test=test.replace(/\n/ig,"\r\n");
						val = test;
					}
				}else{
					val = $e.text();
				}
			}
			return val;
		};
		
		var getDesc = function(element,fieldname){
			if(!element){
				return fieldname;
			}
			var desc = fieldname;
			try{
				desc = element.getAttribute('desc');
				if(!desc){
					desc = fieldname;
				}
			}catch(e){}
			return desc;
		};
		
		var protectedDatas = [];
		for(var i = 0; i<old_pd.length;i++){
			var pd={};
			
			pd.fieldName = old_pd[i].fieldName;
			if(old_pd[i].fieldName.indexOf('hash') == 0 ){
				pd.fieldDesc = "";
				var desc = old_pd[i].fieldDesc;
				if(typeof(desc) == 'string'){
					desc = desc.split(',');
				}
				var val = "";
				for ( var z = 0; z < desc.length; z++) {
					var field = desc[z];
					var element = kgId(field) || kgNames(field)[0];
					if(z>0){
						val+="@@br@@";
						pd.fieldDesc+=",";
					}
					pd.fieldDesc += field;
					val+= getVal(element);
				}
				var digestString = md5(val).toString();
				
				pd.fieldValue = digestString;
			}else{
				pd.fieldDesc = old_pd[i].fieldDesc;
				if(!old_pd[i].fieldValue){
					var element = kgId(old_pd[i].fieldName) || kgNames(old_pd[i].fieldName)[0];
					pd.fieldValue = getVal(element);
					if(needDesc && !old_pd[i].fieldDesc){
						pd.fieldDesc = getDesc(element,old_pd[i].fieldName);
					}
				}else{
					pd.fieldValue = old_pd[i].fieldValue;
				}
			}
			protectedDatas.push(pd);
	   }
	   return protectedDatas;
	},	
	
	
	deleteSignature:function(_ps){
		var that = this;
		var dialog = arguments[1];
		that.ajax(that.urls.delSignatureUrl,_ps,
				function(_data){
					that.winClose();
					if(!_data.error) {
		 				var _propeties=_data.properties;
		 				if(_propeties.signatureId){
		 					that._removeSignaturesBySignatureId(_propeties.signatureId);
		 					$("div[signatureid='"+_propeties.signatureId+"']").remove();
		 				}
		 				
					}
			 		if(!_ps.callback){
			 			if(_data.error) {
			 				if(dialog){
			 					dialog.show();
			 				}
			 				that._alertX(_data.errorMsg,function(){
			 					$('#kg_pwdInput').focus();
			 				}); 
						}
			 		}else {
			 			_ps.callback(_data);
			 		}
				},false
			);
	},
	
	

	checkSignature : function (_params){
		var that = this;
		var signatures_tmp=_params.signatures;
		signatures_tmp || (signatures_tmp = that.signatures);
		that.loadinit = {};
		if(signatures_tmp.length>0){
			for ( var i = 0; i < signatures_tmp.length; i++) {
				that.loadinit[signatures_tmp[i].signatureId] = true;
			}
			
			var needCheckParams = new Array();
			for ( var i = 0; i < signatures_tmp.length; i++) {
				var signatureDiv = "signDiv"+signatures_tmp[i].signatureId+";"+signatures_tmp[i].documentId+";"+signatures_tmp[i].signatureId;
				var submit_params = {"signatures":signatureDiv};
				if(_params.xmlValue && 'undefined' === _params.xmlValue){
					submit_params.xmlValue=_params.xmlValue;
				}else{
					if(that.defaults.checkDataCallBack){
						var protectedData_1 = [];
						for(var k=0;k<signatures_tmp[i].signature.protectedData.length;k++){
							var data = signatures_tmp[i].signature.protectedData[k];
							protectedData_1.push({
								"fieldName":data.fieldName,
								"fieldDesc":data.fieldDesc
							});
						}
						var protectedDatas = that.defaults.checkDataCallBack(protectedData_1);
						submit_params.protectedData = that.jsonToString(protectedDatas);
					} else {
						var protectedDatas = that._getProtectedData(signatures_tmp[i].signature.protectedData,false,signatures_tmp[i]);
						submit_params.protectedData = that.jsonToString(protectedDatas);
					}
				}
				needCheckParams.push(submit_params);
			}
			
			if(!that.defaults.checkOnce){
				for(var i=0;i<needCheckParams.length;i++){
					var submit_params = needCheckParams[i];
					that.ajax(that.urls.checkUrl,submit_params,
						function(data){
							that._checkSignatureCallback(data,_params.callback);
						},true);
				}
			} else {
				var submit_params = {"checkOnce":"true","needCheckParams":that.jsonToString(needCheckParams)};
				that.ajax(that.urls.checkUrl,submit_params,
						function(data){
							that._checkSignatureCallback(data,_params.callback);
						},true);
			}
		}else{
			_params.callback && _params.callback(true);
		}
		
	},

	
	_init : function(config){
		var that = this;
		that._ready();
		that._addTemplate();
		that._addEventPos();
		that._bind();
		return that;
	},
	
	_addTemplate :function (){
		var that = this;
		var kt = null;
		if(that.templates === undefined){
			kt = setTimeout(function(){
				that._addTemplate();
			},40);
		}else{
			that.isComplate = true;
			if(that.defaults.detail){
				that._addDetail();
			}
			clearTimeout(kt);
		}
	},
	_addDetail : function(){
		var that = this;
	},
	
	_getDOM : function (html,hideEl){
		var id = new Date().getTime();
		var that  = this;
		var wrap = document.createElement('div');
		wrap.id=id;
		wrap.innerHTML = html;
		var name, i = 0,
			DOM = {wrap: $(wrap)},
			els = wrap.getElementsByTagName('*'),
			elsLen = els.length;
		for (; i < elsLen; i ++) {
			var elsId = els[i].id;
			name = elsId.indexOf("kg_");
			var key = elsId.substring(name+3);
			var $el = $(els[i]);
			if(hideEl&&hideEl.length>0){
				var z = jQuery.inArray( key, hideEl );
				if(z!=-1){
					$el.hide();
				}
			}
			if (name>-1) {
				DOM[key] = $el;
			}
		};
		that.dialog.content(wrap); 
		return DOM;
	},

	getSignInfo : function (ps){
		var that = this;
		if(!ps.signatures){
			ps.signatures = that.signatures;
		}
		if(ps.signatures.length>0){
			var _signatures=ps.signatures;
			var signatureDivs=[];
			for ( var i = 0; i < _signatures.length; i++) {
				var signatureDiv = "signDiv"+_signatures[i].signatureId+";"+_signatures[i].documentId+";"+_signatures[i].signatureId+";"+_signatures[i].signature.divId;
				signatureDivs.push(signatureDiv);
			}
			var submit_params={"signatures":signatureDivs.join(",")};
			that.ajax(that.urls.getSignInfoUrl,
				submit_params,
				function(_data){
					if(ps.callback){
						ps.callback(_data,ps,that);
					}else{
						if(!_data.error) {
							var _signatures=(_data.properties.signatures);
							var alertMsg="";
								for ( var i=0; i< _signatures.length;i++) {
									if(_signatures!="null"){
										if(i!=0){
											alertMsg+="\r\n\r\n";
										}
										alertMsg+="\u7b7e\u7ae0\uff1a"+_signatures[i].signName+"\r\n";
										alertMsg+="\u7b7e\u7ae0IP\uff1a"+_signatures[i].signatureIp+"\r\n";
										alertMsg+="\u7528\u6237\u540d\uff1a"+_signatures[i].userName+"\r\n";
										alertMsg+="\u5355\u4f4d\u540d\u79f0\uff1a"+_signatures[i].signName+"\r\n";
										alertMsg+="\u7b7e\u7ae0\u5e8f\u53f7\uff1a"+_signatures[i].signSn+"\r\n";
										alertMsg+="\u7b7e\u7ae0\u65f6\u95f4\uff1a"+_signatures[i].datetime+"\r\n";
									}
								}
								that._alertX(alertMsg);
						}else{
							that._alertX(_data.errorMsg); 
						}
					}
				}
			);
		}
	},
	
	_removeSignaturesBySignatureId : function(signatureId){
		var that =this;
		if(that.signatures.length>0){
			for ( var i = 0; i < that.signatures.length; i++) {
				var _signature = that.signatures[i];
				if(_signature.signatureId == signatureId){
					that.signatures.sm_remove(i);
					return true;
				}
			}
		}
		return false;
	},
	
	_getSigngaturesBySignatureId : function(signatureId){
		var that =this;
		var _signatureA = [] ;
		if(that.signatures.length>0){
			for ( var i = 0; i < that.signatures.length; i++) {
				var _signature = that.signatures[i];
				if(_signature.signatureId == signatureId){
					_signatureA.push(_signature);
					break;
				}
			}
		}
		return _signatureA;
	},
	
	getCert:function(){
		return certCryptAPICtrl(this.defaults.cspName);
	},
	
	getSeal:function(imgtype){
		return getSeals(imgtype);
	},

	_addEventPos : function (){
		var resizeTimer = null;
		var that =this;
		that._winResize = function () {
			resizeTimer && clearTimeout(resizeTimer);
			resizeTimer = setTimeout(function () {
				that._position();
			}, 40);
		};
		$window.bind('resize', this._winResize);
	},
	
	_position: function () {
		jQuery(".signatureKeysnDiv").each(
			function(i){
				var that = $(this);
				var divId = that.attr("divId");
				if(divId!=null && divId!='null'&&divId!=''&&that.css("float")!=='left'){
					var $div = $("#"+divId).offset();
					that.css({"left":$div.left,"top" : $div.top});
				}
			}
		);
	},
	
	addEvent : function(signaturedata,signDiv){
		var that = this;
		var movecall = that.defaults.movecall;
		if(that.defaults.moveable && signaturedata.enableMove !== '0'){
 			var api = DragEvent.create(signDiv);
                        api.setXY(that.RangeX, that.RangeY);
	 		if(that.defaults.detail){
	 			//alert();
		 		api.ontap = function(event){
		 			that._showDetail($(this));
		 		};
		 		
		 		api.onend = function(event,left ,top , moved , relateve){
		 			if(moved){
		 				var elem = $(this);
		 				var l = left;
		 				var t = top;
			 			if(movecall && movecall.onsavebefore){
			 				movecall.onsavebefore.call(elem,event,left ,top);
				 		}
			 			var ele = elem.attr('temp_elemid');
			 			var removeprop = "";
			 			if(ele){
			 				ele = $('#'+ele);
			 				
			 				var el = ele.offset().left;
			 				var et = ele.offset().top;
			 				l = left-el;
			 				t = top-et;
			 			}else{
			 				
			 			}
			 			//console.log('update	' , left ,top );
			 			var prop = 'StyleLeft='+l+',StyleTop='+t;
			 			prop = encodeURI(_encode(prop));
			 			
			 			 var _param = {
			 					'documentId':elem.attr("documentId"),
			 					'signatureId':elem.attr("signatureId"),
			 					'prop':prop,
			 					'removeprop':removeprop
			 			};
			 			that.ajax(that.urls.updateUrl, _param, function(data){
			 				if(movecall && movecall.onsaveafter){
				 				movecall.onsaveafter.call(elem,data);
					 		}
			 			});
		 			}
		 		};
	 		}
 		}else{
 			if(that.defaults.detail){
 				$(signDiv).click(function(){
 					that._showDetail($(this));
 				});
 			}
 		}
	},
	


	_checkSignatureCallback : function (_data,callback){
		var that = this;
		if(!_data.error) { 
			var _propeties=_data.properties;
			for ( var signDivId in _propeties) {
				that._pushSignature(_propeties[signDivId]);
				var signaturedata = _propeties[signDivId];
				var signdiv = that._showImg(signaturedata,signaturedata.signature.elemId);
				that.addEvent(signaturedata,signdiv);
				if(signaturedata.DivList){
					var list =  signaturedata.DivList.split(";");
					for ( var i = 0; i < list.length; i++) {
						var eleId = list[i];
						signdiv = that._showImg(signaturedata,eleId);
						that.addEvent(signaturedata,signdiv);
					}
				}
				delete that.loadinit[signaturedata.signatureId]
			}
			
	 		if(callback){
	 			var size = 0;
	 			for(var key in that.loadinit){
	 				size++;
	 			}
	 			callback(size ==0 , _data);
	 		}
	 	}else{
	 		that._alertX("\u7b7e\u7ae0\u9a8c\u8bc1\u51fa\u73b0\u5f02\u5e38:"+_data.errorMsg); 
	 	}
	 },
	 
	 signVerify : function (action){
		 var that = this;
		 var dialog = that._getDialog(action);
		 var $signatureDiv = dialog.config.signatureDiv;
		 var signatureId = $signatureDiv.attr("signatureId");
		 var signature = that._getSigngaturesBySignatureId(signatureId)[0];
		 var __xmlValue=signature.xmlValue;
		 if(__xmlValue ||__xmlValue === null){
			 __xmlValue = "";
		 }
		 var pd =that._getProtectedData(signature.signature.protectedData,false,signature);
		 var _param = {
			documentId:signature.documentId,
			signatureId:signature.signatureId,
			protectedData:that.jsonToString(pd),
			xmlValue:__xmlValue
		};
		if($signatureDiv.data('mode') == '1'){
			var protectedData = that.jsonToString(pd);
			var re =  verifyCryptAPICtrl($signatureDiv.data('signdata'),protectedData,$signatureDiv.data('certdata'),that.defaults.cspName);
			var data = {};
			data.error = !re;
			data.errorMsg = re?'签名数据验证正常！':'签名数据被篡改！';
			that._signVerifyCall(data,dialog,signature);
		}else{
			that.ajax(that.urls.verifySignUrl,_param,
				function(data){
					if(_param.callback){
						_param.callback(data);
					}else{
						that._signVerifyCall(data,dialog,signature);
					}
				},true
			);
		}
	 },

	 runCert : function (action){
		var that = this;
		var dialog = that._getDialog(action);
		var $signatureDiv = dialog.config.signatureDiv;
		var signatureId = $signatureDiv.attr("signatureId");
		var signature = that._getSigngaturesBySignatureId(signatureId)[0];
		var _param = {
			documentId:signature.documentId,
			keySN:signature.signature.keySn,
			signSN:signature.signature.signSn,
			signVal:signature.signature.signName,
			signatureId:signature.signatureId
		};
		that.ajax(that.urls.runCertUrl,_param,
			function(data){
				if(_param.callback){
					_param.callback(data);
				}else{
					that._alertX(data.errorMsg);
				}
				if(!data.error && dialog){
					that.winClose();
				}
			},true
		);
	 },

	 certVerify : function (action){
		 var that = this;
		 var dialog = that._getDialog(action);
		 var $signatureDiv = dialog.config.signatureDiv;
		 var signatureId = $signatureDiv.attr("signatureId");
		 var signature = that._getSigngaturesBySignatureId(signatureId)[0];
		 var _param = {
			documentId:signature.documentId,
			signatureId:signature.signatureId
		};
		that.ajax(that.urls.verifyCertUrl,_param,
			function(data){
				if(_param.callback){
					_param.callback(data);
				}else{
					that._verifyCertCall(data,dialog,signature);
				}
			},true
		);
	 },
	 _showImg : function (data,elemId){
			var that = this;
			var _data = data.signature;
			var bgObjDiv;
			var unique = data.signatureId;
			if((elemId)){
				unique = data.signatureId+"_"+ elemId;
			}
			
			if(typeof(that.conf.cbData) != "undefined" || that.conf.cbData != null){
				that.conf.cbData.call(this, data);
				unique = data.signatureId+"_"+ data.signature.elemId;
				elemId = data.signature.elemId;
			}
			
			_data.imgWidth = parseInt(_data.imgWidth)*(that.defaults.scale/100);
			_data.imgHeight = parseInt(_data.imgHeight)*(that.defaults.scale/100);
			_data.styleLeft = _data.styleLeft < 0 ? 0 : _data.styleLeft;
			bgObjDiv = kgId('signDiv'+unique);
			if(!bgObjDiv){
				bgObjDiv = document.createElement("div"); 
				var $bgObjDiv = $(bgObjDiv);
				$bgObjDiv.attr({
					'id':'signDiv'+unique ,
					'keysn':data.signature.keySn ,
					'documentid' : data.documentId,
					'signatureid': data.signatureId,
					'signname': data.signature.signName,
					'styleZindex': that.defaults.zindex + parseInt(_data.signatureOrder)
					});
				//alert( _data.styleLeft +":"+_data.styleTop);
				//console.log(  _data.styleLeft , _data.styleTop)
				$bgObjDiv.css({
					'display':'none',
					'position' : "absolute",
					'width': _data.imgWidth,
					'height': _data.imgHeight,
					'marginTop': _data.styleTop+'px',
					'marginLeft': _data.styleLeft+'px'
					});
				var parent = $('body');
				var mychild = $bgObjDiv;
				if(elemId!= null&&elemId!= '' && kgId(elemId)){
					$bgObjDiv.addClass("signatureImgDiv").attr('elemid',elemId);
					var $keySNDiv = $("#"+elemId);
					if(($keySNDiv.css("display") === "inline-block")){
						$bgObjDiv.css({"top" : $keySNDiv.offset().top,"left" : $keySNDiv.offset().left,"zIndex":$bgObjDiv.attr("styleZindex"),"marginTop":_data.styleTop+"px","marginLeft":_data.styleLeft+"px"});
					}else{
						if($keySNDiv.css('position') === 'absolute'){
							var $signatureDiv = $('<div id="p_signature_div' + unique + '" ></div>');
							mychild = $signatureDiv;
							$signatureDiv.append($bgObjDiv);
							$signatureDiv.attr("divId", elemId).addClass("signatureKeysnDiv").attr("signatureid",data.signatureId).css({
								"top" : $keySNDiv.offset().top,
								"left" : $keySNDiv.offset().left,
								"position":'absolute',
								"zIndex" :  $bgObjDiv.attr("styleZindex"),
								"width" : _data.imgWidth,
								"height" : _data.imgHeight
							});
							$bgObjDiv.css({
								'display':'block',
								'position' : "static"
								});
						}else{
							/*if(_IE){
								//$("body").append('<div id="p_signature_div' + unique + '" ></div>');
								var $signatureDiv = $('<div id="p_signature_div' + unique + '" ></div>');
								mychild = $signatureDiv;
								$signatureDiv.append($bgObjDiv);
								$signatureDiv.attr("divId", elemId).addClass("signatureKeysnDiv").attr("signatureid",data.signatureId).css({
									"top" : $keySNDiv.offset().top,
									"left" : $keySNDiv.offset().left,
									"zIndex" : $bgObjDiv.attr("styleZindex"),
									"marginLeft" : _data.styleLeft+'px',
									"marginTop" : _data.styleTop+'px',
									"position" : "absolute",
									"width" : _data.imgWidth,
									"height" : _data.imgHeight
								});
							}else{*/
								//parent = $keySNDiv;
								if(that.conf.signImgPosition && document.getElementsByClassName(that.conf.signImgPosition).length>0){
									//$("."+that.conf.signImgPosition).css("position","relative");
									parent = $("."+that.conf.signImgPosition);
								}else{
									parent = $keySNDiv;
								}
								
								//$keySNDiv.append('<div id="p_signature_div' + unique + '" signatureid="'+data.signatureId+'" ></div>');
								
							/*}*/
							
							if($keySNDiv.css('position') === 'relative'){
								var w =  $keySNDiv[0].scrollWidth-_data.imgWidth<0?+_data.imgHeight:$keySNDiv[0].scrollWidth-_data.imgWidth;
							    var h = $keySNDiv[0].scrollHeight-_data.imgHeight<0?+_data.imgHeight:$keySNDiv[0].scrollHeight-_data.imgHeight;
							    mychild = $bgObjDiv;
								$bgObjDiv.css({
									"top" :'0px',
									"left" :'0px',
									'marginLeft':parseInt(_data.styleLeft)+'px',
									'marginTop':parseInt(_data.styleTop)+'px'
									});
								
							}else{
								var $signatureDiv = $('<div id="p_signature_div' + unique + '" signatureid="'+data.signatureId+'" ></div>');
								mychild = $signatureDiv;
								$signatureDiv.append($bgObjDiv);
								/*if(!_IE){
									$signatureDiv.attr("divId", elemId).addClass("signatureKeysnDiv").css({
										"width" : _data.imgWidth + "px",
										"height" : _data.imgHeight + "px"
									});
								}*/
								$signatureDiv.attr("divId", elemId).addClass("signatureKeysnDiv").css({
									"zIndex" : $bgObjDiv.attr("styleZindex")
								});
								
								if(that.defaults.display == "float"){
									var childs =$keySNDiv.children(".signatureKeysnDiv");
									var maxHeight = $signatureDiv.height();
									childs.each(function(){
										var that = jQuery(this);
										maxHeight = that.height()>maxHeight?that.height():maxHeight;
									});
									childs.height(maxHeight);
		
									$keySNDiv.height("auto");
									$signatureDiv.css({"float" : "left"});
								}else{
									var $offset = that._offsetParent($keySNDiv);
									if($offset){
										$signatureDiv.css({"top" : $offset.top,"left" : $offset.left});
									}else{
										$signatureDiv.css({"top" : $keySNDiv.offset().top,"left" : $keySNDiv.offset().left});
									}
									$signatureDiv.css({
										"position" : "absolute"});
								}
							}
						}
					}
					
				}else{
					$bgObjDiv.addClass("signatureImgDiv").css({"zIndex":$bgObjDiv.attr("styleZindex"),"top":_data.styleTop+"px","left":_data.styleLeft+"px"});
					
				}
				if(parent.is('body')){
					var ml = parseInt(mychild.css('marginLeft'),10);
					var mt = parseInt(mychild.css('marginTop'),10);
					mychild.css('marginLeft','').css('marginTop','').css('left',parseInt(mychild.css('left'),10)+ml).css('top',parseInt(mychild.css('top'),10)+mt);
				}
				parent.append(mychild);
			}
			
			var $bgObjDiv = $(bgObjDiv);
			
			$bgObjDiv.attr({'ismodified': data.isModified, "modifiedData" : data.modifiedData});
			that._showImage($bgObjDiv , data,_data.imgWidth , _data.imgHeight);
			bgObjDiv.style.display = 'block';
			return bgObjDiv;
	 },
	 
	 _showImage : function ($bgObjDiv, data , width , height) { 
		 var that = this;
		 var id = "img"+$bgObjDiv.attr("id");
		 $("#"+id).remove();
		 var src = null;
		 if(data.signatureTime){
			 data.signatureTime = data.signatureTime.replace(/\+/g,'%2B');
			 src = that.urls.getImgUrl+"?signatureTime="+data.signatureTime+"&documentId="+data.documentId+"&signatureId="+data.signatureId+"&time="+new Date().getTime();
		 }else{
			 src = "data:image/png;base64,"+data.signatureImgData;
		 }
		 var canvas = document.createElement('canvas');
		 if(false){
			 canvas.setAttribute("id",id);
			 canvas.height = height;
			 canvas.width = width;
			 var ctx = canvas.getContext('2d');
			 var img = new Image();
			 img.src = src;
			 img.onload = function(){
				ctx.drawImage(img, 0, 0, canvas.width,canvas.height);
	         };
			 $bgObjDiv.append(canvas);
		 }else{
			 var zzcHTML;
			 if(isIE6){
				 zzcHTML = "<span id='zzc_"+id+"' style=\"width:" + width + "px; height:" + height + "px;display:inline-block;"  
					+ "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"  
					+ _path + "/dialog/skins/blank.png', sizingMethod='crop');\"></span>";
			   var strNewHTML = "<span id='"+id+"' style=\"width:" + width + "px; height:" + height + "px;display:inline-block;"  
								+ "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"  
								+ src + "', sizingMethod='crop');\"></span>";
			   $bgObjDiv.append(strNewHTML);
			}else{
				zzcHTML = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAMAAAAoyzS7AAADAFBMVEUAAAAAADMAAGYAAJkAAMwAAP8AMwAAMzMAM2YAM5kAM8wAM/8AZgAAZjMAZmYAZpkAZswAZv8AmQAAmTMAmWYAmZkAmcwAmf8AzAAAzDMAzGYAzJkAzMwAzP8A/wAA/zMA/2YA/5kA/8wA//8zAAAzADMzAGYzAJkzAMwzAP8zMwAzMzMzM2YzM5kzM8wzM/8zZgAzZjMzZmYzZpkzZswzZv8zmQAzmTMzmWYzmZkzmcwzmf8zzAAzzDMzzGYzzJkzzMwzzP8z/wAz/zMz/2Yz/5kz/8wz//9mAABmADNmAGZmAJlmAMxmAP9mMwBmMzNmM2ZmM5lmM8xmM/9mZgBmZjNmZmZmZplmZsxmZv9mmQBmmTNmmWZmmZlmmcxmmf9mzABmzDNmzGZmzJlmzMxmzP9m/wBm/zNm/2Zm/5lm/8xm//+ZAACZADOZAGaZAJmZAMyZAP+ZMwCZMzOZM2aZM5mZM8yZM/+ZZgCZZjOZZmaZZpmZZsyZZv+ZmQCZmTOZmWaZmZmZmcyZmf+ZzACZzDOZzGaZzJmZzMyZzP+Z/wCZ/zOZ/2aZ/5mZ/8yZ///MAADMADPMAGbMAJnMAMzMAP/MMwDMMzPMM2bMM5nMM8zMM//MZgDMZjPMZmbMZpnMZszMZv/MmQDMmTPMmWbMmZnMmczMmf/MzADMzDPMzGbMzJnMzMzMzP/M/wDM/zPM/2bM/5nM/8zM////AAD/ADP/AGb/AJn/AMz/AP//MwD/MzP/M2b/M5n/M8z/M///ZgD/ZjP/Zmb/Zpn/Zsz/Zv//mQD/mTP/mWb/mZn/mcz/mf//zAD/zDP/zGb/zJn/zMz/zP///wD//zP//2b//5n//8z///8SEhIYGBgeHh4kJCQqKiowMDA2NjY8PDxCQkJISEhOTk5UVFRaWlpgYGBmZmZsbGxycnJ4eHh+fn6EhISKioqQkJCWlpacnJyioqKoqKiurq60tLS6urrAwMDGxsbMzMzS0tLY2Nje3t7k5OTq6urw8PD29vb8/PwgKWLDAAAAAXRSTlMAQObYZgAAAApJREFUeNpjYAAAAAIAAeUn3vwAAAAASUVORK5CYII=" width="'+width+'px" height="'+height+'px" ></img>';
				$bgObjDiv.append("<img id='"+id+"'  src='"+src+"' width='"+width+"px' height='"+height+"' style='width:"+width+";height:"+height+"' ></img>");
		    }
			$bgObjDiv.append('<div style="position:absolute;left:0px;top:0px;">'+zzcHTML+'</div>');
		}
	},
	 
	_offsetParent : function ($obj){
		var offsetParent = $obj.offsetParent();
		if(!offsetParent.is("body")){
			var $obj_offset = $obj.offset();
			var offsetParent_offset = offsetParent.offset();
			return {top:$obj_offset.top-offsetParent_offset.top,left:$obj_offset.left-offsetParent_offset.left};
		}
	},

	_pushSignature : function (signature){
		var that =this;
		if(that.signatures.length>0){
			var mark = true;
			for ( var i = 0; i < that.signatures.length; i++) {
				var _signature = that.signatures[i];
				if(_signature.signatureId === signature.signatureId){
					that.signatures[i] = signature;
					mark =false;
					break;
				}
			}
			if(mark){
				that.signatures.push(signature);
			}
		}else{
			that.signatures.push(signature);
		}
	},
	
	
	jsonToString : function (obj){
		var THIS = this;   
        switch(typeof(obj)){  
            case 'string':  
                return '"' + obj.replace(/(["\\])/g, '\\$1') + '"';  
            case 'array':  
                return '[' + obj.map(THIS.jsonToString).join(',') + ']';  
            case 'object':  
                if(obj instanceof Array){  
                    var strArr = [];  
                    var len = obj.length;  
                    for(var i=0; i<len; i++){  
                        strArr.push(THIS.jsonToString(obj[i]));  
                    }  
                    return '[' + strArr.join(',') + ']';  
                }else if(obj==null){  
                    return '""';  
                }else{  
                    var string = [];  
                    for (var property in obj) string.push(THIS.jsonToString(property) + ':' + THIS.jsonToString(obj[property]));  
                    return '{' + string.join(',') + '}';  
                }
            case 'number':  
                return obj;  
            case "boolean" :  
                return obj;  
        }  
	},
	_encodeData:function(ori , ba64){
		return _encode(ori,ba64);
	},
	
	ajax : function(the_url,the_param,succ_callback,_async){
		the_param.appName = this._getAppName();
		var temp = {};
		if(this.defaults.isGet || this.defaults.encode){
			the_url += "?ie6="+_encode(""+isIE6 , k64);
			temp.encode = true;
			for ( var key in the_param) {
				var _val = the_param[key];
				if(_val === undefined || 'undefined' === _val){
					_val = '';	
				}
				var v = encodeURI(_encode(_val.toString() , k64));
				temp[key] = v;
			}
		}else{
			the_url += "?ie6="+isIE6;
			temp = the_param;
		}
		temp.traditional = true;
		$.ajax({
			cache:false,
	        type:(this.defaults.isGet?"GET":"POST"),
	        url:the_url+"&"+(this.defaults.isGet?"jsoncallback=?":""),
	        data:temp,
	        dataType:"json",
	        async:!_async,
	        success:succ_callback,
	        error:function(html){
	        }
	    });
		
	},
	
	_alertX : function(msg,call){
		//alert(msg);
		if(isArtAlert === true){
			//alert(call);
			artDialog.alertX('<div class="kg_alert">'+msg+'</div>',call); 
		}else{
			alert(msg);
			call();
		}
	},
	
	_getAppName : function(){
		var _ua = navigator.userAgent;
		var _ua_arr =_ua.split(";");
		var appName = [];
		if(isMobile){
			appName.push(_ua.substring(0, _ua.indexOf("/")));
			var _m = _ua.substring(_ua.indexOf("(")+1, _ua.indexOf(")")).split(";");
			appName.push(_m);
		}else {
			appName.push(navigator.appName);
			for ( var i = 0; i < _ua_arr.length; i++) {
				if(i==2||i==4){
					_ua_arr[i] = _ua_arr[i].replace(")","");
					appName.push(_ua_arr[i]);
				}
			}
		}
		appName.push("JXKG");
		return appName.join(" ");
	},
	_setUrl : function(){
		var that = this;
		if(that.defaults.crossDomain && that.urls.getSignaturesByDocument.indexOf(that.defaults.crossDomain) == -1){
			for ( var key in that.urls) {
				that.urls[key] = that.defaults.crossDomain + that.urls[key];
			}
		}
	},
	
	_delLocal : function(key){
		try{
			if('localStorage' in window){
				localStorage.removeItem(key);
			}else{
				jQuery.cookie(key,null);
			}
		}catch(e){
			//alert(e);
		}
		
	},
	_putLocal : function(key , val){
		try{
		if('localStorage' in window){
			localStorage.setItem(key,val);
		}else{
			jQuery.cookie(key,val);
		}
		}catch(e){
			//alert(e);
		}
	},
	_getLocal : function(key){
		if('localStorage' in window){
			return localStorage.getItem(key);
		}else{
			return jQuery.cookie(key);
		}
	},

	_ready : function (){
		var that  = this;
		that.loadjs.push(that._$addRes('kg_artDialog', '/dialog/dialog.js?skin='+_skin, 'text/javascript', 'artDialog'));
		that.loadjs.push(that._$addRes('kg_template', _hp?'/iSignaturePhone.template.hd.js':'/iSignaturePhone.template.js', 'text/javascript', 'iSP._showDetail'));
	},
	
	_runSignatureCallBack : function(_data,ps,dialog){
		var that  = this;
		var mark = _data.error ;
		if(ps.callback){
			ps.callback(_data);
		}
		if(!_data.error) {
			var prop = _data.properties;
			for ( var key in prop) {
				if(key.indexOf('signature') ==0){
					var properties = prop[key];
					if(ps.xmlValue){
						properties.xmlValue=ps.xmlValue;
					}
					prop.isModified = false;
					that._pushSignature(properties);
					var signdiv = that._showImg(properties, properties.signature.elemId);
					that.addEvent(properties,signdiv);
					if(properties.DivList){
						var list =  properties.DivList.split(";");
						for ( var i = 0; i < list.length; i++) {
							var eleId = list[i];
							that._pushSignature(properties);
							var signdiv = that._showImg(properties,eleId);
							that.addEvent(properties,signdiv);
						}
				 	}
				}
			}
		}else{
			that._alertX(_data.errorMsg,function(){//100002
				if(ps.resetSelect){
					if((_data.errorCode === '10' || _data.errorCode === '100002' )){
						if(_data.errorCode === '100002'){
							ps.backGetPwd  = false;
						}
						
						ps.resetSelect = false;
						
						that.showGetSignatureByKey(ps);
					}
				}else if(dialog){
					try{
						dialog.show();
					}catch(e){}
				}
				
			}); 
		}
		return mark;
	},
	
	_runSignature : function (dialog){
		var that = this;
		var ps = dialog.config.kgparam;
		var dom = dialog.config.kgdom;
		if(!ps.backGetPwd){
			if(dom.signnameSelect.val() === ''){
				that._alertX("\u8bf7\u9009\u62e9\u7b7e\u7ae0\uff01");
				return false;
			}
			if(dom.pwdInput.val() === ''){
				dialog.target&&dialog.hide();
				that._alertX("\u8bf7\u8f93\u5165\u5bc6\u7801\uff01",function(){
					dialog.show();
				});
			}
		}
		var signResult = null;
		if(ps.runSignatureParams.certFromClient){
			ps.runSignatureParams.certdata = that.getCert();
			
			if(!ps.runSignatureParams.certdata){
				return ;
			}
			
			if(ps.xmlValue){
				ps.runSignatureParams.xmlValue=ps.xmlValue;
			}else{
				ps.runSignatureParams.protectedData = that.jsonToString(that._getProtectedData(ps.protectedData,true));
			}
			
			var signResult = signCryptAPICtrl(ps.runSignatureParams.protectedData,that.defaults.cspName);
			if(!signResult){
				that._alertX('签名失败！');
				return ;
			}
			ps.runSignatureParams.signdata = signResult;
		}

		ps.runSignatureParams.signSN=dom.signSN;
		ps.runSignatureParams.signVal = dom.signVal;
		ps.runSignatureParams.keyPassword=dom.keypassword;
		ps.xmlValue?(ps.runSignatureParams.xmlValue = ps.xmlValue):(ps.runSignatureParams.protectedData = that.jsonToString(that._getProtectedData(ps.protectedData,true)));
		dialog.target&&dialog.hide();
		that.loadingwin();
		that.ajax(that.urls.runSignatureUrl,ps.runSignatureParams,
				function(data){
					that.winClose();
					var iserr = that._runSignatureCallBack(data,ps,dialog);
					if(!iserr){
						var $sign = dom.memory_sign_input;
				    	if($sign && $sign.attr("checked") === true){
				    		var $kg_signName = $("#kg_signnameSelect option:selected");
							that._putLocal('kg_memory_sign_text',$kg_signName.attr("id"));
				    	}else{
				    		that._delLocal('kg_memory_sign_text');
				    	}
				    	var $pwd = dom.memory_pwd_input;
				    	if($pwd && $pwd.attr("checked") === true){
							that._putLocal('kg_memory_pwd_text',dom.pwdInput.val());
				    	}else{
				    		that._delLocal('kg_memory_pwd_text');
				    	}
					}
				},false
			);
	},
	
	_boolean: function(i){
		return i === true?true:false;
	},
	
	showGetSignatureByKey : function (config){
		var that = this;
		that.loadingwin();
		config.runSignatureParams.backGetPwd = that._boolean(config.backGetPwd);
		if(config.xmlValue){
			config.runSignatureParams.xmlValue=config.xmlValue;
		}else{
			if(config.dataType === 1){
				config.runSignatureParams.protectedData = that.jsonToString(config.protectedData);
			} else {
				config.runSignatureParams.protectedData = that.jsonToString(that._getProtectedData(config.protectedData,true));
			}
		}
		that.ajax(that.urls.getSignatureByKeyUrl,config.runSignatureParams,
			function(data){
				that.winClose();
				if(data.error){
					that._alertX(data.errorMsg);
				}else{
					if(config.backGetPwd && data.properties.signatures.length ==1){
						var d = {};
						d.config = {};
						d.config.kgparam = config;
						d.config.kgdom = {};
						d.config.kgdom.signSN= data.properties.signatures[0].signSn ;
						d.config.kgdom.signVal = data.properties.signatures[0].signName;
						d.config.kgparam.runSignatureParams.backGetPwd = config.backGetPwd;
						that._runSignature(d);
					}else{
						that._showSignatureDiv(config, data.properties);
						if(config.getSignatureCallback){
							config.getSignatureCallback(data.properties);
						}
					}
					
		        }
			}
		);
	},
	
	runSignatureClient : function (ps){
		var that = this;
		var _protectedData = ps.protectedData;
		var params = ps;
		if(that.defaults.protectedHash){
			_protectedData = [];
			var _protectedDataItem = {};
			_protectedDataItem.fieldName = "hash";
			_protectedDataItem.fieldDesc = [];
			for ( var x = 0; x < ps.protectedData.length; x++) {
				var po = ps.protectedData[x];
				_protectedDataItem.fieldDesc.push(po.fieldName);
			}
			_protectedData.push(_protectedDataItem);
		}
		params.protectedData=_protectedData;
		
		var seal;
		if(ps.runSignatureParams.crossid){
			seal = ps.seal;
			if(!seal){
				iSP._alertX("印章不存在");
				return;
			}
		}else{
			seal = getSeals(ps.sealtype);
			params.runSignatureParams.imgvalue = seal.ImgValue;
		}
		params.runSignatureParams.signsn = seal.SerialNumber;
		params.runSignatureParams.signwidth = seal.Width;
		params.runSignatureParams.signheight = seal.Height;
		params.runSignatureParams.savelog = false;
		params.runSignatureParams.keySN = seal.KeySN;
		params.runSignatureParams.signVal = seal.SignName;
		params.runSignatureParams.unitname = seal.UnitName;
		params.runSignatureParams.username = seal.UserName;
		that.runSignatureNoSurface(params);
	},
	
	revokeProtectedData:function(pd){
		var that = this;
		return that.jsonToString(that._getProtectedData(pd,true));
	},
	
	runSignatureNoSurface : function (ps){
		var that = this;
		var mark = false;
		ps.runSignatureParams.keyPassword = ps.runSignatureParams.password;
		ps.runSignatureParams.signValue = ps.runSignatureParams.signValue;
		ps.resetSelect = true;
		ps.backGetPwd = true;
		if(ps.xmlValue){
			ps.runSignatureParams.xmlValue=ps.xmlValue;
		}else{
			if(ps.dataType === 1){
				ps.runSignatureParams.protectedData = that.jsonToString(ps.protectedData);
			} else {
				ps.runSignatureParams.protectedData = that.jsonToString(that._getProtectedData(ps.protectedData,true));
			}
		}
		if(ps.runSignatureParams.autoCert){
			if(that.defaults.protectedHash && !that.isonlypdf){
				if(!ps.runSignatureParams.signdata){
					var cert = certCryptAPICtrl(that.defaults.cspName);
					var signdata = signCryptAPICtrl(ps.runSignatureParams.protectedData || ps.runSignatureParams.xmlValue,that.defaults.cspName,ps.certpwd);
					if(!signdata){
						that._alertX("签名失败");
						return ;
					}
					ps.runSignatureParams.signdata = signdata;
					if(!ps.runSignatureParams.crossid){
						ps.runSignatureParams.certdata = cert;
					}
				}
			}
			if(!ps.runSignatureParams.pdfsigndata){
				if(ps.runSignatureParams.pdf || ps.runSignatureParams.pdf == 'true'){
					var pdfsigndata = pdfsignCryptAPICtrl(ps.runSignatureParams.crossid,that.defaults.cspName,ps.certpwd);
					if(pdfsigndata){
						ps.runSignatureParams.pdfsigndata = pdfsigndata;
					}else{
						that._alertX("签名失败");
						return ;
					}
				}
			}
		}

		ps.runSignatureParams.backGetPwd = ps.backGetPwd;
		that.loadingwin();
		that.ajax(that.urls.runSignatureUrl,ps.runSignatureParams,
			function(data){
				that.winClose();
				mark = that._runSignatureCallBack(data,ps);
			},false
		);
		return mark;
	},

	_noSignMsg : function(){
		var that = this;
		that._alertX("\u5f53\u524d\u6587\u6863\u672a\u7b7e\u7ae0\uff01");
	},


	delSignature : function (_ps){
		var that = this;
		that.ajax(that.urls.delSignatureUrl,_ps,
			function(_data){
				if(!_data.error) {
	 				var _propeties=_data.properties;
	 				if(_propeties.signatureId){
	 					that._removeSignaturesBySignatureId(_propeties.signatureId);
	 					$("div[signatureid='"+_propeties.signatureId+"']").remove();
	 				}
				}
		 		if(!_ps.callback){
		 			if(_data.error) {
		 				that._alertX(_data.errorMsg); 
					}
		 		}else {
		 			_ps.callback(_data);
		 		}
			},true
		);
	},
	
	removeSignature : function (_param){
		var that = this;
		var _documentId="", _signatureIds="";
		 if(iSP.signatures.length==0){
			 that._noSignMsg();
			 return false;
		 }
		 var signatureDivs=[];
		 for ( var i = 0; i < _param.signatures.length; i++) {
				var signatureDiv=_param.signatures[i].signatureId;
				_documentId = _param.signatures[i].documentId;
				signatureDivs.push(signatureDiv);
			}
		 _signatureIds=signatureDivs.join(",");
		 that.ajax(that.urls.removeSignatureUrl,{documentId:_documentId,signatureIds:_signatureIds},
			function(_data){
				 if(!_data.error) {
	 				var _propeties=(_data.properties);
	 				var _signatureIds = _propeties.signatureIds.split(",");
 					for ( var i = 0; i < _signatureIds.length; i++) {
 						$("div[signatureid='"+_signatureIds[i]+"']").remove();
 						that._removeSignaturesBySignatureId(_signatureIds[i]);
					}
				 }
		 		if(!_param.callback){
		 			if(_data.error) {
		 				that._alertX(_data.errorMsg); 
					}
		 		}else {
		 			_param.callback(_data);
		 		}
			}
		);
	},
	
		
	reBindEvent: function(sid, signatures,__that){
		this.conf = __that.conf;
		this.RangeX = __that.RangeX;
		this.RangeY = __that.RangeY;
		this.defaults.crossDomain = __that.defaults.crossDomain;
		iSP.signatures = signatures;
		var that = this;
		that._setUrl();
		var sig = [];
		var properties = that._getSigngaturesBySignatureId(sid)[0];
		var signdiv = null;
		if(typeof(properties) != "undefined" && properties){
			signdiv = that._showImg(properties, properties.signature.elemId);
		}else if(typeof(signatures) != "undefined" && signatures){
			for ( var i = 0; i < signatures.length; i++) {
				var _signature = signatures[i];
				if(_signature.signatureId == sid){
					sig.push(_signature);
					break;
				}
			}
			if(sig.length > 0){
				that.conf = __that.conf;	
				signdiv = that._showImg(sig[0], sig[0].signature.elemId);
			}
		}
		if(properties&& signdiv){
			if(this.defaults && !this.defaults.movecall){
				this.defaults.movecall = true;
				this.defaults.moveable = true;
			}
			that.addEvent(properties,signdiv);
		}else if(sig[0]&& signdiv){
			if(this.defaults && !this.defaults.movecall){
				this.defaults.movecall = true;
				this.defaults.moveable = true;
			}
			that.addEvent(sig[0],signdiv);
		}
		   
	},
	getThisObj: function(){
		return this;
	},
    setShowDivRange : function(X, Y){
        this.RangeX = X;
        this.RangeY = Y;  
    }
        
};
window.iSP = $.iSP = $.signaturePhone  = signaturePhone = new SignaturePhone();


}(window.jQuery, this));