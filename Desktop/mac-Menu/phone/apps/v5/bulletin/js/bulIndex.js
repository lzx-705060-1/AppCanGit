var page = {};
//是否从底导航打开
var isFromM3NavBar = window.location.href.match('m3from=navbar');
cmp.ready(function() {
    loadConditions();
    loadType();
    reloadPage();
    addBulletinDetailsHref();
    searchEvent();
    //切换浮窗事件
    switchEvent();

    document.getElementById("cmp-control").style.height = window.innerHeight + "px";
});
function switchEvent(){
		var timer;
	    cmp(".bulType_title").on('tap', ".float_r",function(){
	    	var objThis =this;
	        clearTimeout(timer);
	        timer = setTimeout(function() {
	            filterLists(objThis);
	        }, 250);
	    });
	    //点击列表类型，切换激活样式，将其他的样式改为未激活
	    cmp("#option").on('tap', "span", function(e) {
	    	cmp.storage.save('curTabId', this.id, true);
	    	reloadPage(this.id);
	    });
}
//筛选滚动条居中定位
function scrollMid(objThis) {
    var actObj = objThis,
        left = _$("#option").offsetLeft,
        //激活的dom相对于窗口的左边距离
        actOffX = actObj.offsetLeft,
        //当前激活的dom宽度
        actW = actObj.clientWidth,
        //窗口的宽度
        winW = document.documentElement.clientWidth,
        //父级滚动条的滚动left值
        scrollX = _$("#option").scrollLeft;
  	    if(actOffX>scrollX){
  	        if (winW /2 > (actOffX-scrollX)) {
  	            _$("#option").scrollLeft = scrollX;
  	        } else {       	
  	            _$("#option").scrollLeft = actOffX-winW/2;
  	        }
  	    }else{
  	        _$("#option").scrollLeft = actOffX-winW/2
  	    }
}
/**
 * 设置公告类型页签样式为选中状态
 */
function activeTab(){
	var curTabId = cmp.storage.get('curTabId', true)|| "-1";
	var objArray = _$("#option .active",true);
	 if(objArray != null){
	   	 for(i=0;i<objArray.length;i++){
	   		 objArray[i].classList.remove("active");
	   	 }
	 }
	 var allOption = _$("#option span",true);
	 for(j=0;j<allOption.length;j++){
		 if(curTabId == allOption[j].id){
			 allOption[j].classList.add("active");
			 break;
		 }
	 }
}
/**
 * 设置选择版块页对应样式为选中状态
 */
function activeChoose(){
	var objArray = _$("#option .active",true);
	//默认全部
	var tag = "-1";
	 if(objArray != null && objArray.length == 1){
		 tag = objArray[0].id;
	 }
	 var allOperations = _$(".operateArea .name",true)
	 for(j=0;j<allOperations.length;j++){
		 if(tag == allOperations[j].id){
			 allOperations[j].classList.add("choose");
		 }else{
			 allOperations[j].classList.remove("choose");
		 }
	 }
}
//过滤器
function filterLists(selector) {
	if(!selector.firstElementChild.classList.contains("icon-active")){
		selector.firstElementChild.classList.add("icon-active");
    	_$("#bulTypeDiv").classList.remove("display_none");
    	_$("#bulTypeDiv").style.zIndex = "5";
    	_$(".bulType_title").style.zIndex = "10";
    	_$("#bulTypeDiv").classList.add('fade-down');
         setTimeout(function() {
        	 _$("#bulTypeDiv").classList.remove('fade-down');
         }, 200);
         activeChoose();
        _$("#option").classList.add("display_none");
        _$('.sort-btn').classList.remove('display_none');
    	_$(".createFilter").classList.remove("display_none");
    	_$(".createFilter").style.zIndex = "2";
    	_$("#all_bul").classList.add("blur");
    	_$("#all_bul").style.zIndex = "1";
    	_$("#searchBul").style.display = "none";
    }else{
    	selector.firstElementChild.classList.remove("icon-active");
    	_$("#bulTypeDiv").classList.add("display_none");
    	_$("#bulTypeDiv").classList.add('fade-up');
         setTimeout(function() {
        	 _$("#bulTypeDiv").classList.remove('fade-up');
         }, 200);
         _$("#option").classList.remove("display_none");
         _$('.sort-btn').classList.add('display_none');
    	_$(".createFilter").classList.add("display_none");
    	_$(".createFilter").style.zIndex = "96";
    	_$("#all_bul").classList.remove("blur");
    	_$("#searchBul").style.display = "";
    }
}
function reloadPage(id) {
    // 搜索条件
    var searchDiv = document.getElementById("search");
    var reSearchDiv = document.getElementById("reSearch");
    if (page.condition != undefined) {
        searchDiv.style.display = "none";
        reSearchDiv.style.display = "block";
        if (page.condition != "publishDate") {
            _$("#searchText").style.display = "block";
            _$("#searchDate").style.display = "none";
            _$("#cmp_search_title").innerHTML = page.text;
            _$("#searchResultSpan").innerHTML = page.textHTML;
            _$("#searchTextValue").value = _$("#searchResultSpan").innerText;
            page.dataSoure = _$("#searchResultSpan").innerText;
        } else {
            _$("#searchText").style.display = "none";
            _$("#searchDate").style.display = "block";
            _$("#cmp_search_title").innerHTML = page.text;
            _$("#searchDateBeg").value = page.begin;
            _$("#searchDateEnd").value = page.end;
        }
	        
        cmp.backbutton.pop();
    } else {
        searchDiv.style.display = "block";
        reSearchDiv.style.display = "none";
    }
    var result = $s.CmpBulletins.bulletinsList;
    loadData(result, page);
    window.setTimeout(function() {
    	activeTab();
    }, 200);
}

function pageSearch(modelId, params) {
    var searchObj = [{
        type: "text",
        condition: "title",
        text: cmp.i18n("bulletin.h5.title")
    }, {
        type: "text",
        condition: "publishUser",
        text: cmp.i18n("bulletin.h5.creater")
    }, {
        type: "date",
        condition: "publishDate",
        text: cmp.i18n("bulletin.h5.dateTime")
    }];
    cmp.search.init({
        id: "#search",
        model: { //定义该搜索组件用于的模块及使用者的唯一标识（如：该操作人员的登录id）搜索结果会返回给开发者
            name: "bulletin", //模块名，如："协同"，名称开发者自定义
            id: modelId //模块的唯一标识：
        },
        parameter: params,
        items: searchObj,
        callback: function(result) { //回调函数：会将输入的搜索条件和结果返回给开发者
            if (!result.item) {
                page = {};
            }
            //document.getElementById("CMP_SearchContent").style.display="none";
            var data = result.item; // 返回的搜索相关的数据
            var condition = data.condition; // 返回的搜索条件
            var dataSoure = ""; // 搜索输入的数据 如果type="text",为普通文本，如果type="date"
            var type = data.type; // 搜索输入的数据类型有text和date两种
            page["type"] = type;
            page["text"] = data.text;
            page["condition"] = condition;
            if (type == "date") {
                dataSoure = result.searchKey[0] + "#" + result.searchKey[1];
                page["begin"] = result.searchKey[0];
                page["end"] = result.searchKey[1];
                page["dataSoure"] = dataSoure;
            } else {
                page["dataSoure"] = result.searchKey[0];
                page["textHTML"] = result.searchKey[0];
            }

            window.setTimeout(function() {
                reloadPage();
            }, 200);
        }
    });
}

//将当前listview容器，以及查询框状态存入sessionStorage
function saveConditions() {
    cmp.storage.save("page", cmp.toJSON(page), true);
}
//从缓存中读取查询框状态
function loadConditions() {
    var pageCondition = cmp.storage.get("page", true);
    if (pageCondition) {
        page = eval('(' + pageCondition + ')');
        cmp.storage.delete("page", true);
    }
    //对语音小智穿透过来的搜索公告进行处理
    if (_getQueryString("openFrom") == "robot") {
        page["condition"] = "title";
        page["dataSoure"] = _getQueryString("conditionValue");
        page["textHTML"] = _getQueryString("conditionValue");
        page["text"] = cmp.i18n("bulletin.h5.title");
    }
}

//版块公告（有版块时，获取版块id）
function loadType() {
		//vjoin屏蔽分类型
    if(_getQueryString("VJoinOpen")=="VJoin"){
    	_$(".bulType_title").classList.add("display_none");
    	_$("#all_bul").style.top="48px";
    	return;
    }
    var urlParam = cmp.href.getParam();
    if (urlParam && urlParam["typeId"]) {
    	if(!page["typeId"]){
        	  page["typeId"] = urlParam["typeId"];
        	  cmp.storage.save('curTabId',urlParam["typeId"], true);
        }
    }
    $s.CmpBulletins.bulTypeList({},{
		success:function(result){
		  if(!result.isV5Member){
          _$(".bulType_title").classList.add("display_none");
          _$("#all_bul").style.top="48px";
          return;
      }
			var data = result.typeListMap.all;
			var str = '';
			str += '<span  id="-1" >'+cmp.i18n("bulletin.h5.type.all")+' </span>';
			for(i=0;i<data.length;i++){
                str += '<span  id="' + data[i].id + '" >' + (data[i].typeName + '') + '</span>';
			}
			document.getElementById("option").innerHTML = str;
			var tpl = document.getElementById("bulTypeList").innerHTML;
            var html = cmp.tpl(tpl, result.typeListMap);
            document.getElementById("bulTypeDiv").innerHTML = html;
            cmp.i18n.detect();
            //点击浮层的分类时加载
            cmp(".item").on('tap', ".name", function(e) {
            	cmp.storage.save('curTabId',this.id, true);
            	activeTab();
            	reloadPage(this.id);
            	var obj = _$("#option .active");
            	var objThis =_$(".bulType_title .float_r");
            	setTimeout(function() {
                  filterLists(objThis);
                  scrollMid(obj);
              }, 250);
            });
		}
		
	});
}

function loadData(subDataFunc, params) {
    var bul_crumbsID = params.condition ? "#all_bul&search" + Math.random() : "#all_bul&tag"+Math.random();
    cmp.listView("#all_bul", {
        config: {
            //captionType:1,
            //height: 50,//可选，下拉状态容器高度
            pageSize: 20,
            params: {},
            crumbsID: bul_crumbsID,
            dataFunc: function(param, options) {
                params.pageNo = param["pageNo"];
                params.pageSize = param["pageSize"];
                var curTabId = cmp.storage.get('curTabId', true)|| "-1";
                params.curTabId = curTabId;
                subDataFunc({}, params, {
                    success: function(result) {
                        options.success(result);
                    },
                    error: function(error) {
                        var cmpHandled = cmp.errorHandler(error);
                        if (cmpHandled) {
                            //cmp处理了这个错误
                        } else {
                            //customHandle(error) ;//走自己的处理错误的逻辑
                        }
                    }
                });
            },
            renderFunc: renderData,
            isClear: false
        },
        down: {
            contentdown: cmp.i18n("bulletin.page.lable.refresh_down"), //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
            contentover: cmp.i18n("bulletin.page.lable.refresh_release"), //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
            contentrefresh: cmp.i18n("bulletin.page.lable.refresh_ing"), //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
        },
        up: {
            contentdown: cmp.i18n("bulletin.page.lable.load_more"), //可选，在上拉可刷新状态时，上拉刷新控件上显示的标题内容
            contentrefresh: cmp.i18n("bulletin.page.lable.load_ing"), //可选，正在加载状态时，上拉加载控件上显示的标题内容
            contentnomore: cmp.i18n("bulletin.page.lable.load_nodata"), //可选，请求完毕若没有更多数据时显示的提醒内容；
        }
    });
    prevPage();
    if (document.getElementById("shadow")) {
        document.body.removeChild(document.getElementById("shadow"));
    }
}

/**
 * 加载模板数据
 * @param result
 * @param isRefresh
 */
function renderData(result, isRefresh) {
    var pendingTPL = document.getElementById("bul_list_li").innerHTML;
    var html = cmp.tpl(pendingTPL, result);
    if (!document.getElementById("bul_list")) {
        document.getElementById("bul_listAll").innerHTML =
            '<ul class="cmp-table-view cmp-table-view-striped cmp-table-view-condensed" id="bul_list"></ul>';
    }
    if (isRefresh) { //是否刷新操作，刷新操作 直接覆盖数据
        document.getElementById("bul_list").innerHTML = html;
    } else {
        var table = document.getElementById("bul_list").innerHTML;
        document.getElementById("bul_list").innerHTML = table + html;
    }
    cmp.i18n.detect();
    document.getElementById("cmp-control").style.height = window.innerHeight + "px";
    cmp.listView("#all_bul").refresh();
}

/**
 * 列表添加点击事件
 */
function addBulletinDetailsHref() {
    cmp("#bul_list").on('tap', ".cmp-table-view-cell", function(e) {
        this.querySelector(".title").style.fontWeight = "normal";
        var param = {
            "bulId": this.getAttribute("bulId"),
            "comeFrom": "0"
        };
        var options = {};
        if(isFromM3NavBar){
            options.openWebViewCatch = 1;
        }
        saveConditions();
        cmp.href.next(_bulPath + "/html/bulView.html" + "?cmp_orientation=auto&r=" + Math.random(), param, options);
    })
}

function searchEvent() {
    cmp.event.click(_$("#search"), function() {
        if (_$("#search_container")) {
            return;
        } else {
            pageSearch(1003);
            cmp.event.click(_$("#cancel").parentNode, function() {
                page = {};
                window.setTimeout(function() {
                    reloadPage();
                }, 200);
            });
        }
    });

    // 取消重新加载页面
    cmp.event.click(_$("#cancelSearch"), function() {
        // 重置搜索条件
        page = {};
        window.setTimeout(function() {
            reloadPage();
        }, 200);
    });

    cmp.event.click(_$("#toSearch"), function() {
        var params = {};
        params.type = page.type;
        params.text = page.text;
        params.condition = page.condition;
        if (page.type == "date") {
            params.value = [page.begin, page.end];
        } else {
            params.value = page.dataSoure;
        }
        pageSearch(1003, params);
        cmp.event.click(_$("#cancel").parentNode, function() {
            page = {};
            reloadPage();
        });
    });
}

function prevPage() {
    /*if(isFromM3NavBar){
        document.getElementById("goAheadBtn").style.display = "none";
    }else{
        cmp("header").on('tap', "#goAheadBtn", function(e) {
            backFrom();
        });
    }*/
    cmp.backbutton();
    cmp.backbutton.push(backFrom);
}

function backFrom() {
    if (_getQueryString("openFrom") == "robot" || _getQueryString("backURL") == "weixin") {
        cmp.href.closePage();
        return;
    }
    if (page.condition != undefined) {
	   		page = {};
	   		reloadPage();
    } else {
        if (isFromM3NavBar){
            cmp.closeM3App();
            return;
        }else{
            cmp.href.back();
        }
    }
}

/**
 * 简化选择器
 * @param selector 选择器
 * @param queryAll 是否选择全部
 * @param 父节点
 * @returns
 */
function _$(selector, queryAll, pEl) {
    var p = pEl ? pEl : document;
    if (queryAll) {
        return p.querySelectorAll(selector);
    } else {
        return p.querySelector(selector);
    }
}

function _getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return decodeURIComponent(r[2]);
    return null; //返回参数值
}