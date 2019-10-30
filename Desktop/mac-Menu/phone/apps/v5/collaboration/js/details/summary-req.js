/**
 *  协同详细页面，全局变量定义，和首屏加载请求
 */
var pageX = {
        toggleLableCount : 0,//附言等可点击栏目数量
        viewsLenth : 0,//是否有表单多视图页签
        officeIdex : -1,//office正文索引
        isComentShow : false, //附言区域是否可见
        viewScroll : null,
        viewItemWidth : 0,//多视图滚动时， 单个页签的宽度
        viewCtWidth : 0,//多视图容器宽度
        viewWidth : 0,//多视图全部宽度
        viewMax : 4,//表单多视图最大平铺数量
        viewCanEdit : true,
        editWorkflow : false,//是否编辑了流程图
        cache : {
            "signetDom" : "", //签章显示dom
            "signetFieldDom" : "",//签章字段dom
            "isLightForm" : null,//当前展示的表达状态
            "isFormForward" : false,//是否是转发表单
            "formIndex" : "0",//表单多视图index
            "focusOffice" : false,//表单Office正文位置
            "scollLeft" : 0,//表单多视图滚动定位
            "viewLight" : {}//多视图，轻/原表单状态缓存
        },
        initContent : false,
        winParams : {},//页面初始化参数
        contentHeight : 0,//正文显示区域高度
        exeLock : false,//重复操作标记
        lockFormInt : 0,//轮循表单锁记录
        isInitError : false,//标记首屏加载是否有错误
        isFromURLData : false//是否是通过URL方式传参的
};

var signatureId = "";//这是一个全局变量, 另外的js会进行赋值
var _isContentInit = false;
var _storge_key = CollCacheKey.summary.detail;
var summaryBO;//防止页面引用报错

//重复提交标识
var _summaryRepeatClk = false;

/**
 * 获取初始化参数，兼容url传参和和CMP方式传参
 */
function _initParamData(){
    
    var initParam;
    
    //页面需要的参数
    pageX.winParams = {
        "openFrom" : "listPending",
        "affairId" : "-1",
        "summaryId" : "-1",
        "pigeonholeType" : "",//归档类型， 非必传
        "operationId" : "",//表单权限ID，非必传
        "backIndex" : 0,//向前返回页面数量
        "fromXz" : false,//特殊处理，加一个参数表示从语音小志进入的协同
        "docResId" : "",//文档ID，用于权限验证 
        "baseObjectId" : "",// 关联文档属于的数据ID
        "baseApp" : "",//关联文档属于的数据所在的模块
        "taskId" : "",//任务ID
        "designId" : ""// cap4查询ID
    };
    
    initParam = cmp.href.getParam();
    if(CollUtils.isEmptyObj(initParam)){
        pageX.isFromURLData = true;
        initParam = CollUtils.getHrefQuery();
    }
    
    if(CollUtils.isEmptyObj(initParam)){
        return false;
    }
    
    //数据合并
    for(var key in pageX.winParams)
        if(initParam[key])
            pageX.winParams[key] = initParam[key]; 
            
    
    //summaryID 特殊处理
    if(pageX.winParams["summaryId"] == "-1" && initParam["moduleId"])
        pageX.winParams["summaryId"] = initParam["moduleId"];
    
    var cacheSuffix = pageX.winParams["openFrom"] + pageX.winParams["summaryId"] + pageX.winParams["affairId"];
    
    pageX.winParams.cache_subfix = cacheSuffix;
    _storge_key = _storge_key + cacheSuffix;
    
    //请求参数
    pageX.requestParam = {
        "pigeonholeType" : pageX.winParams["pigeonholeType"],
        "operationId" : pageX.winParams["operationId"],
        "docResId" : pageX.winParams["docResId"],
        "baseObjectId" : pageX.winParams["baseObjectId"],
        "baseApp" : pageX.winParams["baseApp"],
        "taskId" : pageX.winParams["taskId"],
        "designId" : pageX.winParams["designId"]
    }
    
    return true;
}

/**
 * 加载首屏缓存
 */
function _loadSummaryCache(){
  //缓存加载
    window.summaryBO = CollUtils.loadCache(CollCacheKey.summary.summaryBO + pageX.winParams.cache_subfix, true);
    pageX.cache = CollUtils.loadCache(_storge_key, true) || pageX.cache;
    if(window.summaryBO) {
        signatureId = window.summaryBO.signatureId || "";
        return true;
    }
    return false;
}


//校验首屏参数
var paramCheck = _initParamData();

if(paramCheck){
    
    var url = "coll/summary/" +pageX.winParams["openFrom"] + "/" +pageX.winParams["affairId"] + "/" +pageX.winParams["summaryId"];
    url += "?option.n_a_s=1";
    
    //拼接请求参数
    url += CollUtils.transObj2Url(pageX.requestParam, "&", true, "")
    
    
  //发送首屏请求
    FastUtil.addFast({
        "code" : "fast_summary",
        "loadCache" : _loadSummaryCache,
        "setting" : {
            "url" : url,
            "method" : "GET"
        }
    });
}