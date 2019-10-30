cmp.ready(function(){
	cmp.backbutton();
    cmp.backbutton.push(cmp.href.back);
	var templateId = cmp.href.getParam().reportId;
	SeeyonApi.SeeyonReport.getReportTemplateLinkParams(templateId, {},{
		success : function(ret){
			var linkParams = ret.data;
			var reportShow = document.getElementById("reportShow");
			
			/**
			 * 构建表单内容
			 */
			var html = "";
			//传递条件
			var conditions = linkParams.conditions;
			for (var key in conditions) {
				html += '<input type="hidden" id="' + key + '" name="paramName_' + key +'" value = "' + cjkEncode(conditions[key]) +'">';
			}
			//内置条件
			var parameters = linkParams.parameters;
			for (key in parameters) {
				html += '<input type="hidden" id="' + key + '" name="' + key +'" id="' + key + '" value = "' + cjkEncode(parameters[key]) +'">';
			}
			reportShow.innerHTML = html + reportShow.innerHTML;
			
			/**
			 * 构建跳转URL
			 */
			var reportlet = linkParams.reportlet;
			var p = reportlet.toLowerCase().endsWith(".cpt") ? "reportlet" : "formlet";
			var url = cmp.serverIp + "/seeyonreport/ReportServer?" + p + "=" + encodeURI(cjkEncode(reportlet));
			reportShow.setAttribute("action", url+ "&op=h5&cmp_orientation=auto");
			
			/**
			 * 跳转
			 */
			reportShow.submit();
		},
		error : function(error){
			var cmpHandled = cmp.errorHandler(error);
			if(!cmpHandled){
				console.log(error);
				if(error.message){
					cmp.notification.alert(error.message);
				}else{
					cmp.notification.alert(cmp.toJSON(error));
				}
			}
		}
	});
	function cjkEncode(text) {       
	    if (text == null) {       
	        return "";       
	    }       
	    var newText = "";       
	    for (var i = 0; i < text.length; i++) {       
	        var code = text.charCodeAt (i);        
	        if (code >= 128 || code == 91 || code == 93) {//91 is "[", 93 is "]".       
	            newText += "[" + code.toString(16) + "]";       
	        } else {       
	            newText += text.charAt(i);       
	        }       
	    }       
	    return newText;       
	}
});