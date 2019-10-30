/*********************************************************
 * V7.0生成报表图 共用接口
 * _parameter：参数
 *  domId 渲染结果document 的id
 *  reportConfig 报表配置
 *  reportData 报表结果数据
 *  chartAttr 图的设置 (其中chartAttr.chartType必须有：1-柱状图、2-条形图、3-折线图、4-面积图、5-饼图、6-环形图、7雷达图、8-地图（移动端暂不能显示）、9-漏斗图)
 *  otherAttr 其他设置 
 *  
 *  $Author: fucz
 * *******************************************************/
var reportResultChartApi	= {
		showContent 		: function(_parameter){
			var domId = _parameter.domId,
				reportConfig = _parameter.reportConfig,
				reportData = _parameter.reportData,
				chartAttr = _parameter.chartAttr,
				otherAttr = _parameter.otherAttr;
			
			var rowHeaders = reportConfig.rowHeaders, colHeaders = reportConfig.colHeaders,  statsFields = reportConfig.statsFields,
				resultData = reportData.data, colData = reportData.colData,
				isCross = ( null != colHeaders),
				chartType = chartAttr.chartType;
			if(null == resultData || resultData.length == 0 || statsFields.length == 0){
				return;
			}
			 
			var dom = document.querySelector("#" + domId);
			dom.innerHTML = reportResultChartApi.getContentHtml(reportConfig,reportData,chartType);
			if(null == chartAttr.axisMarginLeft){
				chartAttr.axisMarginLeft = 20;
			}
			if(null == chartAttr.axisMarginRight){
				chartAttr.axisMarginRight = 20;
			}
			
			var chartData = {};
			if('1' == chartType || '2' == chartType || '3' == chartType || '4' == chartType //柱状图、折线图、面积图
					|| '8' == chartType){	//地图
				chartData = reportResultChartApi.getBaseChartData(_parameter);
			}else if('5' == chartType || '6' == chartType){// 饼图、环形图 -- 比较特殊 需要排序
				var allData = [];
				for(var i = 0, len1 = resultData.length; i < len1; i++){
					var rowData = resultData[i];
					var itemName ;
					for(var j = 0, len2 = rowHeaders.length; j < len2; j++){
						var hField = rowHeaders[j],key = hField.aliasTableName + "_" + hField.name;
						var val = (null == rowData[key][0]) ? "" : rowData[key][0];
						if(j == 0){
							itemName = val;
						}else{
							itemName = itemName + "/" + val;
						}
					}
					allData[i] = {itemName:itemName,rowIndex:i};
					if(!isCross){
						for(var j = 0, len2 = statsFields.length; j < len2; j++){
							var sField = statsFields[j],key = sField.aliasTableName + "_" + sField.name;
							var val = (null == rowData[key][0]) ? 0 : rowData[key][1];
							val = parseFloat(val);
							val = parseFloat(val.toFixed(sField.digitNum));
							allData[i][j] = val;
						}
					}else{
						for(var k = 0, len3 = colData.length; k < len3; k++){
							for(var j = 0, len2 = statsFields.length; j < len2; j++){
								var sField = statsFields[j],key = "col_" + k + "_" + sField.aliasTableName + "_" + sField.name;
								var val = (null == rowData[key][0]) ? 0 : rowData[key][1];
								val = parseFloat(val);
								val = parseFloat(val.toFixed(sField.digitNum));
								var mapKey = k + "_" + j;
								allData[i][mapKey] = val;
							}
						}
					}
				}
				chartData = {allData : allData};
			}else if('7' == chartType){//雷达图
				chartData = reportResultChartApi.getRadarChartData(_parameter);
			}else if('9' == chartType){//漏斗图
				chartData = reportResultChartApi.getFunnelData(_parameter);
			}
			if(!isCross){
				reportResultChartApi.showResultContent(domId,_parameter,chartData,0,0);
				if(null != document.querySelector("#" + domId + " .statsfield-change")){
					document.querySelector("#" + domId + " .statsfield-change").addEventListener("change",function(){
						var val = this.value;
						reportResultChartApi.showResultContent(domId,_parameter,chartData,val,0);
					});
				}
			}else{
				reportResultChartApi.showResultContent(domId,_parameter,chartData,0,0);
				if(null != document.querySelector("#" + domId + " .cross-change")){
					document.querySelector("#" + domId + " .cross-change").addEventListener("change",function(){
						var val = this.value;
						var fieldVal = 0;
						if(null != document.querySelector("#" + domId + " .statsfield-change")){
							fieldVal = document.querySelector("#" + domId + " .statsfield-change").value;
						}
						reportResultChartApi.showResultContent(domId,_parameter,chartData,fieldVal,val);
					});
				}
				if(null != document.querySelector("#" + domId + " .statsfield-change")){
					document.querySelector("#" + domId + " .statsfield-change").addEventListener("change",function(){
						var val = this.value;
						var crossVal = document.querySelector("#" + domId + " .cross-change").value;
						if(null != document.querySelector("#" + domId + " .cross-change")){
							crossVal = document.querySelector("#" + domId + " .cross-change").value;
						}
						reportResultChartApi.showResultContent(domId,_parameter,chartData,val,crossVal);
					});
				}
			}
		},
		getContentHtml 		: function(reportConfig,reportData,chartType){
			var html = ''; 
			var resultData = reportData.data;
			if(null != resultData && resultData.length > 0){
				var rowHeaders = reportConfig.rowHeaders, colHeaders = reportConfig.colHeaders,  statsFields = reportConfig.statsFields,
				colData = reportData.colData;
				var hasCrossSelect = ( null != colHeaders) && ( colData.length > 1 );
				var hasStatsSelect = (statsFields.length > 1) && ( chartType == 5 || chartType == 6 || chartType == 9);
				
				html += '<div>';
				if(hasCrossSelect){
					html += '<div class="colHeader_title"><span class="title">'+escapeStringToHTML(colHeaders.aliasDisplay,true,false)+'</span>';
					html += '<select class="select cross-change" style="width: 120px;">';
					for(var i = 0, len1 = colData.length; i < len1; i++){ 
						html += '<option value="'+i+'">'+escapeStringToHTML(colData[i][0],true,false)+'</option>';
					}
					html += '</select></div>';
				}
				if(hasStatsSelect){
					html += '<div class="colHeader_title"><span class="title">'+cmp.i18n("portal.vreport.stats.result.statistical.item")+'</span>';
					html += '<select class="select statsfield-change" style="width: 120px;">';
					for(var i = 0, len1 = statsFields.length; i < len1; i++){ 
						html += '<option value="'+i+'">'+escapeStringToHTML(statsFields[i].aliasDisplay,true,false)+'</option>';
					}
					html += '</select></div>';
				}
				html += '</div>';
				html += '<div style="height: 260px;width: 100%;" class="chart-div"></div>';
			}
			return html;
		},
		getBaseChartData 	: function(_parameter){//取基础图数据 --柱状图、条形图、折线图、面积图
			var reportConfig = _parameter.reportConfig,reportData = _parameter.reportData,maxResult = _parameter.chartAttr.maxResult;
			var rowHeaders = reportConfig.rowHeaders, colHeaders = reportConfig.colHeaders,  statsFields = reportConfig.statsFields,
				resultData = reportData.data, colData = reportData.colData,isCross = ( null != colHeaders);
			
			var legendData = [],itemNames = [],serieDatas = [], allSerieDatas = [];
			//图例
			for(var i = 0, len1 = statsFields.length; i < len1; i++){
				legendData[i] = statsFields[i].aliasDisplay;
			}
			var showResultNum = resultData.length;
			if(undefined != maxResult && (showResultNum > maxResult)){
				showResultNum = maxResult;
			}
			for(var i = 0, len1 = showResultNum; i < len1; i++){
				var rowData = resultData[i];
				var name = itemNames[i];
				if(null == name){//分组项名称拼接
					for(var j = 0, len2 = rowHeaders.length; j < len2; j++){
						var hField = rowHeaders[j],key = hField.aliasTableName + "_" + hField.name;
						var val = (null == rowData[key][0]) ? "" : rowData[key][0];
						if(j == 0){
							name = val;
						}else{
							name = name + "/" + val;
						}
					}
					itemNames[i] = name;
				}
				//数据展示
				if(!isCross){
					for(var j = 0, len2 = statsFields.length; j < len2; j++){
						var sField = statsFields[j],key = sField.aliasTableName + "_" + sField.name;
						var val = (null == rowData[key][1]) ? 0 : rowData[key][1];
						val = parseFloat(val);
						val = parseFloat(val.toFixed(sField.digitNum));
						if(i == 0){
							serieDatas[j] = [val];
						}else{
							serieDatas[j][i] = val;
						}
					}
					allSerieDatas[0] = serieDatas;
				}else{
					for(var k = 0, len3 = colData.length; k < len3; k++){
						var crossSerieDatas = [];
						if(i != 0){
							crossSerieDatas = allSerieDatas[k];
						}
						for(var j = 0, len2 = statsFields.length; j < len2; j++){
							var sField = statsFields[j],key = "col_" + k + "_" + sField.aliasTableName + "_" + sField.name;
							var val = (null == rowData[key][1]) ? 0 : rowData[key][1];
							val = parseFloat(val);
							val = parseFloat(val.toFixed(sField.digitNum));
							if(i == 0){
								crossSerieDatas[j] = [val];
							}else{
								var arr = crossSerieDatas[j];
								arr[i] = val;
							}
						}
						allSerieDatas[k] = crossSerieDatas;
					}
				}
			}
			return {legendData:legendData,itemNames:itemNames,allSerieDatas:allSerieDatas};
		},
		getRadarChartData 	: function(_parameter){
			var reportConfig = _parameter.reportConfig,reportData = _parameter.reportData,maxResult = _parameter.chartAttr.maxResult;
			var rowHeaders = reportConfig.rowHeaders, colHeaders = reportConfig.colHeaders,  statsFields = reportConfig.statsFields,
				resultData = reportData.data, colData = reportData.colData,isCross = ( null != colHeaders);
			
			var legendData = [],itemNames = [],serieDatas = [], allSerieDatas = [];
			for(var i = 0, len1 = statsFields.length; i < len1; i++){
				var sField = statsFields[i];
				legendData[i] = sField.aliasDisplay;
			}
			var showResultNum = resultData.length;
			if(undefined != maxResult && (showResultNum > maxResult)){
				showResultNum = maxResult;
			}
			for(var i = 0, len1 = showResultNum; i < len1; i++){
				var rowData = resultData[i];
				var itemName = itemNames[i];;
				if(null == itemName){//分组项名称拼接
					if(i < maxResult){
						for(var j = 0, len2 = rowHeaders.length; j < len2; j++){
							var hField = rowHeaders[j],key = hField.aliasTableName + "_" + hField.name;
							var val = (null == rowData[key][0]) ? "" : rowData[key][0];
							if(j == 0){
								itemName = val;
							}else{
								itemName = itemName + "/" + val;
							}
						}
						itemNames[i] = itemName;
					}
				}
				if(i < maxResult){
					//数据展示
					if(!isCross){
						for(var j = 0, len2 = statsFields.length; j < len2; j++){
							var sField = statsFields[j],key = sField.aliasTableName + "_" + sField.name;
							var val = (null == rowData[key][0]) ? 0 : rowData[key][1];
							val = parseFloat(val);
							val = parseFloat(val.toFixed(sField.digitNum));
							if(i == 0){
								serieDatas[j] = {value : [val],name : statsFields[j].aliasDisplay}
							}else{
								var arr = serieDatas[j].value;
								arr[i] = val;
							}
						}
						allSerieDatas[0] = serieDatas;
					}else{
						for(var k = 0, len3 = colData.length; k < len3; k++){
							var crossSerieDatas = [];
							if(i != 0){
								crossSerieDatas = allSerieDatas[k];
							}
							for(var j = 0, len2 = statsFields.length; j < len2; j++){
								var sField = statsFields[j],key = "col_" + k + "_" + sField.aliasTableName + "_" + sField.name;
								var val = (null == rowData[key][0]) ? 0 : rowData[key][1];
								val = parseFloat(val);
								val = parseFloat(val.toFixed(sField.digitNum));
								if(i == 0){
									crossSerieDatas[j] = {value : [val],name : statsFields[j].aliasDisplay}
								}else{
									var arr = crossSerieDatas[j].value;
									arr[i] = val;
								}
							}
							allSerieDatas[k] = crossSerieDatas;
						}
					}
				}
			}
			return {legendData:legendData,itemNames:itemNames,serieDatas:serieDatas,allSerieDatas:allSerieDatas};
		},
		getFunnelData 		: function(_parameter){
			var reportConfig = _parameter.reportConfig,reportData = _parameter.reportData,maxResult = _parameter.chartAttr.maxResult;
			var rowHeaders = reportConfig.rowHeaders, colHeaders = reportConfig.colHeaders,  statsFields = reportConfig.statsFields,
				resultData = reportData.data, colData = reportData.colData,isCross = ( null != colHeaders);
			
			var legendData = [], allSerieDatas = {};
			var showResultNum = resultData.length;
			if(undefined != maxResult && (showResultNum > maxResult)){
				showResultNum = maxResult;
			}
			for(var i = 0, len1 = showResultNum; i < len1; i++){
				var rowData = resultData[i];
				var itemName = legendData[i];
				if(null == itemName){//分组项名称拼接
					for(var j = 0, len2 = rowHeaders.length; j < len2; j++){
						var hField = rowHeaders[j],key = hField.aliasTableName + "_" + hField.name;
						var val = (null == rowData[key][0]) ? "" : rowData[key][0];
						if(j == 0){
							itemName = val;
						}else{
							itemName = itemName + "/" + val;
						}
					}
					legendData[i] = itemName;
				}
				//数据展示
				if(!isCross){
					for(var j = 0, len2 = statsFields.length; j < len2; j++){
						var sField = statsFields[j],key = sField.aliasTableName + "_" + sField.name;
						var val = (null == rowData[key][0]) ? 0 : rowData[key][1];
						val = parseFloat(val);
						val = parseFloat(val.toFixed(sField.digitNum));
						if(i == 0){
							allSerieDatas[j] = [val];
						}else{
							var arr = allSerieDatas[j];
							arr[i] = val;
						}
					}
				}else{
					for(var k = 0, len3 = colData.length; k < len3; k++){
						for(var j = 0, len2 = statsFields.length; j < len2; j++){
							var sField = statsFields[j],key = "col_" + k + "_" + sField.aliasTableName + "_" + sField.name;
							var val = (null == rowData[key][0]) ? 0 : rowData[key][1];
							val = parseFloat(val);
							val = parseFloat(val.toFixed(sField.digitNum));
							var mapKey = k + "_" + j;
							if(i == 0){
								allSerieDatas[mapKey] = [val];
							}else{
								var arr = allSerieDatas[mapKey];
								arr[i] = val;
							}
						}
					}
				}
			}
			return {legendData:legendData,allSerieDatas:allSerieDatas};
		},
		showResultContent	: function (domId , _parameter , chartData , statsIndex , crossIndex) {
			var chartType = _parameter.chartAttr.chartType, statsFields = _parameter.reportConfig.statsFields , chartAttr = _parameter.chartAttr;
			var option = {};
			var statsFieldName = statsFields[statsIndex].aliasDisplay
			if('5' == chartType || '6' == chartType){
				var key = ( null != _parameter.reportConfig.colHeaders) ? (crossIndex +'_'+ statsIndex ): statsIndex;
				var maxResult = _parameter.chartAttr.maxResult;
				var newData = chartData.allData.sort(reportResultChartApi.compare(key));
				var pieChartData = reportResultChartApi.getPieData(newData,maxResult,key);
				option = reportResultChartApi.getChartOption(chartType,pieChartData.legendData,null,pieChartData.serieDatas,statsFieldName,chartAttr);
			}else{
				var key = crossIndex;
				if('9' == chartType){
					key = ( null != _parameter.reportConfig.colHeaders) ? (crossIndex +'_'+ statsIndex ): statsIndex;
				}
				option = reportResultChartApi.getChartOption(chartType,chartData.legendData,chartData.itemNames, chartData.allSerieDatas[key],statsFieldName,chartAttr);
			}
			reportResultChartApi.drawingChart(domId,option);
		},
		getChartOption		: function(chartType,legendData,itemNames,serieDatas,fieldName,chartAttr){
	    	var option = {};
	    	if('1' == chartType){//柱状图
	    		var seriesArr = [];
	    		for(var i = 0, len1 = legendData.length; i < len1; i++){
	    			seriesArr[i] = {
	    				name:legendData[i],
	    				type:'bar',
	    				itemStyle: {normal: {areaStyle: {type: 'default'}}},
	    				data:[]
	    			}
	    		}
	    		for(var i = 0, len1 = serieDatas.length; i < len1; i++){
	    			var serie = seriesArr[i];
	    			var sData = serieDatas[i];
	    			for(var j = 0, len2 = sData.length; j < len2; j++){
	    				serie.data[j] = sData[j] ;
	    			}
	    		}
	    		
	    		var _x =  chartAttr.axisMarginLeft , _x2 = chartAttr.axisMarginRight;
	        	option = {
	        		legend:{
	        			data:legendData
	        		},
					tooltip : {
						trigger: 'axis'
					},
					xAxis : {
						type : 'category',
						data : itemNames,
						axisLine: {
							show: false
						},
						splitLine: {
							show: false
						}
					},
					yAxis : {
						type : 'value',
						axisLine : {
							"show": false
						},
					},
					grid :{
						x:_x,
						x2:_x2,
						y:35
					},
					series : seriesArr
	    		};
	        	var _allWidth = 32 * legendData.length * itemNames.length;
	        	var _end = (320/_allWidth) * 100;
	        	option.dataZoom = {
	        			type: 'inside',
	                    realtime: true,
	        			start: 0,
	        			end: _end
	        	};
	        	//x坐标显示
	        	var axisLabel = {
					rotate:20,
					formatter: function (value){
						var v = value;
						if(value.length > 6){
							v = value.substr(0,6)+"...";
						}
						return v;
					}
				};
				option.xAxis.axisLabel = axisLabel;
	    	}else if('2' == chartType){//条形图
	    		var seriesArr = [];
				for(var i = 0, len1 = legendData.length; i < len1; i++){
					seriesArr[i] = {
						name:legendData[i],
						type:'bar',
						itemStyle: {normal: {areaStyle: {type: 'default'}}},
						data:[]
					}
				}
				for(var i = 0, len1 = serieDatas.length; i < len1; i++){
					var serie = seriesArr[i];
					var sData = serieDatas[i];
					for(var j = 0, len2 = sData.length; j < len2; j++){
						serie.data[j] = sData[j] ;
					}
					serie.data = serie.data.reverse();
				}
				itemNames = itemNames.reverse();
				var _x =  chartAttr.axisMarginLeft , _x2 = chartAttr.axisMarginRight;
				option = {
					legend:{
	        			data:legendData
	        		},
					tooltip : {
						trigger: 'axis'
					},
					xAxis : {
						type : 'value'
					},
					yAxis : {
						type : 'category',
						data : itemNames
						
					},
					grid :{
						x:_x,
						x2:_x2,
						y:35
					},
					series : seriesArr
				};
				var _allWidth = 32 * legendData.length * itemNames.length;
	        	var _end = (260/_allWidth) * 100;
	        	option.dataZoom = {
	        			type: 'inside',
	                    realtime: true,
	        			orient:"vertical",
	        			start: 0,
	        			end: _end
	        	};
				var axisLabel = {
					interval:0,
					formatter: function (value){
						var baseSize = 2;
						var v = value;
						if(value != undefined && value.length > baseSize){
							v = value.substr(0, baseSize) + "\n";
							value = value.substr(baseSize, value.length);
							if( value.length > baseSize-1){
								v = v +value.substr(0, baseSize-1)+"...";
							}else{
								v = v +value.substr(0, baseSize-1);
							}
						}
						return v;
					}
				};
				option.yAxis.axisLabel = axisLabel;
				//x坐标显示
	        	var axisLabel = {
					rotate:15
				};
				option.xAxis.axisLabel = axisLabel;
	    	}else if('3' == chartType){//折线图
	    		var seriesArr = [];
				for(var i = 0, len1 = legendData.length; i < len1; i++){
					seriesArr[i] = {
							name:legendData[i],
							type:'line',
							data:[]
					}
				}
				for(var i = 0, len1 = serieDatas.length; i < len1; i++){
					var serie = seriesArr[i];
					var sData = serieDatas[i];
					for(var j = 0, len2 = sData.length; j < len2; j++){
						serie.data[j] = sData[j] ;
					}
				}
				var _x =  chartAttr.axisMarginLeft , _x2 = chartAttr.axisMarginRight;
		    	option = {
	    			legend:{
	        			data:legendData
	        		},
					tooltip : {
						trigger: 'axis'
					},
					xAxis : {
						type : 'category',
						data : itemNames,
						axisLine: {
							show: false
						},
						splitLine: {
							show: false
						}
					},
					yAxis : {
						type : 'value',
						axisLine : {
							"show": false
						},
					},
					grid :{
						x:_x,
						x2:_x2,
						y:35
					},
					series : seriesArr
				};
		    	var _allWidth = 32 * itemNames.length;
	        	var _end = (320/_allWidth) * 100;
	        	option.dataZoom = {
	        			type: 'inside',
	                    realtime: true,
	        			start: 0,
	        			end: _end
	        	};
	        	//x坐标显示
	        	var axisLabel = {
					rotate:20,
					formatter: function (value){
						var v = value;
						if(value.length > 6){
							v = value.substr(0,6)+"...";
						}
						return v;
					}
				};
				option.xAxis.axisLabel = axisLabel;
	    	}else if('4' == chartType){//面积图
	    		var seriesArr = [];
				for(var i = 0, len1 = legendData.length; i < len1; i++){
					seriesArr[i] = {
						name:legendData[i],
						type:'line',
						itemStyle: {normal: {areaStyle: {type: 'default'}}},
						data:[]
					}
				}
				for(var i = 0, len1 = serieDatas.length; i < len1; i++){
					var serie = seriesArr[i];
					var sData = serieDatas[i];
					for(var j = 0, len2 = sData.length; j < len2; j++){
						serie.data[j] = sData[j] ;
					}
				}
				var _x =  chartAttr.axisMarginLeft , _x2 = chartAttr.axisMarginRight;
		    	option = {
	    			legend:{
	        			data:legendData
	        		},
					tooltip : {
						trigger: 'axis'
					},
					xAxis : {
						type : 'category',
						boundaryGap : false,
						data : itemNames,
						axisLine: {
							show: false
						},
						splitLine: {
							show: false
						}
					},
					yAxis : {
						type : 'value',
						axisLine : {
							"show": false
						},
					},
					grid :{
						x:_x,
						x2:_x2,
						y:35
					},
					series : seriesArr
				};
		    	var _allWidth = 32 * itemNames.length;
	        	var _end = (320/_allWidth) * 100;
	        	option.dataZoom = {
	        			type: 'inside',
	                    realtime: true,
	        			start: 0,
	        			end: _end
	        	};
	        	//x坐标显示
	        	var axisLabel = {
					rotate:20,
					formatter: function (value){
						var v = value;
						if(value.length > 6){
							v = value.substr(0,6)+"...";
						}
						return v;
					}
				};
				option.xAxis.axisLabel = axisLabel;
	    	}else if('5' == chartType){//饼状图
	    		var total = 0;
				var serisData = [];
				for(var i = 0, len1 = legendData.length; i < len1; i++){
					total = total + serieDatas[i];
					serisData[i] = {value:serieDatas[i], name:legendData[i]}
				}
		    	option = {
	    			tooltip : {
	    		        trigger: 'item',
	    		        formatter: "{a} <br/>{b} : {c} ({d}%)"
	    		    },
					series :  [
			           {
			        	   name:fieldName,
			               type:'pie',
			               radius : '55%',
			               center: ['50%', '50%'],
			               itemStyle : {
			                   normal : {
			                	   label : {
			                    	   formatter:"{b}\n{d}%"
			                       },
			                       labelLine : {
			                    	   formatter:"{b}\n{d}%"
			                       }
			                   }
			               },
			               data:serisData
			           }
			       ]
				};
	    	}else if('6' == chartType){//环形图
	    		var total = 0;
				var serisData = [];
				for(var i = 0, len1 = legendData.length; i < len1; i++){
					total = total + serieDatas[i];
					serisData[i] = {value:serieDatas[i], name:legendData[i]}
				}
		    	option = {
	    			tooltip : {
	    		        trigger: 'item',
	    		        formatter: "{a} <br/>{b} : {c} ({d}%)"
	    		    },
					series :  [
			           {
			        	   name:fieldName,
			               type:'pie',
			               radius : ['50%', '70%'],
			               center: ['50%', '50%'],
			               label: {
			                   normal: {
			                       show: false
			                   }
			               },
			               data:serisData
			           },{
			        	   name:fieldName,
			               type:'pie',
			               radius : [0, 0],
			               center: ['50%', '50%'],
			               label: {
			                   normal: {
			                       show: true,
			                       position: 'center',
			                       formatter :function(p){
			                    	   return p.seriesName + "\n" + p.value;
			                       },
			                       textStyle: {
			                    	   color:'#333333',
			                           fontSize: '14'
			                       }
			                   }
			               },
			               data:[total]
			           }
			       ]
				};
	    	}else if('7' == chartType){//雷达图
	    		var maxVal = 1;
				for(var i = 0, len1 = serieDatas.length; i < len1; i++){
					var serieVals = serieDatas[i].value;
					for(var j = 0, len2 = serieVals.length; j < len2; j++){
						if(maxVal < serieVals[j]){
							maxVal = serieVals[j];
						}
					}
				}
				var indicatorArr = [];
				for(var i = 0, len1 = itemNames.length; i < len1; i++){
					indicatorArr[i] =  { text: itemNames[i], max: maxVal};
				}
				var option = {
					legend:{
	        			data:legendData
	        		},
				    tooltip : {
				        trigger: 'item'
				    },
				    polar : [
				       {
				           indicator : indicatorArr,
				           center: ['50%','55%'],
				           radius: '65%',
				        }
				    ],
				    series : [
				        {
				            type: 'radar',
				            data : serieDatas
				        }
				    ]
				};
	    	}else if('8' == chartType){//地图
	    		var seriesArr = [],maxVal = 1;
				for(var i = 0, len1 = legendData.length; i < len1; i++){
					seriesArr[i] = {
				            name: legendData[i],
				            type: 'map',
				            mapType: 'china',
				            itemStyle:{
				                normal:{label:{show:true}},
				                emphasis:{label:{show:true}}
				            },
				            data:[]
				        };
				}
				for(var i = 0, len1 = itemNames.length; i < len1; i++){
					var thisVal = 0;
					for(var j = 0, len2 = legendData.length; j < len2; j++){
						thisVal = thisVal + serieDatas[j][i];
					}
					if(maxVal < thisVal){
						maxVal = thisVal;
					}
				}
				
				for(var i = 0, len1 = serieDatas.length; i < len1; i++){
					var serie = seriesArr[i];
					var sData = serieDatas[i];
					for(var j = 0, len2 = sData.length; j < len2; j++){
						var val = sData[j];
						serie.data[j] = {name:itemNames[j],value:val };
					}
				}
				maxVal = Math.ceil(maxVal/100)  * 100;
				var option = {
				    tooltip : {
				        trigger: 'item'
				    },
				    dataRange: {
				        min: 0,
				        max: maxVal,
				        x: 'left',
				        y: 'bottom',
				        calculable : true
				    },
				    series : seriesArr
				};
	    	}else if('9' == chartType){//漏斗图
	    		var total = 0;
				var serisData = [], maxVal = 1;
				for(var i = 0, len1 = legendData.length; i < len1; i++){
					var val = serieDatas[i];
					total = total + val;
					serisData[i] = {value:val, name:legendData[i]};
					if(maxVal < val){
						maxVal = val;
					}
				}
				option = {
				    tooltip : {
				        trigger: 'item',
				        formatter: "{a} <br/>{b} : {c}"
				    },
				    series : [
				        {
				        	top:15,
				            bottom: 15,
				            name:fieldName,
				            type:'funnel',
				            max:maxVal,
				            sort:'none',
				            itemStyle: {
				                normal: {
				                    label: {
				                        show: true,
				                        formatter: '{b}:{c}'
				                    }
				                },
				                emphasis: {
				                    label: {
				                        show: true,
				                        formatter: '{b}:{c}'
				                    }
				                }
				            },
				            data:serisData
				        }
				    ]
				};
	    	}
	    	return option;
	    },
	    labelFormatter		: function(value){//单位转换
	    	var ret = null;
			if(value >= 10000){
				value = value/10000 ;
				ret = value + "W";
			}else{
				ret = value + "";
			}
			return ret;
	    },
	    drawingChart		: function(domId,option){
			var _chartDom =  document.querySelector("#" + domId + " .chart-div");
			var et = echarts.init(_chartDom);
			et.showLoading({
				text: 'loading...'
			});
			et.hideLoading();
			et.setOption(option);
	    },
		compare 			: function(property) {// 比较大小
			return function(a, b) {
				var value1 = a[property];
				var value2 = b[property];
				return value2 - value1;
			}
		},
		getPieData 			: function (data, maxResult, mapKey) {// 排序后取最大几项数据
			var pieIndex = maxResult - 1;//
			var legendData = [], serieDatas = [];
			   for(var i = 0, len1 = data.length; i < len1; i++){
					var rowData = data[i];
					if(i < pieIndex){
						legendData[i] = rowData.itemName;
						serieDatas[i] = rowData[mapKey];
					}else if(i == pieIndex){
						if(i == (data.length - 1 )){
							legendData[i] = rowData.itemName;
						}else{
							legendData[i] = cmp.i18n("portal.vreport.stats.result.other");
						}
						serieDatas[i] = rowData[mapKey];
					}else{
						serieDatas[pieIndex] = serieDatas[pieIndex] + rowData[mapKey];
					}
			   }
	 	   return {legendData:legendData,serieDatas:serieDatas};
		}
};
