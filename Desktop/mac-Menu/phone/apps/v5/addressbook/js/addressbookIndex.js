var page = {};
var pageCondition = {
    accountId:"",
    pageType:"",//0-单位 1-部门 2-搜索
    listType:"",//除去搜索，最后一次展现的列表的类型 Account/Department
    listId:"",//除去搜索，最后一次展现的列表的orgId
    text:"", //搜索的关键词
    height:""
};
var isInner = true;
var pathStack = new Stack();
var scrollObj;
var urlParam = getUrlParam();
cmp.ready(function() {
    checkInner();
    loadConditions();
    _bindAddressbookSearch();
    pageCondition.height = window.innerHeight + "px";

    if(isInner){
        cmp("#selectAccountDiv").on('tap', ".add-list-group", function(e) {
            loadAccounts();
        });
    }

    cmp("#pathZone").on('tap', ".prevPath", function(e) {
        var id = this.getAttribute("orgId");
        var type = this.getAttribute("orgType");

        if(type == "Account"){
            switchPageMode(0);
            loadSubDeptOfAccount(id);
        }else{
            loadSubDeptInfo(id);
        }
    });

    if(pageCondition.pageType === 0) {
        loadSubDeptOfAccount(pageCondition.listId);
    }else if(pageCondition.pageType === 1) {
        loadSubDeptInfo(pageCondition.listId)
    }else if(pageCondition.pageType === 2) {
        loadSearchResult();
    }else {
        $s.Addressbook.currentAccount("",{
		//$s.Addressbook.currentUser("",{
            success: function (rv) {
                urlParam = {};
                urlParam.accountId = rv.i;
                loadSubDeptOfAccount(urlParam.accountId);
            }
        });
    }
    bindListCellClick();

    headerShowOrNot();
    prevPage();
    // cmp("header").on('tap', "#prev", function(e) {
    //     backFrom();
    // });
    setTimeout(function () {
        _$(".cmp-placeholder").addEventListener("tap",function () {
            _$("#searchInput").focus();
        })
    },300);

    scrollObj = new cmp.iScroll('.add-list-see', {
        hScroll: true,
        vScroll: false
    });
});

function setWaterMark(result, id){
	if(result.waterMarkEnable && result.waterMarkEnable == "true"){
		var data = {};
		if(result.waterMarkName){
			data.userName = result.waterMarkName;
		}
		if(result.waterMarkDeptName){
			data.department = result.waterMarkDeptName;
		}
		if(result.waterMarkTime){
			data.date = result.waterMarkTime;
		}
		var imgUrl = cmp.watermark(data).toBase64URL();
		document.getElementById(id).style.backgroundImage = "url("+imgUrl+")";
		document.getElementById(id).style.backgroundRepeat = "repeat";
		document.getElementById(id).style.backgroundSize = "150px 75px"; 
		document.getElementById(id).style.backgroundColor = "#fff";
	}
}

function searchFun(){
    var text = document.getElementById("searchInput").value;
    document.getElementById("searchInput").blur();
    if(text != null && text != "" && typeof text !="undefined"){
        pageCondition.text = text;
        loadSearchResult();
    }else{
        pageCondition.text = "";
        if(pageCondition.listType == "Account"){
            loadSubDeptOfAccount(pageCondition.listId);
        }else if(pageCondition.listType == "Department"){
            loadSubDeptInfo(pageCondition.listId);
        }else{
            loadSubDeptOfAccount(pageCondition.accountId)
        }
    }
}
function reloadPage() {
    // 搜索条件
    // cmp.backbutton.pop();
    loadData(true);
}



//从缓存中读取页面状态
function loadConditions(){
    var temp = cmp.storage.get("pageCondition",true);
    if(temp){
        pageCondition = eval('('+temp+')');
        cmp.storage.delete("pageCondition",true);
    }
}
//向缓存中写入页面状态
function saveConditions(){
    cmp.storage.save("pageCondition",cmp.toJSON(pageCondition),true);
}
function delConditions(){
    cmp.storage.delete("pageCondition",true);
}
function loadSubDeptOfAccount(accountId){
    // cmp.dialog.loading();
    document.getElementById("shadowDiv").style.display = "block";
    cmp.listView("#addressBookList", {
        config: {
            captionType:0,
            height: 60,//可选，下拉状态容器高度
            pageSize: 20,
            params: {},
            crumbsID: "#all_bul" + cmp.buildUUID(),
            renderFunc: renderData,
            dataFunc: function(params,option){  //请求数据的函数
                params.accId = accountId;
                $s.Addressbook.getSubDeptOfAccount(accountId, params, {
                    success: function (rv) {
                        var listData = {};
                        listData.data = rv.children;
                        listData.total = rv.total;
                        listData.pageSize = params.pageSize;
                        listData.pageNo = params.pageNo;

                        pageCondition.listType = "Account";
                        pageCondition.listId = accountId;
                        pageCondition.accountId = accountId;
                        pageCondition.text = "";
                        switchPageMode(0);

                        var accountObj ={};
                        accountObj.id = rv.id;
                        accountObj.name = rv.name;
						accountObj.existLogo = rv.existLogo;
						accountObj.logoUrl = rv.logoUrl;
                        createAccountSelect(accountObj);
                        option.success(listData);
                        document.getElementById("pathZone").innerHTML = "";
                        if(rv.total >0) {
                            setWaterMark(rv, "addressBook_listUl");
                        }
                        // cmp.dialog.loading(false);
                        document.getElementById("shadowDiv").style.display = "none";
                    }
                });
            },
            isClear: true
        },
        down: {
            contentdown: cmp.i18n("addressBook.page.lable.refresh_down"), //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
            contentover: cmp.i18n("addressBook.page.lable.refresh_release"), //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
            contentrefresh: cmp.i18n("addressBook.page.lable.refresh_ing"), //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
        },
        up: {
            contentdown: cmp.i18n("addressBook.page.lable.load_more"), //可选，在上拉可刷新状态时，上拉刷新控件上显示的标题内容
            contentrefresh: cmp.i18n("addressBook.page.lable.load_ing"), //可选，正在加载状态时，上拉加载控件上显示的标题内容
            contentnomore: cmp.i18n("addressBook.page.lable.load_nodata"), //可选，请求完毕若没有更多数据时显示的提醒内容；
        }
    });
    //cmp.listView("#addressBookList").refreshInitData();
}
function loadSubDeptInfo(detpId){
    // cmp.dialog.loading();
    document.getElementById("shadowDiv").style.display = "block";
    cmp.listView("#addressBookList", {
        config: {
            captionType:0,
            height: 60,//可选，下拉状态容器高度
            pageSize: 20,
            params: {},
            crumbsID: "#all_bul" + cmp.buildUUID(),
            renderFunc: renderData,
            dataFunc: function(params,option){  //请求数据的函数
                params.dId = detpId;
                $s.Addressbook.getSubDeptInfo(detpId, params, {
                    success: function (rv) {
                        var listData = {};
                        listData.data = rv.children;
                        listData.total = rv.total;
                        listData.pageSize = params.pageSize;
                        listData.pageNo = params.pageNo;

                        pageCondition.listType = "Department";
                        pageCondition.listId = detpId;
                        pageCondition.text = "";
                        var pathZone = document.getElementById("pathZone");
                        pathZone.style.width = "9999px";
                        switchPageMode(1);
                        createPathDiv();

                        option.success(listData);
                        if(rv.total >0){
                            setWaterMark(rv, "addressBook_listUl");
                        }
                        // cmp.dialog.loading(false);
                        document.getElementById("shadowDiv").style.display = "none";
                    }
                });
            },
            isClear: true
        },
        down: {
            contentdown: cmp.i18n("addressBook.page.lable.refresh_down"), //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
            contentover: cmp.i18n("addressBook.page.lable.refresh_release"), //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
            contentrefresh: cmp.i18n("addressBook.page.lable.refresh_ing"), //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
        },
        up: {
            contentdown: cmp.i18n("addressBook.page.lable.load_more"), //可选，在上拉可刷新状态时，上拉刷新控件上显示的标题内容
            contentrefresh: cmp.i18n("addressBook.page.lable.load_ing"), //可选，正在加载状态时，上拉加载控件上显示的标题内容
            contentnomore: cmp.i18n("addressBook.page.lable.load_nodata"), //可选，请求完毕若没有更多数据时显示的提醒内容；
        }
    });
    //cmp.listView("#addressBookList").refreshInitData();
}

function loadSearchResult(){
    var searchText = pageCondition.text;
    if(searchText == ""){
        loadSubDeptOfAccount(pageCondition.listId);
    }else{
        // cmp.dialog.loading();
        document.getElementById("shadowDiv").style.display = "block";
        cmp.listView("#addressBookList", {
            config: {
                captionType:0,
                height: 60,//可选，下拉状态容器高度
                pageSize: 20,
                params: {},
                crumbsID: "#all_bul" + cmp.buildUUID(),
                renderFunc: renderData,
                dataFunc: function(params,option){  //请求数据的函数
                    params.accId = pageCondition.accountId;
                    params.key = searchText;
                    params.type = "Name,Telnum";
                    SeeyonApi.Rest.post('addressbook/searchMember?pageNo='+params.pageNo+'&pageSize='+params.pageSize,'',params,{
                        success: function (rv) {
                            var listData = {};
                            listData.data = rv.children;
                            listData.total = rv.total;
                            listData.pageSize = params.pageSize;
                            listData.pageNo = params.pageNo;
                            switchPageMode(2);

                            option.success(listData);
                            if(rv.total >0){
                                setWaterMark(rv, "addressBook_listUl");
                            }
                            // cmp.dialog.loading(false);
                            document.getElementById("shadowDiv").style.display = "none";
                        }
                    });
                    // $s.Addressbook.searchMember("", params, {
                    //     success: function (rv) {
                    //         var listData = {};
                    //         listData.data = rv.children;
                    //         listData.total = rv.total;
                    //         listData.pageSize = params.pageSize;
                    //         listData.pageNo = params.pageNo;
                    //         switchPageMode(2);
                    //
                    //         option.success(listData);
                    //         setWaterMark(rv, "addressBook_listUl");
                    //     }
                    // });
                },
                isClear: true
            },
            down: {
                contentdown: cmp.i18n("addressBook.page.lable.refresh_down"), //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
                contentover: cmp.i18n("addressBook.page.lable.refresh_release"), //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
                contentrefresh: cmp.i18n("addressBook.page.lable.refresh_ing"), //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
            },
            up: {
                contentdown: cmp.i18n("addressBook.page.lable.load_more"), //可选，在上拉可刷新状态时，上拉刷新控件上显示的标题内容
                contentrefresh: cmp.i18n("addressBook.page.lable.load_ing"), //可选，正在加载状态时，上拉加载控件上显示的标题内容
                contentnomore: cmp.i18n("addressBook.page.lable.load_nodata"), //可选，请求完毕若没有更多数据时显示的提醒内容；
            }
        });
        //cmp.listView("#addressBookList").refreshInitData();
    }
}

function loadAccounts(){
    // cmp.dialog.loading();
    document.getElementById("shadowDiv").style.display = "block";
    cmp.listView("#addressBookList", {
        config: {
            captionType:0,
            height: 60,//可选，下拉状态容器高度
            pageSize: 20,
            params: {},
            crumbsID: "#all_bul" + cmp.buildUUID(),
            renderFunc: renderSelectData,
            dataFunc: function(params,option){  //请求数据的函数
                $s.Addressbook.childAccounts(-1, params, {
                    success: function (rv) {
                        var listData = {};
                        listData.data = rv.children;
                        listData.total = rv.total;
                        listData.pageSize = params.pageSize;
                        listData.pageNo = params.pageNo;
                        switchPageMode(100);

                        option.success(listData);
                        if(rv.total >0){
                            setWaterMark(rv, "addressBook_listUl");
                        }
                        // cmp.dialog.loading(false);
                        document.getElementById("shadowDiv").style.display = "none";
                    }
                });
            },
            isClear: true
        },
        down: {
            contentdown: cmp.i18n("addressBook.page.lable.refresh_down"), //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
            contentover: cmp.i18n("addressBook.page.lable.refresh_release"), //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
            contentrefresh: cmp.i18n("addressBook.page.lable.refresh_ing"), //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
        },
        up: {
            contentdown: cmp.i18n("addressBook.page.lable.load_more"), //可选，在上拉可刷新状态时，上拉刷新控件上显示的标题内容
            contentrefresh: cmp.i18n("addressBook.page.lable.load_ing"), //可选，正在加载状态时，上拉加载控件上显示的标题内容
            contentnomore: cmp.i18n("addressBook.page.lable.load_nodata"), //可选，请求完毕若没有更多数据时显示的提醒内容；
        }
    });
    //cmp.listView("#addressBookList").refreshInitData();
}
/**
 * 加载模板数据
 * @param result
 * @param isRefresh
 */
function renderData(result, isRefresh) {
    var pendingTPL = document.getElementById("addressBookRow").innerHTML;
    var html = cmp.tpl(pendingTPL, result);
    if (!document.getElementById("addressBook_listUl")) {
        document.getElementById("listDiv").innerHTML = '<ul class="cmp-table-view cmp-table-view-striped cmp-table-view-condensed" id="addressBook_listUl"></ul>';
    }
    if (isRefresh) { //是否刷新操作，刷新操作 直接覆盖数据
        document.getElementById("addressBook_listUl").innerHTML = html;
    } else {
        var table = document.getElementById("addressBook_listUl").innerHTML;
        document.getElementById("addressBook_listUl").innerHTML = table + html;
    }
    cmp.i18n.detect();
    document.getElementById("cmp-control").style.height = pageCondition.height;
    cmp.listView("#addressBookList").refresh();
    // bindListCellClick();
}
/**
 * 加载选择单位列表数据
 * @param result
 * @param isRefresh
 */
function renderSelectData(result, isRefresh) {
    var pendingTPL = document.getElementById("createAccountSelectList").innerHTML;
    var html = cmp.tpl(pendingTPL, result);
    if (!document.getElementById("addressBook_listUl")) {
        document.getElementById("listDiv").innerHTML = '<ul class="cmp-table-view cmp-table-view-striped cmp-table-view-condensed" id="addressBook_listUl"></ul>';
    }
    if (isRefresh) { //是否刷新操作，刷新操作 直接覆盖数据
        document.getElementById("addressBook_listUl").innerHTML = html;
    } else {
        var table = document.getElementById("addressBook_listUl").innerHTML;
        document.getElementById("addressBook_listUl").innerHTML = table + html;
    }
    cmp.i18n.detect();
    document.getElementById("cmp-control").style.height = pageCondition.height;
    cmp.listView("#addressBookList").refresh();
    //bindSelectAccountCellClick();
}

function createAccountSelect(accountObj){
    var content = document.getElementById("createAccountSelect").innerHTML;
    var htmlStr = cmp.tpl(content, accountObj);
    document.getElementById("selectAccountDiv").innerHTML = htmlStr;

}
function createPathDiv(){
    var content = document.getElementById("createPath").innerHTML;
    var nowId = pageCondition.listId;
    $s.Addressbook.getDeptPath(nowId, "", {
        success: function (rv) {
            var pathZone = document.getElementById("pathZone");
            pathZone.style.width = "9999px";
            var allPath = rv.children;
            var htmlStr = cmp.tpl(content, allPath);
            pathZone.innerHTML = htmlStr;
            var spanList = pathZone.getElementsByTagName("span");
            var totalWidth = 0;
            for(var i = 0;i<spanList.length;i++){
                var tempSpan = spanList[i];
                totalWidth += tempSpan.offsetWidth;
                totalWidth += 5;
            }
            pathZone.style.width = totalWidth +"px";

            // var scrollObj = cmp.scrollBox(".add-list-see",true);
            // scrollObj.scrollTo(-99999, 0, 0);
            if(!scrollObj){
                scrollObj = new cmp.iScroll('.add-list-see', {
                    hScroll: true,
                    vScroll: false
                });
            }
            scrollObj.refresh();
            scrollObj.scrollTo(-scrollObj.scrollerW,0);
        }
    });




    }
/**
 * 列表添加点击事件
 */
function bindListCellClick() {
    cmp("#addressBook_listUl").on('tap', "li", liClickEvent);
}
/**
 * 列表添加点击事件
 */
function bindSelectAccountCellClick() {
    cmp("#addressBook_listUl").on('tap', "li", function(e) {
        var orgId = this.getAttribute("orgId");
            loadSubDeptOfAccount(orgId);
    });
}

function liClickEvent(){
    var orgId = this.getAttribute("orgId");
    var orgType = this.getAttribute("orgType");
    if(orgType == "account"){
        loadSubDeptOfAccount(orgId);
    }
    if(orgType == "dept"){
        loadSubDeptInfo(orgId);
    }
    if(orgType == "member"){
        var param = {
            "memberId": orgId,
            "comeFrom": "0",
            "pageInfo": _getCurrentPageInfo()
        };
        saveConditions();
        cmp.href.next(_addressbookPath + "/html/addressbookView.html", param);
    }
}
/**
 * 取第一个字
 * @param str
 * @param len
 * @returns {string}
 */
function getTitleChar(str){
    charCode = str.charCodeAt(0);
    if(charCode>=0&&charCode<128){
        return str.substr(0,2);
    }
    return str.substr(0,1);
}
/**
 * 取色
 * @param str
 * @param len
 * @returns {string}
 */
function getRandomColor(str){
    var code = str.charCodeAt(0);
    var result = code % 10;
    var r = (result * 5201314)%255;
    var g = (result * 19777)%255;
    var b = (result * 77777)%255;
    return r + ","+ g + "," + b;
}

/**
 * 获取当前页面信息,用于页面返回使用
 * @returns {{url: string}}
 * @private
 */
function _getCurrentPageInfo(){
    var _thisPage = {
        "url" : _addressbookPath + "/html/addressbookIndex.html",
    };
    return _thisPage;
}

/**
 * 返回事件
 */
function prevPage() {
    delConditions();
    //安卓手机返回按钮监听！
    cmp.backbutton();
    cmp.backbutton.push(backFrom);
}

/**
 * 根据平台判断header是否隐藏
 */
function headerShowOrNot() {
    // if (cmp.platform.wechat) { //是微信浏览器
    //     cmp.headerHide();
    // } else { //不是微信浏览器
    // }
    if(document.getElementById("shadow")){
        document.body.removeChild(document.getElementById("shadow"));
    }
}

function backFrom() {
    prevPage();
    if(pageCondition.pageType === 0 || pageCondition.pageType === 1){
        backStack();
    }else if(pageCondition.pageType === 2){
        pageCondition.text = "";
        if(pageCondition.listType == "Account"){
            loadSubDeptOfAccount(pageCondition.listId);
        }else if(pageCondition.listType == "Department"){
            loadSubDeptInfo(pageCondition.listId);
        }else{
            loadSubDeptOfAccount(pageCondition.accountId)
        }
    }else if(pageCondition.pageType === 100){
        loadSubDeptOfAccount(pageCondition.listId);
    }
}
function backStack(){
    var prevList = document.getElementsByClassName("prevPath");
    if(prevList.length>0){
        var prev = prevList[prevList.length-1];
        var id = prev.getAttribute("orgId");
        var type = prev.getAttribute("orgType");

        if(type === "Account"){
            switchPageMode(0);
            loadSubDeptOfAccount(id);
        }else{
            loadSubDeptInfo(id);
        }
    }else{
        cmp.href.back();
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

/**
 * 获取url传递的参数
 * @returns
 */
function getUrlParam() {
    return urlParam = cmp.href.getParam();
}

/**
 *
 * @param type 0-为单位下 1-为部门 2-为搜索
 */
function switchPageMode(type){
    pageCondition.pageType = type;
    if(type == 0){
        document.getElementById("addressBookList").style.marginTop = "110px";
        document.getElementById("searchDiv").style.display = "block";
        document.getElementById("jumpToGroupDiv").style.display = "none";
        document.getElementById("selectAccountDiv").style.display = "block";
    }
    if(type == 1){
        document.getElementById("addressBookList").style.marginTop = "110px";
        document.getElementById("searchDiv").style.display = "block";
        document.getElementById("jumpToGroupDiv").style.display = "block";
        document.getElementById("selectAccountDiv").style.display = "none";

    }
    if(type == 2){
        document.getElementById("searchDiv").style.display = "block";
        document.getElementById("jumpToGroupDiv").style.display = "none";
        document.getElementById("selectAccountDiv").style.display = "none";
        document.getElementById("addressBookList").style.marginTop = "60px";
    }
    if(type == 100){
        document.getElementById("searchDiv").style.display = "none";
        document.getElementById("jumpToGroupDiv").style.display = "none";
        document.getElementById("selectAccountDiv").style.display = "none";
        document.getElementById("addressBookList").style.marginTop = "0px";
    }
}

/**
 * 调接口 获取人员信息
 */
function checkInner() {
    $s.Addressbook.currentUser(null, {
        success: function (personInfo) {
            isInner = (personInfo.inner==1);
        },
        error: function (error) {
        }
    });
}

/**
 * 以下为模拟栈
 * @constructor
 */
function Stack() {
    this.dataStore = [];//保存栈内元素
    this.top = 0;
}
Stack.prototype={
    /**
     * 压栈 添加一个元素并将top+1
     * @param element
     */
    push:function push(element) {
        this.dataStore[this.top++] = element;
    },
    /**
     * 出栈 返回栈顶元素并将top-1
     * @returns {*}
     */
    pop:function pop() {
        return this.dataStore[--this.top];
    },
    /**
     * 返回栈顶元素
     * @returns {*}
     */
    peek:function peek() {
        return this.dataStore[this.top-1];
    },
    /**
     * 将top归0
     */
    clear:function clear() {
        this.top = 0;//将top归0
    },
    /**
     * 返回栈内的元素个数
     * @returns {number}
     */
    length:function length() {
        return this.top;
    },
    /**
     * 看栈内容
     * @returns {Array}
     */
    getData:function getData() {
       return this.dataStore;
    }

};

function _bindAddressbookSearch() {
    document.getElementById("searchInput").addEventListener("keydown",function(event){
        if(event.keyCode == "13") {
            searchFun();
        }
    });
}