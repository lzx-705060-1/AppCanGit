function OK() {
    var selectedBox = new ArrayList();
    $("#mytable").find("input[type='" + selectBtmType + "']").each(function() {
        if (this.checked) {
            selectedBox.add(this);
        }
    });
    var selectArray = new Array();
    var viewFrame = $("#viewFrame");
    var moduleId = viewFrame[0].contentWindow.getParameter != undefined ? viewFrame[0].contentWindow
            .getParameter("moduleId") : "0";
    /**
     * 返回数据格式 {toFormId:yyyy,
     * selectArray:[{masterDataId:xxx,subData:[{tableName:formson_0001,dataIds:[]},{tableName:formson_0002,dataIds:[]}]},
     * {masterDataId:xxx,subData:[{tableName:formson_0001,dataIds:[]},{tableName:formson_0002,dataIds:[]}]}] }
     */
    $(selectedBox.toArray()).each(
            function(masterIndex) {
                var jqThis = $(this);
                var tempObj = new Object();
                tempObj.masterDataId = jqThis.val();
                var subData = new Array();
                for ( var i = 0; i < toFormBean.tableList.length; i++) {
                    var tempTable = toFormBean.tableList[i];
                    if (tempTable.tableType.toLowerCase() === "slave") {
                        var tempSubData = new Object();
                        tempSubData.tableName = tempTable.tableName;
                        if (jqThis.val() == moduleId) {
                            var subDom = $("#" + tempTable.tableName, viewFrame);
                            var tempSubArray = new Array();
                            if (subDom) {
                                var allCheckedBox = $(":checkbox[checked][tableName='" + tempTable.tableName + "']",
                                        $(viewFrame[0].contentWindow.document));
                                if (allCheckedBox.length == 0) {
                                    allCheckedBox = $(":checkbox[tableName='" + tempTable.tableName + "']:eq(0)",
                                            $(viewFrame[0].contentWindow.document));
                                }
                                allCheckedBox.each(function() {
                                    tempSubArray.push($(this).val());
                                });
                            }
                            tempSubData.dataIds = tempSubArray;
                        }
                        subData.push(tempSubData);
                    }
                }
                tempObj.subData = subData;
                selectArray.push(tempObj);
            });
    var obj = new Object();
    obj.selectArray = selectArray;
    obj.toFormId = toFormBean.id;
    return $.toJSON(obj);
}