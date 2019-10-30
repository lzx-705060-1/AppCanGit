var searchValue ;
var cmpData;
var page = {};
cmp.ready(function(){
	prevPage();
	var m = new UrlSearch();
	searchValue = m["value"];
	if(searchValue == undefined){
		searchValue = cmp.storage.get("value");
		cmp.storage.save("value","");
	}
	
	initListView(decodeURIComponent(searchValue));
	_$("#search").addEventListener("click", function() {
        pageSearch();
    });
    searchDo();
	initOpen(null);
	document.title = cmp.i18n("doc.h5.docCenter");
})

function UrlSearch(){
	var name, value;
	var str = location.href; // 取得整个地址栏
	var num = str.indexOf("?")
	str = str.substr(num + 1); // 取得所有参数 stringvar.substr(start [, length ]
	
	var arr = str.split("&"); // 各个参数放到数组里
	for (var i = 0; i < arr.length; i++) {
		num = arr[i].indexOf("=");
		if (num > 0) {
			name = arr[i].substring(0, num);
			value = arr[i].substr(num + 1);
			this[name] = value;
		}
	}
}

function prevPage() {
//	cmp("header").on('tap', "#prev", function(e) {
//		cmp.href.closePage();
//    });
	cmp.backbutton();
	cmp.backbutton.push(function(){
		cmp.href.closePage();
	});
}

function initListView(value) {
	var param = {
            "value": value
        };
	var id = Math.random()*10000;
	cmp.dialog.loading();
    cmp.listView("#allPending", {
        config: {
            pageSize: 20,
            params: param,
            crumbsID: id,
            dataFunc: function(params,options){
            	$s.Docs.archiveList4XZ("",params,{
            	  repeat:true,
      					success:function(result){
      						options.success(result);
      						cmp.dialog.loading(false);
      					},
  			        error: function(error){
  			        	/*var cmpHandled = cmp.errorHandler(error);
	                if(cmpHandled){
	                }else{
	                }*/
	                cmp.dialog.loading(false);
  			        }
            	});
            },
            renderFunc: renderData,
            isClear: true
        },
        down: {
            contentdown: cmp.i18n("doc.page.lable.refresh_down"), //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
            contentover: cmp.i18n("doc.page.lable.refresh_release"), //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
            contentrefresh: cmp.i18n("doc.page.lable.refresh_ing"), //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
        },
        up: {
            contentdown: cmp.i18n("doc.page.lable.load_more"), //可选，在上拉可刷新状态时，上拉刷新控件上显示的标题内容
            contentrefresh: cmp.i18n("doc.page.lable.load_ing"), //可选，正在加载状态时，上拉加载控件上显示的标题内容
            contentnomore: cmp.i18n("doc.page.lable.load_nodata"), //可选，请求完毕若没有更多数据时显示的提醒内容；
        }
    });
}

function renderData(data, isRefresh) {
    var liTPL = _$("#pageContent_tpl").innerHTML;
    var html = cmp.tpl(liTPL, data);
    var content_dom = _$("#list_content");
    if (isRefresh) {
        content_dom.innerHTML = html;
    } else {
        content_dom.innerHTML = content_dom.innerHTML + html;
    }
    cmp.i18n.detect();
}


function initOpen(param) {
    cmp(".cmp-list-content").on("tap", ".cmp-list-cell",
        function() {
    		
	    	if(param != null){
	    		cmpData = param;
	    	}else{
	    		cmpData = cmp.parseJSON(this.getAttribute("cmp-data"));
	    	}
            var frId = cmpData["fr_id"];
            var entranceType = cmpData["entranceType"];
            var fr_type = cmpData["fr_mine_type"];
            var isShareAndBorrowRoot = cmpData["isShareAndBorrowRoot"];
            obj = {};
            obj.cmpData = cmpData;
            cmp.dialog.loading();
            $s.Doc.canOppen({
                "drId": frId,
                "frType": cmpData["fr_type"],
                "entranceType":entranceType
            }, {repeat:true,
                success: function(result) {
                    if(result == "1"){
                        //当前文档不存在
                        cmp.notification.alert(cmp.i18n("doc.h5.noExist"), function(){
                            cmp.listView("#allPending").pullupLoading(1);
                            cmp.dialog.loading(false);
                        }, cmp.i18n("doc.h5.alert"), cmp.i18n("doc.h5.OK"));
                        return;
                    } else if(result == "2"){
                        //没有打开文档的权限
                        cmp.notification.alert(cmp.i18n("doc.h5.noAuthoir"), function(){
                            cmp.dialog.loading(false);
                        }, cmp.i18n("doc.h5.alert"), cmp.i18n("doc.h5.OK"));
                        return;
                    } else if(result == "0"){
                    	var source_fr_type = fr_type;
                        if (fr_type == 51) { //映射文件
                            $s.Docs.getDosBySourceId(cmpData["source_id"], "", {
                            	repeat:true,
                                success: function(docsData) {
                                    fr_type = docsData.frType;
                                    var doc_id = docsData.id;
                                    var isPig = docsData.isPig;
                                    if(isPig == 'true'){
                                    	cmpData["source_id"] = docsData.sourceId;
                                    }
                                    docCanOpen(fr_type,doc_id,cmpData,source_fr_type);
                                },
                                error: function(error){
                                	var cmpHandled = cmp.errorHandler(error);
        			                if(cmpHandled){
        			                	
        			                }else{
        			                }
                                }
                            });
                        } else {
                            docCanOpen(fr_type,frId,cmpData,source_fr_type);
                        }
                    }
                    cmp.dialog.loading(false);
                },
                error: function(error){
                	var cmpHandled = cmp.errorHandler(error);
	                if(cmpHandled){
	                	
	                }else{
	                }
	                cmp.dialog.loading(false);
                }
            });
            
        }, false);
}

function docCanOpen(fr_type,frId,cmpData,source_fr_type) {
	var backPageInfo = _docPath + "/html/docList4xz.html";
    if ((fr_type >= 101 && fr_type <= 122) || (fr_type >= 21 && fr_type <= 26)) {
        openRealDoc(frId,source_fr_type);
    } else { //讨论
        var source_id = cmpData["source_id"];
        saveStorage();
        $s.Doc.insertOpLog4Doc({
            "drId": frId
        }, {
            success: function() {
            	if(fr_type == 8){//讨论
            		bbsApi.jumpToBbs(source_id, "pigeonhole", backPageInfo);
            	}else if(fr_type == 7){//调查
            		inquiryApi.jumpToInquiry(source_id, "1", backPageInfo);
            	}else if(fr_type == 6){//公告
            		bulletinApi.jumpToBulletin(source_id, "1", backPageInfo);
            	}else if(fr_type == 5){//新闻
            		newsApi.jumpToNews(source_id, "1", backPageInfo);
            	}else if(fr_type == 1 || fr_type == 9){//协同、流程表单
            	    collApi.openSummary({
            	        summaryId : source_id,
            	        openFrom : "docLib",
            	        operationId : "1",
            	        docResId : cmpData["fr_id"]
            	    });
            	}else if(fr_type == 2){//公文
            		edocApi.openSummary({
                        summaryId : source_id,
                        openFrom : "lenPotent",
                        docResId : cmpData["fr_id"]
                    });
            	}else if(fr_type == 4){//会议
            		meetingApi.jumpToMeetingSummary(source_id, "docLib", backPageInfo);
            	}else{//暂时其他的类型
            		cmp.notification.alert(cmp.i18n("doc.h5.docTypeError"), null, cmp.i18n("doc.h5.alert"), cmp.i18n("doc.h5.OK"));
            	}
            },
            error: function(error){
            	var cmpHandled = cmp.errorHandler(error);
                if(cmpHandled){
                	
                }else{
                }
            }
        });
    }
}

/**
 * 存储数据to others
 */
function saveStorage() {
    cmp.storage.save("value", searchValue);
}


function openRealDoc(drId,type) {
    saveStorage();
    var docParam = {
        "drId": drId,
        "isForm":false,
		"isFormCol":false,
		"source_fr_type":type,
        "pageInfo": _getCurrentPageInfo()
    }
    $s.Doc.insertOpLog4Doc({
        "drId": drId
    }, {
        success: function() {
        	cmp.href.next(_docPath + "/html/docView.html", docParam);
        },
        error: function(error){
        	var cmpHandled = cmp.errorHandler(error);
            if(cmpHandled){
            	
            }else{
            }
        }
    });
}

//获取当前页面信息,用于页面返回使用
function _getCurrentPageInfo(){
    var _thisPage = {
    		"url" : _docPath + "/html/docList4xz.html"
    }
    return _thisPage;
}

/*********************搜索******************************/

function pageSearch(params) {
    var searchObj = [{
        type: "text",
        condition: "frName",
        text: cmp.i18n("doc.h5.title")
    }];
    cmp.search.init({
        id: "#search",
        model: { //定义该搜索组件用于的模块及使用者的唯一标识（如：该操作人员的登录id）搜索结果会返回给开发者
            name: "doc", //模块名，如："协同"，名称开发者自定义
            id: "8967" //模块的唯一标识：
        },
        parameter: params,
        items: searchObj,
        callback: function(result) { //回调函数：会将输入的搜索条件和结果返回给开发者
            var data = result.item; //返回的搜索相关的数据
            var condition = data.condition; //返回的搜索条件
            var dataSoure = ""; //搜索输入的数据  如果type="text",为普通文本，如果type="date":有begin和end时间属性
            var type = data.type; //搜索输入的数据类型有text和date两种
            var renderArea = data.search_result_render_area_ID; //提供一个该搜索页面上的可渲染的区域（可使用其作为滚动的容器）
            page["type"] = type;
            page["text"] = data.text;
            page["condition"] = condition;
			dataSoure = result.searchKey[0];
			page["dataSoure"] = result.searchKey[0];
            initListView(dataSoure);
            reloadPage();
        }
    });
}

//搜索后重置
function searchDo() {
    // 取消重新加载页面
    _$("#cancelSearch").addEventListener("click", function() {
        // 重置搜索条件
    	initListView('');
		//清空page
		page = {};
        reloadPage();
    });

    _$("#toSearch").addEventListener("click", function() {
        var params = {};
        params.type = page.type;
        params.text = page.text;
        params.condition = page.condition;
        var id = page.id;
        params.value = page.dataSoure;
        pageSearch(params);
    });
}

function reloadPage() {
    // 搜索条件
    var searchDiv = _$("#search");
    var reSearchDiv = _$("#reSearch");
    if (page.condition != undefined) {
        searchDiv.style.display = "none";
        reSearchDiv.style.display = "block";
        if (page.condition != "createTime") {
            _$("#searchText").style.display = "block";
            _$("#searchDate").style.display = "none";
            _$("#cmp_search_title").innerHTML = page.text;
            _$("#searchTextValue").value = page.dataSoure;
        } else {
            _$("#searchText").style.display = "none";
            _$("#searchDate").style.display = "block";
            _$("#cmp_search_title").innerHTML = page.text;
            _$("#searchDateBeg").value = page.begin;
            _$("#searchDateEnd").value = page.end;
        }
    } else {
        searchDiv.style.display = "block";
        reSearchDiv.style.display = "none";
    }
}