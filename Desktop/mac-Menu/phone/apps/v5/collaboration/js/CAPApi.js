
/**
 * 
 * 加载表单
 * 
 * 
 * options :{
 *     "containerId" : "contentDiv",
 *      "moduleId" : "-7362127812663622024",
 *      "moduleType" : "1",
 *      "rightId" : "8115512080796110584.4969340451295806591",
 *      "viewState" : "1",
 *      "allowQRScan" : false,
 *      "indexParam" : "0",
 *      "affairId" : "-1",
 *      "summaryId" : "2267207702043249621",
 *      "templateType" : "infopath",
 *      "callback" : function(contentList){
 *      
 *         //数据加载完后的事件， 这里返回的是视图列表, CAP4不需要这个
 *         
 *         contentList = [ {
 *              "id" : "8908876268052958282",
 *              "content" : null,
 *              "readOnly" : false,
 *              "contentType" : "20",
 *              "createId" : "-7704680836011635710",
 *              "sort" : "1",
 *              "modifyDate" : "1514539950000",
 *              "status" : "STATUS_RESPONSE_VIEW",
 *              "contentTemplateId" : "-6113959299650272477",
 *              "createDate" : "1514539920000",
 *              "rightId" : "4969340451295806591",
 *              "moduleTemplateId" : "-1",
 *              "extraMap" : {
 *                  "showIndex" : true,
 *                  "isLightForm" : false,
 *                  "form_display" : "false",
 *                  "isNew" : true,
 *                  "advanceAuthType" : "-1",
 *                  "viewTitle" : "视图 1"
 *              },
 *              "title" : "6个视图",
 *              "moduleId" : "-1",
 *              "moduleType" : "1",
 *              "contentDataId" : "5680853535151050597",
 *              "viewState" : "1",
 *              "modifyId" : "-7704680836011635710",
 *              "editable" : true,
 *              "contentHtml" : null
 *           } ]
 *      },
 *      onChangeViewEvent : function(params){
 *          //视图切换事件
 *          params = {
 *              index : "0",//视图位置
 *              continueFn : function(){
 *                  //协同回调表单方法继续切换视图， 如果不调用这个方法， 则表单不做视图切换
 *              }
 *          }
 *      }
 * }
 *    
 * fn : function(){} 加载并且渲染完成后事件
 */
cmp.sui.loadForm(options, fn);




/**
 * 表单提交和预提交接口
 * 
 * options : {
 *   "moduleId" : "-5248595806577082340",
 *   "needCheckRule" : true,
 *   "checkNull" : true,
 *   "needCheckRepeatData" : true,
 *   
 *   "notSaveDB" : true,
 *   "rightId" : "8115512080796110584.4969340451295806591",
 *   "allowQRScan" : false,
 *   "summaryId" : "-5248595806577082340",
 *   "templateId" : "-7362127812663622024",
 *   "needSn" : false,
 *   "submitSource" : "pc"//"pc", "mobile"
 * },
 * 
 * 
 * fn : function(err, data){
 * 
 *    
 *    //CAP3返回的数据格式
 *    //====================
 *    err = {
 *       message : "有必填项"
 *    }
 *    data = {
 *       "success" : "true",
 *       "errorMsg" : "", //后台校验信息
 *       "contentAll" : {
 *           "id" : "7014727555865751384",//使用
 *           "content" : "",
 *           "contentType" : "20",//使用
 *           "createId" : "-7704680836011635710",
 *           "sort" : "0",
 *           "modifyDate" : "1514539950000",
 *           "contentTemplateId" : "-6113959299650272477",//使用
 *           "createDate" : "1514539920000",
 *           "moduleTemplateId" : "-7362127812663622024",
 *           "title" : "6个视图",
 *           "moduleId" : "-5248595806577082340",
 *           "moduleType" : "1",
 *           "contentDataId" : "5680853535151050597",//使用
 *           "modifyId" : "-7704680836011635710",
 *           "new" : false,
 *           "extraMap" : {}
 *       },
 *       "snMsg" : null
 *    }
 *     
 *    //CAP4返回的数据格式, 只有成功后才会调用这个方法
 *    //====================
 *    err = {
 *       "snInfo" : "",
 *       "content" : {
 *           "new" : false,
 *           "contentTemplateId" : "-7666026808707297511",
 *           "extraMap" : {},
 *           "modifyDate" : "2018-01-11 11:33:40",
 *           "moduleType" : "1",
 *           "modifyId" : "-7704680836011635710",
 *           "sort" : "0",
 *           "contentDataId" : "7342770586686622088",
 *           "createId" : "-7704680836011635710",
 *           "moduleTemplateId" : "-1",
 *           "id" : "-5850194528643954175",
 *           "moduleId" : "7342770586686622088",
 *           "contentType" : "20",
 *           "createDate" : "2018-01-11 11:33:40"
 *       },
 *       "isCAP4" : true
 *   }
 * },
 * 
 * error : function(){
 *    //CAP4是失败时会调用这个方法, CAP因为保持和PC一致就这样设计了
 *    //CAP3的成功和失败都是在 fn 里面
 * }
 * 
 */
cmp.sui.submit(options, fn, error);


/**
 * 是否有意见绑定项
 * @return ret boolean
 */
cmp.sui.hasEditRightOfFlowDealOption();


/**
 * 主动触发表单将缓存中的数据加载到内存中， 用于处理页面
 * 
 * options : {
 *     "moduleId" : "-5248595806577082340",
 *     "rightId" : "-1296513707776262043.1419912142899398554",
 *     "viewState" : "1"
 * }
 * 
 */
cmp.sui.loadFormDataFromCache(options);


/**
 * 
 * 清除表单缓存， 包括前端缓存和后台缓存
 * 
 * options ： 同cmp.sui.loadForm的参数
 * 
 */
cmp.sui.clearCache(options);


/**
 * 表单有没有校验通过的字段，单击外层按钮的时候，需要阻止页面跳转
 * 
 * @return ret true/false // true 阻止页面跳转
 */
cmp.sui.isPreventSubmit();


/**
 * 
 * 获取表单签章数据
 * 
 * @return data（格式后面调试看下，现在不知道）
 * 
 */
cmp.sui.getFormProtectedData();

/**
 * 
 * 容器高度变动， 通知表单重新刷新布局
 * 
 */
cmp.sui.refreshIScroll();



/**
 * 
 * 通知表单保存缓存， 应用场景： 多视图切换不需要预提交， 直接在本地取缓存
 * 
 */
cmp.sui.cacheFormData();


/**
 * 
 * 暂时没用， 多webview刷新接口
 * 
 * 通知表单进行多webview 返回
 * 
 * options :  同cmp.sui.loadForm的参数
 * fn : 刷新成功回调函数
 * 
 */
cmp.sui.refreshWhenWebViewShow(options, fn);



/**
 * 
 * 获取正文相关属性，现在只有CAP4实现了这个方法
 * 
 */
cmp.sui.getMainBodyData(key);

