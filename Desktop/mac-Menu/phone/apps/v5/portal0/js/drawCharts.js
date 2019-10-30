//封装渲染统计图对象
var drawCharts = {};
/*-- 渲染统计图工具方法 --*/
(function(_) {
    _.init = function(myChart, chartData, chartType, grideTop) {
        if (chartType == "1") { //柱状图
            _.renderBarOption(myChart, chartData, grideTop);
        } else if (chartType == "3") { //折线图
            _.renderLineOption(myChart, chartData, grideTop);
        } else if (chartType == "7") { //饼状图
            _.renderPieOption(myChart, chartData, grideTop);
        } else if (chartType == "11") { //雷达图
            _.renderRadarOption(myChart, chartData, grideTop);
        }
    };
    //柱状图
    _.renderBarOption = function(myChart, chartData, grideTop) {
        var dataAxis = chartData.indexNames;
        var serieData = new Array();
        for (var i = 0; i < chartData.serviesNames.length; i++) {
            serieData[i] = {
                type: 'bar',
                name: chartData.serviesNames[i],
                data: chartData.dataList[i]
            };
        }
        var option = {
            backgroundColor: '#ffffff',
            tooltip: {
                show: false,
                trigger: 'axis'
            },
            legend: {
                orient:"vertical",
                selectedMode: false,
                formatter: function (name) {
                    return echarts.format.truncateText(name, 80, '10px Microsoft Yahei', '…');
                },
                data: _.legendControl(chartData.serviesNames)
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
                    formatter: function(v, i) {
                        v = (v + "").split("");
                        var ss = "";
                        for (var i = 0; i < v.length; i++) {
                            ss += v[i];
                            if ((i + 1) % 5 == 0) {
                                ss += "\n";
                            }
                        }
                        return ss;
                    }
                }
            }],
            grid: {
                top: grideTop,
                left: 70,
                bottom: 40
            },
            dataZoom: [{
                type: 'inside'
            }],
            series: serieData
        };
        myChart.setOption(option);
    };
    //折线图
    _.renderLineOption = function(myChart, chartData, grideTop) {
            var serieData = new Array();
            for (var i = 0; i < chartData.serviesNames.length; i++) {
                serieData[i] = {
                    name: chartData.serviesNames[i],
                    type: 'line',
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    //areaStyle: {normal: {}},
                    data: chartData.dataList[i]
                };
            }
            var option = {
                backgroundColor: '#ffffff',
                tooltip: {
                    show: false,
                    trigger: 'axis'
                },
                legend: {
                    orient:"vertical",
                    selectedMode: false,
                    formatter: function (name) {
                        return echarts.format.truncateText(name, 80, '10px Microsoft Yahei', '…');
                    },
                    data: _.legendControl(chartData.serviesNames)
                },
                grid: {
                    top: grideTop,
                    left: 70,
                    bottom: 40
                },
                xAxis: [{
                    type: 'category',
                    boundaryGap: false,
                    data: chartData.indexNames
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
                        formatter: function(v, i) {
                            v = (v + "").split("");
                            var ss = "";
                            for (var i = 0; i < v.length; i++) {
                                ss += v[i];
                                if ((i + 1) % 5 == 0) {
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
                series: serieData
            };
            myChart.setOption(option);
        }
        //饼图
    _.renderPieOption = function(myChart, chartData, grideTop) {
            var serieData = new Array();
            for (var i = 0; i < chartData.indexNames.length; i++) {
                serieData[i] = {
                    "name": chartData.indexNames[i],
                    "value": chartData.dataList[0][i]
                };
            }
            var option = {
                backgroundColor: '#ffffff',
                tooltip: {
                    show: true,
                    showContent : true,
                    trigger: 'item',
                    formatter: "{b} : {c} ({d}%)"
                },
                legend: {
                    orient:"vertical",
                    selectedMode: false,
                    formatter: function (name) {
                        return echarts.format.truncateText(name, 80, '10px Microsoft Yahei', '…');
                    },
                    data: _.legendControl(chartData.indexNames)
                },
                series: [{
                    type: 'pie',
                    radius: 75,
                    center: ['50%', grideTop + 85],
                    data: serieData,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        },
                        normal: {
                            label: {
                                position: 'inside',
                                formatter: '{c}'
                            }
                        }
                    }
                }]
            };
            myChart.setOption(option);
        }
        //雷达图
    _.renderRadarOption = function(myChart, chartData, grideTop) {
            var dataMaxs = 1;
            var serieData = new Array();
            for (var i = 0; i < chartData.serviesNames.length; i++) {
                serieData[i] = {
                    value: chartData.dataList[i],
                    name: chartData.serviesNames[i]
                };
                dataMaxs = _.getRadarMax(dataMaxs, chartData.dataList[i]);
            }
            var indicatorData = new Array();
            dataMaxs = Math.ceil(1.2 * dataMaxs);
            for (var i = 0; i < chartData.indexNames.length; i++) {
                indicatorData[i] = {
                    name: chartData.indexNames[i],
                    max: dataMaxs
                };
            }
            var option = {
                backgroundColor: '#ffffff',
                tooltip: {
                    show: false,
                    formatter: '{b}: {c}'
                },
                legend: {
                    orient:"vertical",
                    selectedMode: false,
                    formatter: function (name) {
                        return echarts.format.truncateText(name, 80, '10px Microsoft Yahei', '…');
                    },
                    data: _.legendControl(chartData.serviesNames)
                },
                radar: {
                    radius: 75,
                    center: ['50%', grideTop + 85],
                    indicator: indicatorData
                },
                series: [{
                    type: 'radar',
                    data: serieData
                }]
            };
            myChart.setOption(option);
        }
        //取雷达图极坐标最大值
    _.getRadarMax = function(dataMaxs, dataList) {
        for (var i = 0; i < dataList.length; i++) {
            var v = parseInt(dataList[i]);
            if (dataMaxs < v) {
                dataMaxs = v;
            }
        }
        return dataMaxs;
    }
    _.legendControl = function(beforeLegend) {
        // 图例太多时，Echarts文档注明【特殊字符串 ''（空字符串）或者 '\n' (换行字符串)用于图例的换行。】
        var afterLegend =[];
        var index = 0;
        if(!beforeLegend || beforeLegend.length == 0){
            return beforeLegend;
        }
        var screenWith = window.screen.width;
        var beforeLegendLength = beforeLegend.length;
        var sizeInOne = 3;
        if(screenWith < 375){
            sizeInOne = 2;
        }
        var _colume =  Math.ceil(beforeLegendLength / sizeInOne);
        var len = beforeLegend.length;
        for ( var i = 0; i < len; i++) {
            if ((i+1)%(_colume) === 0) {
                afterLegend[index] = beforeLegend[i];
                index++;
                afterLegend[index] = '';
            } else {
                afterLegend[index] = beforeLegend[i];
            }
            index++;
        }
        return afterLegend;
    }

})(drawCharts);