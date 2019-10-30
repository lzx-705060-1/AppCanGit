/*!
 * 标题: 任务进展列表
 * 描述：  项目任务人员页签内容渲染出来，并将事件绑定上
 * 
 * since: v6.1
 * author: ouyp
 */
cmp.ready(function(){
	var params = cmp.href.getParam();
	var taskId = params.taskId; 
	var backFUnction = cmp.href.back;
	if(params.openType == "message"){
		backFUnction = cmp.href.closePage;
	}
	//绑定返回按钮事件
	/*cmp("body").on("tap","#page_header",function(){
		backFUnction();
	});*/
	cmp.backbutton();
	cmp.backbutton.push(backFUnction);
    
    //listview容器高度
    var cmpContent = document.querySelector('.cmp-control-content'),
    	header = document.querySelector('header'),
    	headerH = !header ? 0 : header.offsetHeight;
    cmpContent && (cmpContent.style.height = window.innerHeight - headerH + "px");
	//初始化listview
	cmp.listView("#task_feedback_list",{
		config: {
			pageSize: 10,
			params: {},
			dataFunc: function(params, options){
				$s.Tasks.taskFeedbacks(taskId, params, {
					success: function(result) {
						options.success(result);
					},
					error: function(error){
						var cmpHandled = cmp.errorHandler(error);
						if(!cmpHandled){
							cmp.notification.alert(cmp.i18n("Taskmanage.message.taskNotExist"),function(){
								backFUnction();
							},cmp.i18n("Taskmanage.label.tips"),cmp.i18n("Taskmanage.label.backtohome"));							
						}
					}
				});
			},
			renderFunc: function(result, isRefresh){
				var tpl = document.querySelector("#task_feedback_tpl").innerHTML,
					container = document.querySelector("#task_feedback_list .cmp-table-view"),
					html = cmp.tpl(tpl, result);
				//渲染HTML
				isRefresh ? (container.innerHTML = html) : (container.innerHTML = container.innerHTML + html);
				cmp.i18n.detect();
				//加載附件
				if (!result || result.length == 0){ return;}
				result.forEach(function(e, i){
					if (e.attachments) {
						new SeeyonAttachment({loadParam : {
							selector: document.querySelector("#attachment_" + e.id),
							atts : e.attachments
						}});
					}
				});
			}
		},
		down: {
			contentdown: cmp.i18n("Taskmanage.label.pulltorefresh"),
            contentover: cmp.i18n("Taskmanage.label.loosentorefresh"),
            contentrefresh: cmp.i18n("Taskmanage.label.refreshing")
		},
		up: {
            contentdown: cmp.i18n("Taskmanage.label.uptomore"),
            contentrefresh: cmp.i18n("Taskmanage.label.refreshing"),
            contentnomore: ''
        }
	});
});
