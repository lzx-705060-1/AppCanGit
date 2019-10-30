cmp.ready(function() {
            $("#title").html(cmp.storage.get("link_title"));
            var titHeight = $('#header').offset().height;
            
            //appcan.frame.open("content", "gw_atricle_content.html", 0, titHeight);
            //console.log('----------');
            var title=cmp.storage.get("link_title");
            
            if(title.indexOf("OA机器人")!=-1)
            {
               cmp.notification.alert({
                            title : "提醒",
                            content : "OA机器人自动发起的单据暂不支持在移动端审批，请到电脑端审批。",
                            buttons : '确定',
                            callback : function(err, data, dataType, optId) {
                                console.log(err, data, dataType, optId);
                              //  return ;
                                cmp.href.back();
                            }
                        });  
                        $("#nav-right").removeClass('nav-btn');
                        $("#nav-right").hide();
            }
			getOldAtricle();
			getFujian();
			waterMark2("content");
        });
        var tabview = appcan.tab({
            selector : "#footer",
            hasIcon : true,
            hasAnim : false,
            hasLabel : true,
            hasBadge : true,
            index : -1,
            data : [{
                label : "附件",
                icon : "fa-building-o"
            }, {
                label : "意见",
                icon : "fa-user"
            }, {
                label : "流程",
                icon : "fa-list"
            }]
        });
        tabview.on("tap", function(obj, index) {
            //appcan.window.selectMultiPopover("content", index);
            $(".item").removeClass("sc-text-active");
            //$(".item").eq(0).addClass("sc-text-active");
            //console.log(;
            //打开窗口
            switch(index) {
            case 2:
                //console.log('0');
                cmp.href.next({
                    name : 'old_liucheng',
                    data : 'old_liucheng.html',
                    aniId : 10,
                    type:4
                });
                break;
            case 1:
                //console.log('0');
                cmp.href.next({
                    name : 'old_yijian',
                    data : 'old_yijian.html',
                    aniId : 10,
                    type:4
                });
                break;
            case 0:
                cmp.href.next({
                    name : 'old_fujian',
                    data : 'old_fujian.html',
                    aniId : 10,
                    type:4
                });
                break;
            }
        })
		$("#nav-left").on("tap", function(){
            cmp.href.back();
            cmp.storage.save("link_uniqueid", "");
            cmp.storage.save("link_title", "");
          //  cmp.storage.save("defaultfontsize","16px");
        })
		$("#nav-right").on("tap", function(){
            cmp.href.next({
                    name : 'old_banli',
                    data : 'old_banli.html',
                    aniId : 10,
                    type:4
                });
        })
        function showNum(num){
            console.log($(".item").eq(0).children().last());
            $(".item").eq(0).children().last().html('附件('+num+')');
        }
		
		function getOldAtricle() {
		    var oid = cmp.storage.get("link_uniqueid").toUpperCase();
		    var serviceUrl = cmp.storage.get('serviceUrl');
		    var phoneid = cmp.storage.get('phoneid');
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
		    var tablehtml =data.contentHTML.TABLEHTML;
		    var doctype=data.contentXML.DOCUMENTTYPE;
		    var processGUID = data.contentXML.PROCESSGUID;
		    cmp.storage.save('processGUID',processGUID);
		    var edites =  data.contentXML.EDITBUSINESSDOMAIN.split(',');
		    var msg = "" ;
		    cmp.storage.save('msg','');
		    $(".content").html(html);
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
		               cmp.storage.save('oldformid',xmlText);
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
		    cmp.storage.save('msg',msg);
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
		    var processGUID = cmp.storage.get("processGUID") ;
		    var oid = cmp.storage.get("link_uniqueid");
		    var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=oldoa_detail&stype=fujian";
		    url = url + "&username=" + olduser + "&password=" + oldpwd + "&PHONE_ID=" + phoneid + "&processGUID=" + processGUID+"&oid="+oid;
		    ajaxJson(url, httpsucess1);
		}
		
		function httpsucess1(data) {
		    var fujian = data.attach.RESULT ;
		    cmp.storage.save('oldfujian',fujian);
		    uexWindow.evaluateScript("", 0, "showNum("+fujian.length+")");  
		}