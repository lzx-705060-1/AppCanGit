/**
 * description: 我的模块——企业二维码
 * author: Ms
 * createDate: 2017-09-27
 */
;(function() {
    var m3,m3Ajax,userdata,m3i18n,getParam,nativeApi,alertBtns,isloading=true,isBindBtn={},emailValue = "";
    define(function(require, exports, module) {
        //加载模块
        m3 = require('m3');
        m3Ajax = require('ajax');
        m3i18n = require('m3i18n');
        nativeApi = require("native");
        initPage();
    });
    // 初始化
    function initPage() {
        cmp.ready(function() { 
            userdata = m3.userInfo.getCurrentMember();
            console.log(cmp.href.getParam())
            getParam = cmp.href.getParam();
            alertBtns = [cmp.i18n("cmp.notification.ok")];

            cmp.webViewListener.addEvent("myperson_email_bind",function(e){
                var data = e;//此data是webview2传给webview1的数据，
                //此回调函数做webview1被触发后的业务逻辑
                if(data){
                    var otherPersonUrl = m3.curServerInfo.url + "/mobile_portal/seeyon/rest/m3/contacts/showPeopleCard/" + userdata.id;
                        
                    m3Ajax({
                        url: otherPersonUrl,
                        type: "GET",
                        success: function( ret ) {
                            getParam.emb = ret.data.emb;
                            if(getParam.emb == "true"){  //邮箱获取成功。已绑定邮箱
                                $('#complete').addClass('cmp-hidden');//隐藏完成按钮
                                $('#Untie').removeClass('cmp-hidden');//显示解绑按钮
                                $('#inputDom').attr("readonly","true");
                                $('#inputDom').attr("disabled","disabled");
                                $('.isbind-text.isunbind').text('已绑定,'+fI18nData["my.m3.h5.bindEmailorEmail"]);
                                isBindBtn.hide();
                            }
                            cmp.webViewListener.fire({
                                type:"myperson_index",  //此参数必须和webview1注册的事件名相同
                                data:{"emb":ret.data.emb}, //webview2传给webview1的参数
                                success:function(res){
                                    console.log(res);
                                },
                                error:function(res){
                                    console.log(res);
                                }
                            });
                        },
                        error: function(res){
                            console.log(res);
                        }
                    });
                }
            });
            
            initStyle();
            initEvent();
        });
    }

    isBindBtn ={
        isInputDiv:function(){return document.querySelector('.cmp-input-row')},
        show:function(){
            if(this.isInputDiv()){
                this.isInputDiv().classList.add('isEmail');
            }
            var bindbtnDiv = document.createElement("div");
            bindbtnDiv.className = "emailbindbtn";
            bindbtnDiv.innerHTML = fI18nData["my.m3.h5.binding"];
            $('#content').append(bindbtnDiv);
            $('.emailbindbtn').on("tap",function(){
                var value = $('#inputDom').val();
                if(value ==""){
                    cmp.notification.alert("请输入邮箱!");
                    return;
                }
                if(getParam.typeIndex == "email"){ //邮箱
                    //邮箱正则  邮箱格式不对
                    var reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
                    if((!reg.test(value)) && value.length){
                        cmp.notification.alert(fI18nData["my.m3.h5.emailCorrect"],null,null,alertBtns,true);
                        return;
                    }
                }
                bindEmailFun(value);
            });
        },
        hide:function(){
            $('.emailbindbtn').remove();
            this.isInputDiv().classList.remove("isEmail");
        }
    }

    function initStyle(){

        $('#headerTitle').text(getParam.title);//标题
        if(getParam.typeIndex == "email"){  //如果是邮箱的话，单独处理
            //验证邮箱是否已绑定
            testEmail(function(res){
                if(!res)return;
                var result = res;
                var data = result.data;
                filterInput(false);
                //验证是否已绑定邮箱方法还未提供
                if(getParam.emb == "true"){  //邮箱获取成功。已绑定邮箱
                    $('#complete').addClass('cmp-hidden');//隐藏完成按钮
                    $('#Untie').removeClass('cmp-hidden');//显示解绑按钮
                    $('#inputDom').attr("readonly","true");
                    $('#inputDom').attr("disabled","disabled");
                    isBindBtn.hide();
                    $('#content').append('<span class="isbind-text isunbind">已绑定,'+fI18nData["my.m3.h5.bindEmailorEmail"]+'</span>');
                }else{
                    $('#content').append('<span class="isbind-text isunbind">'+fI18nData["my.m3.h5.bindEmailorEmail"]+'</span>');

                }
            });
        }else{
            if(!getParam.istextArea){ //普通文本框
                filterInput(false);
            }else{  //多行文本框
                filterInput(true);
            }
            $('#complete').text(fI18nData['my.m3.h5.complete']);//完成按钮
        }
    }

    //渲染文本框
    function filterInput(istextArea){
        var inputDiv = document.createElement('div');
        inputDiv.className = "cmp-input-row";
        if(getParam.typeStyle && getParam.typeStyle == "2"){ //自定义字段的日期格式
            // var pseronData = {"type":"date","value":getParam.value};
            var html = '<input id="inputDom" class="btn" type="text" value="'+getParam.value+'"></input>';
            inputDiv.innerHTML = html;
            $('#content').append(inputDiv);
            $('#inputDom').attr("data-options",'{"type":"date","beginYear":"1900","endYear":"2070","value":"'+getParam.value+'"}');
            //点击日期选择组件
            $('#inputDom').on('tap', function() {
                var self=$(this);
                var optionsJson = self.attr('data-options') || '{}';
                var options = JSON.parse(optionsJson);
                var id = self.attr('id');
                var picker = new cmp.DtPicker(options);
                picker.show(function(rs) {
                    $('#inputDom').val(rs.value);
                    var data = {
                        "type":"date",
                        "beginYear":"1900",
                        "endYear":"2070",
                        "value":rs.value
                    }
                    $('#inputDom').attr("data-options",JSON.stringify(data));
                });
            });
        }else{  //其他可修改的字段
            if(istextArea){  //渲染多文本框
                var html = '<textarea id="inputDom" rows="8" class=""></textarea>';
                inputDiv.innerHTML = html;
                $('#content').append(inputDiv);
                $('#inputDom').val(getParam.value);
            }else {
                var html = ' <input placeholder="'+getParam.title+'" id="inputDom" type="text" class="cmp-input-clear"><span id="clearInput" class="cmp-icon cmp-icon-clear cmp-hidden"></span>';
                inputDiv.innerHTML = html;
                $('#content').append(inputDiv);
                $('#inputDom').val(getParam.value);
                if(getParam.typeIndex == "email" && getParam.info !=""){
                    isBindBtn.show();
                }
                emailValue = getParam.value.escapeHTML();
            }
        }
        inputClear();
        
    }

    //验证邮箱是否已绑定
    function testEmail(callback){
        // userdata.loginName
        var url = m3.curServerInfo.url +'/mobile_portal/seeyon/rest/password/retrieve/canUseEmail';
        m3Ajax({
            url:url,
            type:"GET",
            success:function(res){
                callback && callback(res);
            },
            error:function(res){
                callback && callback(false);
                //邮箱获取失败
                cmp.notification.alert(fI18nData["my.m3.h5.emailGetCorrect"],null,null,alertBtns,true);
            }
        });
    }

 

    //事件初始化
    function initEvent() {
        //点击完成按钮
        var clickMark = true;
        $('#complete').on("tap",function(){
            if(clickMark){
                $('#inputDom').blur();
                clickMark = false;
                setTimeout(function(){
                    clickMark = true;
                },2000);
                //--------防止暴力点击
                if(!isloading)return;
                var number = /^[0-9]*$/;//验证数字
                // var iphone = /^[1][3,4,5,7,8][0-9]{9}$/; //11位有效手机号码
                // var homephone = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/; //固定号码
                // var emailtest = "^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$";
                
                var value = $('#inputDom').val();
                if(getParam.value == value){//"值未修改,无须保存!"
                    // cmp.notification.alert(fI18nData["my.m3.h5.isgetParamValue"]);
                    cmp.notification.toast(fI18nData["my.m3.h5.saveSuccess"],"center");
                    setTimeout(function(){
                        cmp.href.back();
                    },1000);
                    return;
                }
                if(getParam.typeIndex == "tel"){ //手机号码
                    if(!number.test(value) || value.length > 70){
                        cmp.notification.alert(fI18nData["my.m3.h5.Incorrectformat"]);
                        return;
                    }
                }else if(getParam.typeIndex == "officeNumber"){//办公电话
                    //最大长度65
                    if(value.length > 65){
                        cmp.notification.alert(fI18nData["my.m3.h5.textCorrectTonumber"],null,null,alertBtns,true);
                        return;
                    }
                }else if(getParam.typeIndex == "email"){ //邮箱
                    //邮箱正则  邮箱格式不对
                    var reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
                    if((!reg.test(value)) && value.length){
                        cmp.notification.alert(fI18nData["my.m3.h5.emailCorrect"],null,null,alertBtns,true);
                        return;
                    }
                }else 
                // 自定义字段格式验证
                // 数字格式  支持长度最多13位，整数部分最多8位，小数部分最多4位有效数字!
                if(getParam.typeStyle && getParam.typeStyle == 0){ //文本
                    //文本格式 长度限制100
                    if(value.length > 100 ){
                        cmp.notification.alert(fI18nData["my.m3.h5.textCorrect"]);
                        return;
                    }
                }else if( getParam.typeStyle && getParam.typeStyle == 1){ //数字
                    // var numberTest = /^[0-9]*$/;
                    //支持长度最多13位，整数部分最多8位，小数部分最多4位有效数字!
                    var reg = /^([0-9]{0,8})([.][0-9]{1,4})?$/;
                    if(!reg.test(value)){
                        cmp.notification.alert(fI18nData["my.m3.h5.textCorrectTolength"]);
                        return;
                    }
                }else{
                    if(value.length > 100 ){
                        cmp.notification.alert(fI18nData["my.m3.h5.textCorrect"]);
                        return;
                    }
                }
                //更新已修改的字段--个人信息
                updateItem(value,function(){
                    setTimeout(function(){
                        firepersonindex();
                        // if(getParam.typeIndex == "email"){
                        //     firepersonindex("isEmail");
                        // }else{
                        //     firepersonindex();
                        // }
                    },1000);
                    // if(getParam.typeIndex == "email"){
                    //     var msg = '<div class=""><div class="alert-title">'+fI18nData["my.m3.h5.bindEmail"]+'</div><div class="alert-small">'+fI18nData["my.m3.h5.bindEmailorEmail"]+'</div></div>';
                    //     cmp.notification.confirm(msg,function(index){
                    //         if(index == 1){
                    //             bindEmailFun(value);
                    //         }else{
                    //             cmp.href.back();
                    //         }
                    //     },null,["不绑定",fI18nData["my.m3.h5.binding"]]);
                    // }
                });
            }
            
        });

        //点击解绑按钮
        $('#Untie').on("tap",function(){
            cmp.notification.confirm(fI18nData["my.m3.h5.untieEmail"],function(index){
                if(index == 1){
                    $('#inputDom').removeAttr("readonly");
                    var url = m3.curServerInfo.url +'/mobile_portal/seeyon/rest/password/unbind';
                    m3Ajax({
                        url:url,
                        type:"GET",
                        success:function(res){
                            if(res.code == "0"){
                                $('#complete').removeClass('cmp-hidden');//显示完成按钮
                                $('#Untie').addClass('cmp-hidden');//隐藏解绑按钮
                                $('.isbind-text.isunbind').text(fI18nData["my.m3.h5.bindEmailorEmail"]);
                                $('#inputDom').removeAttr("disabled");
                                isBindBtn.show();

                                getParam.emb = "false";
                                //解除绑定成功
                                cmp.notification.alert(fI18nData["my.m3.h5.untieEmailisTrue"],null,null,alertBtns,true);
                                cmp.webViewListener.fire({
                                    type:"myperson_index",  //此参数必须和webview1注册的事件名相同
                                    data:{"emb":"false"}, //webview2传给webview1的参数
                                    success:function(res){
                                        console.log(res);
                                    },
                                    error:function(res){
                                        console.log(res);
                                    }
                                });
                            }else{
                                cmp.notification.alert(res.message,null,null,alertBtns,true);
                            }
                        }
                    })
                }
            },null,[fI18nData["my.m3.h5.cancel"],fI18nData["my.m3.h5.binding"]]);
        });

        
        //左上角返回按钮
        backBtn();
    };
    //文本框删除按钮
    function inputClear(){
        //文本框删除按钮适配
        $('#inputDom').on('focus',function(){
            $('#clearInput').removeClass('cmp-hidden');
            $('.cmp-input-row').removeClass('isEmail');
            $('.emailbindbtn').hide();
        });
        $('#inputDom').on('blur',function(){
            $('#clearInput').addClass('cmp-hidden');
            $('.cmp-input-row').addClass('isEmail');
            $('.emailbindbtn').show();
        });
        $("#inputDom").on("input",function(){
            if(this.value == ""){
                isBindBtn.hide();
            }
        })
        $('#clearInput').on('tap',function(){
            $('#inputDom').val("");
            $('#clearInput').addClass('cmp-hidden');
        });
    }

    //更新修改字段
    function updateItem(value,callback){
        //更新修改的字段
        var url = m3.curServerInfo.url +'/mobile_portal/seeyon/rest/addressbook/peopleCard/update?option.n_a_s=1';          
        var updateValue = {};
        updateValue[getParam.type] = value;
        cmp.dialog.loading(true);
        m3Ajax({
            url:url,
            type:"POST",
            data:JSON.stringify(updateValue),
            success:function(res){
                console.log(res)
                cmp.dialog.loading(false);
                if(res.code == "0"){
                    //保存成功
                    cmp.notification.toast(fI18nData["my.m3.h5.saveSuccess"],"center");
                    callback && callback();
                }else{
                    cmp.notification.alert(res.message,null,null,alertBtns,true);
                }
            },
            error:function(res){
                console.log(res)
            }
        });
    }
    
    function bindEmailFun(value){
        //点击绑定的时候，需要验证一次文本框的值是否修改过，修改过的话必须先进行保存
        if(emailValue == value){  //与最开始进来的值相同
            sendEmailCode(value);
        }else{  
            updateItem(value,function(){
                sendEmailCode(value);
            });
        }
    }

    function sendEmailCode(value){
        cmp.dialog.loading(true);
        isloading = false;
        //验证一次邮箱是否可进行修改
        var url = m3.curServerInfo.url +'/mobile_portal/seeyon/rest/password/bind/send';
        m3Ajax({
            url:url,
            type:"GET",
            success:function(res){
                cmp.dialog.loading(false);
                isloading = true;
                if(res.code == "0"){ //邮箱校验成功并已发送邮箱
                    cmp.notification.toast(fI18nData["my.m3.h5.bindEmailisTest"]);
                    var objects = {
                        "title":getParam.title,
                        "value":value
                    }
                    m3.state.go(m3.href.map.my_personEmailUpdate, objects , m3.href.animated.left, true);
                
                }else{
                    cmp.notification.alert(res.message,null,null,alertBtns,true);
                }
            },
            error:function(){
                cmp.notification.alert("邮箱不可修改!");
            }
        });
    }


    //左上角返回按钮
    function backBtn() {
       document.addEventListener("backbutton",function(){
            cmp.href.back();
       },false);
       $("#backBtn").on("tap", function() {
            cmp.href.back();
       });
    }

    function firepersonindex(isEmail){
        cmp.webViewListener.fire({
            type:"myperson_index",  //此参数必须和webview1注册的事件名相同
            data:"true", //webview2传给webview1的参数
            success:function(res){
                console.log(res);
                cmp.href.back();
                // if(!isEmail){
                //     cmp.href.back();
                // }
            },
            error:function(res){
                console.log(res);
            }
        });
    }


})();
