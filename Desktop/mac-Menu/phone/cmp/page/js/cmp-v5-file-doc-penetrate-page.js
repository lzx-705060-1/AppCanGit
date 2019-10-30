

var selectedAccDocDataResult = (function(window){
    var selectedAccAction = false;
    var search = window.location.search;
    search = search.replace("?", "");
    var searchVals = search.split("&");
    var searchKeys = {};
    for (var i = 0; i < searchVals.length; i++) {
        var searchVal = searchVals[i].split("=");
        searchKeys[searchVal[0]] = searchVal[1];
    }
    var pageKey = searchKeys["pageKey"] ? searchKeys["pageKey"] : null;
    var docDataOptions = cmp.storage.get("cmp-accDoc-opts", true);
    cmp.storage.delete(pageKey,true);//在这个页面将缓存的回传值删除
    //cmp.storage.delete("cmp-accDoc-opts", true);
    var accDocDataArr = [];
    if(docDataOptions){
        docDataOptions = JSON.parse(docDataOptions);
        selectedAccAction = true;
        var fillBackData = docDataOptions.fillbackData;
        if(fillBackData && fillBackData.length > 0){
            for(var i = 0;i<fillBackData.length;i++){
                fillBackData[i] = typeof fillBackData[i] == "string"?JSON.parse(fillBackData[i]):fillBackData[i];
                accDocDataArr.push(fillBackData[i]);
            }
        }
    }
     return {
         accDocDataArr:accDocDataArr,
         selectedDccAction:selectedAccAction
     };
})(window);
cmp.ready(function(){
    document.title = cmp.i18n("cmp.att.upload");//设置title
    cmp.backbutton();

    var options = cmp.storage.get("cmp-v5-att-initUpload-options", true);
    cmp.storage.delete("cmp-v5-att-initUpload-options", true);//todo 调试用

    options = cmp.parseJSON(options)||{};
    if(selectedAccDocDataResult.selectedDccAction){
        options.newDocsData = selectedAccDocDataResult.accDocDataArr;
    }
    options._transed = true;
    options._selectedDocAction = selectedAccDocDataResult.selectedDccAction;
    var continueUpload = options.continueUpload;
    if(!continueUpload){
        document.querySelector(".cmp-bar-footer").classList.add("cmp-hidden");
    }
    cmp.att.initUpload("#cmpV5FileDocPenetrate",options);

});
