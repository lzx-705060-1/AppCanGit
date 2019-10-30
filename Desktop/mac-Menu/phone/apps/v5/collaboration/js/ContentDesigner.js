/**
 * form表单相关内容
 * 
 * 
 * @deprecated 这个组件废弃了， 不用了
 */
var ContentDesigner = (function(){
    
    var slice = [].slice, 
        hasProp = {}.hasOwnProperty,
        extend = function(child, parent) {
            for ( var key in parent) {
                if (hasProp.call(parent, key)){
                    child[key] = parent[key];
                }
            }
            function ctor() {
                this.constructor = child;
            }
            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        };
    
    /**
     * options.viewState {Integer} 正文状态
     * [options.mainbodyContainer] {String} default="mainbodyDataDiv_0" 正文容器ID
     * 
     */
    var App = function(options){
        
        var defConfig = {
                current : "_currentDiv",//保存正文序号的容器
                mainbodyContainer : "mainbodyDataDiv_0",
                viewState : "1",//可编辑状态
                contentType : "10"//正文类型
        }
        this.config = extend(defConfig, options); 
    }
    
    //获取正文区域
    App.prototype.getMainBodyContainer = function(){
        
        return document.querySelector("#" + this.config["mainbodyContainer"]);
    }
    
    //保存数据
    App.prototype.saveOrUpdate = function(params){
        
        var saveOrUpdateCallback = params.callback;
        
        var _this = this;
        
        var getContentParam = {
            checkNull : true,
            needCheckRule : false,
            callback : function(backData){
                
                var ret = false;
                
                if(backData["result"] === true){
                    
                    var submitParams = {
                            domains : backData["contentData"],
                            callback : function(submitData){
                                saveOrUpdateCallback(submitData);
                            }
                    }
                    //提交数据
                    _this._submit(submitParams);
                    
                }else{
                    cmp.notification.alert(backData["errorMsg"], null, cmp.i18n("collaboration.page.dialog.note"), cmp.i18n("collaboration.page.dialog.OK"));//提示
                }
            }
        }
        var domains = this.getContentDomains(getContentParam);
    }
    
    //组装数据
    App.prototype.formPostData = function(selector) {
        var ret = {}

        function _formData(type, ele, retJson) {
            var inputs = ele.querySelectorAll(type);
            if (inputs && inputs.length > 0) {
                for (var i = 0, len = inputs.length; i < len; i++) {
                    var input = inputs[i];
                    var tempId = input.getAttribute("id");
                    if (!tempId) {
                        tempId = input.getAttribute("name");
                    }
                    if (tempId) {
                        retJson[tempId] = CollUtils.filterUnreadableCode(input.value);
                    }
                }
            }
        }

        if (selector) {
            var ele = document.getElementById(selector);
            if (ele) {
                _formData("input", ele, ret);
                _formData("textarea", ele, ret);
            }
        }

        return ret;
    }
    
    //提交正文数据
    App.prototype._submit = function(params){
        
        var domains = params.domains;
        var callback = params.callback;
        
        var postData = {};
        for(var i = 0, len = domains.length; i < len; i++){
            postData[domains[i]] = this.formPostData(domains[i]);
            
            if(domains[i] == this.config["mainbodyContainer"]
                && postData[domains[i]]["content"]){
                postData[domains[i]]["content"] = escapeStringToHTML(postData[domains[i]]["content"]);
            }
        }
        var jsonParams = {
                "_json_params" : cmp.toJSON(postData)
        }
        
        $s.Coll.saveOrUpdate({}, jsonParams, errorBuilder({
            success : function(ret){
                callback(ret);
            }
        }));
    }
    

    /**
     * params.checkNull {Boolean} 是否需要校验必填
     * params.needCheckRule {Boolean} 是否需要校验表单业务规则
     * params.callback {Function} 回调函数(ret - true|false)
     * params.domains {Array} 传入的正文值域
     */
    App.prototype.getContentDomains = function(params) {
        
        var checkNull = params.checkNull,
            needCheckRule = params.needCheckRule,
            callback = params.callback,
            mainbodyDomains = params.domains;
        
        //检查结果
        var retrunObj = {
                "result" : true,
                "errorMsg" : "",
                "contentData" : mainbodyDomains
        }
        
        var mainbodyArgs = {
                "needSubmit" : true,
                "checkNull" : checkNull,
                "needCheckRule" : needCheckRule,
                "needCheckRepeatData" : false,
                "errorAlert" : true
            }
            
     // 是否需要提交数据(有些业务模块正文不单独提交，随着业务整体入库)
        var needSubmit = mainbodyArgs.needSubmit;

        // 是否需要校验必填
        var checkNull = mainbodyArgs.checkNull == null ? true : mainbodyArgs.checkNull;
     // 是否需要校验表单业务规则
        var needCheckRule = mainbodyArgs.needCheckRule == null ? true : mainbodyArgs.needCheckRule;
        
     // 是否校验重复表存在重复数据
        var isCheckRepeatData = mainbodyArgs.needCheckRepeatData;
        
        //标记是否已经有返回数据逻辑
        var hasCallback = false;
        
     // 不是可编辑状态直接返回
        if (this.config["viewState"] == "1") {
            var contentData = mainbodyDomains || [];// 正文数据

            contentData.push(this.config["current"]);
            contentData.push(this.config["mainbodyContainer"]);
            
            var contentType = this.config["contentType"];// 正文类型
            
            if (contentType == "10") {// HTML正文
                
            	// 表单的单独在上面逻辑中处理，因为考虑到confirm组件是异步的，所以把这点逻辑提到表单逻辑分支里
                if (needSubmit) {
                    // 是否需要提交数据
                	retrunObj["contentData"] = contentData;
                }

                if(!hasCallback && callback){
                    callback(retrunObj);
                }
                
            } else if (contentType == "20") {
            	var options = { 
            			moduleId:_$("#id").value,
            			needCheckRule:needCheckRule,
            			notSaveDB:needSubmit,
            			rightId: params.rightId,
            			allowQRScan : params.allowQRScan,
            			summaryId : params.summaryId,
            			templateId: params.templateId,
            			needSn : false
            		}
            	_$("#moduleTemplateId").value = this.config["moduleTemplateId"];
            	cmp.sui.submit(options,function(err,data){
            	    
            	    var capData = CAPUtil.mergeSubmitResult(err, data);
                    err = capData.err;
                    data = capData.data;
            	    
            		if(err || data.success =="false"){
            			retrunObj["result"] =false;
            			if(data){
            			    try {
            			        retrunObj["errorMsg"] = cmp.parseJSON(data.errorMsg).ruleError;
                            } catch (e) {
                                retrunObj["errorMsg"] = data.errorMsg;
                            }
            			}else if(!data && err.message){
            				retrunObj["errorMsg"] = err.message;
            			}
            			//回掉工作流预提交方法
            		}else{
            			retrunObj["result"] =true;
            			retrunObj["data"] = data;
            			//回掉工作流预提交方法
            		}
            		_$("#contentType").value ="20";
            		if(callback){
        				callback(retrunObj);
        			}
            	});
            } else if (contentType > 40 && contentType < 50) {// OFFICE正文
                
                if (contentType == 45 && !savePdf()) {
                    // 保存pdf文件
                    retrunObj["result"] = false;
                    retrunObj["errorMsg"] = "Save PDF failed!";
                    
                } else if (!saveOffice()) {// 保存OFFICE文件
                    retrunObj["result"] = false;
                    retrunObj["errorMsg"] = "Save Office failed!";
                }
            }
        }
    }

    
  //设置流程值
    App.prototype.setInputVal = function(field, val){
        var container = this.getMainBodyContainer();
        var f = container.querySelector("#" + field);
        if(f){
            f.value = val;
        }
    }

    App.prototype.getInputVal = function(field){
        var container = this.getMainBodyContainer();
        var f = container.querySelector("#" + field);
        var ret = "";
        if(f){
            ret = CollUtils.filterUnreadableCode(f.value);
        }
        return ret;
    }
    
    return App;
})();