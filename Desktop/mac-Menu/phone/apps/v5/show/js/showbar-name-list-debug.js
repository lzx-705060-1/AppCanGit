var $ShowbarNameList = {};

(function(){
	cmp.ready(function(){
		document.title = cmp.i18n("Show.page.label.chooseTopic");
	});
	var dom;
	var _ = {};
	_.Params = {
		firstLoad : true
	};
	
	/**
	 * options = {
	 * selectedId : 已选择的秀吧ID
	 * selectCallback : function(showbarId,showbarName){}
	 * },
	 * closeEvent : function(){//关闭组件的事件}
	 * */
	_.open = function(options){
		_.options = options;
		//Android手机返回按钮监听
        cmp.backbutton();
        cmp.backbutton.push(_.closeAddEvent);
		if(_.Params.firstLoad === true){
			dom = document.createElement("div");
			dom.setAttribute("id","sbnl" + cmp.buildUUID());
			dom.classList.add("Animated-Container");
			dom.classList.add("top-go");
			dom.classList.add("animated");
			dom.classList.add("sbnlDiv");
			dom.innerHTML = _content;
			document.getElementsByTagName('body')[0].appendChild(dom);
			//解决头部靠顶部的问题
			cmp.RefreshHeader();
			_.initBasicEvent();
			_.Params.firstLoad = false;
		}
		dom.classList.add('cmp-active');
		_.initPageData();
	}
	$ShowbarNameList.open = _.open;
	
	
	_.close = function(){dom.classList.remove('cmp-active');}
	$ShowbarNameList.close = _.close;
	
	_.closeAddEvent = function(){
		_.close();
		cmp.backbutton.pop();
		if(_.options.closeEvent && typeof(_.options.closeEvent) == "function"){
			_.options.closeEvent();
		}
	}
	_.initBasicEvent = function() {
		// 进页面先绑定一个返回操作，避免后续报错后无法返回
		cmp(dom).on("tap", ".sbnl-name-li", function() {
			// 选中某项主题名称之后触发
			var showbarId = this.getAttribute("showbarId");
			var showbarName = this.querySelector("span").innerHTML;
			if (_.options.selectCallback) {
				var result = _.options.selectCallback(showbarId, showbarName);
				if (result == false || result == "false") {// 返回false不做关闭操作
					return;
				}
			}
			// 关闭
			_.closeAddEvent();
		}).on("tap", ".select_theme .cmp-control-item", function() {
			// 切换页签
			var tabId = this.id;
			_.loadSbnlData(tabId);

		}).on("tap", "#sbnl_search", function() {
			cmp.search.init({
				id : "#sbnl_search",
				model : { // 定义该搜索组件用于的模块及使用者的唯一标识（如：该操作人员的登录id）搜索结果会返回给开发者
					name : "show", // 模块名，如："协同"，名称开发者自定义
					id : 40// 模块的唯一标识：
				},
				items : [ {
					type : "text",
					condition : "showbarName",
					text : cmp.i18n("Show.page.label.themename")//"主题名称"
				} ],
				callback : function(result) { // 回调函数：会将输入的搜索条件和结果返回给开发者
					var data = result.item; // 返回的搜索相关的数据
					var condition = data.condition; // 返回的搜索条件
					var dataSoure = result.searchKey[0]; // 搜索输入的数据  如果type="text",为普通文本，如果type="date":有begin和end时间属性
					var param = {};
					param[condition] = dataSoure;
					_.loadSbnlData(_.getCurrentTabId(), param);
				}
			});
		})
	}
	
	
	/** 初始化页面数据 */
	_.loadSbnlData = function(tabId,condition) {
		if(condition === undefined || condition === null){
			condition = {};
		}
		switch (tabId) {
			case "sbnl-tab-all":
				condition.searchType = "CreateNewest";
				_.initSbnlListView(condition, "sbnl-scroll-all", _.renderAllListview);
				break;
			case "sbnl-tab-myjoined":
				condition.searchType = "MyJoined";
				_.initSbnlListView(condition, "sbnl-scroll-myjoined", _.renderMyjoinedListview);
				break;
			case "sbnl-tab-mycreate":
				condition.searchType = "MyCreated";
				_.initSbnlListView(condition, "sbnl-scroll-mycreate", _.renderMycreateListview);
				break;
			default:
				condition.searchType = "CreateNewest";
				_.initSbnlListView(condition, "sbnl-scroll-all", _.renderAllListview);
				break;
		}
	}
	
	/**第一次进页面加载的页签*/
	_.initPageData = function(){
		_.loadSbnlData("sbnl-tab-all");
	}
	
	_.listViewDataFunc = function(param,option){
		$s.Shows.getShowbarList("",param,{
			success : function(result){
				option.success(result);
			},
			error :function(e){
				dealAjaxError(e);
			}
		});
	}
	
	/**通用初始化listview方法*/
	_.initSbnlListView = function(params,id,renderFunc){
		cmp.listView("#"+id, {
	        config: {
	        	isClear: true,
	            pageSize: 20,
	            params: params,
	            dataFunc: _.listViewDataFunc,
	            renderFunc: renderFunc
	        },
	        down: {
	            contentdown: cmp.i18n("Show.page.label.refresh_down"),
	            contentover: cmp.i18n("Show.page.label.refresh_release"),
	            contentrefresh: cmp.i18n("Show.page.label.refresh_ing")
	        },
	        up: {
	            contentdown: cmp.i18n("Show.page.label.load_more"),
	            contentrefresh: cmp.i18n("Show.page.label.load_ing"),
	            contentnomore: cmp.i18n("Show.page.label.load_nodata")
	        }
	    });
	}//end of _.initSbnlListView
	
	_.renderAllListview = function(result, isRefresh){
		_.renderListview(result, isRefresh,"sbnl-listview-all","sbnl-scroll-all");
	}
	
	_.renderMyjoinedListview = function(result, isRefresh){
		_.renderListview(result, isRefresh,"sbnl-listview-myjoined","sbnl-scroll-myjoined");
	}
	
	_.renderMycreateListview = function(result, isRefresh){
		_.renderListview(result, isRefresh,"sbnl-listview-mycreate","sbnl-scroll-mycreate");
	}
	
	/**渲染所有主题*/
	_.renderListview = function(result, isRefresh , listviewId,scrollId) {
		var table = dom.querySelector("#"+listviewId);
	    cmp.each(result, function(i, obj){
	    	obj.showbarName = escapeStringToHTML(obj.showbarName, true);
	    	if(obj.id === _.options.selectedId){
	    		obj.isSelected = true;
	    	}else{
	    		obj.isSelected = false;
	    	}
	    });
	    var html = cmp.tpl(_.Params.sbnl_tpl, result);
	    //是否刷新操作，刷新操作直接覆盖数据
	    if(result.length == 0){
	    	table.innerHTML = html;
	    }else if (isRefresh) {
	        table.innerHTML = html;
	    } else {
	    	cmp.append(table,html);
	    }
	    setTimeout(function(){//有意思！！！我也不知道为什么切换页签时高度会计算失误，需要做个setTimeout重新计算高度
	    	cmp.listView('#'+scrollId).refresh();
	    },200);
	    
	}//end of _.renderAllShowbar
	
	_.getCurrentTabId = function(){
		var tab = dom.querySelector(".select_theme .cmp-active");
		return tab.id;
	}

var _content =
'<div class="cmp-content position_relative">'+
'    <div class="cmp-segmented_title_content">'+
'      <div id="sbnl_search" class="position_relative">'+
'		<div class="position_relative cmp-v5-search-content foot-search-container">'+
'	   	<div class="cmp-content-title-search m1_search_title ">'+
'    	<div id="cmp_search_textHandler" class="cmp-input-row cmp-search search_handler" style="width: 100%;">'+
'        <form id="cmp-search-input" onsubmit="return false;"></form>'+
'        <input type="search" name="search" form="cmp-search-input" class="btn cmp-input-clear cmp-v5-search-textBtn" data-input-clear="1" data-input-search="1">'+
'        <span class="cmp-icon cmp-icon-clear cmp-hidden"></span>'+
'        <span class="cmp-placeholder"><span class="cmp-icon cmp-icon-search"></span><span>' +cmp.i18n("Show.page.label.search")+ '</span></span>'+
'    	</div>'+
'		</div>'+
'		</div>'+
'	   </div>'+
'    </div>'+

'    <div class="cmp-segmented-control cmp-segmented-control-inverted select_theme cmp-segmented_title_content">'+
'        <a id="sbnl-tab-all" class="cmp-control-item cmp-active" href="#sbnl-content-all"><span>' +cmp.i18n("Show.page.label.allTheme") + '</span></a>'+
'        <a id="sbnl-tab-myjoined" class="cmp-control-item" href="#sbnl-content-myjoined"><span>' +cmp.i18n("Show.page.label.attended")+ '</span></a>'+
'        <a id="sbnl-tab-mycreate" class="cmp-control-item" href="#sbnl-content-mycreate"><span>' +cmp.i18n("Show.page.label.created")+ '</span></a>'+
'    </div>'+

'    <div id="sbnl-content-all" class="cmp-control-content cmp-active">'+
'        <div id="sbnl-scroll-all" class="cmp-scroll-wrapper">'+
'            <div class="cmp-scroll ">'+
'                <div class="cursor_content showname">'+
'                    <ul class="cmp-table-view cmp-table-view-radio " id="sbnl-listview-all">'+
'                    </ul>'+
'                </div>'+
'            </div>'+
'        </div>'+
'    </div>'+
    
'    <div id="sbnl-content-myjoined" class="cmp-control-content">'+
'        <div id="sbnl-scroll-myjoined" class="cmp-scroll-wrapper">'+
'            <div class="cmp-scroll ">'+
'                <div class="cursor_content showname">'+
'                    <ul class="cmp-table-view cmp-table-view-radio " id="sbnl-listview-myjoined">'+
'                    </ul>'+
'                </div>'+
'            </div>'+
'        </div>'+
'    </div>'+
    
'    <div id="sbnl-content-mycreate" class="cmp-control-content">'+
'        <div id="sbnl-scroll-mycreate" class="cmp-scroll-wrapper">'+
'            <div class="cmp-scroll ">'+
'                <div class="cursor_content showname">'+
'                    <ul class="cmp-table-view cmp-table-view-radio " id="sbnl-listview-mycreate">'+
'                    </ul>'+
'                </div>'+
'            </div>'+
'        </div>'+
'    </div>'+
'</div>';

_.Params.sbnl_tpl = 
'<% for(var i = 0,len = this.length;i < len; i++){ %>'+
'<% var obj = this[i]; %>'+
'<li class="cmp-table-view-cell cmp-media sbnl-name-li <%if(obj.isSelected === true){%>cmp-selected<%}%>" showbarId="<%=obj.id %>">'+
'	<a class="cmp-navigate-right">'+
'		<div class="cmp-media-body cmp-ellipsis">'+
'			<span><%=obj.showbarName %></span>'+
'		</div>'+
'	</a>'+
'</li>'+
'<% } %>'+
'<%if(this.length == 0){%>'+
'<p style="text-align:center">'+cmp.i18n("Show.page.label.nodatadisplay") +'</p>'+
'<%}%>';

}());