var itemTpl = "";
var sliderWrapper;
var sliderItemIds = [];
var dtPicker = null;
var currentSliderNum = 0;
var date = new Date();
var currentMonth = date.getMonth() + 1;
var currentYear = date.getFullYear();
var sliderObj = null;
var urlParam = getUrlParam();
var cli_year = "";
var cli_month = "";

var getSliderItemDomID = function(year, month, i) {
    var timestamp = Date.parse(new Date());
    return "hr_slider_item_" + timestamp + "_" + year + "_" + month + "_" + i;
};

var getData = function(year, month, salaryData) {
  if(salaryData){
        renderSalaryData(salaryData);
    }else {
        var param = {
            "year": year,
            "month": month
        };
        //cmp.dialog.loading();
        $s.Hr.findSalaryByDate({}, param, {
            repeat:true,   //当网络掉线时是否自动重新连接
            success: function(rv) {
                //cmp.dialog.loading(false);
                renderSalaryData(rv);
    
                // slider[0].addEventListener("slide", function(e) {
                //     document.getElementById("slider").firstElementChild.firstElementChild.classList.remove("cmp-hidden");
                //     currentSliderNum = e.detail.slideNumber;
                // }, false);
                //document.getElementById("slider").firstElementChild.firstElementChild.classList.remove("cmp-hidden");
            },
            error:function(error){
                //cmp.dialog.loading(false);
                var cmpHandled = cmp.errorHandler(error);
                if(cmpHandled){
                    //cmp处理了这个错误
                }else {
                    //customHandle(error) ;//走自己的处理错误的逻辑
                }
            }
        });
    }
    var queryInterval = setInterval(function () {
        if(document.querySelector(".cmp-scroll")&&document.querySelector(".cmp-scroll").querySelectorAll(".data")){
            var dataLength = document.querySelector(".cmp-scroll").querySelectorAll(".data").length;
            for(var i = 0;i < dataLength;i++){
                var firstChild = document.querySelector(".cmp-scroll").querySelectorAll(".data")[i].firstElementChild;
                var lastChild = document.querySelector(".cmp-scroll").querySelectorAll(".data")[i].lastElementChild;
                if(firstChild.clientHeight < lastChild.clientHeight){
                    firstChild.style.height = lastChild.clientHeight + "px";
                }
            }
            window.clearInterval(queryInterval);
        }
    },100);
};

var createSlideItem = function(year, month, i, result) {
    var sliderItemId = getSliderItemDomID(year, month, i);
    sliderItemIds.push(sliderItemId);

    var datas = [];
    for (var j in result) {
        for (var k in result[j]) {
            var obj = {};
            obj.bigtitle = j;
            obj.title = k;
            obj.value = result[j][k];
            datas.push(obj);
        }
    }
    //先兼容下内部协同
    var totalMoney = "0.0";
    if(result["工资总额"]){
        totalMoney = result["工资总额"]["实发金额"] || result["工资总额"]["本月实发工资"] || result["工资总额"]["实发工资"];
    	if (!totalMoney) {
    		totalMoney = "0.0";
    	}
    }
    var num = parseInt(i)+1;
    var itemObj = {
        item: year + "-" + month + "(" + num + ")",
        sliderItemId: sliderItemId,
        data: datas,
        relMoney: totalMoney
    };
    return itemObj;
};

var initDatePicker = function(year,month) {
	var param = {};
	if(year == "" && month == ""){
		param = {type:"month"};
	}else{
		if(month < 10){
			month = "0"+month;
		}
		param = {type:"month",value:year+"-"+month};
	}

    return new cmp.DtPicker(param);
};

cmp.ready(function() {
    //针对于ios状态栏的颜色修改问题
    // if (/iphone|ipad|ipod/gi.test(navigator.userAgent) && cmp.platform.CMPShell){
    //     cmp.app.setStatusBarStyleforiOS({
    //         statusBarStyle : 1
    //     });
    // }
    // if(navigator.userAgent.indexOf("Android") != -1){
    //     document.getElementById("slider").style.paddingTop = "44px";
    // }

    prevPage();
    checkPwd();
    checkPlantForm();
});

function loadData(salaryData) {
	// document.querySelector("header").style.top = 0;
    itemTpl = document.getElementById("pageContent_tpl").innerHTML;
    getData("", "",salaryData);

    cmp("#showMonth")[0].addEventListener("tap", function() {
        dtPicker = initDatePicker(cli_year,cli_month);
        dtPicker.show(function(rs) {
            currentYear = parseInt(rs.y.value);
            currentMonth = parseInt(rs.m.value);
      			cli_year = currentYear;
      			cli_month = currentMonth;
            getData(currentYear, currentMonth);
        });
    }, false);

}

function renderSalaryData(rv){
    var rYear = rv["year"];
    var rMonth = rv["month"];
    if (!rYear) {
        rYear = currentYear;
    }
    if (!rMonth) {
        rMonth = currentMonth;
    }
    var result = rv["salarys"];
    var itemsObjs = [];
    sliderItemIds = [];
    var slider = cmp("#slider");
    sliderObj = slider.slider();
    sliderWrapper = document.getElementById("slider_group");
    for (var i in result) {
        itemsObjs[i] = createSlideItem(rYear, rMonth, i, result[i]);
    }
    sliderWrapper.innerHTML = cmp.tpl(itemTpl, itemsObjs);
    for (var i = sliderItemIds.length - 1; i >= 0; i--) {
        cmp.listView("#" + sliderItemIds[i], {
            isClear: true
        });
    }
    cmp.listView("#" + sliderItemIds[0] + "_0", {
        isClear: true
    });
    cmp.listView("#" + sliderItemIds[sliderItemIds.length - 1] + "_1", {
        isClear: true
    });
}

function prevPage() {
    // cmp("header").on('tap', "#prev", function(e) {
    // 	backFrom();
    // });
    //安卓手机返回按钮监听！
    cmp.backbutton();
    cmp.backbutton.push(backFrom);
}

function checkPwd() {
    //cmp.dialog.loading();
    $s.Hr.isHasPwd("", {
        repeat:true,   //当网络掉线时是否自动重新连接
        success: function(result) {
            //cmp.dialog.loading(false);
            var isHasPassword = result.data;
            if(isHasPassword === "canNotShow"){
                cmp.notification.alert(cmp.i18n("hr.h5.cantshow"),function(){
                    cmp.href.closePage();
                },cmp.i18n("hr.h5.prompt"),cmp.i18n("hr.h5.confirm"));
                return false;
            }
            if (isHasPassword == true || isHasPassword == "true") {
                cmp.notification.prompt(cmp.i18n("hr.h5.salaryPwd"), function(index, val, callbackObj) {
                    window.setTimeout(function() {
                        if (index == 1) {
                        	if(val.length != 0){
                                var isOk = false;
                                //cmp.dialog.loading();
                                $s.Hr.checkPwd({}, {
                                    "password": val
                                }, {
                                    repeat:true,   //当网络掉线时是否自动重新连接
                                    success: function(isOk) {
                                      if (isOk == false || isOk == "false") {
                                        callbackObj.error(cmp.i18n("hr.h5.error6"));
                                    } else {
                                        //cmp.dialog.loading(false);
                                        callbackObj.success();
                                        loadData(isOk);
                                    }
                                        return;
                                    },
                                    error:function(error){
                                        //cmp.dialog.loading(false);
                                        var cmpHandled = cmp.errorHandler(error);
                                        if(cmpHandled){
                                            //cmp处理了这个错误
                                        }else {
                                            //customHandle(error) ;//走自己的处理错误的逻辑
                                        }
                                    }
                                });
                        	} else {
                        		callbackObj.error(cmp.i18n("hr.h5.error1"));
                        	}
                        } else if (index == 0) {
                        	backFrom();
                        }
                    }, 200);
                }, [cmp.i18n("hr.h5.cancel"), cmp.i18n("hr.h5.confirm")], cmp.i18n("hr.h5.enterPwd"), "", 2,1,0);
            } else {
                // setFirstPassword();
                createPassword();
                // cmp.notification.alert(cmp.i18n("hr.h5.setPcSide"), function() {
                // 	backFrom();
                // }, cmp.i18n("hr.h5.prompt"), cmp.i18n("hr.h5.confirm"));
            }
        },
        error:function(error){
            //cmp.dialog.loading(false);
            var cmpHandled = cmp.errorHandler(error);
            if(cmpHandled){
                //cmp处理了这个错误
            }else {
                //customHandle(error) ;//走自己的处理错误的逻辑
            }
        }
    });
}

function createPassword(){
    document.getElementById("firstCopy").value = "";
    document.getElementById("repeatCopy").value = "";
    var msg = cmp.storage.get("hrErrorMsg",true);
    if(msg == null || typeof msg == 'undefined'){
        msg = "";
    }
    var inputHtml = "<form id='passwordForm' onsubmit='checkForm();return false;' onkeyup=''>" +
                    "<input id='firstPassword' class='createPassword' placeholder=\"" + cmp.i18n("hr.h5.newpwd") + "\" value=\"\" type=\"password\"  oninput='shyaringan(\"firstPassword\")' style='margin-bottom: 15px'>" +
                    "<input id='repeatPassword' class='createPassword' placeholder=\""+ cmp.i18n("hr.h5.repwd") +"\" value=\"\" type=\"password\" oninput='shyaringan(\"repeatPassword\")'>" +
                    "</form>" +
                    "<div class=\"error\" style='height: auto;font-size: 12px;line-height: 20px;'>"+ msg +"</div>"+
                    "<p style='font-size: 12px'>"+ cmp.i18n("hr.h5.pwdrule") +"</p>";
    cmp.storage.delete("hrErrorMsg",true);
    cmp.notification.confirm(inputHtml, function(index) {
        if(index == 0){
            backFrom();
        }
        if(index == 1){
            checkForm();
        }
    },cmp.i18n("hr.h5.setpwd") ,[cmp.i18n("hr.h5.cancel"), cmp.i18n("hr.h5.confirm")], null, null, 0);

    var form = document.getElementById("passwordForm");
    if(form){
        form.addEventListener('keyup', function search(e) {
            if(e.keyCode == 13){
                checkForm();
            }
        }, false);
    }
}
function shyaringan(domId){
    var pwd = "";
    if(domId == "firstPassword"){
        pwd = document.getElementById("firstPassword").value;
        document.getElementById("firstCopy").value = pwd;
    }
    if(domId == "repeatPassword"){
        pwd = document.getElementById("repeatPassword").value;
        document.getElementById("repeatCopy").value = pwd;
    }
}

function checkForm(){
    var p1 = document.getElementById("firstCopy").value;
    var p2 = document.getElementById("repeatCopy").value;
    if(validate()){
        //cmp.dialog.loading();
        $s.Hr.createPwd({
            "password": p1
        },{
            success: function(isOk) {
                //cmp.dialog.loading(false);
                if (isOk == true || isOk == "true") {
                    window.location.reload();
                } else {
                    cmp.notification.alert(cmp.i18n("hr.h5.pwderror"), function(index) {
                        window.location.reload();
                    },cmp.i18n("hr.h5.prompt"),[cmp.i18n("hr.h5.confirm")]);
                }
            },
            error:function(error){
                //cmp.dialog.loading(false);
                var cmpHandled = cmp.errorHandler(error);
                if(cmpHandled){
                    //cmp处理了这个错误
                }else {
                    //customHandle(error) ;//走自己的处理错误的逻辑
                }
            }
        });
    }else{
        window.location.reload();
    }
}

/**
 判断确认密码是否一致
 **/
function validate(){
    var p1 = document.getElementById("firstCopy").value;
    var p2 = document.getElementById("repeatCopy").value;
    //
    var msg = "";
    if(p1 == ''){
        msg = cmp.i18n("hr.h5.error1");
        cmp.storage.save("hrErrorMsg", msg,true);
        return false;
    }
    if(p2 == ''){
        msg = cmp.i18n("hr.h5.error4");
        cmp.storage.save("hrErrorMsg", msg,true);
        return false;
    }
    if((p1.length > 50 || p1.length < 6)||(p2.length > 50 || p2.length < 6)){
        msg = cmp.i18n("hr.h5.error3");
        cmp.storage.save("hrErrorMsg", msg,true);
        return false;
    }
    if((!isCriterionWord(p1))||(!isCriterionWord(p2))){
        msg = cmp.i18n("hr.h5.error2");
        cmp.storage.save("hrErrorMsg", msg,true);
        return false;
    }

    // if(!isCriterionWord(p2)){
    //     createPassword("密码仅可使用数字、字母、下划线！");
    //     return false;
    // }

    // if(p2.length > 50 || p2.length < 6){
    //     createPassword("重复密码长度要求6~50位！");
    //     return false;
    // }
    if(p1 != p2){
        msg = cmp.i18n("hr.h5.error5");
        cmp.storage.save("hrErrorMsg", msg,true);
        return false;
    }
    return true;
}

/**
 * 判断密码是否是数字、字母、下划线
 */
function isCriterionWord(value){
    if(!testRegExp(value, '^[A-Za-z0-9_]+$')){
        return false;
    }else{
        return true;
    }
}
/**
 * 执行正则表达式
 */
function testRegExp(text, re) {
    return new RegExp(re).test(text);
}
function backFrom() {
	if(urlParam){
	    if(urlParam["weixinMessage"]){
	    	cmp.href.back();
	    	return;
	    }
        var _type = typeof(urlParam['type']) == 'undefined' ? '' : urlParam['type'];
        if (typeof(urlParam['pageInfo']) != 'undefined' && typeof(urlParam['pageInfo']['url']) != 'undefined' && _type == "message") {
            // var backUrl = urlParam['pageInfo']['url'];
            // cmp.href.next(backUrl, urlParam['pageInfo']['data']);
            cmp.href.back();
        } else {
            cmp.href.back();
        }
	} else {
		cmp.href.back();
	}
}

/**
 * 获取url传递的参数
 * @returns
 */
function getUrlParam() {
    return urlParam = cmp.href.getParam();
}

function checkPlantForm() {
    if (cmp.platform.wechat) { // 是微信浏览器
        // document.getElementById("slider").style.paddingTop = "34px";
    }
}