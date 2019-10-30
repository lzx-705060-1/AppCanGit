

cmp.ready(function(){
    var penetrated = cmp.storage.get("penetrated",true);
    if(penetrated&& penetrated =="true"){
        cmp.storage.delete("penetrated",true);
        cmp.href.back();
        return;
    }
    var search = window.location.search;
    search = search.replace("?", "");
    var searchVals = search.split("&");
    var searchKeys = {};
    for (var i = 0; i < searchVals.length; i++) {
        var searchVal = searchVals[i].split("=");
        searchKeys[searchVal[0]] = searchVal[1];
    }
    var optionsName = searchKeys["options"];
    var pageKey = searchKeys["pageKey"] ? searchKeys["pageKey"] : null;
    cordova.exec(
            function success(params){
                try {
                    params = cmp.parseJSON(params)
                }catch (e){
                    console.log(e);
                }
                if(pageKey == "penetrateAccDoc"){
                    cmp.storage.save("penetrated","true",true);
                    
                    if(params.type == "collaboration"){
                        AttUtil.transfer(params);
                    }else if (params.fr_type){//回传回来的数据，有可能是之前通过文档中心选出来的文档协同、会议。。。。。
                        if(cmp.v5.att_canPenetration4Doc(params.fr_type)){
                            params = cmp.v5.att_transeDocData4Penetration(params);
                            AttUtil.transfer(params);
                        }
                    }else if(params.hasOwnProperty("edocType")){
                        params = cmp.v5.att_transeEdocData4Penetration(params);
                        AttUtil.transfer(params);
                    }else if(params.mimeType = "meeting"){
                        AttUtil.transfer(params);
                    }
                }
            },
            function error(){},
            "CMPNativeH5transferParamsPlugin",
            "sendParams",
            []
    );
});
