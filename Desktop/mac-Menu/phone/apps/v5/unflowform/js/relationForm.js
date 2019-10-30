var params={};
var toFormBean;
cmp.ready(function(){

    cmp.backbutton();
    params=cmp.href.getParam();
    params.colType =1;
    if(cmp.storage.get("relationForm_params",true)){
        params=cmp.parseJSON(cmp.storage.get("relationForm_params",true));
        if(params.colType==2){
            document.getElementById("tab_me").classList.remove("cmp-active");
            document.getElementById("item1mobile").classList.remove("cmp-active");
            document.getElementById("tab_other").classList.add("cmp-active");
            document.getElementById("item2mobile").classList.add("cmp-active");
        }
    }

    params.tag= (new Date()).getTime();
    showContent();
    bindEvent();

});
function showContent(){
    cmp.storage.save("relationForm_params",JSON.stringify(params),true);
    cmp.listView(params.colType ==1?"#contentView":"#contentView2", {
        config: {
//                captionType: 1,//下拉上拉控件显示类型
            isClear:false,
            crumbsID:new Date().getTime()+ params.colType+params.formId+ params["subject"]+params["startMemberName"]+params["createDate"],
            pageSize: 20,
            params: [{}],
            dataFunc:getListData,
            renderFunc: renderData
        },
        up: {
            contentdown: cmp.i18n("relationform.page.lable.load_more"),
            contentrefresh: cmp.i18n("relationform.page.lable.load_ing"),
            contentnomore: cmp.i18n("relationform.page.lable.load_nodata")
        }
    });
}
var getListData = function ( param, options) {
    params.pageNo=param.pageNo;
    params.pageSize=param.pageSize;
    params.pageSize=param.pageSize;
    document.querySelector(".pop-div").style.display="block";
    $s.CapForm.relationFlowFormList({}, params, {
        repeat:true,   //当网络掉线时是否自动重新连接
        success : function(ret) {
            if (ret.success) {
                var success = options.success;
                toFormBean=JSON.parse(ret.toFormBean);
                params.toFormBean=toFormBean;
                success(ret.flipInfo);
            }
            document.querySelector(".pop-div").style.display="none";
        },
        error:function(e){
            document.querySelector(".pop-div").style.display="none";
            var cmpHandled = cmp.errorHandler(e);
            if (cmpHandled) {
            } else {
                cmp.notification.toast(e.message, "center");
            }
        }
    });

}

function renderData(result, isRefresh) {
        var listTpl = _$("#datalist_li_tpl").innerHTML;
        var datalist=params.colType==1?_$("#me"):_$("#other");

    cmp.each(result,function(i,obj) {
        if( obj.createDate.indexOf(":")==-1){
            obj.createDate=formatDate(new   Date(parseInt(obj.createDate)));
        }
        obj.subject=obj.subject.replace(/"/g,"").replace(/'/g,"");//特殊字符处理
    });

        var html = cmp.tpl(listTpl, result);
        //console.log(isRefresh);
        //是否刷新操作，刷新操作直接覆盖数据
        if (result.length == 0 || isRefresh) {
            datalist.innerHTML = html;
        } else {
            cmp.append(datalist,html);
        }
      //  cmp.listView('#contentView').refresh();

    //行点击事件
    if( params.showView){
        var li=document.querySelectorAll(".cmp-list-cell-info");
        for(var i=0;i<li.length;i++){
            li[i].addEventListener("tap",function(){
                var s=JSON.parse( this.getAttribute("info").replace(/'/g,"\""));
                params.isFullPage=true;
                params.moduleId= s.summaryId;
                params.moduleType=1;
                params.rightId= s.operationId;
                params.contentType= s.bodyType;
                params.viewState= s.state;
                params.dataId= s.summaryId;
                params.tag= "relationSubForm";
                cmp.storage.save("relationSubForm_params",JSON.stringify(params),true);
                cmp.href.go(_unflowformpath +"/html/relationSubForm.html?date="+(new Date().getTime()), params);
            });
        }
    }
}


//绑定图标事件
function bindEvent() {
    cmp.backbutton.push(function(){
        cmp.storage.delete("relationForm_params",true);
        cmp.href.go(params.fromUrl,params.pageParams);
    })

    cmp(document).on("shown.tab", ".cmp-control-content", function (event) {
        if (event.detail.tabNumber == 0) {
            if( params.colType !=1){
                params.colType =1;
                if( document.getElementById("me").innerHTML.trim()==""){
                    params["subject"]="";
                    params["startMemberName"]="";
                    params["createDate"]="";
                    showContent();
                }
            }
        } else if (event.detail.tabNumber == 1) {
            if( params.colType !=2){
                params.colType =2;
                if( document.getElementById("other").innerHTML.trim()==""){
                    params["subject"]="";
                    params["startMemberName"]="";
                    params["createDate"]="";
                    showContent();
                }
            }
        }
        cmp.storage.save("relationForm_params",JSON.stringify(params),true);
        //切换本人/他人发起后，清空选择项
        var _checkbox= document.querySelectorAll("input[type='checkbox']:checked,input[type='radio']:checked");
        for(var i=0;i<_checkbox.length;i++){
            _checkbox[i].checked=false;
        }
        document.getElementById("ok").innerText=cmp.i18n("relationform.page.lable.ok");
    });


    var header_search_btn = document.getElementById("header_search_btn");
     header_search_btn.addEventListener("tap",function() {
       // var search_span=document.getElementById("search");
       // search_span.style.display=search_span.style.display=="block"?"none":"block";
         setTimeout(function(){
             pageSearch(params.formId);
         },300);

    });

    //单选按钮事件
    cmp(".cmp-control-content").on("click","input[type='checkbox'],input[type='radio']", function() {
        var _checkbox= document.getElementById(params.colType ==1?"contentView":"contentView2").querySelectorAll("input[type='checkbox']:checked,input[type='radio']:checked");
        if(_checkbox.length==0){
            document.getElementById("ok").innerText=cmp.i18n("relationform.page.lable.ok");
        }else{
            document.getElementById("ok").innerText=cmp.i18n("relationform.page.lable.ok").substring(0,2)+"("+_checkbox.length+")";
        }
        if(!params.mutiselect){
            if(this.checked){
                for(var i=0;i<_checkbox.length;i++){
                    if(_checkbox[i]!=this){
                        _checkbox[i].checked=false;
                    }
                }
            }
        }

    });


    document.getElementById("ok").addEventListener("tap",function(){
       var _checkbox= document.getElementById(params.colType ==1?"contentView":"contentView2").querySelectorAll("input[type='checkbox']:checked,input[type='radio']:checked");
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
            selectArray.push({masterDataId: s.summaryId,subData:subData});
        }
        /**返回数据格式
         *{toFormId:yyyy,selectArray:[{masterDataId:xxx,subData:[{tableName:formson_0001,dataIds:[]},{tableName:formson_0002,dataIds:[]}]},
                                      {masterDataId:xxx,subData:[{tableName:formson_0001,dataIds:[]},{tableName:formson_0002,dataIds:[]}]}]}
         */
        obj.selectArray = selectArray;
        cmp.storage.save(params.pageKey,JSON.stringify({"metadata":params.metadata,"data":obj}),true);
        setTimeout(function(){
            cmp.href.go(params.fromUrl,params.pageParams);
        },200);
    });
}

function pageSearch(modelId) {

    var searchObj = [{type:"text",condition:"subject",text:cmp.i18n("relationform.affairs.subject")}];
    if(params.colType ==2){
        searchObj.push({type:"text",condition:"startMemberName",text:cmp.i18n("relationform.affairs.sender")});
    }
    searchObj.push({type:"date",condition:"createDate",text:cmp.i18n("relationform.affairs.dateSend")});
    cmp.search.init({
        id:"#search",
        model:{                    //定义该搜索组件用于的模块及使用者的唯一标识（如：该操作人员的登录id）搜索结果会返回给开发者
            name:"relationform",   //模块名，如："协同"，名称开发者自定义
            id:modelId + params.colType          //模块的唯一标识：
        },
        parameter:null,
        items : searchObj,
        callback:function(result){ //回调函数：会将输入的搜索条件和结果返回给开发者
            //var id = result.id;       //返回模块的唯一标识
            //var name = result.name;   //返回模块的名称
            var data = result.item;   //返回的搜索相关的数据
            var condition = data.condition;  //返回的搜索条件
            var dataSoure ="";        //搜索输入的数据  如果type="text",为普通文本，如果type="date":有begin和end时间属性
            var type  = data.type;       //搜索输入的数据类型有text和date两种

            if (type == "date") {
                dataSoure = result.searchKey[0] + "#" + result.searchKey[1];
            } else {
                dataSoure = result.searchKey[0];
            }

            var tSearhContent = _$("#CMP_SearchContent");
            if(tSearhContent){
                tSearhContent.style.display = "none";
            }
            params["subject"]="";
            params["startMemberName"]="";
            params["createDate"]="";

            params[condition]=dataSoure;
            var datalist=params.colType==1?_$("#me"):_$("#other");
            datalist.innerHTML=null;
            showContent();
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
    return   month+"-"+date+" "+hour+":"+(minute>10?minute:"0"+minute);
}

//简化选择器
function _$(selector){
    return document.querySelector(selector)
}