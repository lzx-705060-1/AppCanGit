

cmp.ready(function(){

    bindBackEvent();
    bindSaveEvent();
    bindSomeEvent();
    initDataShow();
});
function bindBackEvent() {
    cmp.backbutton();//将Android返回按钮劫持
    cmp.backbutton.push(cmp.href.back);//向返回按钮堆栈加入回退到上一个页面的函数
    document.getElementById("backBtn").addEventListener("tap",function(){
        cmp.href.back();
    })
}
function bindSaveEvent(){
    var debugSwitch = document.getElementById("debugSwitch");
    var mappingSwitch = document.getElementById("mappingSwitch");
    var mappingConfig = document.getElementById("mappingConfig");
    var mappingInput = document.getElementById("mappingInput");
    var barcodeSwitch = document.getElementById("barcodeSwitch");
    document.getElementById("saveBtn").addEventListener("tap",function(){
        var debugSwitchStatus = debugSwitch.classList.contains('cmp-active')?1:0;
        var mappingSwitchStatus = mappingSwitch.classList.contains('cmp-active')?1:0;
        var mappingConfigValue = mappingConfig.value;
        var barcodeSwitchStatus = barcodeSwitch.classList.contains('cmp-active')?1:0;
        if(mappingSwitchStatus && !mappingConfigValue){
            cmp.notification.alert("请输入在线路径配置文件路径",function(){
            },"提示","确定","",false,false);
            return;
        }
        cmp.dialog.loading("");
        if(mappingSwitchStatus && mappingConfigValue){
            cmp.ajax({
                type:'GET',
                url:mappingConfigValue,
                headers:{
                    "Content-Type":"application/json; charset=utf-8",
                    "Accept":"application/json"
                },
                success:function(config){
                    cmp.dialog.loading(false);
                    var configObj = {},mappingPathStr = "";
                    for(var k in config){
                        if(config[k]){
                            configObj[k] = config[k];
                            mappingPathStr += "<li> <span class='mw-text-blue'> "+k + "</span>------><span class='mw-text-green'>" + config[k]+"</span></li>";
                        }
                    }
                    if(!Object.keys(configObj).length){
                        cmp.notification.alert("系统检查出配置文件没有需要映射的路径，请修改配置文件",function(){},"提示","确定","",false,false);
                        mappingSwitch.classList.remove("cmp-active");
                        mappingInput.classList.add("cmp-hidden");
                        return;
                    }
                    cordova.exec(
                            function(){},
                            null,
                            "CMPDebugConfigPlugin",
                            "pathMapping",
                            [{status:mappingSwitchStatus,
                                config:configObj
                            }]
                    );
                    cmp.storageDB.save("applicationMappingValue",mappingConfigValue,null,"forever");
                    var tipsStr = "保存成功，已经成功开启路径映射模式，请重启App!<br>M3映射路径如下，请检查是否正确：<ul>"+mappingPathStr+"</ul>";
                    cmp.notification.alert(tipsStr,function(){},"提示","确定","",false,false);
                },
                error:function(e){
                    cmp.dialog.loading(false);
                    if(!cmp.errorHandler(e)){
                        if(e.code == 404){
                            cmp.notification.alert("系统找不到服务器端的配置文件，请输入正确的映射配置文件路径",function(){},"提示","确定","",false,false)
                        }else {
                            cmp.notification.alert("映射配置文件不是正确格式的json，错误语法："+e.message,function(){
                            },"提示","确定","",false,false);
                        }
                    }else {
                        cmp.notification.alert("映射配置失败，请检查网络原因",function(){
                        },"提示","确定","",false,false);
                    }
                }

            });
        }else {
            cordova.exec(
                    function(){},
                    null,
                    "CMPDebugConfigPlugin",
                    "pathMapping",
                    [{status:mappingSwitchStatus,
                        config:{}
                    }]
            );
        }

        //执行debug模式是否开启
        cordova.exec(
                function(){cmp.dialog.loading(false)},
                function(){cmp.dialog.loading(false)},
                "CMPDebugConfigPlugin",
                "debugSwitch",
                [{status:debugSwitchStatus}]
        );

        cmp.storageDB.save("showDebugBarcodeBtn",barcodeSwitchStatus,null,"forever");
    });
}
function bindSomeEvent(){
    var mappingInput = document.getElementById("mappingInput");
    var mappingSwitch =  document.getElementById("mappingSwitch");
    mappingSwitch.addEventListener("toggle",function(){
        var self = this;
        if(mappingSwitch.classList.contains("cmp-active")){
            mappingInput.classList.remove("cmp-hidden")
        }else {
            mappingInput.classList.add("cmp-hidden")
        }

    });
}
function initDataShow(){
    if(typeof cordova != "undefined"){
        var deviceInfo =  cmp.device.info();
        for(var k in deviceInfo){
            var item = document.getElementById(k);
            if(item){
                item.innerHTML = deviceInfo[k];
            }
        }
        //壳的版本号
        cordova.exec(
                function(result){
                    document.getElementById('cmpshell').innerHTML = result.value
                },
                null,
                "CMPShellPlugin",
                "version",
                [{}]
        );
    }

    var mappingInput = document.getElementById("mappingInput");
    var mappingSwitch = document.getElementById("mappingSwitch");
    var mappingConfig = document.getElementById("mappingConfig");
    var debugSwitch = document.getElementById("debugSwitch");
    var barcodeSwitch = document.getElementById("barcodeSwitch");
    cordova.exec(
            function(config){
                var isDebug = config.isDebug,isMapping = config.isMapping;
                if(isMapping){
                    mappingInput.classList.remove("cmp-hidden");
                    mappingSwitch.classList.add("cmp-active");

                }
                cmp.storageDB.get("applicationMappingValue",function(data){
                    if(data.success && data.data){
                        var mappingVal = data.data;
                        if(mappingVal){
                            document.getElementById("mappingConfig").value = mappingVal;
                        }
                    }
                },"forever");
                if(isDebug){
                    debugSwitch.classList.add("cmp-active");
                }
            },
            null,
            "CMPDebugConfigPlugin",
            "getDebugConfig",
            [{}]
    );
    cmp.storageDB.get("showDebugBarcodeBtn",function(data){
        if(data.success && data.data){
            barcodeSwitch.classList.add("cmp-active");
        }
    },"forever");
    setTimeout(function(){
        var debugDiv = document.getElementById("cmp-debug-float-div");
        if(debugDiv){
            debugDiv.style.display = "none";
        }
    },500)
}
