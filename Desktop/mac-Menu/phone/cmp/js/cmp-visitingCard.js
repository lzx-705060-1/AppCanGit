cmpVISITINGCARDPATH = '';
(function(_){
    if(typeof cmpVisitingCardI18nLoaded == "undefined") _.i18n.load(cmpBASEPATH+'/i18n/', 'cmp-visitingCard',null,cmpBuildversion);
    
    /**
     * 人员卡片调用接口
     * id 人员id
     */
    _.visitingCard = function(id){
        _.ajax({
            headers : {
                "Content-Type" : "application/json; charset=utf-8",
                "Accept":"application/json",
                'token' : _.token
            },
            url:_.origin + '/rest'+"/addressbook/canShowPeopleCard/"+id,
            success:function(result){
                if(result == true){
                    //_.event.trigger("beforepageredirect",document);
                    if(_.platform.CMPShell){
                        var pageKey = "?page=search-next&id="+id+"&from=m3&enableChat=true";
                        _.href.next(cmpVISITINGCARDPATH + "/layout/my-person.html"+ pageKey,null,{nativeBanner:false,openWebViewCatch:1});
                    }else {
                        var tempPath = cmpBASEPATH + "/page/cmp-visitingCard-page.html";
                        _.href.next(tempPath,{id:id+""});
                    }
                }else {
                    _.notification.alert(_.i18n("cmp.visitingCard.message"),null,_.i18n("cmp.visitingCard.tips"),_.i18n("cmp.visitingCard.ok"));
                }
            },
            error:function(error){
                _.errorHandler(error);
            }
        });




    }
})(cmp);
