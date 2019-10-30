﻿cmp.ready(function() {
    // bindBackBtnEvent();
    cmp.backbutton();
    params = cmp.href.getParam();
    // params = {
    //     "formTemplateId" : "4186034044218656011",
    //     "moduleType": "37",
    //     "name": "全控件表（不含重复表）",
    //     "moduleId": "8250540859378281294",
    //     "formId": "7483787527685030544",
    //     "rightId": "-1491806840590743766.3165422116503176826|",
    //     "viewState": "2",
    //     "updateAuthList": [{
    //         "rightId": "-1491806840590743766.116790644106022826",
    //         "displayName": "修改",
    //         "modifyShowDeal": false
    //     }, {
    //         "rightId": "-1491806840590743766.116790644106022826",
    //         "displayName": "修改1",
    //         "modifyShowDeal": false
    //     }]
    // };
    showList();
});

function  showList() {
    // var opt = {
    //     "moduleId": "8250540859378281294",
    //     "dataId": "8250540859378281294",
    //     "formId": "7483787527685030544"
    // };
    // $s.CapForm.decodeUnflowURL({}, opt, {
    //     repeat: false,   //当网络掉线时是否自动重新连接
    //     success: function (ret) {
    //
    //     },
    //     error: function (e) {
    //
    //     }
    // });

 if(params || params.updateAuthList){
     var items =[];//['同意', '不同意', '很好很不错'];
     for(var i=0;i<params.updateAuthList.length;i++){
         items.push(params.updateAuthList[i].displayName);
     }
     cmp.dialog.list(items, " ", cmp.i18n('unflowform.'), function (result) {
         var opt=params.updateAuthList[result.index];
         opt.key="update";
         params.rightId=opt.rightId;
         params.updateAuthList=null;
         clickBottomMenu(opt);
     }, function () {
         cmp.href.back();
     });
 }else{
     cmp.notification.alert("传参有问题", function () {
         cmp.href.back();
     }, " ", cmp.i18n('unflowform.ok'));
 }

}

function bindBackBtnEvent() {
    var backBtn = document.getElementById("backBtn");
    backBtn.addEventListener("tap", function(){
        cmp.href.back();
    });
    cmp.backbutton.push(function(){
        cmp.href.back();
    });
}

function clickBottomMenu(result){
    if(result.key=="customSet") {
        return;
    }

    params.contentAllId=params.moduleId;
    params.dataId=params.moduleId;
    params.ids=params.moduleId;
    params.isNew=false;
    var locked=true;

   if(result.key=="add") {
        params.showType = "add";
        params.contentAllId = 0;
        params.isNew = true;
        cmp.openUnflowFormData(params);
   }else{
       cmp.dialog.loading(true);
       $s.UnflowForm.checkDelete({}, params, {
           repeat:true,   //当网络掉线时是否自动重新连接
           success: function (ret) {
               if(!ret.isExist){
                   cmp.dialog.loading(false);
                   cmp.notification.toast(cmp.i18n("unflowform.data.notexists"),"center");
                   cmp.href.back();
                   return;
               }else{
                   //非查看和新增检查锁定状态
                   if(result.key!="browse" && result.key!="add"){
                       $s.UnflowForm.checkDataLockForEdit ({}, params, { //判断是否处于编辑锁定状态
                           repeat:true,   //当网络掉线时是否自动重新连接
                           success: function (ret) {
                               if(ret.msg!=undefined){
                                   cmp.dialog.loading(false);
                                   cmp.notification.toast(ret.msg,"center");
                                   cmp.href.back();
                                   return;
                               }else{
                                   $s.UnflowForm.checkLock({}, params, {
                                       repeat:true,   //当网络掉线时是否自动重新连接
                                       success: function (ret) {
                                           locked=ret.locked;

                                           if(result.key.indexOf("update")!=-1){
                                               if(locked){
                                                   cmp.dialog.loading(false);
                                                   cmp.notification.toast(cmp.i18n("unflowform.datalocked"),"center");
                                                   cmp.href.back();
                                                   return;
                                               }else{
                                                   if(!result.modifyShowDeal){
                                                       params.showType="update";
                                                       params.openFrom=="scanInput";
                                                       params.needCheckRight=true;
                                                       cmp.openUnflowFormData(params);
                                                   }else{//修改不弹出
                                                       var opt=params;
                                                       if(opt.rightId.indexOf(".")!=-1){
                                                           opt.rightId=opt.rightId.substring(opt.rightId.indexOf(".")+1);
                                                       }
                                                       if(opt.rightId.indexOf("|")!=-1){
                                                           opt.rightId=opt.rightId.split("|")[0];
                                                       }
                                                       $s.UnflowForm.doHideRefresh ({}, opt, {
                                                           repeat:false,   //当网络掉线时是否自动重新连接
                                                           success: function (ret) {
                                                               cmp.dialog.loading(false);
                                                               if(ret.msg!=undefined){
                                                                   cmp.notification.toast(ret.msg,"center");
                                                                   cmp.href.back();
                                                                   return;
                                                               }else{
                                                                   cmp.href.back();
                                                               }
                                                           },
                                                           error:function(e){
                                                               var cmpHandled = cmp.errorHandler(e);
                                                               if(cmpHandled) {
                                                               }else{
                                                                   cmp.notification.alert(e.message, function () {
                                                                   }, " ", cmp.i18n('unflowform.ok'));
                                                               }
                                                           }
                                                       });
                                                   }

                                               }
                                           }else if(result.key=="allowdelete"){
                                               if(locked){
                                                   cmp.dialog.loading(false);
                                                   cmp.notification.toast(cmp.i18n("unflowform.datalocked"),"center");
                                                   return;
                                               }
                                               cmp.notification.confirm(cmp.i18n("unflowform.deleteconfirm"),function(e) {
                                                   //e==0 是 e==1否
                                                   if (e == 1) {
                                                       $s.UnflowForm.deleteFormData({}, params, {
                                                           repeat:false,   //当网络掉线时是否自动重新连接
                                                           success: function (ret) {
                                                               cmp.dialog.loading(false);
                                                               if (ret.success) {
                                                                   crumbsID+=1;
                                                                   cmp.storage.save("crumbsID",crumbsID,true);
                                                                   cmp.href.back();
                                                               }
                                                           },
                                                           error:function(e){
                                                               var cmpHandled = cmp.errorHandler(e);
                                                               if(cmpHandled) {
                                                               }else{
                                                                   cmp.notification.alert(e.message, function () {
                                                                   }, " ", cmp.i18n('unflowform.ok'));
                                                               }
                                                           }
                                                       });
                                                   }else{
                                                       cmp.dialog.loading(false);
                                                   }
                                               },cmp.i18n('unflowform.confirm'),[cmp.i18n("unflowform.cancel"),cmp.i18n("unflowform.ok")]);
                                           }else if(result.key=="lock" || result.key=="unlock" || result.key=="allowlock" ) {
                                               if (!locked) {
                                                   //cmp.notification.confirm(cmp.i18n("unflowform.lockconfirm"),function(e) {
                                                   //    //e==0 是 e==1否
                                                   //    if (e == 0) {
                                                   $s.UnflowForm.lock({}, params, {
                                                       repeat:false,   //当网络掉线时是否自动重新连接
                                                       success: function (ret) {
                                                           cmp.dialog.loading(false);
                                                           if (ret.success) {
                                                               crumbsID+=1;
                                                               cmp.storage.save("crumbsID",crumbsID,true);
                                                               cmp.href.back();

                                                           }
                                                       },
                                                       error:function(e){
                                                           var cmpHandled = cmp.errorHandler(e);
                                                           if(cmpHandled) {
                                                           }else{
                                                               cmp.notification.alert(e.message, function () {
                                                               }, " ", cmp.i18n('unflowform.ok'));
                                                           }
                                                       }
                                                   });
                                                   //    }
                                                   //});
                                               }else {
                                                   //cmp.notification.confirm(cmp.i18n("unflowform.unlockconfirm"),function(e) {
                                                   //    //e==0 是 e==1否
                                                   //    if (e == 0) {
                                                   $s.UnflowForm.unLock({}, params, {
                                                       repeat:false,   //当网络掉线时是否自动重新连接
                                                       success: function (ret) {
                                                           cmp.dialog.loading(false);
                                                           if (ret.success) {
                                                               crumbsID+=1;
                                                               cmp.storage.save("crumbsID",crumbsID,true);
                                                               cmp.href.back();
                                                           }
                                                       },
                                                       error:function(e){
                                                           var cmpHandled = cmp.errorHandler(e);
                                                           if(cmpHandled) {
                                                           }else{
                                                               cmp.notification.alert(e.message, function () {
                                                               }, " ", cmp.i18n('unflowform.ok'));
                                                           }
                                                       }
                                                   });
                                                   //    }
                                                   //});
                                               }
                                           }
                                       },
                                       error:function(e){
                                           var cmpHandled = cmp.errorHandler(error);
                                           if(cmpHandled) {
                                           }else{
                                               cmp.notification.alert(e.message, function () {
                                               }, " ", cmp.i18n('unflowform.ok'));
                                           }
                                       }
                                   });
                               }
                           },
                           error:function(e){
                               var cmpHandled = cmp.errorHandler(e);
                               if(cmpHandled) {
                               }else{
                                   cmp.notification.alert(e.message, function () {
                                   }, " ", cmp.i18n('unflowform.ok'));
                               }
                           }
                       });
                   }else{
                       if(result.key=="browse"){
                           if(params.rightId==undefined){
                               cmp.each(configData.author,function(i,obj){
                                   if(obj.key==result.key ){
                                       var newFormAuth = obj.value;
                                       //var strs = newFormAuth.split(".");
                                       //params.viewId=strs[0];
                                       //params.rightId=strs[1];
                                       params.rightId=newFormAuth;
                                   }
                               });
                           }
                           params.showType="browse";
                           setTimeout(function(){
                               cmp.openUnflowFormData(params);
                           },500);
                       }
                   }
               }
           },
           error:function(e){
               var cmpHandled = cmp.errorHandler(e);
               if(cmpHandled) {
               }else{
                   cmp.notification.alert(e.message, function () {
                   }, " ", cmp.i18n('unflowform.ok'));
               }
           }
       });
   }

}

