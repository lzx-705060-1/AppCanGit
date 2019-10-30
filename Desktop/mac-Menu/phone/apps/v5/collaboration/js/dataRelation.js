var batchnum = 3; //由于存在性能问题，参照PC每次请求3个板块数据
var cacheKey_param = "m3_v5_collaboration_dataRelation"; //存放跳转后返回所需数据
var urlParam = {};
var pageX = {};
pageX.allPoIds = []; //存放未请求过的配置板块ID
pageX.pageConditions = {}; //存放查询条件
pageX.chartParams = []; //存放图形参数

/**
 * 接收参数描述
 * templateId   模板ID
 * activityId   节点ID
 * DR
 * affairId     事项ID
 * projectId    项目ID
 * summaryId    协同ID
 * memberId     人员ID
 */
cmp.ready(function() {
	urlParam = cmp.href.getParam();
	//从文件展示返回的读取传递过去的初始化参数
	if(urlParam.from == "file"){
		urlParam = urlParam.pageInfo.data;
	}
    initBackEvent();
    cmp.i18n.init(_collPath + "/i18n/", "Collaboration", function(){
    	initPageData();
        initEvent();
    },$verstion);
    LazyUtil.addLazyStack({
        "code" : "lazy_cap4ReportChart",
        "css" : [  _collPath+"/css/dataRelationChart.css"+ $verstion],
        "groups" : "reportChart",
        "js" : [
                _common_v5_path + "/cmp-resources/vreport/js/report-result-chart-mobile.js"+ $verstion
            ]});
    
    LazyUtil.addLazyStack({
        "code" : "lazy_cap4ReportMore",
        "groups" : "reportMore",
        "css" : [],
        "js" : [
                _cap4Path + "/cap4_m_api.s3js" + $verstion
            ]});
    LazyUtil.startLazy("reportChart");
    LazyUtil.startLazy("reportMore");
    
})

/**
 * 请求配置信息
 */
function initPageData(){
    cmp.storageDB.get(cacheKey_param, function(ret){
        if(ret.data != undefined){
            scrollTo(ret.data);
            return;
        }

        var templateId = urlParam.templateId;
        if(templateId == -1 || templateId == undefined){
            var affairState = urlParam.affairState;
            if(affairState == 3 || affairState == 4 || affairState == -1){
                var q_params = {
                    summaryId : urlParam.summaryId,
                    affairId : urlParam.affairId,
                    projectId : urlParam.projectId,
                    activityId : urlParam.activityId,
                    memberId : urlParam.memberId
                };
                $s.Coll.getSelfCollConfig(q_params,errorBuilder({
                    success : function(result) {

                        var configVOs = result.data.configVO;

                        pageX.configVOs = configVOs;//将结果数据缓存，后面用于数据处理
                        //生成所有模板种类
                        fillAllTypeHtml(result.data.configVO);

                        var poIds = "", pageConditions;
                        for(var i = 0 ; i < configVOs.length ; i++){
                            var po = configVOs[i];
                            poIds += po.id + ",";
                            pageX.pageConditions[po.id] = [];
                        }
                        loadData(poIds);
                    }
                }));
            }
        }else{
            //请求所有配置模块以及查询条件
            var q_params = {
                templateId : templateId,
                activityId : urlParam.activityId,
                DR : urlParam.DR,
                affairId : urlParam.affairId,
                projectId : urlParam.projectId,
                summaryId : urlParam.summaryId,
                memberId : urlParam.memberId
            };
            $s.Coll.getDataRelationByDR(q_params,errorBuilder({
                success : function(result) {

                    var configVOs = result.data.configVO;
                    var queryType = result.data.queryType;

                    if(configVOs.length == 0){
                    	return;
                    }
                    
                    pageX.configVOs = configVOs;//将结果数据缓存，后面用于数据处理

                    //生成所有模板种类
                    fillAllTypeHtml(result.data.configVO);

                    var poIds = "", pageConditions;
                    for(var i = 0 ; i < configVOs.length ; i++){
                        var po = configVOs[i];
                        //拼接此次需要请求的ID
                        if(i < batchnum){
                            poIds += po.id + ",";
                        }else{
                            pageX.allPoIds.push(po.id); //拼接未请求过的所有配置ID
                        }
                        //清理配置了查询条件的项
                        var queryInfos = queryType[po.id];
                        if(queryInfos.length > 0){
                            for(var j = 0 ; j < queryInfos.length ; j++){
                                var pageCondition = queryInfos[j];
                                if(JSON.stringify(urlParam.formData) != "{}"){
                                	pageCondition.fieldValue = urlParam.formData[pageCondition["fieldName"]].value;
                                	pageCondition[pageCondition.fieldName] = urlParam.formData[pageCondition["fieldName"]].value;
                                }
                                if(pageX.pageConditions[po.id] == undefined){
                                    pageX.pageConditions[po.id] = [];
                                }
                                pageX.pageConditions[po.id].push(pageCondition);
                            }
                        }else{
                            pageX.pageConditions[po.id] = [];
                        }
                    }
                    loadData(poIds);
                }
            }));
        }
    }, true);


}

/**
 * 请求数据
 */
function loadData(poIds){
    //请求配置的模板数据
    var q_params = {
        activityId : urlParam.activityId,
        DR : urlParam.DR,
        senderId : urlParam.senderId,
        templateId : urlParam.templateId,
        affairId : urlParam.affairId,
        formMasterId : urlParam.formMasterId,
        summaryId : urlParam.summaryId,
        memberId : urlParam.memberId,
        projectId : urlParam.projectId,
        poIds : poIds,
        nodePolicy : urlParam.nodePolicy,
        pageConditions : cmp.toJSON(pageX.pageConditions)
    };

    $s.Coll.getByDataRelationIds({},q_params,errorBuilder({
        success : function(result) {
            //生成所有的数据
            fillAllDataHtml(result.data);
            //循环请求
            if(pageX.allPoIds.length > 0){
                var ids = "";
                for(var i = 0 ; i < pageX.allPoIds.length && i < batchnum ; i++){
                    ids += pageX.allPoIds[i] + ",";
                }
                pageX.allPoIds.splice(0, batchnum);
                loadData(ids);
            }
        }
    }));
}

/**
 * 生成所有模板种类
 * @param data
 */
function fillAllTypeHtml(data){
    var tempTPL = _$("#html_modelName").innerHTML;
    var html = cmp.tpl(tempTPL, data);
    _$("#dataRelationInfo").innerHTML = html;
}

/**
 * 生成所有的数据
 * @param data
 */
function fillAllDataHtml(data){
    for(var obj in data){
        var modelType = "";
        var showColFieldList, showColNameList, showChart, showTable, imgId, imgType, pageSize;
        var imgData = [];
        //获取数据类型
        var configVO;
        for(var i = 0 ; i < pageX.configVOs.length; i++){
        	configVO = pageX.configVOs[i];
            if(configVO.id == obj){
                modelType = configVO.dataTypeName;
                if(modelType == "formSearch"){ //表单查询
                	showColFieldList = configVO.showColFieldList;
                	showColNameList = configVO.showColNameList;
                	pageSize = configVO.pageSize;
                }else if(modelType == "formStat"){ //表单统计
                	showChart = configVO.showChart;
                	showTable = configVO.showTable;
                	pageSize = configVO.pageSize;
                	for(var j = 0 ; configVO.chartItemList != null && j < configVO.chartItemList.length ; j++){
                	    imgData.push({
                            imgId : configVO.chartItemList[j].imgId,
                            imgType : configVO.chartItemList[j].type
                        })
                    }
                }
                break;
            }
        }
        //根据类型不同分别处理页面数据
        if(modelType == "templateDeal" || modelType == "selfColl"){ //模板数据
        	data[obj].sendtoother = configVO.sendToOther;
            fillTemplateDeal(obj, data[obj]);
        }else if(modelType == "traceWorkflow"){
            fillTraceWorkflow(obj, data[obj]);
        }else if(modelType == "templateSend"){ //模板数据(新建)
        	fillTemplateSend(obj, data[obj]);
        }else if(modelType == "formSearch"){ //表单查询
            fillFormSearch(obj, data[obj], showColFieldList, showColNameList, pageSize);
        }else if(modelType == "formStat"){ //表单统计
            fillFormStat(obj, data[obj], showChart, showTable, imgData, pageSize);
        }else if(modelType == "outSystem"){ //外部系统
            fillOutSystem(obj, data[obj]);
        }else if(modelType == "doc"){ //文档中心
        	fillDoc(obj, data[obj]);
        }else if(modelType == "project"){ //项目
            fillProject(obj, data[obj]);
        }
    }
}

/**
 * 生成模板数据
 * @param id
 * @param data
 */
function fillTemplateDeal(id, data){
    var tempTPL = _$("#html_templateDeal").innerHTML;
    var html = cmp.tpl(tempTPL, data);
    _$("#model_"+id).innerHTML = html;
}

/**
 * 生成追溯数据
 * @param id
 * @param data
 */
function fillTraceWorkflow(id, data){
	data.openFrom = "repealRecord";
    var tempTPL = _$("#html_traceWorkflow").innerHTML;
    var html = cmp.tpl(tempTPL, data);
    _$("#model_"+id).innerHTML = html;
}

/**
 * 生成模板数据(新建)
 * @param id
 * @param data
 */
function fillTemplateSend(id, data){
    var tempTPL = _$("#html_templateSend").innerHTML;
    var html = cmp.tpl(tempTPL, data);
    _$("#model_"+id).innerHTML = html;
}

/**
 * 生成表单查询
 * @param id
 * @param p_data
 * @param showColFieldList  需要展示的列（头部）
 * @param showColNameList   需要展示的ID对应
 * @param pageSize   配置需要展示的列数
 */
function fillFormSearch(id, p_data, showColFieldList, showColNameList, pageSize){
    var data = [], title = []
    //头部
    for(var i = 0 ; i < showColFieldList.length ; i++){
        title[i] = showColFieldList[i]["value"];
    }
    data[0] = title;
    var showCount = p_data.length > pageSize ? pageSize : p_data.length;
    //明细
    for(var i = 0 ; i < showCount ; i++){
        var d = p_data[i], detail = [];
        for(var j = 0 ; j < showColNameList.length ; j++){
        	
        	var nowtitle = showColNameList[j];
        	if(nowtitle.indexOf("#") > -1){
        		nowtitle = nowtitle.replace("#","_");
        	}
        	var value = d[nowtitle];
        	if(value == undefined){
        		detail[j] = '';
        	}else if(typeof(value) == "string"){
        		if(value){
            		detail[j] = value;
            	}else{
            		detail[j] = '';
            	}
        	}else{
        		detail[j] = value.showvalue
        	}
            
        }
        data[i+1] = detail;
    }
    var tempTPL = _$("#html_formSearch").innerHTML;
    var html = cmp.tpl(tempTPL, data);
    _$("#model_"+id).innerHTML = html;
}

function getConfigById(poId){
	for (var i = 0; i < pageX.configVOs.length; i++) {
		var po = pageX.configVOs[i];
		if(poId ==  po.id){
			return po;
		}
	}
}
//function parseDom(arg) {
//
//	　　 var objE = document.createElement("div");
//
//	　　 objE.innerHTML = arg;
//
//	　　 return objE.childNodes;
//
//	}
//function showCap3Tab2(hearders,datas,showColFieldList,po,tpl){
//		//显示的列
//		var showColFieldNameList = [];
//		if(showColFieldList && showColFieldList.length > 0){
//		    for(var i = 0, l = showColFieldList.length; i < l; i++){
//		        showColFieldNameList.push(showColFieldList[i].display);
//		    }
//		}
//		
//		//pageSize统计不能分页， 通过js进行处理
//		var tempLength = datas.length;
//		if(tempLength > po.pageSize){
//		    tempLength = po.pageSize;
//		    var newDatas = [];
//		    for(var i = 0; i < tempLength; i++){
//		        newDatas.push(datas[i]);
//		    }
//		    datas = newDatas;
//		}
//		
//	 if(po.showTable == 1){
//		 var tableHtml = "<li ><table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" class=\"only_table margin_b_20\">"+
//         "<tbody><tr><th width=\"40\" nowrap=\"nowrap\"></th></tr>"+
//         "<tr><td align=\"left\" nowrap=\"nowrap\" colspan=\"1\" rowspan=\"1\"></td></tr></tbody></table></li >";
//		var li =  $(tableHtml);
//			//parseDom(tableHtml)
//		//生成标题
//		var head = li.find("tr:first");
//		var th = $(head.html());
//		var heads = [];
//		var _head = $(head.prop("outerHTML"));
//		
//		for (var i = 0; i < hearders.length; i++) {
//			var row = hearders[i];
//			var headThs = [];
//			for (var j = 0; j < row.cells.length; j++) {
//				var cell = row.cells[j];
//				var thHtml = th.attr({"colspan":cell.colSpan,"rowspan":cell.rowSpan,"title":cell.display}).html(escapeStringToHTML(cell.display)).prop("outerHTML");
//				headThs.push(thHtml);
//			}
//			heads.push(_head.html(headThs.join("")).prop("outerHTML"));
//		}
//		
//		//生成数据
//		var row = li.find("tr:last");
//		var tr = $(row.prop("outerHTML"));
//		var td = row.find("td");
//		var trs = [];
//		for (var i = 0; i < datas.length; i++) {
//			var row = datas[i];
//			var tds =[];
//			for (var j = 0; j < row.cells.length; j++) {
//				var cell = row.cells[j];
//				var tdHtml = td.attr({"colspan":cell.colSpan,"rowspan":cell.rowSpan,"title":cell.display}).html(escapeStringToHTML(getLimitLength(cell.display,22))).prop("outerHTML");
//				tds.push(tdHtml);
//			}
//			trs.push(tr.html(tds.join("")).prop("outerHTML"));
//		}
//		
//		var _li = $(li.html());
//		_li.find("table").html(heads.join("") + trs.join(""));
//		tpl.append(_li);
//	}
//	
//}

/**
 * 生成表单统计
 * @param id
 * @param p_data
 * @param showChart 展示图形
 * @param showTable 展示表格
 * @param imgData 图形数据
 *      imgId 图形ID
 *      imgType 图形类别 (1-柱状图、3-折线图、7-雷达图、11-饼图)
 * @param pageSize   配置需要展示的列数
 */
function fillFormStat(id, p_data, showChart, showTable, imgData, pageSize){
	if(p_data.capType == "4"){
		var po = getConfigById(id);
		
		if(showTable == "1"){
			if(po == undefined){
	    		return;
	    	}
			
			var rowheader  = po.formCondMap.rowHeaders;
			var colHeaders = po.formCondMap.colHeaders;
			var statsFields = po.showColFieldList;
			var statsLength = 1;
			if(statsFields){
				statsLength = statsFields.length;
			}
			var headers =[];
			var tCell = {};
			var cells = [];
			var rowheaderheight = 1;
			if(colHeaders){
				rowheaderheight = 2;
			}
			var dataHeader = [];
			//首先组装我的rowHeader
			if(rowheader){
				for(var i = 0 ; i < rowheader.length ; i++){
					tCell = {};
					tCell["colSpan"] = 1;
					tCell["rowSpan"] = rowheaderheight;
					tCell["title"] = rowheader[i].aliasTableName+"_"+rowheader[i].name;
					tCell["display"] = rowheader[i].aliasDisplay;
					if(tCell["display"] == undefined){
						tCell["display"] = '' ;
					}
					cells[i] = tCell ;
					dataHeader[i] = tCell;
				}
				
			}
			
			var detailData = p_data.data;
			var filterDetailData = [];
			//如果存在列表头
			if(colHeaders){
				//从datalist中获取列表头数据
				for(var i =0 ; i<p_data.coldata.length;i++){
					var rowdata = p_data.coldata[i];
					
					tCell = {};
					tCell["colSpan"] = statsLength;
					tCell["rowSpan"] = 1;
					tCell["title"] = "";
					tCell["display"] = rowdata[0];
					if(tCell["display"] == undefined){
						tCell["display"] = '' ;
					}
					cells[cells.length] = tCell;
					}
				headers[0] = {};
				headers[0].cells = cells; //第一行数据组装完成
				headers[0].th = true;
				
				var dataColData = [];
				//找出col_数字开头的熟悉
				if(detailData.length > 0){
					var dataEntity = detailData[0];
					var newObject = {};
					for(var tempKey in dataEntity){
						if(tempKey.indexOf("col_") === 0){
							newObject[tempKey] = dataEntity[tempKey];
						}
					}
					dataColData[0] = newObject;
				}
				if(dataColData.length > 0){
					var dataEntity = dataColData[0];
					dataColData = [];
					var numberArr =new Array();
					for(var tempKey in dataEntity){
						var newObject = {};
						var number = tempKey;
							number = number.substr(number.indexOf("col_")+4);
							number = number.substr(0,number.indexOf("_"));
							var flag = true;
							if(numberArr.length == 0){
								numberArr.push(number); //第一个装入数组;
							}else{
								for(var n = 0; n< numberArr.length ; n++){
									if(number == numberArr[n]){
										flag =false 
										break ;
									}
								}
								if(flag){
									numberArr.push(number); //第一次装入数组;
								}
							}
							//这样的方式还是保存了 key
							if( flag == false){
								newObject =	dataColData[number] ;
								newObject[tempKey] = dataEntity[tempKey];
								dataColData[number] = newObject;
							}else{
								newObject[tempKey] = dataEntity[tempKey];
								dataColData[number] =newObject
							}
							
							
					}
					
				}
				var j = 0;
				cells =[];//第二行开始
				var k =0;
				for(var i =0 ;i<dataColData.length ;i++ ){
					var dataEntity = dataColData[i];
					for(var j =0 ; j<statsFields.length ;j++){
						var statsField = statsFields[j]
						var statsFileName = statsField.name;
						statsFileName = statsFileName.replace("#","_");
						for(var tempKey in dataEntity){
							if(tempKey =="col_"+i+"_"+ statsFileName){
								tCell = {};
								tCell["colSpan"] = 1;
								tCell["rowSpan"] = 1;
								tCell["title"] = tempKey;
								tCell["display"] = statsField.display;
								if(tCell["display"] == undefined){
									tCell["display"] = '' ;
								}
								cells[k] = tCell;
								dataHeader[dataHeader.length] = tCell;
								k++;
								break;
							}
							
						}
						
					}
					
					
				}
				headers[1] = {};
				headers[1].cells = cells; //第一行数据组装完成
				headers[1].th = true;
			}else{
				if(statsFields){
//					cells =[];//第二行开始
					for(var j =0 ; j< statsFields.length; j++){
						tCell = {};
						//装入所有的过滤项
						tCell["colSpan"] = 1;
						tCell["rowSpan"] = 1;
						var statsFieldName = statsFields[j].name;
						statsFieldName =statsFieldName.replace("#","_");
						tCell["title"] = statsFieldName;
						tCell["display"] = statsFields[j].display;
						if(tCell["display"] == undefined){
							tCell["display"] = '' ;
						}
						cells[cells.length] = tCell;
						dataHeader[dataHeader.length] =tCell;
					}
					
				}
				headers[0] = {};
				headers[0].cells = cells;
				headers[0].th = true;
			}
			//数据组装报表数据结果集合
			//首先组合rowheader 然后组合
				
				for(var i =0 ;i<detailData.length ;i++){
					filterDetailData[i] ={};
					cells =[];//组装data开始
					var dataEntity = detailData[i];
					for(var j =0 ;j<dataHeader.length ; j++){
						for(var tempKey in dataEntity){
							if(tempKey == dataHeader[j].title){
								tCell = {};
								tCell["colSpan"] = 1;
								tCell["rowSpan"] = 1;
								tCell["title"] = tempKey;
								tCell["display"] = dataEntity[tempKey][0];
								if(tCell["display"] == undefined){
									tCell["display"] ='';
								}
								cells[j] = tCell;
								break;
							}
							
						}
					}
					filterDetailData[i].cells =cells;
					filterDetailData[i].th =false;
				}
				if(headers.length > 0){
					if(filterDetailData.length >0){
						for(var j=0 ;j < filterDetailData.length ;j++){
							headers[headers.length] = filterDetailData[j];
						}
					}
					//明细
			    	var tempTPL = _$("#html_formCap4").innerHTML;
			    	var html = cmp.tpl(tempTPL, headers);
			    	_$("#model_"+id).innerHTML = html;
				}
	    }
		if(showChart == "1"){
			var chartData = [];
			 for(var i = 0 ; i < imgData.length ; i++){
				 var htmlKey = "img_"+id+"_"+i;
				 var imgType = imgData[i].imgType;
				 chartData.push({"chartId":htmlKey,"chartType":imgType,"po":po,"entity":p_data});
			 }
			for (var k = 0; k < chartData.length; k++) {
				var statsFields=new Array();
				var poject = chartData[k].po;
				var dataSList = chartData[k].entity;
				var domId = chartData[k].chartId;
				var showColFieldList = dataSList.show.currentShowFields.split(",");
				for(var j=0;j<showColFieldList.length;j++){
					for(var i=0;i<poject.formCondMap.statsFields.length;i++){
						var alisTableName = poject.formCondMap.statsFields[i].aliasTableName;
						var nowShowFiled = showColFieldList[j];
						nowShowFiled = nowShowFiled.substr(nowShowFiled.indexOf(".")+1);
						if((alisTableName+"#"+poject.formCondMap.statsFields[i].name == nowShowFiled)){
							poject.formCondMap.statsFields[i].penetrateEnable = false;//不允许穿透
							statsFields.push(poject.formCondMap.statsFields[i]);
						}
					}
				}
				//如果某个图标没有数据那么不显示
				if( statsFields.length > 0 ){
					//为了兼容静态报表修改条件下的问题 --过滤项在和查询的数据结果过滤一次
					var filterStatsFields = [];
					for(var i = 0; i<statsFields.length ;i++){
						for(var key in dataSList.data[0]){
							if(key.indexOf("col_0_")>-1){
								key = key.substr(4,key.length);
								key = key.substr(key.indexOf("_")+1,key.length);
							}
							if(key == (statsFields[i].aliasTableName +"_"+ statsFields[i].name) ){
								filterStatsFields.push(statsFields[i]);
								break;
							}
						}
					}
						//过滤项大于0 且手机地图不显示
						if(filterStatsFields.length >0 && chartData[k].chartType != '8'){
							var reportConfig ={designId:poject.formQueryId,rowHeaders:poject.formCondMap.rowHeaders,colHeaders:poject.formCondMap.colHeaders,statsFields:filterStatsFields,userConditions:dataSList.userConditions};
							var reportData ={data:dataSList.data,colData:dataSList.coldata};
							var otherAttr = {};
							var chartAttr = {chartType: chartData[k].chartType,maxResult:pageSize,showLegend:true};
							
							LazyUtil.addLoadedFn("lazy_cap4ReportChart",function(){
									reportResultChartApi.showContent({
										domId:domId,
										reportConfig:reportConfig,reportData:reportData,chartAttr:chartAttr,otherAttr:otherAttr
									});
			            		});
						}else{
							document.querySelector("#"+domId).style.display = "none";
						}
					}
				
			}

    	}
	}else{
		 if(showTable == "1"){
		    	var data = [], title = []
		    	//沒有配置信息
		    	if(p_data.report == undefined){
		    		return;
		    	}
		    	//头部
		    	var titleData =  p_data.report.hearders[0].cells;
		    	for(var i = 0 ; i < titleData.length ; i++){
		    		title[i] = titleData[i];
		    		title[i].rowSpan = 1;
		    		if(title[i].display == undefined){
		    			title[i].display ='';
		    		}
		    	}
		    	data[0] = title;
		    	//明细
		    	var detailData = p_data.report.datas;

		    	var showCount = detailData.length > pageSize ? pageSize : detailData.length;
		    	
		    	for(var i = 0 ; i < showCount ; i++){
		    		var d = detailData[i]["cells"], detail = [];
		    		for(var j = 0 ; j < d.length ; j++){
		    			detail[j] = d[j];
		    			if(detail[j].display == undefined){
		    				detail[j].display ='';
			    		}
		    		}
		    		data[i+1] = detail;
		    	}
		    	var tempTPL = _$("#html_formCap3").innerHTML;
		    	var html = cmp.tpl(tempTPL, data);
		    	_$("#model_"+id).innerHTML = html;
		    }
		 if(showChart == "1"){
		    	
	    		var chartList = p_data.chartList;
	            for(var i = 0 ; i < imgData.length ; i++){
	        	    var imgId = imgData[i].imgId;
	        	    var htmlKey = "img_"+id+"_"+i;
	        	    var imgType = imgData[i].imgType;
	                //获取配置的图形信息
	                var chartData;
	                for(var j = 0 ; j < chartList.length ; j++){
	                    var obj = chartList[j];
	                    if(obj.id == imgId){
	                        chartData = obj;
	                        break;
	                    }
	                }
	                if(chartData == undefined){
	                	continue;
	                }
	                var chartJSON = cmp.parseJSON(chartData.chartJSON);

	                //获取图形展示类别
	                var chartType;
	                if(imgType == "1"){
	                    chartType = "0";
	                }else if(imgType == "3"){
	                    chartType = "1";
	                }else if(imgType == "7"){
	                    chartType = "3";
	                }else if(imgType == "11"){
	                    chartType = "2";
	                }

	                //统计的结果
	                var mChartList = new Array();
	                //统计的分类
	                var serviesNames = new Array();
	                var seriesData = chartJSON.option.series;
	                for(var j = 0 ; j < seriesData.length ; j++){
	                    mChartList[j] = new Array();
	                    var tempData = seriesData[j].data;
	                    for(var k = 0 ; k < tempData.length ; k++){
	                        mChartList[j].push(tempData[k].value);
	                    }
	                    serviesNames.push(seriesData[j].name);
	                }

	                //统计的项
	                var lables = new Array();
	                var xAxisData = chartJSON.option.xAxis[0].data;
	                for(var j = 0 ; j < xAxisData.length ; j++){
	                    lables.push(xAxisData[j].value);
	                }

	                var chartParams = {
	                    id : htmlKey,
	                    chartType : chartType,
	                    mChartList : mChartList,
	                    lables : lables,
	                    serviesNames : serviesNames
	                }
	                pageX.chartParams.push(chartParams);

	                drawChart(htmlKey, chartType, mChartList, lables, serviesNames)
	    	}
	    	
	    }
	}
   
    
}

/**
 * 生成外部系统
 * @param id
 * @param data
 */
function fillOutSystem(id, data){
    var tempTPL = _$("#html_outSystem").innerHTML;
    var html = cmp.tpl(tempTPL, data[0]);
    _$("#model_"+id).innerHTML = html;
}

/**
 * 生成项目
 * @param id
 * @param data
 */
function fillProject(id, data){
    var tempTPL = _$("#html_project").innerHTML;
    var html = cmp.tpl(tempTPL, data);
    _$("#model_"+id).innerHTML = html;
}

/**
 * 生成文档中心
 * @param id
 * @param data
 */
function fillDoc(id, data){
    var tempTPL = _$("#html_doc").innerHTML;
    var html = cmp.tpl(tempTPL, data);
    _$("#model_"+id).innerHTML = html;
}

function initBackEvent(){
    cmp.backbutton();
    cmp.backbutton.push(_goBack);
    // _$("#goBackBtn").addEventListener("tap", _goBack);
}

function _goBack() {
    cmp.href.back();
}

/**
 * 初始化事件
 */
function initEvent(){
	// document.querySelector("#explain").addEventListener("tap", showExplain);
	
	//更多页面
	cmp("#dataRelationInfo").on("tap", ".sec-title .see-icon-v5-common-arrow-right", function() {
		var modelType = this.getAttribute("modelType");
		var capType =  this.getAttribute("capType");
		
		//根据类型不同分别处理更多跳转
        if(modelType == "templateDeal" || modelType == "templateSend" || modelType == "selfColl"){ //模板数据
            var params ={
            	modelType : modelType,
            	id : this.getAttribute("id"),
        		templateId : urlParam.templateId,
        		memberId : urlParam.memberId,
        		summaryId : urlParam.summaryId,
        		senderId : urlParam.senderId,
                affairId : urlParam.affairId,
                affairState : urlParam.affairState,
                title : this.getAttribute("title")
            };
            saveScrollTop();
            cmp.href.next(_collPath + "/html/dataRelationMore.html" + colBuildVersion, params);
        }else if(modelType == "formSearch"){ //表单查询
        	var formQueryId = this.getAttribute("formQueryId");
        	var formqueryreportArgs = {
        		itemType : "dosearch",
        		listType : "1",
        		id : formQueryId
        	};
            if(capType == '4'){
            	if(!cmp.platform.CMPShell){//是M3多个webView 其它的就是单个webView
            		saveScrollTop();
    			}
            	  LazyUtil.addLoadedFn("lazy_cap4ReportMore",function(){
            		  cap4Api.openFormQueryReport({
                		type:4,
                		appId:formQueryId
            		  });
              		});
            	
            }else{
            	saveScrollTop();
              	formqApi.jumpToFormqueryreport(formqueryreportArgs, "dataRelation", formQueryId);
            }
        	
        }else if(modelType == "formStat"){ //表单统计
        	var formQueryId = this.getAttribute("formQueryId");
        	var formqueryreportArgs = {
        		itemType : "dostatistics",
        		listType : "2",
        		id : formQueryId
        	};
            if(capType == '4'){
            	if(!cmp.platform.CMPShell){//是M3多个webView 其它的就是单个webView
            		saveScrollTop();
    			}
            	LazyUtil.addLoadedFn("lazy_cap4ReportMore",function(){
            			cap4Api.openFormQueryReport({
	                  		type:3,
	            			appId:formQueryId
            			});
            		});
            }else{
            	saveScrollTop();
            	formqApi.jumpToFormqueryreport(formqueryreportArgs, "dataRelation", formQueryId);
            }
        	
        }else if(modelType == "doc"){ //文档中心
            saveScrollTop();
        	$s.Docs.doclibs({},errorBuilder({
                success : function(result) {
                	var id, doc_lib_name;
                	for(var i = 0 ; i < result.length ; i++){
                		if(result[i].doclib_type == "1"){
                			id = result[i].doclib_id;
                			doc_lib_name = result[i].doclib_name;
                			break;
                		}
                	}
                	
                	var params = {
                		id : id,
                		doc_lib_name : doc_lib_name,
                        openFrom : "dataRelation",
                        isForm : false
                	}
                	cmp.href.next(_docPath + "/html/docList.html" + colBuildVersion, params);
                }
            }));
        }else if(modelType == "project"){ //项目
            saveScrollTop();
        	var params ={
            	modelType : modelType,
            	id : this.getAttribute("id"),
                title : this.getAttribute("title"),
                templateId : urlParam.templateId,
                affairId : urlParam.affairId
            };
            cmp.href.next(_collPath + "/html/dataRelationMore.html" + colBuildVersion, params);
        }
	});
	
	//外部系统
	cmp("#dataRelationInfo").on("tap", ".sec-outer .outSystem", function() {
		cmp.openWebView({
			url: this.getAttribute("url"),
			isNew: true,
			useNativebanner:true, //是否显示原生导航栏
			"iOSStatusBarStyle":"0", // ios状态栏颜色0=黑色 1=白色
			success: null,
			error: null
	    });
	});
	//穿透：模板数据
	cmp("#dataRelationInfo").on("tap", ".templateDeal", function() {
        saveScrollTop();
        var summaryId = this.getAttribute("summaryId");
        var _afID = this.getAttribute("affairId");
        if(this.getAttribute("sendtoother") && this.getAttribute("sendtoother") == "true"){
        	$s.Coll.getSenderAffairId(summaryId,{},errorBuilder({
                success : function(result) {
                	if(result.affairId){
                		_afID = result.affairId;
                	}
                	var params = {
        	        	summaryId : summaryId,
        	        	affairId : _afID
                	}
                	collApi.openSummary(params);
                }
            }));
        }else{
        	 var params = {
 	        	summaryId : summaryId,
 	        	affairId : _afID
        	 }
        	 collApi.openSummary(params);
        }
	});
	//穿透：追溯数据
	cmp("#dataRelationInfo").on("tap", ".traceWorkflow", function() {
        saveScrollTop();
        var summaryId = this.getAttribute("summaryId");
        var params = {
    		summaryId : summaryId,
    		affairId : this.getAttribute("affairId"),
    		openFrom : this.getAttribute("openFrom")
        }
        collApi.openSummary(params);
	});
	//穿透：项目
	cmp("#dataRelationInfo").on("tap", ".project", function() {
        saveScrollTop();
		_alert(cmp.i18n("collaboration.dataRelation.alter.projectDetail"));
	});
	//穿透：文档中心
	cmp("#dataRelationInfo").on("tap", ".doc", function() {
        saveScrollTop();

		var frType = this.getAttribute("frType");
		var frId = this.getAttribute("id");
		var sourceId = this.getAttribute("sourceId");
		var mimeTypeId = this.getAttribute("mimeTypeId");
		var backPageInfo = _collPath + "/html/dataRelation.html" + colBuildVersion;
		
		if (frType == 8) { //讨论
            bbsApi.jumpToBbs(sourceId, "pigeonhole", backPageInfo);
        } else if (frType == 7) { //调查
            inquiryApi.jumpToInquiry(sourceId, "1", backPageInfo);
        } else if (frType == 6) { //公告
            bulletinApi.jumpToBulletin(sourceId, "1", backPageInfo);
        } else if (frType == 5) { //新闻
            newsApi.jumpToNews(sourceId, "1", backPageInfo);
        } else if (frType == 1 || frType == 9) { //协同、流程表单
            collApi.openSummary({
                summaryId: sourceId,
                openFrom: "docLib",
                operationId: "1",
                docResId: frId
            });
        } else if (frType == 2) { //公文
            edocApi.openSummary({
                summaryId: sourceId,
                openFrom: "lenPotent",
                docResId: frId
            });
        } else if (frType == 4) { //会议
            meetingApi.jumpToMeetingSummary(sourceId, "docLib", backPageInfo);
        }
		
		//文件
		if((mimeTypeId >= 101 && mimeTypeId <= 122) || (mimeTypeId >= 21 && mimeTypeId <= 26)){
			var docParam = {
		        "drId": frId,
		        "isForm": false,
		        "isFormCol": false,
		        "source_fr_type": mimeTypeId,
		        "pageInfo": {
		        	url : backPageInfo,
		        	data : urlParam
		        },
		        "from" : "file"
		    }
			cmp.href.next(_docPath + "/html/docView.html" + colBuildVersion, docParam);
		}
		
		//文件夹
		if(mimeTypeId == "31"){
			var params = {
        		id : frId,
        		doc_lib_name : this.getAttribute("frName"),
                openFrom : "dataRelation",
                isForm : false
        	}
        	cmp.href.next(_docPath + "/html/docList.html" + colBuildVersion, params);
		}
	});
}

/**
 * 展示说明信息
 */
function showExplain(){
	var params ={
		templateId : urlParam.templateId
	};
	cmp.event.trigger("beforepageredirect",document);
	cmp.href.next(_collPath + "/html/instruction.html" + colBuildVersion, params);
}

/**
 * 存储当前滚动位置
 */
function saveScrollTop(){
	var pageParam = {
        top : _$("#dataRelationInfo").scrollTop,
		html : _$("#dataRelationInfo").innerHTML,
        chartParams : pageX.chartParams
	}
	cmp.storageDB.save(cacheKey_param, cmp.toJSON(pageParam), null, true);
}

/**
 * 滑动至
 */
function scrollTo(data){
    var pageParamsData = cmp.parseJSON(data);
    _$("#dataRelationInfo").innerHTML = pageParamsData.html;
    var chartParams = pageParamsData.chartParams;
    for(var i = 0 ; i < chartParams.length ; i++){
        var obj = chartParams[i];
        drawChart(obj.id, obj.chartType, obj.mChartList, obj.lables, obj.serviesNames);
    }
    _$("#dataRelationInfo").scrollTop = pageParamsData.top;
    cmp.storageDB["delete"](cacheKey_param, null, true);
    //重新将画图所需数据存入
    pageX.chartParams = pageParamsData.chartParams;
}

/**
 * 画图函数（根据图的类型，图的数据，和图列 画图）
 * @param chartType
 * @param mChartList
 * @param lables
 * @param serviesNames
 */
function drawChart(id, chartType, mChartList, lables, serviesNames) {
    var myChart = echarts.init(document.getElementById(id));
    if (chartType == 0) {//画柱状图
        //=============================================================================//
    	// Echarts3柱状图初始化
    	//=============================================================================//
    	var dataAxis = lables/*X轴*/, dataValues = mChartList/*数据值*/, dataLegend = serviesNames;/*图例*/
    	var option = {
    		backgroundColor: '#ffffff',
			grid: {
				left: 45	
			},
    		tooltip: {
				trigger: 'axis',
				axisPointer: {
					type : 'shadow'
				}
			},
			legend: {
				data: dataLegend
			},
			xAxis: [{
				type: 'category',
				data: dataAxis
			}],
			yAxis: [{
				type: 'value',
				axisLine: {
					show: false
				},
				axisTick: {
					show: false
				},
				axisLabel: {
					textStyle: {
						color: '#999'
					},
					formatter: function(v, i){
	                    v = (v + "").split("");
	                    var ss = "";
	                    for (var i = 0; i < v.length; i ++) {
	                        ss += v[i];
	                        if ((i+1) % 5 == 0) {
	                            ss += "\n"; 
	                        }
	                    }
	                    return ss;
	                }
				}
			}],
			dataZoom: [{
				type: 'inside'
			}],
			series: (function(){
				var series = [];
				for (var i = 0; i < dataLegend.length; i++) {
					var s = {
						type: 'bar',
						name: dataLegend[i],
						data: (function(){
							return dataValues[i].map(function(d){
								return Number(d);
							});
						})()
					};
					series.push(s);
				}
				return series;
			})()
    	};
    	myChart.setOption(option);
	    myChart.on('click', function (params) {
	    myChart.dispatchAction({
	          type: 'dataZoom',
	          startValue: dataAxis[Math.max(params.dataIndex - 6 / 2, 0)],
	          endValue: dataAxis[Math.min(params.dataIndex + 6 / 2, dataAxis.length - 1)]
	      });
	    });
    } else if (chartType == 1) {//画折线图
    	//=============================================================================//
    	// Echarts3折线图初始化
    	//=============================================================================//
    	var dataAxis = lables/*X轴*/, dataValues = mChartList/*数据值*/, dataLegend = serviesNames;/*图例*/
    	var option = {
    		backgroundColor: '#ffffff',
			grid: {
				left: 45	
			},
    		tooltip: {
				trigger: 'axis',
				axisPointer: {
					type : 'shadow'
				}
			},
			legend: {
				data: dataLegend
			},
			xAxis: [{
				type: 'category',
				data: dataAxis
			}],
			yAxis: [{
				type: 'value',
				axisLine: {
					show: false
				},
				axisTick: {
					show: false
				},
				axisLabel: {
					textStyle: {
						color: '#999'
					},
					formatter: function(v, i){
	                    v = (v + "").split("");
	                    var ss = "";
	                    for (var i = 0; i < v.length; i ++) {
	                        ss += v[i];
	                        if ((i+1) % 5 == 0) {
	                            ss += "\n"; 
	                        }
	                    }
	                    return ss;
	                }
				}
			}],
			dataZoom: [{
				type: 'inside'
			}],
			series: (function(){
				var series = [];
				for (var i = 0; i < dataLegend.length; i++) {
					var s = {
						type: 'line',
						name: dataLegend[i],
						data: (function(){
							return dataValues[i].map(function(d){
								return Number(d);
							});
						})()
					};
					series.push(s);
				}
				return series;
			})()
    	};
    	myChart.setOption(option);
	    myChart.on('click', function (params) {
	    myChart.dispatchAction({
	          type: 'dataZoom',
	          startValue: dataAxis[Math.max(params.dataIndex - 6 / 2, 0)],
	          endValue: dataAxis[Math.min(params.dataIndex + 6 / 2, dataAxis.length - 1)]
	      });
	    });
    } else if (chartType == 2) {//画雷达图
        //=============================================================================//
    	// Echarts3雷达图初始化
    	//=============================================================================//
        var indicators = lables/*X轴*/, dataValues = mChartList/*数据值*/, dataLegend = serviesNames;/*图例*/
        var option = {
        	backgroundColor: '#ffffff',
        	tooltip: {},
        	legend: {
				data: dataLegend
			},
			radar: {
				indicator: (function(){
					var min = 0, max = 0, e;
					for (var i = 0; i < dataValues.length; i ++) {
						for (var j = 0; j < dataValues[i].length; j++) {
							e = Number(dataValues[i][j]);
							if(e > max){
								max = e;
							}
							if(e < min){
								min = e;
							}
						}
					}
					return lables.map(function(e){
						return {name: e, min: min, max: max};
					});
				})(),
				radius : '65%',
                center: ['50%', '60%']
			},
			series: (function(){
				var series = [], serie = {name: cmp.i18n("collaboration.dataRelation.radarMap"), type: 'radar'}, data = [];
				for (var i = 0; i < dataLegend.length; i ++) {
					data.push({
						value: dataValues[i].map(function(e){
							return Number(e);
						}),
						name: dataLegend[i]
					});
				}
				serie.data = data;
				series.push(serie);
				return series;
			})()
        };
        myChart.setOption(option);
    } else if (chartType == 3) { //画饼图
    	//=============================================================================//
    	// Echarts3饼图初始化
    	//=============================================================================//
        var names = lables, values = mChartList[0];
    	myChart.setOption({
    		backgroundColor: '#ffffff',
    		tooltip : {
		        trigger: 'item',
		        formatter: "{b} : {c} ({d}%)"
		    },
    		legend: {
                x: 'center',
                y: 'top',
                data: names
            },
            series: [{
                type: 'pie',
                radius : '65%',
                center: ['50%', '60%'],
                avoidLabelOverlap: false,
                data: (function(){
                	var data = [];
                	for (var i = 0; i < names.length; i ++) {
                		data.push({name: names[i], value: values[i]});
                	}
                	return data;
                })(),
                itemStyle: {
	                emphasis: {
	                    shadowBlur: 10,
	                    shadowOffsetX: 0,
	                    shadowColor: 'rgba(0, 0, 0, 0.5)'
	                },
	                normal:{
	                    label: {
	                        position: 'inside',
	                        formatter:'{c}'
	                    }
	                }
	            }
            }]
        });
    }
}

/**
 * 根据文件后缀判断是否可以打开
 * @param fr_name
 */
function canOpen(fr_name, flag) {
    var suffix = "";
    if (fr_name.lastIndexOf(".mp3") > 0) {
        if (flag) {
            suffix = ".mp3"
            return suffix;
        } else {
            return true;
        }
    } else if (fr_name.lastIndexOf(".mp4") > 0) {
        if (flag) {
            suffix = ".mp4";
            return suffix;
        } else {
            return true;
        }
    } else if (fr_name.lastIndexOf(".amr") > 0) {
        if (flag) {
            suffix = ".amr";
            return suffix;
        } else {
            return true;
        }
    } else {
        if (flag) {
            return suffix;
        } else {
            return false;
        }
    }
}
/**
 * 字节大小转换
 */
function bytesToSize(bytes) {
	bytes = parseInt(bytes);
    if (bytes === 0)
        return "0 B";
    var k = 1024,
        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math
        .floor(Math.log(bytes) / Math.log(k));
    return parseInt((bytes / Math.pow(k, i)).toPrecision(3)) + sizes[i];
}