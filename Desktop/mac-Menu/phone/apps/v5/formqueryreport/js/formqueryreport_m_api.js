
/**
 * 调整到协同列表
 */
function jumpToList(templateIds,_listTitle){
	 var nextPageData = {
            'templeteIds' : templateIds,
            '_listTitle' : _listTitle           
        };
        
    var _basePath = "/seeyon/m3/apps/v5/formqueryreport";
	if(typeof(cmp.platform.CMPShell) != 'undefined' && cmp.platform.CMPShell){
		_basePath = "http://formqueryreport.v5.cmp/v";
	}
	
    cmp.href.next(_basePath + "/html/index.html", nextPageData);
}
