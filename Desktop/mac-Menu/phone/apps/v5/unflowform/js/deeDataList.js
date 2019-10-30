﻿var params={};
var _fields;  //表格组件使用
var _fieldInfo; //返回的字段等信息
var isMasterField = true;
cmp.ready(function(){
    cmp.backbutton();
    params=cmp.href.getParam();
    //如果不是主表字段
    isMasterField = params.metadata.masterField;
	 

    //测试数据
    //params.formId="8028933544986363932";
    //params.fieldName="field0001";
    //params.contentDataId="4615069498225063959";
    ////params.rightId="6808049710394853971";
    //params.recordId="0";
    //params.allowCheck=true;
    //isMaster 字段控件是重表还是子表

    if(!params.allowCheck){
        document.getElementById("linkContainer").style.height=(window.innerHeight || document.body.clientHeight)-document.querySelector('header').offsetHeight+'px';
        document.getElementById("footer").style.display="none";
    }else{
        document.getElementById("linkContainer").style.height=(window.innerHeight || document.body.clientHeight)-document.querySelector('header').offsetHeight-44+'px';
    }

    params.tag= (new Date()).getTime();
    bindEvent();

    //获取参数信息
    $s.CapForm.getDeeInfo({}, params, {
        success : function(ret) {
            if (ret.success) {
                _fieldInfo=ret.fieldInfo;
                if(_fieldInfo.success=="false"){
                    cmp.notification.alert(_fieldInfo.errorMsg,function(){
                        cmp.href.go(params.fromUrl,params.pageParams);
                    }," ",cmp.i18n("deeDataList.page.lable.ok"));
                    return;
                }
                _fields={};
                cmp.each(JSON.parse(_fieldInfo.fieldlist),function(i,obj){
                    _fields[obj.name]=obj.display;
                });

                showContent();
//                pageSearch(params.formId);
                //bindEvent();
            }
        }
    });


});
function showContent(){
    cmp.tableList("#linkContainer",{
        fields:_fields,//表头数据格式（必须）
        pageSize:20,
        down:{
            contentdown: cmp.i18n("deeDataList.page.lable.load_more"),
            contentover: cmp.i18n("deeDataList.page.lable.load_ing"),
            contentrefresh: cmp.i18n("deeDataList.page.lable.load_ing")
        },
        up:{
            contentdown: cmp.i18n("deeDataList.page.lable.load_more"),
            contentrefresh: cmp.i18n("deeDataList.page.lable.load_ing"),
            contentnomore: cmp.i18n("deeDataList.page.lable.load_nodata")
        },
        params: [{}],
        type: (params.allowCheck?2:1),       
        radio:isMasterField,
        dataFunc:getListData, //配置加载数据的方法
        callback:function(data){

        }
    });
}
var getListData = function ( param, options) {
    params.pageNo=param.pageNo;
    params.pageSize=param.pageSize;
    params.pageSize=param.pageSize;
    $s.CapForm.getDeeDataList({}, params, {
        success : function(ret) {
            if (ret.success) {
                var success = options.success;
                var returndata=ret.flipInfo;

                returndata.fields=_fields;
				for(var i=0;i<returndata.data.length;i++){
					var id = returndata.data[i].id;
					if(returndata.data[i]['column_@dee@newId@_id'] != null){
						returndata.data[i].id = returndata.data[i]['column_@dee@newId@_id'];
					}
					returndata.data[i]['column_@dee@newId@_id'] = id;
                }
                success(returndata);

                var tr=document.querySelector(".table_body").getElementsByTagName("tr");
                for(var i=0;i<tr.length-1;i++){
                    var id=JSON.parse(tr[i].getAttribute("info"))['column_@dee@newId@_id'];
                    tr[i].id=id;
                }

                
                	//点击列表行后查看详情
                    cmp(".table_body").on("tap","tr", function() {
						if(isMasterField){
							var s=JSON.parse( this.getAttribute("info").replace(/'/g,"\""));
							if(s.hasSubData){
								params.masterId=s['column_@dee@newId@_id'];
								cmp.href.go(_unflowformpath+ "/html/deeSubData.html?date="+(new Date().getTime()), params);
							}
						}
                    });
               
                
            }
        }
    });

}



//绑定图标事件
function bindEvent() {
    var backBtn = document.getElementById("backBtn");
    backBtn.addEventListener("tap", function(){
        cmp.href.go(params.fromUrl,params.pageParams);
       // cmp.href.back();
        //cmp.href.next(params.fromUrl,params.pageParams);
    });
    cmp.backbutton.push(function(){
        cmp.href.go(params.fromUrl,params.pageParams);
    })


    var header_search_btn = document.getElementById("header_search_btn");
    header_search_btn.addEventListener("tap",function() {
        var search_span=document.getElementById("search");
        search_span.style.display=search_span.style.display=="block"?"none":"block";
        pageSearch(params.formId);
    });




    //控制只能单选
    //cmp(".cmp-control-content").on("click","input[type='checkbox'],input[type='radio']", function() {
    //    if(this.checked){
    //        var _checkbox= document.querySelectorAll("input[type='checkbox']:checked,input[type='radio']:checked");
    //        for(var i=0;i<_checkbox.length;i++){
    //            if(_checkbox[i]!=this){
    //                _checkbox[i].checked=false;
    //            }
    //        }
    //    }
    //});



    document.getElementById("ok").addEventListener("tap",function(){
        var _checkbox= document.querySelectorAll("input[type='checkbox']:checked,input[type='radio']:checked");
        if(_checkbox.length==0){
           // cmp.href.go(params.fromUrl,params.pageParams);
            cmp.notification.toast(cmp.i18n("deeDataList.page.lable.select_none"),"center");
            return;
        }
        var data=[];
        var selectMasterId="";
        var success=false; //未选择返回false
        for(var i=0;i<_checkbox.length;i++){
            var s=JSON.parse( _checkbox[i].getAttribute("info").replace(/'/g,"\""));
            selectMasterId= s['column_@dee@newId@_id'];
            data.push(selectMasterId);
            success=true;
        }
        if(!isMasterField){
        	selectMasterId = data.join("|");
        }
        
        /**返回数据格式
         * {"selectMasterId":"6656545570502688891","success":true,"detailRows":"formson1-0,formson1-1,formson2-0,formson2-1,formson2-3"}
         */
        var returnObj={detailRows: "", masterId: selectMasterId,success: success};
        cmp.storage.save(params.pageKey,JSON.stringify({"metadata":params.metadata,"data":returnObj}),true);
        setTimeout(function(){
            cmp.href.go(params.fromUrl,params.pageParams);
        },200);
    });
}

function pageSearch(modelId) {
    var searchObj=[];
    //转换格式，生成搜索信息
    cmp.each(_fieldInfo.searchFieldList,function(i,obj){
        var _tempfield={};
        if(obj.fieldtype=="VARCHAR" || obj.fieldtype=="LONGTEXT"){
            _tempfield.type="text";
        }else if(obj.fieldtype=="TIMESTAMP"){
            _tempfield.type="text";
        }else if(obj.fieldtype=="DATETIME"){
            _tempfield.type="text";
        }else if(obj.fieldtype=="DECIMAL"){
            _tempfield.type="text";
        }
        _tempfield.condition=obj.name;
        _tempfield.text=obj.display;
        searchObj.push(_tempfield);
    });

//    var listState = $("#listState").val();

    cmp.search.init({
        id:"#search",
        model:{                    //定义该搜索组件用于的模块及使用者的唯一标识（如：该操作人员的登录id）搜索结果会返回给开发者
            name:"collaboration",   //模块名，如："协同"，名称开发者自定义
            id:modelId           //模块的唯一标识：
        },
        items : searchObj,
        callback:function(result){ //回调函数：会将输入的搜索条件和结果返回给开发者
            //var id = result.id;       //返回模块的唯一标识
            //var name = result.name;   //返回模块的名称
            var data = result.item;   //返回的搜索相关的数据
            var condition = data.condition;  //返回的搜索条件
            var dataSoure = data.type;        //搜索输入的数据  如果type="text",为普通文本，如果type="date":有begin和end时间属性
            var type  = data.type;       //搜索输入的数据类型有text和date两种

            if (type == "date") {
                dataSoure = dataSoure.begin + "#" + dataSoure.end;
            }
            //document.getElementById("CMP_SearchContent").style.display="none";
            params["searchName"]=condition;
            params["searchValue"]=result.searchKey[0];

            showContent();
            //bindEvent();
        }
    });
}

function   formatDate(now)   {
    var   year=now.getYear();
    var   month=now.getMonth()+1;
    var   date=now.getDate();
    var   hour=now.getHours();
    var   minute=now.getMinutes();
    var   second=now.getSeconds();
    return   month+"-"+date+" "+hour+":"+minute ;
}

//简化选择器
function _$(selector){
    return document.querySelector(selector)
}