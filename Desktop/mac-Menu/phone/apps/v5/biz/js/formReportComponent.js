(function(_) {
	//表单统计-列表的显示
    _.formReportComponent = function (params,callback) {
        var htmlText='';
        console.log(params);
        var options = {
            "aId": params.sourceId,
            "aListType": 2,
            "srcFrom":"dashboard"
        };

        $s.CapForm.searchForm({}, options, {
            success: function (ret) {
                console.log(ret);
                htmlText += _.getReportTitleHtml(params,true);
                if(null == ret.data || ret.data.result.length == 0){//没数据
                    htmlText += '<div class="nodata"><span class="icon-see-icon-cap-xinxiguanli1"></span>'+cmp.i18n("biz.indicator.nodata")+'</div>';
                }else{
                	if(params.showType == "sectionList"){//列表
                		htmlText += _.getReportGridHtml(ret.data,params);
                	}else if(params.showType == "sectionGraph"){//图
                		htmlText += '<div id="chart'+params.sectionId+'" class="report-chart"></div>';
                	}
                }
                
                if(typeof(callback)=="function"){
                    callback(htmlText);
                    if( ret.data.result.length != 0){
                    	if(params.showType == "sectionList"){//列表
                    		cmp.scrollBox("#tablescroll"+params.sectionId,false);
                    	}else if(params.showType == "sectionGraph"){//图
                    		var formChartList = ret.reportdata.formChartList;
                    		for(var i=0;i<formChartList.length;i++){
                    			if(ret.reportdata.formChartList[i].id == params.graphId){
                    				var chartData = ret.reportdata.formChartList[i];//OA-127985
                    				var myChart;
									if(typeof echarts !="undefined"){
										myChart= echarts.init(document.querySelector("#chart"+params.sectionId));
										if(params.graphType == 1){//柱状图
											_.renderBarOption(myChart,chartData);
										}else if(params.graphType == 3){//折线图
											_.renderLineOption(myChart,chartData);
										}else if(params.graphType == 7){//饼图
											_.renderPieOption(myChart,chartData);
										}else if(params.graphType == 11){//雷达图
											_.renderRadarOption(myChart,chartData);
										}
									}else{
										cmp.asyncLoad.js([common_v5_path + "/echarts3/echarts.min.js"], function () {
											myChart= echarts.init(document.querySelector("#chart"+params.sectionId));
											if(params.graphType == 1){//柱状图
												_.renderBarOption(myChart,chartData);
											}else if(params.graphType == 3){//折线图
												_.renderLineOption(myChart,chartData);
											}else if(params.graphType == 7){//饼图
												_.renderPieOption(myChart,chartData);
											}else if(params.graphType == 11){//雷达图
												_.renderRadarOption(myChart,chartData);
											}
										});
									}
                    			}
                    		}
                    	}
                    }
                    cmp.listView('#scroll').refresh();
                }
                return htmlText;
            },
            error: function (ret) {
            	console.log(ret);
                if(ret.message && (ret.message=="您无权限操作，请联系表单管理员" || ret.message == "You do not have permission to operate, contact form administrator")){//&& ret.message=="您无权限操作，请联系表单管理员"
                	htmlText += _.getReportTitleHtml(params,false);
                	htmlText += '<div class="nodata"><span class="icon-see-icon-cap-xinxiguanli1"></span>'+cmp.i18n("biz.indicator.noauthor")+'</div>';
                }else{
                	var cmpHandled = cmp.errorHandler(error);
                	if(cmpHandled){
                		//cmp处理了这个错误
                	}else {
                		//customHandle(error) ;//走自己的处理错误的逻辑
                	}
                }
            	if(typeof(callback)=="function"){
                    callback(htmlText);
                }
                return htmlText;
            }
        });
    };
    //获取统计看板标题html
    _.getReportTitleHtml = function(params,hasMore){
    	var htmlText = '';
    	htmlText += '<div class="report-title"><div class="report-title-icon">&nbsp;</div>'+params.sectionName;
    	if(hasMore && params.hasMore){
            var dataStr=JSON.stringify(params).replace(new RegExp('\"','gm'),'\'');
            htmlText+= '<a class="show-more" onclick="biz.formReportComponentShowMore_click('+ dataStr +')" ></a>';
    	}
        htmlText += '</div>';
        return htmlText;
    }
    //获取统计表格内容Html
    _.getReportGridHtml = function(resultData,params){
    	var htmlText = '';
        htmlText += '<div id="tablescroll'+params.sectionId+'" class="formreport-table-scroll">';
        htmlText += '<table class="formreport-table">';
        //显示标题
        var fields = resultData.metadata;
        htmlText+= '<tr>';
        for(var j=0;j<fields.length;j++){
        	htmlText+='<th colspan=\"'+fields[j].colSpan+'\" rowspan=\"'+fields[j].rowSpan+'\">'+fields[j].title+'</th>';
        }
        htmlText+= '</tr>';
        var cfields = resultData.crossMetadata;
        if(null != cfields && cfields != 0){
        	htmlText+= '<tr>';
            for(var j=0;j<cfields.length;j++){
            	htmlText+='<th colspan=\"'+cfields[j].colSpan+'\" rowspan=\"'+cfields[j].rowSpan+'\">'+cfields[j].title+'</th>';
            }
            htmlText+= '</tr>';
        }
        //显示内容
        var datas = resultData.result;
        var dataLength = datas.length < params.rows ? datas.length : params.rows;
        for(var i=0;i<dataLength;i++) {
        	var data = datas[i];
        	htmlText += '<tr>';
        	//TODO 后台返回的数据在每一行前端加了一个空，这里需要单独处理
        	for(var j=1;j<data.length+1;j++){
        		var value=data[j];
        		if(value==undefined){
        			value="";
        		}
        		htmlText+='<td>'+value+'</td>';
        	}
        	htmlText += '</tr>';
        }
        htmlText += '</table>';
        htmlText += '</div>';
        return htmlText;
    }
    //点击更多
    _.formReportComponentShowMore_click=function(data) {
        console.log(data);
        var formqueryreportArgs = {itemType: "dostatistics", listType: 2, id: data.sourceId};
        cmp.event.trigger("beforepageredirect", document);
        formqApi.jumpToFormqueryreport(formqueryreportArgs, "dashboard", data.sourceId);
    }
    //柱状图
    _.renderBarOption = function(myChart,chartData){
    	var dataAxis = chartData.indexNames;
    	var serieData = new Array();
    	for(var i=0;i<chartData.serviesNames.length;i++){
			serieData[i] = {
	            type:'bar',
                name:chartData.serviesNames[i],
	            data:chartData.dataList[i]
	        };
		}
    	var option = {
    		backgroundColor: '#ffffff',
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:chartData.serviesNames
            },
    	    xAxis: {
    	        data: dataAxis,
    	        axisLabel: {
    	            inside: false
    	        },
    	        axisTick: {
    	            show: false
    	        },
    	        axisLine: {
    	            show: false
    	        },
    	        z: 10
    	    },
    	    yAxis : [{
                type : 'value',
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
            grid: {
                left: 45
            },
    	    dataZoom: [{
    	         type: 'inside'
    	    }],
    	    series: serieData
    	};
    	myChart.setOption(option);
    	// Enable data zoom when user click bar.
//    	var zoomSize = 6;
//    	myChart.on('click', function (params) {
//    	    console.log(dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)]);
//    	    myChart.dispatchAction({
//    	        type: 'dataZoom',
//    	        startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
//    	        endValue: dataAxis[Math.min(params.dataIndex + zoomSize / 2, dataAxis.length - 1)]
//    	    });
//    	});
    }
    //折线图
    _.renderLineOption = function(myChart,chartData){
    	var serieData = new Array();
    	for(var i=0;i<chartData.serviesNames.length;i++){
			serieData[i] = {
	            name:chartData.serviesNames[i],
	            type:'line',
	            label: {
	                normal: {
	                    show: true,
	                    position: 'top'
	                }
	            },
	            //areaStyle: {normal: {}},
	            data:chartData.dataList[i]
	        };
		}
    	var option = {
    			backgroundColor: '#ffffff',
    		    tooltip : {
    		        trigger: 'axis'
    		    },
    		    legend: {
    		        data:chartData.serviesNames
    		    },
    		    grid: {
    		        left: 45
    		    },
    		    xAxis : [
    		        {
    		            type : 'category',
    		            boundaryGap : false,
    		            data : chartData.indexNames
    		        }
    		    ],
    		    yAxis : [{
                    type : 'value',
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
    		    series : serieData
    		};
    	myChart.setOption(option);
    }
    //饼图
    _.renderPieOption = function(myChart,chartData){
    	var serieData = new Array();
    	for(var i=0;i<chartData.indexNames.length;i++){
			serieData[i] = {"name": chartData.indexNames[i],"value": chartData.dataList[0][i]};
		}
    	var option = {
    			backgroundColor: '#ffffff',
    		    tooltip : {
    		        trigger: 'item',
    		        formatter: "{b} : {c} ({d}%)"
    		    },
    		    legend: {
    		        orient: 'horizontal',
    		        data: chartData.indexNames
    		    },
    		    series : [
    		        {
    		            type: 'pie',
    		            radius : '50%',
    		            center: ['50%', '60%'],
    		            data:serieData,
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
    		        }
    		    ]
    		};
    	myChart.setOption(option);
    }
    //雷达图
    _.renderRadarOption = function(myChart,chartData){
    	var dataMaxs = 1;
    	var serieData = new Array();
    	for(var i=0;i<chartData.serviesNames.length;i++){
    		serieData[i] = {
                value : chartData.dataList[i],
                name : chartData.serviesNames[i]
            };
    		dataMaxs = _.getRadarMax(dataMaxs,chartData.dataList[i]);
		}
    	var indicatorData = new Array();
        dataMaxs = Math.ceil(1.2 * dataMaxs);
    	for(var i=0;i<chartData.indexNames.length;i++){
    		indicatorData[i] = { name: chartData.indexNames[i], max:dataMaxs};
    	}
    	var option = {
    			backgroundColor: '#ffffff',
    		    tooltip: {formatter: '{b}: {c}'},
    		    legend: {
    		        data: chartData.serviesNames
    		    },
    		    radar: {
    		    	radius: 90,
    	            center: ['50%','60%'],
    		        indicator: indicatorData
    		    },
    		    series: [{
    		        type: 'radar',
    		        data : serieData
    		    }]
    		};
    	myChart.setOption(option);
    }
    //取雷达图极坐标最大值
    _.getRadarMax = function(dataMaxs,dataList){
		for(var i=0;i<dataList.length;i++){
            var v = parseInt(dataList[i]);
			if(dataMaxs < v){
				dataMaxs = v;
			}
		}
    	return dataMaxs;
    }
})(biz);
