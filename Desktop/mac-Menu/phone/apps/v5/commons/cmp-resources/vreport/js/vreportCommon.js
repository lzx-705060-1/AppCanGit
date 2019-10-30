/**
 * 报表中心
 */
var vreportCommon = (function(){
	
	var vreportPath = "/seeyon/m3/apps/v5/vreport";
	var commonPath = "/seeyon/m3/apps/v5/commons";
	var jssdk = "/seeyon/m3/apps/v5/commons/wechat-jssdk.js";
	
	var App = {};	
	/**
	 * 标记为已读
	 * @param
	 * opt {
	 * 	 id : 报表中心id,
	 *   callback : 回调
	 * }
	 */
	App.read = function(opt){
		if($s && $s.Vreport){
			$s.Vreport.saveReportRecordRead(opt.id,{},{
				success : function(result){
					if(typeof opt.callback === 'function')
						opt.callback.apply(this,[result]);
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
		}else{
			cmp.asyncLoad.js([vreportPath + "/js/vreport-jssdk",jssdk],function(){
				$s.Vreport.saveReportRecordRead(opt.id,{},{
					success : function(result){
						if(typeof opt.callback === 'function')
							opt.callback.apply(this,[result]);
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
			});
		}
	}
	return App;
})()
