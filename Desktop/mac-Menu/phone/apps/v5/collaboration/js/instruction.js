var urlParam = {};

cmp.ready(function() {
	urlParam = cmp.href.getParam();
    initBackEvent();
    cmp.i18n.init(_collPath + "/i18n/", "Collaboration", function(){
    	initPageData();
    },$verstion);
})

function initPageData(){
	var params = {
		templateId : urlParam.templateId
	};
	$s.Coll.getDataRelationInstruction(params,errorBuilder({
        success : function(result) {
            _$("#templateName").innerHTML = cmp.i18n("collaboration.dataRelation.instruction.content4") + result.data.templateName;
            _$("#formName").innerHTML = cmp.i18n("collaboration.dataRelation.instruction.content5") + result.data.formName;
            _$("#creater").innerHTML = cmp.i18n("collaboration.dataRelation.instruction.content6") + result.data.createMemberName;
            _$("#department").innerHTML = cmp.i18n("collaboration.dataRelation.instruction.content7") + result.data.departName;
        }
    }));
}

function initBackEvent(){
    cmp.backbutton();
    cmp.backbutton.push(_goBack);
    _$("#goBackBtn").addEventListener("tap", _goBack);
}

function _goBack() {
    cmp.href.back();
}