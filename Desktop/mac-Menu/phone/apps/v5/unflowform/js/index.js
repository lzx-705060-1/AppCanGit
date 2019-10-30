﻿var configData={data:[]};
var listType="1";
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
var auth4menu=[];
cmp.ready(function(){
    bindBackBtnEvent();
    cmp.backbutton();

    configData.ip = cmp.origin;
    params=cmp.href.getParam();
    if(params==undefined){
        params=cmp.parseJSON(cmp.storage.get("unflowListParams"),true);
    }else{
        cmp.storage.save("unflowListParams",JSON.stringify(params),true);
    }
    if(cmp.storage.get("unflowList_clearCache",true)){
        clearCache=cmp.storage.get("unflowList_clearCache",true);
        cmp.storage.delete("unflowList_clearCache",true);
    }


    params.formTemplateId=params.sourceId;
    params.formId=params.formAppmainId;
    params.isMobile=true;

    if(cmp.storage.get("listType",true)){
        listType=cmp.storage.get("listType",true);
        if (listType=="2") {
            params.isMobile = false;
        }
    }

    if(cmp.storage.get("crumbsID")){
        crumbsID=cmp.storage.get("crumbsID",true);
    }

    document.title=params.name;
    getConfig();
    bindEvent();
});
function getConfig(){
    cmp.storage.save("listType",listType,true);
    $s.UnflowForm.getUnFlowDataList({}, params, {
        repeat:true,   //当网络掉线时是否自动重新连接
        success : function(ret) {
            if (ret.success) {
                params.moduleType=ret.moduleType;

                //判断是否有移动配置
                if(!ret.hasMobileBean){
                    document.getElementById("head_Btn").style.display="none";
                    listType="2";
                    params.isMobile=false;
                }else{
                    document.getElementById("head_Btn").style.display = "";
                }

                //添加按钮
                if(!ret.add){
                    document.querySelector("#add_Btn").style.display="none";
                }else{
                    document.querySelector("#add_Btn").style.display="";
                }



                configData.search=ret.searchField;
                if(configData.search.length>0){
                    document.getElementById("unflowform_search").style.display="block";

                    var options = {
                        containerId: 'unflowform_search',
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
                        var field={fieldType:extMap.fieldType, fieldName:obj.name, title:obj.value, inputType: extMap.inputType, externalType: extMap.externalType, operation:extMap.operation,value:''};
                        if(field.inputType=="exchangetask" || field.inputType=="querytask") {  //dee
                            field.inputType=field.fieldType.toLowerCase();
                            if(field.inputType=="timestamp"){
                                field.inputType="date";
                            }
                        }
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
                            field.items=[{'value':'1','name':cmp.i18n("unflowform.selected")},{'value':'0','name':cmp.i18n("unflowform.unselected")}];
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
                }else{
                    document.getElementById("unflowform_search").style.display="none";
                }

                //排序
                if(ret.orderField.length>0){
                    document.querySelector(".data-order-box").style.display="";
                    configData.orderField=ret.orderField;
                    if( configData.orderField.length>=1){
                        //排序菜单
                        var searchTpl = _$("#order_li_tpl").innerHTML;
                        var orderlist=_$("#orderlist");
                        //console.log(configData);
                        var orderhtml = cmp.tpl(searchTpl, configData);
                        orderlist.innerHTML ="<li>"+cmp.i18n("unflowform.defaultsort")+"</li>"+orderhtml;

                        if(cmp.storage.get("userOrderBy",true)){
                            userOrderBy=cmp.parseJSON(cmp.storage.get("userOrderBy",true));
                            cmp.each(configData.orderField,function(i,obj){
                                if(obj.fieldName ===userOrderBy[0].fieldName){
                                    var orderType=(userOrderBy[0].orderType=="desc"?"↓":"↑");
                                    document.getElementById("dataorder").innerText=obj.display;
                                    document.getElementById("orderType").innerText=orderType;
                                }
                            });
                        }else{
                            if( configData.orderField.length==1){
                                var obj=configData.orderField[0];
                                document.getElementById("dataorder").innerHTML=obj.display;
                                document.getElementById("orderType").innerText=obj.symbol;
                                userOrderBy=[{fieldName:obj.fieldName,orderType:obj.type}];
                            }else{
                                document.getElementById("dataorder").innerText=cmp.i18n("unflowform.defaultsort");
                                document.getElementById("orderType").innerHTML="&nbsp;";
                            }

                        }

                    }
                }else{
                    document.querySelector(".data-order-box").style.display="";
                }
                document.querySelector('.data-order-menu').style.maxHeight=(window.innerHeight || document.body.clientHeight) - document.querySelector('.cmp-segmented_title_content').offsetHeight+'px';
                document.getElementById('linkContainer').style.height=document.querySelector('.data-order-menu').style.maxHeight;


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


                configData.author=ret.auth;
                auth4menu=[];
                configData.add=ret.add;
                //转换键值，以适应弹出菜单
                cmp.each(configData.author,function(i,obj){
                    obj.key=obj.name;
                    obj.id=i;
                    if( obj.display!=""){
                        obj.name=obj.display;
                    }else{
                        if(obj.name=="update") {
                            obj.name = cmp.i18n("unflowform.update");
                        }else if(obj.name=="allowdelete"){
                            obj.name=  cmp.i18n("unflowform.delete");
                        }else if(obj.name=="allowlock"){
                            allowLock = true;
                            obj.name= cmp.i18n("unflowform.lock")+"/"+cmp.i18n("unflowform.unlock");
                        }else if(obj.name=="browse"){
                            obj.name= cmp.i18n("unflowform.browse");
                        }
                    }

                    if(obj.key!="add" && obj.key!="browse") {
                        auth4menu.push({key:obj.key,name:obj.name});
                    }
                });

                getList(true);
            }else{
                cmp.notification.alert(ret.msg, function () {
                    cmp.href.back();
                }, " ", cmp.i18n('unflowform.ok'));
            }
        },
        error:function(e){
            var cmpHandled = cmp.errorHandler(e);
            if(cmpHandled) {
            }else{
                cmp.notification.alert(e.message, function () {
                    cmp.href.back();
                }, " ", cmp.i18n('unflowform.ok'));
            }
        }
    });
}
function  getList(isReload){
    if(cmp.tableList){
        createList(isReload);
    }else{
        cmp.asyncLoad.js([_cmppath + "/js/cmp-listView.js" +buildversion,_cmppath + "/js/cmp-tableList.js" +buildversion], function () {
            createList(isReload);
        });
    }
}
function  createList(isReload){
    configData.data=[];
    var key=""
    if(searhInfo.length>0){
        cmp.each(searhInfo,function(i,obj) {
            key += obj.fieldValue;
        });
    }
    if(listType=="1"){
        if(cmp.storage.get("unflowform_total" + params.formTemplateId,  true)){
            document.getElementById("datatotal").innerText = cmp.i18n("unflowform.total", [cmp.storage.get("unflowform_total" + params.formTemplateId,  true)]);
        }
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
            },
            down:{
                contentdown: cmp.i18n("unflowform.load_more"),
                contentrefresh: cmp.i18n("unflowform.load_ing"),
                contentover: cmp.i18n("unflowform.load_ing")
            }
        });
    }else{
        document.getElementById("scroll").style.display="none";
        document.getElementById("linkContainer").style.display="block";


        configData.fields=tablefields;
        cmp.tableList("#linkContainer",{
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

              //表格行点击后弹出菜单
                var jsondata=JSON.parse(data);
                currId=jsondata.id;

                var menus=[{key:"browse",name:cmp.i18n("unflowform.browse")}];
                cmp.each(configData.author, function(i, obj){
                    if (obj.value == "newProcessesForm") {//移动端不支持V-Join快速下单
                        return true;
                    }
                    if(allowLock && obj.key=="allowlock"){
                        if(jsondata.state=="3" ){
                            menus.push({"key":"unlock","name":cmp.i18n("unflowform.lock")+"/"+cmp.i18n("unflowform.unlock")});
                        }else{
                            menus.push({"key":"lock","name":cmp.i18n("unflowform.lock")+"/"+cmp.i18n("unflowform.unlock")});
                        }
                    }else if(obj.key=="update"){
                        obj.key= obj.key+obj.id;
                        menus.push(obj);
                    } else if(obj.key!="browse" && obj.key!="add"){
                        menus.push(obj);
                    }
                });

                cmp.dialog.actionSheet( //直接调此接口
                    menus, //权限菜单
                    cmp.i18n("unflowform.cancel"),            //最底部取消按钮的文字
                    function (result){ //item点击选择的回调函数，组件将该item信息以对象的形式传入
                        clickBottomMenu(result);
                    },
                    function (){      //开发者自定义的取消回调函数
                        //
                    });
                //bindEvent();
            }
        });
    }

}
var getListData = function ( param, options) {
    var returndata;
    if(param.isReload){
         param["pageNo"]=1;
    }
    param["formId"] = params.formId;
    param["cache"] =null;
    param["formTemplateId"]=params.formTemplateId;
    param["isMobile"]=params.isMobile;
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
                cmp.storage.save("unflowform_total"+params.formTemplateId,returndata.total,true);
                document.getElementById("datatotal").innerText=cmp.i18n("unflowform.total", [returndata.total]);
                returndata.fields=configData.fields;
                cmp.each(returndata.data,function(i,obj) {
                    if(obj.state=="3"){
                        obj.lock=true;
                    }
                });

                if(options){
                    var success = options.success;
                    success(returndata);
                    if(listType=="2"){
                        var tr=document.querySelector(".table_body").getElementsByTagName("tr");
                        for(var i=0;i<tr.length-1;i++){
                            var id=JSON.parse(tr[i].getAttribute("info")).id;
                            tr[i].id=id;
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


    if(listType=="1"){
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

function bindBackBtnEvent() {
    cmp.backbutton.push(function(){
        cmp.storage.delete( "listType",true);
        cmp.storage.delete( "searhInfo",true);
        cmp.storage.delete("unflowList_clearCache",true);
        cmp.storage.delete("crumbsID",true);
        cmp.storage.delete("userOrderBy",true);
        cmp.storage.delete("unflowform_total" + params.formTemplateId,  true)
        cmp.href.back();
    });
}

//绑定图标事件
function bindEvent() {
    //切换展示方式
    var head_Btn = document.getElementById("head_Btn");
    head_Btn.addEventListener("tap",function() {
        cmp.storage.delete( "searhInfo",true);
        searhInfo=[];
        if (listType=="1") {
            head_Btn.classList.remove("see-icon-v5-common-transverse-switch");
            head_Btn.classList.add("see-icon-v5-common-switch-light-form");
            listType="2";
            params.isMobile=false;
            getConfig();
        } else {
            head_Btn.classList.remove("see-icon-v5-common-switch-light-form");
            head_Btn.classList.add("see-icon-v5-common-transverse-switch");
            listType="1";
            params.isMobile=true;
            crumbsID+=1;
            cmp.storage.save("crumbsID",crumbsID,true);
            getConfig();
        }
    });


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
            cmp.i18n("unflowform.cancel"),            //最底部取消按钮的文字
            function (result){ //item点击选择的回调函数，组件将该item信息以对象的形式传入
                clickBottomMenu(result);

            },
            function (){      //开发者自定义的取消回调函数
                //
            });
    });

    //新建
    var add_Btn = document.querySelector("#add_Btn")
    add_Btn.addEventListener("tap",function() {
        clickBottomMenu({key:"add",name:'新建'});
    });


    //点击列表行后查看详情
    cmp("#datalist").on("tap",".cmp-table-cell", function() {
        var li=this.parentNode.parentNode;
        currId=li.id;
        clickBottomMenu({key:"browse",name:cmp.i18n("unflowform.browse")})
    });

  //点击单个操作按钮
  cmp("#datalist").on("tap",".showinfo", function() {
    currId=this.getAttribute("_id");
    var _btn=cmp.parseJSON(this.getAttribute("_btn").replace(/'/g,"\""));
    clickBottomMenu(_btn);
  });


    //排序
    var dataorder = document.getElementById("dataorder");
    dataorder.addEventListener("tap",function() {
        if(configData.orderField &&  configData.orderField.length==1 ){//只有一个排序项时点击直接改变排序方向
            if(userOrderBy.length>0){
                var orderType=userOrderBy[0].orderType;
                orderType=(orderType=="asc"?"desc":"asc");
                userOrderBy[0].orderType=orderType;
                cmp.storage.save("userOrderBy",JSON.stringify(userOrderBy),true);
                document.getElementById("orderType").innerText=(orderType=="desc"?"↓":"↑");
                crumbsID=(new Date()).getTime();
                getList(true);
            }
        }else if(configData.orderField &&  configData.orderField.length>1){
            var orderlist = document.getElementById("orderlist");
            var menus=orderlist.querySelectorAll("li");
            if(document.getElementById('data-order-popover').style.display=="none"){
                if(userOrderBy.length>0){
                    [].forEach.call(menus, function(li) {
                        if(li.id==userOrderBy[0].fieldName){
                            li.className="curr";
                            li.setAttribute("orderType",userOrderBy[0].orderType);
                            li.innerText=li.getAttribute("display");
                        }else{
                            li.className="";
                        }
                    });
                }else{
                    [].forEach.call(menus, function(li) {
                        li.className="";
                    });
                    menus[0].className="curr";
                }
                document.getElementById('data-order-popover').style.display="block";
            }else{
                document.getElementById('data-order-popover').style.display="none";
            }

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
            if(userOrderBy.length>0 && userOrderBy[0].fieldName==this.id){//选择当前排序项改变排序方向
                orderType=(orderType=="asc"?"desc":"asc");
                this.setAttribute("orderType",orderType);
                userOrderBy=[{fieldName:this.id,orderType:orderType}];
                this.innerText=this.getAttribute("display");
            }else{
                userOrderBy=[{fieldName:this.id,orderType:orderType}];
            }
            document.getElementById('dataorder').innerText=this.innerText;
            document.getElementById('orderType').innerText=(orderType=="desc"?"↓":"↑");
            cmp.storage.save("userOrderBy",JSON.stringify(userOrderBy),true);
        }else{//默认排序
            userOrderBy=[];
            cmp.storage.delete("userOrderBy",true);
            document.getElementById('dataorder').innerText=this.innerText;
            document.getElementById('orderType').innerHTML="&nbsp;";
        }

        document.getElementById('data-order-popover').style.display="none";
        crumbsID=(new Date()).getTime();
        getList(true);
    });

    // //查看长标题
    // var appTitle = document.getElementById("appTitle");
    // if(appTitle.offsetWidth < appTitle.scrollWidth ){
    //     appTitle.addEventListener("tap", function(){
    //         document.getElementById("title-more").style.display=(document.getElementById("title-more").style.display=="block"?"none":"block");
    //         document.getElementById("title-info-txt").innerText=appTitle.innerText;
    //     });
    // }

    // document.querySelector(".title-info-bg").addEventListener("tap", function(){
    //     document.getElementById("title-more").style.display="none";
    // });

    //点击搜索条才加载相关JS
    document.getElementById("unflowform_search").addEventListener("tap",function() {
       addJs();
    });

}


function clickBottomMenu(result){
    if(result==0){
        result=configData.author[0];
    }
    if(result.key=="customSet") {
        return;
    }

    params.contentAllId=currId;
    params.ids=currId;
    params.dataId=currId;
    params.isNew=false;
    var locked=true;

    //取编号
    if(result.key.indexOf("update")!=-1){ //修改
        cmp.each(configData.author,function(i,obj){ //根据权限ID找属性
            if(obj.key==result.key ){
                var newFormAuth = obj.value;
                //var strs = newFormAuth.split(".");
                //params.viewId=strs[0];
                //params.rightId=strs[1];
                params.rightId=newFormAuth;
                result.modifyShowDeal=obj.modifyShowDeal;
            }
        });


    }else{
        cmp.each(configData.author,function(i,obj){
            if(obj.key==result.key ){
                var newFormAuth = obj.value;
                params.rightId=newFormAuth;
            }
        });
    }

   if(result.key=="add") {
        params.showType = "add";
        params.contentAllId = 0;
        params.isNew = true;
        cmp.openUnflowFormData(params);
   }else{
       cmp.dialog.loading(true);
       $s.UnflowForm.checkDelete({}, params, {
           repeat:true,   //当网络掉线时是否自动重新连接
           success: function (ret) {
               if(!ret.isExist){
                   cmp.dialog.loading(false);
                   cmp.notification.toast(cmp.i18n("unflowform.data.notexists"),"center");
                   return;
               }else{
                   //非查看和新增检查锁定状态
                   if(result.key!="browse" && result.key!="add"){
                       $s.UnflowForm.checkDataLockForEdit ({}, params, { //判断是否处于编辑锁定状态
                           repeat:true,   //当网络掉线时是否自动重新连接
                           success: function (ret) {
                               if(ret.msg!=undefined){
                                   cmp.dialog.loading(false);
                                   cmp.notification.toast(ret.msg,"center");
                                   return;
                               }else{
                                   $s.UnflowForm.checkLock({}, params, {
                                       repeat:true,   //当网络掉线时是否自动重新连接
                                       success: function (ret) {
                                           locked=ret.locked;

                                           if(result.key.indexOf("update")!=-1){
                                               if(locked){
                                                   cmp.dialog.loading(false);
                                                   cmp.notification.toast(cmp.i18n("unflowform.datalocked"),"center");
                                                   return;
                                               }else{
                                                   if(!result.modifyShowDeal){
                                                       params.showType="update";
                                                       cmp.openUnflowFormData(params);
                                                   }else{//修改不弹出
                                                       var opt=params;
                                                       if(opt.rightId.indexOf(".")!=-1){
                                                           opt.rightId=opt.rightId.substring(opt.rightId.indexOf(".")+1);
                                                       }
                                                       if(opt.rightId.indexOf("|")!=-1){
                                                           opt.rightId=opt.rightId.split("|")[0];
                                                       }
                                                       $s.UnflowForm.doHideRefresh ({}, opt, {
                                                           repeat:false,   //当网络掉线时是否自动重新连接
                                                           success: function (ret) {
                                                               cmp.dialog.loading(false);
                                                               if(ret.msg!=undefined){
                                                                   cmp.notification.toast(ret.msg,"center");
                                                                   return;
                                                               }else{
                                                                   getList(true);
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

                                               }
                                           }else if(result.key=="allowdelete"){
                                               cmp.dialog.loading(false);
                                               if(locked){
                                                   cmp.notification.toast(cmp.i18n("unflowform.datalocked"),"center");
                                                   return;
                                               }
                                               cmp.notification.confirm(cmp.i18n("unflowform.deleteconfirm"),function(e) {
                                                   //e==0 是 e==1否
                                                   if (e == 1) {
                                                   	   cmp.dialog.loading(true);
                                                       $s.UnflowForm.deleteFormData({}, params, {
                                                           repeat:false,   //当网络掉线时是否自动重新连接
                                                           success: function (ret) {
                                                               cmp.dialog.loading(false);
                                                               if (ret.success) {
                                                                   crumbsID+=1;
                                                                   cmp.storage.save("crumbsID",crumbsID,true);
                                                                   getList(false);
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
                                               },cmp.i18n('unflowform.confirm'),[cmp.i18n("unflowform.cancel"),cmp.i18n("unflowform.ok")]);
                                           }else if(result.key=="lock" || result.key=="unlock" || result.key=="allowlock" ) {
                                               if (!locked) {
                                                   //cmp.notification.confirm(cmp.i18n("unflowform.lockconfirm"),function(e) {
                                                   //    //e==0 是 e==1否
                                                   //    if (e == 0) {
                                                   $s.UnflowForm.lock({}, params, {
                                                       repeat:false,   //当网络掉线时是否自动重新连接
                                                       success: function (ret) {
                                                           cmp.dialog.loading(false);
                                                           if (ret.success) {
                                                               crumbsID+=1;
                                                               cmp.storage.save("crumbsID",crumbsID,true);
                                                               if(listType=="1"){
                                                                   getList(false);
                                                               }else{
                                                                   getList(false);
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
                                                   //    }
                                                   //});
                                               }else {
                                                   //cmp.notification.confirm(cmp.i18n("unflowform.unlockconfirm"),function(e) {
                                                   //    //e==0 是 e==1否
                                                   //    if (e == 0) {
                                                   $s.UnflowForm.unLock({}, params, {
                                                       repeat:false,   //当网络掉线时是否自动重新连接
                                                       success: function (ret) {
                                                           cmp.dialog.loading(false);
                                                           if (ret.success) {
                                                               crumbsID+=1;
                                                               cmp.storage.save("crumbsID",crumbsID,true);
                                                               if(listType=="1"){
                                                                   getList(false);
                                                               }else{
                                                                   getList(false);
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
                                                   //    }
                                                   //});
                                               }
                                           }
                                       },
                                       error:function(e){
                                           var cmpHandled = cmp.errorHandler(error);
                                           if(cmpHandled) {
                                           }else{
                                               cmp.notification.alert(e.message, function () {
                                               }, " ", cmp.i18n('unflowform.ok'));
                                           }
                                       }
                                   });
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
                   }else{
                       if(result.key=="browse"){
                           if(params.rightId==undefined){
                               cmp.each(configData.author,function(i,obj){
                                   if(obj.key==result.key ){
                                       var newFormAuth = obj.value;
                                       //var strs = newFormAuth.split(".");
                                       //params.viewId=strs[0];
                                       //params.rightId=strs[1];
                                       params.rightId=newFormAuth;
                                   }
                               });
                           }
                           params.showType="browse";
                           setTimeout(function(){
                               cmp.openUnflowFormData(params);
                           },500);
                       }
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
