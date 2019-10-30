(function(a){if(typeof bootstrap==="function"){bootstrap("promise",a)}else{if(typeof exports==="object"&&typeof module==="object"){module.exports=a()}else{if(typeof define==="function"&&(define.amd||define.cmd)){define(a)}else{if(typeof ses!=="undefined"){if(!ses.ok()){return}else{ses.makeQ=a}}else{if(typeof self!=="undefined"){self.Q=a()}else{throw new Error("This environment was not anticiapted by Q. Please file a bug.")}}}}}})(function(){var E=false;try{throw new Error()}catch(ah){E=!!ah.stack}var u=W();var j;var ad=function(){};var ai=(function(){var ao={task:void 0,next:null};var an=ao;var aq=false;var Q=void 0;var am=false;function e(){while(ao.next){ao=ao.next;var ar=ao.task;ao.task=void 0;var at=ao.domain;if(at){ao.domain=void 0;at.enter()}try{ar()}catch(au){if(am){if(at){at.exit()}setTimeout(e,0);if(at){at.enter()}throw au}else{setTimeout(function(){throw au},0)}}if(at){at.exit()}}aq=false}ai=function(ar){an=an.next={task:ar,domain:am&&process.domain,next:null};if(!aq){aq=true;Q()}};if(typeof process!=="undefined"&&process.nextTick){am=true;Q=function(){process.nextTick(e)}}else{if(typeof setImmediate==="function"){if(typeof window!=="undefined"){Q=setImmediate.bind(window,e)}else{Q=function(){setImmediate(e)}}}else{if(typeof MessageChannel!=="undefined"){var ap=new MessageChannel();ap.port1.onmessage=function(){Q=al;ap.port1.onmessage=e;e()};var al=function(){ap.port2.postMessage(0)};Q=function(){setTimeout(e,0);al()}}else{Q=function(){setTimeout(e,0)}}}}return ai})();var a=Function.call;function p(e){return function(){return a.apply(e,arguments)}}var ab=p(Array.prototype.slice);var c=p(Array.prototype.reduce||function(am,al){var e=0,Q=this.length;if(arguments.length===1){do{if(e in this){al=this[e++];break}if(++e>=Q){throw new TypeError()}}while(1)}for(;e<Q;e++){if(e in this){al=am(al,this[e],e)}}return al});var R=p(Array.prototype.indexOf||function(Q){for(var e=0;e<this.length;e++){if(this[e]===Q){return e}}return -1});var b=p(Array.prototype.map||function(am,Q){var e=this;var al=[];c(e,function(ap,ao,an){al.push(am.call(Q,ao,an,e))},void 0);return al});var H=Object.create||function(Q){function e(){}e.prototype=Q;return new e()};var A=p(Object.prototype.hasOwnProperty);var G=Object.keys||function(e){var al=[];for(var Q in e){if(A(e,Q)){al.push(Q)}}return al};var ak=p(Object.prototype.toString);function V(e){return e===Object(e)}function w(e){return(ak(e)==="[object StopIteration]"||e instanceof I)}var I;if(typeof ReturnValue!=="undefined"){I=ReturnValue}else{I=function(e){this.value=e}}var Y="From previous event:";function m(e,an){if(E&&an.stack&&typeof e==="object"&&e!==null&&e.stack&&e.stack.indexOf(Y)===-1){var al=[];for(var am=an;!!am;am=am.source){if(am.stack){al.unshift(am.stack)}}al.unshift(e.stack);var Q=al.join("\n"+Y+"\n");e.stack=K(Q)}}function K(am){var Q=am.split("\n");var an=[];for(var al=0;al<Q.length;++al){var e=Q[al];if(!g(e)&&!Z(e)&&e){an.push(e)}}return an.join("\n")}function Z(e){return e.indexOf("(module.js:")!==-1||e.indexOf("(node.js:")!==-1}function af(e){var am=/at .+ \((.+):(\d+):(?:\d+)\)$/.exec(e);if(am){return[am[1],Number(am[2])]}var al=/at ([^ ]+):(\d+):(?:\d+)$/.exec(e);if(al){return[al[1],Number(al[2])]}var Q=/.*@(.+):(\d+)$/.exec(e);if(Q){return[Q[1],Number(Q[2])]}}function g(Q){var al=af(Q);if(!al){return false}var am=al[0];var e=al[1];return am===j&&e>=u&&e<=s}function W(){if(!E){return}try{throw new Error()}catch(an){var Q=an.stack.split("\n");var al=Q[0].indexOf("@")>0?Q[1]:Q[2];var am=af(al);if(!am){return}j=am[0];return am[1]}}function C(al,e,Q){return function(){if(typeof console!=="undefined"&&typeof console.warn==="function"){console.warn(e+" is deprecated, use "+Q+" instead.",new Error("").stack)}return al.apply(al,arguments)}}function l(e){if(e instanceof N){return e}if(M(e)){return L(e)}else{return z(e)}}l.resolve=l;l.nextTick=ai;l.longStackSupport=false;if(typeof process==="object"&&process&&process.env&&process.env.Q_DEBUG){l.longStackSupport=true}l.defer=h;function h(){var am=[],ao=[],an;var Q=H(h.prototype);var aq=H(N.prototype);aq.promiseDispatch=function(at,au,ar){var e=ab(arguments);if(am){am.push(e);if(au==="when"&&ar[1]){ao.push(ar[1])}}else{l.nextTick(function(){an.promiseDispatch.apply(an,e)})}};aq.valueOf=function(){if(am){return aq}var e=J(an);if(y(e)){an=e}return e};aq.inspect=function(){if(!an){return{state:"pending"}}return an.inspect()};if(l.longStackSupport&&E){try{throw new Error()}catch(ap){aq.stack=ap.stack.substring(ap.stack.indexOf("\n")+1)}}function al(e){an=e;aq.source=e;c(am,function(at,ar){l.nextTick(function(){e.promiseDispatch.apply(e,ar)})},void 0);am=void 0;ao=void 0}Q.promise=aq;Q.resolve=function(e){if(an){return}al(l(e))};Q.fulfill=function(e){if(an){return}al(z(e))};Q.reject=function(e){if(an){return}al(D(e))};Q.notify=function(e){if(an){return}c(ao,function(at,ar){l.nextTick(function(){ar(e)})},void 0)};return Q}h.prototype.makeNodeResolver=function(){var e=this;return function(Q,al){if(Q){e.reject(Q)}else{if(arguments.length>2){e.resolve(ab(arguments,1))}else{e.resolve(al)}}}};l.Promise=T;l.promise=T;function T(al){if(typeof al!=="function"){throw new TypeError("resolver must be a function.")}var e=h();try{al(e.resolve,e.reject,e.notify)}catch(Q){e.reject(Q)}return e.promise}T.race=n;T.all=x;T.reject=D;T.resolve=l;l.passByCopy=function(e){return e};N.prototype.passByCopy=function(){return this};l.join=function(e,Q){return l(e).join(Q)};N.prototype.join=function(e){return l([this,e]).spread(function(Q,al){if(Q===al){return Q}else{throw new Error("Can't join: not the same: "+Q+" "+al)}})};l.race=n;function n(e){return T(function(an,am){for(var al=0,Q=e.length;al<Q;al++){l(e[al]).then(an,am)}})}N.prototype.race=function(){return this.then(l.race)};l.makePromise=N;function N(Q,an,am){if(an===void 0){an=function(ao){return D(new Error("Promise does not support operation: "+ao))}}if(am===void 0){am=function(){return{state:"unknown"}}}var al=H(N.prototype);al.promiseDispatch=function(ar,at,ap){var ao;try{if(Q[at]){ao=Q[at].apply(al,ap)}else{ao=an.call(al,at,ap)}}catch(aq){ao=D(aq)}if(ar){ar(ao)}};al.inspect=am;if(am){var e=am();if(e.state==="rejected"){al.exception=e.reason}al.valueOf=function(){var ao=am();if(ao.state==="pending"||ao.state==="rejected"){return al}return ao.value}}return al}N.prototype.toString=function(){return"[object Promise]"};N.prototype.then=function(an,ao,Q){var ap=this;var aq=h();var al=false;function am(au){try{return typeof an==="function"?an(au):au}catch(at){return D(at)}}function ar(at){if(typeof ao==="function"){m(at,ap);try{return ao(at)}catch(au){return D(au)}}return D(at)}function e(at){return typeof Q==="function"?Q(at):at}l.nextTick(function(){ap.promiseDispatch(function(at){if(al){return}al=true;aq.resolve(am(at))},"when",[function(at){if(al){return}al=true;aq.resolve(ar(at))}])});ap.promiseDispatch(void 0,"when",[void 0,function(at){var av;var aw=false;try{av=e(at)}catch(au){aw=true;if(l.onerror){l.onerror(au)}else{throw au}}if(!aw){aq.notify(av)}}]);return aq.promise};l.tap=function(e,Q){return l(e).tap(Q)};N.prototype.tap=function(e){e=l(e);return this.then(function(Q){return e.fcall(Q).thenResolve(Q)})};l.when=O;function O(al,e,Q,am){return l(al).then(e,Q,am)}N.prototype.thenResolve=function(e){return this.then(function(){return e})};l.thenResolve=function(Q,e){return l(Q).thenResolve(e)};N.prototype.thenReject=function(e){return this.then(function(){throw e})};l.thenReject=function(Q,e){return l(Q).thenReject(e)};l.nearer=J;function J(Q){if(y(Q)){var e=Q.inspect();if(e.state==="fulfilled"){return e.value}}return Q}l.isPromise=y;function y(e){return e instanceof N}l.isPromiseAlike=M;function M(e){return V(e)&&typeof e.then==="function"}l.isPending=ac;function ac(e){return y(e)&&e.inspect().state==="pending"}N.prototype.isPending=function(){return this.inspect().state==="pending"};l.isFulfilled=P;function P(e){return !y(e)||e.inspect().state==="fulfilled"}N.prototype.isFulfilled=function(){return this.inspect().state==="fulfilled"};l.isRejected=U;function U(e){return y(e)&&e.inspect().state==="rejected"}N.prototype.isRejected=function(){return this.inspect().state==="rejected"};var aa=[];var aj=[];var o=true;function ag(){aa.length=0;aj.length=0;if(!o){o=true}}function B(Q,e){if(!o){return}aj.push(Q);if(e&&typeof e.stack!=="undefined"){aa.push(e.stack)}else{aa.push("(no stack) "+e)}}function k(Q){if(!o){return}var e=R(aj,Q);if(e!==-1){aj.splice(e,1);aa.splice(e,1)}}l.resetUnhandledRejections=ag;l.getUnhandledReasons=function(){return aa.slice()};l.stopUnhandledRejectionTracking=function(){ag();o=false};ag();l.reject=D;function D(Q){var e=N({"when":function(an){if(an){k(this)}return an?an(Q):this}},function am(){return this},function al(){return{state:"rejected",reason:Q}});B(e,Q);return e}l.fulfill=z;function z(e){return N({"when":function(){return e},"get":function(al){return e[al]},"set":function(al,am){e[al]=am},"delete":function(al){delete e[al]},"post":function(am,al){if(am===null||am===void 0){return e.apply(void 0,al)}else{return e[am].apply(e,al)}},"apply":function(am,al){return e.apply(am,al)},"keys":function(){return G(e)}},void 0,function Q(){return{state:"fulfilled",value:e}})}function L(Q){var e=h();l.nextTick(function(){try{Q.then(e.resolve,e.reject,e.notify)}catch(al){e.reject(al)}});return e.promise}l.master=v;function v(e){return N({"isDef":function(){}},function Q(am,al){return X(e,am,al)},function(){return l(e).inspect()})}l.spread=f;function f(al,e,Q){return l(al).spread(e,Q)}N.prototype.spread=function(e,Q){return this.all().then(function(al){return e.apply(void 0,al)},Q)};l.async=S;function S(e){return function(){function al(ar,ap){var ao;if(typeof StopIteration==="undefined"){try{ao=am[ar](ap)}catch(aq){return D(aq)}if(ao.done){return l(ao.value)}else{return O(ao.value,an,Q)}}else{try{ao=am[ar](ap)}catch(aq){if(w(aq)){return l(aq.value)}else{return D(aq)}}return O(ao,an,Q)}}var am=e.apply(this,arguments);var an=al.bind(al,"next");var Q=al.bind(al,"throw");return an()}}l.spawn=r;function r(e){l.done(l.async(e)())}l["return"]=i;function i(e){throw new I(e)}l.promised=q;function q(e){return function(){return f([this,x(arguments)],function(Q,al){return e.apply(Q,al)})}}l.dispatch=X;function X(Q,al,e){return l(Q).dispatch(al,e)}N.prototype.dispatch=function(am,al){var Q=this;var e=h();l.nextTick(function(){Q.promiseDispatch(e.resolve,am,al)});return e.promise};l.get=function(e,Q){return l(e).dispatch("get",[Q])};N.prototype.get=function(e){return this.dispatch("get",[e])};l.set=function(e,Q,al){return l(e).dispatch("set",[Q,al])};N.prototype.set=function(e,Q){return this.dispatch("set",[e,Q])};l.del=l["delete"]=function(e,Q){return l(e).dispatch("delete",[Q])};N.prototype.del=N.prototype["delete"]=function(e){return this.dispatch("delete",[e])};l.mapply=l.post=function(al,Q,e){return l(al).dispatch("post",[Q,e])};N.prototype.mapply=N.prototype.post=function(Q,e){return this.dispatch("post",[Q,e])};l.send=l.mcall=l.invoke=function(Q,e){return l(Q).dispatch("post",[e,ab(arguments,2)])};N.prototype.send=N.prototype.mcall=N.prototype.invoke=function(e){return this.dispatch("post",[e,ab(arguments,1)])};l.fapply=function(Q,e){return l(Q).dispatch("apply",[void 0,e])};N.prototype.fapply=function(e){return this.dispatch("apply",[void 0,e])};l["try"]=l.fcall=function(e){return l(e).dispatch("apply",[void 0,ab(arguments,1)])};N.prototype.fcall=function(){return this.dispatch("apply",[void 0,ab(arguments)])};l.fbind=function(Q){var am=l(Q);var e=ab(arguments,1);return function al(){return am.dispatch("apply",[this,e.concat(ab(arguments))])}};N.prototype.fbind=function(){var al=this;var e=ab(arguments);return function Q(){return al.dispatch("apply",[this,e.concat(ab(arguments))])}};l.keys=function(e){return l(e).dispatch("keys",[])};N.prototype.keys=function(){return this.dispatch("keys",[])};l.all=x;function x(e){return O(e,function(am){var al=0;var Q=h();c(am,function(aq,ap,ao){var an;if(y(ap)&&(an=ap.inspect()).state==="fulfilled"){am[ao]=an.value}else{++al;O(ap,function(ar){am[ao]=ar;if(--al===0){Q.resolve(am)}},Q.reject,function(ar){Q.notify({index:ao,value:ar})})}},void 0);if(al===0){Q.resolve(am)}return Q.promise})}N.prototype.all=function(){return x(this)};l.allResolved=C(d,"allResolved","allSettled");function d(e){return O(e,function(Q){Q=b(Q,l);return O(x(b(Q,function(al){return O(al,ad,ad)})),function(){return Q})})}N.prototype.allResolved=function(){return d(this)};l.allSettled=t;function t(e){return l(e).allSettled()}N.prototype.allSettled=function(){return this.then(function(e){return x(b(e,function(al){al=l(al);function Q(){return al.inspect()}return al.then(Q,Q)}))})};l.fail=l["catch"]=function(e,Q){return l(e).then(void 0,Q)};N.prototype.fail=N.prototype["catch"]=function(e){return this.then(void 0,e)};l.progress=F;function F(e,Q){return l(e).then(void 0,void 0,Q)}N.prototype.progress=function(e){return this.then(void 0,void 0,e)};l.fin=l["finally"]=function(e,Q){return l(e)["finally"](Q)};N.prototype.fin=N.prototype["finally"]=function(e){e=l(e);return this.then(function(Q){return e.fcall().then(function(){return Q})},function(Q){return e.fcall().then(function(){throw Q})})};l.done=function(al,e,am,Q){return l(al).done(e,am,Q)};N.prototype.done=function(e,am,al){var Q=function(ao){l.nextTick(function(){m(ao,an);if(l.onerror){l.onerror(ao)}else{throw ao}})};var an=e||am||al?this.then(e,am,al):this;if(typeof process==="object"&&process&&process.domain){Q=process.domain.bind(Q)}an.then(void 0,Q)};l.timeout=function(al,Q,e){return l(al).timeout(Q,e)};N.prototype.timeout=function(al,Q){var e=h();var am=setTimeout(function(){if(!Q||"string"===typeof Q){Q=new Error(Q||"Timed out after "+al+" ms");Q.code="ETIMEDOUT"}e.reject(Q)},al);this.then(function(an){clearTimeout(am);e.resolve(an)},function(an){clearTimeout(am);e.reject(an)},e.notify);return e.promise};l.delay=function(e,Q){if(Q===void 0){Q=e;e=void 0}return l(e).delay(Q)};N.prototype.delay=function(e){return this.then(function(al){var Q=h();setTimeout(function(){Q.resolve(al)},e);return Q.promise})};l.nfapply=function(Q,e){return l(Q).nfapply(e)};N.prototype.nfapply=function(Q){var e=h();var al=ab(Q);al.push(e.makeNodeResolver());this.fapply(al).fail(e.reject);return e.promise};l.nfcall=function(Q){var e=ab(arguments,1);return l(Q).nfapply(e)};N.prototype.nfcall=function(){var Q=ab(arguments);var e=h();Q.push(e.makeNodeResolver());this.fapply(Q).fail(e.reject);return e.promise};l.nfbind=l.denodeify=function(Q){var e=ab(arguments,1);return function(){var am=e.concat(ab(arguments));var al=h();am.push(al.makeNodeResolver());l(Q).fapply(am).fail(al.reject);return al.promise}};N.prototype.nfbind=N.prototype.denodeify=function(){var e=ab(arguments);e.unshift(this);return l.denodeify.apply(void 0,e)};l.nbind=function(al,e){var Q=ab(arguments,2);return function(){var ao=Q.concat(ab(arguments));var am=h();ao.push(am.makeNodeResolver());function an(){return al.apply(e,arguments)}l(an).fapply(ao).fail(am.reject);return am.promise}};N.prototype.nbind=function(){var e=ab(arguments,0);e.unshift(this);return l.nbind.apply(void 0,e)};l.nmapply=l.npost=function(al,Q,e){return l(al).npost(Q,e)};N.prototype.nmapply=N.prototype.npost=function(al,Q){var am=ab(Q||[]);var e=h();am.push(e.makeNodeResolver());this.dispatch("post",[al,am]).fail(e.reject);return e.promise};l.nsend=l.nmcall=l.ninvoke=function(al,Q){var am=ab(arguments,2);var e=h();am.push(e.makeNodeResolver());l(al).dispatch("post",[Q,am]).fail(e.reject);return e.promise};N.prototype.nsend=N.prototype.nmcall=N.prototype.ninvoke=function(Q){var al=ab(arguments,1);var e=h();al.push(e.makeNodeResolver());this.dispatch("post",[Q,al]).fail(e.reject);return e.promise};l.nodeify=ae;function ae(Q,e){return l(Q).nodeify(e)}N.prototype.nodeify=function(e){if(e){this.then(function(Q){l.nextTick(function(){e(null,Q)})},function(Q){l.nextTick(function(){e(Q)})})}else{return this}};var s=W();l.denodeify2=function(an){var Q=ab(arguments,1);var e=function(){var ap=Q.concat(ab(arguments));if(ap.length>0&&typeof ap[ap.length-1]==="function"){return an.apply(null,ap)}else{var ao=h();ap.push(ao.makeNodeResolver());l(an).fapply(ap).fail(ao.reject);return ao.promise}};var am=an.toString().split(")")[0].split("(")[1];var al=am?am.split(",").map(function(ao){return ao.trim()}):[];e.$formalParams=al;return e};return l});

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && (define.amd || define.cmd) ? define(factory) :
            (global.SuiEvent = factory());
} (this, function () {
    'use strict';


    //静态API
    var api = {};

    /*以下是SuiEvent的具体实现*/
    api.trigger = function (options, callback) {
        var target = options.target || document;
        var eventName = options.eventName || '';
        var event = new CustomEvent(eventName, {
            detail: {data: options.data, q: Q, promiseArray: []},
            bubbles: true,
            cancelBubble: true,      //是否冒泡
            cancelable: true   //是否阻止
        });

        target.dispatchEvent(event);
        Q.all(event.detail.promiseArray).then(function(){
            console.log(arguments);
            var result = arguments[0].indexOf(false) == -1;
            callback && callback(null, {success: result});
        }, function(){
            //出现异常
            callback && callback({message: 'exception in ' + options.eventName});
        });
    }

    api.promise = function (e, handler) {
        if (e && e.detail && typeof e.detail.q == 'function' && typeof handler == 'function') {
            var q = e.detail.q;
            var deferred = q.defer();
            handler(e.detail.data, function(err, result){
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(result);
                }
            });
            if (e.detail.promiseArray instanceof Array) {
                e.detail.promiseArray.push(deferred.promise);
            }
        }
    }

    /*以上是SuiEvent的具体实现*/

    api.version = '1.0.1';
    return api;

}));
/**
 * Created by yangchao on 2016/12/20.
 */

(function ($, doc) {
    $.sui = $.sui || {};

    var formRoot = '';
    //原表单转发的处理逻辑=================->
    $.sui.renderForwardForm = function (options, root) {
        formRoot = root;
        if (options.containerId ) {
            var container=document.getElementById(options.containerId);
            if(container) {
                var _width=container.offsetWidth+"px";
                var _height=container.offsetHeight+"px";
                container.innerHTML = '<iframe id="contentfrm" style="width: '+_width+';height: '+_height+';overflow: hidden;border: none;" ></iframe>';
                var content_Frame = document.getElementById("contentfrm");
                content_Frame.onload = function () {
                    content_Frame.contentWindow.document.getElementById("mainbodyHtmlDiv_0").innerHTML = s3scope.contentList[0].contentHtml;
                    if(options.onScroll){
                        content_Frame.contentWindow.onScroll=options.onScroll;
                    }
                    if(options.onScrollBottom){
                        content_Frame.contentWindow.onScrollBottom=options.onScrollBottom;
                    }
                    content_Frame.contentWindow.serverPath=cmp.origin;
                    var form=s3scope.contentList[0];
                    content_Frame.contentWindow.formData=s3scope;
                    if(form.extraMap.formJson){
                        var formJson=JSON.parse(form.extraMap.formJson);
                        form.tableList=formJson.tableList;
                        form.pageSize=formJson.pageSize;
                        form.unShowSubDataIdMap=formJson.unShowSubDataIdMap;
                        form.id=formJson.id;
                        content_Frame.contentWindow.document.getElementById("#id").value=form.id;
                    }
                    content_Frame.contentWindow.form=form;
                    _addJs(content_Frame);
                };
                var url = formRoot + '/forwardForm/content.html';
                if(cmp.platform.CMPShell){
                    var tempParam = {
                        "url" : url,
                        success : function(ret){
                            var _url = ret.localUrl;
                            content_Frame.setAttribute("src", _url);
                        },
                        error : function(e){
                            _this.isLoading = false;
                            console.log("读取iframe地址失败");
                        }
                    }
                    cmp.app.getLocalResourceUrl(tempParam);
                }else{
                    content_Frame.setAttribute("src", url);
                }
            }
        }
    }
    var curr=0;
    var formData={};
    var jsList=["jquery-debug.js",
        "dev/new_style/m1-form-style.js",
        "dev/new_style/m1-newCalendar.js",
        "seeyon.ui.calendar-debug.js",
        "dev/new_style/iscroll-zoom.js",
        "m1-global-debug.js",
        "jquery.json-debug.js",
        "v3x-debug.js",
        "m1-form-debug.js",
        "m1-content-debug.js",
        "m1-common-debug.js",
        "jquery.comp-debug.js",
        "jquery.jsonsubmit-debug.js",
        "jquery.code-debug.js",
        "jquery.fillform-debug.js",
        "common-debug.js",
        "seeyon.ui.checkform-debug.js",
        "i18n_en.js",
    ];
    function _addJs(iframe){
        if(curr<jsList.length){
            _loadJSForIframe(iframe,jsList[curr], _addJs);
        }else{
            setTimeout(function(){
                cmp.dialog.loading(false);
                //转发的表单隐藏图标
                var icons=iframe.contentWindow.document.querySelectorAll(".documents_penetration_16");
                [].forEach.call(icons,function(icon){
                    icon.css("display","none");
                });
                var imgs=iframe.contentWindow.document.querySelectorAll("img");
                [].forEach.call(imgs,function(img){
                    var lowerSrcAtt = img.getAttribute("src").toLowerCase();
                    if(lowerSrcAtt.indexOf("uploadfile.gif")!=-1
                        ||lowerSrcAtt.indexOf("selecetuser.gif")!=-1
                        ||lowerSrcAtt.indexOf("date.gif")!=-1
                        ||lowerSrcAtt.indexOf("uploadimage.gif")!=-1
                        ||lowerSrcAtt.indexOf("delete.gif")!=-1
                        ||lowerSrcAtt.indexOf("handwrite.gif")!=-1){
                        img.css("display","none");
                    }
                });
            },500);
        }
        curr+=1
    }

    function _loadJSForIframe(iframe,url, success) {
        var script  = document.createElement('script');
        script.src =formRoot+"/forwardForm/"+ url;
        success = success || function () {};
        script.onload = script.onreadystatechange = function () {
            if (!this.readyState || 'loaded' === this.readyState || 'complete' === this.readyState) {
                success(iframe);
                this.onload = this.onreadystatechange = null;
                this.parentNode.removeChild(this);
            }
        };
        iframe.contentWindow.document.getElementsByTagName('head')[0].appendChild(script);
    }
    //原表单转发的处理逻辑=================!!

})(cmp, document);
/**
 * Created by yangchao on 2016/12/20.
 */

(function ($, doc) {
    $.sui = $.sui || {};

    function _getSuiInputType(finalInputType) {
        switch (finalInputType) {
            case 'text':
                return 'v-sui-input';
            case 'textarea':
                return 'v-sui-input';
            case 'date':
                return 'v-sui-date';
            case 'datetime':
                return 'v-sui-date';
            case 'flowdealoption':
                return 'v-sui-static';
            case 'lable':
                return 'v-sui-static';
            case 'label':
                return 'v-sui-static';
            case 'member':
            case 'multimember':
            case 'account':
            case 'multiaccount':
            case 'department':
            case 'multidepartment':
            case 'post':
            case 'multipost':
            case 'level':
            case 'multilevel':
                return 'v-sui-organization';
            default:
                return 'v-sui-' + finalInputType;

        }
    }

   function _getRealInputType(fieldInfo) {
        //如果是relation或outwrite 则返回finalInputType
        if (fieldInfo.inputType == 'relation' || fieldInfo.inputType == 'outwrite') {
            return fieldInfo.finalInputType;
        } else {
            return fieldInfo.inputType;
        }
    }

    function _getMasterCtrlTemplate (ctrlId, suiInputType, finalInputType) {
        var html = [];
        html.push('<div id="' + ctrlId + '" class="sui-source-form-ctrl-wrapper ' + finalInputType + '">');
        html.push('<div id="master|' + ctrlId + '" sui-type="' + finalInputType + '" class="sui-form-ctrl sui-form-viewType-1 sui-form-ctrl-' + ctrlId + '">');
        html.push('<div ' + suiInputType + '="s3scope.data.master[\'' + ctrlId + '\'].value" v-bind:scope="{model:s3scope.data.master[\'' + ctrlId + '\'], fieldInfo:s3scope.metadata.fieldInfo[\'' + ctrlId + '\'], isMaster:true}"></div>');
        html.push('</div>');
        html.push('</div>');
        return html.join('');
    }

    function _getRepeatTableCtrlTemplate (tableName, ctrlId, suiInputType, finalInputType) {
        var html = [];
        html.push('<div id="' + ctrlId + '" class="sui-source-form-ctrl-wrapper ' + finalInputType + '">');
        html.push('<div id="' + tableName + '|{{item.__id}}|' + ctrlId + '" sui-type="' + finalInputType + '" class="sui-form-ctrl sui-form-viewType-1 sui-form-ctrl-' + ctrlId + '">');
        html.push('<div ' + suiInputType + '="item[\'' + ctrlId + '\'].value" v-bind:scope="{model:item[\'' + ctrlId + '\'], fieldInfo:s3scope.metadata.children[\'' + tableName + '\'].fieldInfo[\'' + ctrlId + '\'], isMaster:false}"></div>');
        html.push('</div>');
        html.push('</div>');
        return html.join('');
    }


    $.sui.templateConvertor = function (metadata, data, sourceTemplate) {
        //如果模板已经转换过的，忽略
        if (sourceTemplate.indexOf('class="sui-form-wrapper"') != -1) {
            return sourceTemplate;
        }

        var start = new Date();
        var newTemplate = sourceTemplate;
        if (metadata) {
            Object.keys(metadata.fieldInfo || {}).forEach(function(key){
                if (key.indexOf('field') != -1 && data.master[key]) {
                    var fieldInfo = metadata.fieldInfo[key];
                    var placeholder = '@' + fieldInfo.name + '@';
                    var finalInputType = _getRealInputType(fieldInfo);
                    var suiInputType = _getSuiInputType(finalInputType);
                    var html = _getMasterCtrlTemplate(fieldInfo.name, suiInputType, finalInputType);
                    newTemplate = newTemplate.replace(placeholder, html);
                }
            });

            Object.keys(metadata.children || {}).forEach(function(tableName){
                Object.keys(metadata.children[tableName].fieldInfo || {}).forEach(function(key){
                    if (key.indexOf('field') != -1 ) {
                        if (data.children[tableName] && data.children[tableName].data && data.children[tableName].data.length > 0) {
                            var recordData = data.children[tableName].data[0];
                            if (recordData[key]) {
                                var fieldInfo = metadata.children[tableName].fieldInfo[key];
                                var placeholder = '@' + fieldInfo.name + '@';
                                var finalInputType = _getRealInputType(fieldInfo);
                                var suiInputType = _getSuiInputType(finalInputType);
                                var html = _getRepeatTableCtrlTemplate(tableName, fieldInfo.name, suiInputType, finalInputType);
                                newTemplate = newTemplate.replace(placeholder, html);
                            }
                        }
                    }
                });
            });
        }

        //在模板末尾加一个扫码功能的控制
        newTemplate += '<div v-sui-qrscan v-show="s3scope.allowQRScan" ></div>';

        //构造一个新的原样表单的模板
        var formWrapper = document.createElement('div');
        formWrapper.classList.add('sui-form-wrapper');
        //给wrapper加一个id
        formWrapper.id = 'formWrapper_' + new Date().getTime();
        formWrapper.innerHTML = '<div class="sui-form-content" v-bind:class="{ \'sui-form-content-allow-check\': s3scope.allowCheck}"></div>';
        var formContent = formWrapper.children[0];
        //将新表单模板挂载到formContent上
        formContent.innerHTML = newTemplate;
        //将表单外层div加一个样式  sui-form-grid
        //formContent.children[0].classList.add('sui-form-grid');
        formContent.classList.add('sui-form-grid');
        var scripts = formContent.querySelectorAll('script');
        Array.apply(null, scripts).forEach(function(script){
            script.remove();
        });

        //找到具有recordid的dom，替换属性
        var repeatTrArr = formContent.querySelectorAll('[recordid]');
        Array.apply(null, repeatTrArr).forEach(function(tr){
            //找到第一个ctrl，获取tablename
            var ctrls = tr.querySelectorAll('[id*="formson_"]');
            var len = ctrls.length;
            if (len > 0) {
                var ctrl = ctrls[0];
                var tableName = ctrl.id.split('|')[0];
                tr.classList.add('sui-sub-table-record');
                tr.setAttribute('recordid', '{{item.__id}}');
                tr.setAttribute('tablename', tableName);
                tr.setAttribute('recordindex', '{{$index}}');
                tr.setAttribute('previd', '{{item.__prevId}}');
                tr.setAttribute('track-by', '__id');
                tr.setAttribute("v-for", "item in s3scope.data.children['" + tableName + "'].data");
                //如果是重复节，用table布局
                if (tr.tagName != 'TR') {
                    tr.style.display = 'inline-table';
                }

                //插入一个tr，或div显示更多
                var moreCtrl = document.createElement(tr.tagName);
                moreCtrl.classList.add('sui-sub-table-more-ctrl-grid');
                moreCtrl.setAttribute("v-show", "s3scope.unShowSubDataIdMap && s3scope.unShowSubDataIdMap['" + tableName + "'] && s3scope.unShowSubDataIdMap['" + tableName + "'].length>0");
                moreCtrl.setAttribute('colspan', len);
                if (tr.tagName == 'TR') {
                    moreCtrl.innerHTML = '<td colspan="' + len + '"><span v-on:touchend.prevent v-on:tap="onLoadMore(\'' + tableName + '\')">查看更多</span></td>';
                } else {
                    moreCtrl.innerHTML = '<span v-on:touchend.prevent v-on:tap="onLoadMore(\'' + tableName + '\')">查看更多</span>';
                }
                tr.parentNode.appendChild(moreCtrl);

                //将父元素设置为relative
                tr.parentNode.style.position = 'relative';
                //添加一个汇总重复表行的图标
                var collectCtrl = document.createElement('div');
                collectCtrl.classList.add('see-icon-v5-form-table-collect');
                collectCtrl.setAttribute('v-show', 's3scope.metadata.children["' + tableName + '"].collectTable');
                collectCtrl.setAttribute('v-on:tap', 'onCollectSubTableRecords("' + tableName + '")');
                tr.parentNode.appendChild(collectCtrl);

            }

        });
        //将已经有的logo，图片改一下地址
        var imgArr = formWrapper.querySelectorAll('img');
        Array.apply(null, imgArr).forEach(function(img){
            if (img.src && !img.src.startsWith('http')) {
                var url = img.src;
                if (url.startsWith('file://')) {
                    url = url.substring('file://'.length);
                }
                img.src = cmp.serverIp + url;
            }
        });
        var end = new Date();
        console.log('耗时：', end - start);
        return formWrapper.outerHTML;
    }

})(cmp, document);
/**
 * sui的功能方法
 * Created by yangchao on 2016/5/31.
 * last update on 2017/9/27
 */


(function ($, doc) {
    'use strict';

    var formRoot = '';
    if ($.platform.CMPShell) {
        formRoot = 'http://form.v5.cmp/v';
    } else {
        formRoot = '/seeyon/m3/apps/v5/form';
    }

    //先加载国际化资源文件
    $.i18n.load(formRoot + "/i18n/", "form",function(){

    }, '20170520');

    var _urlReg = /^(https|http|ftp|rtsp|mms)?:\/\/([0-9A-Za-z_-]+\.?)+(\/[0-9A-Za-z_-]+)*(\.[0-9a-zA-Z-_]*)?(:?[0-9]{1,4})?(\/[\u4E00-\u9FA50-9A-Za-z_-]+\.?[\u4E00-\u9FA50-9A-Za-z_-]+)*(\?([\u4E00-\u9FA50-9a-zA-Z-_]+=[\u4E00-\u9FA50-9a-zA-Z-_%]*(&|&amp;)?)*)?\/?$/;
    var _ipv6Reg = /^(https|http|ftp|rtsp|mms):\/\/\[\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*\]:([0-9]{1,5}$)?/;
    var _vue = null;
    var _infoPathIscroll = null;
    var _allowDbClick = false;

    /**
     * 给Date对象添加格式化函数
     * @param format 格式化字符串
     * @returns {*}
     */
    Date.prototype.format = function (format) {

        var chinese = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十',
            '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
            '二十一', '二十二', '二十三', '二十四', '二十五', '二十六', '二十七', '二十八', '二十九', '三十',
            '三十一'];
        var week = ['日', '一', '二', '三', '四', '五', '六'];
        var toChinese = false;
        if (format.indexOf('-china') >= 0) {
            format = format.replace('-china', '');
            toChinese = true;
        }

        function _yearConverter (val) {
            if (toChinese) {
                val = parseInt(val).toString();
                var len = val.length;
                var newVal = '';
                for (var i = 0; i < len; i++) {
                    newVal += chinese[parseInt(val[i])];
                }
                return newVal;
            }
            return val.toString();
        }

        function _monthOrDayConverter (val) {
            if (toChinese) {
                val = parseInt(val);
                var newVal = chinese[val];
                return newVal;
            }

            return val.toString();
        }

        var o = {
            "M+": this.getMonth() + 1, //month
            "d+": this.getDate(), //day
            "h+": this.getHours(), //hour
            "m+": this.getMinutes(), //minute
            "s+": this.getSeconds(), //second
            "W+": week[this.getDay()], //week
            "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
            "S": this.getMilliseconds() //millisecond
        };

        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, _yearConverter(this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }

        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                var newVal = '';
                if (RegExp.$1.length == 1) {
                    newVal = _monthOrDayConverter(o[k]);
                } else {
                    var val = _monthOrDayConverter(o[k]);
                    var temp = _monthOrDayConverter("0") + val;
                    newVal = temp.substr(temp.length - Math.max(2, val.length));
                }

                format = format.replace(RegExp.$1, newVal);
            }
        }
        return format;
    };

    String.prototype.htmlEncode = function() {
        var s = this;
        if (this.length == 0) return "";
        //s = this.replace(/&/g, "&gt;");
        s = s.replace(/</g, "&lt;");
        s = s.replace(/>/g, "&gt;");
        //s = s.replace(/ /g, "&nbsp;");
        //s = s.replace(/\'/g, "&#39;");
        //s = s.replace(/\"/g, "&quot;");
        //s = s.replace(/\n/g, "<br>");
        return s;
    }

    String.prototype.htmlDecode = function() {
        var s = "";
        if (this.length == 0) return "";
        s = this.replace(/&gt;/g, "&");
        s = s.replace(/&lt;/g, "<");
        s = s.replace(/&gt;/g, ">");
        s = s.replace(/&nbsp;/g, " ");
        s = s.replace(/&#39;/g, "\'");
        s = s.replace(/&quot;/g, "\"");
        s = s.replace(/<br>/g, "\n");
        return s;
    }

    //为了适应matches的兼容性，做以下判断
    Element.prototype.suiMatchesSelector = function(selector){
        var element = this;
        if(element.matches){
            return element.matches(selector);
        } else if(element.matchesSelector){
            return element.matchesSelector(selector);
        } else if(element.webkitMatchesSelector){
            return element.webkitMatchesSelector(selector);
        } else if(element.msMatchesSelector){
            return element.msMatchesSelector(selector);
        } else if(element.mozMatchesSelector){
            return element.mozMatchesSelector(selector);
        } else if(element.oMatchesSelector){
            return element.oMatchesSelector(selector);
        } else {
            return null;
        }
    }

    //获取第一个满足条件的dom
    Element.prototype.parent = function(selector) {
        var elem = this;
        if (!elem) return null;
        var hasSelector = selector !== undefined;

        while ((elem = elem.parentElement) !== null) {
            if (elem.nodeType !== Node.ELEMENT_NODE) {
                continue;
            }

            if (!hasSelector || elem.suiMatchesSelector(selector)) {
                return elem;
            }
        }
        return null;
    };

    Element.prototype.closest = function(selector) {
        var elem = this;
        if (!elem) return null;
        var hasSelector = selector !== undefined;

        do {
            if (!hasSelector || elem.suiMatchesSelector(selector)) {
                return elem;
            }

            elem = elem.parent();
        } while(elem && elem.tagName !== 'BODY')

        return null;
    };

    //parents函数
    Element.prototype.parents = function(selector) {
        var elements = [];
        var elem = this;
        if (!elem) return null;
        var hasSelector = selector !== undefined;

        while ((elem = elem.parentElement) !== null) {
            if (elem.nodeType !== Node.ELEMENT_NODE) {
                continue;
            }

            if (!hasSelector || elem.suiMatchesSelector(selector)) {
                elements.push(elem);
            }
        }

        return elements;
    };

    HTMLCollection.prototype.toArray = function() {
        return Array.apply(null, this);
    };

    $.sui = $.sui || {};
    //阻止提交的状态
    $.sui.preventSubmit = false;
    //当preventsubmit时，记录是否正在执行doCalc操作
    $.sui.onCalcing = false;
    //记录上一次焦点位置的ctrl
    $.sui.lastPosCtrlId = null;
    $.sui.lastPosInput = null;
    //全局UUID，用于分配dom时，临时给dom设置id
    $.sui.uuid = 1;
    //保存缓存数据的key
    $.sui.cacheKeyMap = null;


    /*内部函数----start*/


    $.sui.nextTick = function (handler, ticks) {
        setTimeout(function(){
            typeof handler === 'function' && handler();
        }, ticks || 0);
    }

    $.sui.getAttachments = function(attachmentInputs) {
        //遍历map中的所有attData
        var arr = [];
        Object.keys(attachmentInputs || {}).forEach(function(key){
            var attData = attachmentInputs[key];
            (attData || []).forEach(function(att){
                var obj = {};
                Object.keys(att).forEach(function(field){
                    obj['attachment_' + field] = att[field];
                });
                arr.push(obj);
            });
        });
        return arr;
    }

    $.sui.getSignatures = function(signatures) {
        //遍历map中的所有attData
        var arr = [];
        Object.keys(signatures || {}).forEach(function(key){
            var signature = signatures[key];
            arr.push(signature);
        });
        return arr;
    }

    function _getRequest() {
        var url = window.location.search; //获取url中"?"符后的字串
        var params = {};
        if (url.indexOf('?') != -1) {
            var str = url.substr(url.lastIndexOf('?') + 1);
            var items = str.split("&");
            for(var i = 0; i < items.length; i ++) {
                var splits = items[i].split('=');
                params[splits[0]] = decodeURIComponent(splits[1] || '');
            }
        }
        return params;
    }

    function _loadJS(url, success) {
        var script  = document.createElement('script');
        script.src = url;
        success = success || function () {};
        script.onload = script.onreadystatechange = function () {
            if (!this.readyState || 'loaded' === this.readyState || 'complete' === this.readyState) {
                success();
                this.onload = this.onreadystatechange = null;
                this.parentNode.removeChild(this);
            }
        };
        document.getElementsByTagName('head')[0].appendChild(script);
    }

    function _arrToDict (arr) {
        var dict = {};
        (arr || []).forEach(function(item){
            dict[item.__id] = item;
        });
        return dict;
    }

    function _s3UIInit(options, s3scope){
        var containerId = options.containerId;
        var templateId = options.templateId;
        var fDomItem,fRefresh;
        fDomItem=document.getElementById(containerId);
        fRefresh=s3utils.C_iRefresh_Refresh;
        s3utils.refreshElement(fDomItem, fRefresh, window[templateId]['formMain'].call(this, s3scope), true);
    }

    function _initFormTemplate (options, s3scope) {
        //s3scope.metadata.template = s3scope.metadata.template.replace(/\.value/g, '');
        var containerId = options.containerId;
        var templateId = options.templateId;
        var container = document.getElementById(containerId);
        if (container) {
            $.sui.initIScroll = function () {
                _createIScroll(options);
            }
            if (s3scope.metadata.templateType == 'infopath') {
                s3scope.metadata.template = $.sui.templateConvertor(s3scope.metadata, s3scope.data, s3scope.metadata.template);
                container.innerHTML = s3scope.metadata.template;
                $.sui.nextTick(function(){
                    $.sui.initIScroll();
                });
            } else {
                container.innerHTML = s3scope.metadata.template;
                //对轻表单外层加一个样式
                var content = document.querySelector('.sui-form-content');
                if (content) {
                    content.classList.add('sui-light-form');
                }
            }
        }
    }

    $.sui.refreshIScroll = function () {
        if (_infoPathIscroll) {
            _infoPathIscroll.refresh();
        }
    }

    function _createIScroll (options) {
        var wrapper = document.querySelector('.sui-form-wrapper');
        var formContent = document.querySelector(".sui-form-content");
        var wrapperId = wrapper.id;
        var percent = wrapper.offsetWidth / formContent.offsetWidth;
        console.log('percent', percent);
        var scrollEndActionTime = 0,scrollYMax = false;
        if (_infoPathIscroll) {
            _infoPathIscroll.destroy();
        }
        _infoPathIscroll = new IScroll('#' + wrapper.id,{
            zoom:true,
            scrollX: true,
            scrollY: true,
            disableTouch: false,
            mouseWheel: true,
            zoomStart:percent,
            zoomMin:percent > 1 ? 1 : percent,
            preventDefaultException:{tagName: /^(INPUT|SPAN|IMG|A|TEXTAREA|SELECT)$/ },
            zoomMax:1,
            wheelAction: 'zoom'
        });

        //如果缓存中有errorInfo，就不走此逻辑
        if (!$.storage.get($.sui.getErrorInfoKey(),true)) {
            _recoverScrollStateFromCache(percent);//恢复iscroll之前的状态
        }

        //双击放大
        var lastTapTime=0;
        wrapper.addEventListener("tap",function(e){
            console.log('in wrapper tap');
            $.sui.nextTick(function(){
                _dealRepeatTable(e.target);
            });

        });

        //上下滑动
        if(options.onScrollBottom) {
            _infoPathIscroll.on('scrollEnd', function () {
                if (scrollYMax) {
                    if (scrollEndActionTime > 0) {
                        console.log('bottom');
                        options.onScrollBottom();
                        scrollEndActionTime = 0;
                    } else {
                        scrollEndActionTime++;
                    }
                }

            });
        }
        _infoPathIscroll.on("scroll", function(e){
            if(options.onScroll){
                options.onScroll(-_infoPathIscroll.y, _infoPathIscroll.directionY);
            }
            if(_infoPathIscroll.y <= (_infoPathIscroll.maxScrollY-10)) {
                scrollYMax = true;
            }else {
                scrollYMax = false;
            }
        });

        var tsY,tsT,wrapperMove = false;
        var touchstartHandler = function (e) {
            if(e.targetTouches.length == 1) {
                tsY = e.touches[0].pageY;
                tsT = e.timeStamp;
                wrapperMove = true;
            }else {
                wrapperMove = false;
            }
        }

        var touchendHandler = function (e) {
            var teY = e.changedTouches[0].pageY;
            var teT = e.timeStamp;
            if(wrapperMove == true) {
                if((teY - tsY) > 10 && (teT - tsT) >100 && _infoPathIscroll.y == 0){
                    if(options.onScroll){
                        options.onScroll(-5, -1);
                    }
                }
            }
        }
        wrapper.removeEventListener("touchstart", touchstartHandler);
        wrapper.addEventListener("touchstart", touchstartHandler);
        wrapper.removeEventListener("touchend", touchendHandler);
        wrapper.addEventListener("touchend", touchendHandler);
    }

    //iscroll移动到指定元素 time:时间，zoomMax:是否缩放到最大
    $.sui.scrollIntoView = function (el) {
        if (el) {
            if (s3scope.metadata.templateType == 'infopath') {
                //原表单移动到可视区域
                _moveIScrollToElement(el, 100, true);
            } else {
                $.sui.scrollIntoViewIfNeeded(el);
            }
        }
    }

    $.sui.scrollIntoViewIfNeeded = function (el) {
        if (el) {
            if (el.scrollIntoViewIfNeeded) {
                el.scrollIntoViewIfNeeded();
            } else {
                el.scrollIntoView && el.scrollIntoView();
            }
        }
    }

    function _moveIScrollToElement(el,time,zoomMax){
        if (_infoPathIscroll) {
            _infoPathIscroll.refresh();
            if(zoomMax){
                _infoPathIscroll.zoom(_infoPathIscroll.options.zoomMax);
            }
            _infoPathIscroll.scrollToElement && _infoPathIscroll.scrollToElement(el, time, true, true);
        }
    }

    //点击某行重复表或者重复节之后，处理添加行和删除行按钮的显示
    function _dealRepeatTable(target) {

        var currRow=target.closest(".sui-sub-table-record");
        if(!currRow){
            return;
        }
        var tableName=currRow.getAttribute("tablename");
        var childrenData = s3scope.data.children[tableName];
        //没有权限操作重复表
        if(!childrenData || (!childrenData.allowAdd && !childrenData.allowDelete)) {
            return;
        }

        var btnDiv;
        var btnDivAll=document.querySelectorAll(".subTableBtn");
        [].forEach.call(btnDivAll,function(btn){
            btn.style.display="none";
        });

        if(!currRow.querySelector(".subTableBtn")){
            btnDiv = document.createElement('div');
            btnDiv.setAttribute("class","subTableBtn");
            btnDiv.innerHTML = '<i class="see-icon-v5-form-edit-circle"></i>';
            if(currRow.tagName.toLowerCase()=="tr"){ //重复表的按钮加到td下
                var currTd=currRow.childNodes[0];
                currTd.appendChild(btnDiv);
                //td外面可能套有多层元素，需要计算所在页面位置
                var tdLeft=_getElementPos(currTd).left;
                var tdPaddingLeft = parseInt(currTd.style.paddingLeft.replace("px","").replace("","0"));
                var wrapperLeft = _getElementPos(document.querySelector(".sui-form-content")).left;
                var btnWidth = btnDiv.offsetWidth;
                var marginLeft = -(btnWidth + (tdLeft-wrapperLeft-30) + tdPaddingLeft);
                marginLeft = marginLeft > (0-btnWidth) ? (0-btnWidth) : marginLeft;
                btnDiv.style.marginLeft = marginLeft + "px";
            }else{
                btnDiv.style.left="-26px";
                currRow.appendChild(btnDiv);
            }
            _bindSubTableBtnEvent(btnDiv);
            //设置父元素的position为relative
            btnDiv.parentNode.style.position="relative";
            btnDiv.parentNode.style.overflow="visible";
            //BUG OA-142944 (2018-4-11)微协调用表单模板同无法点击到添加重复行的按钮
            //找到所有父级的td元素，将style设置为visible
            var tds = btnDiv.parentNode.parents('td');
            tds.forEach(function(node){node.style.overflow="visible";});
        }else{
            btnDiv=currRow.querySelector(".subTableBtn");
            btnDiv.style.display="block";
        }
    }

    //刷新重复表或者重复节按钮状态
    function _refreshSubTableBtn(btnDiv) {
        var btnRow = btnDiv.closest(".sui-sub-table-record");
        if (btnRow) {
            var tableName=btnRow.getAttribute("tablename");
            var tableOperation=s3scope.data.children[tableName];
            if(tableOperation.allowAdd || tableOperation.allowDelete){
                btnDiv.style.display="block";
            }else{
                btnDiv.style.display="none";
            }
        }
    }
    //重复表按钮添加事件
    function _bindSubTableBtnEvent(btnDiv){
        btnDiv.addEventListener("tap",function() {
            var menus=[];
            var btnRow=this.closest(".sui-sub-table-record");
            var tableName=btnRow.getAttribute("tablename");
            var tableOperation=s3scope.data.children[tableName];
            if(tableOperation.allowAdd || tableOperation.allowDelete) {
                var record=btnRow.getAttribute("recordid");
                var index=btnRow.getAttribute("recordindex");
                if(tableOperation.allowAdd){
                    menus.push({"key":"copy","name": $.i18n('form.childrenTable.copy')});
                    menus.push({"key":"empty","name": $.i18n('form.childrenTable.add')});
                }
                if(tableOperation.allowDelete){
                    menus.push({"key":"del","name": $.i18n('form.childrenTable.delCurrent')});
                    menus.push({"key":"delAll","name": $.i18n('form.childrenTable.delAll')});
                }

                var locked = false;
                var timer = null;
                cmp.dialog.actionSheet(
                    menus, //权限菜单
                    $.i18n('form.btn.cancel'),
                    function (result) {
                        //BUG CAPF-14613 cmp.notification.close();
                        if (locked) {
                            if (timer) {
                                clearTimeout(timer);
                            }
                            timer = setTimeout(function () {
                                locked = false;
                            }, 5000);
                            return;
                        }
                        locked = true;
                        var items = s3scope.data.children[tableName].data;
                        var item = items[index];
                        if (result.key == "copy" || result.key == "empty") {
                            cmp.dialog.loading();
                            $.sui.addRecordInSubTable(result.key, tableName, item, function (err, record) {
                                cmp.dialog.loading(false);
                                if(!err){
                                    _refreshSubTableBtn(btnDiv);
                                    $.sui.refreshIScroll();
                                }
                                locked = false;
                            });
                        } else if (result.key == "collect") {
                            $.sui.collectSubTableRecords(tableName);
                        } else if (result.key == "del") {
                            if (items.length > 1) {
                                var msg = $.i18n('form.childrenTable.deleteConfirm');
                                $.notification.confirm(msg, function (num) {
                                    if (num == 1) {
                                        cmp.dialog.loading();
                                        $.sui.delRecordInSubTable('del', tableName, item, function (err, result) {
                                            cmp.dialog.loading(false);
                                            locked = false;
                                            if (err) {
                                                $.notification.alert('Error when calling $.sui.delRecordInSubTable!', null, '', $.i18n('form.btn.ok'));
                                            } else {
                                                items.splice(index, 1);
                                                _refreshSubTableBtn(btnDiv);
                                                $.sui.refreshIScroll();
                                            }
                                        });
                                    } else {
                                        locked = false;
                                    }
                                }, '', [$.i18n('form.btn.cancel'), $.i18n('form.btn.ok')]);
                            } else {
                                $.notification.alert($.i18n('form.childrenTable.deleteLastNotice'), null, '', $.i18n('form.btn.ok'));
                                locked = false;
                            }
                        } else if (result.key == "delAll") {

                            $.sui.onDeleteAllSubTableRecords(tableName, function(err, result){
                                if(!err){
                                    _refreshSubTableBtn(btnDiv);
                                    $.sui.refreshIScroll();
                                }
                            });
                        }
                    },
                    function () {
                    }
                );
            }
        });
    }

    //获取位置,返回位置对象，如：{left:23,top:32}
    function _getElementPos(el) {
        var ua = navigator.userAgent.toLowerCase();
        var isOpera = (ua.indexOf('opera') != -1);
        var isIE = (ua.indexOf('msie') != -1 && !isOpera); // not opera spoof
        if (el.parentNode === null || el.style.display == 'none') {
            return false;
        }
        var parent = null;
        var pos = [];
        var box;
        var rect = el.getBoundingClientRect();
        return { left : rect.left, top : rect.top };

        if (el.getBoundingClientRect) {//IE，google
            box = el.getBoundingClientRect();
            var scrollTop = document.documentElement.scrollTop;
            var scrollLeft = document.documentElement.scrollLeft;
            if(navigator.appName.toLowerCase()=="netscape"){//google
                scrollTop = Math.max(scrollTop, document.body.scrollTop);
                scrollLeft = Math.max(scrollLeft, document.body.scrollLeft);
            }
            return { left : box.left + scrollLeft, top : box.top + scrollTop };
        } else if (document.getBoxObjectFor) {// gecko
            box = document.getBoxObjectFor(el);
            var borderLeft = (el.style.borderLeftWidth) ? parseInt(el.style.borderLeftWidth) : 0;
            var borderTop = (el.style.borderTopWidth) ? parseInt(el.style.borderTopWidth) : 0;
            pos = [ box.x - borderLeft, box.y - borderTop ];
        } else {// safari & opera
            pos = [ el.offsetLeft, el.offsetTop ];
            parent = el.offsetParent;
            if (parent != el) {
                while (parent) {
                    pos[0] += parent.offsetLeft;
                    pos[1] += parent.offsetTop;
                    parent = parent.offsetParent;
                }
            }
            if (ua.indexOf('opera') != -1 || (ua.indexOf('safari') != -1 && el.style.position == 'absolute')) {
                pos[0] -= document.body.offsetLeft;
                pos[1] -= document.body.offsetTop;
            }
        }
        if (el.parentNode) {
            parent = el.parentNode;
        } else {
            parent = null;
        }
        while (parent && parent.tagName != 'BODY' && parent.tagName != 'HTML') { // account for any scrolled ancestors
            pos[0] -= parent.scrollLeft;
            pos[1] -= parent.scrollTop;
            if (parent.parentNode) {
                parent = parent.parentNode;
            } else {
                parent = null;
            }
        }
        return {
            left : pos[0],
            top : pos[1]
        };
    }

    function _recoverScrollStateFromCache (percent) {
        if (_infoPathIscroll) {
            var info = $.storage.get($.sui.getScrollStateKey(),true);
            $.storage.delete($.sui.getScrollStateKey(),true);
            if (info){
                info = $.parseJSON(info);
                _infoPathIscroll.zoom(info.scale);
                _infoPathIscroll.scrollTo(info.x,info.y,1,false);
            } else {
                _infoPathIscroll.zoom(percent);
            }
        }
    }

    function _saveIScrollState(){
        if (_infoPathIscroll) {
            var info={x:_infoPathIscroll.x,y:_infoPathIscroll.y,scale:_infoPathIscroll.scale};
            $.storage.save( $.sui.getScrollStateKey(),JSON.stringify(info),true);
        }
    }

    function _posToLastCtrl(options) {
        var key = $.sui.getLastPosKey();
        try {
            if (options.templateType == 'lightForm') {
                var lastPosCtrlId = $.storage.get(key, true);
                $.sui.nextTick(function(){
                    var ctrl = document.getElementById(lastPosCtrlId);
                    if (ctrl) {
                        //$.sui.lastPosCtrlId = lastPosCtrlId;
                        $.sui.scrollIntoView(ctrl);
                        $.sui.lastPosCtrlId = null;
                    }
                });

                //$.storage.delete(key ,true);
            } else {
            }
        } catch (e) {
            //$.storage.delete(key ,true);
            $.sui.lastPosCtrlId = null;
        }
    }

    //重置上次操作的值，从
    function _reSetLastOperation (options) {
        //先暂时这么写，他们的页面跳转有问题，如果从url中取key值，要跪
        var key = $.sui.getTempKey();

        if (key) {
            try {
                var lastData = JSON.parse($.storage.get(key, true));
                if (lastData && lastData.metadata) {
                    cmp.dialog.loading();
                    var model;
                    var records;
                    if (lastData.metadata.masterField) {
                        model = s3scope.data.master[lastData.metadata.name];
                    } else {
                        records = s3scope.data.children[lastData.metadata.ownerTableName].data.filter(function(o){return o.__id == lastData.metadata.recordId});
                        model = records.length > 0 ? records[0][lastData.metadata.name] : {};

                        //如果是重复表，触发一下当前重复行操作按钮的显示
                        if (s3scope.metadata.templateType == 'infopath') {
                            //只在原表单处才显示重复表按钮
                            $.sui.nextTick(function(){
                                var tr = document.querySelector('[recordid="' + records[0].__id + '"]');
                                if (tr) {
                                    _dealRepeatTable(tr);
                                }
                            });
                        }
                    }

                    //将数据绑定到给定的组件
                    //选人
                    var inputType = lastData.metadata.inputType == 'relation' ? lastData.metadata.finalInputType : lastData.metadata.inputType;
                    if (lastData.data) {
                        switch (inputType) {
                            //基础控件
                            case 'handwrite':
                            case 'barcode':
                            case 'linenumber':
                                cmp.dialog.loading(false);
                                break;
                            //关联控件
                            case 'relationform':
                                //调用后台接口
                                $.sui.dataService.capForm.dealFormRelation({
                                    selectArray: lastData.data.selectArray,
                                    fieldName: lastData.metadata.name,//当前操作字段
                                    rightId: s3scope.rightId,//权限id
                                    toFormId: lastData.metadata.relation.toRelationObj,//关联目标表单Id
                                    fromFormId: lastData.metadata.relation.fromRelationObj,//当前表单id
                                    recordId: lastData.metadata.recordId,//重复表记录id，如果操作操作重复表记录
                                    fromDataId: s3scope.formMasterId,//表单数据id
                                    moduleId: s3scope.moduleId,//正文类型id
                                    data: $.sui.reduceSubmitData(s3scope.data),
                                    attachmentInputs: $.sui.getAttachments(s3scope.attachmentInputs)
                                }, function(err, data){
                                    if (err) {
                                        cmp.dialog.loading(false);
                                        $.notification.alert(err.message || 'Error when calling dealFormRelation!', null, '', $.i18n('form.btn.ok'));
                                        return;
                                    }

                                    $.sui.refreshFormData((records && records.length > 0) ? records[0] : null, !data.results ? data : data.results, function(){
                                        cmp.dialog.loading(false);
                                    });
                                });
                                break;
                            case 'relation':
                            case 'project':
                                cmp.dialog.loading(false);
                                break;
                            //组织控件
                            case 'member':
                            case 'account':
                            case 'department':
                            case 'post':
                            case 'level':
                                var ids = [];
                                var names = [];
                                console.log(lastData.data);
                                (lastData.data.orgResult || []).forEach(function(item){
                                    if (typeof item == 'string') {
                                        item = JSON.parse(item);
                                    }
                                    ids.push(item.id);
                                    names.push(item.name);
                                });

                                //is是英文逗号隔开，display是中文顿号隔开
                                model.value = ids.join(',');
                                model.display = names.join('、');
                                $.sui.dataService.capForm.dealOrgFieldRelation({
                                    formDataId: s3scope.formMasterId,
                                    formId: s3scope.formId,
                                    moduleId: s3scope.moduleId,
                                    rightId: s3scope.rightId,
                                    fieldName: lastData.metadata.name,
                                    recordId: lastData.metadata.recordId,
                                    selectType: lastData.metadata.finalInputType,
                                    orgId: model.value,
                                    data: $.sui.reduceSubmitData(s3scope.data),
                                    attachmentInputs: $.sui.getAttachments(s3scope.attachmentInputs)
                                }, function(err, data){
                                    if (err) {
                                        cmp.dialog.loading(false);
                                        $.notification.alert(err.message || 'Error when calling dealOrgFieldRelation!', null, '', $.i18n('form.btn.ok'));
                                        return;
                                    }

                                    $.sui.refreshFormData((records && records.length > 0) ? records[0] : null, !data.results ? data : data.results, function(){
                                        cmp.dialog.loading(false);
                                    });
                                });
                                break;
                            case 'multimember':
                            case 'multiaccount':
                            case 'multidepartment':
                            case 'multipost':
                            case 'multilevel':
                                var ids = [];
                                var names = [];
                                console.log(lastData.data);
                                (lastData.data.orgResult || []).forEach(function(item){
                                    if (typeof item == 'string') {
                                        item = JSON.parse(item);
                                    }
                                    ids.push(item.id);
                                    names.push(item.name);
                                });

                                //is是英文逗号隔开，display是中文顿号隔开
                                model.value = ids.join(',');
                                model.display = names.join('、');

                                var options = {
                                    formMasterId: s3scope.formMasterId,
                                    formId: s3scope.formId,
                                    moduleId: s3scope.moduleId,
                                    rightId: s3scope.rightId,
                                    fieldName: lastData.metadata.name,
                                    recordId: lastData.metadata.recordId,
                                    data: $.sui.reduceSubmitData(s3scope.data),
                                    attachmentInputs: $.sui.getAttachments(s3scope.attachmentInputs)
                                };

                                $.sui.dataService.capForm.calculate(options, function(err, data){
                                    if (err) {
                                        cmp.dialog.loading(false);
                                        $.notification.alert(err.message || 'Error when calling calculate!', null, '', $.i18n('form.btn.ok'));
                                        return;
                                    }

                                    $.sui.refreshFormData((records && records.length > 0) ? records[0] : null, !data.results ? data : data.results, function(){
                                        cmp.dialog.loading(false);
                                    });
                                });
                                break;
                            //扩展控件
                            case 'attachment':
                            case 'image':
                            case 'document':
                            case 'outwrite':
                            case 'externalwrite-ahead':
                                cmp.dialog.loading(false);
                                break;
                            case 'exchangetask':
                                $.sui.dataService.capForm.dealDeeRelation({
                                    contentDataId : s3scope.formMasterId,
                                    formId: s3scope.formId,
                                    moduleId: s3scope.moduleId,
                                    rightId: s3scope.rightId,
                                    fieldName: lastData.metadata.name,
                                    recordId: lastData.metadata.recordId,
                                    masterId: lastData.data.masterId,
                                    detailRows: lastData.data.detailRows,
                                    data: $.sui.reduceSubmitData(s3scope.data),
                                    attachmentInputs: $.sui.getAttachments(s3scope.attachmentInputs)
                                }, function(err, data){
                                    if (err) {
                                        cmp.dialog.loading(false);
                                        $.notification.alert(err.message || 'Error when calling dealDeeRelation!', null, '', $.i18n('form.btn.ok'));
                                        return;
                                    }

                                    $.sui.refreshFormData((records && records.length > 0) ? records[0] : null, !data.results ? data : data.results, function(){
                                        cmp.dialog.loading(false);
                                    });
                                });
                                break;
                            case 'querytask':
                                break;
                            //地图位置控件
                            case 'mapmarked':
                            case 'maplocate':
                            case 'mapphoto':
                              cmp.dialog.loading(false);
                              break;
                            //自定义控件
                            case 'customcontrol':
                              cmp.dialog.loading(false);
                              model.display = lastData.data.display;
                              model.value = lastData.data.value;
                              break;
                            default:
                                cmp.dialog.loading(false);
                                break;
                        }
                    } else {
                        cmp.dialog.loading(false);
                    }
                    if (s3scope.metadata.templateType == 'lightForm') {
                        $.sui.nextTick(function(){
                            var ctrl = document.getElementById(lastData.metadata.ctrlId);
                            $.sui.scrollIntoView(ctrl);
                        });
                    }
                }

                //用完就删，好习惯
                $.storage.delete(key ,true);
            } catch (e) {
                console.log(e);
                $.notification.alert('Error when calling _reSetLastOperation!', null, '', $.i18n('form.btn.ok'));
                $.storage.delete(key ,true);
                cmp.dialog.loading(false)
            }
        }
    }

    function _prePareData () {
        var start = new Date().getTime();
        //先将s3scope下非data属性冻结
        Object.keys(s3scope).forEach(function(key){
                if (['data', 'allowCheck', 'allowQRScan', 'subTableExpandInfo', 'unShowSubDataIdMap'].indexOf(key) != -1){
                } else {
                    Object.defineProperty(s3scope, key, {configurable:false});
                }
        });

        //循环主表数据的每一个字段
        if (s3scope.data) {
            Object.keys(s3scope.data.master).forEach(function(field){
                if (field.startsWith('field')) {
                    var fieldData = s3scope.data.master[field];
                    Object.keys(fieldData || {}).forEach(function(attr){
                        if (attr != 'value') {
                            Object.defineProperty(fieldData, attr, {configurable:false});
                        }
                    });
                }
            });

            //循环所有子表
            Object.keys((s3scope.data.children || {})).forEach(function(subTable){
                var data = s3scope.data.children[subTable].data;
                s3scope.data.children[subTable].selected = !!s3scope.data.children[subTable].selected;
                (data || []).forEach(function(record){
                    record.selected = !!record.selected;
                    Object.keys(record).forEach(function(field){
                        if (field.startsWith('field')) {
                            var fieldData = record[field];
                            Object.keys(fieldData || {}).forEach(function(attr){
                                if (attr != 'value') {
                                    Object.defineProperty(fieldData, attr, {configurable:false});
                                }
                            });
                        }
                    });
                });

            });
        }

        var end = new Date().getTime();
        console.log(start);
        console.log(end);
        console.log(end - start);
    }

    function _render (options, templateFunc, usedCache) {
        //如果contentList【0】的contentType为10，表示是转发后的表单，直接放一个iframe，嵌入进去
        if (s3scope.contentList.length > 0 && s3scope.contentList[0].contentType == '10') {
            $.sui.renderForwardForm(options, formRoot);
            return;
        }
        $.sui.formDestroy(options);
        templateFunc.call(this, options, window.s3scope);
        _prePareData();
        if (_vue) {
            _vue.$destroy();
            _vue = null;
        }

        if (options.containerId && typeof Vue != 'undefined') {
            _vue = new Vue({
                el: '#' + options.containerId,
                data: {s3scope: s3scope},
                methods: {
                    onDeleteAllSubTableRecords: function (tableName)     {

                        $.sui.onDeleteAllSubTableRecords(tableName);
                    },
                    onCollectSubTableRecords: function (tableName)     {
                        //调用汇总重复表逻辑
                        $.sui.collectSubTableRecords(tableName);

                    },
                    onSelectAll: function (tableName) {
                        s3scope.data.children[tableName].selected = !s3scope.data.children[tableName].selected;
                        (s3scope.data.children[tableName].data || []).forEach(function(item){
                            item.selected = s3scope.data.children[tableName].selected;
                        });
                    },
                    onLoadMore: function (tableName) {
                        //默认下一页显示20条记录
                        if (!s3scope.unShowSubDataIdMap || !s3scope.unShowSubDataIdMap[tableName]) {
                            return;
                        }
                        cmp.dialog.loading();
                        var ids = s3scope.unShowSubDataIdMap[tableName].slice(0, 20);
                        var opts = {
                            dataId: s3scope.formMasterId,
                            formId: s3scope.formId,
                            moduleId: s3scope.moduleId,
                            rightId: s3scope.rightId,
                            tableName: tableName,
                            nextPage: ids.join(','),
                            data: $.sui.reduceSubmitData(s3scope.data),
                            viewState: options.viewState
                        };
                        $.sui.dataService.capForm.showMore(opts, function(err, data){
                            if (err) {
                                cmp.dialog.loading(false);
                                $.notification.alert('Error when calling showMore!', null, '', $.i18n('form.btn.ok'));
                                return;
                            }

                            //如果查询成功再splice 20
                            if (data.results.data && data.results.data.children && data.results.data.children[tableName]) {
                                s3scope.unShowSubDataIdMap[tableName].splice(0, 20);
                                $.sui.refreshFormData(null, data.results);
                                $.sui.refreshIScroll();
                            }
                            cmp.dialog.loading(false);
                        });
                    }
                }
            });
            window.testVue = _vue;
        }

        //如果使用了数据缓存，才读取其他缓存进行处理、
        if (usedCache) {
            _renderFromCache(options);
        }

        //表单渲染完后，triiger一个通知事件
        _triggerAfterFirstRender();
    }

    function _renderFromCache (options) {
        //重新定位到上一次FOCUS的控件
        _posToLastCtrl(options);
        //重新设置上一次操作
        _reSetLastOperation(options);
        //如果缓存中有提示，则显示异常
        $.sui.showFormErrorTips(options);
    }

    function _beforePageRedirectHandler (e) {
        var dataKey = $.sui.getCachedDataKey();
        $.storageDB.save(dataKey, window.s3scope,function(result){});
        //$.storage.save(dataKey, JSON.stringify(window.s3scope), true);
        if ($.sui.lastPosCtrlId) {
            var lastPosKey = $.sui.getLastPosKey();
            $.storage.save(lastPosKey, $.sui.lastPosCtrlId, true);
        }

        //保存iscroll缩放位置的状态
        if (window.s3scope && window.s3scope.metadata && window.s3scope.metadata.templateType == 'infopath') {
            _saveIScrollState();
        }
    }

    function _beforePageRedirect (options) {
        document.removeEventListener('beforepageredirect', _beforePageRedirectHandler);
        document.addEventListener('beforepageredirect', _beforePageRedirectHandler);
    }

    $.sui.collectSubTableRecords = function (tableName) {
        s3scope.subTableExpandInfo[tableName] = true;
        var opts = {
            formDataId: s3scope.formMasterId,
            formId: s3scope.formId,
            moduleId: s3scope.moduleId,
            rightId: s3scope.rightId,
            tableName: tableName,
            data: $.sui.reduceSubmitData(s3scope.data),
            attachmentInputs: $.sui.getAttachments(s3scope.attachmentInputs)
        };
        cmp.dialog.loading();
        $.sui.dataService.capForm.generateSubData(opts, function(err, data){
            if (err) {
                cmp.dialog.loading(false);
                $.notification.alert('Error when calling generateSubData!', null, '', $.i18n('form.btn.ok'));
                return;
            }
            console.log(data);
            s3scope.data.children[tableName]
            if (s3scope.data.children[tableName] && s3scope.data.children[tableName].data) {
                s3scope.data.children[tableName].data.splice(0);
            }
            $.sui.refreshFormData(null, !data.results ? data : data.results, function(){
                cmp.dialog.loading(false);
            });
            $.sui.refreshIScroll();
        });
    }

    $.sui.cacheFormData = function (callback) {
        var dataKey = $.sui.getCachedDataKey();
        if ($.sui.lastPosCtrlId) {
            var lastPosKey = $.sui.getLastPosKey();
            $.storage.save(lastPosKey, $.sui.lastPosCtrlId, true);
        }
		$.storageDB.save(dataKey, window.s3scope,function(result){
			//判断一下是否成功
			//OA-161951 移动端调用新建或修改CAP3表单数据，控件中录入内容后，切换轻/原表单会导致数据丢失。
			//storageDB save 异步导致的问题
			if (!result.success) {
				$.notification.alert('缓存表单数据失败！', null, '', $.i18n('form.btn.ok'));
			} else {
				typeof callback == 'function' && callback();
			}
		});
        //$.storage.save(dataKey, JSON.stringify(window.s3scope), true);
    }

    $.sui.s3scopeInit = function (options, data) {
        if (!$.sui.cacheKeyMap) {
            $.sui.initCacheKeyMap(options);
        }
        var indexParam = options.indexParam;
        if (data.results && data.contentList && data.contentList.length > 0) {
            data.results.formMasterId = data.contentList[indexParam].contentDataId;
            data.results.formId = data.contentList[indexParam].contentTemplateId;
            data.results.rightId = data.contentList[indexParam].rightId;
            data.results.moduleType = data.contentList[indexParam].moduleType;
        }

        window.s3scope = data.results;
        window.s3scope.contentList = data.contentList;
        //判断options中是否有summaryId，如果有summaryId，则将moduleId设置为summaryId，
        // 表单其他接口参数中使用的moduleId都为summaryId。
        window.s3scope.moduleId = !options.summaryId ? options.moduleId : options.summaryId;
        window.s3scope.affaireId = options.affairId;
        window.s3scope.allowCheck = !!options.allowCheck;
        window.s3scope.allowQRScan = !!options.allowQRScan;
        window.s3scope.indexParam = options.indexParam;
        window.s3scope.templateType = options.templateType;

        //初始化所有附件的map，在bind的时候，将各字段的值填进去
        window.s3scope.attachmentInputs = window.s3scope.attachmentInputs || {};
        window.s3scope.signatures = window.s3scope.signatures || {};
    }

    //提交之前优化一下data，节省流量
    $.sui.reduceSubmitData = function () {
        if (!window.s3scope) {
            return {};
        }

        var submitData = {master:{}, children:{}};
        var masterData = s3scope.data.master;
        if (masterData) {
            Object.keys(masterData).forEach(function(key){
                if (key.indexOf('field') != -1) {
                    var model = masterData[key];
                    if (model) {
                        submitData.master[key] = {value: model.value == '     ' ? '' : model.value}; //去除初始化的5个空格，后续有时间优化一下5个空格的初始化的逻辑
                        if (model.__state) {
                            submitData.master[key].__state = model.__state;
                        }
                    }
                }
            });
        }

        //如果有子表
        var childrenData = s3scope.data.children;
        if (childrenData) {
            Object.keys(childrenData).forEach(function(tableName){
                if (childrenData[tableName] && childrenData[tableName].data instanceof Array) {
                    submitData.children[tableName] = {data:[]};
                    childrenData[tableName].data.forEach(function(recordData){
                        var newRecordData = {__id: recordData.__id};
                        var recordId = recordData.__id;
                        Object.keys(recordData).forEach(function(key){
                            if (key.indexOf('field') != -1) {
                                var model = recordData[key];
                                if (model) {
                                    newRecordData[key] = {value: model.value == '     ' ? '' : model.value};
                                    if (model.__state) {
                                        newRecordData[key].__state = model.__state;
                                    }
                                }
                            }
                        });

                        //将处理过后的记录添加进 submitData.children
                        submitData.children[tableName].data.push(newRecordData);
                    });

                }
            });
        }

        return submitData;
    }

    //以前专门给狗老板写的组装轻表单数据的接口，待新的原表单正常run以后，这个接口干掉
    $.sui.s3scopeDataConverter = function() {
        if (!window.s3scope) {
            return;
        }

        window.s3scope.attachmentInputs = {};
        //window.s3scope.signatures = {};
        var ret = {};
        if (s3scope.data.master && s3scope.metadata.fieldInfo) {
            var masterData = s3scope.data.master;
            Object.keys(masterData).forEach(function(key){
                if (key.indexOf('field') != -1) {
                    var model = masterData[key];
                    var fieldInfo = s3scope.metadata.fieldInfo[key];
                    if (model && fieldInfo) {
                        var ctrlId = 'master|' + fieldInfo.name;
                        if (['image', 'document', 'attachment', 'barcode', 'mapphoto'].indexOf(fieldInfo.finalInputType) != -1) {
                            s3scope.attachmentInputs[ctrlId] = model.attData;
                        }
                    }

                }
            });
        }

        //处理children
        var childrenData = s3scope.data.children;
        var childrenMetaData = s3scope.metadata.children;
        if (childrenData && childrenMetaData) {
            Object.keys(childrenData).forEach(function(tableName){
                if (childrenData[tableName] && childrenData[tableName].data instanceof Array && childrenMetaData[tableName] && childrenMetaData[tableName].fieldInfo) {
                    childrenData[tableName].data.forEach(function(recordData){
                        var recordId = recordData.__id;
                        Object.keys(recordData).forEach(function(key){
                            if (key.indexOf('field') != -1) {
                                var model = recordData[key];
                                var fieldInfo = childrenMetaData[tableName].fieldInfo[key];
                                if (model && fieldInfo) {
                                    var ctrlId = tableName + '|' + recordId + '|' + fieldInfo.name;
                                    if (['image', 'document', 'attachment', 'barcode', 'mapphoto'].indexOf(fieldInfo.finalInputType) != -1) {
                                        s3scope.attachmentInputs[ctrlId] = model.attData;
                                    }
                                }

                            }
                        });
                    });

                }
            });
        }

        //增加附件提交设置，将所有含有attData的数组拼接，将属性加一个前缀 "attachment_"
        ret.attachmentInputs = $.sui.getAttachments(s3scope.attachmentInputs);
        //ret.signatures = $.sui.getSignatures(s3scope.signatures);
        return ret;
    }

    function _init (options, templateFunc, callback) {
        //判断sessionStorage里面是否有数据
        //生成保存数据的key值
        $.sui.initCacheKeyMap(options);
        var key = $.sui.getCachedDataKey();
        _beforePageRedirect(options);
        var storeFlagKey = $.sui.getStoreFlagKey();
        var storeFlag = sessionStorage.getItem(storeFlagKey) === '1';
        //var tempData = $.storage.get(key, true);
        $.storageDB.get(key, function(result){
            if(result.success && result.data && storeFlag){
                window.s3scope = result.data;
                //初始化所有附件的map，在bind的时候，将各字段的值填  进去
                window.s3scope.allowCheck = !!options.allowCheck;
                window.s3scope.allowQRScan = !!options.allowQRScan;
                window.s3scope.attachmentInputs = window.s3scope.attachmentInputs || {};
                window.s3scope.signatures = window.s3scope.signatures || {};
                window.s3scope.indexParam = options.indexParam;
                //判断options中是否有summaryId，如果有summaryId，则将moduleId设置为summaryId，
                // 表单其他接口参数中使用的moduleId都为summaryId。
                window.s3scope.moduleId = !options.summaryId ? options.moduleId : options.summaryId;
                window.s3scope.affaireId = options.affairId;
                window.s3scope.templateType = options.templateType;
                //判断options里面是否有回调
                if (typeof options.callback == 'function') {
                    options.callback(window.s3scope.contentList);
                }

                //如果options中的templateType与 当前数据中metadata.templateType 不同则发请求切换模板
                _switchTemplate(options, function(err, templateData){

                    if (!err && templateData && (templateData.isForwardForm || templateData.metadata)) {
                        window.s3scope.metadata = templateData.metadata;
                    } else {
                        $.notification.alert('表单切换时模板加载异常!', function(){
                            callback && callback({message:'表单切换时模板加载异常!'});
                        }, '', $.i18n('form.btn.ok'));

                    }

                    try {
                        _render(options, templateFunc, true);
                        //用完就删，好习惯
                        //$.storage.delete(key ,true);
                        $.storageDB.delete(key,function(ret){});
                        callback && callback();
                    } catch (e) {
                        console.log(e);
                        //$.storage.delete(key ,true);
                        $.storageDB.delete(key,function(ret){});
                        callback && callback(e);
                    }
                });
            } else {
                $.sui.dataService.capForm.showFormData(options, function(err, data){
                    if (err) {
                        $.notification.alert(err.message || err.responseText, function(){
                            callback && callback(err);
                        }, '', $.i18n('form.btn.ok'));
                        return;
                    } else if (data.success == false) {
                        $.notification.alert('Error when calling showFormData!', function(){
                            callback && callback(err);
                        }, '', $.i18n('form.btn.ok'));
                        return;
                    }

                    $.sui.s3scopeInit(options, data);
                    sessionStorage.setItem(storeFlagKey, '1');

                    //判断options里面是否有回调
                    if (typeof options.callback == 'function') {
                        options.callback(window.s3scope.contentList);
                    }

                    try {
                        //如果从后台取的数据，获取所有重复表是否展开的值
                        window.s3scope.subTableExpandInfo = {};
                        if (window.s3scope.metadata) {
                            Object.keys(window.s3scope.metadata.children || {}).forEach(function(subTableName){
                                window.s3scope.subTableExpandInfo[subTableName] = window.s3scope.metadata.children[subTableName].expand || false;
                            });
                        }
                        _render(options, templateFunc, false);
                        //用完就删，好习惯
                        //$.storage.delete(key ,true);
                        $.storageDB.delete(key,function(ret){});
                        callback && callback();
                    } catch (e) {
                        console.log(e);
                        //$.storage.delete(key ,true);
                        $.storageDB.delete(key,function(ret){});
                        callback && callback(e);
                    }
                });
            }
        });
    }

    //表单加载完成触发一个事件
    function _triggerAfterFirstRender () {
        SuiEvent.trigger({target: document, eventName: 'sui_form_afterFormRender', data: {
            contentDataId : s3scope.formMasterId,
            formId: s3scope.formId,
            moduleId: s3scope.moduleId,
            rightId: s3scope.rightId,
            metadata: s3scope.metadata
        }}, function(err, result){});
    }

    function _switchTemplate (options, callback) {
        //如果options中的参数跟s3scope缓存中的参数一致，则不需要重新加载,s3scope.rightId 是indexParam取出来的，options更全一点
        //如果contentlist【0】的contentType是10，表示是转发过后的表单，直接返回
        if (window.s3scope && window.s3scope.contentList.length > 0 && window.s3scope.contentList[0].contentType == '10') {
            callback && callback(null, {metadata: window.s3scope.metadata, isForwardForm: true});
        } else if (window.s3scope && window.s3scope.metadata && window.s3scope.metadata.templateType == options.templateType
            && window.s3scope.indexParam == options.indexParam && options.rightId.indexOf(window.s3scope.rightId) != -1) {
            callback && callback(null, {metadata: window.s3scope.metadata});
        } else {
            //切换表单的时候，先将缓存中的异常信息干掉
            var key = $.sui.getErrorInfoKey();
            $.storage.delete(key, true);
            options.formId = window.s3scope.formId;
            options.contentDataId = window.s3scope.formMasterId;
            $.sui.dataService.capForm.loadTemplate(options, function(err, data){
                console.log(data);
                callback && callback(err, data);
            });
        }
    }

    function _buildCtrlDom (inputAttrObj, options, inputType, auth) {
        var html = '';
        switch (inputType) {
            //基础控件
            case 'text':
                inputAttrObj['value'] = options.model.value.escapeHTML();
                if (auth == 'browse' || options.fieldInfo.inputType == 'relationform') {
                    inputAttrObj['readonly'] = 'true';
                    inputAttrObj['class'] += ' sui-hide';
                    html += '<input ' + $.sui.attrBuilder(inputAttrObj) + '/>';
                    //如果是浏览态的时候，判断一下formatType是否为urlPage,
                    //2017-10-10在浏览态时，增加一个正则判断是否为url，可能会有效率问题
                    if (options.fieldInfo.formatType == 'urlPage' || $.sui.urlAssert(options.model.display)) {
                        html = '<div ' +  $.sui.attrBuilder({url:options.model.value.escapeHTML(), class:'sui-input-url sui-form-ctrl-value-display sui-text-multi', id: options.fieldInfo.name}) + '>'  + options.model.display.escapeHTML() + '</div>'
                    } else {
                        html += '<div ' + $.sui.attrBuilder({class: 'sui-form-ctrl-value-display sui-text-multi', id: options.fieldInfo.name}) + '>' + options.model.display.escapeHTML() + '</div>';
                    }

                } else {
                    html += '<input ' + $.sui.attrBuilder(inputAttrObj) + '/>';
                }
                break;
            case 'textarea':
                inputAttrObj['value'] = options.model.value.escapeHTML();
                if (options.fieldInfo.inputType == 'relationform') {
                    inputAttrObj['readonly'] = 'true';
                }
                //2017-10-10在浏览态时，增加一个正则判断是否为url，可能会有效率问题
                if (auth == 'browse' && (options.fieldInfo.formatType == 'urlPage' || $.sui.urlAssert(options.model.display))) {
                    html = '<div ' +  $.sui.attrBuilder({url:options.model.value.escapeHTML(), class:'sui-input-url sui-form-ctrl-value-display sui-text-multi', id: options.fieldInfo.name}) + '>'  + options.model.display.escapeHTML() + '</div>'
                } else {
                    html += '<textarea ' + $.sui.attrBuilder(inputAttrObj) + '>' + options.model.value + '</textarea>';
                }
                break;
            case 'checkbox':
                inputAttrObj['type'] = 'checkbox';
                inputAttrObj['value'] = options.model.value;
                inputAttrObj['checked'] = options.model.value;
                inputAttrObj['class'] += ' see-icon';
                if (auth == 'browse') {
                    inputAttrObj['disabled'] = true;
                    inputAttrObj['readonly'] = true;
                }
                html += '<input ' + $.sui.attrBuilder(inputAttrObj) + '/>';
                break;
            case 'radio':
                inputAttrObj['value'] = options.model.value;
                inputAttrObj['readonly'] = 'true';
                inputAttrObj['class'] += ' sui-hide';
                html += '<input ' + $.sui.attrBuilder(inputAttrObj) + '/>';
                //增加radio group !!!注意，这里一定要写未form，用于限制radio组的作用域，不然其他地方的radio也会共用一个change事件
                html += '<form class="sui-form-ctrl-value-display sui-radio-group" id="radiogroup_' + options.fieldInfo.name  +  '">';
                options.model.items = options.model.items || [];
                var items = options.model.items;
                var name = 'radio_' + options.fieldInfo.name;
                var itemAttr = {name: name};
                if (auth == 'browse') {
                    itemAttr['disabled'] = true;
                    itemAttr['readonly'] = true;
                    itemAttr['id'] = options.fieldInfo.name;
                }
                items.forEach(function(item){
                    itemAttr.value = item.value;
                    html += '<div class="sui-radio-item">';
                    html += '<input type="radio"' + $.sui.attrBuilder(itemAttr) +' /><label>' + (item.text || item.display || '').escapeHTML() + '</label>';
                    html += '</div>';
                });
                html += '</form>';
                break;
            case 'select':
                inputAttrObj['value'] = options.model.value;
                inputAttrObj['readonly'] = 'true';
                inputAttrObj['class'] += ' sui-hide';
                html += '<input ' + $.sui.attrBuilder(inputAttrObj) + '/>';
                //增加静态显示的div
                //console.log(options.model.items.filter(function(o){return o.value==options.model.value}));
                var selectItem = (options.model.items || []).filter(function(o){return o.value==options.model.value});
                var display = selectItem.length==0 ? options.model.display : (selectItem[0].text || selectItem[0].display || '');
                if (options.fieldInfo.formatType == 'image4image') {
                    //图片枚举不需要转义了
                    display = (display || options.fieldInfo.desc || '');
                } else {
                    display = (display || options.fieldInfo.desc || '').escapeHTML();
                }
                if (s3scope.metadata.templateType == 'infopath' && auth == 'edit') {
                    display = '<div class="sui-text-single">' + display + '</div>';
                }
                html += '<div ' + $.sui.attrBuilder({class: 'sui-form-ctrl-value-display ' + ((!options.model.display || !options.model.value) ? 'sui-form-placeholder' : ''), id: options.fieldInfo.name}) + '>';
                html += display + '</div>';
                html += '<i class="see-icon-v5-form-pull-down"></i>';
                break;
            case 'date':
            case 'datetime':
                inputAttrObj['value'] = options.model.value;
                inputAttrObj['readonly'] = 'true';
                inputAttrObj['class'] += ' sui-hide';
                //var format = inputType == 'date' ? 'yyyy-MM-dd' : 'yyyy-MM-dd hh:mm';
                var format = _getDateFormatType(inputType, options.fieldInfo.formatType);
                html += '<input ' + $.sui.attrBuilder(inputAttrObj) + '/>';
                //增加静态显示的div
                //做了一个兼容，日期格式用display来
                var dt = new Date(options.model.value);
                //BUG_紧急_V5_V6.0sp1_北京链商电子商务有限公司_微协同发起表单的时候，设置了系统时间初始值的控件，初始值没带出来_20170111030304
                if (isNaN(dt)) {
                    var arr = options.model.value.split(/[- :]/);
                    if (arr.length >= 5) {
                        dt = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4]);
                    } else if (arr.length >= 3 ) {
                        dt = new Date(arr[0], arr[1]-1, arr[2]);
                    }
                }

                var display = isNaN(dt) ? '' : dt.format(format);
                var text = (display || options.fieldInfo.desc || '');
                //如果是原表单，并且是编辑权限，才是单行模式，浏览态自动撑开
                if (s3scope.metadata.templateType == 'infopath' && auth == 'edit') {
                    text = '<div class="sui-text-single">' + text + '</div>';
                }
                html += '<div ' + $.sui.attrBuilder({class: 'sui-form-ctrl-value-display ' + (!options.model.value ? 'sui-form-placeholder' : ''), id: options.fieldInfo.name}) + '>' + text + '</div>';
                if (display) {
                    html += '<i action="clear-value" class="see-icon-v5-form-close-circle-fill"></i>';
                } else {
                    html += '<i class="see-icon-v5-form-pull-down"></i>';
                }
                break;
            case 'flowdealoption':
            case 'lable':
            case 'label':
                inputAttrObj['value'] = options.model.value;
                inputAttrObj['readonly'] = 'true';
                inputAttrObj['class'] += ' sui-hide';
                html += '<input ' + $.sui.attrBuilder(inputAttrObj) + '/>';
                //静态标签先不做html escape，有可能流程处理意见，就需要html
                html += '<div ' + $.sui.attrBuilder({class: 'sui-form-ctrl-value-display sui-text-multi sui-form-ctrl-static ' + (!options.model.value ? 'sui-form-placeholder' : ''), id: options.fieldInfo.name}) + '>' + (options.model.display || options.fieldInfo.desc || '') + '</div>';
                break;
            case 'handwrite':
                inputAttrObj['value'] = options.model.value;
                inputAttrObj['readonly'] = 'true';
                inputAttrObj['class'] += ' sui-hide';
                html += '<input ' + $.sui.attrBuilder(inputAttrObj) + '/>';
                html += '<div ' + $.sui.attrBuilder({class: 'sui-form-ctrl-value-display sui-form-ctrl-handwrite', id: options.fieldInfo.name}) + '>';

                var src = '';
                if (options.model.signature && options.model.signature.picData && options.model.signature.fieldValue) {
                    src = ' src="data:image/png;base64,' + options.model.signature.picData + '" ';
                }
                html += '<img ' + src  + ' filename="' + (options.model.display || options.fieldInfo.desc || '') + '">';
                html += '</div>';
                html += '<i class="see-icon-v5-form-pull-right"></i>';
                break;
            case 'barcode':
                //如果是relation或者relationform，则修改__state
                if (options.fieldInfo.inputType == 'relation' || options.fieldInfo.inputType == 'relationform') {
                    options.model.__state = 'modified';
                }
                inputAttrObj['value'] = options.model.value;
                inputAttrObj['readonly'] = 'true';
                inputAttrObj['class'] += ' sui-hide';
                html += '<input ' + $.sui.attrBuilder(inputAttrObj) + '/>';
                html += '<div ' + $.sui.attrBuilder({class: 'sui-form-ctrl-value-display sui-form-ctrl-barcode', id: options.fieldInfo.name}) + '>';
                //二维码图片
                options.model.attData = options.model.attData || [];
                if (options.model.attData instanceof  Array && options.model.attData.length > 0) {
                    var targetServer = $.sui.dataService.debug ? $.sui.dataService.targetServer : $.serverIp;
                    //var url = targetServer + '/seeyon/rest/attachment/file/' + options.model.attData[0].fileUrl;
                    //图片的地址用小强提供的接口
                    var url = targetServer + '/seeyon/fileUpload.do?method=showRTE&showType=small&type=image&fileId=' + options.model.attData[0].fileUrl + '&createDate=' + new Date(Number(options.model.attData[0].createdate)).format('yyyy-MM-dd');
                    html += '<img src="' + url + '" url="' + url + '" fileid="' + options.model.attData[0].fileUrl + '" filename="' + options.model.attData[0].filename + '">';

                    if (auth == 'edit') {
                        html += '    <i class="see-icon-v5-form-close-circle-fill"></i>';
                    }
                }

                html += '</div>';
                if (auth == 'edit') {
                    html += '<i class="see-icon-v5-form-qrcode"></i>';
                }
                break;
            //关联控件
            case 'relationform':
                var finalInputType = options.fieldInfo.finalInputType;
                //关联控件过来的字段，只能只读
                //如果toRelationAttr是flowName，需要做穿透
                if (options.fieldInfo.relation && options.model.through) {
                    if (options.fieldInfo.relation.toRelationFormType == '1') {
                        //有流程的标题穿透
                        html += _buildCtrlDom(inputAttrObj, options, 'relationform-flow-name', $.sui.getFieldAuth('browse'));
                    } else if (['2', '3'].indexOf(options.fieldInfo.relation.toRelationFormType) != -1) {
                        //无流程穿透，如果在浏览态的时候，需要放置一个穿透图标
                        html += _buildCtrlDom(inputAttrObj, options, finalInputType, $.sui.getFieldAuth('browse'));
                        if (options.model.auth == 'browse') {
                            var targetId = 'form_relation_to_' + options.fieldInfo.name + '_' + ($.sui.uuid++);
                            html += '<i id="' + targetId + '" class="see-icon-v5-form-relation-to relationform allow-click-relationform"></i>';
                            $.sui.doUpdateRelationFormInfo(targetId, options, options.fieldInfo.name, options.model.display);
                        }
                    }

                } else {
                    html += _buildCtrlDom(inputAttrObj, options, finalInputType, $.sui.getFieldAuth('browse'));
                }
                if (options.model.auth == 'edit') {
                    html += '<i class="see-icon-v5-form-ic-form-fill relationform"></i>';
                }
                break;
            case 'relationform-flow-name':
                //流程名称穿透，编辑，浏览态都可以穿透，事件绑定在文字上。
                //有流程名称穿透和外部写入才进入此逻辑，除此外，都是无流程穿透
                inputAttrObj['value'] = options.model.value.escapeHTML();
                inputAttrObj['readonly'] = 'true';
                inputAttrObj['class'] += ' sui-hide';
                html += '<input ' + $.sui.attrBuilder(inputAttrObj) + '/>';
                html += '<div ' + $.sui.attrBuilder({class: 'sui-form-ctrl-value-display', id: options.fieldInfo.name}) + '>';

                //将data中的关联信息,装填
                var targetId = 'flow_name_' + options.fieldInfo.name + '_' + ($.sui.uuid++);
                html += '<div id="' + targetId + '"' + $.sui.attrBuilder({class: 'sui-form-ctrl-flow-name allow-click-relationform'}) + '>' + options.model.display.escapeHTML() + '</div>';
                $.sui.doUpdateRelationFormInfo(targetId, options, options.fieldInfo.name, options.model.display);

                //如果有relationList,则继续装填
                if (options.model.relationList && options.model.relationList.length > 0) {
                    var len = options.model.relationList.length;
                    for (var i=0; i<len; i++){
                        var relationInfo = options.model.relationList[i];
                        var dom = document.createElement('div');
                        dom.classList.add('sui-form-ctrl-flow-name');
                        dom.classList.add('allow-click-relationform');
                        dom.classList.add('sub-relationlist');
                        dom.setAttribute('see-att-data', JSON.stringify(relationInfo));
                        dom.innerHTML = relationInfo.title;
                        html += dom.outerHTML;
                        dom.remove();
                        dom = null;
                    }
                }
                html += '</div>';
                break;
            case 'relation':
                break
            case 'project':
                inputAttrObj['value'] = options.model.value;
                inputAttrObj['readonly'] = 'true';
                inputAttrObj['class'] += ' sui-hide';
                var text = (options.model.display || options.fieldInfo.desc || '').escapeHTML();
                //如果是原表单，并且是编辑权限，才是单行模式，浏览态自动撑开
                if (s3scope.metadata.templateType == 'infopath' && auth == 'edit') {
                    text = '<div class="sui-text-single">' + text + '</div>';
                }
                html += '<input ' + $.sui.attrBuilder(inputAttrObj) + '/>';
                html += '<div ' + $.sui.attrBuilder({class: 'sui-form-ctrl-value-display sui-form-ctrl-project ' + (!options.model.value ? 'sui-form-placeholder' : ''), id: options.fieldInfo.name}) + '>' + text + '</div>';
                html += '<i class="see-icon-v5-form-pull-right"></i>';
                break;
            //组织控件
            case 'member':
            case 'multimember':
            case 'account':
            case 'multiaccount':
            case 'department':
            case 'multidepartment':
            case 'post':
            case 'multipost':
            case 'level':
            case 'multilevel':
                inputAttrObj['value'] = options.model.value;
                inputAttrObj['readonly'] = 'true';
                inputAttrObj['class'] += ' sui-hide';

                html += '<input ' + $.sui.attrBuilder(inputAttrObj) + '/>';
                //BUG OA-140324 (2018-4-11)某个表单字段选择的内容在m3上查看显示到表单外边框上去了pc正常
                //PS:先暂时处理单子上的BUG，后续遇到问题再处理，主要是infopath兼容性导致的，如果width为10%，两次叠加计算会有问题
                html += '<div ' + $.sui.attrBuilder({style: 'width:inherit;', class: 'sui-form-ctrl-value-display organization ' + (!options.model.value ? 'sui-form-placeholder' : ''), id: options.fieldInfo.name}) + '>' + (options.model.display || options.fieldInfo.desc || '').escapeHTML() + '</div>';

                //如果有值,并且是轻表单模式，则显示关闭按钮，否则在原表单模式，一直显示右箭头
                if (options.model.display && s3scope.metadata.templateType == 'lightForm') {
                    html += '<i action="clear-value" class="see-icon-v5-form-close-circle-fill"></i>';
                } else {
                    html += '<i class="see-icon-v5-form-pull-right"></i>';
                }
                break;
            //扩展控件
            case 'attachment':
                //如果是relation或者relationform，则修改__state
                if (options.fieldInfo.inputType == 'relation' || options.fieldInfo.inputType == 'relationform') {
                    options.model.__state = 'modified';
                }
                inputAttrObj['value'] = options.model.value;
                inputAttrObj['readonly'] = 'true';
                inputAttrObj['class'] += ' sui-hide';
                html += '<input ' + $.sui.attrBuilder(inputAttrObj) + '/>';
                html += '<div ' + $.sui.attrBuilder({class: 'sui-form-ctrl-value-display sui-form-ctrl-attachment', id: options.fieldInfo.name}) + '>';
                //attachment控件 --start
                options.model.attData = options.model.attData || [];
                var items = options.model.attData;
                var targetServer = $.sui.dataService.debug ? $.sui.dataService.targetServer : $.serverIp;

                if (items.length > 0) {
                    html += '<div class="attachment-items">';
                    items.forEach(function(item){
                        item.remoteSource = !item.remoteSource ? (targetServer + '/seeyon/rest/attachment/file/' + item.fileUrl) : item.remoteSource;
                        var url = item.localSource || item.remoteSource;
                        html += '   <div class="attachment-item">';
                        html += '       <i class="attachment-icon ' + _FileExtensionFilter(item.extension) +  '"></i>';
                        var dom = document.createElement('div');
                        dom.classList.add('attachment-content');
                        dom.classList.add('allow-click-attachment');
                        dom.setAttribute('see-att-data', JSON.stringify(item));
                        dom.innerHTML = item.filename;
                        html += dom.outerHTML;
                        if (auth == 'edit') {
                            html += '    <i class="see-icon-v5-form-close-circle-fill"></i>';
                        }
                        html += '   </div>';
                    });
                } else {
                    html += '<div class="attachment-items items-empty">';
                }

                html += '</div>';//items-end
                if (auth == 'edit') {
                    html += '<div class="attachment-add-item">' + ($.i18n('form.attachment.uploadLimit') || '请选择小于3M的文件上传') +
                        '		 <div class="icon-add">' +
                        '           <i class="see-icon-v5-form-add"></i>' +
                        '		</div>' +
                        '	</div>';
                }

                html += '</div>';
                //attachment控件 --end
                html +='</div>';
                break;
            case 'image':
                //如果是relation或者relationform，则修改__state
                if (options.fieldInfo.inputType == 'relation' || options.fieldInfo.inputType == 'relationform') {
                    options.model.__state = 'modified';
                }
                inputAttrObj['value'] = options.model.value;
                inputAttrObj['readonly'] = 'true';
                inputAttrObj['class'] += ' sui-hide';
                html += '<input ' + $.sui.attrBuilder(inputAttrObj) + '/>';
                html += '<div ' + $.sui.attrBuilder({class: 'sui-form-ctrl-value-display sui-form-ctrl-image', id: options.fieldInfo.name}) + '>';
                //image控件 --start
                options.model.attData = options.model.attData || [];
                var items = options.model.attData;

                var targetServer = $.sui.dataService.debug ? $.sui.dataService.targetServer : $.serverIp;
                //如果是图片，根据pc和轻表单分开显示
                if (s3scope.metadata.templateType == 'lightForm') {
                    html += '<div class="image-items">';
                    items.forEach(function(item){
                        item.remoteSource = !item.remoteSource ? (targetServer + '/seeyon/fileUpload.do?method=showRTE&showType=small&smallPX=200&type=image&fileId=' + item.fileUrl + '&createDate=' + new Date(Number(item.createdate)).format('yyyy-MM-dd')) : item.remoteSource;
                        //判断是否有本地路径
                        var url = item.localSource || item.remoteSource;
                        var sourceUrl = targetServer + '/seeyon/fileUpload.do?method=showRTE&type=image&fileId=' + item.fileUrl + '&createDate=' + new Date(Number(item.createdate)).format('yyyy-MM-dd');
                        html += '   <div class="image-item">';
                        html += '       <div class="sui-image-wrapper">';
                        html += '           <img src="' + url + '" url="' + sourceUrl + '" fileid="' + item.fileUrl + '" filename="' + item.filename + '"/>';
                        html += '       </div>';
                        if (auth == 'edit') {
                            html += '       <div class="image-icon-close">';
                            html += '           <i class="see-icon-v5-form-close-circle"></i>';
                            html += '       </div>';
                        }

                        html += '   </div>';
                    });

                    if (auth == 'edit') {
                        html +='<div class="image-add-item">' +
                            '		<div class="sui-image-wrapper">' +
                            '			<div class="top">' +
                            '				<i class="see-icon-v5-form-import-img"></i>' +
                            '			</div>' +
                            '			<div class="bottom">' + ($.i18n('form.image.upload') || '请上传图片') +'</div>' +
                            '		</div>' +
                            '	</div>';
                    }

                    html +='</div>'; //image-items
                    //image控件 --end
                } else {
                    html += '<div class="infopath-image-item">';
                    //目前只支持一个图片
                    if (items.length > 0) {
                        var item = items[0];
                        item.remoteSource = !item.remoteSource ? (targetServer + '/seeyon/fileUpload.do?method=showRTE&showType=small&smallPX=200&type=image&fileId=' + item.fileUrl + '&createDate=' + new Date(Number(item.createdate)).format('yyyy-MM-dd')) : item.remoteSource;
                        //判断是否有本地路径
                        var url = item.localSource || item.remoteSource;
                        var sourceUrl = targetServer + '/seeyon/fileUpload.do?method=showRTE&type=image&fileId=' + item.fileUrl + '&createDate=' + new Date(Number(item.createdate)).format('yyyy-MM-dd');
                        html += '<img src="' + url + '" url="' + sourceUrl + '" fileid="' + item.fileUrl + '" filename="' + item.filename + '"/>';

                        if (auth == 'edit') {
                            html += '<i class="see-icon-v5-form-close-circle-fill"></i>';
                        }
                    }
                    html +='</div>';
                    if (auth == 'edit') {
                        html +='<div class="image-add-item">';
                        html +='<i class="see-icon-v5-form-import-img"></i>';
                        html +='</div>';
                    }
                }

                html +='</div>';
                break;
            case 'document':
                //如果是relation或者relationform，则修改__state
                if (options.fieldInfo.inputType == 'relation' || options.fieldInfo.inputType == 'relationform') {
                    options.model.__state = 'modified';
                }
                inputAttrObj['value'] = options.model.value;
                inputAttrObj['readonly'] = 'true';
                inputAttrObj['class'] += ' sui-hide';
                html += '<input ' + $.sui.attrBuilder(inputAttrObj) + '/>';
                html += '<div ' + $.sui.attrBuilder({class: 'sui-form-ctrl-value-display sui-form-ctrl-document', id: options.fieldInfo.name}) + '>';
                //document控件 --start
                options.model.attData = options.model.attData || [];
                var items = options.model.attData;
                var targetServer = $.sui.dataService.debug ? $.sui.dataService.targetServer : $.serverIp;

                if (items.length > 0) {
                    html += '<div class="document-items">';
                    items.forEach(function(item){
                        item.remoteSource = !item.remoteSource ? (targetServer + '/seeyon/rest/document/file/' + item.fileUrl) : item.remoteSource;
                        var url = item.localSource || item.remoteSource;
                        html += '   <div class="document-item">';
                        if (item.mimeType == 'collaboration') {
                            html += '       <i class="document-icon ' + 'see-icon-v5-form-ic-col-fill' +  '"></i>';
                        } else if (item.mimeType == 'edoc') {
                            html += '       <i class="document-icon ' + 'see-icon-v5-form-ic-offdoc-fill' +  '"></i>';
                        } else {
                            //html += '       <i class="document-icon ' + _FileExtensionFilter(item.filename) +  '"></i>';
                            html += '       <i class="document-icon ' + 'see-icon-v5-form-relation-doc' +  '"></i>';
                        }

                        var dom = document.createElement('div');
                        dom.classList.add('document-content');
                        dom.classList.add('allow-click-attachment');
                        dom.setAttribute('see-att-data', JSON.stringify(item));
                        dom.innerHTML = item.filename;
                        html += dom.outerHTML;
                        if (auth == 'edit') {
                            html += '    <i class="see-icon-v5-form-close-circle-fill"></i>';
                        }

                        html += '   </div>';
                    });
                } else {
                    html += '<div class="document-items items-empty">';
                }

                html += '</div>';//items-end
                if (auth == 'edit') {
                    html += '<div class="document-add-item">' + ($.i18n('form.document.notice') || '请选择关联文档') +
                        '		 <div class="icon-add">' +
                        '           <i class="see-icon-v5-form-add"></i>' +
                        '		</div>' +
                        '	</div>';
                }

                html += '</div>';
                //document控件 --end
                html +='</div>';
                break;
            case 'outwrite':
                var finalInputType = options.fieldInfo.finalInputType;
                if (options.model.through && options.model.extMap) {
                    inputAttrObj['value'] = options.model.value;
                    inputAttrObj['readonly'] = 'true';
                    inputAttrObj['class'] += ' sui-hide';
                    html += '<input ' + $.sui.attrBuilder(inputAttrObj) + '/>';
                    html += '<div ' + $.sui.attrBuilder({class: 'sui-form-ctrl-value-display', id: options.fieldInfo.name}) + '>';

                    //将data中extMap装填
                    var dom = document.createElement('div');
                    dom.classList.add('sui-form-ctrl-flow-name');
                    dom.classList.add('allow-click-relationform');
                    dom.setAttribute('see-att-data', JSON.stringify(options.model.extMap || {}));
                    dom.innerHTML = (options.model.display || '').escapeHTML();
                    html += dom.outerHTML;
                    dom.remove();
                    dom = null;
                    html += '</div>';

                } else {
                    html += _buildCtrlDom(inputAttrObj, options, finalInputType, $.sui.getFieldAuth('browse'));
                }
                break;
            case 'externalwrite-ahead':
                inputAttrObj['value'] = options.model.value;
                inputAttrObj['readonly'] = 'true';
                inputAttrObj['class'] += ' sui-hide';
                html += '<input ' + $.sui.attrBuilder(inputAttrObj) + '/>';
                html += '<div ' + $.sui.attrBuilder({class: 'sui-form-ctrl-value-display sui-form-ctrl-static ' + (!options.model.value ? 'sui-form-placeholder' : ''), id: options.fieldInfo.name}) + '>' + (options.model.display || options.fieldInfo.desc || '').escapeHTML() + '</div>';
                break;
            case 'exchangetask':
                inputAttrObj['value'] = options.model.value;
                inputAttrObj['readonly'] = 'true';
                inputAttrObj['class'] += ' sui-hide';
                html += '<input ' + $.sui.attrBuilder(inputAttrObj) + '/>';
                html += '<div ' + $.sui.attrBuilder({class: 'sui-form-ctrl-value-display ' + (!options.model.value ? 'sui-form-placeholder' : ''), id: options.fieldInfo.name}) + '>' + (options.model.display || options.fieldInfo.desc || '').escapeHTML() + '</div>';
                html += '<i class="see-icon-v5-form-pull-right"></i>';
                break;
            case 'querytask':
                inputAttrObj['value'] = options.model.value;
                inputAttrObj['readonly'] = 'true';
                inputAttrObj['class'] += ' sui-hide';
                html += '<input ' + $.sui.attrBuilder(inputAttrObj) + '/>';
                html += '<div ' + $.sui.attrBuilder({class: 'sui-form-ctrl-value-display sui-form-ctrl-querytask ' + (!options.model.value ? 'sui-form-placeholder' : ''), id: options.fieldInfo.name}) + '>' + (options.fieldInfo.desc || '').escapeHTML() + '</div>';
                html += '<i class="see-icon-v5-form-search"></i>';
                break;
            //地图位置控件
            case 'mapmarked':
                inputAttrObj['value'] = options.model.value;
                inputAttrObj['readonly'] = 'true';
                inputAttrObj['class'] += ' sui-hide';
                var display = options.model.display || options.fieldInfo.desc || '';
                if (s3scope.metadata.templateType == 'infopath') {
                    display = '<div class="sui-text-single">' + display + '</div>';
                }
                html += '<input ' + $.sui.attrBuilder(inputAttrObj) + '/>';
                html += '<div ' + $.sui.attrBuilder({class: 'sui-form-ctrl-value-display sui-form-ctrl-mapmarked ' + (!options.model.value ? 'sui-form-placeholder' : ''), id: options.fieldInfo.name}) + '>' + display;
                if (auth == 'edit') {
                    html += '<i class="see-icon-v5-form-location-fill"></i>';
                    if (options.model.value) {
                        //html += '<i class="see-icon-v5-form-pull-right"></i>';
                    }
                }
                html += '</div>';
                break;
            case 'maplocate':
                inputAttrObj['value'] = options.model.value;
                inputAttrObj['readonly'] = 'true';
                inputAttrObj['class'] += ' sui-hide';
                var display = options.model.display || options.fieldInfo.desc || '';
                if (s3scope.metadata.templateType == 'infopath') {
                    display = '<div class="sui-text-single">' + display + '</div>';
                }
                html += '<input ' + $.sui.attrBuilder(inputAttrObj) + '/>';
                html += '<div ' + $.sui.attrBuilder({class: 'sui-form-ctrl-value-display sui-form-ctrl-maplocate ' + (!options.model.value ? 'sui-form-placeholder' : ''), id: options.fieldInfo.name}) + '>' + display;
                if (auth == 'edit' && options.model.value) {
                    html += '<i class="see-icon-v5-form-close-circle-fill"></i>';
                }
                html += '</div>';
                html += '<i class="see-icon-v5-form-location-fill"></i>';
                break;
            case 'mapphoto':
                //如果是relation或者relationform，则修改__state
                if (options.fieldInfo.inputType == 'relation' || options.fieldInfo.inputType == 'relationform') {
                    options.model.__state = 'modified';
                }
                inputAttrObj['value'] = options.model.value;
                inputAttrObj['readonly'] = 'true';
                inputAttrObj['class'] += ' sui-hide';
                html += '<input ' + $.sui.attrBuilder(inputAttrObj) + '/>';
                html += '<div ' + $.sui.attrBuilder({class: 'sui-form-ctrl-value-display sui-form-ctrl-image', id: options.fieldInfo.name}) + '>';
                //image控件 --start
                options.model.attData = options.model.attData || [];
                var items = options.model.attData;
                var targetServer = $.sui.dataService.debug ? $.sui.dataService.targetServer : $.serverIp;
                //如果是图片，根据pc和轻表单分开显示
                if (s3scope.metadata.templateType == 'lightForm') {
                    html += '<div class="image-items">';
                    items.forEach(function(item){
                        //item.remoteSource = !item.remoteSource ? (targetServer + '/seeyon/rest/attachment/file/' + item.fileUrl) : item.remoteSource;
                        item.remoteSource = !item.remoteSource ? (targetServer + '/seeyon/fileUpload.do?method=showRTE&showType=small&smallPX=200&type=image&fileId=' + item.fileUrl + '&createDate=' + new Date(Number(item.createdate)).format('yyyy-MM-dd')) : item.remoteSource;
                        var url = item.localSource || item.remoteSource;
                        var sourceUrl = targetServer + '/seeyon/fileUpload.do?method=showRTE&type=image&fileId=' + item.fileUrl + '&createDate=' + new Date(Number(item.createdate)).format('yyyy-MM-dd');
                        html += '   <div class="image-item">';
                        html += '       <div class="sui-image-wrapper">';
                        html += '           <img src="' + url + '" url="' + sourceUrl + '" fileid="' + item.fileUrl + '" filename="' + item.filename + '"/>';
                        html += '       </div>';
                        if (auth == 'edit') {
                            html += '       <div class="image-icon-close">';
                            html += '           <i class="see-icon-v5-form-close-circle"></i>';
                            html += '       </div>';
                        }

                        html += '   </div>';
                    });

                    if (auth == 'edit') {
                        html +='<div class="image-add-item">' +
                            '		<div class="sui-image-wrapper">' +
                            '			<div class="top">' +
                            '				<i class="see-icon-v5-form-camera-fill"></i>' +
                            '			</div>' +
                            '			<div class="bottom">' + ($.i18n('form.photo.notice') || '请拍照定位') + '</div>' +
                            '		</div>' +
                            '	</div>';
                    }

                    html +='</div>'; //image-items
                    //image控件 --end
                    html +='</div>';
                } else {
                    html += '<div class="infopath-image-item">';
                    //目前只支持一个图片
                    if (items.length > 0) {
                        var item = items[0];
                        item.remoteSource = !item.remoteSource ? (targetServer + '/seeyon/fileUpload.do?method=showRTE&showType=small&smallPX=200&type=image&fileId=' + item.fileUrl + '&createDate=' + new Date(Number(item.createdate)).format('yyyy-MM-dd')) : item.remoteSource;
                        //判断是否有本地路径
                        var url = item.localSource || item.remoteSource;
                        var sourceUrl = targetServer + '/seeyon/fileUpload.do?method=showRTE&type=image&fileId=' + item.fileUrl + '&createDate=' + new Date(Number(item.createdate)).format('yyyy-MM-dd');
                        html += '<img src="' + url + '" url="' + sourceUrl + '" fileid="' + item.fileUrl + '" filename="' + item.filename + '"/>';

                        if (auth == 'edit') {
                            html += '<i class="see-icon-v5-form-close-circle-fill"></i>';
                        }
                    }
                    html +='</div>';
                    if (auth == 'edit') {
                        html +='<div class="image-add-item">';
                        html +='<i class="see-icon-v5-form-camera-fill"></i>';
                        html +='</div>';
                    }
                }
                break;
            //自定义控件
            case 'linenumber':
            case 'customcontrol':
                inputAttrObj['value'] = options.model.value;
                inputAttrObj['readonly'] = 'true';
                inputAttrObj['class'] += ' sui-hide';
                html += '<input ' + $.sui.attrBuilder(inputAttrObj) + '/>';
                html += '<div ' + $.sui.attrBuilder({class: 'sui-form-ctrl-value-display sui-form-ctrl-static ' + (!options.model.value ? 'sui-form-placeholder' : ''), id: options.fieldInfo.name}) + '>' + (options.model.display || options.fieldInfo.desc || '').escapeHTML() + '</div>';
                break;
            default:
                break;
        }

        //加入hide权限的div
        if (auth == 'hide'){
            html += '<div ' + $.sui.attrBuilder({class: 'sui-form-ctrl-value-hide', id: options.fieldInfo.name}) + '>***</div>';
        }
        return html;
    }

    function _getDateFormatType (inputType, formatType) {
        if (inputType == 'date') {
            switch (formatType){
                case 'yyyy-mm-dd-china':
                    return 'yyyy年M月d日-china';
                case 'yyyy-mm-china':
                    return 'yyyy年M月-china';
                case 'mm-dd-china':
                    return 'M月d日-china';
                case 'yyyy-mm-dd-number':
                    return 'yyyy年M月d日';
                case 'yyyy-mm-number':
                    return 'yyyy年M月';
                case 'mm-dd-number':
                    return 'M月d日';
                case 'day_of_week':
                    return '星期W';
                default:
                    return 'yyyy-MM-dd';
            }
        } else {
            return 'yyyy-MM-dd hh:mm';
        }
    }

    /**
     * 根据扩展名，返回图标class
     * @param extension
     * @returns {string}
     * @private
     */
    function _FileExtensionFilter (extension) {
        extension = (extension || '').toLowerCase();
        extension = extension.substring(extension.lastIndexOf('.') + 1);
        switch (extension) {
            case 'txt':
                return 'see-icon-v5-form-ic-txt-fill';
            case 'jpg':
            case 'png':
            case 'icon':
            case 'gif':
                return 'see-icon-v5-form-ic-image-fill';
            case 'doc':
            case 'docx':
                return 'see-icon-v5-form-ic-doc-fill';
            case 'xls':
            case 'xlsx':
                return 'see-icon-v5-form-ic-xls-fill';
            case 'ppt':
            case 'pptx':
                return 'see-icon-v5-form-ic-ppt-fill';
            case 'wps':
                return 'see-icon-v5-form-ic-wps-fill';
            case 'vsd':
                return 'see-icon-v5-form-ic-vsd-fill';
            case 'pdf':
                return 'see-icon-v5-form-ic-pdf-fill';
            case 'et':
                return 'see-icon-v5-form-ic-et-fill';
            case 'htm':
            case 'html':
            case 'sht':
            case 'shtm':
            case 'shtml':
            case 'asp':
            case 'aspx':
            case 'jsp':
            case 'php':
                return 'see-icon-v5-form-ic-html-fill';
            case 'mp3':
                return 'see-icon-v5-form-ic-mp3-fill';
            case 'avi':
            case 'mp4':
            case 'wmv':
            case 'rm':
            case 'rmvb':
            case 'mpg':
            case 'mkv':
            case 'flv':
                return 'see-icon-v5-form-ic-mp4-fill';
            case 'wma':
            case 'wav':
            case 'amr':
            case 'ava':
            case 'ACT':
                return 'see-icon-v5-form-ic-voice-fill';
            case 'zip':
            case 'rar':
            case 'jar':
            case '7z':
            case 'tar':
                return 'see-icon-v5-form-ic-zip-fill';
            default:
                break;
        }
        return "see-icon-v5-form-ic-unknown-fill";
    }

    /*内部函数----end*/


    /*sui 对外的接口----start*/

    $.sui.isPreventSubmit = function () {
        return $.sui.preventSubmit;
    }

    $.sui.formDestroy = function (options) {
        if (_vue) {
            _vue.$destroy();
            _vue = null;
        }
        //将监听的全局事件移除
        if (_infoPathIscroll) {
            _infoPathIscroll.destroy();
            _infoPathIscroll = null;
        }
        if (options) {
            var container = document.getElementById(options.containerId);
            if (container) {
                container.innerHTML = '';
            }
        }
    }

    /**
     * 获取表单数据，用于签章保护
     * @returns {*}
     */
    $.sui.getFormProtectedData = function (useFieldIdAsKey, callback) {
        if (!window.s3scope) {
            return {};
        }

        var att = useFieldIdAsKey ? 'name' : 'display';
        var ret = {};
        if (s3scope.data.master && s3scope.metadata.fieldInfo) {
            var masterData = s3scope.data.master;
            Object.keys(masterData).forEach(function(key){
                if (key.indexOf('field') != -1) {
                    var model = masterData[key];
                    var fieldInfo = s3scope.metadata.fieldInfo[key];
                    if (model && fieldInfo) {
                        var val = '';
                        if (['image', 'document', 'attachment'].indexOf(fieldInfo.finalInputType) != -1) {
                            val = (model.attData || []).map(function(o){return o.filename}).join(',');
                        } else if (['member', 'multimember', 'account', 'multiaccount', 'department', 'multidepartment', 'post', 'multipost', 'level', 'multilevel'].indexOf(fieldInfo.finalInputType) != -1) {
                            val = model.display;
                        } else if(['select', 'radio'].indexOf(fieldInfo.finalInputType) != -1) {
                            var filters = (model.items || []).filter(function(o){return o.value == model.value});
                            if (filters.length > 0) {
                              val = filters[0].name;
                            }
                        } else {
                            val = model.value;
                        }

                        if (typeof ret[fieldInfo[att]] != 'undefined') {
                            ret[fieldInfo[att]].data.push(val);
                        } else {
                            ret[fieldInfo[att]] = {fieldType:fieldInfo.finalInputType, data:[val]};
                        }
                    }

                }
            });
        }

        //处理children
        var childrenData = s3scope.data.children;
        var childrenMetaData = s3scope.metadata.children;
        if (childrenData && childrenMetaData) {
            Object.keys(childrenData).forEach(function(tableName){
                if (childrenData[tableName] && childrenData[tableName].data instanceof Array && childrenMetaData[tableName] && childrenMetaData[tableName].fieldInfo) {
                    childrenData[tableName].data.forEach(function(recordData){
                        Object.keys(recordData).forEach(function(key){
                            if (key.indexOf('field') != -1) {
                                var model = recordData[key];
                                var fieldInfo = childrenMetaData[tableName].fieldInfo[key];
                                if (model && fieldInfo) {
                                    var val = '';
                                    if (['image', 'document', 'attachment'].indexOf(fieldInfo.finalInputType) != -1) {
                                        val = (model.attData || []).map(function(o){return o.filename}).join(',');
                                    } else if (['member', 'multimember', 'account', 'multiaccount', 'department', 'multidepartment', 'post', 'multipost', 'level', 'multilevel'].indexOf(fieldInfo.finalInputType) != -1) {
                                        val = model.display;
                                    } else if(['select', 'radio'].indexOf(fieldInfo.finalInputType) != -1) {
                                      var filters = (model.items || []).filter(function(o){return o.value == model.value});
                                      if (filters.length > 0) {
                                        val = filters[0].name;
                                      }
                                    } else {
                                        val = model.value;
                                    }

                                    if (typeof ret[fieldInfo[att]] != 'undefined') {
                                        ret[fieldInfo[att]].data.push(val);
                                    } else {
                                        ret[fieldInfo[att]] = {fieldType:fieldInfo.finalInputType, data:[val]};
                                    }

                                }

                            }
                        });
                    });

                }
            });
        }

		//兼容有回调的时候 2018-10-30
		typeof callback === 'function' && callback(null, ret);
        return ret;
    }

    //根据模块id取缓存数据 {moduleId: 1111111},此接口协同使用
    $.sui.loadFormDataFromCache = function (options, callback) {
        $.sui.initCacheKeyMap(options);
        var key = $.sui.getCachedDataKey();
        //var tempData = $.storage.get(key, true);
        $.storageDB.get(key, function(result){
            if(result.success && result.data){
                try {
                    //var data = JSON.parse(tempData);
                    window.s3scope = result.data;
                    //初始化所有附件的map，在bind的时候，将各字段的值填进去
                    window.s3scope.attachmentInputs = window.s3scope.attachmentInputs || {};
                    window.s3scope.signatures = window.s3scope.signatures || {};
                    //return true;
                    callback && callback({success: true});
                } catch (e) {
                    console.log(e);
                    $.notification.alert('Error when calling loadFormDataFromCache!', null, '', $.i18n('form.btn.ok'));
                    callback && callback({success: false});
                }
            } else {
                callback && callback({success: false});
            }
        });
        // if (tempData) {
        //     try {
        //         var data = JSON.parse(tempData);
        //         window.s3scope = data;
        //         //初始化所有附件的map，在bind的时候，将各字段的值填进去
        //         window.s3scope.attachmentInputs = window.s3scope.attachmentInputs || {};
        //         window.s3scope.signatures = window.s3scope.signatures || {};
        //         return true;
        //     } catch (e) {
        //         console.log(e);
        //         $.notification.alert('Error when calling loadFormDataFromCache!', null, '', $.i18n('form.btn.ok'));
        //         return false;
        //     }
        //
        // }
        // return false;
    }

    function _pushErrorInfoFromBackCheck (options, data, noticeInstance) {
        var errorInfo = {type:2, info: {}};
        var tips = data.ruleError || '数据不符合规范，请检查!';
        (data.fields || []).forEach(function(fieldName){
            errorInfo.info[fieldName] = tips;
        });
        var formContent = document.querySelector('.sui-form-content');
        if (formContent) {
            //前台呈现
            _showFormErrorTips(errorInfo);
        } else {
            //将数据保存在key中，等待跳转到表单页面，进行呈现
            var key = $.sui.getErrorInfoKey(options);
            $.storage.save(key, JSON.stringify(errorInfo), true);
        }
    }

    //清除缓存的接口一定要传options
    $.sui.clearCache = function (options, isPreSubmit) {
        if (!$.sui.cacheKeyMap) {
            $.sui.initCacheKeyMap(options);
        }
        var key = $.sui.getErrorInfoKey();
        $.storage.delete(key, true);
        key = $.sui.getTempKey();
        $.storage.delete(key, true);
        key = $.sui.getLastPosKey();
        $.storage.delete(key, true);
        key = $.sui.getScrollStateKey();
        $.storage.delete(key, true);

        key = $.sui.getCachedDataKey();
        //将数据缓存保存到web数据库中，更改数据调用接口和删除接口，其他缓存不变
        $.storageDB.delete(key,function(result){});
        //清除是否有缓存的标志
        key = $.sui.getStoreFlagKey();
        sessionStorage.removeItem(key);
        //调用后台接口，清除后台缓存
    }

    function _isSame (record1, record2) {
        if (!record1 || !record2) return false;
        var fields = Object.keys(record1);
        var len = fields.length;
        for (var i=0; i < len; i++) {
            var field = fields[i];
            if (field.startsWith('field')) {
                var fieldData1 = record1[field];
                var fieldData2 = record2[field];

                //if (fieldData1)
                //受不了这样的逻辑
                if (fieldData1.attData || fieldData2.attData) {
                    //只有attData为空数组时，这两个值才相等
                    if (fieldData1.value != fieldData2.value) {
                        return false;
                    }
                    if (fieldData1.attData.length > 0 || fieldData2.attData.length > 0) {
                        return false;
                    }
                } else if (fieldData1 && fieldData2 && fieldData1.value != fieldData2.value) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * 检测重复表中是否有重复记录
     * @param options
     */
    $.sui.repeatedRecordsAssert = function () {
        var childrenData = s3scope.data.children;
        if (childrenData && s3scope.metadata.children) {
            var tableNames = Object.keys(childrenData);
            var count = tableNames.length;
            for (var k=0; k < count; k++) {
                var tableName = tableNames[k];
                if (childrenData[tableName] && childrenData[tableName].data instanceof Array && s3scope.metadata.children[tableName]) {
                    var len = childrenData[tableName].data.length;

                    for (var i=0; i < len-1; i++) {
                        for (var j=i+1; j < len; j++) {
                            var hasSame = _isSame(childrenData[tableName].data[i], childrenData[tableName].data[j]);
                            if (hasSame) {
                                var title = s3scope.metadata.children[tableName].display;
                                return {success: false, tableName: tableName, index: k + 1, title: title};
                            }
                        }
                    }
                }
            }
        }

        return {success: true};
    }

    function _requiredAssertWhenUnLoaded () {
        var tables = Object.keys(s3scope.data.children || []);
        var len = tables.length;
        for (var i=0; i<len; i++) {
            var tableName = tables[i];
            var childrenData = s3scope.data.children[tables[i]];
            if (s3scope.unShowSubDataIdMap && s3scope.unShowSubDataIdMap[tableName] && s3scope.unShowSubDataIdMap[tableName].length > 0
                && s3scope.hasNotNullField && s3scope.hasNotNullField[tableName]) {
                return true;
            }
        }
        return false;
    }

    function _doSubmit (options, callback, needFieldLengthAssert) {
        //判断是否需要验证
        $.sui.clearAllErrorTips(options);
        if (options.needCheckRule) {
            if (!$.sui.formAssert(options, true, needFieldLengthAssert)) {
                callback && callback({message: 'form assert failed!'});
                return;
            }

            //验证是否有重复表未加载完的情况，如果有这种情况，需要验证是否有必填字段
            if (_requiredAssertWhenUnLoaded()) {
                $.notification.alert('重复表没有加载全，并且可能包含必填字段，请点击查看更多加载数据！', function(){
                    callback && callback({message: 'form assert failed!'});
                }, '', $.i18n('form.btn.ok'));
                return;
            }
        } else if (needFieldLengthAssert) {
            //判断一下是否需要验证长度,有些不需要验证的逻辑也强制验证了长度，这很影响效率，坑爹的业务逻辑
            if (!$.sui.formAssert(options, false, true)) {
                callback && callback({message: 'form assert failed!'});
                return;
            }
        }

        //不校验重复行了2017-5-10
        _doSubmitAfterCheckRepeatRecord(options, callback);
    }

    function _doSubmitAfterCheckRepeatRecord (options, callback) {
        options.content = s3scope.contentList[s3scope.indexParam];
        options.data = $.sui.reduceSubmitData(s3scope.data);
        //增加附件提交设置，将所有含有attData的数组拼接，将属性加一个前缀 "attachment_"
        options.attachmentInputs = $.sui.getAttachments(s3scope.attachmentInputs);
        options.signatures = $.sui.getSignatures(s3scope.signatures);

        if (options.moduleId != undefined) {
            options.content.moduleId = options.moduleId;
        }

        if (options.content.moduleTemplateId == -1) {
            if (options.templateId) {
                options.content.moduleTemplateId = options.templateId;
            } else {
                options.content.moduleTemplateId = options.content.id;
            }
            options.content.id = -1;
        }

        $.sui.dataService.capForm.saveOrUpdate(options, function(err, data){
            if (err) {
                $.notification.alert(err.message, null, '', $.i18n('form.btn.ok'));
                callback && callback(err, data);
                return;
            }

            //OA-109671M3协同【IOS】：新建表单协同，协同界面切换到原表单，直接卡死了，杀进程后重新登录进入新建协同报错307
            // 先暂时将toString去掉了
            if (data.success == 'true') {
                if (data.sn && typeof  data.sn == 'object') {// 如果产生了流水号需要给出提示
                    var snObj = data.sn;
                    var snMsg = "";
                    for ( var snField in snObj) {
                        snMsg += $.i18n('form.app.serialNumber', snField) + snObj[snField] + "\n";
                    }

                    data.snMsg = snMsg;
                    //预提交，不清缓存
                    !options.notSaveDB && $.sui.clearCache(options);
                    callback && callback(err, data);
                } else {
                    !options.notSaveDB && $.sui.clearCache(options);
                    callback && callback(err, data);
                }
            } else {
                //失败
                if (data.errorMsg) {
                    try {
                        //如果有验证信息，打出提示
                        var errorInfo = data.errorMsg;
                        if (typeof data.errorMsg == 'string') {
                            errorInfo = JSON.parse(data.errorMsg);
                        }

                        //forceCheck不等于1是非强制校验
                        if (errorInfo.ruleError && errorInfo.forceCheck != 1) {
                            var msg = errorInfo.ruleError;
                            cmp.dialog.loading(false); //解决在弹出confirm对话框时，有loading效果重叠 BUG OA-123939
                            $.notification.confirm(msg, function(index){
                                //继续
                                if (index == 1) {
                                    options.needCheckRule = false;
                                    return _doSubmit(options, callback, false);
                                } else {
                                    //取消
                                    $.sui.clearAllErrorTips(options);
                                    //_pushErrorInfoFromBackCheck(options, errorInfo, true);
                                    callback && callback({message:'后台校验出错'}, data);
                                }
                            }, '', [$.i18n('form.btn.cancel'), $.i18n('form.btn.continue')]);

                        } else {
                            //将errorMsg提取出来，保存在缓存中
                            $.sui.clearAllErrorTips(options);
                            _pushErrorInfoFromBackCheck(options, errorInfo, true);
                            callback && callback({message:'后台校验出错'}, data);
                        }
                    } catch (e) {
                        $.notification.alert(data.errorMsg, function(){
                            callback && callback({message: data.errorMsg}, data);
                        }, '', $.i18n('form.btn.ok'));
                    }
                } else {
                    callback && callback({message:'提交失败'}, data);
                }
            }
        });
    }

    $.sui.submit = function (options, callback) {
        if (!window.s3scope) {
            $.notification.alert('表单正在加载中!', null, '', $.i18n('form.btn.ok'));
            callback && callback({message: '表单正在加载中!'});
            return;
        }

        //判断是否阻止提交
        if ($.sui.preventSubmit) {
            callback && callback({message: '字段验证有误'});
            return;
        }

        _doSubmit(options, callback, true);
    }

    $.sui.clearAllErrorTips = function () {
        var arr = document.querySelectorAll('.sui-form-ctrl-error');
        Array.apply(null, arr).forEach(function(item){
            item.classList.remove('sui-form-ctrl-error');
        });
        var errors = document.querySelectorAll('.sui-form-ctrl-error-tips');
        Array.apply(null, errors).forEach(function(tip){
            tip.remove();
        });
    }

    $.sui.clearErrorTips = function (innerDom) {
        innerDom.parentNode.classList.remove('sui-form-ctrl-error');
        var errors = innerDom.querySelectorAll('.sui-form-ctrl-error-tips');
        Array.apply(null, errors).forEach(function(tip){
            tip.remove();
        });
    }

    $.sui.setCtrlErrorTips = function (ctrl, errorMessage) {
        if (ctrl) {
            ctrl.classList.add('sui-form-ctrl-error');
            //将错误提示插入
            var node = document.createElement('div');
            node.classList.add('sui-form-ctrl-error-tips');
            node.innerHTML = errorMessage;
            //ctrlField.insertBefore(node, ctrlField.childNodes[0]);
            var fieldCtrl = ctrl.querySelector('.sui-form-ctrl-field');
            //先将之前的错误信息清除
            if (fieldCtrl) {
                var errors = fieldCtrl.querySelectorAll('.sui-form-ctrl-error-tips');
                Array.apply(null, errors).forEach(function(tip){
                    tip.remove();
                });
                fieldCtrl.insertBefore(node, fieldCtrl.children[0]);
                $.sui.scrollIntoView(ctrl);
            }
        }
    }


    function _expandSubTable(ctrl) {
        if (ctrl && ctrl.id && ctrl.id.indexOf('master|') == -1) {
            var tableName = ctrl.id.split('|')[0];
            //s3scope.metadata.children[tableName].expand = true;
            s3scope.subTableExpandInfo[tableName] = true;
        }
    }

    function _showFormErrorTips (errInfo) {
        var alertInfo = '';
        //errInfo.type为1表示前端验证的结果，2表示后台验证的结果
        if (errInfo.type == '1') {
            Object.keys(errInfo.info).forEach(function(ctrlId){
                var ctrl = document.getElementById(ctrlId);
                //如果ctrl是子表中,展开子表
                if (ctrl) {
                    _expandSubTable(ctrl);
                    //todo 这么写有性能问题，需要优化，将所有需要timeout的ctrl放在一个timeout里面
                    $.sui.nextTick(function(){
                        $.sui.setCtrlErrorTips(ctrl, errInfo.info[ctrlId]);
                    });
                } else {
                    //如果在页面中没找到元素，则弹框提示
                    alertInfo += errInfo.info[ctrlId];
                }
            });
        } else {
            Object.keys(errInfo.info).forEach(function(ctrlName){
                //var ctrls = document.querySelectorAll('[name="' + ctrlName + '"]');
                var ctrls = document.querySelectorAll('.sui-form-ctrl-' + ctrlName);
                if (ctrls && ctrls.length > 0) {
                    Array.apply(null, ctrls).forEach(function(ctrl){
                        //如果ctrl是子表中,展开子表
                        _expandSubTable(ctrl);
                        $.sui.nextTick(function(){
                            $.sui.setCtrlErrorTips(ctrl, errInfo.info[ctrlName]);
                        });
                    });
                } else {
                    alertInfo += errInfo.info[ctrlName];
                }

            });
        }

        //如果有表单存在，才弹框
        var form = document.querySelector('.sui-form-content');
        if (alertInfo && form) {
            $.sui.nextTick(function(){
                $.notification.alert(alertInfo, null, '', $.i18n('form.btn.ok'));
            });
        }
    }

    /**
     * 从缓存中读取errorInfo，然后呈现出来
     */
    $.sui.showFormErrorTips = function (options) {
        var key = $.sui.getErrorInfoKey();
        var errInfo = $.storage.get(key, true);
        if (errInfo) {
            try {
                errInfo = JSON.parse(errInfo);
                $.sui.nextTick(function(){
                    _showFormErrorTips(errInfo);
                    //用完就清除缓存
                    $.storage.delete(key ,true);
                });
            } catch (e) {
                console.log(e);
                $.notification.alert('Form assert Failed!', null, '', $.i18n('form.btn.ok'));
            }
        }
    }

    $.sui.showFormErrorTipsByErrorInfo = function (errInfo) {
        _showFormErrorTips(errInfo);
    }

    $.sui.assertFieldLength = function (model, fieldInfo) {
        if (!model || !fieldInfo || !fieldInfo.fieldLength || ($.sui.getFieldAuth(model.auth) != 'edit' && $.sui.getFieldAuth(model.auth) != 'add')) {
            //不是编辑权限，不需要验证，没有fieldLength也不需要验证
            return {success: true};
        }

        var inputType = fieldInfo.finalInputType;
        var defaultTips = $.i18n('form.field.lengthLimit', fieldInfo.fieldLength);
        var defaultResult = {success:true, tips: defaultTips};
        //计算出实际的字节数，再与maxLength比较
        switch (inputType) {
            //基础控件
            case 'text':
                if (fieldInfo.fieldType == 'DECIMAL') {
                    //如果是数字，将小数点干掉再判断长度
                    var realLength = model.value.replace(/\./g, '').length;
                    var assert = realLength <= Number(fieldInfo.fieldLength);
                    if (!assert) {
                        return {success: false, tips: defaultTips};
                    }

                    //如果是数字，需要判断小数点位数
                    var splits = model.value.split('.');
                    if (splits.length > 2) {
                        return {success: false, tip: $.i18n('form.number.notValid')};
                    } else if (splits.length == 2){
                        //分别判断整数位数和小数位数
                        var integerNum = splits[0].length;
                        var digitNum = splits[1].length;
                        var integerLimited = Number(fieldInfo.fieldLength) - Number(fieldInfo.digitNum);
                        assert = integerNum <= integerLimited;
                        if (!assert) {
                            return {success: assert, tips: $.i18n('form.number.maxDigits', String(integerLimited))};
                        }
                        assert = digitNum <= Number(fieldInfo.digitNum);
                        return {success: assert, tips: $.i18n('form.number.maxDecimal', fieldInfo.digitNum)};
                    } else {
                        //如果没有小数点，验证一下整数部分
                        var integerLimited = Number(fieldInfo.fieldLength) - Number(fieldInfo.digitNum);
                        assert = model.value.length <= integerLimited;
                        if (!assert) {
                            return {success: assert, tips: $.i18n('form.number.maxDigits', String(integerLimited))};
                        }
                        return defaultResult;
                    }
                } else {
                    var realLength = $.sui.utf8StrLength(model.value);
                    var assert = realLength <= Number(fieldInfo.fieldLength);
                    if (!assert) {
                        return {success: false, tips: defaultTips};
                    } else {
                        return defaultResult;
                    }
                }
            case 'textarea':
                var realLength = $.sui.utf8StrLength(model.value);
                var assert = realLength <= Number(fieldInfo.fieldLength);
                return {success: assert, tips: defaultTips};
            case 'checkbox':
            case 'radio':
            case 'select':
            case 'date':
            case 'datetime':
            case 'flowdealoption':
            case 'lable':
            case 'label':
            case 'handwrite':
            case 'barcode':
            case 'linenumber':
                return defaultResult;
            //关联控件
            case 'relationform':
            case 'relation':
                var realLength = $.sui.utf8StrLength(model.value);
                var assert = realLength <= Number(fieldInfo.fieldLength);
                return {success: assert, tips: defaultTips};
            case 'project':
                return defaultResult;
            //组织控件
            case 'member':
            case 'multimember':
            case 'account':
            case 'multiaccount':
            case 'department':
            case 'multidepartment':
            case 'post':
            case 'multipost':
            case 'level':
            case 'multilevel':
                //组织控件直接返回true了，因为在组件已经进行了控制
                return defaultResult;
            //扩展控件
            case 'attachment':
            case 'image':
            case 'document':
            case 'outwrite':
            case 'externalwrite-ahead':
                return defaultResult;
            case 'exchangetask':
                if (fieldInfo.fieldType == 'DATETIME') {
                    //如果dee是日期类型不校验长度 BUG 20180710062159
                    // BUG_重要_V5_V6.1sp2_二星卡_顾家家居股份有限公司_微协同提交报错：此字段超过最大长度限制_20180710062159_2018-07-10
                    return defaultResult;
                }
                var realLength = $.sui.utf8StrLength(model.value);
                var assert = realLength <= Number(fieldInfo.fieldLength);
                return {success: assert, tips: defaultTips};
            case 'querytask':
            //地图位置控件
            case 'mapmarked':
            case 'maplocate':
            case 'mapphoto':
            //自定义控件
            case 'customcontrol':
                return defaultResult;
            default:
                break;
        }

        return {success: true, tips: defaultTips};
    }

    function _getModelInfoByCtrlId (ctrlId) {
        var ids = (ctrlId || '').split('|');
        var model = null;
        var fieldInfo = null;
        var recordId = '0';
        if (ids.length == 2 && ids[0] == 'master') {
            //主表
            var fieldId = ids[1];
            model = s3scope.data.master[fieldId];
            fieldInfo = s3scope.metadata.fieldInfo[fieldId];
        } else if (ids.length == 3) {
            //重复表
            var tableName = ids[0];
            recordId = ids[1];
            var fieldId = ids[2];
            var records = s3scope.data.children[tableName].data;
            var arr = (records || []).filter(function(o){ return o.__id == recordId});
            if (arr.length > 0) {
                model = arr[0][fieldId];
            }
            fieldInfo = s3scope.metadata.children[tableName].fieldInfo[fieldId];
        }

        return {model:model, fieldInfo:fieldInfo, recordId: recordId};
    }

    $.sui.formRequiredAssert = function () {
        var assert = {success:true, errorInfo:{}};
        var domArray = document.querySelectorAll('.sui-form-required');
        var len = domArray.length;
        for (var i = 0; i < len; i++) {
            var ctrl = $.sui.getFormCtrl(domArray[i]);
            var ids = ctrl.id.split('|');
            var model = null;
            var fieldInfo = null;
            if (ids.length == 2 && ids[0] == 'master') {
                //主表
                var fieldId = ids[1];
                model = s3scope.data.master[fieldId];
                fieldInfo = s3scope.metadata.fieldInfo[fieldId];
            } else if (ids.length == 3) {
                //重复表
                var tableName = ids[0];
                var recordId = ids[1];
                var fieldId = ids[2];
                var records = s3scope.data.children[tableName].data;
                var arr = (records || []).filter(function(o){ return o.__id == recordId});
                if (arr.length > 0) {
                    model = arr[0][fieldId];
                }
                fieldInfo = s3scope.metadata.children[tableName].fieldInfo[fieldId];
            }

            if (model) {
                //如果找到model，进行验证
                //如果当前model的值为undefined, null 或者 ''，则验证失败
                if (model.value == undefined || model.value == null || model.value == '') {
                    assert.success = false;
                    //如果是数字类型的控件，做一下特殊处理
                    if (fieldInfo.fieldType == 'DECIMAL') {
                        assert.errorInfo[ctrl.id] = $.i18n('form.number.notValid');
                    } else {
                        assert.errorInfo[ctrl.id] = $.i18n('form.field.require');
                    }
                }

            }
        }

        return assert;
    }

    function _fieldIsEmptyWhenRequired (model, fieldInfo) {
        //先判断一下是否需要验证必填
        if (model.notNull) {
            //如果是附件，图片，文档类型的字段，判断attData,因为这个三个类型的字段value默认有值
            if (['attachment','document','image'].indexOf(fieldInfo.finalInputType) != -1) {
                if (!model.attData || !model.attData.length) {
                    return true;
                }
            } else if (fieldInfo.finalInputType == 'handwrite') {
                //签章字段要判断signature
                if (!model.signature || !model.signature.fieldValue) {
                    return true;
                }

            } else if (model.value == undefined || model.value == null || model.value == '') {
                //如果当前model的值为undefined, null 或者 ''，则验证失败
               return true;
            }
        }
        return false;
    }

    $.sui.formRequiredAndFieldLengthAssert = function (options, needRequiredAssert, needFieldLengthAssert) {
        //遍历所有组件，进行验证，可能有点耗时，后续考虑是否在组件回填值的时候就进行提示
        var assert = {success: true, errorInfo: {} };
        //遍历所有组件
        var masterData = s3scope.data.master;
        Object.keys(masterData).forEach(function(key){
            if (key.indexOf('field') != -1) {
                var model = masterData[key];
                var fieldInfo = s3scope.metadata.fieldInfo[key];
                if (model && fieldInfo) {
                    var ctrlId = 'master|' + fieldInfo.name;

                    //先判断一下是否需要验证必填
                    if (needRequiredAssert && model.notNull) {
                        //如果是附件，图片，文档类型的字段，判断attData,因为这个三个类型的字段value默认有值
                        if (['attachment','document','image'].indexOf(fieldInfo.finalInputType) != -1) {
                            if (!model.attData || !model.attData.length) {
                                assert.success = false;
                                assert.errorInfo[ctrlId] = $.i18n('form.field.require');
                            }
                        } else if (fieldInfo.finalInputType == 'handwrite') {
                            //签章字段要判断signature
                            if (!model.signature || !model.signature.fieldValue) {
                                assert.success = false;
                                assert.errorInfo[ctrlId] = $.i18n('form.field.require');
                            }

                        } else if (model.value == undefined || model.value == null || model.value == '') {
                            //如果当前model的值为undefined, null 或者 ''，则验证失败
                            assert.success = false;
                            assert.errorInfo[ctrlId] = $.i18n('form.field.require');
                        }
                    }

                    //如果必填验证成功再验证长度
                    if (needFieldLengthAssert) {
                        if (!assert.errorInfo[ctrlId]) {
                            var ret = $.sui.assertFieldLength(model, fieldInfo);
                            if (!ret.success) {
                                //验证失败，设置提示信息，通过model值获取组件id
                                assert.success = false;
                                assert.errorInfo[ctrlId] = ret.tips;
                            }
                        }

                        //临时增加一个判断URL类型的，后续把这段代码删除 2017-3-22
                        if (fieldInfo.finalInputType == 'text' && fieldInfo.formatType == 'urlPage') {
                            if (!!model.value  && !$.sui.urlAssert(model.value)){
                                assert.success = false;
                                assert.errorInfo[ctrlId] = $.i18n('form.field.urlNotValid');
                            }
                        }
                    }
                }
            }
        });

        //处理children
        var childrenData = s3scope.data.children;
        var childrenMetaData = s3scope.metadata.children;
        if (childrenData && childrenMetaData) {
            Object.keys(childrenData).forEach(function(tableName){
                if (childrenData[tableName] && childrenData[tableName].data instanceof Array && childrenMetaData[tableName] && childrenMetaData[tableName].fieldInfo) {
                    childrenData[tableName].data.forEach(function(recordData){
                        Object.keys(recordData).forEach(function(key){
                            if (key.indexOf('field') != -1) {
                                var model = recordData[key];
                                var fieldInfo = childrenMetaData[tableName].fieldInfo[key];
                                if (model && fieldInfo) {
                                    var ctrlId = tableName + '|' + recordData.__id + '|' + fieldInfo.name;
                                    //先判断一下是否需要验证必填
                                    if (needRequiredAssert && model.notNull) {
                                        //如果是附件，图片，文档类型的字段，判断attData
                                        if (['attachment','document','image'].indexOf(fieldInfo.finalInputType) != -1) {
                                            if (!model.attData || !model.attData.length) {
                                                assert.success = false;
                                                assert.errorInfo[ctrlId] = $.i18n('form.field.require');
                                            }
                                        } else if (fieldInfo.finalInputType == 'handwrite') {
                                            //签章字段要判断signature
                                            if (!model.signature || !model.signature.fieldValue) {
                                                assert.success = false;
                                                assert.errorInfo[ctrlId] = $.i18n('form.field.require');
                                            }

                                        } else if (model.value == undefined || model.value == null || model.value == '') {
                                            //如果当前model的值为undefined, null 或者 ''，则验证失败
                                            assert.success = false;
                                            assert.errorInfo[ctrlId] = $.i18n('form.field.require');
                                        }
                                    }

                                    if (needFieldLengthAssert) {
                                        //如果必填验证成功再验证长度
                                        if (!assert.errorInfo[ctrlId]) {
                                            var ret = $.sui.assertFieldLength(model, fieldInfo);
                                            if (!ret.success) {
                                                //验证失败，设置提示信息，通过model值获取组件id
                                                assert.success  = false;
                                                assert.errorInfo[ctrlId] = ret.tips;
                                            }
                                        }

                                        //临时增加一个判断URL类型的，后续把这段代码删除 2017-3-22
                                        if (fieldInfo.finalInputType == 'text' && fieldInfo.formatType == 'urlPage') {
                                            if (!!model.value  && !$.sui.urlAssert(model.value)){
                                                assert.success = false;
                                                assert.errorInfo[ctrlId] = $.i18n('form.field.urlNotValid');
                                            }
                                        }
                                    }
                                }
                            }
                        });
                    });
                }
            });
        }

        return assert;
    }

    /**
     * 对url进行校验的函数，包括IPV6的校验，如果满足返回true
     * @param url
     */
    $.sui.urlAssert = function (url) {
        if (_urlReg.test(url)) {
            return true;
        } else if (_ipv6Reg.test(url)) {
            return true;
        }
        return false;
    }

    /**
     * 进行表单数据提交前的验证
     * @param options
     * @returns {*}
     */
    $.sui.formAssert = function (options, needRequiredAssert, needFieldLengthAssert) {
        var start = new Date().getTime();
        var assertResult = $.sui.formRequiredAndFieldLengthAssert(options, needRequiredAssert, needFieldLengthAssert);

        //如果不是马上通知，则在缓存中保存一个提示信息对象
        var errorInfo = assertResult.errorInfo;
        //type为1，errorInfo取出后要经过轻表单转化，为2时，直接显示
        var json = {type: 1, info:errorInfo, fromPc: options.submitSource == 'pc'};

        //根据是否有sui-form-content来判断是否马上通知
        var formContent = document.querySelector('.sui-form-content');
        if (formContent) {
            //前台呈现
            _showFormErrorTips(json);
        } else {
            //将数据保存在key中，等待跳转到表单页面，进行呈现
            var key = $.sui.getErrorInfoKey();
            $.storage.save(key, JSON.stringify(json), true);
        }

        console.log('assert耗时:', new Date().getTime() - start);
        return assertResult.success;
    }

    function _prePareOptions (options) {
        options.openFrom = 'listPending';
        options.indexParam = options.indexParam || 0;
        options.style = '1'; //后台的bug，强制传style=1
        return options;
    }

    $.sui.loadForm = function (options, callback) {
        options = _prePareOptions(options);
        _init(options, _initFormTemplate, callback);
    }

    $.sui.refreshWhenWebViewShow = function (options, callback) {
        options = _prePareOptions(options);
        _renderFromCache(options);
        callback && callback();
    }

    $.sui.loadForm_test = function (options, callback) {
        options = _prePareOptions(options);
        //动态加载模板
        var rootPath = document.getElementById(options.containerId).getAttribute('rootpath');
        var url = rootPath + '/s3js/' + options.templateId + '.s3js';
        _init(options, _s3UIInit, callback);

    }

    $.sui.getSelectedData = function () {
        var data = [{}];
        return [];
    }

    $.sui.initCacheKeyMap = function (options) {
        if (options) {
            var ext = options.moduleId + '_' + options.rightId + '_' + options.viewState;
            //storeFlagKey 是否缓存过数据的标志，当设置为1时，表示缓存有效，存在sessionStorage中
            $.sui.cacheKeyMap = {
                errorInfoKey: 'm3_v5_cmp_form_error_' + ext,
                tempKey: 'm3_v5_cmp_form_last_' + ext,
                lastPosKey: 'm3_v5_cmp_form_last_pos_' + ext,
                scrollStateKey: 'm3_v5_cmp_form_scroll_' + ext,
                cachedDataKey: 'm3_v5_cmp_form_' + ext,
                storeFlagKey: 'm3_v5_cmp_form_store_flag' + ext
            };
        }
    }

    $.sui.metadata2Map = function() {
        if (!window.s3scope || !window.s3scope.metadata) {
            return {};
        }

        var map = {};
        Object.keys(s3scope.metadata.fieldInfo).forEach(function(key){
            map[key] = s3scope.metadata.fieldInfo[key];
        });

        Object.keys(s3scope.metadata.children || {}).forEach(function(tableName){
            Object.keys(s3scope.metadata.children[tableName].fieldInfo || {}).forEach(function(key){
                map[key] = s3scope.metadata.children[tableName].fieldInfo[key];
            });
        });
        return map;
    }

    $.sui.getErrorInfo = function () {
        var key = $.sui.getErrorInfoKey();
        var errInfo = $.storage.get(key, true);
        if (errInfo) {
            try {
                errInfo = JSON.parse(errInfo);
            } catch (e) {
                return '';
            }

            var msg = [];
            //OA-108938 M3Android端-表单设置强制校验规则，原样表单处理没有给出提示
            if (errInfo.type == '1') {
                //前端验证的结果
                Object.keys(errInfo.info).forEach(function(ctrlId){
                    if (errInfo.fromPc) {
                        msg.push('[' + ctrlId + ']' + errInfo.info[ctrlId]);
                    } else {
                        var o = _getModelInfoByCtrlId(ctrlId);
                        if (o.fieldInfo) {
                            msg.push('[' + o.fieldInfo.display + ']' + errInfo.info[ctrlId]);
                        }
                    }
                });
            } else {
                //后端验证结果，可以直接用
                Object.keys(errInfo.info).forEach(function(fieldId){
                    var err = errInfo.info[fieldId];
                    if (msg.indexOf(err) == -1) {
                        msg.push(err);
                    }
                });
            }

            //用完就清除缓存
            $.storage.delete(key ,true);
            return msg.join('<br/>');
        }
        return '';
    }

    $.sui.getErrorInfoKey = function () {
        return !$.sui.cacheKeyMap ? '' : $.sui.cacheKeyMap.errorInfoKey;
    }

    $.sui.getTempKey = function () {
        return !$.sui.cacheKeyMap ? '' : $.sui.cacheKeyMap.tempKey;
    }

    $.sui.getLastPosKey = function () {
        return !$.sui.cacheKeyMap ? '' : $.sui.cacheKeyMap.lastPosKey;
    }

    $.sui.getScrollStateKey = function () {
        return !$.sui.cacheKeyMap ? '' : $.sui.cacheKeyMap.scrollStateKey;
    }

    $.sui.getStoreFlagKey = function () {
        return !$.sui.cacheKeyMap ? '' : $.sui.cacheKeyMap.storeFlagKey;
    }

    $.sui.getCachedDataKey = function () {
        //生成保存数据的key值
        return !$.sui.cacheKeyMap ? '' : $.sui.cacheKeyMap.cachedDataKey;
    }

    /**
     * 获取字符串utf8编码的字节数
     * @param str
     * @returns {number}
     */
    $.sui.utf8StrLength = function (str) {
        var len = str.length;
        var total = 0;
        for (var i = 0; i < len; i++) {
            var charCode = str.charCodeAt(i);
            if (charCode <= 0x007f) {
                total += 1;
            } else if (charCode <= 0x07ff) {
                total += 2;
            } else if (charCode <= 0xffff) {
                total += 3;
            } else {
                total += 4;
            }
        }
        return total;
    }

    /**
     * 根据字节长度，截取字符串，比较坑爹的逻辑，为什么要限制字节数呢，而不是字符数
     * @param str
     * @returns {number}
     */
    $.sui.utf8SubStr = function (str, maxLength) {
        var len = str.length;
        var subStr = '';
        var total = 0;
        for (var i = 0; i < len; i++) {
            var charCode = str.charCodeAt(i);
            if (charCode <= 0x007f) {
                total += 1;
            } else if (charCode <= 0x07ff) {
                total += 2;
            } else if (charCode <= 0xffff) {
                total += 3;
            } else {
                total += 4;
            }

            if (total > maxLength) {
                return subStr;
            } else {
                subStr += str[i];
            }
        }
        return subStr;
    }

    /**
     * 获取流程处理意见是否含有编辑权限
     * @returns {boolean}
     */
    $.sui.hasEditRightOfFlowDealOption = function() {
        //判断data中的字段来实现
        if (window.s3scope && window.s3scope.metadata && window.s3scope.data) {
            if (window.s3scope.metadata.fieldInfo) {
                var fields = Object.keys(window.s3scope.metadata.fieldInfo);
                var len = fields.length;
                for (var i=0; i<len; i++) {
                    var fieldName = fields[i];
                    var filedObj = window.s3scope.metadata.fieldInfo[fieldName];
                    if (filedObj.finalInputType == 'flowdealoption') {
                        //fields.push({isMaster: true, fieldName: field.name});
                        var auth = (window.s3scope.data.master[filedObj.name] || {}).auth;
                        if (auth == 'edit' || auth == 'add') {
                            return true;
                        }
                    }
                }

            }

            if (window.s3scope.metadata.children) {
                var tables = Object.keys(window.s3scope.metadata.children);
                var len = tables.length;
                for (var i=0; i<len; i++) {
                    var tableName = tables[i];
                    var fields = Object.keys(window.s3scope.metadata.children[tableName].fieldInfo);
                    var count = fields.length;
                    for (var j=0; j<count; j++) {
                        var fieldName = fields[j];
                        var filedObj = window.s3scope.metadata.children[tableName].fieldInfo[fieldName];
                        if (filedObj.finalInputType == 'flowdealoption') {
                            var records = window.s3scope.data.children[tableName].data;

                            var found = false;
                            records.forEach(function(record){
                                if (record.auth == 'edit' || record.auth == 'add') {
                                    found = true;
                                }
                            });

                            if (found) return true;
                        }
                    }
                }
            }
        }

        return false;
    }

    //增加一个标识，在执行htmlbuildder后，刷新原表单的iscroll
    var _refreshIScrolling = false;
    var _contentHeight = 0;

    $.sui.refreshIScrollAsync = function () {
        if (_refreshIScrolling) return;
        _refreshIScrolling = true;
        $.sui.nextTick(function(){
            $.sui.refreshIScrollWhenResize();
            _refreshIScrolling = false;
        })
    }

    $.sui.refreshIScrollWhenResize = function () {
        var formContent = document.querySelector(".sui-form-content");
        if (formContent) {
            var height = formContent.offsetHeight;
            if (height != _contentHeight) {
                $.sui.refreshIScroll();
                _contentHeight = height;
            }
        }
    }

    $.sui.htmlBuilder = function (options) {
        if (!options || !options.model || !options.fieldInfo) {
            return '';
        }
        //判断是否必填字段
        var required;
        if (options.model.notNull) {
            required = true;
        }

        var innerClass = 'sui-form-ctrl-inner ' + options.fieldInfo.inputType + ' ' + options.fieldInfo.finalInputType;
        //如果是必填字段，并且value值为空，则增加class 'sui-form-ctrl-empty'
        if (_fieldIsEmptyWhenRequired(options.model, options.fieldInfo)) {
            innerClass += ' sui-form-ctrl-empty';
        }

        var html = '<div ' + $.sui.attrBuilder({'class': innerClass + (required ? ' sui-form-ctrl-required' : '')}) + '>';
        //label标签
        html += '<label ' + $.sui.attrBuilder({'class': 'sui-form-ctrl-title'}) + '>';
        //是否必填，数据notNull属性
        if (required) {
            html += '<span ' + $.sui.attrBuilder({'class': 'sui-form-required'}) + '>*</span>';
        }
        //title信息闭合标签
        html += options.fieldInfo.display.escapeHTML();
        html += '</label>';
        //sui-form-ctrl-field,根据auth在权限中生成对应的值
        var authClass = 'sui-auth-' + $.sui.getFieldAuth((options.model.auth || 'edit' ));
        html += '<div' + $.sui.attrBuilder({'class': 'sui-form-ctrl-field ' + authClass}) + '>';

        if (options.fieldInfo.relation && ['2', '3'].indexOf(options.fieldInfo.relation.toRelationFormType) != -1 && options.model.through) {
            //无流程的穿透
            html += '<div' + $.sui.attrBuilder({'class': 'sui-form-ctrl-field-main un-flow-relationform-through'}) + '>';
        } else {
            html += '<div' + $.sui.attrBuilder({'class': 'sui-form-ctrl-field-main'}) + '>';
        }

        //控件本身
        var inputAttrObj = {'class' : 'sui-form-ctrl-value',  'id': options.fieldInfo.name,  'fieldname' : options.fieldInfo.fieldName, 'inputtype' : options.fieldInfo.inputType};

        //是否要required
        if (required) {
            inputAttrObj['required'] = 'true';
        }

        //是否要validate,默认先都需要
        inputAttrObj['validate'] = 'true';
        //设置placeholder
        inputAttrObj['placeholder'] = (options.fieldInfo.desc || '').escapeHTML();

        if (options.fieldInfo.fieldType == 'DECIMAL') {
            inputAttrObj['type'] = 'number';
            inputAttrObj['name'] = 'number';
        } else {
            inputAttrObj['type'] = 'text';
            inputAttrObj['name'] = 'text';
        }

        if ($.sui.getFieldAuth(options.model.auth) != 'edit') {
            inputAttrObj['readonly'] = 'true';
            inputAttrObj['disabled'] = 'disabled';
        }

        //设置value属性
        //inputAttrObj['value'] = options.model.value;
        //html += '<input ' + $.sui.attrBuilder(inputAttrObj) + '/>';
        var inputType = options.fieldInfo.inputType == 'relation' ? options.fieldInfo.finalInputType : options.fieldInfo.inputType;
        html +=  _buildCtrlDom(inputAttrObj, options, inputType, $.sui.getFieldAuth(options.model.auth));
        //sui-form-ctrl-field的闭合标签
        html += '</div>';
        html += '</div>';

        //sui-form-ctrl-inner的闭合标签
        html += '</div>';

        //通知iscroll进行refersh
        $.sui.refreshIScrollAsync();

        return html;
    }

    $.sui.attrBuilder = function (attrObj) {
        var html = '';
        for (var key in attrObj) {
            html += ' ' + key + '="' + (attrObj[key] || '') + '"';
        }
        return html;
    }

    $.sui.clone = function (obj, clear) {
        var objClone;
        if (obj.constructor == Object){
            objClone = new obj.constructor();
        }else{
            objClone = new obj.constructor(obj.valueOf());
        }
        for(var key in obj){
            if ( objClone[key] != obj[key] ){
                if ( typeof obj[key] == 'object' ){
                    objClone[key] = $.sui.clone(obj[key], clear);
                }else{
                    objClone[key] = obj[key];

                    if (clear) {
                        if (key == 'value' || key == 'display') {
                            objClone[key] = '';
                        }
                    }
                }
            }
        }
        objClone.toString = obj.toString;
        objClone.valueOf = obj.valueOf;
        return objClone;
    }

    $.sui.getBindId = function (fieldInfo) {
        return '';
    }

    //子表增加记录
    $.sui.addRecordInSubTable = function(actionType, tableName, record, callback) {
        //增加重复表之前发一个事件
        SuiEvent.trigger({target: document, eventName: 'sui_form_beforeAddRecord', data: {tableName:tableName, record: record}}, function(err, result){
            if (err) {
                cmp.dialog.loading(false);
                $.notification.alert(err.message, null, '', $.i18n('form.btn.ok'));
                return;
            }

            var data = {};
            for (var key in record) {
                if (key.indexOf('field') == 0) {
                    data[key] = record[key].value;
                }
            }

            var options = {
                formMasterId: s3scope.formMasterId,
                formId: s3scope.formId,
                rightId: s3scope.rightId,
                tableName: tableName,
                type: actionType,
                recordId: record.__id,
                data: data
            };

            $.sui.dataService.capForm.addOrDelDataSubBean(options, function(err, data){
                if (err) {
                    cmp.dialog.loading(false);
                    $.notification.alert(err.message || err.msg || 'Error when calling addOrDelDataSubBean!', null, '', $.i18n('form.btn.ok'));
                    return;
                }
                $.sui.refreshFormData(record, data, function(refreshErr, newItem){
                  //增加重复行后触发一个事件,这里的record是定位的record
                  SuiEvent.trigger({target: document, eventName: 'sui_form_afterAddRecord', data: {tableName:tableName, record: record}}, function(err, result){
                  });

                  callback && callback(refreshErr, newItem);
                });
            });
        });
    }

    //子表删除记录
    $.sui.delRecordInSubTable = function(actionType, tableName, record, callback) {
        //删除重复行前触发一个事件
        SuiEvent.trigger({target: document, eventName: 'sui_form_beforeDelRecord', data: {tableName:tableName, record: record}}, function(err, result){
            var options = {
                formMasterId: s3scope.formMasterId,
                formId: s3scope.formId,
                rightId: s3scope.rightId,
                tableName: tableName,
                type: actionType,
                recordId: record.__id
            };

            $.sui.dataService.capForm.addOrDelDataSubBean(options, function(err, data){
                if (err) {
                    cmp.dialog.loading(false);
                    $.notification.alert(err.message || err.msg || 'Error when calling addOrDelDataSubBean!', null, '', $.i18n('form.btn.ok'));
                    return;
                }
                $.sui.refreshFormData(record, data, function (refreshErr, newItem) {
                  //删除重复行后触发一个事件
                  SuiEvent.trigger({target: document, eventName: 'sui_form_afterDelRecord', data: {tableName:tableName, record: record}}, function(err, result){
                  });

                  callback && callback(refreshErr, newItem);
                });
            });
        });
    }

    $.sui.onDeleteAllSubTableRecords = function (tableName, callback) {
        //调用删除所有记录的接口
        if (s3scope.data.children[tableName].data && s3scope.data.children[tableName].data.length > 1) {
            var msg = $.i18n('form.childrenTable.deleteAllConfirm');

            $.notification.confirm(msg, function(index){
                if (index == 1) {
                    cmp.dialog.loading();
                    var firstRecord = s3scope.data.children[tableName].data[0];
                    $.sui.delAllRecordInSubTable( tableName, firstRecord, function (err, result){
                        cmp.dialog.loading(false);
                        callback && callback(err, result);
                    });
                }
            }, '', [$.i18n('form.btn.cancel'), $.i18n('form.btn.ok')]);
        } else {
            $.notification.alert($.i18n('form.childrenTable.deleteLastNotice'), null, '', $.i18n('form.btn.ok'));
        }
    }

    //删除当前重复表所有记录
    $.sui.delAllRecordInSubTable = function ( tableName, firstRecord, callback) {
        var data = {};
        for (var key in firstRecord) {
            if (key.indexOf('field') == 0) {
                data[key] = firstRecord[key].value;
            }
        }

        var options = {
            formMasterId: s3scope.formMasterId,
            formId: s3scope.formId,
            rightId: s3scope.rightId,
            moduleId: s3scope.moduleId,
            tableName: tableName,
            remainId: firstRecord.__id,
            data: data
        };

        $.sui.dataService.capForm.delAllRepeat(options, function(err, data){
            if (err) {
                $.notification.alert('Error when calling delAllRepeat!', null, '', $.i18n('form.btn.ok'));
                return;
            }
            s3scope.data.children[tableName].data.splice(0);
            //BUG OA-153412 移动端待办处理数据，重复表存在分页时，删除全部行数据后，查看更多按钮还在
            s3scope.unShowSubDataIdMap && s3scope.unShowSubDataIdMap[tableName] instanceof Array && s3scope.unShowSubDataIdMap[tableName].splice(0);
            //!!! 与重复表其他操作返回的数据不一致，后续需要修改，这里应该不需要访问result
            $.sui.refreshFormData(null, !data.results ? data : data.results, function(){
                callback && callback(err, data);
            });
        });
    }

    function _beforeRefresh (data) {
        //因为部分字段的value一直不变，后台计算回填也不会触发Vue的刷新操作
        if (data.master && s3scope.metadata.fieldInfo) {
            Object.keys(data.master).forEach(function(key){
                if (data.master[key] instanceof Object && data.master[key].value !== undefined && s3scope.data.master[key]) {
                    if (s3scope.metadata.fieldInfo[key] && s3scope.metadata.fieldInfo[key].fieldType == 'DECIMAL') {
                        s3scope.data.master[key].value = '0000000000';
                    } else {
                        s3scope.data.master[key].value = '     ';
                    }
                }
            });
        }

        if (data.children && s3scope.metadata.children) {
            for (var childTable in data.children) {
                var newRecords = data.children[childTable].data;
                if (newRecords && s3scope.data.children[childTable] && s3scope.metadata.children[childTable]) {
                    var len = newRecords.length;
                    //将s3scope.data.children[childTable]变成字典
                    var oldRecords = s3scope.data.children[childTable].data || [];
                    var oldDict = _arrToDict(oldRecords);
                    for (var i=0; i<len; i++) {
                        var record = newRecords[i];
                        //判断记录id在s3scope中是否存在
                        if (oldDict.hasOwnProperty(record.__id)) {

                            Object.keys(record).forEach(function(key) {
                                if (record[key] instanceof Object && record[key].value !== undefined && oldDict[record.__id][key]) {
                                    //oldDict[record.__id][key].value = oldDict[record.__id][key].value + ' ';

                                    if (s3scope.metadata.children[childTable] && s3scope.metadata.children[childTable].fieldInfo[key] && s3scope.metadata.children[childTable].fieldInfo[key].fieldType == 'DECIMAL') {
                                        oldDict[record.__id][key].value = '0000000000';
                                    } else {
                                        oldDict[record.__id][key].value = '     ';
                                    }
                                }
                            });
                        }
                    }
                }
            }
        }
    }

    /**
    * 根据参数设置表单字段的值 fieldName：控件id,如field0001，isMaster：是否主表，tableName：表名，recordId：重复行记录如果主表则为空，value：需要设置的值，display：需要设置的
    * @param opts {fieldName:xxx, isMaster:xxx, tableName:xxx, recordId:xxx, value:xxx, display:xxx}
    */
    $.sui.setFieldData = function (opts) {
        //{fieldName, isMaster, tableName, recordId
        if (window.s3scope) {
            var model = null;
            if (opts.isMaster && window.s3scope.data && window.s3scope.data.master) {
                model = window.s3scope.data.master[opts.fieldName];
                if (model) {
                    model.value = typeof opts.value != 'undefined' ? opts.value : model.value;
                    model.display = typeof opts.display != 'undefined' ? opts.display : model.display;
                }
            } else if (!opts.isMaster && window.s3scope.data && window.s3scope.data.children) {
                var records = window.s3scope.data.children[opts.tableName].data;
                    if (records instanceof Array) {
                    var record = records.filter(function (o) {
                        return o.__id == opts.recordId;
                    });

                    if (record.length > 0 && (model = record[0][opts.fieldName])) {
                        if (model) {
                            model.value = typeof opts.value != 'undefined' ? opts.value : model.value;
                            model.display = typeof opts.display != 'undefined' ? opts.display : model.display;
                        }
                    }
                }
            }
        }
    }

    /**
    * 根据参数返回表单字段的值 fieldName：控件id，isMaster：是否主表，tableName：表名，recordId：重复行记录如果主表则为空
    * @param opts {fieldName:xxx, isMaster:xxx, tableName:xxx, recordId:xxx}
    * @returns {返回model对象 {value:xxx, display:xxx,auth:xxx}}
    */
    $.sui.getFieldData = function (opts) {
      //{fieldName, isMaster, tableName, recordId
        if (window.s3scope) {
            var model = null;
            if (opts.isMaster && window.s3scope.data && window.s3scope.data.master) {
                model = window.s3scope.data.master[opts.fieldName];
                if (model) return model;
            } else if (!opts.isMaster && window.s3scope.data && window.s3scope.data.children) {
                var records = window.s3scope.data.children[opts.tableName].data;
                if (records instanceof Array) {
                    var record = records.filter(function (o) {
                        return o.__id == opts.recordId;
                    });

                    if (record.length > 0 && (model = record[0][opts.fieldName])) {
                        if (model) return JSON.parse(JSON.stringify(model)); //返回一个全新的的对象，无论修改与否，对表单不影响
                    }
                }

            }
        } else {
            return null;
        }
    }

    /**
    * 返回当前表单在内存中的数据，全表单内容
    * @returns 返回s3scope.data
    */
    $.sui.getFormData = function () {
        if (window.s3scope && typeof window.s3scope.data === 'object') {
          return JSON.parse(JSON.stringify(window.s3scope.data));
        }
    }

    /**
    * 返回当前表单在内存中的metadata
    * @returns 返回s3scope.metadata
    */
    $.sui.getFormMetaData = function () {
        if (window.s3scope && typeof window.s3scope.metadata === 'object') {
            return JSON.parse(JSON.stringify(window.s3scope.metadata));
        }
    }

    $.sui.refreshFormData = function (posItem, results, callback) {
        if(!results || !results.data) {
            //BUG OA-143173 (2018-4-9) 修改BUG，当删除或其它关联计算后台返回的是空对象的时候，兼容一下
            //callback && callback({message: '没有刷新页面'});
            callback && callback(null, {});
            //触发后台刷新事件
            SuiEvent.trigger({target: document, eventName: 'sui_form_afterCalculate', data: {}}, function(err, result){});
            return;
        }

        var newItem = {};
        var data = results.data;
        //先初始化将要刷新的字段model
        _beforeRefresh(data);
        Vue.nextTick(function () {
            //如果有master
            if (data.master) {
                Object.keys(data.master).forEach(function(key){
                    if (data.master[key] instanceof Object && data.master[key].value !== undefined && s3scope.data.master[key]) {
                        if (data.master[key].attData) {
                            Object.keys(data.master[key]).forEach(function(attr){
                                if (attr == 'attData') {
                                    s3scope.data.master[key].attData.splice(0);
                                    (data.master[key].attData || []).forEach(function(item){
                                        item.reference = s3scope.moduleId;
                                        s3scope.data.master[key].attData.push(item);
                                    });
                                } else {
                                    s3scope.data.master[key][attr] = data.master[key][attr];
                                }
                            });
                        } else {
                            Object.keys(data.master[key]).forEach(function(attr){
                                s3scope.data.master[key][attr] = data.master[key][attr];
                            });
                        }
                    }
                });
            }

            //如果有子表
            if (data.children) {
                for (var childTable in data.children) {
                    //设置allowAdd和allowDelete
                    if (s3scope.data.children[childTable]) {
                        if (data.children[childTable].allowAdd != undefined) {
                            s3scope.data.children[childTable].allowAdd = data.children[childTable].allowAdd || false;
                        }
                        if (data.children[childTable].allowDelete != undefined) {
                            s3scope.data.children[childTable].allowDelete = data.children[childTable].allowDelete || false;
                        }
                    }

                    var newRecords = data.children[childTable].data;
                    if (newRecords && s3scope.data.children[childTable]) {
                        var len = newRecords.length;
                        //将s3scope.data.children[childTable]变成字典
                        var oldRecords = s3scope.data.children[childTable].data || [];
                        var oldDict = _arrToDict(oldRecords);
                        var emptyNum = 0;
                        for (var i=0; i<len; i++) {
                            var record = newRecords[i];
                            //判断记录id在s3scope中是否存在，如果存在，则替换所有属性，如果不存在，则找到posItem位置，然后插入
                            if (oldDict.hasOwnProperty(record.__id)) {

                                Object.keys(record).forEach(function(key) {
                                    if (record[key] instanceof Object && record[key].value !== undefined && oldDict[record.__id][key]) {
                                        //oldDict[record.__id][key] = record[key];
                                        //如果当前字段有attData,并且attData不为空,又是坑爹的特殊逻辑
                                        if (record[key].attData) {
                                            Object.keys(record[key]).forEach(function(attr){
                                                if (attr == 'attData') {
                                                    oldDict[record.__id][key].attData.splice(0);
                                                    (record[key].attData || []).forEach(function(item){
                                                        item.reference = s3scope.moduleId;
                                                        oldDict[record.__id][key].attData.push(item);
                                                    });
                                                } else {
                                                    oldDict[record.__id][key][attr] = record[key][attr];
                                                }
                                            });
                                        } else {
                                            Object.keys(record[key]).forEach(function(attr){
                                                oldDict[record.__id][key][attr] = record[key][attr];
                                            });
                                        }
                                    }
                                });

                            } else {
                                if (posItem) {
                                    emptyNum++;
                                    var index = oldRecords.indexOf(posItem) + emptyNum; //如果关联操作带过来多行记录，pos位置相应后移
                                    oldRecords.splice(index, 0, record);
                                    newItem = record;
                                } else {
                                    //如果没有目标item，始终在最后一行加
                                    var index = oldRecords.length;
                                    oldRecords.splice(index, 0, record);
                                    newItem = record;
                                }
                            }
                        }
                    }
                }

                //触发更新工具条
                $.sui.trigger('onupdatetoolbar');
            }

            callback && callback(null, newItem);
            //触发后台刷新事件
            SuiEvent.trigger({target: document, eventName: 'sui_form_afterCalculate', data: data}, function(err, result){
            });
        });
    }

    $.sui.onImgLoadHandler = function (e) {
        var target = e.target;
        //只有轻表单才计算
        if (target.tagName == 'IMG') {
            var rect = target.parentNode.getBoundingClientRect();
            var outerWidth = rect.width || 110;
            var outerHeight = rect.height || 110;
            console.log(outerWidth);
            console.log(outerHeight);
            if (s3scope.metadata.templateType == 'lightForm') {
                if (target.width > outerWidth && target.height > outerHeight) {
                    if (target.width > target.height) {
                        target.style.height = '100%';
                    } else {
                        target.style.width = '100%';
                    }
                } else {
                    target.style.maxWidth = '100%';
                    target.style.maxHeight = '100%';
                }
            } else {
                //如果图片width < 30px,或者高度为0，则改变一下布局
                if (target.width < 30 || target.height == 0) {
                  target.parentNode.parentNode.setAttribute('style', 'padding-right:0px !important;');
                  if (target.parentNode.parentNode.childNodes.length > 1) {
                    target.parentNode.parentNode.childNodes[1].style.position = 'static';
                    target.parentNode.parentNode.childNodes[1].style.transform = 'none';
                  }
                  target.style.width = '100%';
                  if (target.parentNode.childNodes.length > 1) {
                    target.parentNode.childNodes[1].style.position = 'static';
                    target.parentNode.childNodes[1].style.transform = 'none';
                  }
                } else if (target.width < outerWidth && target.height < outerHeight) {
                  //原表单处理一下图片比容器小的情况，等比拉升放大
                    if (target.width / target.height > outerWidth / outerHeight) {
                        target.style.width = '100%';
                    } else {
                        target.style.height = '100%';
                    }
                }

                //调用一下异步刷新iscroll
                $.sui.refreshIScrollAsync();
            }
        }
    }

    $.sui.maplocate_clickHandler = function (e, that, model, fieldInfo, callback) {
        if (!$.platform.CMPShell) {
            $.notification.alert($.i18n('form.weixin.canNotMaplocate'), null, '', $.i18n('form.btn.ok'));
            callback && callback();
            return;
        }

        //如果是关联表单带过来的LBS，也只有只读权限
        if ($.sui.getFieldAuth(model.auth) != 'edit' || fieldInfo.inputType == 'relationform') {
            //查看
            if (model.value) {
                var opt = {
                    lbsUrl: $.serverIp + "/seeyon/rest/cmplbs/" + model.value,
                    userName:"", // 用户名（可以不传）
                    memberIconUrl:"" // 用户头像url地址 （可以不传）
                };
                $.lbs.showLocationInfo(opt);
            }
            callback && callback();
            return;
        }

        if (e.target.classList.contains('see-icon-v5-form-close-circle-fill')) {
            model.__state = 'modified';
            model.display = '';
            model.editAttr = true;
            that.set('');
            that.update('');

            //发送请求到后台，执行数据更新 dealLbsFieldRelation
            var recordId = $.sui.getRecordIdByVueElement(that.el, fieldInfo);
            var options = {
                formDataId: s3scope.formMasterId,
                formId: s3scope.formId,
                moduleId: s3scope.moduleId,
                rightId: s3scope.rightId,
                fieldName: fieldInfo.name,
                recordId: recordId,
                lbsId: model.value,
                data: s3scope.data,
                attachmentInputs: $.sui.getAttachments(s3scope.attachmentInputs)
            };
            $.sui.dataService.capForm.dealLbsFieldRelation(options, function(err, data){
                if (err) {
                    $.notification.alert(err.message || 'Error when calling dealLbsFieldRelation!', null, '', $.i18n('form.btn.ok'));
                    return;
                }

                $.sui.refreshFormData(null, !data.results ? data : data.results);
            });
        } else if (e.target.classList.contains('see-icon-v5-form-location-fill')) {
            $.lbs.getLocationInfo({
                success: function (lbsData) {
                    if (typeof lbsData == 'string') {
                        lbsData = JSON.parse(lbsData);
                    }
                    if (lbsData) {
                        $.sui.dataService.cmplbs.save(lbsData, function(err, result){
                            model.display = lbsData.lbsAddr;
                            model.__state = 'modified';
                            model.editAttr = true;
                            that.set(result.value);
                            that.update(model.value);

                            //发送请求到后台，执行数据更新 dealLbsFieldRelation
                            var recordId = $.sui.getRecordIdByVueElement(that.el, fieldInfo);
                            var options = {
                                formDataId: s3scope.formMasterId,
                                formId: s3scope.formId,
                                moduleId: s3scope.moduleId,
                                rightId: s3scope.rightId,
                                fieldName: fieldInfo.name,
                                recordId: recordId,
                                lbsId: result.value,
                                data: $.sui.reduceSubmitData(s3scope.data),
                                attachmentInputs: $.sui.getAttachments(s3scope.attachmentInputs)
                            };
                            $.sui.dataService.capForm.dealLbsFieldRelation(options, function(err, data){
                                if (err) {
                                    $.notification.alert(err.message || 'Error when calling dealLbsFieldRelation!', null, '', $.i18n('form.btn.ok'));
                                    callback && callback();
                                    return;
                                }

                                $.sui.refreshFormData(null, !data.results ? data : data.results);
                            });
                        });
                    }
                },
                error: function (err) {
                    $.notification.alert(err.message || 'Error when calling cmp.lbs.getLocationInfo!', null, '', $.i18n('form.btn.ok'));
                    callback && callback();
                }
            });
        } else if (e.target.classList.contains('sui-form-ctrl-maplocate')) {
            if (model.value) {
                var opt = {
                    lbsUrl: $.serverIp + "/seeyon/rest/cmplbs/" + model.value,
                    userName:"", // 用户名（可以不传）
                    memberIconUrl:"" // 用户头像url地址 （可以不传）
                };
                $.lbs.showLocationInfo(opt);
            }
        }

        callback && callback();
    }

    $.sui.mapmarked_clickHandler = function (e, that, model, fieldInfo) {
        if (!$.platform.CMPShell) {
            $.notification.alert($.i18n('form.weixin.canNotMapmarked'), null, '', $.i18n('form.btn.ok'));
            return;
        }

        //如果是关联表单带过来的LBS，也只有只读权限
        if ($.sui.getFieldAuth(model.auth) != 'edit' || fieldInfo.inputType == 'relationform') {
            //查看
            if (model.value) {
                var opt = {
                    lbsUrl: $.serverIp + "/seeyon/rest/cmplbs/" + model.value,
                    userName:"", // 用户名（可以不传）
                    memberIconUrl:"" // 用户头像url地址 （可以不传）
                };
                $.lbs.showLocationInfo(opt);
            }
            return;
        }

        var a = $.lbs.markLocation({
            success: function(lbsData){
                if (typeof lbsData == 'string') {
                    lbsData = JSON.parse(lbsData);
                }

                if (lbsData) {
                    $.sui.dataService.cmplbs.save(lbsData, function(err, result){
                        model.display = lbsData.lbsAddr;
                        model.__state = 'modified';
                        model.editAttr = true;
                        that.set(result.value);
                        that.update(model.value);

                        //发送请求到后台，执行数据更新 dealLbsFieldRelation
                        var recordId = $.sui.getRecordIdByVueElement(that.el, fieldInfo);
                        var options = {
                            formDataId: s3scope.formMasterId,
                            formId: s3scope.formId,
                            moduleId: s3scope.moduleId,
                            rightId: s3scope.rightId,
                            fieldName: fieldInfo.name,
                            recordId: recordId,
                            lbsId: result.value,
                            data: $.sui.reduceSubmitData(s3scope.data),
                            attachmentInputs: $.sui.getAttachments(s3scope.attachmentInputs)
                        };
                        $.sui.dataService.capForm.dealLbsFieldRelation(options, function(err, data){
                            if (err) {
                                $.notification.alert(err.message || 'Error when calling dealLbsFieldRelation!', null, '', $.i18n('form.btn.ok'));
                                return;
                            }

                            $.sui.refreshFormData(null, !data.results ? data : data.results);
                        });
                    });
                }
            }
        });
    }

    function _uploadPhoto (that, model, fieldInfo, targetServer, uploadUrl, serverDateUrl) {
        cmp.dialog.loading();
        $.lbs.takePicture({
            uploadPicUrl: uploadUrl,
            serverDateUrl: serverDateUrl,
            userName: $.member && $.member.name ? $.member.name :  '',
            success: function (lbsData) {
                cmp.dialog.loading(false);
                if (typeof lbsData == 'string') {
                    lbsData = JSON.parse(lbsData);
                }

                if (lbsData) {
                    $.sui.dataService.cmplbs.save(lbsData, function(err, result){
                        //拍照定位只允许选一个，要替换之前的图片
                        model.attData.splice(0);
                        var subReference = result.value;
                        //alert(subReference);
                        var reference = s3scope.moduleId;
                        (lbsData.listAttachment || []).forEach(function(item){
                            item.subReference = subReference;
                            item.reference = reference;
                            item.createdate = item.createdate || new Date().getTime().toString();
                            model.attData.push(item);

                        });

                        model.__state = 'modified';
                        model.editAttr = true;
                        that.set(result.value);
                        that.update(result.value);

                        //发送请求到后台，执行数据更新 dealLbsFieldRelation
                        var recordId = $.sui.getRecordIdByVueElement(that.el, fieldInfo);
                        var options = {
                            formDataId: s3scope.formMasterId,
                            formId: s3scope.formId,
                            moduleId: s3scope.moduleId,
                            rightId: s3scope.rightId,
                            fieldName: fieldInfo.name,
                            recordId: recordId,
                            lbsId: result.value,
                            data: $.sui.reduceSubmitData(s3scope.data),
                            attachmentInputs: $.sui.getAttachments(s3scope.attachmentInputs)
                        };
                        $.sui.dataService.capForm.dealLbsFieldRelation(options, function(err, data){
                            if (err) {
                                $.notification.alert(err.message || 'Error when calling dealLbsFieldRelation!', null, '', $.i18n('form.btn.ok'));
                                return;
                            }

                            $.sui.refreshFormData(null, !data.results ? data : data.results);
                        });
                    });
                }
            },
            cancel: function () {
                cmp.dialog.loading(false);
            },
            error: function (err) {
                cmp.dialog.loading(false);
            }
        });
    }

    $.sui.mapphoto_clickHandler = function (e, that, model, fieldInfo) {
        if ($.sui.getFieldAuth(model.auth) != 'edit') {
            return;
        }
        if (e.target.tagName == 'IMG') {
            console.log(e.target);
            //打开图片
        } else if (e.target.classList.contains('see-icon-v5-form-close-circle') || e.target.classList.contains('see-icon-v5-form-close-circle-fill')) {

            var msg = $.i18n('form.photo.deleteConfirm');
            $.notification.confirm(msg, function(index){
                if (index == 1) {
                    model.attData.splice(0);
                    model.__state = 'modified';
                    model.editAttr = true;
                    that.set('');
                    that.update(model.value);

                    //发送请求到后台，执行数据更新 dealLbsFieldRelation
                    var recordId = $.sui.getRecordIdByVueElement(that.el, fieldInfo);
                    var options = {
                        formDataId: s3scope.formMasterId,
                        formId: s3scope.formId,
                        moduleId: s3scope.moduleId,
                        rightId: s3scope.rightId,
                        fieldName: fieldInfo.name,
                        recordId: recordId,
                        lbsId: model.value,
                        data: $.sui.reduceSubmitData(s3scope.data),
                        attachmentInputs: $.sui.getAttachments(s3scope.attachmentInputs)
                    };
                    $.sui.dataService.capForm.dealLbsFieldRelation(options, function(err, data){
                        if (err) {
                            $.notification.alert(err.message || 'Error when calling dealLbsFieldRelation!', null, '', $.i18n('form.btn.ok'));
                            return;
                        }

                        $.sui.refreshFormData(null, !data.results ? data : data.results);
                    });
                }
            }, '', [$.i18n('form.btn.cancel'), $.i18n('form.btn.ok')]);

        } else if (e.target.parent('.image-add-item')) {
            if (!$.platform.CMPShell) {
                $.notification.alert($.i18n('form.weixin.canNotMapphoto'), null, '', $.i18n('form.btn.ok'));
                return;
            }

            var targetServer = $.sui.dataService.debug ? $.sui.dataService.targetServer : $.serverIp;
            var uploadUrl = targetServer + '/seeyon/rest/attachment?option.n_a_s=1';
            var serverDateUrl = targetServer + '/seeyon/rest/cmplbs/servertime';

            if (model.attData.length > 0) {
                var msg = $.i18n('form.photo.updateConfirm');
                $.notification.confirm(msg, function(index){
                    if (index == 1) {
                        _uploadPhoto(that, model, fieldInfo, targetServer, uploadUrl, serverDateUrl);
                    }
                }, '', [$.i18n('form.btn.cancel'), $.i18n('form.btn.ok')]);
            } else {
                _uploadPhoto(that, model, fieldInfo, targetServer, uploadUrl, serverDateUrl);
            }
        }
    }

    $.sui.getSelectedRecordIds = function () {
        var ids = {};
        Object.keys(s3scope.data.children || {}).forEach(function(subTable){
            ids[subTable] = [];
            var data = s3scope.data.children[subTable].data;
            (data || []).forEach(function(record){
                if (record.selected) {
                    ids[subTable].push(record.__id);
                }
            });
        });
        return ids;
    }

    $.sui.getFormCtrl = function (target) {
        return target.closest('.sui-form-ctrl');
    }

    $.sui.getFormCtrlIdByVueElement = function(el) {
        var ctrlId = '';
        var ctrl = $.sui.getFormCtrl(el);
        if (ctrl) {
            ctrlId = ctrl.id;
        }
        return ctrlId;
    }

    $.sui.getRecordIdByVueElement = function(el, fieldInfo) {
        var recordId = 0;
        if (!fieldInfo.masterField) {
            var dom = el.parent('[recordid]');
            if (dom) {
                recordId = dom.getAttribute('recordid');
            }
        }
        return recordId;
    }

    $.sui.getRecordIdByDom = function(target) {
        var recordId = 0;
        var dom = target.closest('[recordid]');
        if (dom) {
            recordId = dom.getAttribute('recordid');
        }
        return recordId;
    }

    $.sui.getRecordIndexByVueElement = function(el, fieldInfo) {
        var recordIndex = 0;
        if (!fieldInfo.masterField) {
            var dom = el.parent('[recordindex]');
            if (dom) {
                recordIndex = dom.getAttribute('recordindex');
            }
        }
        return recordIndex;
    }

    $.sui.getFieldAuth = function (auth) {
        //关联穿透的时候，如果是hide直接返回
        return s3scope.allowCheck ? (auth == 'hide' ? auth : 'browse') : auth;
    }

    $.sui.trigger = function (code, target) {
        target = target || document;
        var event = target.createEvent('HTMLEvents');
        event.initEvent(code, true, true);
        event.eventType = 'form_event';
        target.dispatchEvent(event);
    }

    $.sui.attachmentDataConverter = function (attData, data, subReference, isNew) {
        (data || []).forEach(function(o){
            if (typeof o == 'string') {
                try {
                    o = JSON.parse(o);
                } catch (e){}
            }

            var item = {};
            if (!o.fileUrl) {
                item.category = '1';
                item.extraMap = {};
                item.genesisId = null;
                item.new = isNew;
                item.officeTransformEnable = "disable";0
                item.reference = s3scope.moduleId; //??设置什么呢
                item.sort = '0';
                item.subReference = subReference;
                item.type = '2';
                item.v = '0';

                if (o.type == 'docFile') {
                    var createDate = new Date(o.fr_create_time);
                    createDate = isNaN(createDate) ? new Date() : createDate;
                    item.createdate = createDate.format('yyyy-MM-dd hh:mm');
                    item.fileUrl = o.fr_id;
                    item.description = o.fr_id;
                    item.filename = o.fr_name;
                    item.icon = "km.gif";
                    item.id = o.id;
                    item.mimeType = 'km';
                    item.size = o.fr_size.toString();
                } else if (o.type == 'collaboration'){
                    var createDate = new Date(o.createDate);
                    createDate = isNaN(createDate) ? new Date() : createDate;
                    item.createdate = createDate.format('yyyy-MM-dd hh:mm');
                    item.fileUrl = o.affairId;
                    item.description = o.affairId;
                    item.filename = o.subject;
                    item.icon = "collaboration.gif";
                    item.id = o.id;
                    item.mimeType = 'collaboration';
                    item.size = '0';
                } else {
                    //公文
                    var createDate = new Date(o.createDate);
                    createDate = isNaN(createDate) ? new Date() : createDate;
                    item.createdate = createDate.format('yyyy-MM-dd hh:mm');
                    item.fileUrl = o.affairId;
                    item.description = o.affairId;
                    item.filename = o.summary.subject;
                    item.icon = "edoc.gif";
                    item.id = o.affairId; //这个不知道如何填
                    item.mimeType = 'edoc';
                    item.size = '0';
                }
            }  else {
                Object.keys(o).forEach(function(key){
                    item[key] = o[key];
                });
            }

            attData.push(item);
        });

        return attData;
    }

    $.sui.doCalculate = function (el, fieldInfo) {
        if (fieldInfo.inCalc || fieldInfo.inCondition) {
            var recordId = $.sui.getRecordIdByVueElement(el, fieldInfo);
            var options = {
                formMasterId: s3scope.formMasterId,
                formId: s3scope.formId,
                moduleId: s3scope.moduleId,
                rightId: s3scope.rightId,
                fieldName: fieldInfo.name,
                recordId: recordId,
                data: $.sui.reduceSubmitData(s3scope.data),
                attachmentInputs: $.sui.getAttachments(s3scope.attachmentInputs)
            };

            $.sui.preventSubmit = true;
            $.sui.onCalcing = true;
            $.sui.dataService.capForm.calculate(options, function(err, data){
                if (err) {
                    $.notification.alert(err.message || 'Error when calling calculate!', function(){
                        $.sui.preventSubmit = false;
                        $.sui.onCalcing = false;
                    }, '', $.i18n('form.btn.ok'));

                    return;
                }

                $.sui.refreshFormData(null, !data.results ? data : data.results, function(){
                    $.sui.preventSubmit = false;
                    $.sui.onCalcing = false;
                });
            });
        }
    }

    $.sui.doDecodeBarCode = function (info) {
        if (typeof info.text == 'object') {
            info.text = JSON.stringify(info.text);
        }
        //如果能解析成json，则是系统生成的二维码
        try {
            var test = JSON.parse(info.text);
            //有content标记通过后台去解析，没有content，则直接写到有焦点的ctrl里面
            if (test && test.content) {
                var currentField = '';
                var tableName = '';
                var recordId = '0';
                if ($.sui.lastPosCtrlId) {
                    var ret = _getModelInfoByCtrlId($.sui.lastPosCtrlId);
                    currentField = ret.fieldInfo.name;
                    tableName = ret.fieldInfo.ownerTableName;
                    var ids = ($.sui.lastPosCtrlId || '').split('|');
                    //BUG OA-143039 (2018-4-11) M3无流程：新建无流程数据，定位到重复表中的文本框扫描URL格式二维码，数据回填失败
                    //如果ids.length === 3,则为重复表，
                    if (ids.length === 3) {
                        recordId = ids[1];
                    }
                }
                var options = {
                    formId: s3scope.formId,
                    currentField: currentField,
                    dataId: s3scope.formMasterId,
                    moduleId: s3scope.moduleId,
                    rightId: s3scope.rightId,
                    tableName: tableName,
                    recordId: recordId,
                    content: info.text,
                    data: $.sui.reduceSubmitData(s3scope.data),
                    attachmentInputs: $.sui.getAttachments(s3scope.attachmentInputs)
                };

                cmp.dialog.loading();
                $.sui.dataService.capForm.decodeBarCode(options, function(err, data){
                    if (err) {
                        cmp.dialog.loading(false);
                        $.notification.alert(err.message || 'Error when calling decodeBarCode!', null, '', $.i18n('form.btn.ok'));
                        return;
                    }

                    $.sui.refreshFormData(null, !data.results ? data : data.results, function(){
                        cmp.dialog.loading(false);
                        //如果有tips，alert出来
                        if (data.tips) {
                            $.notification.alert(data.tips, null, '', $.i18n('form.btn.ok'));
                        }
                    });
                });
            } else {
                if ($.sui.lastPosCtrlId) {
                    var ret = _getModelInfoByCtrlId($.sui.lastPosCtrlId);
                    if (ret.model && ret.fieldInfo) {
                      //BUG M3端处理表单，浏览权限的重复表字段仍可以扫码录入数据
                      if ((ret.model.auth == 'edit' || ret.model.auth == 'add') && (ret.fieldInfo.finalInputType == 'text' || ret.fieldInfo.finalInputType == 'textarea')) {
                            ret.model.display = ret.model.display + info.text;
                            ret.model.value = ret.model.value + info.text
                        }

                    }
                }
            }
            return;

        } catch (e) {}

        if ($.sui.lastPosCtrlId) {
            var ret = _getModelInfoByCtrlId($.sui.lastPosCtrlId);
            if (ret.model && ret.fieldInfo) {
              //BUG M3端处理表单，浏览权限的重复表字段仍可以扫码录入数据
              if ((ret.model.auth == 'edit' || ret.model.auth == 'add') && (ret.fieldInfo.finalInputType == 'text' || ret.fieldInfo.finalInputType == 'textarea')) {
                    ret.model.display = ret.model.display + info.text;
                    ret.model.value = ret.model.value + info.text
                }
            }
        }
    }

    $.sui.doUpdateRelationFormInfo = function (targetId, options, fieldName, display) {
        Vue.nextTick(function(){
            var target = document.getElementById(targetId);
            var recordId = $.sui.getRecordIdByVueElement(target, options.fieldInfo);
            var opts = {
                formMasterDataId: s3scope.formMasterId,
                formId: s3scope.formId,
                moduleId: s3scope.moduleId,
                rightId: s3scope.rightId,
                fieldName: fieldName,
                text: display,
                recordId: recordId
            };
            $.sui.dataService.capForm.showFormRelationRecord(opts, function(err, data){
                console.log(data);

                //如果有异常信息，就输出在input上面
                if (data.errorMsg && target.tagName != 'I') {
                    target.innerHTML = target.innerHTML + '<span style="color:#8f8f8f">[' + data.errorMsg + ']</span>';
                }
                target.setAttribute('see-att-data', JSON.stringify(data));
            });
        });
    }

    $.sui.resize = function (target) {
        if (!target) return;
        var rect = target.getBoundingClientRect();
        var oldHeight = rect.height;
        var o = window.getComputedStyle(target, null);
        var padding = parseInt(o.paddingTop) + parseInt(o.paddingBottom);
        var border = parseInt(o.borderWidth) * 2;
        var lineHeight = parseInt(o.lineHeight);
        var formCtrl = $.sui.getFormCtrl(target);
        var maxRows = (formCtrl && formCtrl.getAttribute('maxrows')) || 4;
        var maxHeight = maxRows * lineHeight + padding + border;
        var initHeight = lineHeight + padding + border;

        target.style.overflowY = 'hidden';
        target.style.height = initHeight + 'px';
        //var realHeight = Math.min((target.scrollHeight + border), maxHeight);
        //需求变更，按实际的大小显示textarea
        var realHeight = target.scrollHeight + border;
        target.style.height = realHeight + 'px';

        if (target.scrollHeight > realHeight) {
            target.style.overflowY = 'auto';
        }
        if (realHeight != oldHeight && s3scope.templateType == 'infopath') {
            $.sui.refreshIScrollAsync();
        }
    }

    //页面关闭前做一些资源释放
    window.onbeforeunload = function () {
        //$.handWriteSignature.clear();
    }

    $.sui.unbind = function (target) {
        target.el.remove();
        target.el = null;
    }

    //监听横竖屏切换的事件
    window.addEventListener('orientationchange', function(e){
        //如果当前是原表单视图，刷新一下iscroll，轻表单暂不处理
        if (window.s3scope && window.s3scope.templateType == 'infopath') {
            setTimeout(function () {
                $.sui.initIScroll();
            }, 0);
        }
    }, false);

    document.addEventListener('tap', function (e) {
        console.log('in document tap');
        var ctrl = $.sui.getFormCtrl(e.target);
        if (ctrl) {
            var ctrlId = ctrl.id;
            if (ctrlId) {
                //如果本次点击命中input，那么强制让上一次的input失去焦点
                if ($.sui.lastPosInput && $.sui.lastPosInput != e.target) {
                    /*2018-3-6 M3-IOS端：发起表单轻表单协同，点击A输入框光标定位到B，A输入框不能成功输入信息,
                    先将此处的强制blur去除，看看ios其他版本有没有焦点切换不成功的情况
                    */
                    //$.sui.lastPosInput.blur();
                }
                $.sui.lastPosCtrlId = ctrlId;
                $.sui.lastPosInput = e.target;
            }
            _allowDbClick = false;
        } else {
            _allowDbClick = true;
        }
        //在原表单中，如果失去焦点，强制执行以下blur
        if(window.s3scope && window.s3scope.templateType == 'infopath'){
            //if (!!document.activeElement && document.activeElement != e.target) {
            //    document.activeElement.blur();
            //}
            //原表单中，如果点中tips，弹出
            if (e.target.classList.contains('sui-form-ctrl-error-tips')) {
                cmp.notification.toast(e.target.innerText,"center");
                e.stopPropagation();
            }
        }

    }, true);

    //在微协同端增加一个关闭页面的监听
    cmp.event.listenClosePage(function(){cmp.storageDB.deleteAll()});

})(cmp, document);

/**
 * Created by yangchao on 2016/8/24.
 */

(function ($, Vue, doc) {
    'use strict';

    Vue.directive('sui-qrscan', {
        params: ['scope'],
        twoWay: true,
        bind: function () {
        },
        update: function (newValue, oldValue) {
            this.unbind();
            if (!s3scope.allowQRScan) {
                return;
            }
            var dom = document.createElement('div');
            dom.classList.add('sui-form-drag');
            dom.setAttribute('draggable', 'true');
            dom.innerHTML = '<i class="see-icon-v5-form-qrscan"></i>';
            document.body.appendChild(dom);
            var that = this;
            var availHeight = window.screen.availHeight;
            var availWidth = window.screen.availWidth;
            var draggable = false;
            var dragging = false;
            var dragStart = {x:0, y: 0};
            //初始化图标left 和 top
            var _timer = null;

            this.clickHandler = function (e) {
                draggable = false;
                dragging = false;

                var target = dom;
                if (target) {
                    target.classList.remove('sui-form-drag-active');
                }

                if (!$.platform.CMPShell) {
                    $.notification.alert($.i18n('form.qr.alert'), null, '', $.i18n('form.btn.ok'));
                    return;
                }

                var options = {
                    success: function (data) {
                        if (!data || data.cancelled == 'Cancel') {
                            return;
                        }

                        $.sui.doDecodeBarCode(data);
                    },
                    error: function (err) {
                        if (err && err.message && err.code != '18006') {
                            if (typeof err.message == 'string') {
                                err.message = JSON.parse(err.message);
                            }
                            if (!err.message.cancelled) {
                                $.notification.alert(JSON.stringify(err.message), null, '', $.i18n('form.btn.ok'));
                            }
                        }
                    }
                };

                $.barcode.scan(options);
            }.bind(this);

            this.touchendHandler = function (e) {
                draggable = false;
                dragging = false;
                var target = dom;
                if (target) {
                    target.classList.remove('sui-form-drag-active');
                }

            }.bind(this);

            this.dragHandler = function (e) {
                var target = dom;
                if (!dragging && target) {
                    dragging = true;
                    target.classList.add('sui-form-drag-active');
                }

                if (draggable) {
                    var limitedBottom = 60;
                    var rect = target.getBoundingClientRect();
                    var realX = dragStart.x + (e.detail.move.x - e.detail.start.x);
                    var realY = dragStart.y + (e.detail.move.y - e.detail.start.y);
                    var maxX = availWidth - parseInt(rect.width);
                    var maxY = availHeight - parseInt(rect.height) - limitedBottom;
                    realX = realX < 0 ? 0 : realX > maxX ? maxX : realX;
                    realY = realY < limitedBottom ? limitedBottom : realY > maxY ? maxY : realY;
                    target.style.top = realY + 'px';
                    target.style.left = realX + 'px';
                }

                e.stopPropagation();
                e.preventDefault();
            }.bind(this);

            this.touchstartHandler = function (e) {
                draggable = true;
                var target = dom;
                var rect = target.getBoundingClientRect();
                dragStart = {x: parseInt(rect.left), y: parseInt(rect.top)};
            }.bind(this);

            this.touchmoveHandler = function (e) {
                e.preventDefault();
            }.bind(this);

            dom.addEventListener('tap',  this.clickHandler);
            dom.addEventListener('touchend', this.touchendHandler);
            dom.addEventListener('drag',  this.dragHandler);
            dom.addEventListener('touchmove',  this.touchmoveHandler);
            dom.addEventListener('touchstart', this.touchstartHandler);

        },
        unbind: function () {
            var domArr = document.querySelectorAll('.sui-form-drag');
            if (domArr && domArr.length > 0) {
                var len = domArr.length;
                for (var i=0; i < len; i++) {
                    var dom = domArr[i];
                    dom.removeEventListener('tap',  this.clickHandler);
                    dom.removeEventListener('touchend', this.touchendHandler);
                    dom.removeEventListener('drag',  this.dragHandler);
                    dom.removeEventListener('touchmove',  this.touchmoveHandler);
                    dom.removeEventListener('touchstart', this.touchstartHandler);
                    dom.remove();
                    dom = null;
                }
            }
        }
    })

})(cmp, Vue, document);
/**
 * Created by yangchao on 2016/8/2.
 */

(function ($, Vue, doc) {
    'use strict';

    Vue.directive('sui-barcode', {
        params: ['scope'],
        twoWay: true,
        bind: function () {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            if (!model || !fieldInfo) return;
            var that = this;
            model.attData = model.attData || [];

            if (model.attData.length > 0) {
                //todo 暂时先在前端这么处理，6.1后台修改，此逻辑必须干掉 12.9
                model.__state = 'modified';
            }

          //将attData装填进attachmentInputs
          this.vm.$nextTick(function(){
            var ctrlId = $.sui.getFormCtrlIdByVueElement(that.el);
            s3scope.attachmentInputs[ctrlId] = model.attData;
          });

            var locked = false;
            var timer = null;

            this.clickHandler = function (e) {
                if (locked) {
                    if (timer) {
                        clearTimeout(timer);
                    }
                    timer = setTimeout(function(){
                        locked = false;
                    }, 5000);
                    return;
                }

                if ($.sui.getFieldAuth(model.auth) != 'edit') {
                    locked = false;
                    return;
                }

                if (e.target.suiMatchesSelector('.see-icon-v5-form-qrcode')) {
                    locked = true;
                    var recordId = $.sui.getRecordIdByVueElement(that.el, fieldInfo);
                    var options = {
                        dataId: s3scope.formMasterId,
                        formId: s3scope.formId,
                        moduleId: s3scope.moduleId,
                        rightId: s3scope.rightId,
                        fieldName: fieldInfo.name,
                        recordId: recordId,
                        data: $.sui.reduceSubmitData(s3scope.data)
                    };

                    $.sui.dataService.capForm.generateBarCode(options, function(err, data) {
                        if (err || !data.attr) {
                            var msg = data && data.msg ? data.msg : '';
                            //OA-109602重复点击图中的生成二维码，生成2层遮罩 ,点击确定后，再解锁
                            $.notification.alert(msg || 'Error when calling generateBarCode!', function(){
                                locked = false;
                            }, '', $.i18n('form.btn.ok'));
                            return;
                        }

                        model.attData.splice(0);
                        model.attData.push(data.attr);
                        that.set(data.attr.subReference);
                        that.update(model.value);
                        locked = false;
                    });
                } else if (e.target.suiMatchesSelector('.see-icon-v5-form-close-circle-fill')) {
                    locked = true;
                    var msg = $.i18n('form.qr.deleteConfirm');
                    $.notification.confirm(msg, function(index){
                        if (index == 1) {
                            model.attData.splice(0);
                            that.set('');
                            that.update('');
                        }
                        locked = false;
                    }, '', [$.i18n('form.btn.cancel'), $.i18n('form.btn.ok')]);
                } else {
                    locked = false;
                }

            }.bind(this);

            this.el.addEventListener('tap', this.clickHandler);
        },
        update: function (newValue, oldValue) {
            // 值更新时的工作
            // 也会以初始值为参数调用一次
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            model.attData = model.attData || [];
            this.el.innerHTML = $.sui.htmlBuilder({value: newValue, desc: '', model: model, fieldInfo: fieldInfo});
        },
        unbind: function () {
            this.el.removeEventListener('tap', this.clickHandler);
        }
    })

})(cmp, Vue, document);
/**
 * Created by yangchao on 2016/6/8.
 */

(function ($, Vue, doc) {
    'use strict';

    Vue.directive('sui-checkbox', {
        params: ['scope'],
        twoWay: true,
        bind: function () {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            if (!model || !fieldInfo) return;
            var that = this;

            this.changeHandler = function (e) {
                //if (e.target.attr)
                // 将数据写回 vm
                //获取当前value和input的值
                var oldValue = model.value;
                var checkbox = this.el.querySelector('input');
                var newValue = checkbox.checked.toString();
                if (oldValue != newValue) {
                    //更新model
                    checkbox.value = newValue;
                    var val = newValue == 'true' ? '1' : '0';
                    this.set(val);
                    model.__state = 'modified';
                    $.sui.clearErrorTips(this.el);

                    $.sui.doCalculate(that.el, fieldInfo);
                }

            }.bind(this);

            this.el.addEventListener('change', this.changeHandler);
        },
        update: function (newValue) {
            // 值更新时的工作
            // 也会以初始值为参数调用一次
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            var that = this;
            var desc = this.el.getAttribute('desc');
            this.el.innerHTML = $.sui.htmlBuilder({value: newValue, desc: desc, model: model, fieldInfo: fieldInfo});
            that.el.querySelector('input').checked = newValue.toString() == 'true' || newValue == '1';

        },
        unbind: function () {
            this.el.removeEventListener('change', this.changeHandler);

        }
    })

})(cmp, Vue, document);
/**
 * Created by yangchao on 2016/5/31.
 */

(function ($, Vue, doc) {
    'use strict';

    Vue.directive('sui-date', {
        params: ['scope'],
        twoWay: true,
        bind: function () {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            if (!model || !fieldInfo) return;

            var year = new Date().getFullYear();
            var _options = {
                type: fieldInfo.finalInputType == 'date' ?  'date' : 'datetime',           //默认为date类型
                beginYear: 1900,        //开始时间
                endYear: year + 50      //结束时间 /*客户BUG 20180124053263 默认将endYear设置为当前+50*/
            };

            var that = this;
            var options = this.params.scope.options;
            var optionItems = model.items || [];
            var dtOptions = $.extend(_options, options);
            var _picker = null;

            //判断权限是否绑定点击事件
            this.clickHandler = function (e) {

                if ($.sui.getFieldAuth(model.auth) != 'edit') {
                    return;
                }

                var action = e.target.getAttribute('action');

                //如果是点击的清除数据，则停止冒泡
                if (action == 'clear-value') {
                    that.set('');
                    model.display = '';
                    model.__state = 'modified';
                    this.update('');
                    $.sui.doCalculate(that.el, fieldInfo);
                    e.stopPropagation();
                    return;
                }

                dtOptions.value = model.value;
                _picker = new $.DtPicker(dtOptions);
                console.log(_picker);
                _picker.show(function(res) {
                    var newValue = res.value || '';
                    console.log(newValue);
                    var oldValue = model.value;
                    if (oldValue != newValue) {
                        //更新model
                        that.set(newValue);
                        model.__state = 'modified';
                        that.update(newValue);

                        $.sui.doCalculate(that.el, fieldInfo);
                    }
                    _picker.dispose();
                    _picker = null;
                }, function(){
                    _picker.dispose();
                    _picker = null;
                });

            }.bind(this);

            this.el.addEventListener('tap', this.clickHandler);

            var delDom = this.el.querySelector('.see-icon-v5-form-close-circle-fill');
            ///this.el.querySelector('.see-icon-v5-form-close-circle-fill').addEventListener('click', this.clearDataHandler);

        },
        update: function (newValue) {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            var desc = this.el.getAttribute('desc');
            this.el.innerHTML = $.sui.htmlBuilder({value: newValue, desc: desc, model: model, fieldInfo: fieldInfo});
            $.sui.clearErrorTips(this.el);
        },
        unbind: function () {
            this.el.removeEventListener('tap', this.clickHandler);
        }
    })

})(cmp, Vue, document);
/**
 * Created by yangchao on 2016/8/2.
 */

(function ($, Vue, doc) {
    'use strict';

    Vue.directive('sui-handwrite', {
        params: ['scope'],
        twoWay: true,
        bind: function () {
            // 准备工作
            // 例如，添加事件处理器或只需要运行一次的高耗任务

            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            if (!model || !fieldInfo) return;
            var that = this;
            model.signature = model.signature || {};
            var sigFieldName = fieldInfo.name + '_' + s3scope.formMasterId;
            var fieldValue = (model.signature || {}).fieldValue || '';
            this.clickHandler = function (e) {

                //手机上才能调用签章
                if (!$.platform.CMPShell) {
                    return;
                }

                if ($.sui.getFieldAuth(model.auth) != 'edit') {
                    e.stopPropagation();
                    return;
                }

                var width = '500';
                var height = '400';
                if (s3scope.metadata.templateType == 'infopath') {
                    var target = that.el.querySelector('.sui-form-ctrl-value-display');
                    if (target) {
                        var style = window.getComputedStyle(target);
                        width = parseInt(style.width);
                        height = parseInt(style.height);
                    }
                }

                //调用签章组件
                var options = {
                    height: height,
                    width: width,
                    fieldValue: fieldValue,
                    fieldName: sigFieldName,
                    summaryID: s3scope.formMasterId,
                    signatureListUrl: $.serverIp + '/seeyon/rest/signet/signets/' + s3scope.affaireId,
                    signaturePicUrl: $.serverIp + '/seeyon/rest/signet/signetPic',
                    affairId: s3scope.affaireId,

                    success: function (data) {
                        if (data instanceof Array && data.length > 0 ) {
                            model.display = sigFieldName;
                            that.set(sigFieldName);
                            model.__state = 'modified';
                            model.signature = data[0];
                            that.update(sigFieldName);
                            //设置summaryId
                            //data.summaryID = s3scope.formMasterId;
                            //保存签章数据
                            var options = {
                                isNewImg: false,
                                affairId: s3scope.moduleId,
                                qianpiData: JSON.stringify(data) //后台接受的数据是一个字符串
                            };
                            s3scope.signatures[fieldInfo.name] = options;

                            //将签章数据保存在缓存中，切换到原样表单的时候需要使用
                            //var signatureKey = $.sui.getSignatureKey();
                            //var signatureData = {};
                            //try {
                            //    signatureData = JSON.parse($.storage.get(signatureKey, true)) || {};
                            //} catch (e) {
                            //    signatureData = {};
                            //}

                            //signatureData[sigFieldName] = model.signature;
                            //$.storage.save(signatureKey, JSON.stringify(signatureData), true);
                        }

                    },
                    error: function (err) {
                    }

                };
                $.handWriteSignature.show(options);

                e.stopPropagation();

            }.bind(this);

            this.el.addEventListener('tap', this.clickHandler);

            this.onLoadHandler = function (e) {
                //$.sui.onImgLoadHandler(e);
                e.target.style.maxWidth = '100%';
                //e.target.style.maxHeight = '100%';
            }.bind(this);
            //在捕获阶段，监听load事件
            this.el.addEventListener('load', this.onLoadHandler, true);
        },
        update: function (newValue, oldValue) {
            // 值更新时的工作
            // 也会以初始值为参数调用一次
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            var sigFieldName = fieldInfo.name + '_' + s3scope.formMasterId;
            var that = this;
            this.el.innerHTML = $.sui.htmlBuilder({value: newValue, desc: '', model: model, fieldInfo: fieldInfo});

            if ($.platform.CMPShell) {
                //如果没有解码后的picData，就调用签章解码
                if (model.signature && !model.signature.picData) {
					/*cmp.handWriteSignature && cmp.handWriteSignature.initSignatureData({
                        value: [model.signature],
                        success: function (decodeSignatures) {
                            console.log(decodeSignatures);

                            if (decodeSignatures instanceof Array && decodeSignatures.length > 0) {
                                var target = that.el.querySelector('img');
                                if (target && decodeSignatures[0].picData) {
                                    model.signature.picData = decodeSignatures[0].picData;
                                    target.src = 'data:image/png;base64,' + decodeSignatures[0].picData;
                                }
                            }
                        },
                        error: function (err) {

                        }
                    });*/
					
					//2018-12-28 由于后台修改策略，直接调用金格解码，创建了picData，在这里，就不用调用M3的方法了。 客户BUG 20181221073832, 20181220073668, 20181220073677,
					var target = that.el.querySelector('img');
					if (target) {
						target.src = 'data:image/png;base64,' + model.signature.picData;
					}
                }
            } else {
                var target = that.el.querySelector('.sui-form-ctrl-value-display');
                if (target) {
                    //如果本地化文件异步加载了，此时可能加载不到本地化信息，这么写只是临时策略，
                    //后续可改成如果取不到值，注入占位符，在本地化文件加载成功的回调里，替换占位符
                    target.innerHTML = $.i18n('form.weixin.canNotHandwrite') || '微协同环境不支持签章';
                }
            }

        },
        unbind: function () {
            this.el.removeEventListener('tap', this.clickHandler);
            this.el.removeEventListener('load', this.onLoadHandler);
        }
    })

})(cmp, Vue, document);
/**
 * Created by yangchao on 2016/5/30.
 */

(function ($, Vue, doc) {
    'use strict';

    Vue.directive('sui-input', {
        params: ['scope'],
        twoWay: true,
        bind: function () {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            var isMaster = this.params.scope.isMaster;
            var that = this;
            var ctrlId = '';

            this.vm.$nextTick(function(){
                ctrlId = $.sui.getFormCtrlIdByVueElement(that.el);
            });
            var keys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '.', 'Delete', 'Backspace'];
            //pc判断url
            var urlReg = /^(https|http|ftp|rtsp|mms)?:\/\/([0-9A-Za-z_-]+\.?)+(\/[0-9A-Za-z_-]+)*(\.[0-9a-zA-Z-_]*)?(:?[0-9]{1,4})?(\/[\u4E00-\u9FA50-9A-Za-z_-]+\.?[\u4E00-\u9FA50-9A-Za-z_-]+)*(\?([\u4E00-\u9FA50-9a-zA-Z-_]+=[\u4E00-\u9FA50-9a-zA-Z-_%]*(&|&amp;)?)*)?\/?$/;

            this.keydownHandler = function (e) {
                if (!e.ctrlKey && e.keyCode != 8 && e.keyWord != 46) {
                    e.target.setAttribute('notnull', 'true');
                }
            }.bind(this);

            this.changeHandler = function (e) {
                //if (e.target.attr)
                // 将数据写回 vm
                //获取当前value和input的值
                var target = e.target;
                var oldValue = model.value;
                var element = that.el.querySelector('.sui-form-ctrl-value');
                var newValue = (element || {}).value;
                if (newValue) {
                    e.target.setAttribute('notnull', 'false');
                }

                //如果是数字异常，则处理一下
                //if (fieldInfo.fieldType == 'DECIMAL' && e.target.validity.badInput) {
                //    newValue = element.getAttribute('value');
                //    element.value = newValue;
                //}

                if (oldValue != newValue) {
                    //更新model
                    that.set(newValue);
                    model.__state = 'modified';

                    //if (newValue && fieldInfo.fieldType == 'DECIMAL') {
                    //    element.setAttribute('value', newValue);
                    //}

                    //如果是textarea
                    //if (target.tagName == 'TEXTAREA' && s3scope.templateType == 'lightForm') {
                    if (target.tagName == 'TEXTAREA') {
                         $.sui.resize(target);
                    }
                    $.sui.clearErrorTips(that.el);
                    $.sui.preventSubmit = false;
                }

            }.bind(this);

            function refreshInput (element) {

                if (fieldInfo.inCalc || fieldInfo.inCondition) {
                    if (model.__state == 'modified') {
                        //doCalculate之前校验一下长度
                        var ret = $.sui.assertFieldLength(model, fieldInfo);

                        if (!ret.success) {
                            //提示超长
                            $.sui.preventSubmit = true;
                            var errorInfo = {type: 1, info:{}};
                            errorInfo.info[ctrlId] = ret.tips;
                            $.sui.showFormErrorTipsByErrorInfo(errorInfo);
                            $.sui.nextTick(function(){
                                $.sui.preventSubmit = false;
                            });

                            //$.notification.alert(ret.tips, function(){
                            //    $.sui.preventSubmit = false;
                            //}, '', $.i18n('form.btn.ok'));
                            if (fieldInfo.fieldType == 'DECIMAL') {
                                that.set('');
                            } else {
                                //这个字符串的截取耗性能
                                var str = $.sui.utf8SubStr(element.value, Number(fieldInfo.fieldLength));
                                that.set(str);
                            }
                            that.update();
                        }

                        //参与计算
                        var recordId = $.sui.getRecordIdByVueElement(that.el, fieldInfo);
                        var options = {
                            formMasterId: s3scope.formMasterId,
                            formId: s3scope.formId,
                            moduleId: s3scope.moduleId,
                            rightId: s3scope.rightId,
                            fieldName: fieldInfo.name,
                            recordId: recordId,
                            data: s3scope.data
                        };

                        $.sui.doCalculate(that.el, fieldInfo);

                    }
                }

                //处理必填时的背景色
                if (model.notNull) {
                    if (!model.value) {
                        that.el.children[0].classList.add('sui-form-ctrl-empty');
                    } else {
                        that.el.children[0].classList.remove('sui-form-ctrl-empty');
                    }
                }
            }

            this.focusoutHandler = function (e) {
                console.log('state:', model.__state);
                console.log('in focusoutHandler');
                var element = that.el.querySelector('.sui-form-ctrl-value');
                if (fieldInfo.fieldType == 'DECIMAL' && !element.value) {
                    element.value = '';
                    that.set('');
                    if (element.getAttribute('notnull') == 'true') {
                        $.sui.preventSubmit = true;

                        var errorInfo = {type: 1, info:{}};
                        errorInfo.info[ctrlId] = $.i18n('form.number.notValid');
                        $.sui.showFormErrorTipsByErrorInfo(errorInfo);
                        $.sui.nextTick(function(){
                            $.sui.preventSubmit = false;
                        });

                        //$.notification.alert($.i18n('form.number.notValid'), function(){
                        //    e.target.setAttribute('notnull', 'false');
                        //    $.sui.preventSubmit = false;
                        //}, '', $.i18n('form.btn.ok'));
                    }
                }

                //如果input是pageUrl类型，判断格式是否正确
                if (fieldInfo.formatType == 'urlPage') {
                    if (!!element.value  && !urlReg.test(element.value)){
                        $.sui.preventSubmit = true;

                        var errorInfo = {type: 1, info:{}};
                        errorInfo.info[ctrlId] = $.i18n('form.field.urlNotValid');
                        $.sui.showFormErrorTipsByErrorInfo(errorInfo);
                        $.sui.nextTick(function(){
                            $.sui.preventSubmit = false;
                        });

                        //$.notification.alert($.i18n('form.field.urlNotValid'), function(){
                        //    $.sui.preventSubmit = false;
                        //}, '', $.i18n('form.btn.ok'));
                        element.value = '';
                        that.set('');
                    }
                }

                refreshInput(element);

                //解决在iScroll内部使用scrollIntoView带来的坑
                if (s3scope.metadata.templateType == 'infopath') {
                    setTimeout(function(){
                        var dom = document.querySelector('.sui-form-wrapper');
                        if (dom) {
                            dom.scrollLeft = 0;
                            dom.scrollTop = 0;
                        }
                    },0);
                }

            }.bind(this);


            var input = that.el.querySelector('input');
            this.el.addEventListener('keydown',  this.keydownHandler);
            this.el.addEventListener('input', this.changeHandler);
            this.el.addEventListener('focusout', this.focusoutHandler);

            this.clickHandler = function (e) {
                var target = e.target;

                //软键盘弹起后，让input滚动到可视区域
                //2017-11-30 解决软键盘弹起后输入焦点问题
                if (target.classList.contains('sui-form-ctrl-value')) {
                  //留300毫米给软键盘弹起，然后定位
                  setTimeout(function(){
                    $.sui.scrollIntoViewIfNeeded(target);
                  }, 300);
                }

                if (e.target.classList.contains('sui-input-url')) {
                    if ($.platform.CMPShell) {
                        var url = e.target.getAttribute('src');
                        $.openWebView({url: url, useNativebanner: true});
                    }
                }
                else if (model && $.sui.getFieldAuth(model.auth) == 'add') {
                    //弹出层，然后添加需要add的值
                    //如果是追加属性
                    $.sui.nextTick(function(){
                        $.notification.prompt($.i18n('form.field.appendNotice'), function (index, addValue) {
                            if (index == 0) {
                                //if (addValue != '') {
                                //TODO 暂时获取不到当前用户，后续能获取当前用户后，拼接用户名
                                var line = model.value == '' ? '' : '\r\n';
                                var lastValue = model.value;
                                var userName = ' ';
                                if ($.member && $.member.name) {
                                    userName = $.member.name + ' ';
                                }
                                //如果有换行符，addValue中有\n, 这里将\n替换为 \r\n，适配ios下，ios下\r才有换行效果
                                addValue = addValue.replace(/\n/g, '\r\n');
                                var newValue = model.value + line + addValue + '\r\n\t[' + userName + new Date().format('yyyy-MM-dd hh:mm') + ']';
                                that.set(newValue);

                                var ret = $.sui.assertFieldLength(model, fieldInfo);

                                if (ret.success) {
                                    var input = that.el.querySelector('input');
                                    if (input)  {
                                        input.value = newValue;
                                        //if (newValue && fieldInfo.fieldType == 'DECIMAL') {
                                        //    input.setAttribute('value', newValue);
                                        //}
                                    }
                                        var textarea = that.el.querySelector('textarea');
                                    if (textarea) {
                                        textarea.value = newValue;
                                        that.update(newValue);
                                        $.sui.clearErrorTips(that.el);
                                    }
                                } else {
                                    that.set(lastValue);
                                    var errorInfo = {type: 1, info:{}};
                                    errorInfo.info[ctrlId] = ret.tips;
                                    $.sui.showFormErrorTipsByErrorInfo(errorInfo);
                                    //$.notification.alert(ret.tips, null, '', $.i18n('form.btn.ok'));
                                }

                                model.__state = 'modified';
                                var element = that.el.querySelector('.sui-form-ctrl-value');
                                refreshInput(element);
                                //如果是textarea
                                //if (target.tagName == 'TEXTAREA' && s3scope.templateType == 'lightForm') {
                                if (target.tagName == 'TEXTAREA') {
                                    $.sui.resize(target);
                                }
                            }
                        },[$.i18n('form.btn.ok'), $.i18n('form.btn.cancel')],"","",4);
                    });

                }

            }.bind(this);

            this.el.addEventListener('tap', this.clickHandler);

        },
        update: function (newValue) {
            // 值更新时的工作
            // 也会以初始值为参数调用一次
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            var desc = this.el.getAttribute('desc');
            this.el.innerHTML = $.sui.htmlBuilder({value: newValue, desc: desc, model: model, fieldInfo: fieldInfo});
            var textarea = this.el.querySelector('textarea');
            var that = this;
            //只有在轻表单模式才自动撑开
            //if (textarea && s3scope.templateType == 'lightForm') {
            if (textarea){

                that.vm.$nextTick(function(){
                    var target = that.el.querySelector('textarea');
                    $.sui.resize(target);
                    setTimeout(function(){
                        //有可能点击切换的时候，表单元素被释放了
                        if (that && that.el) {
                            var target = that.el.querySelector('textarea');
                            $.sui.resize(target);
                        }
                    }, 100);

                });
            }

            $.sui.clearErrorTips(that.el);

        },
        unbind: function () {
            this.el.removeEventListener('input', this.changeHandler);
            this.el.removeEventListener('keydown', this.keydownHandler);
            this.el.removeEventListener('focusout', this.focusoutHandler);
            this.el.removeEventListener('tap', this.clickHandler);

        }
    });

})(cmp, Vue, document);

/**
 * Created by yangchao on 2016/7/18.
 */

(function ($, Vue, doc) {
    'use strict';

    Vue.directive('sui-radio', {
        params: ['scope'],
        twoWay: true,
        bind: function () {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            if (!model || !fieldInfo) return;
            var that = this;

            this.changeHandler = function (e) {
                var oldValue = model.value;
                var radioCtrl = that.el.querySelector('input');
                var newValue = e.target.value;

                if (oldValue != newValue) {
                    //更新model
                    radioCtrl.value = newValue;
                    that.set(newValue);
                    model.__state = 'modified';
                    $.sui.clearErrorTips(that.el);
                    //清除必填的背景色
                    that.el.children[0].classList.remove('sui-form-ctrl-empty');

                    $.sui.doCalculate(that.el, fieldInfo);
                }

            }.bind(this);

            this.el.addEventListener('change', this.changeHandler);

        },
        update: function (newValue) {
            // 值更新时的工作
            // 也会以初始值为参数调用一次
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            var that = this;
            this.setOptions(model.items);
            var desc = this.el.getAttribute('desc');
            this.el.innerHTML = $.sui.htmlBuilder({value: newValue, desc: desc, model: model, fieldInfo: fieldInfo});
            var radioGroup = that.el.querySelector('#radiogroup_' + fieldInfo.name);
            if (radioGroup) {
                var radio = radioGroup.querySelector('[value="' + newValue + '"]');
                if (radio) radio.checked = true;
            }

        },
        setOptions: function(items) {
            if (items && items.length > 0 && items[0].text == undefined) {
                items.forEach(function(item){
                    item.text = item.display || item.text;
                });
            }

        },
        unbind: function () {
            this.el.removeEventListener('change', this.changeHandler);

        }
    })

})(cmp, Vue, document);


/**
 * Created by yangchao on 2016/6/1.
 */

(function ($, Vue, doc) {
    'use strict';

    Vue.directive('sui-select', {
        params: ['scope'],
        twoWay: true,
        bind: function () {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            if (!model || !fieldInfo) return;
            var that = this;

            this.clickHandler = function (e) {
                if ($.sui.getFieldAuth(model.auth) != 'edit') {
                    return;
                }

                var _picker = new $.PopPicker();
                this.setOptions(model);
                _picker.setData(model.items);
                _picker.defaultValue = model.value;
                _picker.setPickerDefalutValue();
                _picker.show(function(items) {
                    var curOption = items[0];
                    var oldValue = model.value;
                    var newValue = curOption.value || '';
                    if (oldValue != newValue) {
                        //更新model
                        model.display = curOption.text || '';
                        that.set(newValue);
                        model.__state = 'modified';
                        that.update(newValue);

                        //下拉框字段改变后，调用后台接口   dealMultiEnumRelation
                        var recordId = $.sui.getRecordIdByVueElement(that.el, fieldInfo);

                        var options = {
                            formMasterId: s3scope.formMasterId,
                            formId: s3scope.formId,
                            moduleId: s3scope.moduleId,
                            rightId: s3scope.rightId,
                            fieldName: fieldInfo.name,
                            recordId: recordId,
                            currentEnumItemValue: newValue,
                            data: $.sui.reduceSubmitData(s3scope.data),
                            attachmentInputs: $.sui.getAttachments(s3scope.attachmentInputs)
                        };

                        if (model.event == 'refresh') {
                            $.sui.dataService.capForm.dealMultiEnumRelation(options, function(err, data){
                                if (err) {
                                    $.notification.alert(err.message || 'Error when calling dealMultiEnumRelation!', null, '', $.i18n('form.btn.ok'));
                                    return;
                                }

                                $.sui.refreshFormData(null, !data.results ? data : data.results);
                            });
                        } else if (model.event == 'calc') {
                            $.sui.doCalculate(that.el, fieldInfo);
                        }

                    }

                    _picker.dispose();
                    _picker = null;
                }, function () {
                    _picker.dispose();
                    _picker = null;
                });

            }.bind(this);

            this.el.addEventListener('tap', this.clickHandler);

        },
        update: function (newValue) {
            // 值更新时的工作
            // 也会以初始值为参数调用一次
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            this.setOptions(model);
            var desc = this.el.getAttribute('desc');
            this.el.innerHTML = $.sui.htmlBuilder({value: newValue, desc: desc, model: model, fieldInfo: fieldInfo});
            $.sui.clearErrorTips(this.el);
        },
        setOptions: function(model) {
            var str = $.i18n('form.select.notice') || '--请选择--';
            var items = model.items;
            if (items && items.length > 0 && items[0].text == undefined) {
                items.forEach(function(item){
                    item.text = item.display || item.text;
                });

                if (items[0].display == '' || items[0].value == '0') {
                    if (model.auth == 'edit') {
                        items[0].text = str;
                    } else {
                        items[0].text = ''
                    }

                    items[0].value = '';
                }
            }
        },
        unbind: function () {
            this.el.removeEventListener('tap', this.clickHandler);
        }
    })

})(cmp, Vue, document);

/**
 * Created by yangchao on 2016/8/1.
 */

(function ($, Vue, doc) {
    'use strict';

    Vue.directive('sui-static', {
        params: ['scope'],
        twoWay: true,
        bind: function () {
            // 准备工作
            // 例如，添加事件处理器或只需要运行一次的高耗任务

            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            if (!model || !fieldInfo) return;

            this.onLoadHandler = function (e) {
                if (s3scope.metadata.templateType == 'infopath') {
                    $.sui.refreshIScrollAsync();
                }
            }.bind(this);
            //在捕获阶段，监听load事件
            this.el.addEventListener('load', this.onLoadHandler, true);

        },
        update: function (newValue, oldValue) {
            // 值更新时的工作
            // 也会以初始值为参数调用一次
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;

            this.el.innerHTML = $.sui.htmlBuilder({value: newValue, desc: '', model: model, fieldInfo: fieldInfo});

            //如果流程处理意见等html内容中含有img图片，则特殊处理一下
            var images = this.el.querySelectorAll('img');
            var len = images.length;
            for (var i=0; i<len; i++) {
                var target = images[i];
                if (typeof target.src == 'string' && !target.src.startsWith('http')) {
                    var src = target.src;
                    if (src.startsWith('file://')) {
                        src = src.replace('file://', '');
                    }
                    target.src = $.serverIp + src;
                }
            }

        },
        unbind: function () {
            this.el.removeEventListener('load', this.onLoadHandler);
        }
    })

})(cmp, Vue, document);
/**
 * Created by yangchao on 2016/5/27.
 */

(function ($, Vue, doc) {
    'use strict';

    var sui_textarea = Vue.extend({
        props: ['scope'],
        template:   '<div class="mui-input-row">' +
        '<label>{{scope.fieldInfo.display}}</label>' +
        '<textarea type="text" v-model="scope.model.value"></textarea>' +
        '</div>'

    });

    Vue.component('sui-textarea', sui_textarea);
})(cmp, Vue, document);


/**
 * Created by yangchao on 2016/5/31.
 */

(function ($, Vue, doc) {
    'use strict';

    Vue.directive('sui-organization', {
        params: ['scope'],
        twoWay: true,
        bind: function () {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            if (!model || !fieldInfo) return;

            var that = this;
            this.clickHandler = function (e) {
                // 将数据写回 vm
                //获取当前value和input的值

                if ($.sui.getFieldAuth(model.auth) != 'edit') {
                    return;
                }

                var action = e.target.getAttribute('action');
                //如果是点击的清除数据，则停止冒泡
                if (action == 'clear-value') {
                    that.set('');
                    model.display = '';
                    model.__state = 'modified';
                    this.update('');
                    e.stopPropagation();

                    var recordId = $.sui.getRecordIdByVueElement(this.el, fieldInfo);

                    $.sui.dataService.capForm.dealOrgFieldRelation({
                        formDataId: s3scope.formMasterId,
                        formId: s3scope.formId,
                        moduleId: s3scope.moduleId,
                        rightId: s3scope.rightId,
                        fieldName: fieldInfo.name,
                        recordId: recordId,
                        selectType: fieldInfo.finalInputType,
                        orgId: model.value,
                        data: $.sui.reduceSubmitData(s3scope.data),
                        attachmentInputs: $.sui.getAttachments(s3scope.attachmentInputs)
                    }, function(err, data){
                        if (err) {
                            $.notification.alert(err.message || 'Error when calling dealOrgFieldRelation!', null, '', $.i18n('form.btn.ok'));
                            return;
                        }

                        $.sui.refreshFormData(null, !data.results ? data : data.results);
                    });

                    return;
                } else {

                    var opts = {command:1,value:{
                        "selectType":"Member",
                        "isMulti":true,
                        "value": model.value}};

                    //计算最大值
                    var maxSize = 1;
                    if (fieldInfo.finalInputType.indexOf('multi') == 0) {
                        maxSize = Math.floor(fieldInfo.fieldLength / 21);
                        maxSize = maxSize || 1;
                    }

                    if (fieldInfo.fieldType.toLowerCase()  == 'longtext') {
                        //如果是longtext不需要限制个数
                        maxSize = 9999999999;
                    }

                    //控件id
                    var ctrlId = $.sui.getFormCtrlIdByVueElement(this.el);
                    var recordIndex = $.sui.getRecordIndexByVueElement(this.el, fieldInfo);
                    var recordId = $.sui.getRecordIdByVueElement(this.el, fieldInfo);
                    $.sui.lastPosCtrlId = ctrlId;
                    var metadata = $.extend({recordIndex: recordIndex, ctrlId: ctrlId, recordId: recordId}, fieldInfo);

                    console.log(fieldInfo.finalInputType);
                    console.log(metadata);

                    var fillBackData = [];

                    //is是英文逗号隔开，display是中文顿号隔开，坑
                    model.display = model.display.replace(/,/g, '、');
                    var ids = model.value.split(',');
                    var names = model.display.split('、');

                    var selectType = fieldInfo.finalInputType.replace('multi', '');
                    var len = ids.length;
                    for (var i = 0; i < len; i++) {
                        if (ids[i]) {
                            fillBackData.push({id: ids[i], name: names[i], type: selectType});
                        }
                    }
                    
                    var vj = false;
                    var tempLabel = ["dept","org","post","team","extP"];
                    var orgSelectType = selectType;
                    if (fieldInfo.externalType != "0") {//V-Join外部组织控件
                        vj = true;
                        
                        if (selectType == "department") {
                            if (fieldInfo.externalType == "1") {//V-Join外部机构
                                orgSelectType = "department_vj1";
                            } else {//V-Join外部单位
                                orgSelectType = "department_vj2";
                            } 
                        }
                    } else {
                        if (selectType == "member") {//内部人员控件可以选择V-Join人员
                            tempLabel = ["dept","org","post","team","extP","vjOrg"];
                        }
                    }

                    $.selectOrgJump("select-jump",{
                        type:2,             //选人组件的类型1、流程选人；2、轻表单选人
                        fillBackData:fillBackData,    //第一次调用时的回填值
                        maxSize:maxSize,    //只要不等于1，都认为是多选
                        minSize:-1,
                        debug: $.sui.dataService.debug,
                        _proxyServer: $.sui.dataService.proxyServer,
                        _targetServer: $.sui.dataService.targetServer,
                        _sessionId: $.sui.dataService.sessionId,
                        label : tempLabel,
                        selectType: orgSelectType,//选人类型：1、'member':选人；2、'department':选部门；3、'account':选单位；4、'post':选岗位；5、'level':选职务级别
                        vj: vj,
                        pageKey: $.sui.getTempKey(),
                        metadata: metadata
                    });
                }

            }.bind(this);


            this.el.addEventListener('tap', this.clickHandler);

        },
        update: function (newValue, oldValue) {
            // 值更新时的工作
            // 也会以初始值为参数调用一次
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            this.el.innerHTML = $.sui.htmlBuilder({value: newValue, desc: '', model: model, fieldInfo: fieldInfo});
            $.sui.clearErrorTips(this.el);
        },
        unbind: function () {
            this.el.removeEventListener('tap', this.clickHandler);

        }
    })

})(cmp, Vue, document);

/**
 * Created by yangchao on 2016/8/16.
 */

(function ($, Vue, doc) {
    'use strict';

    Vue.directive('sui-attachment', {
        params: ['scope'],
        twoWay: true,
        bind: function () {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            if (!model || !fieldInfo) return;
            var that = this;
            model.attData = model.attData || [];

            if (model.attData.length > 0) {
                //todo 暂时先在前端这么处理，6.1后台修改，此逻辑必须干掉 12.9
                model.__state = 'modified';
            }

            //将attData装填进attachmentInputs
            this.vm.$nextTick(function(){
                var ctrlId = $.sui.getFormCtrlIdByVueElement(that.el);
                s3scope.attachmentInputs[ctrlId] = model.attData;
            });

            this.clickHandler = function (e) {
                if ($.sui.getFieldAuth(model.auth) != 'edit') {
                    return;
                }
                if (e.target.classList.contains('see-icon-v5-form-close-circle-fill')) {

                    var msg = $.i18n('form.attachment.deleteConfirm');
                    $.notification.confirm(msg, function(index){
                        if (index == 1) {
                            var arr = e.target.parent('.attachment-items').children.toArray();
                            var attachment = e.target.parent('.attachment-item');
                            var num = arr.indexOf(attachment);

                            if (num != -1) {
                                model.attData.splice(num, 1);
                                model.__state = 'modified';
                                model.editAttr = true;
                                that.update(model.value);
                            }
                        }
                    }, '', [$.i18n('form.btn.cancel'), $.i18n('form.btn.ok')]);

                } else if (e.target.closest('.attachment-add-item')) {
                    // if (!$.platform.CMPShell) {
                    //     $.notification.alert($.i18n('form.weixin.canNotAttachment'), null, '', $.i18n('form.btn.ok'));
                    //     return;
                    // }
                    //2017-9-14 去除微协同的附件功能的限制

                    var items = [
                        {
                            key: "1",
                            name: $.i18n('form.btn.photo')
                        },
                        {
                            key: "2",
                            name: $.i18n('form.btn.voice')
                        },
                        {
                            key: "3",
                            name: $.i18n('form.btn.localFile')
                        },
                        {
                            key: "4",
                            name: $.i18n('form.btn.localImage')
                        }

                    ];
					
					
					//2017-9-26 OA-131734  ZM930版本，在微协同屏蔽语音项
					if (!$.platform.CMPShell) {
						items.splice(1,1);
					}

                    cmp.dialog.actionSheet(items, $.i18n('form.btn.cancel'), function (item) {

                        var type = '';
                        if (item.key == '1') {
                            type = 'photo';
                        }
                        else if(item.key == '2') {
                            type = 'voice';
                        } else if(item.key == '3') {
                            type = 'localFile';
                        } else if(item.key == '4'){
                            type = 'picture';
                        }

                        if (type) {
                            cmp.dialog.loading();
                            $.att.suite({
                                type: type,
                                maxFileSize: 50*1024*1024, //OA-127072
                                success:function(result){
                                    cmp.dialog.loading(false);
                                    var subReference = model.value;
                                    var reference = s3scope.moduleId;
                                    (result.att || []).forEach(function(item){
                                        item.subReference = subReference;

                                        //item.createdate = (new Date(Number(item.createdate)) || new Date()).format('yyyy-MM-dd');
                                        item.createdate = item.createdate || new Date().getTime().toString();
                                        model.attData.push(item);
                                    });
                                    that.update(model.value);
                                    model.__state = 'modified';
                                    model.editAttr = true;
                                    console.log(result);
                                },
                                cancel: function () {
                                    cmp.dialog.loading(false);
                                },
                                error:function(err){
                                    cmp.dialog.loading(false);
                                    $.notification.alert(err.message || err.msg || '上传附件失败!', null, '', $.i18n('form.btn.ok'));
                                }
                            });
                        }

                    }, function () {

                    });

                } else if (e.target.closest('.attachment-item')) {
                    //弹出显示附件的层

                }
            }.bind(this);

            this.el.addEventListener('tap', this.clickHandler);

        },
        update: function (newValue, oldValue) {
            // 值更新时的工作
            // 也会以初始值为参数调用一次
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            model.attData = model.attData || [];
            this.el.innerHTML = $.sui.htmlBuilder({value: newValue, desc: '', model: model, fieldInfo: fieldInfo});
            $.sui.clearErrorTips(this.el);

        },
        unbind: function () {
            this.el.removeEventListener('tap', this.clickHandler);
        }
    })

})(cmp, Vue, document);
/**
 * Created by yangchao on 2016/9/5.
 */

(function ($, Vue, doc) {
    'use strict';

    Vue.directive('sui-linenumber', {
        params: ['scope'],
        twoWay: true,
        bind: function () {

            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            if (!model || !fieldInfo) return;

        },
        update: function (newValue, oldValue) {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            this.el.innerHTML = $.sui.htmlBuilder({value: newValue, desc: '', model: model, fieldInfo: fieldInfo});
        },
        unbind: function () {

        }
    });

    Vue.directive('sui-customcontrol', {
        params: ['scope'],
        twoWay: true,
        bind: function () {

            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            if (!model || !fieldInfo) return;

        },
        update: function (newValue, oldValue) {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            var isMaster = this.params.scope.isMaster;
            this.el.innerHTML = $.sui.htmlBuilder({value: newValue, desc: '', model: model, fieldInfo: fieldInfo});
            var that = this;
            //每次更新value后，触发通知自定义控件进行渲染的事件

            this.vm.$nextTick(function(){
                var ctrlId = $.sui.getFormCtrlIdByVueElement(that.el);
                var recordId = -1;
                var arr = String(ctrlId).split('|');
                if (arr.length == 3) {
                    recordId = arr[1];
                }
                SuiEvent.trigger({target: document, eventName: 'sui_form_customcontrol_render', data: {
                    model : model,
                    fieldInfo: fieldInfo,
                    handler: that,
                    isMaster: isMaster,
                    tableName: model.ownerTableName,
                    recordId: recordId,
                    target: that.el.querySelector('.sui-form-ctrl-field-main')
                }}, function(err, result){});
            });

        },
        unbind: function () {

        }
    });

})(cmp, Vue, document);

/**
 * Created by yangchao on 2016/8/19.
 */

(function ($, Vue, doc) {
    'use strict';

    Vue.directive('sui-document', {
        params: ['scope'],
        twoWay: true,
        bind: function () {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            if (!model || !fieldInfo) return;
            var that = this;
            model.attData = model.attData || [];

            if (model.attData.length > 0) {
                //todo 暂时先在前端这么处理，6.1后台修改，此逻辑必须干掉 12.9
                model.__state = 'modified';
            }
            //将attData装填进attachmentInputs
            this.vm.$nextTick(function(){
                var ctrlId = $.sui.getFormCtrlIdByVueElement(that.el);
                s3scope.attachmentInputs[ctrlId] = model.attData;
            });

            this.clickHandler = function (e) {
                if ($.sui.getFieldAuth(model.auth) != 'edit') {
                    return;
                }

                if (e.target.classList.contains('see-icon-v5-form-close-circle-fill')) {

                    var msg = $.i18n('form.document.deleteConfirm');
                    $.notification.confirm(msg, function(index){
                        if (index == 1) {
                            var arr = e.target.parent('.document-items').children.toArray();
                            var document = e.target.parent('.document-item');
                            var num = arr.indexOf(document);

                            if (num != -1) {
                                model.attData.splice(num, 1);
                                model.__state = 'modified';
                                model.editAttr = true;
                                that.update(model.value);
                            }
                        }
                    }, '', [$.i18n('form.btn.cancel'), $.i18n('form.btn.ok')]);


                } else if (e.target.closest('.document-add-item')) {

                    $.accDoc("form-document",{
                        fillbackData: model.attData,
                        callback:function(data){
                            if (typeof data == 'string') {
                                data = JSON.parse(data);
                            }

                            console.log(data);
                            var subReference = model.value;
                            model.attData.splice(0);
                            $.sui.attachmentDataConverter(model.attData, data, subReference, true);
                            that.update(model.value);
                            model.__state = 'modified';
                            model.editAttr = true;

                        }
                    });



                } else if (e.target.closest('.document-item')) {
                    //弹出显示附件的层

                }
            }.bind(this);

            this.el.addEventListener('tap', this.clickHandler);

        },
        update: function (newValue, oldValue) {
            // 值更新时的工作
            // 也会以初始值为参数调用一次
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            model.attData = model.attData || [];
            this.el.innerHTML = $.sui.htmlBuilder({value: newValue, desc: '', model: model, fieldInfo: fieldInfo});
            $.sui.clearErrorTips(this.el);
        },
        unbind: function () {
            this.el.removeEventListener('tap', this.clickHandler);
        }
    })

})(cmp, Vue, document);
/**
 * Created by yangchao on 2016/8/24.
 */

(function ($, Vue, doc) {
    'use strict';

    Vue.directive('sui-exchangetask', {
        params: ['scope'],
        twoWay: true,
        bind: function () {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            if (!model || !fieldInfo) return;
            var that = this;

            this.clickHandler = function (e) {

                if ($.sui.getFieldAuth(model.auth) != 'edit') {
                    return;
                }

                var ctrlId = $.sui.getFormCtrlIdByVueElement(that.el);
                var recordIndex = $.sui.getRecordIndexByVueElement(that.el, fieldInfo);
                var pageKey = $.sui.getTempKey();
                var recordId = $.sui.getRecordIdByVueElement(that.el, fieldInfo);
                $.sui.lastPosCtrlId = ctrlId;
                var metadata = $.extend({recordIndex: recordIndex, ctrlId: ctrlId, recordId: recordId}, fieldInfo);
                var options = {
                    formId: s3scope.formId,
                    contentDataId: s3scope.formMasterId,
                    fieldName: fieldInfo.name,
                    recordId: recordId,
                    allowCheck: true
                };

                //调用dee控件前，执行一次合并数据
                $.sui.dataService.capForm.mergeFormData({
                    formDataId: s3scope.formMasterId,
                    formId: s3scope.formId,
                    moduleId: s3scope.moduleId,
                    rightId: s3scope.rightId,
                    data: $.sui.reduceSubmitData(s3scope.data),
                    attachmentInputs: $.sui.getAttachments(s3scope.attachmentInputs)
                }, function(err, data){
                    $.deeDataList(pageKey, metadata, options);
                });


            }.bind(this);

            this.el.addEventListener('tap', this.clickHandler);
        },
        update: function (newValue, oldValue) {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            this.el.innerHTML = $.sui.htmlBuilder({value: newValue, desc: '', model: model, fieldInfo: fieldInfo});
        },
        unbind: function () {
            this.el.removeEventListener('tap', this.clickHandler);
        }
    })

})(cmp, Vue, document);
/**
 * Created by yangchao on 2016/9/2.
 */

(function ($, Vue, doc) {
    'use strict';

    Vue.directive('sui-externalwrite-ahead', {
        params: ['scope'],
        twoWay: true,
        bind: function () {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            if (!model || !fieldInfo) return;

        },
        update: function (newValue, oldValue) {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;

            this.el.innerHTML = $.sui.htmlBuilder({value: newValue, desc: '', model: model, fieldInfo: fieldInfo});

        },
        unbind: function () {

        }
    })

})(cmp, Vue, document);
/**
 * Created by yangchao on 2016/8/5.
 */

(function ($, Vue, doc) {
    'use strict';

    Vue.directive('sui-image', {
        params: ['scope'],
        twoWay: true,
        bind: function () {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            if (!model || !fieldInfo) return;
            var that = this;
            model.attData = model.attData || [];

            if (model.attData.length > 0) {
                //todo 暂时先在前端这么处理，6.1后台修改，此逻辑必须干掉 12.9
                model.__state = 'modified';
            }

            //将attData装填进attachmentInputs
            this.vm.$nextTick(function(){
                var ctrlId = $.sui.getFormCtrlIdByVueElement(that.el);
                s3scope.attachmentInputs[ctrlId] = model.attData;
            });
            var targetServer = $.sui.dataService.debug ? $.sui.dataService.targetServer : $.serverIp;

            this.clickHandler = function (e) {
                if ($.sui.getFieldAuth(model.auth) != 'edit') {
                    return;
                }

                if (e.target.tagName == 'IMG') {
                    //统一由外层协同处理图片点击事件

                } else if (e.target.classList.contains('see-icon-v5-form-close-circle') || e.target.classList.contains('see-icon-v5-form-close-circle-fill')) {
                    //删除操作
                    //!!目前图片只支持上传单个图片，所有删除的时候，直接将attData清空，后续有需求，再改造支持多图片关闭

                    var msg = $.i18n('form.image.deleteConfirm');
                    $.notification.confirm(msg, function(index){
                        if (index == 1) {
                            model.attData.splice(0);
                            model.__state = 'modified';
                            model.editAttr = true;
                            that.update(model.value);
                        }
                    }, '', [$.i18n('form.btn.cancel'), $.i18n('form.btn.ok')]);



                } else if (e.target.parent('.image-add-item')) {
                    // if (!$.platform.CMPShell) {
                    //     $.notification.alert($.i18n('form.weixin.canNotAttachment'), null, '', $.i18n('form.btn.ok'));
                    //     return;
                    // }
                    //2017-9-14 去除微协同的附件功能的限制

                    if (model.attData.length > 0) {
                        var msg = $.i18n('form.image.updateConfirm');
                        $.notification.confirm(msg, function(index){
                            if (index == 1) {
                                _uploadImg(model, fieldInfo);

                            }
                        }, '', [$.i18n('form.btn.cancel'), $.i18n('form.btn.ok')]);
                    } else {
                        _uploadImg(model, fieldInfo);
                    }


                }
            }.bind(this);

            this.el.addEventListener('tap', this.clickHandler);

            function _uploadImg (model, fieldInfo) {

                var items = [
                    {
                        key: "1",
                        name: $.i18n('form.btn.photo')
                    },
                    {
                        key: "2",
                        name: $.i18n('form.btn.localImage')
                    }

                ];
                cmp.dialog.actionSheet(items, $.i18n('form.btn.cancel'), function (item) {

                    var type = '';
                    if (item.key == '1') {
                        type = 'photo';
                    } else if(item.key == '2'){
                        type = 'picture';
                    }

                    if (type) {
                        cmp.dialog.loading();
                        cmp.att.suite({
                            type: type,
                            pictureNum: 1,
                            maxFileSize: 10*1024*1024, //OA-127130
                            success:function(result){
                                cmp.dialog.loading(false);
                                //选图片只允许选一个，要替换之前的图片
                                model.attData.splice(0);
                                var subReference = model.value;
                                var reference = s3scope.moduleId;

                                (result.att || []).forEach(function(item){
                                    item.subReference = subReference;
                                    item.reference = reference;
                                    //item.createdate = (new Date(Number(item.createdate)) || new Date()).format('yyyy-MM-dd');
                                    item.createdate = item.createdate || new Date().getTime().toString();
                                    model.attData.push(item);
                                });
                                that.update(model.value);
                                model.__state = 'modified';
                                model.editAttr = true;
                                console.log(result);
                            },
                            cancel: function () {
                                cmp.dialog.loading(false);
                            },
                            error:function(err){
                                cmp.dialog.loading(false);
                                $.notification.alert(err.message || err.msg || '上传图片失败!', null, '', $.i18n('form.btn.ok'));
                            }
                        });

                    }

                }, function () {

                });

            }

            this.onLoadHandler = function (e) {
                $.sui.onImgLoadHandler(e);
            }.bind(this);
            //在捕获阶段，监听load事件
            this.el.addEventListener('load', this.onLoadHandler, true);

        },
        update: function (newValue, oldValue) {
            // 值更新时的工作
            // 也会以初始值为参数调用一次
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            model.attData = model.attData || [];
            this.el.innerHTML = $.sui.htmlBuilder({value: newValue, desc: '', model: model, fieldInfo: fieldInfo});
            $.sui.clearErrorTips(this.el);
        },
        unbind: function () {
            this.el.removeEventListener('load', this.onLoadHandler);
            this.el.removeEventListener('tap', this.clickHandler);
        }
    })

})(cmp, Vue, document);
/**
 * Created by yangchao on 2016/9/2.
 */

(function ($, Vue, doc) {
    'use strict';

    Vue.directive('sui-outwrite', {
        params: ['scope'],
        twoWay: true,
        bind: function () {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            if (!model || !fieldInfo) return;
        },
        update: function (newValue, oldValue) {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            this.el.innerHTML = $.sui.htmlBuilder({value: newValue, desc: '', model: model, fieldInfo: fieldInfo});
        },
        unbind: function () {
        }
    })

})(cmp, Vue, document);
/**
 * Created by yangchao on 2016/8/24.
 */

(function ($, Vue, doc) {
    'use strict';

    Vue.directive('sui-querytask', {
        params: ['scope'],
        twoWay: true,
        bind: function () {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            if (!model || !fieldInfo) return;
            var that = this;

            this.clickHandler = function (e) {

                if ($.sui.getFieldAuth(model.auth) != 'edit') {
                    return;
                }

                var ctrlId = $.sui.getFormCtrlIdByVueElement(that.el);
                var recordIndex = $.sui.getRecordIndexByVueElement(that.el, fieldInfo);
                var pageKey = $.sui.getTempKey();
                var recordId = $.sui.getRecordIdByVueElement(that.el, fieldInfo);
                $.sui.lastPosCtrlId = ctrlId;
                var metadata = $.extend({recordIndex: recordIndex, ctrlId: ctrlId, recordId: recordId}, fieldInfo);
                var options = {
                    formId: s3scope.formId,
                    contentDataId: s3scope.formMasterId,
                    fieldName: fieldInfo.name,
                    recordId: recordId,
                    allowCheck: false
                };

                //调用dee控件前，执行一次合并数据
                $.sui.dataService.capForm.mergeFormData({
                    formDataId: s3scope.formMasterId,
                    formId: s3scope.formId,
                    moduleId: s3scope.moduleId,
                    rightId: s3scope.rightId,
                    data: $.sui.reduceSubmitData(s3scope.data),
                    attachmentInputs: $.sui.getAttachments(s3scope.attachmentInputs)
                }, function(err, data){
                    $.deeDataList(pageKey, metadata, options);
                });

            }.bind(this);

            this.el.addEventListener('tap', this.clickHandler);

        },
        update: function (newValue, oldValue) {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            this.el.innerHTML = $.sui.htmlBuilder({value: newValue, desc: '', model: model, fieldInfo: fieldInfo});
        },
        unbind: function () {
            this.el.removeEventListener('tap', this.clickHandler);
        }
    })

})(cmp, Vue, document);
/**
 * Created by yangchao on 2016/8/15.
 */

(function ($, Vue, doc) {
    'use strict';

    Vue.directive('sui-maplocate', {
        params: ['scope'],
        twoWay: true,
        bind: function () {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            if (!model || !fieldInfo) return;
            var that = this;
            //model.attData = model.attData || [];
            //将attData装填进attachmentInputs
            //s3scope.attachmentInputs[fieldInfo.name] = model.attData;

            var locked = false;
            var timer = null;

            this.clickHandler = function (e) {
                if (locked) {
                    if (timer) {
                        clearTimeout(timer);
                    }
                    timer = setTimeout(function(){
                        locked = false;
                    }, 5000);
                    return;
                }
                locked = true;
                $.sui.maplocate_clickHandler(e, that, model, fieldInfo, function(){
                    locked = false;
                });


            }.bind(this);

            this.el.addEventListener('tap', this.clickHandler);

        },
        update: function (newValue, oldValue) {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            //model.attData = model.attData || [];
            this.el.innerHTML = $.sui.htmlBuilder({value: newValue, desc: '', model: model, fieldInfo: fieldInfo});
            $.sui.clearErrorTips(this.el);
        },
        unbind: function () {
            this.el.removeEventListener('tap', this.clickHandler);

        }
    })

})(cmp, Vue, document);
/**
 * Created by yangchao on 2016/8/15.
 */

(function ($, Vue, doc) {
    'use strict';

    Vue.directive('sui-mapmarked', {
        params: ['scope'],
        twoWay: true,
        bind: function () {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            if (!model || !fieldInfo) return;
            var that = this;
            //model.attData = model.attData || [];
            //将attData装填进attachmentInputs
            //s3scope.attachmentInputs[fieldInfo.name] = model.attData;

            this.clickHandler = function (e) {
                $.sui.mapmarked_clickHandler(e, that, model, fieldInfo);
            }.bind(this);

            this.el.addEventListener('tap', this.clickHandler);

        },
        update: function (newValue, oldValue) {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            //model.attData = model.attData || [];
            this.el.innerHTML = $.sui.htmlBuilder({value: newValue, desc: '', model: model, fieldInfo: fieldInfo});
            $.sui.clearErrorTips(this.el);
        },
        unbind: function () {
            this.el.removeEventListener('tap', this.clickHandler);

        }
    })

})(cmp, Vue, document);
/**
 * Created by yangchao on 2016/8/15.
 */

(function ($, Vue, doc) {
    'use strict';

    Vue.directive('sui-mapphoto', {
        params: ['scope'],
        twoWay: true,
        bind: function () {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            if (!model || !fieldInfo) return;
            var that = this;
            model.attData = model.attData || [];

            if (model.attData.length > 0) {
                //todo 暂时先在前端这么处理，6.1后台修改，此逻辑必须干掉 12.9
                model.__state = 'modified';
            }

            //将attData装填进attachmentInputs
            this.vm.$nextTick(function(){
                var ctrlId = $.sui.getFormCtrlIdByVueElement(that.el);
                s3scope.attachmentInputs[ctrlId] = model.attData;
            });

            this.clickHandler = function (e) {
                $.sui.mapphoto_clickHandler(e, that, model, fieldInfo);
            }.bind(this);

            this.el.addEventListener('tap', this.clickHandler);

            this.onLoadHandler = function (e) {
                $.sui.onImgLoadHandler(e);
            }.bind(this);
            //在捕获阶段，监听load事件
            this.el.addEventListener('load', this.onLoadHandler, true);
        },
        update: function (newValue, oldValue) {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            model.attData = model.attData || [];
            this.el.innerHTML = $.sui.htmlBuilder({value: newValue, desc: '', model: model, fieldInfo: fieldInfo});
            $.sui.clearErrorTips(this.el);

        },
        unbind: function () {
            this.el.removeEventListener('tap', this.clickHandler);
            this.el.removeEventListener('load', this.onLoadHandler);

        }
    })

})(cmp, Vue, document);
/**
 * Created by yangchao on 2016/8/18.
 */

(function ($, Vue, doc) {
    'use strict';

    Vue.directive('sui-project', {
        params: ['scope'],
        twoWay: true,
        bind: function () {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            if (!model || !fieldInfo) return;
            var that = this;

            function _eventSelected (selectedId,selectedName) {
                //selectedId 对应value
                //selectedName 对应display

                model.display = selectedName;
                that.set(selectedId);
                model.__state = 'modified';
                that.update(selectedId);

                //发送请求到后台，执行数据更新 dealProjectFieldRelation
                var recordId = $.sui.getRecordIdByVueElement(that.el, fieldInfo);

                var options = {
                    formDataId: s3scope.formMasterId,
                    formId: s3scope.formId,
                    moduleId: s3scope.moduleId,
                    rightId: s3scope.rightId,
                    fieldName: fieldInfo.name,
                    recordId: recordId,
                    projectId: selectedId,
                    data: $.sui.reduceSubmitData(s3scope.data),
                    attachmentInputs: $.sui.getAttachments(s3scope.attachmentInputs)
                };
                $.sui.dataService.capForm.dealProjectFieldRelation(options, function(err, data){
                    if (err) {
                        $.notification.alert(err.message || 'Error when calling dealProjectFieldRelation!', null, '', $.i18n('form.btn.ok'));
                        return;
                    }

                    $.sui.refreshFormData(null, !data.results ? data : data.results);
                });
            }

            this.clickHandler = function (e) {

                if ($.sui.getFieldAuth(model.auth) != 'edit') {
                    return;
                }

                if (typeof $ProjectAccountList == 'undefined') {
                    $.notification.alert('Can not find the js file $ProjectAccountList!', null, '', $.i18n('form.btn.ok'));
                    return;
                }

                //调用关联项目逻辑
                var val = model.value;
                $ProjectAccountList.init({
                    selectedId: val,  //被选中的项目ID，非必填
                    eventBack : function(){ //点击项目列表的返回按钮执行的回调
                        //执行关闭项目列表页面
                    },
                    eventSelected : function(selectedId,selectedName){ //选择项目之后执行的回调
                        _eventSelected(selectedId, selectedName);
                    }
                });


            }.bind(this);

            this.el.addEventListener('tap', this.clickHandler);

        },
        update: function (newValue, oldValue) {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            this.el.innerHTML = $.sui.htmlBuilder({value: newValue, desc: '', model: model, fieldInfo: fieldInfo});
            $.sui.clearErrorTips(this.el);
        },
        unbind: function () {
            this.el.removeEventListener('tap', this.clickHandler);
        }
    })

})(cmp, Vue, document);
/**
 * Created by yangchao on 2016/8/18.
 */

(function ($, Vue, doc) {
    'use strict';

    Vue.directive('sui-relation', {
        params: ['scope'],
        twoWay: true,
        bind: function () {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            if (!model || !fieldInfo) return;

            //if ($.sui.getFieldAuth(model.auth) == 'edit') {
            this.clickHandler = function (e) {

            }.bind(this);

            this.el.addEventListener('tap', this.clickHandler);
            //}

        },
        update: function (newValue, oldValue) {
            // 值更新时的工作
            // 也会以初始值为参数调用一次
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;

            this.el.innerHTML = $.sui.htmlBuilder({value: newValue, desc: '', model: model, fieldInfo: fieldInfo});

        },
        unbind: function () {
            this.el.removeEventListener('tap', this.clickHandler);
        }
    })

})(cmp, Vue, document);
/**
 * Created by yangchao on 2016/8/17.
 */

(function ($, Vue, doc) {
    'use strict';

    Vue.directive('sui-relationform', {
        params: ['scope'],
        twoWay: true,
        bind: function () {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            if (!model || !fieldInfo) return;
            var that = this;
            model.attData = model.attData || [];

            if (model.attData.length > 0) {
                //todo 暂时先在前端这么处理，6.1后台修改，此逻辑必须干掉 12.9
                model.__state = 'modified';
            }

            //将attData装填进attachmentInputs
            this.vm.$nextTick(function(){
                var ctrlId = $.sui.getFormCtrlIdByVueElement(that.el);
                s3scope.attachmentInputs[ctrlId] = model.attData;
            });

            this.clickHandler = function (e) {

                //if ($.sui.getFieldAuth(model.auth) != 'edit') {
                //    return;
                //}

                if (e.target.suiMatchesSelector('.see-icon-v5-form-ic-form-fill')) {

                    //判断templateSize,在model.extMap里面
                    if (model.extMap && model.extMap.templateSize <= 0) {
                        $.notification.alert($.i18n('form.app.noBind'), null, '', $.i18n('form.btn.ok'));
                        return;
                    }

                    //关联表单跳转前，执行一次合并数据
                    $.sui.dataService.capForm.mergeFormData({
                        formDataId: s3scope.formMasterId,
                        formId: s3scope.formId,
                        moduleId: s3scope.moduleId,
                        rightId: s3scope.rightId,
                        data: $.sui.reduceSubmitData(s3scope.data),
                        attachmentInputs: $.sui.getAttachments(s3scope.attachmentInputs)
                    }, function(err, data){
                        console.log('after mergeFormData');
                        var ctrlId = $.sui.getFormCtrlIdByVueElement(that.el);
                        var recordIndex = $.sui.getRecordIndexByVueElement(that.el, fieldInfo);
                        var pageKey = $.sui.getTempKey();
                        var fromRecordId = $.sui.getRecordIdByVueElement(that.el, fieldInfo);
                        $.sui.lastPosCtrlId = ctrlId;
                        var options = {
                            formId: fieldInfo.relation.toRelationObj,
                            fromFormId: fieldInfo.relation.fromRelationObj,
                            moduleId: s3scope.moduleId,
                            fromDataId: s3scope.formMasterId,
                            fromRecordId: fromRecordId,
                            fromRelationAttr: fieldInfo.relation.fromRelationAttr,
                            toRelationAttr: fieldInfo.relation.toRelationAttr,
                            formType: fieldInfo.relation.toRelationFormType == '1' ? 'form' : 'unflowform',  //无流程有流程，需要从loadForm中传入参数
                            mutiselect: ctrlId.indexOf('master') >= 0 ? false : true, //如果是重复表为true，非重复表为false
                            showView: (fieldInfo.relation.showView==undefined || fieldInfo.relation.showView ==1) ? true : false,
                            data: s3scope.data
                        };

                        var metadata = $.extend({recordIndex: recordIndex, ctrlId: ctrlId, recordId: fromRecordId}, fieldInfo);
                        console.log(options);

                        if (typeof $.relationForm == 'undefined') {
                            $.notification.alert('Can not find the js file $.relationForm!', null, '', $.i18n('form.btn.ok'));
                            return;
                        }

                        $.relationForm(pageKey, metadata, options);
                    });

                } else if (e.target.suiMatchesSelector('.allow-click-relationform')) {
                    //如果有关联表单穿透就啥事不干
                } else if (fieldInfo.finalInputType == 'maplocate') {
                    //地图控件的绑定事件
                    $.sui.maplocate_clickHandler(e, that, model, fieldInfo);
                } else if (fieldInfo.finalInputType == 'mapmarked') {
                    //地图控件的绑定事件
                    $.sui.mapmarked_clickHandler(e, that, model, fieldInfo);
                } else if (fieldInfo.finalInputType == 'mapphoto') {
                    //地图控件的绑定事件
                    $.sui.mapphoto_clickHandler(e, that, model, fieldInfo);
                }

            }.bind(this);

            this.el.addEventListener('tap', this.clickHandler);

            this.onLoadHandler = function (e) {
                $.sui.onImgLoadHandler(e);
            }.bind(this);
            if (fieldInfo.finalInputType == 'handwrite' || fieldInfo.finalInputType == 'image' || fieldInfo.finalInputType == 'mapphoto') {
                //在捕获阶段，监听load事件
                this.el.addEventListener('load', this.onLoadHandler, true);
            }



        },
        update: function (newValue, oldValue) {
            var model = this.params.scope.model;
            var fieldInfo = this.params.scope.fieldInfo;
            var that = this;
            this.setOptions(model);
            this.el.innerHTML = $.sui.htmlBuilder({value: newValue, desc: '', model: model, fieldInfo: fieldInfo});
            //如果是系统关联，则auth为浏览
            if (fieldInfo.relation && fieldInfo.relation.viewSelectType == '2') {
                var target = this.el.querySelector('.sui-form-ctrl-field');
                if (target) {
                    target.classList.remove('sui-auth-edit');
                    target.classList.add('sui-auth-browse');
                }

            }

            //将所有input，textarea，select框的value设置为newValue
            //如果是radio先处理一下
            if (fieldInfo.finalInputType == 'radio') {
                var radio = this.el.querySelector('#radiogroup_' + fieldInfo.name).querySelector('[value="' + newValue + '"]');
                if (radio) radio.checked = true;
            } else {
                var domArr = this.el.querySelectorAll('input,textarea,select');
                var len = domArr.length;
                for (var i=0; i<len; i++){
                    var dom = domArr[i];
                    dom.value = newValue;
                    dom.checked = newValue.toString() == 'true' || newValue == '1';
                }
            }

            //处理一下textarea的resize
            if (fieldInfo.finalInputType == 'textarea') {

                that.vm.$nextTick(function(){
                    var target = that.el.querySelector('textarea');
                    $.sui.resize(target);
                    setTimeout(function(){
                        var target = that.el.querySelector('textarea');
                        $.sui.resize(target);
                    }, 100);

                });
            } else if (fieldInfo.finalInputType == 'flowdealoption') {
                //如果流程处理意见等html内容中含有img图片，则特殊处理一下
                var images = this.el.querySelectorAll('img');
                var len = images.length;
                for (var i=0; i<len; i++) {
                    var target = images[i];
                    if (typeof target.src == 'string' && !target.src.startsWith('http')) {
                        var src = target.src;
                        if (src.startsWith('file://')) {
                            src = src.replace('file://', '');
                        }
                        target.src = $.serverIp + src;
                    }
                }
            }

        },
        setOptions: function(model) {
            var str = $.i18n('form.select.notice') || '--请选择--';
            var items = model.items;
            if (items && items.length > 0 && items[0].text == undefined) {
                items.forEach(function(item){
                    item.text = item.display || item.text;
                });

                if (items[0].display == '' || items[0].value == '0') {
                    //在关联表单中，控件都是browse
                    //if (model.auth == 'edit') {
                    //    items[0].text = str;
                    //} else {
                    //    items[0].text = ''
                    //}

                    items[0].text = '';
                    items[0].value = '';
                }
            }
        },
        unbind: function () {
            this.el.removeEventListener('tap', this.clickHandler);
            this.el.removeEventListener('load', this.onLoadHandler);
        }
    })

})(cmp, Vue, document);
/**
 * Created by yangchao on 2016/8/18.
 */

(function ($, Vue, doc) {
    'use strict';

    function _checkAll (data, selected) {
        (data || []).forEach(function(item){
            item.selected = selected;
        });
    }

    function _isAllChecked (data) {
        var len = (data || []).length;
        for (var i=0; i<len; i++) {
            if (!data[i].selected) {
                return false;
            }
        }
        return true;
    }

    Vue.directive('sui-sub-table-check-all', {
        params: ['scope'],
        twoWay: true,
        bind: function () {
            var s3scope = window.s3scope;
            var tableName = this.params.scope.tableName;
            var that = this;
            var checked = false;

            this.clickHandler = function (e) {

                if (e.target.classList.contains('see-icon-v5-form-checkbox-checked')) {
                    this.set(false);
                    _checkAll(s3scope.data.children[tableName].data, false);
                    checked = false;
                    $.sui.trigger('onsubtablecheck');
                } else {
                    this.set(true);
                    _checkAll(s3scope.data.children[tableName].data, true);
                    checked = true;
                    $.sui.trigger('onsubtablecheck');
                }

            }.bind(this);

            //搭车绑定一个暂开合拢重复表的事件
            this.expandHandler = function (e) {
                var subTable = e.target.parentNode.parentNode.parentNode;
                var domArr = subTable.querySelectorAll('textarea');
                var len = domArr.length;
                for (var i=0; i<len; i++) {
                    var target = domArr[i];

                    (function (textarea) {
                        $.sui.nextTick(function(){
                            $.sui.resize(textarea);
                        });
                    })(target);
                }
            }
            var arrowDown =  this.el.parentNode.querySelector('.see-icon-v5-form-arrow-down');
            if (arrowDown) {
                arrowDown.addEventListener('tap', this.expandHandler);
            }


            this.el.addEventListener('tap', this.clickHandler);
            this.el.classList.add('sui-sub-table-check-all');

            this.subTableCheckHandler = function (e) {
                var ret = _isAllChecked(s3scope.data.children[tableName].data);
                that.update(ret);
            }.bind(this);

            document.addEventListener('onsubtablecheck', this.subTableCheckHandler);

        },
        update: function (newValue) {
            var s3scope = window.s3scope;
            var tableName = this.params.scope.tableName;
            var data = s3scope.data.children[tableName].data;
            var html = ''
            if (newValue) {
                html += '<i action="selectItem" class="see-icon-v5-form-checkbox-checked"></i>';
            } else {
                html += '<i action="selectItem" class="see-icon-v5-form-checkbox-unchecked-my"></i>';
            }

            this.el.innerHTML = html;

        },
        unbind: function () {
            var arrowDown =  this.el.parentNode.querySelector('.see-icon-v5-form-arrow-down');
            if (arrowDown) {
                arrowDown.removeEventListener('tap', this.expandHandler);
                arrowDown = null;
            }
            this.el.removeEventListener('tap', this.clickHandler);
            document.removeEventListener('onsubtablecheck', this.subTableCheckHandler);

        }
    })

})(cmp, Vue, document);
/**
 * Created by yangchao on 2016/6/6.
 */

(function ($, Vue, doc) {
    'use strict';

    Vue.directive('sui-sub-table-toolbar', {
        params: ['scope'],
        twoWay: true,
        bind: function () {
            // 准备工作
            // 例如，添加事件处理器或只需要运行一次的高耗任务

            var s3scope = window.s3scope;
            var tableName = this.params.scope.tableName;
            var items = s3scope.data.children[tableName].data;
            var item = this.params.scope.item;
            var toolId = 'sub-table-' + tableName + '-' + item.__id;
            var that = this;

            that.update();
            function _afterInsertRecord (record) {
                //返回的数据中，children中的记录如果有__id
                if (s3scope.metadata.templateType == 'lightForm' && record) {
                    $.sui.nextTick(function(){
                        var dom = document.querySelector('[recordid="' + record.__id + '"]');
                        if (dom) {
                            $.sui.scrollIntoView(dom);
                            dom.classList.add('sui-sub-table-new-record');
                        }
                    });
                }
            }

            var locked = false;
            var timer = null;

            this.clickHandler = function (e) {
                if (locked) {
                    if (timer) {
                        clearTimeout(timer);
                    }
                    timer = setTimeout(function(){
                        locked = false;
                    }, 5000);
                    return;
                }
                locked = true;
                var action = e.target.getAttribute('action');
                var index = items.indexOf(item);
                if (action == 'copy' || action == 'empty') {
                    cmp.dialog.loading();
                    $.sui.addRecordInSubTable(action, tableName, item, function(err, record){
                        cmp.dialog.loading(false);
                        if (!err) {
                            _afterInsertRecord(record);
                        }
                        locked = false;
                    });


                } else if (action == 'del') {
                    if (items.length > 1) {
                        var msg = $.i18n('form.childrenTable.deleteConfirm');
                        $.notification.confirm(msg, function(num){
                            if (num == 1) {
                                cmp.dialog.loading();
                                $.sui.delRecordInSubTable('del', tableName, item, function(err, result){
                                    cmp.dialog.loading(false);
                                    locked = false;
                                    if (err) {
                                        $.notification.alert(err.message || err.msg || 'Error when calling $.sui.delRecordInSubTable!', null, '', $.i18n('form.btn.ok'));
                                    } else {
                                        items.splice(index, 1);
                                    }
                                });
                            } else {
                                locked = false;
                            }

                        }, '', [$.i18n('form.btn.cancel'), $.i18n('form.btn.ok')]);

                    } else {
                        $.notification.alert($.i18n('form.childrenTable.deleteLastNotice'), null, '', $.i18n('form.btn.ok'));
                        locked = false;
                    }
                } else if (action == 'selectItem') {
                    item.selected = !item.selected;
                    $.sui.trigger('onsubtablecheck');
                    locked = false;
                } else {
                    locked = false;
                }

            }.bind(this);

            this.el.addEventListener('tap', this.clickHandler);


            this.subTableCheckHandler = function (e) {
                that.update();
            }.bind(this);

            this.updateToolbarHandler = function (e) {
                that.update();
            }.bind(this);

            document.addEventListener('onsubtablecheck', this.subTableCheckHandler);
            document.addEventListener('onupdatetoolbar', this.updateToolbarHandler);
        },
        update: function () {

            var s3scope = window.s3scope;
            var tableName = this.params.scope.tableName;
            var items = s3scope.data.children[tableName].data;
            var item = this.params.scope.item;
            var toolId = 'sub-table-' + tableName + '-' + item.__id;
            var html = '';
            if (s3scope.data.children[tableName].allowDelete || s3scope.data.children[tableName].allowAdd || s3scope.allowCheck) {
                html = '<div id="' + toolId + '" class="sui-sub-table-btns">';

                if (s3scope.allowCheck) {
                    if (item.selected) {
                        html += '<i action="selectItem" class="see-icon-v5-form-checkbox-checked"></i>';
                    } else {
                        html += '<i action="selectItem" class="see-icon-v5-form-checkbox-unchecked"></i>';
                    }
                    //html += '<i action="selectAll" v-show="s3scope.data.children["' + tableName + '"].selected" class="see-icon-v5-form-checkbox-checked"></i>';
                    //html += '<i action="selectAll" v-show="!s3scope.data.children["' + tableName + '"].selected" class="see-icon-v5-form-checkbox-unchecked"></i>';
                }

                if (s3scope.data.children[tableName].allowAdd) {
                    html += '<i action="copy" class="toolbar-btn see-icon-v5-form-new-circle"></i>';
                    html += '<i action="empty" class="toolbar-btn see-icon-v5-form-copy-circle"></i>';
                }
                if (s3scope.data.children[tableName].allowDelete) {
                    html += '<i action="del" class="toolbar-btn see-icon-v5-form-remove-circle"></i>';
                }

                html += '</div>';
            }

            this.el.innerHTML = html;


            //html = '<div id="' + toolId + '" class="sui-sub-table-btns" v-show="s3scope.allowCheck||s3scope.data.children[\'' + tableName + '\'].allowDelete||s3scope.data.children[\'' + tableName + '\'].allowAdd">';
            //html += '<i action="selectItem" class="see-icon-v5-form-checkbox-checked" v-show="s3scope.allowCheck&&item.selected"></i>';
            //html += '<i action="selectItem" class="see-icon-v5-form-checkbox-unchecked" v-show="s3scope.allowCheck"></i>';
            //html += '<i action="copy" class="toolbar-btn see-icon-v5-form-new-circle" v-show="s3scope.data.children[\'' + tableName + '\'].allowAdd"></i>';
            //html += '<i action="empty" class="toolbar-btn see-icon-v5-form-copy-circle" v-show="s3scope.data.children[\'' + tableName + '\'].allowAdd"></i>';
            //html += '<i action="del" class="toolbar-btn see-icon-v5-form-remove-circle" v-show="s3scope.data.children[\'' + tableName + '\'].allowDelete"></i>';
            //html += '</div>';

            //var dom = document.createElement('div');
            //dom.innerHTML = html;
            //this.vm.$compile(dom, s3scope);
            //Array.apply(null, this.el.children).forEach(function(item){
            //    item.remove();
            //});
            //this.el.appendChild(dom);

        },
        //paramWatchers
        unbind: function () {
            this.el.removeEventListener('tap', this.clickHandler);
            document.removeEventListener('onsubtablecheck', this.subTableCheckHandler);
            document.removeEventListener('onupdatetoolbar', this.updateToolbarHandler);

        }
    })

})(cmp, Vue, document);