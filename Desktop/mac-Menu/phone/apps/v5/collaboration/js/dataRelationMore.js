var isSearch = false; //是否查询，用于控制是否覆盖列表数据
var urlParam = {};

cmp.ready(function() {
	urlParam = cmp.href.getParam();
    initBackEvent();
    cmp.i18n.init(_collPath + "/i18n/", "Collaboration", function(){
    	initPageData();
    	initEvent();
    },$verstion);
})

function initPageData(p_params){
	//设置TITLE值
	_$("title").innerHTML = urlParam.title;
	// _$("#titleDetail").innerHTML = urlParam.title;
	//设置名称隐藏与距离顶部高度
	// _$("#titleDetailArea").style.top = _$("#hid").offsetHeight + "px";
    
    /*_$("title").addEventListener("tap", function() {
        _$("#titleDetailArea").classList.toggle("display_none");
    });
    // 影藏标题更多
    _$("#titleDetailArea").addEventListener('tap', function(e) {
        if (e.target == this) {
            this.classList.toggle("display_none");
        }
    });*/
	
	var modelType = urlParam.modelType;
	if(modelType == "templateDeal"){ // 模板数据
		var params = {
			id : urlParam.id,
			templateId : urlParam.templateId,
			memberId : urlParam.memberId,
			summaryId : urlParam.summaryId,
			senderId : urlParam.senderId,
			searchCondition : cmp.toJSON(p_params)
		};
		callListView(params, $s.Coll.templateDealMore, renderData_templateDeal);
	}else if(modelType == "selfColl"){ // 自由协同
        var params = {
            id : urlParam.id,
            memberId : urlParam.memberId,
            summaryId : urlParam.summaryId,
            senderId : urlParam.senderId,
			affairId : urlParam.affairId,
            searchCondition : cmp.toJSON(p_params)
        };
        callListView(params, $s.Coll.selfCollMore, renderData_templateDeal);
	}else if(modelType == "templateSend"){ // 模板数据(新建)
		var params = {
			id : urlParam.id,
			templateId : urlParam.templateId,
			summaryId : urlParam.summaryId,
            searchCondition : cmp.toJSON(p_params)
		};
		callListView(params, $s.Coll.templateSendMore, renderData_templateSend);
	}else if(modelType == "project"){ // 项目
		var params = {
			id : urlParam.id,
            searchCondition : cmp.toJSON(p_params),
            templateId : urlParam.templateId,
            affairId : urlParam.affairId
		};
		callListView(params, $s.Coll.projectMore, renderData_project);
	}
}

/**
 * 模板数据处理
 * @param result
 * @param isRefresh
 */

function renderData_templateDeal(result, isRefresh){
	var pendingTPL = _$("#html_templateDealMore").innerHTML;
	renderFuncCommon(pendingTPL, result, isRefresh);
    cmp.IMG.detect();
}

/**
 * 模板数据处理(新建)
 * @param result
 * @param isRefresh
 */

function renderData_templateSend(result, isRefresh){
	var pendingTPL = _$("#html_templateSendMore").innerHTML;
	renderFuncCommon(pendingTPL, result, isRefresh);
    cmp.IMG.detect();
}

/**
 * 项目处理
 * @param result
 * @param isRefresh
 */

function renderData_project(result, isRefresh){
	var pendingTPL = _$("#html_projectMore").innerHTML;
	renderFuncCommon(pendingTPL, result, isRefresh);
}

function renderFuncCommon(pendingTPL, result, isRefresh){
	var html = cmp.tpl(pendingTPL, result);
    if (isRefresh || isSearch) {//是否刷新操作，刷新操作 直接覆盖数据
        _$("#moreData").innerHTML = html;
        isSearch = false;
    } else {
    	var table = _$("#moreData").innerHTML;
    	_$("#moreData").innerHTML = table + html;
    }
}

/**
 * 调用listview
 * @param params
 * @param dataFunc
 * @param renderFunc
 */
function callListView(params, dataFunc, renderFunc){
	cmp.listView("#pullrefresh", {
		imgCache:true,
	    config: {
	        onePageMaxNum:60,
	        isClear: false,
	        clearCache: true,
	        pageSize: 20,
	        params: params,
	        dataFunc: function(params, options) {
	        	dataFunc(params, errorBuilder({
	        		exeSelfError : true,
		    		success : function(result) {
		    			options.success(result);
		            },
		            error : function(result){
		            	options.error();
		            }
		        }))
	        },
	        renderFunc: renderFunc
	    },
	    down: {
	    	contentprepage:cmp.i18n("collaboration.page.lable.prePage"),//上一页
	        contentdown: cmp.i18n("collaboration.page.lable.refresh_down"),//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
	        contentover: cmp.i18n("collaboration.page.lable.refresh_release"),//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
	        contentrefresh: cmp.i18n("collaboration.page.lable.refresh_ing") //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
	    },
	    up: {
	    	contentnextpage:cmp.i18n("collaboration.page.lable.nextPage"),//下一页
	        contentdown: cmp.i18n("collaboration.page.lable.load_more"),//可选，在上拉可刷新状态时，上拉刷新控件上显示的标题内容
	        contentrefresh: cmp.i18n("collaboration.page.lable.load_ing"),//可选，正在加载状态时，上拉加载控件上显示的标题内容
	        contentnomore: cmp.i18n("collaboration.page.lable.load_nodata") //可选，请求完毕若没有更多数据时显示的提醒内容；
	    }
	});
}

function initEvent(){
	//穿透：模板数据
	cmp("#moreData").on("tap", ".templateDeal", function() {
		var params = {
        	summaryId : this.getAttribute("summaryId"),
        	affairId : this.getAttribute("affairId")
        }
		collApi.openSummary(params);
	});
	//穿透：项目
	cmp("#moreData").on("tap", ".project", function() {
		_alert(cmp.i18n("collaboration.dataRelation.alter.projectDetail"));
	});
	//查询：模版数据
    document.querySelector('#search').addEventListener("click",function(){
        var modelType = urlParam.modelType;
        if(modelType == "templateDeal"){ // 模板数据
			if(urlParam.affairState == 1 || urlParam.affairState == 2){ // 待发
                var searchObj = [{type:"text",condition:"subject",text:cmp.i18n("collaboration.page.lable.subject")},
                    			{type:"date",condition:"sendDate",text:cmp.i18n("collaboration.affairs.dateSend")}];
			}else{
                var searchObj = [{type:"text",condition:"subject",text:cmp.i18n("collaboration.page.lable.subject")},
								{type:"text",condition:"sender",text:cmp.i18n("collaboration.affairs.sender")},
								{type:"date",condition:"sendDate",text:cmp.i18n("collaboration.affairs.dateSend")},
								{type:"date",condition:"receiverDate",text:cmp.i18n("collaboration.page.lable.receiverDate")}];
            }
            searchFn(1060, searchObj);
        }else if(modelType == "selfColl"){ // 自由协同
            var searchObj = [{type:"text",condition:"subject",text:cmp.i18n("collaboration.page.lable.subject")},
                {type:"text",condition:"sender",text:cmp.i18n("collaboration.affairs.sender")},
                {type:"date",condition:"sendDate",text:cmp.i18n("collaboration.affairs.dateSend")},
                {type:"date",condition:"receiverDate",text:cmp.i18n("collaboration.page.lable.receiverDate")}];
            searchFn(1061, searchObj);
		}else if(modelType == "templateSend"){ // 模板数据(新建)
            var searchObj = [{type:"text",condition:"subject",text:cmp.i18n("collaboration.page.lable.subject")},
                			{type:"date",condition:"sendDate",text:cmp.i18n("collaboration.affairs.dateSend")}];
            searchFn(1062, searchObj);
        }else if(modelType == "project"){ // 项目
            var searchObj = [{type:"text",condition:"subject",text:cmp.i18n("collaboration.page.lable.subject")}];
            searchFn(1063, searchObj);
        }
    });
}

/**
 * 查询
 */
function searchFn(modelId, searchObj){
    cmp.search.init({
        id:"#search",
        model:{                    //定义该搜索组件用于的模块及使用者的唯一标识（如：该操作人员的登录id）搜索结果会返回给开发者
            name:"collaboration",   //模块名，如："协同"，名称开发者自定义
            id:modelId         //模块的唯一标识：
        },
        parameter: null,
        items : searchObj,
        callback : function(result){ //回调函数：会将输入的搜索条件和结果返回给开发者
            //返回的搜索相关的数据
        	isSearch = true;
            initPageData(result);
        }
    });
}

function initBackEvent(){
    cmp.backbutton();
    cmp.backbutton.push(_goBack);
    // _$("#goBackBtn").addEventListener("tap", _goBack);
}

function _goBack() {
    cmp.href.back();
}

/**
 * 格式化时间
 * @param time  Long 日期
 */
function formatDate(time){
	var date = new Date(parseFloat(time));
	var month = ("0" + (date.getMonth() + 1)).slice(-2);
	var day = ("0" + date.getDay()).slice(-2);
	var hours = ("0" + date.getHours()).slice(-2);
	var minutes = ("0" + date.getMinutes()).slice(-2);
	return date.getFullYear() + "-" + month + "-" + day + " " + hours + ":" + minutes;
}