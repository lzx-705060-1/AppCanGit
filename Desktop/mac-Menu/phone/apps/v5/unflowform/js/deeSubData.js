var params={};
var _fields;  //表格组件使用
var _fieldInfo; //返回的字段等信息
var tableNames = [];
//params.mutiselect =false;
cmp.ready(function(){

    cmp.backbutton();
    params=cmp.href.getParam();

    if(!params.allowCheck) {
         document.getElementById("footer").style.display = "none";
    }

    params.tag= (new Date()).getTime();
    //获取参数信息
    $s.CapForm.getDeeSubData({}, params, {
        success : function(ret) {
            if (ret.success) {
                _fieldInfo=ret.fieldInfo;

                var formson_tab = _$("#formson_tab_tpl").innerHTML;
                var segmentedControl=_$("#segmentedControl");
                //console.log(configData);
                var searchhtml = cmp.tpl(formson_tab, ret);
                segmentedControl.innerHTML = searchhtml;

                for (var i=0;i< _fieldInfo.length;i++) {
					tableNames[i] = _fieldInfo[i].tableName;
                    document.querySelector(".cmp-content").innerHTML+="<div id='tablelist"+i+"' class='cmp-control-content cmp-active'><div id='linkContainer"+i+"' class='container'></div></div>";
                    if(!params.allowCheck){
                        document.getElementById("linkContainer"+i).style.height=(window.innerHeight || document.body.clientHeight)-document.getElementById("segmentedControl").offsetHeight - document.querySelector('header').offsetHeight+'px';
                    }else{
                        document.getElementById("linkContainer"+i).style.height=(window.innerHeight || document.body.clientHeight)-document.getElementById("segmentedControl").offsetHeight -document.querySelector('header').offsetHeight-44+'px';
                    }


                }
                for (var i=0;i< _fieldInfo.length;i++) {
                    _fields={};
                    var s=0;
                    for (var j in _fieldInfo[i].dataSet[0]) {
                        _fields[j]=_fieldInfo[i].columHeader[s];
                        s++;
                    }
                    showContent(i);
                    if(i>0){
                        document.getElementById("tablelist"+i).classList.remove("cmp-active");
                    }

                }

                bindEvent();
            }
        }
    });

});
function showContent(i){
    cmp.tableList("#linkContainer"+i,{
        fields:_fields,//表头数据格式（必须）
        pageSize:500,
        params: [{tabindex:i}],
        type:(params.allowCheck?2:1),
        dataFunc:getListData, //配置加载数据的方法
        callback:function(data){

        }
    });
}
var getListData = function ( param, options) {

                var success = options.success;
                var returndata={};
                returndata.fields=_fields;
                var currtab=param.tabindex;
                returndata.data=_fieldInfo[currtab].dataSet;

                success(returndata);

}

//绑定图标事件
function bindEvent() {
    var backBtn = document.getElementById("backBtn");
    backBtn.addEventListener("tap", function(){
        //cmp.href.back();
        cmp.href.go("deeDataList.html",params);
    });
    cmp.backbutton.push(function(){
        cmp.href.go("deeDataList.html",params);
    })

    cmp(".cmp-control-content").on("click","input[type='checkbox'],input[type='radio']", function() {
        var _checkbox= document.querySelectorAll("input[type='checkbox']:checked,input[type='radio']:checked");
        if(_checkbox.length==0){
            document.getElementById("ok").innerText=cmp.i18n("deeDataList.page.lable.ok");
        }else{
            document.getElementById("ok").innerText=cmp.i18n("deeDataList.page.lable.ok").substring(0,2)+"("+_checkbox.length+")";
        }
    });

    document.getElementById("ok").addEventListener("tap",function(){
        var tables=document.querySelectorAll(".cmp-control-content");
        var selectMasterId=params.masterId;
        var detailRows="";
        for(var t=0;t<tables.length;t++){
            var _checkbox= tables[t].querySelectorAll("input[type='checkbox']:checked,input[type='radio']:checked");
            var data=[];
            for(var i=0;i<_checkbox.length;i++){
                var s=JSON.parse( _checkbox[i].getAttribute("info").replace(/'/g,"\""));
                detailRows+=tableNames[t]+ "-" + _checkbox[i].parentNode.parentNode.parentNode.rowIndex+",";
                data.push(s);
            }
        }

        /**返回数据格式
         * {"selectMasterId":"6656545570502688891","success":true,"detailRows":"formson1-0,formson1-1,formson2-0,formson2-1,formson2-3"}
         */

        if(detailRows!=""){
            detailRows=detailRows.substring(0,detailRows.length-1);
        }
        var returnObj={detailRows: detailRows, masterId: selectMasterId,success: true};
        cmp.storage.save(params.pageKey,JSON.stringify({"metadata":params.metadata,"data":returnObj}),true);
        cmp.href.go(params.fromUrl,params.pageParams);
    });
}

//简化选择器
function _$(selector){
    return document.querySelector(selector)
}