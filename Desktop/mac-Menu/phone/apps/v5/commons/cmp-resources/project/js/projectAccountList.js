/**
 * author : hetao
 * 组件说明：关联项目选择组件，用于显示登录人员本单位所属的所有项目
 * 
 * 在本页面打开项目列表
 * >引入项目列表的projectAccount.js文件,通过调用projectAccount.js开放接口来打开和关闭列表
   >第二步，调用示例:
   //执行以下方法用于打开项目列表
   $ProjectAccountList.init({
	 selectedId:projectId,   //被选中的项目ID，非必填
	 eventBack : function(){ //点击项目列表的返回按钮执行的回调
	 	执行关闭项目列表页面
	 },
	 eventSelected : function(selectedId,selectedName){ //选择项目之后执行的回调
	 	回填数据
	 	执行关闭项目列表页面
	 }
	});
 */
var $ProjectAccountList = {
	cmpPath : "/seeyon/m3/cmp",
	commonsPath : "/seeyon/m3/apps/v5/commons"
};
(function(){
	var _scrollKey;  	// 可滚动区域的key 可以是id，可以是class 格式为"#listviewid" or ".listviewclass"
	var _listviewKey;	// 数据列表显示区的key 可以是id，可以是class
	var _selectedId; 	// 被选中的项目ID
	var _eventBack;     // 返回按钮事件定义
	var _eventSelected; // 选中事件定义
	var _backKey;       // 返回按钮的key
	var _listliKey;     // 每一条项目条目的key
	var _searchKey;     // 搜索组件的key
	var _dom;           // 当前页面的项目列表dom
	var option;
	
	var init = function(option){
		option = cmp.extend(option,{});
		//注册android返回按钮事件
		cmp.backbutton();
        cmp.backbutton.push(hideProject);
		initConfig(option);
		if($ProjectAccountList.loaded){
			initData();
			return;
		}
		initI18n(function(){
			initDom();
			initData();
			initDomEvents();
		});
		$ProjectAccountList.loaded = true;
	}
	var initI18n = function(callback){
		cmp.i18n.load($ProjectAccountList.commonsPath + "/i18n/","Commons",callback);
	}
	var initDom = function(){
		_dom = document.createElement("div");
		_dom.setAttribute("id","project_" + cmp.buildUUID());
		_dom.classList.add("Animated-Container");
		_dom.classList.add("right-go");
		_dom.classList.add("animated");
		_dom.classList.add("projectDiv");
		_dom.innerHTML = _content();
		document.getElementsByTagName('body')[0].appendChild(_dom);
		
		//在这里为一些重要样式加上!important防止被其他页面样式覆盖
		document.styleSheets[0].insertRule('.project_account_li input::before{font-size:22px!important}',0);
		document.styleSheets[0].insertRule('.project_account_li input{top:7px!important}',0);
		document.styleSheets[0].insertRule('#pjQueryHandler:before{z-index:1}',0);
		document.styleSheets[0].insertRule(".after-line:after{content: '';width: 100%;left: 0;bottom: 0;height: 1px;display: inline-block;position: absolute;background-color: #d4d4d4;-webkit-transform: scale(1,0.55);transform: scale(1,0.55);-webkit-transform-origin: center bottom;transform-origin: center bottom;}",0);
		document.styleSheets[0].insertRule('.project_account_li:after{height:1px!important}',0);
	}
	
	var initConfig = function(option){
		if(option.tpl){// 支持模板html自定义传入
			_tpl = option.tpl;
		}
		if(option.scrollKey){// 支持自定义listview的ky
			_scrollKey = option.scrollKey;
		}else if(_scrollKey == null){
			_scrollKey = ".project_account_scroll";
		}
		if(option.listviewKey){
			_listviewKey = option.listviewKey;
		}else if(_listviewKey == null){
			_listviewKey = ".project_account_list";
		}
		_selectedId = option.selectedId
		
		if(option.eventBack && typeof option.eventBack === "function"){
			_eventBack = option.eventBack;
		}
		if(option.eventSelected && typeof option.eventSelected === "function"){
			_eventSelected = option.eventSelected;
		}else{
			cmp.notification.alert(cmp.i18n("commons.note.integrantParameter"), function() {
				// 点击确定后的操作
			}, "error", [ cmp.i18n("commons.label.confirm") ]);
			return;
		}
		if(option.backKey){
			_backKey = option.backKey;
		}else{
			_backKey = ".project_account_back";
		}
		if(option.listliKey){
			_listliKey = option.listliKey;
		}else{
			_listliKey = ".project_account_li";
		}
		if(option.searchKey){
			_searchKey = option.searchKey;
		}else{
			_searchKey = ".project_account_search";
		}
	}
	
	var initData = function(){
		var isRefresh = false;
		try{
			newListView({},function(){//加载完成之后
				if(isRefresh == false){
					cmp.RefreshHeader(); //重新计算头部距离
					isRefresh = true;
				}
			});
		}catch(e){
			cmp.notification.alert(cmp.i18n("commons.exception.associated")+e, function() {
				if(isRefresh == false){
					cmp.RefreshHeader(); //重新计算头部距离
					isRefresh = true;
				}
			}, "error", [ cmp.i18n("commons.label.confirm") ]);
		}
	}
	
	function showProject(){
		_dom.classList.add('cmp-active'); //显示控件
	}
	
	function hideProject(){
		//情况查询框
		_dom.querySelector("#pjCondition").value = "";
		if(_dom.querySelector("#pjQueryHandler").classList.contains("cmp-active")){
			_dom.querySelector("#pjQueryHandler").classList.remove("cmp-active");
		}
		if(!_dom.querySelector("#pjClearIcon").classList.contains("cmp-hidden")){
			_dom.querySelector("#pjClearIcon").classList.add("cmp-hidden");
		}
		if(!_dom.querySelector("#pjCancelIcon").classList.contains("cmp-hidden")){
			_dom.querySelector("#pjCancelIcon").classList.add("cmp-hidden");
		}
		
		_dom.querySelector(".project_input_search").style.visibility = "hidden";
		
		_dom.classList.remove('cmp-active'); //隐藏控件
	}
	
	var reload = function(option){
		init(option,true);
	}
	
	var initDomEvents = function(){
		//返回按钮事件
		cmp(_dom).on('tap', _backKey, function(){
			if(typeof _eventBack === "function"){
				_eventBack();
			}
			hideProject();
			cmp.backbutton.pop();
		});
		//选择项目之后
		cmp(_dom).on('tap', _listliKey, function(event){
			//找到当前选中的节点，执行回调
			var selectedName = this.getAttribute("projectName");
			var selectedId = this.getAttribute("projectId");
			if(selectedId == _selectedId){
				selectedName = "";
				selectedId = "";
			}
			_eventSelected(selectedId,selectedName);
			hideProject();
		});
		//查询输入框添加事件
		_dom.querySelector("#pjQueryHandler").addEventListener("click",function(){
			if(!this.classList.contains("cmp-active")){
				this.classList.add("cmp-active");
			}
			if(_dom.querySelector("#pjCancelIcon").classList.contains("cmp-hidden")){
				_dom.querySelector("#pjCancelIcon").classList.remove("cmp-hidden");
			}
			
			this.querySelector(".project_input_search").style.visibility = "visible";
			
			_dom.querySelector("#pjCondition").focus();
		},false);
		var searchFun = function(event){
			if(event.target.value !=""){
				if(_dom.querySelector("#pjClearIcon").classList.contains("cmp-hidden")){
					_dom.querySelector("#pjClearIcon").classList.remove("cmp-hidden");
				}
			}else{
				if(!_dom.querySelector("#pjClearIcon").classList.contains("cmp-hidden")){
					_dom.querySelector("#pjClearIcon").classList.add("cmp-hidden");
				}
			}
			if(event.keyCode == 13){
				var inputValue = _dom.querySelector("#pjCondition").value;
				var param = {};
				param.projectName = inputValue;
				newListView(param);
			}
		}
		_dom.querySelector("#pjCondition").removeEventListener("keyup",searchFun);
		_dom.querySelector("#pjCondition").addEventListener("keyup",searchFun,false);
		//清除按钮事件
		_dom.querySelector("#pjClearIcon").addEventListener("click",function(){
			_dom.querySelector("#pjCondition").value = "";
			if(!_dom.querySelector("#pjClearIcon").classList.contains("cmp-hidden")){
				_dom.querySelector("#pjClearIcon").classList.add("cmp-hidden");
			}
		},false);
		//取消按钮添加事件
		var cancelFun = function(event){
			newListView();
			_dom.querySelector("#pjCondition").value = "";
			
			if(_dom.querySelector("#pjQueryHandler").classList.contains("cmp-active")){
				_dom.querySelector("#pjQueryHandler").classList.remove("cmp-active");
			}
			if(!_dom.querySelector("#pjClearIcon").classList.contains("cmp-hidden")){
				_dom.querySelector("#pjClearIcon").classList.add("cmp-hidden");
			}
			if(!_dom.querySelector("#pjCancelIcon").classList.contains("cmp-hidden")){
				_dom.querySelector("#pjCancelIcon").classList.add("cmp-hidden");
			}
			
			_dom.querySelector(".project_input_search").style.visibility = "hidden";
			
			event.stopPropagation();
		}
		_dom.querySelector("#pjCancelIcon").removeEventListener("click",cancelFun);
		_dom.querySelector("#pjCancelIcon").addEventListener("click",cancelFun,false);
		//固定头部
		cmp.HeaderFixed("#pjHeader", _dom.querySelector("#pjCondition"));
	}
		
	var newListView = function(params,callback){
		cmp.listView(_scrollKey, {
	        config: {
	        	isClear:true, // 每次重新调用cmp.listView时清空上一次listView的常量
	            pageSize: 20,
	            params: params ? params : {}, //带条件查询
	            dataFunc: getResultList,
	            renderFunc: function(result, isRefresh){
	            	renderResultList(result, isRefresh,callback);
	            }
	        },
	        down: {
	            contentdown: cmp.i18n("commons.page.action.pullDownRefresh"),
	            contentover: cmp.i18n("commons.page.action.loseRefresh"),
	            contentrefresh: cmp.i18n("commons.page.action.loseRefresh")
	        },
	        up: {
	            contentdown: cmp.i18n("commons.page.action.loadMore"),
	            contentrefresh: cmp.i18n("commons.page.state.refreshing"),
	            contentnomore: cmp.i18n("commons.page.state.noMore")
	        }
	    });
	    //关联项目DIV从右侧滑动展示，要等待关联项目DOM加载完成后再添加cmp-active样式
	    showProject();
	}
	
	var getResultList = function(param,options){
		
		
		var initProjectList = function(){
			var pageNo = param["pageNo"];
	    	var pageSize = param["pageSize"];
	    	
	    	$s.Projects.findProjectList({pageNo : pageNo,pageSize : pageSize},param,{
				success : function(result){
					if(result == null){
						 cmp.notification.alert(cmp.i18n("commons.exception.request"), function() {
								// 点击确定后的操作
						 }, "error", [ cmp.i18n("commons.label.confirm") ]);
						 return;
					 }
					 
					 if(result.data == null || result.data.length < pageSize){
						 result.total = pageNo*pageSize - 1;
					 }else{
						//这样写的目的是为了告诉cmp.listview还有更多数据，允许下拉
						 result.total = pageNo*pageSize + 1;
					 }
					 
					 //循环结果集，增加选中的代码
					 var resultData = result.data;
					 if(resultData != null && resultData.length > 0){
						 for(var i=0;i<resultData.length;i++){
							 var projectId = resultData[i].id;
							 if(_selectedId == projectId){
								 resultData[i].selected = true;
							 }
							 //将字符串转换成HTML代码
							 resultData[i].projectName = escapeStringToHTML(resultData[i].projectName,true);
						 }
					 }
					 
					 options.success(result);
				}
			});
		}
		
	    if($s && $s.Projects){
			initProjectList();
	    }else{
	    	cmp.asyncLoad.js([$ProjectAccountList.commonsPath + "/js/project-jssdk.js"],function(){
	    		initProjectList();
	    	});
	    }
	}
	
	var renderResultList = function(result, isRefresh, callback){
		var queryString = _dom.querySelector("#pjCondition").value;
		if(queryString){
			renderProjectName(result,queryString);
		}
		var html = cmp.tpl(_tpl(), result);
		var listview = _dom.querySelector(_listviewKey);
	    if (result.length > 0) {
		    if (isRefresh) {
		    	//是否刷新操作，刷新操作 直接覆盖数据
		    	listview.innerHTML = html;
		    } else {
		    	//不刷新则追加数据
		    	cmp.append(listview,html);
		    }
	    } else {
	    	//TODO 数据为空考虑放成模板
	    	//listview.innerHTML = "<div class=\"Up_Cover null\"><p><span class=\"text\">没有任何数据哦</span></p></div>";
	    }
	    if(callback && typeof(callback) == "function"){
	    	callback(); //结束的回调
	    }
	}
	
	var renderProjectName = function(dataList,queryString){
		cmp.each(dataList,function(i,v){
			if(v.projectName.indexOf(queryString) != -1){
				v.projectName4Show = v.projectName.replace(queryString,'<span style = "color : blue">' + queryString + '</span>');
			}else{
				v.projectName4Show = v.projectName;
			}
		});
	}
		
	/** 对外开放方法、参数start */
	$ProjectAccountList.init = init;
	$ProjectAccountList.reload = reload;
	/** 对外开放方法、参数end */
	
	var _content = function(){
		return '<header id = "pjHeader" class="cmp-bar cmp-bar-nav cmp-flex-header after-line">'+
				'	<div class="cmp-action-back cmp-header-left project_account_back">'+
				'   	<span class="cmp-icon see-icon-v5-common-arrow-back" style="color:#3aadfb!important"></span>'+
				'       <span class="nav-text" style="font-size:16px;color:#3aadfb!important">'+cmp.i18n("commons.label.goBack")+'</span>'+
				'	</div>'+
				'   <div class="cmp-title">'+
				'		<h1 class="cmp-title index-title" style="font-size:16px;">'+cmp.i18n("commons.title.associated")+'</h1>'+
				'	</div>'+
				'	<div class="cmp-header-right"></div>'+
				'</header>'+
				'<div class="cmp-content position_relative" style="height:100%;background-color:#fff;margin:8px 0;">'+
				'	<div class="cmp-segmented_title_content" style="background-color:#fff">'+
				'		<div class="project_account_search position_relative">' +
				'			<div id = "pjQueryHandler" class="cmp-indexed-list-search cmp-input-row cmp-search">' +
				'				<div class="project_input_search position_relative" style="width: 85%;display: inline-block;visibility: hidden;">' +
				'					<form action="#" onsubmit = "return false;">' +				
				'						<input id = "pjCondition" type="search" class="cmp-input-clear cmp-indexed-list-search-input" style="background-color:#f2f2f2">' +
				'					    <span id = "pjClearIcon" class="cmp-icon cmp-icon-clear cmp-hidden"></span> ' +
				'					</form>' +
				'				</div>' +
				'				<span id = "pjCancelIcon" class="project_cancel cmp-hidden" style="display: inline-block;text-align: center;width: 12%;color: #666;">'+cmp.i18n("commons.label.cancel")+'</span>' +
				' 				<div class="cmp-placeholder" contenteditable="true" style="background:#f2f2f2;margin:0 10px">' +
				'					<span class="cmp-icon cmp-icon-search"></span>' +
				'					<span>'+cmp.i18n("commons.label.search")+'</span>' +
				'				</div>' +
				'			</div>'+
				'		</div>'+
				'	</div>'+
				'	<div class="cmp-control-content cmp-active">'+
				'		<div class="project_account_scroll cmp-scroll-wrapper">'+
				'			<div class="cmp-scroll">'+
				'				<ul id = "pjList" class="project_account_list cmp-table-view " style = "margin-top:0"></ul>'+
				'			</div>'+
				'		</div>'+
				'	</div>'+
				'</div>';
	}
	
	
	var _tpl = function(){
		return '\<\% for(var i = 0,len = this.length;i < len; i++){ \%\>'+
				'    \<\% var obj = this[i]; \%\>'+
				'	<li class="project_account_li cmp-table-view-cell cmp-media" projectId="\<\%=obj.id \%\>" projectName = "\<\%=obj.projectName\%\>">'+
				'		<div class="cmp-input-row cmp-radio cmp-left cmp-ellipsis">' +
				'			<label style="color:#000;font-size:17px">\<\%if(obj.projectName4Show){\%\>\<\%=obj.projectName4Show\%\>\<\%}else{\%\>\<\%=obj.projectName\%\>\<\%}\%\></label>' +
				'			<input name="radio" type="radio" \<\%if(obj.selected){\%\>checked\<\%}\%\>>' +
				'		</div>	'+
				'   </li>'+
				'    \<\% } \%\>'+
				'	\<\%if(this.length == 0){\%\>'+
				'	<p style="text-align:center">'+cmp.i18n("commons.note.noData")+'</p>'+
				'	\<\%}\%\>';
	}
})(window,document);
