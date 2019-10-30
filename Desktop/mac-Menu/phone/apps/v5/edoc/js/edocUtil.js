/// code from common-make-variables.s3js - start ///
var $verstion = "?buildversion=181210172510";
var _cmpPath = "/seeyon/m3/cmp";
var _collPath = "/seeyon/m3/apps/v5/collaboration";
var _common_v5_path = "/seeyon/m3/apps/v5/commons";
var _docPath = "/seeyon/m3/apps/v5/doc";
var _edocPath = "/seeyon/m3/apps/v5/edoc";
var _wfPath = "/seeyon/m3/apps/v5/workflow";
//other jssdk
var editContent_jssdk = "/seeyon/m3/apps/v5/commons/js/editContent-jssdk.js?buildversion=181210172510";
var doc_jssdk = "/seeyon/m3/apps/v5/doc/js/doc-jssdk.js?buildversion=181210172510";
var commonPhrase_jssdk = "/seeyon/m3/apps/v5/commons/js/commonPhrase-jssdk.js?buildversion=181210172510";
var workflow_jssdk = "/seeyon/m3/apps/v5/workflow/js/workflow-jssdk.js?buildversion=181210172510";
var last_jssdk = "/seeyon/m3/apps/v5/commons/wechat-jssdk.js?buildversion=181210172510";
var collaboration_jssdk = "/seeyon/m3/apps/v5/collaboration/js/collaboration-jssdk.js?buildversion=181210172510";
/// code from common-make-variables.s3js - end ///

/**
 * 简化选择器
 * @param selector 选择器
 * @param queryAll 是否选择全部
 * @param 父节点
 * @returns
 */
function _$(selector, queryAll, pEl){
    
    var p = pEl ? pEl : document;
    
    if(queryAll){
        return p.querySelectorAll(selector);
    }else{
        return p.querySelector(selector);
    }
}
/**
 * 从listview缓存中删除某条记录
 * @param {String} affairId
 * 
 */
function removeListCache(affairId){
	var conditions = cmp.storage.get("conditions",true);
	if(!conditions){
		return;
	}
	conditions = cmp.parseJSON(conditions);
	var cache = cmp.storage.get(conditions.listContainer,true);
	if(!cache){
		return;
	}
	cache = cmp.parseJSON(cache);
	cmp.each(cache.data, function(i, v){
		if(v.affairId == affairId){
			cache.data.splice(i,1);
		}
	});
	cmp.storage.save(conditions.listContainer,cmp.toJSON(cache),true);
}

/**
 * 更新listview缓存
 * @param {String} affairId 记录affairId
 * @param {Object} type 更新类型('temp':暂存，'read':已读)
 */
function updateListCache(affairId,type){
	var conditions = cmp.storage.get("conditions",true);
	if(!conditions){
		return;
	}
	conditions = cmp.parseJSON(conditions);
	var cache = cmp.storage.get(conditions.listContainer,true);
	if(!cache){
		return;
	}
	cache = cmp.parseJSON(cache);
	cmp.each(cache.data, function(i, v){
		if(v.affairId == affairId){
			if(type == "temp"){
				cache.data[i].affair.subState = 13;
			}else if(type == "read"){
				cache.data[i].affair.subState = 12;
			}
		}
	});
	cmp.storage.save(conditions.listContainer,cmp.toJSON(cache),true);
}

/**
 * 设置listview不使用缓存，重新刷新数据
 * 删除当前listview的缓存
 */
function setListCacheRefresh(){
	cmp.storage.delete("#allPending&#allPending",true);
	cmp.storage.delete("#edocSummaryListContain&#edocSummaryListContain",true);
	
	var conditions = cmp.storage.get("conditions",true);
	if(!conditions){
		return;
	}
	conditions = cmp.parseJSON(conditions);
	cmp.storage.delete(conditions.listContainer,true);
	cmp.storage.delete("conditions",true);
}

/**
 * 公共方法
 */
var EdocUtils = {

    // 查看Value是否在array中
    isInArray : function(array, value) {
        var ret = false;
        if (array && array.length > 0) {
            for (var i = 0; i < array.length; i++) {
                if (value == array[i]) {
                    ret = true;
                    break;
                }
            }
        }
        return ret;
    },
    
    trim : function(str) {
        var ret = "";
        if (str) {
            ret = str.replace(/(^\s*)|(\s*$)/g, "");
        }
        return ret;
    },
    
    //判断是不是CMP壳
    isCMPShell : function(){
    	return cmp.platform.CMPShell;
    },
    getBackURL:function(){
        return EdocUtils.getHrefParam("backURL");
    },
    getQueryString : function(){
        var s = window.location.search;
        if(s){
            //去掉文号
            s = "&" + s.substring(1);
            
            //cmp路径里面的特殊字符
            s = s.replace(/&cmphistoryuuid=\d+/i, "");
        }
        return s + window.location.hash;
    },
    getHrefParam:function(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var s = window.location.search;
        if(!s){
            s = window.location.hash;
        }
        if(s){
            var r = s.substr(1).match(reg);
            if(r!=null)
                return  unescape(r[2]); 
        }
        return "";
    },
    getHrefQuery: function ()  {
        
        var url = window.location.search,
            reg_url = /^\?([\w\W]+)$/, 
            reg_para = /([^&=]+)=([\w\W]*?)(&|$|#)/g, 
            arr_url = reg_url.exec(url), 
            ret = {};
        if (arr_url && arr_url[1]) {
            var str_para = arr_url[1], result;
            while ((result = reg_para.exec(str_para)) != null) {
                ret[result[1]] = result[2];
            }
        }
        return ret;
    },
    ajaxErrorHander: function(err,ajaxErrorCallback){
    	 var cmpHandled = cmp.errorHandler(err);
         if(!cmpHandled){
              if(typeof ajaxErrorCallback == "function"){
            	  ajaxErrorCallback(err);
              }else{
                  _alert(cmp.i18n("Edoc.exception.reqException"));
              }
         }
    },
    isFromM3NavBar : function(){
    	var isFromM3NavBar = window.location.href.match('m3from=navbar');
    	return isFromM3NavBar == "m3from=navbar";
    }

}

function _alert(message, completeCallback, title, buttonLabel) {
    if(!title) {
        title = cmp.i18n("Edoc.page.dialog.note");
    }
    if(!buttonLabel) {
        buttonLabel = cmp.i18n("Edoc.page.dialog.OK");
    }
    cmp.notification.alert(message, completeCallback, title, buttonLabel);
}

//不能穿透的链接数组
var i = 0;
var noLinkTypeArray = [];
noLinkTypeArray[i++] = "message.link.edoc.supervise.detail";//督办详细界面
noLinkTypeArray[i++] = "message.link.edoc.supervise.main";//督办主页
noLinkTypeArray[i++] = "message.link.exchange.distribute";//分发
noLinkTypeArray[i++] = "message.link.exchange.receive";//签收
noLinkTypeArray[i++] = "message.link.exchange.register.govpending";//政务版登记
noLinkTypeArray[i++] = "message.link.exchange.register.pending";//A8 登记
noLinkTypeArray[i++] = "message.link.exchange.register.receive";//A8 登记签收
noLinkTypeArray[i++] = "message.link.exchange.registered";//登记
noLinkTypeArray[i++] = "message.link.exchange.send";//交换-发送
noLinkTypeArray[i++] = "message.link.exchange.sent";//交换-发送

var MessageLinkArray = {

    isNoLinkType : function(linkType) {
    	if(EdocUtils.isInArray(noLinkTypeArray, option.linkType)) {
    		return true;
    	}
    	return false;
    }
	
};


/**
 * 缓加载工具类
 */
var LazyUtil = (function(){
    
  //缓加载机制
    var lazyStack = {};
    function LazyTool(){}
    LazyTool.prototype.addLazyStack = function(item){
        
        /**
         * item.code 字符串 | 堆栈标识
         * item.depend 字符串 | 依赖的js
         * item.dependModel strong/强关联，必须等父任务执行完成后在进行加载  weak/若关联，加载顺序没关系（默认值）
         * item.css 数组 | css数组
         * item.js  数组 | js数组
         * 
         */
        if(item.code){
            var i = lazyStack[item.code];
            if(!i){
                item.loaded = false;
                item.isLoading = false;
                lazyStack[item.code] = item;
            }else{
                console.warn("重复设置懒加载, code=" + item.code);
            }
        }else{
            alert(cmp.i18n("Edoc.exception.setException"));
        }
    };
    
  //启动懒加载
    LazyTool.prototype.startLazy = function(groups){
        
        for(var k in lazyStack){
            
            var thisI = lazyStack[k], _this = this;
            if(thisI.loaded || thisI.isLoading){
                continue;
            }
            //按组加载
            if(groups && thisI.groups != groups){
                continue;
            }
            thisI.isLoading = true;
            
            function loadThis(i){
                if(i.css && i.css.length > 0){
                    cmp.asyncLoad.css(i.css);
                }
                if(i.js && i.js.length > 0){
                    //console.log("开始加载:" + i.js);
                    cmp.asyncLoad.js(i.js, function(){
                        //console.log("完成加载:" + i.js);
                        _this._onJSLoad(i);
                    });
                }else{
                    _this._onJSLoad(i);
                }
            }
            
            if(thisI.depend && thisI.dependModel === "strong"){
                (function(child){
                    _this.addLoadedFn(child.depend, function(){
                        loadThis(child);
                    });
                })(thisI);
            }else{
                loadThis(thisI);
            }
        }
    };
    
    /**
     * js加载完成后执行脚本
     */
    LazyTool.prototype._onJSLoad = function(i){
        var _this = this;
        i.loaded = true;
        if(i.functions && i.functions.length > 0){
            var checkRet = _this.isLoadChain(i.code);
            if(checkRet.finish){
                for(var j = 0; j < i.functions.length; j++){
                    i.functions[j]();
                }
                i.functions = [];
            }else{
                //事件转移
                for(var j = 0; j < i.functions.length; j++){
                    //console.log("事件转移:" + i.code + " to " + checkRet.code);
                    _this.addLoadedFn(checkRet.code, i.functions[j]);
                }
                i.functions = [];
            }
        }
    }
    
  //加载脚本加载完成后
    LazyTool.prototype.addLoadedFn = function(code, fn){
        //console.log("接收转移事件:code=" + code + " fn=" + fn);
        var i = lazyStack[code], _this = this;
        if(i){
            var checkRet = _this.isLoadChain(i.code);
            if(checkRet.finish){
                fn();
            }else{
                if(checkRet.code == i.code){
                    i.functions = i.functions || [];
                    i.functions.push(fn);
                }else{
                    //转移
                    _this.addLoadedFn(checkRet.code, fn);
                }
            }
        }else{
            fn();
        }
    };
    
  //校验依赖路径是否加载完成
    LazyTool.prototype.isLoadChain = function(code){
        
        if(!code){
            return {
                "finish" : true
            };
        }else{
            var i = lazyStack[code];
            if(!i.loaded){
                return {
                    "finish" : false,
                    "code" : code
                };
            }else{
                return this.isLoadChain(i.depend);
            }
        }
    };
    
    return new LazyTool();
})();