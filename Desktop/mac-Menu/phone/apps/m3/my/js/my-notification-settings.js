

;(function(){
    var texts;
    var animated = document.querySelector('#animated');
    define(function(require, exports, module){
        initPage();
    });

    function initPage(){
        cmp.ready(function(){
            initStyle();
            initEvent();
        });
    }

    function initStyle(){
        var xiaomi = [
            {title:"1、设置企业微信为“允许通知",info:"进入“设置”，在 “通知和状态栏”的“通知管理”，找到“企业微信”并打开“允许通知”。",img:"../img/xiaomi1.jpg"},
            {title:"2、允许企业微信“开机自动启动",info:"进入“安全中心”，在 “授权管理”中选择“自启动管理”，找到“企业微信”并选择允许。",img:"../img/xiaomi2.jpg"},
            {title:"3、允许企业微信“显示悬浮窗",info:"进入“安全中心”，在 “授权管理”中选择“应用权限管理”，找到“企业微信”并选择允许“显示悬浮窗”。",img:"../img/xiaomi3.jpg"}
            ];
        cmp(".settings-all").on("tap",".settings",function(e){
            var id = e.target.getAttribute("id");
            var tplHtml = document.querySelector('#settings-tpl');
            var device;
            if(id == "xiaomi"){
                device = xiaomi;
            }
            var html = cmp.tpl(tplHtml,device);
            animated.classList.add('cmp-active');
            animated.innerHTML = html;
            var AnimatedBackBtn = animated.querySelector('#AnimatedBackBtn');
            AnimatedBackBtn.addEventListener('click',function(){
                animated.classList.remove('cmp-active');
            },false);
        });
    }
    function initEvent(){
        document.querySelector('#backBtn').addEventListener("click",function(){
            back();
        },false);
        document.addEventListener('backbutton',function(){
            if(animated.classList.contains('cmp-active')){
                animated.classList.remove('cmp-active');
            }else{
                back();
            }
        },false);

    }
    function back(){
        cmp.href.back();
    }

});