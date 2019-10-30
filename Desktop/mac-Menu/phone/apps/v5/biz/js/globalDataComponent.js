(function(_){
    _.globalDataComponent=function(params,callback){
        var htmlText='';
        console.log(params);
        var options={dashboardId:params.dashboardId,sectionId:params.sectionId};
        $s.CapForm.searchDashboardData4Section ({}, options, {
            repeat:true,   //当网络掉线时是否自动重新连接
            success: function (ret) {
                params.backgroundImage=_bizPath+'/img/bg_default.png';
                if (params.showType=="sectionTwoColMainInd" && params.backgroundImage) {  //背景图片
                    htmlText += '<div class="model-Background" style="background-image:url(' + params.backgroundImage + ');">';
                }
                htmlText += '<div class="model-title"><div class="model-title-icon">&nbsp;</div>' + params.sectionName;

                var indicatorsAuthor=false;

                var datas =ret.subIndicatorMap || [];
                var mainIndi;
                for (var key in ret) { //取主指标
                    if(key!="subIndicatorMap" && key!="success" && ret[key]!=null){
                        mainIndi=ret[key];
                        if(mainIndi.error=="0"){indicatorsAuthor=true;} //如果有一个指标有权限则显示
                    }
                }
                for (var i = 0; i < datas.length; i++) {
                    var data = datas[i];
                    if (data.error == "0") {indicatorsAuthor = true; }//如果有一个指标有权限则显示
                }

                if(params.linkId && indicatorsAuthor){
                    var data={linkId:params.linkId,linkType:params.linkType,auth:indicatorsAuthor};
                    var dataStr=JSON.stringify(data).replace(new RegExp('\"','gm'),'\'');
                    htmlText+= '<a class="show-more" dataStr="'+ dataStr +'" ></a>';
                }
                htmlText += '</div>';

                if(ret.success && indicatorsAuthor){//若栏目中设置的主副指标有一个以上的指标有权限查看，用户将看到此栏目中没有权限查看的主指标数据为：***
                    if (params.showType=="sectionOneColMainInd") { //如果配置了主指标
                        htmlText += '<div class="hasmaxfield-flex-box">' +
                            '<div class="normal-field-box">';
                    }
                    htmlText += '<ul id="ul'+params.sectionId+'" >'
                    for (var i = 0; i < datas.length; i++) {
                        var data = datas[i];
                        data.through = params.through;
                        data.queryId = params.subIndicatorList[i].queryId;
                        var eventStr="";
                        var dataStr = JSON.stringify(data).replace(new RegExp('\"', 'gm'), '\'');
                        //if(data.error=="0"){
                        //    eventStr='onclick="biz.globalDataComponent_click(' + dataStr + ')"';
                        //}
                        if (params.showType=="sectionTwoColMainInd") { //两列模式
                            htmlText += '<li dataStr="'+dataStr+'" class="field-list two-coll"><div class="field-value two-coll" style="color:' +  params.subIndicatorList[i].color + '" >' + data.value + (data.unit ? data.unit : '') + '</div><div class="field-title two-coll">' + data.name + '</div></li>';
                        } else if (params.showType=="sectionOneColMainInd") {  //单列+主副指标
                            htmlText += '<li dataStr="'+dataStr+'" class="field-list one-coll-hasmaxfield"><div class="field-title one-coll-hasmaxfield">' + data.name + (data.unit ? '<span class="unit">(' + data.unit + ')</span>' : '') + '：</div><div class="field-value one-coll-hasmaxfield" style="color:' +  params.subIndicatorList[i].color + '" >' + data.value + '</div></li>';
                        }else { //单列+副指标
                            htmlText += '<li dataStr="'+dataStr+'" class="field-list one-coll"><div class="field-title one-coll">' + data.name + (data.unit ? '<span class="unit">(' + data.unit + ')</span>' : '') + '：</div><div class="field-value one-coll" style="color:' +  params.subIndicatorList[i].color + '" >' + data.value + '</div></li>';
                        }
                    }

                    htmlText += '</ul>'
                    if (params.showType=="sectionOneColMainInd") { //如果配置了主指标
                        htmlText += '</div>';
                        if (mainIndi) {
                            var data =mainIndi;
                            data.through = params.through;
                            data.queryId = params.sourceId;
                            var dataStr = JSON.stringify(data).replace(new RegExp('\"', 'gm'), '\'');var eventStr="";
                            //if(data.error=="0"){
                            //    eventStr='onclick="biz.globalDataComponent_click(' + dataStr + ')"';
                            //}
                            htmlText += '<div dataStr="'+dataStr+'" class="max-field-box">' +
                                '<div class="max-field-value" style="color:' + data.color + '" >' + data.value + (data.unit ? data.unit : '') + '</div>' +
                                '<div class="max-field-title">' + data.name + '</div>' +
                                '</div></div>';
                        }
                    }
                    if (params.backgroundImage) { //背景图片
                        htmlText += '</div>';
                    }
                }else{//若栏目中设置的主副指标用户都不没有权限查看，用户将看到此栏目的空白状态：没有权限查看数据,请联系管理员
                    if(ret.errorMsg){
                        htmlText += '<div class="nodata"><span class="icon-see-icon-cap-xinxiguanli1"></span>'+ret.errorMsg+'</div>';
                    }else{
                        htmlText += '<div class="nodata"><span class="icon-see-icon-cap-xinxiguanli1"></span>'+cmp.i18n("biz.indicator.noauthor")+'</div>';
                    }
                }

                if(typeof(callback)=="function"){
                    callback(htmlText);
                    cmp.listView('#scroll').refresh();
                    cmp("#ul" + params.sectionId).on("tap","li", function() { //副指标绑定事件
                        _.globalDataComponent_click(this.getAttribute("dataStr"));
                    });

                    //主指标绑定事件
                    if(params.showType=="sectionOneColMainInd" && mainIndi && mainIndi.error=="0") {
                        document.getElementById(params.sectionId).querySelector(".max-field-box").addEventListener("tap", function () {
                            _.globalDataComponent_click(this.getAttribute("dataStr"));
                        });
                    }

                    //更多图标绑定事件
                    if(params.linkId && indicatorsAuthor) {
                        document.getElementById(params.sectionId).querySelector(".show-more").addEventListener("tap", function () {
                            _.globalDataComponentShowMore_click(this.getAttribute("dataStr"));
                        });
                    }
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
    }
    //点击指标项
    _.globalDataComponent_click=function(datastr){
        var data=cmp.parseJSON(datastr.replace(new RegExp("\'",'gm'),"\""));
        if(data.through && data.error=="0"){
            var formqueryreportArgs={itemType:"dosearch",listType:1,id:data.queryId};
            cmp.event.trigger("beforepageredirect",document);
            formqApi.jumpToFormqueryreport(formqueryreportArgs,"dashboard",data.queryId);
        }
    }

    //点击更多
    _.globalDataComponentShowMore_click=function(datastr) {
        var data=cmp.parseJSON(datastr.replace(new RegExp("\'",'gm'),"\""));
        var formqueryreportArgs = {itemType: (data.linkType == "4" ? "dosearch" :"dostatistics"), listType: (data.linkType == "4" ? 1 : 2), id: data.linkId};
        cmp.event.trigger("beforepageredirect", document);
        formqApi.jumpToFormqueryreport(formqueryreportArgs, "dashboard", data.linkId);
    }
})(biz);
