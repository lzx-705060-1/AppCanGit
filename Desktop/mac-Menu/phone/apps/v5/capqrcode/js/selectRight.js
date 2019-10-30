var option;
cmp.ready(function() {
    bindBackBtnEvent();
    cmp.backbutton();
      option = cmp.href.getParam();
      $s.capBarcode.showTemplatesByFormId(option.formId,{},  {
        repeat: false,   //当网络掉线时是否自动重新连接
        success: function (ret) {
          if (ret.data && ret.data.result) {
            var result = ret.data.result;
            if (result.length == 0) {
              cmp.notification.alert("您没有权限查看该内容", function () {
                cmp.href.back();
              }, " ", "确定");
            } else if (result.length == 1 && result[ 0 ].authList.length == 1) {
              var opt = result[ 0 ].authList[ 0 ];
              opt.key = opt.type;
              clickBottomMenu(opt);
            } else {
              showList(result);
            }
          }
        },
        error: function (e) {
          var cmpHandled = cmp.errorHandler(e);
          if(cmpHandled) {
          }else{
            cmp.notification.alert(e.message, function () {
              cmp.href.back();
            }, " ", "确定");
          }
        }
      });
});

function  showList(params) {

 if(params.length>0){
   document.querySelector(".menu-box").style.display="";
   var listTpl = document.querySelector("#authlist_li_tpl").innerHTML;
   var tablelist=document.querySelector("#tablelist");
   var html = cmp.tpl(listTpl, params);
   tablelist.innerHTML = html;
   cmp.listView('#scroll1');

   cmp("#tablelist").on("tap", ".auth-row", function() {
         var opt=JSON.parse(this.getAttribute("data").replace(/'/g,'"'));
         opt.key=opt.type;
         clickBottomMenu(opt);
   });

 }else{
     cmp.notification.alert("传参有问题", function () {
         cmp.href.back();
     }, " ", "确定");
 }

}

function bindBackBtnEvent() {
    cmp.backbutton.push(function(){
        cmp.href.back();
    });
}

function clickBottomMenu(result){
    if(result.key=="customSet") {
        return;
    }
    var rightId="";
    if(result.pcRightId && result.mbRightId){
      rightId=result.pcRightId + "_"+ result.mbRightId;
    }else{
        if(result.pcRightId ){
          rightId=result.pcRightId;
        }else if(result.mbRightId){
          rightId=result.mbRightId;
        }else{
          cmp.notification.toast("rightId为空","center");
          return;
        }
    }

   if(result.key=="add") {

   }else{
     var obj={formType: "main",
       params: { rightId: rightId,
                 moduleId: option.moduleId,
                 formTemplateId: result.templateId,
                 moduleType: "42",
                 operateType: "1"},
       title: "required",
       type: "edit"}
     if(result.key=="browse"){
       obj.params.operateType="2";
       obj.type="browse";
     }

     var pageUrl=""
     if(cmp.platform.CMPShell){
       pageUrl="http://cap4.v5.cmp/v1.0.0/htmls/native/form/index.html";
     }else{
       pageUrl="/seeyon/m3/apps/v5/cap4/htmls/native/form/index.html";
     }

     var params={
       "formId":option.formId,
       "dataIds":[option.moduleId],
       "onlyEditLock":"0" // 1代表只校验编辑锁定，如果不传，后台默认为0
     };

     cmp.dialog.loading(true);
       $s.UnflowForm.checkLock({}, params, {
           repeat:true,   //当网络掉线时是否自动重新连接
           success: function (ret) {
               if(ret.data.code==2011){
                   cmp.dialog.loading(false);
                   cmp.notification.toast("数据不存在","center");
                   //cmp.href.back();
                   return;
               }else{
                   //非查看和新增检查锁定状态
                   if(result.key!="browse" && result.key!="add"){
                     if(result.key.indexOf("update")!=-1){
                       if(ret.data.code!=2000){
                         cmp.dialog.loading(false);
                         cmp.notification.toast("数据已经锁定","center");
                         //cmp.href.back();
                         return;
                       }else{
                           cmp.href.next(pageUrl, obj,{openWebViewCatch:1});
                       }
                     }
                   }else{
                       if(result.key=="browse"){
                         cmp.href.next(pageUrl, obj,{openWebViewCatch:1});
                       }
                   }
               }
           },
           error:function(e){
               var cmpHandled = cmp.errorHandler(e);
               if(cmpHandled) {
               }else{
                   cmp.notification.alert(e.message, function () {
                   }, " ", "确定");
               }
           }
       });
   }

}

