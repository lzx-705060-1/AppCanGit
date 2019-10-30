
/**
 * 小智语音设置
 */
;(function() {
    var m3Ajax, m3i18n,condition;
    define(function(require, exports, module) {
        require('zepto');
        require('m3');
        m3i18n = require('m3i18n');
        initPage();
    });
    function initPage() {
        var headerH = $("header").height();
        $(".cmp-content").css("height",(window.innerHeight-headerH)+"px");
        cmp.ready(function() {
            m3.checkXiaozhiPermission({
                success: function() {
                    condition = true;
                },
                error: function(err) {
                    condition = false;
                }
            });
            //控制项开关点击事件
            var sws = {};

            (function(_) {

                _.plugin = true; // 用来判断sws对象的属性和方法是否加载了

                _.initStatus = function() {
                    // 初始化样式
                     /*status 小致状态: //是1000:正常/2001:未开通/2002:已停用 /2003:已过期*/
                    if(_.status == '1000'){ 
                        if (_.masterSwitchStatus) { //语音开启状态
                            $("#masterSwitch").addClass("cmp-active");
                            if (_.showXiaoZhiStatus) {
                                 $("#showXiaoZhi").addClass("cmp-active");
                            }
                            if (_.voiceWakeUpStatus) {
                                $("#voiceWakeUp").addClass("cmp-active");
                            }
                            //智能消息开关相关
                            if(_.mainSwitch){//如果智能消息总开关是开启的
                                $("#mainSwitch").addClass("cmp-active");
                                if(_.arrangeSwitch){
                                    $("#arrangeSwitch").addClass("cmp-active");
                                }
                                if(_.cultureSwitch){
                                    $("#cultureSwitch").addClass("cmp-active");
                                }
                                if(_.statisticsSwitch){
                                    $("#statisticsSwitch").addClass("cmp-active");
                                }
                                if(_.chartSwitch){
                                    $("#chartSwitch").addClass("cmp-active");
                                }
                            }
                        }
                        serverStop();
                        if (_.startTime && _.endTime) {
                            $("#demo8").html(_.startTime + "-" + _.endTime);
                        } else {
                            cmp.notification.alert("缺省时间段获取错误");
                        }
                    }else if(_.status == '2001'){//未开通
                        $('.xiaozhiServerStop').hide();
                        $('.xiaozhiServer').hide();
                        $('.xiaozhiServerStop-text').text(fI18nData["my.m3.h5.xiaozhiNotopen"]);
                    }else if(_.status == '2002' || _.status == '2003'){//已停用或者已到期
                        var time = _.outTime;
                        $('#xiaozhiTime').text(formatDate(time));
                        $('#xiaozhiTime').addClass('blue');
                        $('.xiaozhiServerStop').hide();
                        if(_.status == '2002'){  //已停用
                            $('.xiaozhiServerStop-text').text(fI18nData["my.m3.h5.xiaozhiDeactivated"]);
                            $('#xiaozhiTime').removeClass('blue');
                        }else if(_.status == '2003'){ //已到期
                            $('.xiaozhiServerStop-text').text(fI18nData["my.m3.h5.xiaozhiExpired"]);
                            // $('.xiaozhiServerStop-text').addClass('blue');
                        }
                    }
                };
                //设置状态
                _.setStatus = function() {
                    if (sws.masterSwitchStatus) {
                        cmp.speechRobot.open();
                    } else {
                        cmp.speechRobot.close();
                    }
                    if (sws.showXiaoZhiStatus) {
                        cmp.speechRobot.openAssistiveTouch();
                    } else {
                        cmp.speechRobot.closeAssistiveTouch();
                    }
                    if (sws.voiceWakeUpStatus) {
                        cmp.speechRobot.openAutoAwake();
                    } else {
                        cmp.speechRobot.closeAutoAwake();
                    }
                    if (sws.startTime && sws.endTime) {
                        cmp.speechRobot.setRobotWorkTime({
                            startTime: sws.startTime,
                            endTime: sws.endTime
                        });
                    }
                    cmp.speechRobot.setMessageSwitch({
                        mainSwitch:sws.mainSwitch,//智能消息总开关
                        cultureSwitch:sws.cultureSwitch,//文化信息开关
                        statisticsSwitch:sws.statisticsSwitch,//统计数据开关
                        arrangeSwitch:sws.arrangeSwitch,//工作任务开关
                        chartSwitch:sws.chartSwitch//报表数据开关
                    });
                };
                function serverStop(){
                    //小致服务到期时间
                    var time = _.outTime;
                    var formatDateText = formatDate(time);
                    $('#xiaozhiTime').text(formatDateText);
                    var ThatTime = new Date();
                    var markTime = daysBetween(ThatTime,time);
                    if( markTime < 30 ){
                        $('#xiaozhiTime').text($('#xiaozhiTime').html() + fI18nData["my.m3.h5.xiaozhiThere"] + markTime + fI18nData["my.m3.h5.xiaozhiexpire"]);
                        $('#xiaozhiTime').addClass('blue');
                    }
                }

                _.event = function(ele, eventName, eventfun) {
                    ele.length ? ele.on(eventName, eventfun) : alert("绑定事件未获取到元素");
                };


            })(sws);

            /*
            @
             */
            //总开关开启
            function masterSwitchOpen() {
                sws.masterSwitchStatus = true;
                switchOpen($("#masterSwitch"));
                if (sws.showXiaoZhiStatus && !sws.voiceWakeUpStatus) {
                    switchOpen($("#showXiaoZhi"));
                }

                if (sws.voiceWakeUpStatus && !sws.showXiaoZhiStatus) {
                    switchOpen($("#voiceWakeUp"));
                }

                if ((!sws.showXiaoZhiStatus && !sws.voiceWakeUpStatus) || (sws.showXiaoZhiStatus && sws.voiceWakeUpStatus)) {
                    sws.showXiaoZhiStatus = true;
                    switchOpen($("#showXiaoZhi"));
                    sws.voiceWakeUpStatus = true;
                    switchOpen($("#voiceWakeUp"))
                }


                //智能消息开关相关
                switchOpen($("#mainSwitch"));
                switchOpen($("#arrangeSwitch"));
                switchOpen($("#chartSwitch"));
                switchOpen($("#statisticsSwitch"));
                switchOpen($("#cultureSwitch"));
                sws.mainSwitch = true;//智能消息总开关
                sws.cultureSwitch = true;//智能消息文化信息开发
                sws.statisticsSwitch = true;//智能消息统计数据开关
                sws.arrangeSwitch = true;//工作任务开关
                sws.chartSwitch = true;//报表数据开关
            }

            //总开关关闭
            function masterSwitchClose() {
                switchClose($("#masterSwitch"));
                switchClose($("#showXiaoZhi"));
                switchClose($("#voiceWakeUp"));

                //智能消息相关开关
                switchClose($("#mainSwitch"));
                switchClose($("#arrangeSwitch"));
                switchClose($("#chartSwitch"));
                switchClose($("#statisticsSwitch"));
                switchClose($("#cultureSwitch"));
                sws.masterSwitchStatus = false;
                sws.showXiaoZhiStatus = false;
                sws.voiceWakeUpStatus = false;

                sws.mainSwitch = false;//智能消息总开关
                sws.cultureSwitch = false;//智能消息文化信息开发
                sws.statisticsSwitch = false;//智能消息统计数据开关
                sws.arrangeSwitch = false;//工作任务开关
                sws.chartSwitch = false;//报表数据开关
            }

            if (sws.plugin) {
                cmp.speechRobot.getRobotConfig({
                    success: function(res) {
                        sws.masterSwitchStatus = res.isOnOff; //语音小致开关状态
                        sws.showXiaoZhiStatus = res.isOnShow; //显示小致开关状态
                        sws.voiceWakeUpStatus = res.isAutoAwake; //语音唤醒开关状态
                        sws.startTime = res.startTime; //开启时间
                        sws.endTime = res.endTime; //关闭时间
                        sws.outTime = res.outTime; //超期时间
                        sws.status = res.status; //状态
                        sws.mainSwitch = res.mainSwitch;//智能消息总开关
                        sws.cultureSwitch = res.cultureSwitch;//智能消息文化信息开发
                        sws.statisticsSwitch = res.statisticsSwitch;//智能消息统计数据开关
                        sws.arrangeSwitch = res.arrangeSwitch;//工作任务开关
                        sws.chartSwitch = res.chartSwitch;//报表数据开关
                        sws.initStatus();
                    },
                    error: function(res) {
                        cmp.notification.alert("获取全部状态信息失败");
                        console.log(res);
                    }
                });
                //总开关按钮
                var timer,clickMark = true;
                sws.event($("#masterSwitch_div"), "tap", function(e) {
                    if(clickMark){
                        clearTimeout(timer);
                        clickMark = false;
                        timer = setTimeout(function(){
                            clickMark = true;
                        },300);
                        if (!sws.masterSwitchStatus) { // if (e.detail.isActive) { // 总开关开启
                            //检查小智权限
                            if(condition){
                                masterSwitchOpen();
                            }else{
                                masterSwitchClose();
                                cmp.notification.toast("无权限", "center");
                            }
                        } else { //总开关关闭
                            masterSwitchClose();
                        }
                    }
                });
                //是否显示小致开关图标按钮
                sws.event($("#showXiaoZhi_div"), "tap", function(e) {
                    if(clickMark){
                        clearTimeout(timer);
                        clickMark = false;
                        timer = setTimeout(function(){
                            clickMark = true;
                        },300);
                        var masterSwitch = $("#masterSwitch");
                        var voiceWakeUp = $("#voiceWakeUp");
                        var showXiaoZhi = $("#showXiaoZhi");
                        if (!sws.showXiaoZhiStatus) { //if (e.detail.isActive) { // 显示小致开启
                            if(condition){
                                sws.showXiaoZhiStatus = true;
                                switchOpen(showXiaoZhi);
                                $("#masterSwitch").trigger("masterSwitchStatus");
                            }else{
                                masterSwitchClose();
                                cmp.notification.toast("无权限", "center");
                            }
                        } else { //显示小致关闭
                            sws.showXiaoZhiStatus = false;
                            switchClose(showXiaoZhi);
                            $("#masterSwitch").trigger("masterSwitchStatus");
                        }
                    }
                });
                //语音唤醒小致开关按钮
                sws.event($("#voiceWakeUp_div"), "tap", function(e) {
                    if(clickMark){
                        clearTimeout(timer);
                        clickMark = false;
                        timer = setTimeout(function(){
                            clickMark = true;
                        },300);
                        var masterSwitch = $("#masterSwitch");
                        var showXiaoZhi = $("#showXiaoZhi");
                        var voiceWakeUp = $("#voiceWakeUp");
                        if (!sws.voiceWakeUpStatus) { //if (e.detail.isActive) { // 语音唤醒小致开启
                            if(condition){
                                sws.voiceWakeUpStatus = true;
                                switchOpen(voiceWakeUp);
                                $("#masterSwitch").trigger("masterSwitchStatus");
                            }else{
                                masterSwitchClose();
                                cmp.notification.toast("无权限", "center");
                            }
                        } else { //语音唤醒小致关闭
                            sws.voiceWakeUpStatus = false;
                            switchClose(voiceWakeUp);
                            $("#masterSwitch").trigger("masterSwitchStatus");
                        }
                    }
                });
            } else {
                cmp.notification.alert("未正确加载");
            }
            //智能消息按钮事件
            messageSwitchEvent(sws);

            //点击左上角返回按钮
            $("#backBtn").on("tap", function() {
                sws.setStatus();
                cmp.href.back();
            });
            //安卓自带返回键
            document.addEventListener("backbutton", function() {
                sws.setStatus();
                cmp.href.back();
            });
            var result = cmp('.result')[0];
            var btns = cmp('.btnn');
            var clickMark = true;
            btns[0].addEventListener('tap', function() {
                if(clickMark){
                    $('#inputDom').blur();
                    clickMark = false;
                    setTimeout(function(){
                        clickMark = true;
                    },1000);
                    var options = { "type": "timeInterval", "value": sws.startTime + "-" + sws.endTime };
                    var picker = new cmp.DtPicker(options);
                    picker.show(function(rs) {
                        var startH = parseInt(rs.h.text);
                        var endH = parseInt(rs.hTwo.text);
                        var startM = parseInt(rs.i.text);
                        var endM = parseInt(rs.iTwo.text);
                        if (decideLegal(startH, endH, startM, endM)) {
                            var value = rs.value.split("-");
                            result.innerText = rs.value;
                            sws.startTime = value[0];
                            sws.endTime = value[1];
                        } else {
                            result.innerText = sws.startTime + "-" + sws.endTime;
                            sws.startTime = sws.startTime;
                            sws.endTime = sws.endTime;
                            cmp.notification.toast(m3i18n[cmp.language].messageNoticeTime, "center");
                        }
                        picker.dispose();
                    });
                }
                
            }, false);
            //小致总开关监听，各种复杂操作的汇总
            $("#masterSwitch").on("masterSwitchStatus",function(e){
                var subSwitchNum =  $(".sub-switch.cmp-active").length;
                if(subSwitchNum){
                    sws.masterSwitchStatus = true;
                    switchOpen($(this));
                }else {
                    sws.masterSwitchStatus = false;
                    switchClose($(this));
                }
            })

        });
    }

    // var days = daysBetween('2016-11-01','2016-11-02');
    /**
    * 根据两个日期，判断相差天数
    * @param sDate1 开始日期 如：2016-11-01
    * @param sDate2 结束日期 如：2016-11-02
    * @returns {number} 返回相差天数
    */
    function daysBetween(sDate1,sDate2){
        //Date.parse() 解析一个日期时间字符串，并返回1970/1/1 午夜距离该日期时间的毫秒数
        var time1 = Date.parse(new Date(sDate1));
        // var time2 = Date.parse(new Date(sDate2));
        var time2 = sDate2;
        var nDays = Math.abs(parseInt((time2 - time1)/1000/3600/24));
        return  nDays;
    };

    //时间戳函数
    function formatDate(timestamp) {
        var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        Y = date.getFullYear();
        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
        D = date.getDate()<10 ? '0'+ date.getDate() : date.getDate();
        h = date.getHours()<10 ? '0'+ date.getHours() : date.getHours();
        m = date.getMinutes()<10?'0'+ date.getMinutes() : date.getMinutes();
        // s = date.getSeconds()<10?'0'+ date.getSeconds() : date.getSeconds() ;
        return Y+"-"+M+"-"+D+" "+h+":"+m;
    }
    

    //判断设置的时间段是否合法
    function decideLegal(startH, endH, startM, endM) {
        if (startH > endH) {
            return false;
        } else if (startH == endH) {
            if (startM > endM) {
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    }

    function messageSwitchEvent(sws) {
        mainMessageSwitchEvent(sws);
        subMessageSwitchEvent(sws);
        $("#mainSwitch").on("messageMainSwitchStatus",function(){//监听消息总开关状态
            var subSwitchActiveNum = $(".message-sub-switch.cmp-active").length;
            if(subSwitchActiveNum == 0){
                switchClose($("#mainSwitch"));
                sws.mainSwitch = false;
            }else {
                switchOpen($("#mainSwitch"));
                sws.mainSwitch = true;
            }
        })

    }
    function mainMessageSwitchEvent(sws){
        sws.event($("#mainSwitch_div"), "tap", function(e) {
            if($("#mainSwitch").hasClass("cmp-active")){
                closeMessageSubSwitchByMainSwitch(sws);
            }else {
                openMessageSubSwitchByMainSwitch(sws);
            }
            $("#masterSwitch").trigger("masterSwitchStatus");
        });
    }
    function closeMessageSubSwitchByMainSwitch(sws){
        switchClose($(".message-sub-switch"));
        switchClose($("#mainSwitch"));
        sws.cultureSwitch = false;//智能消息文化信息开发
        sws.statisticsSwitch = false;//智能消息统计数据开关
        sws.arrangeSwitch = false;//工作任务开关
        sws.chartSwitch = false;//报表数据开关
        sws.mainSwitch = false;
        $("#masterSwitch").trigger("masterSwitchStatus");
    }
    function openMessageSubSwitchByMainSwitch(sws){
        switchOpen($(".message-sub-switch"));
        switchOpen($("#mainSwitch"));
        sws.cultureSwitch = true;//智能消息文化信息开发
        sws.statisticsSwitch = true;//智能消息统计数据开关
        sws.arrangeSwitch = true;//工作任务开关
        sws.chartSwitch = true;//报表数据开关
        sws.mainSwitch = true;
        $("#masterSwitch").trigger("masterSwitchStatus");
    }
    
    function subMessageSwitchEvent(sws){

        $("#arrangeSwitch_div").on("tap",function(){
            sws.arrangeSwitch = setSubMessageSwitchStatus($("#arrangeSwitch"),$("#arrangeSwitch").hasClass("cmp-active"));
        });
        $("#cultureSwitch_div").on("tap",function(){
            sws.cultureSwitch = setSubMessageSwitchStatus($("#cultureSwitch"),$("#cultureSwitch").hasClass("cmp-active"));
        });
        $("#statisticsSwitch_div").on("tap",function(){
            sws.statisticsSwitch = setSubMessageSwitchStatus($("#statisticsSwitch"),$("#statisticsSwitch").hasClass("cmp-active"));
        });
        $("#chartSwitch_div").on("tap",function(){
            sws.chartSwitch = setSubMessageSwitchStatus($("#chartSwitch"),$("#chartSwitch").hasClass("cmp-active"));
        });
    }

    function setSubMessageSwitchStatus(obj,close){
        var status;
        if(close){
            switchClose(obj);
            status = false;
        }else {
            switchOpen(obj);
            status = true;
        }
        $("#mainSwitch").trigger("messageMainSwitchStatus");
        $("#masterSwitch").trigger("masterSwitchStatus");
        return status;
    }

    function switchOpen(obj) {
        obj.addClass("cmp-active").children(".cmp-switch-handle").css("transform", "translate(21px, 0px)");
    }
    function switchClose(obj){
        obj.removeClass("cmp-active").children(".cmp-switch-handle").css("transform", "translate(0px, 0px)");
    }

})();


