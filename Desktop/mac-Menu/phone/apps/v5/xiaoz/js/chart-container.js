/**
 * Created by xinpei on 2018-9-13.
 */

cmp.ready(function () {
    var debugModule = !cmp.platform.CMPShell;
   initPage(debugModule);
});
function initPage(debugModule){
    initShowMock();

    if(debugModule){
        var debugData = {designId:"7806299981358186601",schstatsStoreId:"-7723923865298907589"};//列表头  398285654521957180   -6881446616406929809   行表头数据  7806299981358186601   5278129200193882925
        sendAjax(debugData);
        return;
    }
    cmp.speechRobot.getSpeechInput({
        error:function(e){
            cmp.notification.alert("获取语音输入内容失败",function(){
                cmp.href.back();
            })
        },
        success:function(gotoParams){
            var id = gotoParams.id,designId = gotoParams.designId;
            var data = {schstatsStoreId:id,designId:designId};
            sendAjax(data);
            
        }
    });
}
function initShowMock(){
    var mockPie = document.querySelector(".mock-pie");
    var loadingDiv = document.querySelector(".loading");
    var windowW = window.innerWidth;
    mockPie.style.cssText = "left:"+(windowW-140)/2+"px;top:"+(260-140)/2+"px;";
    loadingDiv.style.cssText = "left:"+(windowW-30)/2+"px;top:"+(260-30)/2+"px;";
    mockPie.classList.remove("cmp-hidden");
    loadingDiv.classList.remove("cmp-hidden");
}
function hiddenMock(){
    var mockPie = document.querySelector(".mock-pie");
    var loadingDiv = document.querySelector(".loading");
    mockPie.classList.add("cmp-hidden");
    loadingDiv.classList.add("cmp-hidden");
}

function sendAjax(data){
    cmp.ajax({
        url:cmp.seeyonbasepath+ "/rest/report/result",
        type:"POST",
        data:JSON.stringify(data),//5623659327288004101   6518431119280718296
        headers: {
            'Accept': 'application/json; charset=UTF-8',
            'Accept-Language': cmp.language,
            'Content-Type': 'application/json;charset=UTF-8'
        },
        success:function(result){
            console.log(result);
            hiddenMock();
            renderChart(result)
        },
        error:function(error){
            console.log(error)
        }
    });
}
/**
 * 1-柱状图、2-条形图、3-折线图、4-面积图、5-饼图、6-环形图、7雷达图、8-地图（移动端暂不能显示）、9-漏斗图)
 * @param chartData
 */
function renderChart(chartData){
    reportResultChartApi.showContent({
        domId:"chart-container",
        reportConfig:chartData.reportConfig,
        reportData:chartData.reportResult,
        chartAttr:{
            chartType:5,
            maxResult:6
        },
        otherAttr:{
            maxResult:6
        }


    })
}
