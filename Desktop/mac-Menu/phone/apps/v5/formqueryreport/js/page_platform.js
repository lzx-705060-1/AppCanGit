var CurrentUser,
    I18Nmap,
    Frame_From = "center",
    hasTouch = 'ontouchstart' in window,
    START_EV = hasTouch ? 'touchstart' : 'mousedown',
    MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
    END_EV = hasTouch ? 'touchend' : 'mouseup',
    CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup',
    hasClick = hasTouch ? false : true;

var CacheKey = {
    FORM_REPORT_DATA: 'form_report_data'
};
function getBaseUrljsessionid() {
    var ip = window.location.origin;
    var search = window.location.search;
    search = search.replace("?", "");
    var params = search.split("&");
    var i = 0, len = params.length;
    var jsessionid = "";
    if (params.length > 0) {
        for (; i < len; i++) {
            if (params[i].indexOf("jsessionid") != -1) {
                jsessionid = params[i];
                break;
            }
        }
    }
    return jsessionid;
}

function getBaseUrl() {
    var a8AjaxUrl = "/seeyon/ajax.do?method=ajaxAction",
        ip = window.location.origin,
        search = window.location.search;
    search = search.replace("?", "");
    var params = search.split("&");
    var i = 0, len = params.length;
    var jsessionid = "";
    if (params.length > 0) {
        for (; i < len; i++) {
            if (params[i].indexOf("jsessionid") != -1) {
                jsessionid = params[i];
                break;
            }
        }
    }
    return ip + a8AjaxUrl + ((jsessionid == "") ? "" : "&") + jsessionid;
};

function isEmptyObject(obj){
    for(var n in obj){return false}
    return true;
}

cmp.ready(function () {
    cmp.backbutton();
    cmp.backbutton.push(cmp.href.back);

    /*if(cmp.os.ios){
        $('#loadingHeader')[0].style.cssText = "height:64px; padding-top:20px;";
    }*/

    var
        params,
        isIphone = navigator.userAgent.toLowerCase().match(/iphone os/i) == 'iphone os',
        loading = document.querySelector('#loading');

    if(loading.style.display!="none"){
        cmp.RefreshHeader();
    }

    $(document).on("click", ".loading_back_link", function (e) {
        //cmp.href.closePage();
        if (M1FormUtils.isJumpToFormqueryreport) {
            cmp.href.back();
        }else{
            cmp.href.back();
        }
    });
/* if(document.querySelector(".loading_back_link")) {
 document.querySelector(".loading_back_link").addEventListener('click', function () {
 cmp.href.closePage();
 }, false);
 }*/
if (isIphone) {
//		document.getElementById("csslink").href = "css/page_platform.css";

    //$(".loading").each(function (obj) {
//            $(this).css("left", ($(this).parent().width() - 100) / 4);
//            $(this).css("top", ($(this).parent().height() - 100) / 4);
//            $(this).html("加载中...");
    //});
}

//防止点透事件
FastClick.attach(document.body);
var localLanguage = '';
if (!(window.seeyonMobile == null || window.seeyonMobile == undefined)) {
    localLanguage = window.seeyonMobile.getLocalLanguage();
}
I18Nmap = new HashMap();
$.i18n.properties({
    name: 'strings',
    path: '../i18n/',
    mode: 'map',
    language: localLanguage,
    callback: function () {
        I18Nmap.clear();
        for (var key in I18NConfigObj) {
            I18Nmap.put(I18NConfigObj[key], $.i18n.prop(I18NConfigObj[key]));
        }
    }
});


//获取设备登录 信息
addLocalRequest(4, function (ret) {
    CurrentUser = ret;

    if (currentuser_cmpBaseUrl != "") {
        var fjsessionid;
        fjsessionid = getBaseUrljsessionid();
        fjsessionid = (fjsessionid == "") ? "" : "&" + fjsessionid;
        base_server_url = CurrentUser.cmpBaseUrl + base_server_url + fjsessionid;
    }
    else
        base_server_url = getBaseUrl();

    params=cmp.href.getParam();
    M1FormUtils.isFromBoard=false;
    M1FormUtils.isFromDataRelation=false;
    var isFromM3NavBar = window.location.href.match('m3from=navbar');
    if(isFromM3NavBar){
        M1FormUtils.isFromM3Navbar=true;
        /*cmp.backbutton();
        cmp.backbutton.push(cmp.closeM3App);*/
    }else {
        if((typeof params=="object"&&!isEmptyObject(params)&& typeof params.from != "undefined")||window.location.hash.indexOf("?") > 0){
            M1FormUtils.isJumpToFormqueryreport=true;
            if(window.location.hash.indexOf("m3Navbar")!==-1){
                M1FormUtils.isFromM3NavbarOpenWebview=true;
                M1FormUtils.hashUrl=window.location.hash.split('?')[0];
            }else {
                if(window.location.hash.indexOf("?") > 0){
                    M1FormUtils.isFromBoard=true;
                    M1FormUtils.hashUrl=window.location.hash.split('?')[0];
                    if(window.location.hash.split('?')[1]){
                        M1FormUtils.fromMode=window.location.hash.split('?')[1].split('=')[1];
                    }
                }else {
                    M1FormUtils.hashUrl=window.location.hash;
                    /*if(params.from=="dataRelation"){
                        M1FormUtils.isFromDataRelation=true;
                        if(params.condition){
                            M1FormUtils.dataRelationCdtn=params.condition;
                        }
                    }*/
                }
                cmp.backbutton.pop();
                cmp.backbutton();
                cmp.backbutton.push(cmp.href.back);
            }
            cmp.storage.save(M1FormUtils.isJumpToFormqueryreportKEY, M1FormUtils.isJumpToFormqueryreport, true);
            params={};
        }else{
            /*var header_text=document.querySelector('#loadingHeader .header_text');
            var loading_header_back=document.querySelector('#loadingHeader .loading-header-back');
            if(header_text){
                header_text.innerHTML= cmp.i18n("formqueryreport.string_formtitle");
            }
            if(loading_header_back){
                loading_header_back.innerHTML=cmp.i18n("formqueryreport.string_back");
            }*/
        }
    }
	var his = JSON.parse(cmp.storage.get(M1FormUtils.HISKEY, true));
    if(his&&0<his.length){
        Router.set_his(his);
        if(M1FormUtils.isFromM3NavbarOpenWebview&&his.length>1){
            M1FormUtils.hashUrl=his[his.length-1];
        }
        cmp.storage.delete(M1FormUtils.HISKEY,true);
    }
    initReprotPage();

    var ResourceReference=[
        //type=1为js，type=2为css
        //{type:1,url:tableListJSUrl},
        {type:2,url:tableListCSSUrl},
        //{type:1,url:listViewJSUrl},
        {type:2,url:listViewCSSUrl},
        {type:1,url:excanvasJSUrl},
        {type:1,url:Chart_minJSUrl},
        {type:1,url:RGraph_barJSUrl},
        {type:1,url:RGraph_common_coreJSUrl},
        {type:1,url:RGraph_common_keyJSUrl},
        {type:1,url:RGraph_lineJSUrl},
        {type:1,url:RGraph_radarJSUrl},
        {type:1,url:selectOrgJSUrl},
        {type:1,url:projectAccountListJSUrl},
        {type:1,url:dtPickerJSUrl},
        {type:1,url:popPickerJSUrl},
        {type:1,url:pickerJSUrl},
        {type:1,url:imgCacheJSUrl},
        {type:2,url:sui_filterCSSUrl},
        {type:2,url:selectOrgCSSUrl},
        {type:1,url:echartsJSUrl},
        {type:2,url:pickerCSSUrl},
        {type:1,url:SeeyonAttachmentJSUrl},

    ];

    function addResource(){
        for(var i=0;i<ResourceReference.length;i++){
            if(ResourceReference[i].type==1){
                var oScript= document.createElement("script");
                oScript.type = "text/javascript";
                oScript.src=ResourceReference[i].url;
                document.body.appendChild(oScript);
            }else if(ResourceReference[i].type==2){
                var oCss = document.createElement("link");
                oCss.rel = "stylesheet";
                oCss.type = "text/css";
                oCss.href = ResourceReference[i].url;
                document.body.appendChild(oCss);
            }
        }
    }

    setTimeout(function () {
        addResource();
    },10);


    //为所有的link 绑定点击事件
    $(document).on("tap", ".link", function (e) {
        Frame_From = 'right';
        var hash = $(this).attr('rel');
        hash = encodeURI(hash);
        cmp.event.trigger('formqueryreport_nextpage',document,hash);
        //if (hash) location.hash = hash;
    });
    //为所有的back_link绑定返回事件
    $(document).on("tap", ".back_link", function (e) {
        var report_chart_wrapper=document.querySelector('#report_chart_wrapper');
        var blank_page_wrapper=document.querySelector('#blank_page_wrapper');
        var isChart=false;
        if(report_chart_wrapper||blank_page_wrapper){
            isChart=true;
        }
        if(!isChart){
            if(!M1FormUtils.jumpLocked){
                return;
            }
        }

        M1FormUtils.userOrderBy=[];

        M1FormUtils.userOrderBystorage=[];
        M1FormUtils.sortContent={};
        M1FormUtils.sortItem={};

        if(!report_chart_wrapper){
            cmp.storage.delete(M1FormUtils.filterArrKey,true);
        }

        if(cmp.storage.get(M1FormUtils.ConditionAndSortDataKey, true)){
            if(report_chart_wrapper||blank_page_wrapper){

            }else{
                cmp.storage.delete(M1FormUtils.ConditionAndSortDataKey, true);
            }
        }

        if( cmp.storage.get(M1FormUtils.hasMobileViewKey, true)){
            cmp.storage.delete(M1FormUtils.hasMobileViewKey, true);
        }
        if(document.querySelector('.cmp_bomb_box_backdrop')){
            var cmp_bomb_box_backdrop=document.querySelector('.cmp_bomb_box_backdrop');
            cmp_bomb_box_backdrop.remove();
        }

        if(document.querySelector('.sui-filter-wrapper')){
            var sui_filter_wrapper=document.querySelector('.sui-filter-wrapper');
            sui_filter_wrapper.remove();
        }

        if (cmp.storage.get(M1FormUtils.isJumpToFormqueryreportKEY, true)) {
            M1FormUtils.isJumpToFormqueryreport = cmp.storage.get(M1FormUtils.isJumpToFormqueryreportKEY, true);
        }

        if (!M1FormUtils.isJumpToFormqueryreport) {
            cmp.backbutton.pop();
            if (M1FormUtils.isReportChart) {
                M1FormUtils.isReportChart = false;
            } else if (!M1FormUtils.isReportChart && JSON.parse(cmp.storage.get(M1FormUtils.KEY, true))) {
                cmp.storage.delete(M1FormUtils.KEY, true);

            }
            if(!M1FormUtils.isFromM3NavbarOpenWebview){
                backHashHistory();
            }else {
                cmp.href.closePage();
            }

        } else {
			if(Router.get_his().length>1){
				var i=Router.get_his().length-1;
				for(;i;i--){
					if(Router.get_his()[i]===Router.get_his()[i-1]){
					Router.get_his().splice(i,1);
				}
			}
		}
			
            if(M1FormUtils.isFromBoard&&Router.get_his().length%2==0){
                //location.hash=Router.get_his()[0];
                Router.check_url(Router.get_his()[0]);
                return;
            }
            cmp.backbutton.pop();
            if (JSON.parse(cmp.storage.get(M1FormUtils.KEY, true))) {
                cmp.storage.delete(M1FormUtils.KEY, true);
            }
            cmp.storage.delete(M1FormUtils.isJumpToFormqueryreportKEY, true);
            M1FormUtils.isJumpToFormqueryreport = false;
            M1FormUtils.isFromBoard=false;
            if(M1FormUtils.isFromM3NavbarOpenWebview){
                if(Router.get_his().length>1){
                    backHashHistory();
                }else {
                    cmp.href.closePage();
                }
            }else {
                cmp.href.back();
            }

        }
    });

    $(".unflowformPage_back_link").on("tap",function(){
        unflowformPageBack();
    });

    $(document).on("click", ".left_menu_back", function (e) {
        if(cmp.storage.get(M1FormUtils.ConditionAndSortDataKey, true)){
            cmp.storage.delete(M1FormUtils.ConditionAndSortDataKey, true);
        }
        //适配vjoin的穿透返回
        if(cmp.storage.get("V-Join-Flag", true)){
            cmp.href.back();
            return;
        }
        cmp.href.back();
    });

});

});

function unflowformPageBack(){
    cmp.backbutton.pop();
    document.querySelector(".unflowformPage").style.display ="none";
    document.querySelector("#pageframe").style.display="block";
}

function backHashHistory(){
    Frame_From = 'left';
	if(Router.get_his().length>1){
        var i=Router.get_his().length-1;
        for(;i;i--){
            if(Router.get_his()[i]===Router.get_his()[i-1]){
                Router.get_his().splice(i,1);
            }
        }
    }
    var reg = new RegExp(/^.*\/1\/.*$/);
    if(reg.test(Router.get_his()[Router.get_his().length-1])){
        M1FormUtils.isSearchList = true;
    }
    Router.check_url(Router.history(-1));
}

/**
 * 根据数组长度获取随机颜色数组
 */
var getRandomColor = function (length) {
    var corlors = [];
    for (var i = 0; i < length; i++) {
        var a = Math.round((i + 3) / 2 / 3 / 2 / 3 * 0x1000000 << 0);
        corlors.push('#' + ('00000' + (a).toString(16)).substr(-6));
    }
    return corlors;
};

var noData = function () {
    var blank_page_html = cmp.tmpl("#tpl_blank_page", {});
    //var blank_page_html =cmp.tpl("#tpl_blank_page", {});

    var wrapperView = $("#report_chart_wrapper");/*document.querySelector(".wrapper");*/
    if (wrapperView.length > 0) {
        wrapperView.replaceWith($.parseHTML(blank_page_html));
    } else {
        $(".frame").html(blank_page_html);
    }
};

/**
 * 统计图页面
 * @param u
 */
function getReportChart(u) {
    M1FormUtils.isReportChart=true;

    var data = localStorage.getItem(CacheKey.FORM_REPORT_DATA);
    data = $.parseJSON(data);
    if (data != null && data != ""&&!isEmptyObject(data)) {
        var html = cmp.tmpl("#tpl_report_chart", {gridData: data});

        slide_in(html, Frame_From, ".frame", function () {
			//CAP3查看统计图，首次进入显示柱状图，但是柱状图未置灰
            if(document.querySelector('.chart_type_select_item')){
                document.querySelector('.chart_type_select_item').classList.add('chartChoose');
            }
            M1FormUtils.jumpLocked=true;
            if(M1FormUtils.isFromBoard){
                var jumpBack= function () {
                    Router.check_url(Router.get_his()[0]);
                    //location.hash=Router.get_his()[0];
                };
                cmp.backbutton.pop();
                cmp.backbutton();
                cmp.backbutton.push(jumpBack);
            }

            if (!data.formChartList[u[1]].graphFlag) {
                /*var header_right=document.querySelector('.header_right.right_list_link');
                if(header_right&&header_right.querySelector('span')){
                    header_right.querySelector('span').remove();
                }*/
                if( document.querySelector('.see-icon-v5-common-more-fill')){
                    document.querySelector('.see-icon-v5-common-more-fill').remove()
                }
                noData();
                return;
            }
           /* var appTitle = document.querySelector(".frame .header_text");
            if(appTitle.offsetWidth < appTitle.scrollWidth ){
                appTitle.addEventListener("tap", function(){
                    document.querySelector('.title-info').style.marginTop=cmp.os.ios?"64px":"44px";
                    document.getElementById("title-more").style.display=(document.getElementById("title-more").style.display=="block"?"none":"block");
                    document.getElementById("title-info-txt").innerText=appTitle.innerText;
                });
            }*/
            document.querySelector(".title-info-bg").addEventListener("tap", function(){
                document.getElementById("title-more").style.display="none";
            });
            var lables = data.formChartList[u[1]].indexNames;
            var serviesNames = data.formChartList[u[1]].serviesNames;
            var mChartList = data.formChartList[u[1]].dataList;
            var hasPieChart = data.formChartList[u[1]].flag;
            if (!hasPieChart) {
                $("#chart_type_select_of_pie").remove();
            };

            drawChart(0, mChartList, lables, serviesNames, hasPieChart);
            //myScroll.refresh();
            $(".right_list_link").click(function (e) {
                if ($('.chart_type_select').is(':hidden')) {
                    $(".chart_type_select").fadeIn();
                } else {
                    $(".chart_type_select").fadeOut();
                }
            });

            $(document).on("click", '.chart_type_select_item', function (e) {
                var chartType = $(this).attr('rel');
                drawChart(chartType, mChartList, lables, serviesNames, hasPieChart);
                //myScroll.refresh();
                $(".chart_type_select").fadeOut();
            });
        });
    }else {
        var html = cmp.tmpl("#tpl_report_chart", {gridData: data});
        slide_in(html, Frame_From, ".frame", function () {
            var oDiv = document.createElement('div');
            oDiv.style.fontSize="20px";
            oDiv.innerHTML = cmp.i18n('formqueryreport.string_not_data');
            oDiv.style.textAlign="center";
            oDiv.style.color="#999";
            oDiv.className="hasNoData";
            oDiv.style.position="absolute";
            var chartWrapper=document.querySelector('#report_chart_wrapper');

            document.querySelector('#report_chart_wrapper').appendChild(oDiv);
            oDiv.style.bottom=chartWrapper.offsetHeight/2-oDiv.offsetHeight/2+"px";
            oDiv.style.left=chartWrapper.offsetWidth/2-oDiv.offsetWidth/2+"px";
        })
    }
}

var hasminus = false;
/**
 * 画图函数（根据图的类型，图的数据，和图列 画图）
 * @param chartType
 * @param mChartList
 * @param lables
 * @param serviesNames
 * @param hasPieChart
 */
function drawChart(chartType, mChartList, lables, serviesNames, hasPieChart) {
	/**
	 * 此处是为了兼容扯蛋的的jersey,list<String>竟然返回来的是以空格分隔的字符串
	 * marked by ouyp 2017/02/23
	 */
	if (mChartList.length > 0) {
		mChartList = mChartList.map(function(e){
			if (Object.prototype.toString.call(e)!='[object Array]') {
				e = e.split(" ");
			}
			return e;
		});
	}
	
//    $("#cvs_chart").removeAttr("style");
    //document.querySelector("#cvs_chart").removeAttribute("style");
    $('#loading').hide();
    //document.querySelector("#loading").style.display="none";
    //document.getElementById("cvs_chart").height = 600;
    //RGraph.Clear(document.getElementById("cvs_chart"), "transparent");
    //var colors = getRandomColor(serviesNames.length);
    if (chartType == 0) {//画柱状图
//        hasminus = false;
//        var new_Bar_MChartList = [];
//        if (hasPieChart) {
//            for (var i = 0; i < mChartList.length; i++) {
//                var temArray = [];
//                for (var j = 0; j < mChartList[i].length; j++) {
//                    if (mChartList[i][j] != null && mChartList[i][j] != "") {
//                        var temp = parseFloat(mChartList[i][j]);
//                        if (!hasminus && temp < 0) {
//                            hasminus = true;
//                        }
//                        temArray.push(temp);
//                    } else {
//                        temArray.push(0);
//                    }
//                }
//                new_Bar_MChartList.push(temArray);
//            }
//            colors = getRandomColor(new_Bar_MChartList[0].length);
//            serviesNames = lables;
//        } else {
//            var mChartListLength = 0;
//            if (mChartList != null && mChartList.length > 0) {
//                mChartListLength = mChartList[0].length;
//            }
//            for (var j = 0; j < mChartListLength; j++) {
//                var temArray = [];
//                for (var i = 0; i < mChartList.length; i++) {
//                    if (mChartList[i][j] != null && mChartList[i][j] != "") {
//                        var temp = parseFloat(mChartList[i][j]);
//                        if (!hasminus && temp < 0) {
//                            hasminus = true;
//                        }
//                        temArray.push(temp);
//                    } else {
//                        temArray.push(0);
//                    }
//                }
//                new_Bar_MChartList.push(temArray);
//            }
//        }
//        var cvsWidth = new_Bar_MChartList.length * colors.length * 30 + 180;
//        var right_scroller_width = cvsWidth;
//        $(".topbale").width(right_scroller_width);
        //document.getElementById("cvs_chart").width = cvsWidth;
//        $("#rgraph_key").remove();
//        RGraph.HTML.Key('container', {
//            labels: serviesNames,
//            colors: colors
//        });

//        var barChart = new RGraph.Bar('cvs_chart', new_Bar_MChartList)
//            .set('labels', lables)
//            .set('labels.above', true)
//            .set('labels.above.angle', 70)
//            .set('labels.above.offset', 2)
//            .set('colors', colors)
//            //.set('strokestyle', 'transparent')
//            .set('shadow', false)
//            .set('highlight.stroke', 'transparent')
//            .set('gutter.left', 150)
//            .set('text.size', 8)
//            .set('gutter.top', 50)
//            .set('gutter.bottom', 200)
//            .set('text.angle', 56)
//            .set('background.grid.autofit.numvlines', 5)
//            .set('scale.thousand', '');
//        if (hasminus) {
//            console.log("hasminus:" + hasminus);
//            barChart.set('xaxispos', 'center');
//        }
//        setTimeout(function () {
//            barChart.draw();
//        }, 100);
        //=============================================================================//
    	// Echarts3柱状图初始化
    	//=============================================================================//
    	var myChart = echarts.init(document.getElementById('container'));
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
    	myChart.setOption(option,true);
	    myChart.on('click', function (params) {
	    myChart.dispatchAction({
	          type: 'dataZoom',
	          start: Math.max(params.dataIndex - 6 / 2, 0),
	          end: Math.min(params.dataIndex + 6 / 2, dataAxis.length - 1)
	      });
	    });
        ////////////////////////////////////柱状图///////////////////////////////////////////////
    } else if (chartType == 1) {//画折线图
//        try {
////            var cvsWidth = lables.length * 50 + 150;
////            var right_scroller_width = cvsWidth;
////            $(".topbale").width(right_scroller_width);
////            document.getElementById("cvs_chart").width = cvsWidth;
//            if (hasPieChart) {
//                var newColors = [];
//                for (var i = 0; i < lables.length; i++) {
//                    newColors.push(colors[0]);
//                }
//                $("#rgraph_key").remove();
////                RGraph.HTML.Key('container', {
////                    labels: lables,
////                    colors: newColors
////                });
//            } else {
//                $("#rgraph_key").remove();
////                RGraph.HTML.Key('container', {
////                    labels: serviesNames,
////                    colors: colors
////                });
//            }
////            var lineChart = new RGraph.Line('cvs_chart', lineAndRadarDataConvert(mChartList))
////                .set('colors', colors)
////                .set('labels', lables)
////                .set('shadow', false)
////                .set('labels.above', true)
////                .set('gutter.left', 150)
////                .set('gutter.bottom', 200)
////                .set('text.angle', 45)
////                .set('text.size', 8)
////                .set('scale.thousand', '');
////            if (hasminus) {
////                lineChart.set('xaxispos', 'center');
////            }
////            setTimeout(function () {
////                lineChart.draw();
////            }, 100);
//        } catch (e) {
//            console.log(e.message);
//        }
    	//=============================================================================//
    	// Echarts3折线图初始化
    	//=============================================================================//
    	var myChart = echarts.init(document.getElementById('container'));
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
    	myChart.setOption(option,true);
	    myChart.on('click', function (params) {
	    myChart.dispatchAction({
	          type: 'dataZoom',
	          start: Math.max(params.dataIndex - 6 / 2, 0),
	          end: Math.min(params.dataIndex + 6 / 2, dataAxis.length - 1)
	      });
	    });
        ////////////////////////////////////折线图///////////////////////////////////////////////
    } else if (chartType == 2) {//画雷达图
//        $(".topbale").width(720);
        //document.getElementById("cvs_chart").width = 720;
//        if (hasPieChart) {
//            var newColors = [];
//            for (var i = 0; i < lables.length; i++) {
//                newColors.push(colors[0]);
//            }
//            $("#rgraph_key").remove();
////            RGraph.HTML.Key('container', {
////                labels: lables,
////                colors: newColors
////            });
//        } else {
//            $("#rgraph_key").remove();
////            RGraph.HTML.Key('container', {
////                labels: serviesNames,
////                colors: colors
////            });
//        }
//        var radarDataArray=lineAndRadarDataConvert(mChartList)[0];
//        new RGraph.Radar('cvs_chart', radarDataArray)
//            .set('labels', lables)
//            .set('colors', ['transparent'])
//            .set('axes.color', 'transparent')
//            .set('shadow', false)
//            .set('background.image.stretch', false)
//            .set('linewidth', 1)
//            .set('labels.axes', 'n')
//            .set('labels.boxed', false)
//            .set('labels.axes.boxed', false)
//            .set('labels.axes.boxed.zero', false)
//            .set('strokestyle', colors)
//            .set('chart.gutter.left', 150)
//            .set('chart.gutter.right', 150)
//            .set('chart.gutter.top', 50)
//            .set('chart.gutter.bottom', 50)
//            .set('scale.thousand', '')
//            .draw();
        //=============================================================================//
    	// Echarts3雷达图初始化
    	//=============================================================================//
        var myChart = echarts.init(document.getElementById('container'));
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
				var series = [], serie = {name: '雷达图', type: 'radar'}, data = [];
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
        myChart.setOption(option,true);
        ///////////////////////////////雷达图//////////////////////////////////////////////
    } else if (chartType == 3) { //画饼图
//        colors = getRandomColor(lables.length);
//
//        var new_pie_MChartList = [];
//        for (var i = 0; i < mChartList.length; i++) {
//            for (var j = 0; j < mChartList[i].length; j++) {
//                var temObj = {};
//                temObj.color = colors[j];
//                temObj.label = lables[j];
//                if (mChartList[i][j] != null && mChartList[i][j] != "") {
//                    temObj.value = Math.abs(parseFloat(mChartList[i][j]) < 0 ? 0 : parseFloat(mChartList[i][j]));
//                } else {
//                    temObj.value = 0;
//                }
//                new_pie_MChartList.push(temObj);
//            }
//        }

//        $(".topbale").width($(window).width());
//        document.getElementById("cvs_chart").width = $(window).width();
//        document.getElementById("cvs_chart").height = $(window).width();
//        $("#rgraph_key").remove();
//        RGraph.HTML.Key('container', {
//            labels: lables,
//            colors: colors
//        });
//        var ctx = document.getElementById("cvs_chart").getContext("2d");
//        var config = {
//            animation: false,
//            onAnimationComplete: function () {
//                this.options.animation = true;
//            }
//        };
//        var myPie = new Chart(ctx).Pie(new_pie_MChartList, config);
    	//=============================================================================//
    	// Echarts3饼图初始化
    	//=============================================================================//
    	var myChart = echarts.init(document.getElementById('container'));
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
        },true);
    	///////////////////////////////////////////////////////////////////////////
    }
}

function lineAndRadarDataConvert(mChartList) {
    hasminus = false;
    var new_MChartList = [];
    for (var i = 0; i < mChartList.length; i++) {
        new_MChartList[i] = [];
        for (var j = 0; j < mChartList[i].length; j++) {
            if (mChartList[i][j] != null && mChartList[i][j] != "") {
                var temp = parseFloat(mChartList[i][j]);
                if (!hasminus && temp < 0) {
                    hasminus = true;
                }
                new_MChartList[i][j] = temp;

            } else {
                new_MChartList[i][j] = 0;
            }
        }
    }
    return new_MChartList;
}

function webViewResume() {
    initMessageDot();
}

function initMessageDot() {
    addLocalRequest(1008, function (ret) {
        try {
            ret = $.parseJSON(ret);
        } catch (e) {
        }
        if (ret) {
            if (ret.isShowMenuDot) {
//                $(".sildmenu_red").show();
            } else {
//                $(".sildmenu_red").hide();
            }
            var messageView = /*$(".ic_new_message");*/document.querySelector(".ic_new_message");
            if (ret.newMessage > 0) {
                messageView.show();
                if (ret.newMessage > 99) {
                    messageView.html(99);
                } else {
                    messageView.html(ret.newMessage);
                }
            } else {
                messageView.hide();
            }
        }
    });
}