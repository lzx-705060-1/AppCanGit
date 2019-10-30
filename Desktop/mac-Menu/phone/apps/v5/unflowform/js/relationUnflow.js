var configData={data:[]};
var showType="2";
var inputType="";
var fieldType="";
var currId="";
var params;
var listfields={};
var tablefields={};
var searhInfo=[];//搜索信息
var allowLock=false; //加锁权限
var listvalue={}; //下拉值列表
var clearCache=false;
var crumbsID=1;
var userOrderBy=[];
var filter;
var toFormBean;
var tblist;
cmp.ready(function(){
    cmp.backbutton();

    document.getElementById("cmp-segmented_title_content").style.display="none";
    configData.ip = cmp.origin;
    params=cmp.href.getParam();
    //if(params.pageParams){
    //    params=params.pageParams;
    //}
    params.formTemplateId='0';
    params.type="formRelation";
    if(cmp.storage.get("unflowList_clearCache",true)){
        clearCache=cmp.storage.get("unflowList_clearCache",true);
    }
    if(cmp.storage.get("crumbsID",true)){
        crumbsID=cmp.storage.get("crumbsID",true);
    }
    params.isMobile=false;
    getConfig();
    bindEvent();
});
function getConfig(){
    $s.UnflowForm.getUnFlowDataList({}, params, {
        repeat:true,   //当网络掉线时是否自动重新连接
        success : function(ret) {
            if (ret.success) {
                params.moduleType=ret.moduleType;
                toFormBean=JSON.parse(ret.toFormBean);
                params.toFormBean=toFormBean;
                params.rightId=ret.firstRightId;



                configData.author=ret.auth;
                cmp.each(configData.author,function(i,obj) {
                    obj.id=i;
                    if (obj.name == "allowlock") {
                        allowLock = true;
                    }else if(obj.name == "add"){
                       // configData.author.splice(i,1);
                    }
                });

                configData.search=ret.searchField;
                if(configData.search.length>0){
                    document.getElementById("cmp-segmented_title_content").style.display="block";
                    document.querySelector('.cmp-scroll-wrapper').style.top=document.getElementById('cmp-segmented_title_content').offsetHeight+ document.querySelector('.data-order-box').offsetHeight+"px";
                    var options = {
                        containerId: 'cmp-segmented_title_content',
                        data: [],
                        success: function (results) {
                            console.log(results);
                            doSearch(results);
                        }
                    };

                    if(cmp.storage.get("searhInfo",true)){
                        searhInfo=cmp.parseJSON(cmp.storage.get("searhInfo",true));
                    }
                    cmp.each(configData.search,function(i,obj){
                        var extMap=cmp.parseJSON(obj.extraMap.extMap);
                        var field={fieldType:extMap.fieldType, fieldName:obj.name, title:obj.value, inputType: extMap.inputType, operation:extMap.operation,value:''};
                        if(field.inputType=="select" || field.inputType=="radio" ){  //获取下拉值列表
                            if(extMap.items){
                                field.items=[];
                                for(var i=0;i<extMap.items.length;i++){
                                    if(extMap.items[i].value!=0){
                                        extMap.items[i].name=extMap.items[i].display;
                                        field.items.push(extMap.items[i]);
                                    }
                                }
                            }
                        }else if(field.inputType=="checkbox"){
                            field.items=[{'value':'1','name':'勾选'},{'value':'0','name':'未勾选'}];
                        }


                        if(field.inputType=="project"){
                            field.filterType="project";
                        }else if(field.inputType=="select"  ||  field.inputType=="radio" || field.inputType=="checkbox"){
                            field.filterType="select";
                        }else if(field.inputType=="member" || field.inputType=="multimember"   ||  field.inputType=="department" ||  field.inputType=="multidepartment" ||
                            field.inputType=="account" || field.inputType=="multiaccount" ||  field.inputType=="post" || field.inputType=="multipost" || field.inputType=="level" || field.inputType=="multilevel"){
                            field.filterType="organization";
                        }else if(field.inputType=="date" || field.inputType=="datetime"){
                            field.filterType="timespan";
                        }else{
                            field.filterType="input";
                        }

                        if(searhInfo.length>0){//取出搜索值
                            cmp.each(searhInfo,function(i,o){
                                if(obj.name.indexOf(o.fieldName)!=-1){
                                    if(field.inputType=="date" || field.inputType=="datetime"){//日期类型数据转成字符串
                                        field.value =o.fieldValue.toString();
                                    }else{
                                        field.value= o.fieldValue;
                                    }
                                    field.display=o.display;
                                }
                            });
                        }
                        options.data.push(field);
                    });
                    if(filter){
                        filter.destroy();
                    }
                    filter = new SuiFilter(options);

                    document.getElementById('linkContainer').style.height=(window.innerHeight || document.body.clientHeight)-document.getElementById('cmp-segmented_title_content').offsetHeight - document.getElementById('footer').offsetHeight+'px';

                }else{
                    document.getElementById("cmp-segmented_title_content").style.display="none";
                    document.querySelector('.cmp-scroll-wrapper').style.top= document.querySelector('.data-order-box').offsetHeight+"px";
                    document.getElementById('linkContainer').style.height=(window.innerHeight || document.body.clientHeight) - document.getElementById('footer').offsetHeight+'px';
                }

                //排序
                if(ret.orderField!=undefined){
                    configData.orderField=ret.orderField;
                    if( configData.orderField.length==1){
                        var obj=configData.orderField[0];
                        document.getElementById("dataorder").innerHTML=obj.display+obj.symbol;
                        userOrderBy=[{fieldName:obj.fieldName,orderType:obj.type}];
                    }else if( configData.orderField.length>1){
                        //排序菜单
                        var searchTpl = _$("#order_li_tpl").innerHTML;
                        var orderlist=_$("#orderlist");
                        //console.log(configData);
                        var orderhtml = cmp.tpl(searchTpl, configData);
                        orderlist.innerHTML ="<li>默认排序</li>"+orderhtml;

                        if(cmp.storage.get("userOrderBy",true)){
                            userOrderBy=cmp.parseJSON(cmp.storage.get("userOrderBy",true));
                            cmp.each(configData.orderField,function(i,obj){
                                if(obj.fieldName ===userOrderBy[0].fieldName){
                                    document.getElementById("dataorder").innerHTML=obj.display+obj.symbol;
                                }
                            });
                        }else{
                            document.getElementById("dataorder").innerHTML="默认排序";
                        }

                    }
                }


                if(ret.showimg!=undefined){
                    configData.showimg=true;
                    configData.imgField=ret.imgField[0].name;
                    configData.imgField=configData.imgField.indexOf(".")>0?configData.imgField.substring(configData.imgField.indexOf(".")+1):configData.imgField;
                }


                configData.fields=[];
                //去掉ID前的表名,去掉图片字段
                cmp.each(ret.showField,function(i,obj){
                    obj.name=obj.name.indexOf(".")>0?obj.name.substring(obj.name.indexOf(".")+1):obj.name;
                    if(obj.name!=configData.imgField){
                        configData.fields.push(obj);
                    }
                });
                listfields=configData.fields;

                //table 的表头格式不一样
                var tempdata={};
                for (var i = 0, len = configData.fields.length; i < len; i++) {
                    var datas =configData.fields[i];
                    var values={};
                    tempdata[datas.name]=datas.value;
                }
                //configData.data=tempdata.data;
                tablefields=tempdata;


                configData.add=ret.add;
                //转换键值，以适应弹出菜单
                cmp.each(configData.author,function(i,obj){
                    obj.key=obj.name;
                    if( obj.display!=""){
                        obj.name=obj.display;
                    }else{
                        if(obj.name=="update") {
                            obj.name = cmp.i18n("unflowform.update");
                        }else if(obj.name=="allowdelete"){
                            obj.name=  cmp.i18n("unflowform.delete");
                        }else if(obj.name=="allowlock"){
                            obj.name= cmp.i18n("unflowform.lock");
                        }else if(obj.name=="browse"){
                            obj.name= cmp.i18n("unflowform.browse");
                        }
                    }

                });

                getList(true);
            }
        },
        error:function(e){
            var cmpHandled = cmp.errorHandler(e);
            if(cmpHandled) {
                cmp.href.back();
            }else{
                cmp.notification.alert(e.message, function () {
                    cmp.href.back();
                }, " ", cmp.i18n('unflowform.ok'));
            }
        }
    });
}

function  getList(isReload){
    configData.data=[];
    //if(document.getElementById("searchvalueinput").value!=""){
    //    searhInfo.fieldName=document.querySelector(".cmp-search-lable").id;
    //    searhInfo.fieldValue=document.getElementById("searchvalueinput").value;
    //    searhInfo.operation="like";
    //}
    var key=""
    if(searhInfo.length>0){
        cmp.each(searhInfo,function(i,obj) {
            key += obj.fieldValue;
        });
    }
    if(showType=="1"){
        document.getElementById("scroll").style.display="block";
        document.getElementById("linkContainer").style.display="none";
        document.getElementById("datalist").innerHTML="";
        configData.fields=listfields;
        var para=[{isReload:isReload}];
        cmp.listView("#scroll", {
            config: {
                isClear:false,
                clearCache:clearCache,
                crumbsID:key+crumbsID,
//                captionType: 1,//下拉上拉控件显示类型
                params: para,
                dataFunc:getListData,
                renderFunc: renderData
            },
            up: {
                contentdown: cmp.i18n("unflowform.load_more"),
                contentrefresh: cmp.i18n("unflowform.load_ing"),
                contentnomore: cmp.i18n("unflowform.load_nodata")
            }
        });
    }else{
        document.getElementById("scroll").style.display="none";
        document.getElementById("linkContainer").style.display="block";


        configData.fields=tablefields;
        tblist= cmp.tableList("#linkContainer",{
            isClear:false,
            clearCache:clearCache,
            crumbsID:key+"tableList",
            fields:configData.fields,//表头数据格式（必须）
           headerH:40,//表头高度------新增配置项
           sidebarW:40,//侧边栏宽度------新增配置项
           rowH:60,//列表行高------新增配置项
           theme:{
               headerStyle:"background:#DFE8EF;font-weight: bold;font-family: STHeitiSC-Medium;font-size: 16px;color: #718EAF;letter-spacing: 0.45px;",//列表头部样式，以css字符串的形式
               sidebarStyle:"font-family: STHeitiSC-Light;font-size: 14px;color: #333333;letter-spacing: 0.45px;;",//侧边栏样式，以css字符串的形式
               rowClass:"unflowform-tablelist-row"//列表class类，由开发者自己定义，一般是定义的错峰显示的不同底色的类
           },
           type:2,
            radio:params.mutiselect==true?false:true,
            down:{
                contentdown: cmp.i18n("unflowform.load_more"),
                contentover: cmp.i18n("unflowform.load_ing"),
                contentrefresh: cmp.i18n("unflowform.load_ing")
            },
            up:{
                contentdown: cmp.i18n("unflowform.load_more"),
                contentrefresh: cmp.i18n("unflowform.load_ing"),
                contentnomore: cmp.i18n("unflowform.load_nodata")
            },
            params: para,
            dataFunc:getListData, //配置加载数据的方法
            callback:function(data){
                //var selected=tblist.getChoosedData();
                //if(selected==undefined){
                //    document.getElementById("ok").innerText=cmp.i18n("unflowform.ok");
                //}else{
                //    document.getElementById("ok").innerText=cmp.i18n("unflowform.ok").substring(0,2)+"("+selected.length+")";
                //}

              ////表格行点击后查看详情
              //  if(params.showView) {
              //      var jsondata = JSON.parse(data);
              //      currId = jsondata.id;
              //      clickBottomMenu({key: "browse", name: '查看'});
              //  }

            }
        });
        cmp(".table_body").on("tap","td", function() {
            var selected=tblist.getChoosedData();
            if(selected==undefined){
                document.getElementById("ok").innerText=cmp.i18n("unflowform.ok");
            }else{
                document.getElementById("ok").innerText=cmp.i18n("unflowform.ok").substring(0,2)+"("+selected.length+")";
            }
            if(params.showView) {
                var jsondata=JSON.parse(this.parentNode.getAttribute("info").replace(/'/g,"\""));
                currId=jsondata.id;
                clickBottomMenu({key: "browse", name: '查看'})
            }
        });
        cmp(".cmp-control-content").on("tap","input[type='checkbox'],input[type='radio']", function() {
            setTimeout(function(){
                var selected=tblist.getChoosedData();
                if(selected==undefined){
                    document.getElementById("ok").innerText=cmp.i18n("unflowform.ok");
                }else{
                    document.getElementById("ok").innerText=cmp.i18n("unflowform.ok").substring(0,2)+"("+selected.length+")";
                }
            },100);

        });
    }

}
var getListData = function ( param, options) {
    var returndata;
    if(param.isReload){
        param["pageNo"]=1;
    }
    param["formId"] = params.formId;
    param["fromFormId"] = params.fromFormId;
    param["fromDataId"] = params.fromDataId;
    param["fromRecordId"] = params.fromRecordId;
    param["fromRelationAttr"] = params.fromRelationAttr;
    //param["toRelationAttr"] = params.toRelationAttr;

    param["cache"] =null;
    param["formTemplateId"]=null;
    param["isMobile"]=null;
    param.isReload=null;
    if(configData.showimg) {
       param["imgField"]= configData.imgField;
    }

    if(searhInfo.length>0) {
        //param["highquery"]= searhInfo;
        param["highquery"] = [];
        for (var i = 0; i < searhInfo.length; i++) {
            var field = searhInfo[i];
            if (field.inputType == "date" || field.inputType == "datetime") {
                var searh = {};
                searh.inputType = field.inputType;
                searh.fieldName = field.fieldName.substring(field.fieldName.indexOf(".") + 1);
                searh.fieldTitle = "";
                searh.rowOperation = "and";
                searh.fieldValue =field.fieldValue;
                var datetwo=new Date(searh.fieldValue[1]);
                if(searh.fieldValue[0]){
                    param["highquery"].push({inputType:searh.inputType,fieldName: searh.fieldName,fieldTitle:"",rowOperation:"and",fieldValue:searh.fieldValue[0],operation:">="});
                }

                if(searh.fieldValue[1]){
                    param["highquery"].push({inputType:searh.inputType,fieldName: searh.fieldName,fieldTitle:"",rowOperation:"and",fieldValue:searh.fieldValue[1],operation:"<="});
                }

            } else {
                param["highquery"].push(searhInfo[i]);
            }
        }
    }

    if(userOrderBy.length>0){
        param["userOrderBy"]=userOrderBy;
    }

    $s.UnflowForm.getFormMasterDataListByFormId ({}, param, {
        repeat:true,   //当网络掉线时是否自动重新连接
        success : function(ret) {
            if (ret.success) {
                returndata=ret.flipInfo;
                returndata.fields=configData.fields;
                cmp.each(returndata.data,function(i,obj) {
                    if(obj.state=="3"){
                       // obj.lock=true;
                    }
                    for(var key in obj){//特殊字符处理
                        obj[key]=obj[key].replace(/"/g,"").replace(/'/g,"");
                    }
                });

                if(options){
                    var success = options.success;
                    success(returndata);
                    if(showType=="2"){
                        document.getElementById("datatotal").innerText="共"+returndata.data.length+"条数据";
                        var tr=document.querySelector(".table_body").getElementsByTagName("tr");
                        for(var i=0;i<tr.length-1;i++){
                            var id=JSON.parse(tr[i].getAttribute("info")).id;
                            tr[i].id=id;
                        }
                    }
                    if(tblist){
                        var selected=tblist.getChoosedData();
                        if(selected==undefined || (selected && selected.length==0)){
                            document.getElementById("ok").innerText=cmp.i18n("unflowform.ok");
                        }else{
                            document.getElementById("ok").innerText=cmp.i18n("unflowform.ok").substring(0,2)+"("+selected.length+")";
                        }
                    }
                }
            }
        },
        error:function(e){
            var cmpHandled = cmp.errorHandler(e);
            if(cmpHandled) {
                cmp.href.back();
            }else{
                cmp.notification.alert(e.message, function () {
                    cmp.href.back();
                }, " ", cmp.i18n('unflowform.ok'));
            }
        }
    });



};


//更新列表数据
function renderData(result1, isRefresh) {
    if(configData.data.length>0){
        if(configData.data[configData.data.length-1]==result1[result1.length-1]){
            return ;
        }
    }
        cmp.each(result1,function(i,obj) {
            configData.data.push(obj);
        });

    if(showType=="1"){
        var listTpl = _$("#datalist_li_tpl").innerHTML;
        var datalist=_$("#datalist");
        //转换图片地址
        var ip = cmp.origin;
        var baseUrl = "/m3/apps/unflowform/img/";
        var defaultImg =   baseUrl + "default.png";
        cmp.each(result1, function(i, obj){
            // obj.name = escapeStringToHTML(obj.name, true);
            if(obj.imgid!="" || obj.imgid!=undefined || obj.imgid!=null){
                obj.imgid=ip + "/commonimage.do?method=showImage&q=0.5&size=custom&w=50&h=54&id=" + obj.imgid;
            }else{
                obj.imgid=defaultImg;
            }
        });
        var returnData={data:result1,showimg:configData.showimg};
        var html = cmp.tpl(listTpl, returnData);
        //console.log(isRefresh);
        //是否刷新操作，刷新操作直接覆盖数据
        if (configData.data.length == 0 || isRefresh) {
            datalist.innerHTML = html;
        } else {
            cmp.append(datalist,html);
        }

        //加载错误的图片进行处理
        var imgs=datalist.querySelectorAll("img");
        [].forEach.call(imgs, function(img) {
            var image=new Image();
            image.src=img.src;
            image.onerror=function(){
                img.parentNode.innerHTML="<span class='see-icon-v5-common-import-img'></span>";
            }
        });



        cmp.listView('#scroll').refresh();
    }
    //bindEvent();

}

//绑定图标事件
function bindEvent() {
    cmp.backbutton.push(function(){
        cmp.storage.delete( "searhInfo",true);
        cmp.storage.delete("unflowList_clearCache",true);
        cmp.storage.delete("crumbsID",true);
        cmp.storage.delete("userOrderBy",true);
        cmp.href.go(params.fromUrl,params.pageParams);
    })

    //切换展示方式
    //var head_Btn = document.getElementById("head_Btn");
    //head_Btn.addEventListener("tap",function() {
    //    if (showType=="1") {
    //        head_Btn.classList.remove("see-icon-v5-common-transverse-switch");
    //        head_Btn.classList.add("see-icon-v5-common-switch-light-form");
    //        showType="2";
    //        params.isMobile=false;
    //        getConfig();
    //    } else {
    //        head_Btn.classList.remove("see-icon-v5-common-switch-light-form");
    //        head_Btn.classList.add("see-icon-v5-common-transverse-switch");
    //        showType="1";
    //        params.isMobile=true;
    //        getConfig();
    //    }
    //});


    //点击向上向下收缩展开
    cmp("#datalist").on("tap",".see-icon-v5-common-arrow-down", function() {
        var a=this.parentNode.parentNode.querySelectorAll(".hidden");
        for(var i=0;i< a.length;i++){
            a[i].classList.remove("hidden");
            a[i].classList.add("show");
        }
        this.classList.remove("see-icon-v5-common-arrow-down");
        this.classList.add("see-icon-v5-common-arrow-top");
        cmp.listView('#scroll').refresh();
    });

    //点击向上向下收缩展开
    cmp("#datalist").on("tap",".see-icon-v5-common-arrow-top", function() {
        var a=this.parentNode.parentNode.querySelectorAll(".show");
        for(var i=0;i<a.length;i++){
            a[i].classList.remove("show");
            a[i].classList.add("hidden");
        }
        this.classList.add("see-icon-v5-common-arrow-down");
        this.classList.remove("see-icon-v5-common-arrow-top");
        cmp.listView('#scroll').refresh();
    });

    //点击...弹出操作菜单
    cmp("#datalist").on("tap",".see-icon-more", function() {
        var li=this.parentNode.parentNode;
        currId=li.id;
        //alert(li.id);
        var menus=[];
        cmp.each(configData.author, function(i, obj){
            if(allowLock && obj.key=="allowlock"){
                if(li.getAttribute("state")=="3" ){
                     menus.push({"key":"unlock","name":cmp.i18n("unflowform.lock")+"/"+cmp.i18n("unflowform.unlock")});
                }else{
                    menus.push({"key":"lock","name":cmp.i18n("unflowform.lock")+"/"+cmp.i18n("unflowform.unlock")});
                }
            }else if(obj.key=="update"){
                obj.key= obj.key+obj.id;
                menus.push(obj);
            }else if(obj.key!="browse" && obj.key!="add"){
                menus.push(obj);
            }
        });
        cmp.dialog.actionSheet( //直接调此接口
            menus, //权限菜单
            "取消",            //最底部取消按钮的文字
            function (result){ //item点击选择的回调函数，组件将该item信息以对象的形式传入
                clickBottomMenu(result);

            },
            function (){      //开发者自定义的取消回调函数
                //
            });
    });

    //新建
    var add_button = document.querySelector(".add_button")
    add_button.addEventListener("tap",function() {
        clickBottomMenu({key:"add",name:'新建'});
    });


    //点击列表行后查看详情
    cmp("#datalist").on("tap",".cmp-table-cell", function() {
        var li=this.parentNode.parentNode;
        currId=li.id;
        clickBottomMenu({key:"browse",name:'查看'})
    });



    document.getElementById("ok").addEventListener("tap",function(){
        var _checkbox= document.querySelectorAll("input[type='checkbox']:checked,input[type='radio']:checked");
        if(_checkbox.length==0){
            //cmp.href.go(params.fromUrl,params.pageParams);
            //return;
        }
        var obj = new Object();
        obj.toFormId =  toFormBean.id;
        var subData=[];
        for(var t=1;t<toFormBean.tableList.length;t++){
            subData.push({tableName:toFormBean.tableList[t].split("|")[0]});
        }
        var selectArray=[];
        for(var i=0;i<_checkbox.length;i++){
            var s=JSON.parse( _checkbox[i].getAttribute("info").replace(/'/g,"\""));
            selectArray.push({masterDataId: s.id,subData:subData});
        }
        /**返回数据格式
         *{toFormId:yyyy,selectArray:[{masterDataId:xxx,subData:[{tableName:formson_0001,dataIds:[]},{tableName:formson_0002,dataIds:[]}]},
                                      {masterDataId:xxx,subData:[{tableName:formson_0001,dataIds:[]},{tableName:formson_0002,dataIds:[]}]}]}
         */
        obj.selectArray = selectArray;
        cmp.storage.save(params.pageKey,JSON.stringify({"metadata":params.metadata,"data":obj}),true);
        setTimeout(function(){
            cmp.storage.delete( "searhInfo",true);
            cmp.storage.delete("unflowList_clearCache",true);
            cmp.storage.delete("crumbsID",true);
            cmp.storage.delete("userOrderBy",true);
            cmp.href.go(params.fromUrl,params.pageParams);
        },200);
    });

    //排序
    var dataorder = document.getElementById("dataorder");
    dataorder.addEventListener("tap",function() {
        if( configData.orderField &&  configData.orderField.length>1){
            var orderlist = document.getElementById("orderlist");
            var menus=orderlist.querySelectorAll("li");
            if(userOrderBy.length>0){
                [].forEach.call(menus, function(li) {
                    if(li.id==userOrderBy[0].fieldName){
                        li.className="curr";
                    }else{
                        li.className="";
                    }
                });
            }else{
                menus[0].className="curr";
            }
            document.getElementById('data-order-popover').style.display="block";
        }
    });
    var dataorderbg = document.getElementById("data-order-bg");
    dataorderbg.addEventListener("tap",function() {
        document.getElementById('data-order-popover').style.display="none";
    });
    //选择排序项
    cmp("#orderlist").on("tap","li", function() {
        if(this.id){
            var fieldName=this.id;
            var orderType=this.getAttribute("orderType");
            userOrderBy=[{fieldName:this.id,orderType:orderType}];
            cmp.storage.save("userOrderBy",JSON.stringify(userOrderBy),true);
        }else{//默认排序
            userOrderBy=[];
            cmp.storage.delete("userOrderBy",true);
        }

        document.getElementById('dataorder').innerText=this.innerText;
        document.getElementById('data-order-popover').style.display="none";
        getList(true);
    });

    //点击搜索条才加载相关JS
    document.getElementById("cmp-segmented_title_content").addEventListener("tap",function() {
        addJs();
    });

}

function clickBottomMenu(result) {
    if (result == 0) {
        result = configData.author[0];
    }
    params.contentAllId = currId;
    params.ids = currId;
    params.dataId = currId;
    params.isNew = false;
    var locked = true;

    cmp.each(configData.author, function (i, obj) {
        if (obj.key == result.key) {
            var newFormAuth = obj.value;
            //var strs = newFormAuth.split(".");
            //params.viewId=strs[0];
            //params.rightId=strs[1];
            params.rightId = newFormAuth;
        }
    });

    cmp.dialog.loading(true);
    $s.UnflowForm.checkDelete({}, params, {
        repeat:true,   //当网络掉线时是否自动重新连接
        success: function (ret) {
            if (!ret.isExist) {
                cmp.dialog.loading(false);
                cmp.notification.toast(cmp.i18n("unflowform.data.notexists"), "center");
                return;
            } else {
                if (result.key == "browse") {
                    if (params.rightId == undefined) {
                        cmp.each(configData.author, function (i, obj) {
                            if (obj.key == result.key) {
                                var newFormAuth = obj.value;
                                //var strs = newFormAuth.split(".");
                                //params.viewId=strs[0];
                                //params.rightId=strs[1];
                                params.rightId = newFormAuth;
                            }
                        });
                    }
                    params.showType = "browse";
                    params.tag= "relationSubForm";
                    setTimeout(function () {
                        cmp.storage.save("relationSubForm_params",JSON.stringify(params),true);
                        cmp.href.go(_unflowformpath + "/html/relationSubForm.html?date=" + (new Date().getTime()), params);
                    }, 500);
                }

            }
        },
        error:function(e){
            var cmpHandled = cmp.errorHandler(e);
            if(cmpHandled) {
            }else{
                cmp.notification.alert(e.message, function () {
                }, " ", cmp.i18n('unflowform.ok'));
            }
        }
    });


}
function doSearch(results){
    searhInfo=[];
    for(var i=0;i<results.length;i++){
        var field=results[i];
        if(field.value){
            field.fieldName=field.fieldName.substring(field.fieldName.indexOf(".")+1);
            field.fieldTitle = "";
            field.rowOperation="and";

            if (field.inputType=="date" || field.inputType=="datetime" ) {
                field.fieldValue =field.value.split(',');
                var dateone=new Date(field.fieldValue[0]);
                var datetwo=new Date(field.fieldValue[1]);
                if(dateone>datetwo){
                    cmp.notification.toast(cmp.i18n("unflowform.dateselecterror"),"center");
                    return;
                }
            }else{
                field.fieldValue =field.value;
            }
            searhInfo.push(field);
        }

    }

    cmp.storage.save("searhInfo",JSON.stringify(searhInfo),true);
    document.getElementById("ok").innerText=cmp.i18n("unflowform.ok");
    crumbsID=(new Date()).getTime();
    getList(true);
}


//简化选择器
function _$(selector){
    return document.querySelector(selector)
}

//js延迟加载
var jsLoaded=false;
function addJs() {
    if(jsLoaded) return;

    var cssList=[
        _cmppath + "/css/cmp-picker.css" +buildversion,
        _cmppath + "/css/cmp-selectOrg.css" +buildversion,
        _cmppath + "/css/cmp-search.css" +buildversion
    ];
    var jsList=[
        _cmppath + "/js/cmp-picker.js" +buildversion,
        _cmppath + "/js/cmp-dtPicker.js" +buildversion,
        _cmppath + "/js/cmp-app.js" +buildversion,
        _cmppath + "/js/cmp-search.js" +buildversion,
        _cmppath + "/js/cmp-selectOrg.js" +buildversion,
        _cmppath + "/js/cmp-popPicker.js" +buildversion
    ];
    cmp.asyncLoad.js(jsList,function(){
        cmp.asyncLoad.css(cssList,function(){
            jsLoaded=true;
        });
    });

}