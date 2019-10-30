cmp.ready(function () {

    if (!cmp.platform.CMPShell) cmp.platform.wechatOrDD = true;
    //document.getElementById("content").style.marginTop = document.getElementsByClassName("search")[0].offsetHeight + "px";
    cmp.backbutton();//将Android返回按钮劫持
    cmp.backbutton.push(cmp.href.back);//向返回按钮堆栈加入回退到上一个页面的函数
    intiPage();//初始化页面，对页面中的显示进行初始化
    bindEvent();//给页面中的按钮绑定事件
});

function intiPage() {
	  $(".cmp-tab-item").each(function(index){
        if(index==0){
            this.addEventListener("tap",openfujian)
            //$(this).on("tap",openfujian);
        }else if(index==1){
            $(this).on("tap",openyijian)
        }else{
            $(this).on('tap',openliucheng)
        }
    })
    getOldAtricle();
    getFujian();
}
function openfujian(){
	alert("附件");
	 var extData = {}
    cmp.href.next("/seeyon/m3/apps/v5/portal/todo/html/old_fujian.html",extData,{openWebViewCatch: true,nativeBanner: false})
}
function openyijian(){
	alert("意见");
	 var extData = {}
    cmp.href.next("/seeyon/m3/apps/v5/portal/todo/html/old_yijian.html",extData,{openWebViewCatch: true,nativeBanner: false})
}
function openliucheng(){
	alert("流程");
	 var extData = {}
    cmp.href.next("/seeyon/m3/apps/v5/portal/todo/html/old_liucheng.html",extData,{openWebViewCatch: true,nativeBanner: false})
}
function bindEvent() {
	    document.getElementsByClassName("cmp-header-right")[0].addEventListener("tap",function(){
       /* var sdata = cmp.href.getParam()?cmp.href.getParam():urlParamObj;
		var data_bodytype= cmp.storage.get('data_bodytype');
		var data_input_xml= cmp.storage.get('data_input_xml');
		var data_xml= cmp.storage.get('data_xml');
        var isfromwx=urlParamObj?"true":""*/
		   var extData={
			/* "affairid":sdata.affairid,
            "create_date":sdata.create_date,
            "node_policy":sdata.node_policy,
            "processid":sdata.processid,
            "sendername":sdata.sendername,
            "summaryid":sdata.summaryid,
            "title":sdata.title,
            "data_bodytype":data_bodytype,
            "data_input_xml":data_input_xml,
            "data_xml":data_xml,
            "isfromwx":isfromwx*/
        }
        cmp.href.next("/seeyon/m3/apps/v5/portal/todo/html/old_banli.html",extData,{openWebViewCatch: true,nativeBanner: false})
    });

   /* document.getElementById("search").addEventListener("tap", function () {
        var infoName = $('#infoName').val();
        if (infoName == "" || infoName == null) {
            cmp.notification.alert("输入条件不能为空！", function () {
            }, "提示", "确定", "", false, false);
        } else {
            getListSuoSo(infoName, 1);
        }
    });*/
}


/***********************************************分割线***************************************************/
function getOldAtricle() {
	var paramObj = cmp.href.getParam();
	cmp.storage.save('serviceUrl',"http://10.1.9.144");
	cmp.storage.save('olduser',"oatest");
	cmp.storage.save('oldpwd',"666666");
	
		 var oid = paramObj.link_uniqueid;
		 cmp.storage.save('oid',oid);
		console.log("oid    "+oid);
		 $(".cmp-title").html(paramObj.link_title);
		console.log("paramObj.link_title    "+paramObj.link_title)
		 var serviceUrl = cmp.storage.get('serviceUrl');		
		 var phoneid = cmp.storage.get('phoneid');
		 var olduser = cmp.storage.get('olduser');
		 var oldpwd = cmp.storage.get('oldpwd');	 		 
            var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=oldoa_gw";
            url = url + "&username=" + olduser + "&password=" + oldpwd + "&PHONE_ID=" + phoneid + "&oid=" + oid;
			console.log(url);
            ajaxJson(url,httpsucess);
        }

 function httpsucess(data) {
            console.log(data);
            //先对xml进行处理,再对html进行处理
            var xml = data.contentXML.XML;
            var html = data.contentHTML.HTML;
            var tablehtml =data.contentHTML.TABLEHTML;
            var doctype=data.contentXML.DOCUMENTTYPE;
            var processGUID = data.contentXML.PROCESSGUID;
			 cmp.storage.save("processGUID", processGUID);
            var edites =  data.contentXML.EDITBUSINESSDOMAIN.split(',');
            var msg = "" ;
			cmp.storage.save("msg", '');
            
            $("#content").html(html);
            //拼接必填项
            xml = xml.replace("<?xml version=\"1.0\" encoding=\"utf-8\"\?>","<xml>");
            try{
                $(xml).find("Domain").each(function() {
                    var xmlAttr = $(this).attr("name");
                    var xmlText = $(this).text();
                    var xmlnull = $(this).attr("isnull");
                    var xmlreq =  $(this).attr("dm_req");
                    var xmlhidden=$(this).attr("displaytype");
                    if(doctype=="2"&&xmlnull=="0"&&xmlAttr.indexOf("备注")<0&&getKeyValue(edites,xmlAttr)){
                        if(xmlText==''||xmlText==null||xmlText=='请选择'){
                            msg += xmlAttr+':不能为空\r\n' ;
                        }
                    }else{
                        if(doctype=="0"&&xmlreq=="1"&&xmlAttr.indexOf("备注")<0&&getKeyValue(edites,xmlAttr)){
                            if(xmlText==''||xmlText==null||xmlText=='请选择'){
                                msg += xmlAttr+':不能为空\r\n' ;
                            }   
                        }
                    }
                    if (xmlAttr=="电子表单编号"){
					cmp.storage.save("oldformid", xmlText);
                     
                    }
                });
            }catch(e){
                console.error("出错了："+e);
            }
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
                                var scrHeight = $("#"+domainName)[0].scrollHeight
                                if(undefined!=scrHeight&&""!=scrHeight){
                                    $("#"+domainName).height(scrHeight)
                                }
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
            try{
                //设置重复行的数据
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
                                                var scrHeight = $(copyRepeatTableTr).find("#"+repeatDomainName)[0].scrollHeight
                                                if(undefined!=scrHeight&&""!=scrHeight){
                                                    $(copyRepeatTableTr).find("#"+repeatDomainName).height(scrHeight)
                                                }
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
                                                var scrHeight = $(copyRepeatTableTr).find("#"+repeatDomainName)[0].scrollHeight
                                                if(undefined!=scrHeight&&""!=scrHeight){
                                                    $(copyRepeatTableTr).find("#"+repeatDomainName).height(scrHeight)
                                                }
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
            if (msg!=''&& msg!=null){
                msg='此审批需要填写相关字段信息，暂不支持在移动端审批，请到电脑端审批。';
            }
			 cmp.storage.save('msg', msg);
           
            if (data.run){
                var run = data.run.RESULT ;
                eval(run);
            }
        }
        
        //判断值是否在数组中
        function getKeyValue(edites,name){
            var rst = false ;
            for ( i = 0; i < edites.length; i++) {
                if(edites[i]==name){
                    rst = true ;
                }
            }
            return rst ;
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
		 var serviceUrl = cmp.storage.get('serviceUrl');
    var phoneid = cmp.storage.get('phoneid');
    var olduser = cmp.storage.get('olduser');
	
	 var oldpwd = cmp.storage.get('oldpwd');
	  var processGUID = cmp.storage.get('processGUID');
	   var oid = cmp.storage.get('oid');

            var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=oldoa_detail&stype=fujian";
            url = url + "&username=" + olduser + "&password=" + oldpwd + "&PHONE_ID=" + phoneid + "&processGUID=" + processGUID+"&oid="+oid;
            ajaxJson(url, httpsucess1);
        }

        function httpsucess1(data) {
            var fujian = data.attach.RESULT ;
			 cmp.storage.save("oldfujian", fujian);
			 
           // uexWindow.evaluateScript("", 0, "showNum("+fujian.length+")");  
        }



