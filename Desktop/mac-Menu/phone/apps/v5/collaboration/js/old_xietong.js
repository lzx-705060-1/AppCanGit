cmp.ready(function(){
    if(!cmp.platform.CMPShell) cmp.platform.wechatOrDD = true;
    cmp.backbutton();//将Android返回按钮劫持
    cmp.backbutton.push(cmp.href.back);//向返回按钮堆栈加入回退到上一个页面并且注销的函数
    intiPage();//初始化页面，对页面中的显示进行初始化
    bindEvent();//给页面中的按钮绑定事件
});

var paramObj = cmp.href.getParam()
function intiPage(){
    getOldAtricle();
    getFujian()
    $(".cmp-tab-item").each(function(index){
        if(index==0){
            $(this).on("tap",openfujian);
        }else if(index==1){
            $(this).on("tap",openyijian)
        }else{
            $(this).on('tap',openliuchg)
        }
    })

}
//打开附件页面
function openfujian(){
    var extData = cmp.href.getParam()
    cmp.href.next(olddaibanBasePath+"/html/old_fujian.html",extData,{openWebViewCatch: true,nativeBanner: false})
}
//打开意见页面
function openyijian(){
    var extData = cmp.href.getParam()
    cmp.href.next(olddaibanBasePath+"/html/old_yijian.html",extData,{openWebViewCatch: true,nativeBanner: false})
}
//打开流程页面
function openliuchg(){
    var extData = cmp.href.getParam()
    cmp.href.next(olddaibanBasePath+"/html/old_liucheng.html",extData,{openWebViewCatch: true,nativeBanner: false})
}


function bindEvent(){

    //给头部返回按钮绑定事件
    document.getElementById("backBtn").addEventListener("tap",function(){
        cmp.href.back();//返回上一页面
    });
    //给头部右边按钮绑定事件
    document.getElementsByClassName("cmp-header-right")[0].addEventListener("tap",function(){
        cmp.href.next(olddaibanBasePath+"/html/banli.html",{},{openWebViewCatch: true,nativeBanner: false})
    });
    document.getElementById("fujian").addEventListener("tap",function(){
        //getFuJian();

    });
}

/***********************************************分割线***************************************************/
function getOldAtricle() {
    var oid = paramObj.uniqueid.toUpperCase();
    var title=paramObj.title
    $(".cmp-title").html(title)
    var serviceUrl = cmp.storage.get('ygzz_serviceUrl');
    var phoneid = cmp.storage.get('ygzz_phoneid');
    var olduser = cmp.storage.get('olduser');
    var oldpwd = cmp.storage.get('oldpwd');
    var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=oldoa_gw";
    url = url + "&username=" + olduser + "&password=" + oldpwd + "&PHONE_ID=" + phoneid + "&oid=" + oid;
    ajaxJson(url,httpsucess);
}

function httpsucess(data) {
    console.log(data);
    //先对xml进行处理,再对html进行处理
    var xml = data.contentXML.XML;
    var html = data.contentHTML.HTML;
    var tablehtml=data.contentHTML.TABLEHTML;
    $(".content").html(html);
    xml = xml.replace("<?xml version=\"1.0\" encoding=\"utf-8\"\?>","<xml>");
    //设置非重复行的数据
    try{
        $(xml).find("Domain").each(function(index,element){
            var parentNodeName01 = $(element).parent()[0].nodeName;
            var parentNodeName02 = $(element).parent().parent()[0].nodeName;
            if("ITEM"==parentNodeName01 && "BUSINESSTYPE"==parentNodeName02){
                var domainName = $(element).attr("name");
                var domainText = $(element).text();
                var domainIsnull = $(element).attr("isnull");
                if($("#"+domainName).length>0){
                    var domainNodeName = $("#"+domainName)[0].nodeName;
                    if("INPUT"==domainNodeName || "TEXTAREA"==domainNodeName){
                        $("#"+domainName).val(domainText);
                        $("#"+domainName).attr("value",domainText);
                    }else if("SELECT"==domainNodeName){
                        var domainSelectType = $(element).attr("type");
                        //设置下拉框的值
                        $("#"+domainName).find("option[value='"+domainText+"']").eq(0).prop("selected",true);
                        var optValue = $("#"+domainName)[0].value;
                        //设置之后,如果下拉框的值为"请选择"并且xml对应的值不为空,则以xml的对应的值为准
                        if('请选择'==optValue && ''!=domainText){
                            $("#"+domainName).find("option[value='请选择']").eq(0).prop('outerHTML','<option selected="selected" value='+domainText+'>'+domainText+'</option>');
                        }
                    }
                }
            }
        })
    }catch(e){
        console.error("出错了："+e);
    }
    //设置重复行的数据
    try{
        var tables= $("table");
        for (var i=0; i < tables.length; i++) {
            var curTable = tables[i];
            var curTableName = $(curTable).attr("id");
            if(''==curTableName || undefined==curTableName || null==curTableName){
                curTableName = $(curTable).attr("name");
            }
            if(''==curTableName || undefined==curTableName || null==curTableName){
                curTableName = $(curTable).attr("group_name");
            }
            if(''==curTableName || undefined==curTableName || null==curTableName){
                curTableName = $(curTable).attr("dm_name");
            }
            if(''!=curTableName && undefined!=curTableName && null!=curTableName){
                $(xml).find("Group[name='"+curTableName+"']").each(function(index2,element2){
                    $(element2).find("Item").each(function(index3,element3){
                        var rowIndex = $(element3).attr("rowIndex");
                        if(1==rowIndex){
                            //第一行是已存在的模板行,不需要clone()
                            var copyRepeatTableTr = $(curTable).find("tr[class='dynamicRow']");
                            $(element3).find("Domain").each(function(index4,element4){
                                var repeatDomainName = $(element4).attr("name");
                                var repeatDomainText = $(element4).text();
                                var repeatDomainIsnull = $(element4).attr("isnull");
                                if($(copyRepeatTableTr).find("#"+repeatDomainName).length>0){
                                    var repeatDomainNodeName = $(copyRepeatTableTr).find("#"+repeatDomainName)[0].nodeName;
                                    if("INPUT"==repeatDomainNodeName || "TEXTAREA"==repeatDomainNodeName){
                                        $(copyRepeatTableTr).find("#"+repeatDomainName).val(repeatDomainText);
                                        $(copyRepeatTableTr).find("#"+repeatDomainName).attr("value",repeatDomainText);
                                    }else if("SELECT"==repeatDomainNodeName){
                                        var repeatDomainSelectType = $(element4).attr("type");
                                        if("select-one"==repeatDomainSelectType){
                                            //设置下拉框的值
                                            $(copyRepeatTableTr).find("#"+repeatDomainName).find("option[value='"+repeatDomainText+"']").eq(0).prop("selected",true);
                                            var optValue = $(copyRepeatTableTr).find("#"+repeatDomainName)[0].value;
                                            //设置之后,如果下拉框的值为"请选择"并且xml对应的值不为空,则以xml的对应的值为准
                                            if('请选择'==optValue && ''!=repeatDomainText){
                                                $(copyRepeatTableTr).find("#"+repeatDomainName).find("option[value='请选择']").eq(0).prop('outerHTML','<option selected="selected" value='+repeatDomainText+'>'+repeatDomainText+'</option>');
                                            }
                                        }
                                    }
                                }
                            })
                        }else if(rowIndex>1){
                            //第二行是不存在的重复行,需要clone()
                            var copyRepeatTableTr = $(curTable).find("tr[class='dynamicRow']").last().clone();
                            $(copyRepeatTableTr).removeClass("dynamicRow");
                            $(copyRepeatTableTr).attr("id","tr"+rowIndex);
                            $(element3).find("Domain").each(function(index4,element4){
                                var repeatDomainName = $(element4).attr("name");
                                var repeatDomainText = $(element4).text();
                                var repeatDomainIsnull = $(element4).attr("isnull");
                                if($(copyRepeatTableTr).find("#"+repeatDomainName).length>0){
                                    var repeatDomainNodeName = $(copyRepeatTableTr).find("#"+repeatDomainName)[0].nodeName;
                                    if("INPUT"==repeatDomainNodeName || "TEXTAREA"==repeatDomainNodeName){
                                        $(copyRepeatTableTr).find("#"+repeatDomainName).val(repeatDomainText);
                                        $(copyRepeatTableTr).find("#"+repeatDomainName).attr("value",repeatDomainText);
                                    }else if("SELECT"==repeatDomainNodeName){
                                        var repeatDomainSelectType = $(element4).attr("type");
                                        if("select-one"==repeatDomainSelectType){
                                            //设置下拉框的值
                                            $(copyRepeatTableTr).find("#"+repeatDomainName).find("option[value='"+repeatDomainText+"']").eq(0).prop("selected",true);
                                            var optValue = $(copyRepeatTableTr).find("#"+repeatDomainName)[0].value;
                                            //设置之后,如果下拉框的值为"请选择"并且xml对应的值不为空,则以xml的对应的值为准
                                            if('请选择'==optValue && ''!=repeatDomainText){
                                                $(copyRepeatTableTr).find("#"+repeatDomainName).find("option[value='请选择']").eq(0).prop('outerHTML','<option selected="selected" value='+repeatDomainText+'>'+repeatDomainText+'</option>');
                                            }
                                        }
                                    }
                                }
                            })
                            var trLength = $(curTable).find("tr[id^='tr']").length;
                            if(trLength>0){
                                $($(curTable).find("tr[id^='tr']")[trLength-1]).after(copyRepeatTableTr);
                            }
                        }
                    })
                })
            }
        }
    }catch(e){
        console.error("出错了："+e);
    }
    //构建办理提交参数
    var paramData = data.contentXML.PARAM;
    var processGUID = data.contentXML.PROCESSGUID;
    cmp.storage.save('processGUID',processGUID);
    if (data.run){
        var run = data.run.RESULT ;
        eval(run);
    }
}
//从数组中找到某个对象值
function getValue(paramData,fkey){
    for ( i = 0; i < paramData.length; i++) {
        if(paramData[i].key==fkey){
            return paramData[i].value ;
        }
    }
}

function getFujian() {
    var serviceUrl = cmp.storage.get('ygzz_serviceUrl');
    var phoneid = cmp.storage.get('ygzz_phoneid');
    var olduser = cmp.storage.get('olduser');
    var oldpwd = cmp.storage.get('oldpwd');
    var processGUID = cmp.storage.get("processGUID") ;
    var oid = paramObj.uniqueid;
    var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=oldoa_detail&stype=fujian";
    url = url + "&username=" + olduser + "&password=" + oldpwd + "&PHONE_ID=" + phoneid + "&processGUID=" + processGUID+"&oid="+oid;
    ajaxJson(url, httpsucess1);
}

function httpsucess1(data) {
    var fujian = data.attach.RESULT ;
    cmp.storage.save('oldfujian',JSON.stringify(fujian));
    //uexWindow.evaluateScript("", 0, "showNum("+fujian.length+")");
    $("footer .cmp-tab-label").eq(0).html('附件(' + fujian.length + ')')
}
