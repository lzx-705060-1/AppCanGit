

 cmp.ready(function () {
    cmp.backbutton();
    var search = window.location.search;
    search = search.replace("?", "");
    var searchVals = search.split("&");
    var searchKeys = {};
    for (var i = 0; i < searchVals.length; i++) {
        var searchVal = searchVals[i].split("=");
        searchKeys[searchVal[0]] = searchVal[1];
    }
    switch (searchKeys["ctrl"]) {
        case  "selectOrg":
            cmp.backbutton.push(cmp.href.back);
            var optionsName = searchKeys["options"];
            var pageKey = searchKeys["pageKey"] ? searchKeys["pageKey"] : null;
            var options = cmp.storage.get(optionsName, true);
            options = cmp.parseJSON(options);
            options._transed = true;
            options.jump = true;
            options.pageKey = pageKey;
            var id = options.id;
            options.jumpCallback = function(){
                cmp.storage.delete(optionsName, true);
            };
            cmp.selectOrg(id, options);
            break;
        case "selectOrg4Webview":
            cmp.backbutton.push(cmp.href.close);
            cmp.chat.getSelectOrgParam(
                    {
                        success: function success(res) {
                            var options = cmp.extend({
                                    h5header:true,
                                closeCallback: function () {
                                    cmp.href.close();
                                },
                                callback: function (result) {
                                    cmp.chat.setSelectedOrgResult(
                                            {
                                                success: function success() {
                                                },
                                                error: function error() {
                                                },
                                                result: result
                                            }
                                    );
                                }
                            },res);
                            cmp.selectOrg("select-people", options);
                        },
                        error: function error(error) {
                            console.log(error);
                        }
                    }
            );
            break;
        default :
            break;
    }

});
