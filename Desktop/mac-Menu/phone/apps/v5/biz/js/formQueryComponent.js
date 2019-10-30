(function(_) {
    _.formQueryComponent = function (params,callback) {
        var htmlText='';
        console.log(params);
        var options={dashboardId:params.dashboardId,sectionId:params.sectionId};
        $s.CapForm.searchDashboardData4Section ({}, options, {
            repeat:true,   //当网络掉线时是否自动重新连接
            success: function (ret) {
                var fields=ret.fields;
                var datas=ret.datas;
                htmlText+= '<div class="query-title"><div class="query-title-icon">&nbsp;</div>'+params.sectionName;
                if(params.showType!="sectionList" && ret.indicator){//指标+详情要在标题栏显示指标值
                    var indicator=ret.indicator;
                    if(indicator && indicator.error=="0"){
                        htmlText+='<span class="query-title-field">'+indicator.name+':</span><span class="query-title-value">'+(indicator.value?indicator.value:'')+'</span>';
                    }
                }
                if(params.hasMore && ret.error=="0" && datas.length>0){
                    params.datas=ret.datas;
                    params.error=ret.error;
                    var dataStr=JSON.stringify(params).replace(new RegExp('\"','gm'),'\'');
                    htmlText+= '<a class="show-more" dataStr="'+ dataStr +'" ></a>';
                }
                htmlText+= '</div>';

                if(ret.error=="0" && datas && datas.length>0){ //如果有权限并且有数据
                    if(params.showType=="sectionList"){
                        htmlText+= '<div id="tablescroll'+params.sectionId+'" class="formquery-table-scroll">'+
                            '<table  class="formquery-table">';
                        htmlText+= '<tr>';
                        for(var j=0;j<fields.length;j++){
                            htmlText+='<th>'+fields[j].title+'</th>';
                        }
                        htmlText+= '</tr>';

                        for(var i=0;i<datas.length;i++) {
                            var data = datas[i];
                            data.sourceId=params.sourceId;
                            var dataStr=JSON.stringify(data).replace(new RegExp('\"','gm'),'\'');
                            htmlText += '<tr dataStr="'+ dataStr +'" >';
                            for(var j=0;j<fields.length;j++){
                                var value=data[fields[j].name];
                                if(value==undefined){
                                    value="";
                                }
                                htmlText+='<td>'+value+'</td>';
                            }
                            htmlText += '</tr>';
                        }
                        htmlText+= '</<table></div>';
                    }else{
                        htmlText+= '<ul id="ul'+params.sectionId+'" class="formquery-rows">';
                        for(var i=0;i<datas.length;i++) {
                            var data = datas[i];
                            data.sourceId=params.sourceId;
                            var dataStr=JSON.stringify(data).replace(new RegExp('\"','gm'),'\'');
                            htmlText += '<li class="formquery-row" dataStr="'+ dataStr +'" >';
                            for(var j=0;j<(fields.length<3?fields.length:3);j++){
                                var value=data[fields[j].name];
                                if(value==undefined){
                                    value="";
                                }
                                htmlText+='<div class="field-'+(j+1)+'"><div class="field-title">'+fields[j].title+':</div><div class="field-value">'+value+'</div></div>';
                            }
                            htmlText += '</li>';
                        }
                        htmlText += '</ul>';
                    }
                }else{
                    if(ret.error=="1"){ //没权限
                        htmlText += '<div class="nodata"><span class="icon-see-icon-cap-xinxiguanli1"></span>'+cmp.i18n("biz.indicator.noauthor")+'</div>';
                    }else if(!datas || datas.length==0){//没数据
                        htmlText += '<div class="nodata"><span class="icon-see-icon-cap-xinxiguanli1"></span>'+cmp.i18n("biz.indicator.nodata")+'</div>';
                    }
                }

                if(typeof(callback)=="function"){
                    callback(htmlText);
                    if(params.showType=="sectionList") {
                        var tablescroll = document.getElementById("tablescroll" + params.sectionId);
                        if (tablescroll && tablescroll.offsetWidth < tablescroll.scrollWidth) {
                            cmp.scrollBox("#tablescroll" + params.sectionId, false);
                        }
                        cmp(tablescroll).on("tap","tr", function(){ //table绑定事件
                            _.formQueryComponent_click(this.getAttribute("dataStr"));
                        });
                    }else{
                        cmp("#ul" + params.sectionId).on("tap","li", function(){//ul绑定事件
                            _.formQueryComponent_click(this.getAttribute("dataStr"));
                        });
                    }
                    //更多图标绑定事件
                    if(params.hasMore && ret.error=="0" && datas.length>0) {
                        document.getElementById(params.sectionId).querySelector(".show-more").addEventListener("tap", function () {
                            _.formQueryComponentShowMore_click(this.getAttribute("dataStr"));
                        });
                    }
                    cmp.listView('#scroll').refresh();
                }
                return htmlText;
            },
            error:function(e){
                if(typeof(callback)=="function"){
                    callback(htmlText);
                }
                return htmlText;
            }

        });

    };

    //点击行
    _.formQueryComponent_click=function(datastr){
        var data=cmp.parseJSON(datastr.replace(new RegExp("\'",'gm'),"\""));
        _.formQueryComponentShowInfo(data.id,data.sourceId,null,null);
    }

    //点击更多
    _.formQueryComponentShowMore_click=function(datastr) {
        var data=cmp.parseJSON(datastr.replace(new RegExp("\'",'gm'),"\""));
        var formqueryreportArgs = {itemType: "dosearch", listType: 1, id: data.sourceId};
        cmp.event.trigger("beforepageredirect", document);
        formqApi.jumpToFormqueryreport(formqueryreportArgs, "dashboard", data.sourceId);

    }

    //表单查询点击某条数据后穿透
    _.formQueryComponentShowInfo=function (aId, aQueryId, aCallBackFunc,headText) {
        var fParams = {
            "aId": aId,
            "aQueryId": aQueryId
        };
        var backPageInfo = {};
        backPageInfo.data = "";
        backPageInfo.url = "";
        $s.CapForm.getFormQueryViewParams({}, fParams, {
            repeat:true,   //当网络掉线时是否自动重新连接
            success: function (ret) {
                console.log(ret)
                if (1 == ret.moduleType) {
                   // collApi.jumpToColSummary(ret.summaryID, "formQuery");
                    collApi.openSummary({
                        'openFrom' : "formQuery",
                        'summaryId' : ret.summaryID,
                        'operationId' : "",
                        'newWebView' : true
                    });

                } else {

                    var options = {
                        name: headText,
                        moduleId: ret.moduleID,
                        moduleType: ret.moduleType,
                        rightId: ret.rightID,
                        viewState: '1',
                        from:"dashboard"

                    };
                    cmp.openUnflowFormData(options);
                }
            },
            error: function (ret) {
                //console.log(ret);
                var msg;
                var canNotPenetrateMsg=cmp.i18n("biz.indicator.notallow");
                if("string"==typeof ret){
                    if("object" == typeof(JSON.parse(ret))&&canNotPenetrateMsg==JSON.parse(ret).message.replace(/[^\u4e00-\u9fa5]+/g, '') ){
                        msg = JSON.parse(ret).message.replace(/[^\u4e00-\u9fa5]+/g, '')+"!";
                        cmp.notification.toast(msg, 'bottom', 1500);
                    }
                }else if("object"==typeof ret){
                    if(canNotPenetrateMsg==ret.message.replace(/[^\u4e00-\u9fa5]+/g, '')){
                        msg = ret.message.replace(/[^\u4e00-\u9fa5]+/g, '')+"!";
                        cmp.notification.toast(msg, 'bottom', 1500);
                    }
                }

            }
        });
    };
})(biz);
