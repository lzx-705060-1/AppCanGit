/*!
 * @author		shuqi
 * @version 	1.0
 */
;~(function(cmp,$api,$){
	var isdebug = true;//是否调试
	
	cmp.ready(function(){
		var windowH= window.innerHeight;
		$("#data-area").style.height = windowH + "px";
		
		//返回按钮事件绑定
		cmp.backbutton();
		cmp.backbutton.push(cmp.href.back);
		
		var params = cmp.href.getParam() || {excelId: "6375923538632328240", moduleId: "-8388397737066674371", designId: "-8338307632178967164"}
		//var params = cmp.href.getParam() || {}
		if(cmp.isEmptyObject(params)) {
			params = getQueryParams();
		}
		isdebug && console.log(params);
		$api.detail({}, params, {
			success:function(rs){
				isdebug &&  console.log("rs : " , rs);
				if(rs.code != '0'){
					// 数据出错了
					cmp.notification.confirm(cmp.i18n("vreport.page.tips.servererror"), function(e) {
						cmp.href.back();
					}, null, [ cmp.i18n("vreport.page.label.quit") ]);
				}
				var data = rs.data;
				if(!data.canView){
					// 没有查看权限
					cmp.notification.confirm(cmp.i18n("vreport.page.tips.noauth"), function(e) {
						cmp.href.back();
					}, null, [ cmp.i18n("vreport.page.label.quit") ]);
					return;
				}
				document.title = data.definition.title;
				var html = cmp.tpl($("#excel-detail-tpl").innerHTML, {
					"fieldInfos":data.fieldInfos,
					"fieldData":data.data
				});
				$("#data-area").innerHTML = html;
			},error:function(e){
				if(!cmpHandled){
					cmp.href.back();
				}
			}
		});
	});
})(cmp,SeeyonApi.Excelreport,function(selector, queryAll , target ) {
	var t = target ? target : document ;
	if (queryAll) {
		return t.querySelectorAll(selector);
	} else {
		return t.querySelector(selector);
	}
});

/** 获取URL的查询参数 */
function getQueryParams(){
    var url = window.location.search,
        reg_url = /^\?([\w\W]+)$/, 
        reg_para = /([^&=]+)=([\w\W]*?)(&|$|#)/g, 
        arr_url = reg_url.exec(url), 
        ret = {};
    if (arr_url && arr_url[1]) {
        var str_para = arr_url[1], result;
        while ((result = reg_para.exec(str_para)) != null) {
            ret[result[1]] = result[2];
        }
    }
    return ret;
}