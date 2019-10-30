function rptReply(options){
	var schlogId = cmp.href.getParam().schlogId;
	if(typeof schlogId == "undefined" ){
		schlogId = "0";
	}
	this.op = cmp.extend({
		"id":"report_reply",
		"referenceId":cmp.href.getParam().appId,
		"subReferenceId":schlogId,
		"referenceType":"reportEngine"
	},options);
	cmp.append(document.body,rptReply.tpl(this.op.id));
	
	this._init();
}
(function($){
	/**
	 * 初始化
	 */
	rptReply.prototype._init = function(){
		this._initData();
		this._initEvent();
	}
	/**
	 * 初始化数据
	 */
	rptReply.prototype._initData = function(){
		var t = this,$this = $("#rpt_rpely_" + this.op.id);
		//获取评论列表
		rptReply.replyAjax = SeeyonApi.Reportreply;
		rptReply.replyAjax.getReplyCount({},{
			"referenceId":t.op.referenceId,
			"subReferenceId":t.op.subReferenceId,
			"referenceType":t.op.referenceType
		},{
			success:function(rs){
				if(!rs.success){
					$.error(rs.msg);
				}else{
					t.cache = rs.data;
					
					var $replys = $(".replys",false,$this);
					$replys.innerText = t.cache.replyCount;
					$replys.setAttribute("title",t.cache.replyCount);
					
					var $likes = $(".likes",false,$this);
					$likes.innerText = t.cache.praiseCount;
					$likes.setAttribute("title",t.cache.praiseCount);
					var $memNames = $(".likes-wrapper .mem-names",false,$this);
					$memNames.innerText = t.cache.praiseUserNames;
					var $icoPraise = $(".likes-wrapper .ico_praise",false,$this);
					if(t.cache.isPraiseThis){
						$icoPraise.style.color = "#3aadfb";
					}else{
						$icoPraise.style.color = "#979797";
					}
					$this.style.display = "block";
				}
			},
			error:function(rs){
				$.error("网络错误！");
			}
		});
	}
	
	rptReply.prototype._initEvent = function(){
		
		rptReply.replyAjax = SeeyonApi.Reportreply;
		var t = this,$this = $("#rpt_rpely_" + this.op.id);
		var likeIng = false;
		cmp("#rpt_rpely_" + this.op.id).on("tap",".doLike",function(){
			if(likeIng){
				return;
			}
			likeIng = true;
			rptReply.replyAjax[t.cache.isPraiseThis ? "cancelPraise" : "praise" ]({},t.op,{
				success:function(rs){
					if(!rs.success){
						$.error(rs.msg);
					}else{
						t.cache.isPraiseThis = !t.cache.isPraiseThis;
						t.cache.praiseCount = rs.data.praiseCount;
						t.cache.praiseUserNames = rs.data.praiseUserNames;
						
						var $likes = $(".likes",false,$this);
						$likes.innerText = t.cache.praiseCount;
						$likes.setAttribute("title",t.cache.praiseCount);
						var $memNames = $(".likes-wrapper .mem-names",false,$this);
						$memNames.innerText = t.cache.praiseUserNames;
						var $icoPraise = $(".likes-wrapper .ico_praise",false,$this);
						if(t.cache.isPraiseThis){
							$icoPraise.style.color = "#3aadfb";
						}else{
							$icoPraise.style.color = "#979797";
						}
					}
					likeIng = false;
				},
				error:function(rs){
					likeIng = false;
					$.error("网络错误！");
				}
			});
		}).on("tap",".replys-wrapper",function(){
			rptReply.replyAjax.findReply({},t.op,{
				success:function(rs){
					if(!rs.success){
						$.error(rs.msg);
					}else{
						
/* <div class="reply-list">
    <div class="statu-bar">
        共有45条评论
        <span class="close-botn m3-icon-close "></span>
    </div>

    <div class="comment-list">
        <div class="comment-item" replyid="-1090768582979467807" commentid="-5962834599460123621" rootid="-2563417510520729644"
            deleauth="true" showpostid="-1718916352339653261"> 
            <span class="username">shuqi</span> 
            <span class="replyContent">:3</span> 
        </div>
        <div class="comment-item" replyid="-1090768582979467807" commentid="-5962834599460123621" rootid="-2563417510520729644"
            deleauth="true" showpostid="-1718916352339653261"> 
            <span class="username">shuqi</span> 
            <span class="replyTo">回复</span> 
            <span class="username">shuqi</span> 
            <span class="replyContent">:3</span> 
        </div>
        <div class="comment-item" replyid="-1090768582979467807" commentid="-5962834599460123621" rootid="-2563417510520729644"
            deleauth="true" showpostid="-1718916352339653261"> 
            <span class="username">shuqi</span> 
            <span class="replyTo">回复</span> 
            <span class="username">shuqi</span> 
            <span class="replyContent">:3</span> 
        </div>
    </div>
    <div>
    </div>
</div> */
						
					}
				},
				error:function(rs){
					$.error("网络错误！");
				}
			});
		});
		
	}
	
	/**
	 * 生成模版
	 */
	rptReply.tpl = function(id){
		var tpl = "";
		tpl +='<div class="reply-area" id="rpt_rpely_' + id + '">';
		tpl +='<div class="likes-wrapper">';
		tpl +='	<div class="like-members">';
		tpl +='		<span class="mem-names">张三、李四、王五、赵六、李四、王五、赵六、李四;、王五、赵六</span>';
		tpl +='		<span class="b1 box rotate45"></span>';
		tpl +='		<span class="b2 box rotate45"></span>';
		tpl +='	</div>';
		tpl +='	<span class="doLike ico_praise see-icon-v5-common-praise-fill"></span><br/>';
		tpl +='	<span class="doLike likes" title=""></span><br/>';
		tpl +='</div>';
		tpl +='<div class="replys-wrapper">';
		tpl +='	<span class="see-icon-v5-common-comment-fill"></span><br/>';
		tpl +='	<span class="replys" title=""></span>';
		tpl +='</div>';
		tpl +='</div>';
		return tpl;
	}
})(myQuery);

function myQuery(selector, queryAll , target ) {
	var t = target ? target : document ;
	var tt = null;
	if (queryAll) {
		tt = t.querySelectorAll(selector);
	} else {
		tt =  t.querySelector(selector);
	}
	return tt;
}
myQuery.error = function(msg){
	cmp.notification.toast(msg, "center", 1000);
}

var rptReplyCom;
cmp.ready(function(){
    var oCss = document.createElement("link");
    oCss.rel = "stylesheet";
    oCss.type = "text/css";
    oCss.href = "/seeyon/m3/apps/v5/vreport/css/RptReply.css?buildversion=1534753369467"
    
    var scriptEle = document.createElement("script");
    scriptEle.type = "text/javascript";
    scriptEle.src = "/seeyon/m3/apps/v5/vreport/js/RptReply-jssdk.js?buildversion=1534753369467"
	scriptEle.onload = function(){
    	rptReplyCom = new rptReply({});
    }
    
    document.body.appendChild(oCss);
	document.body.appendChild(scriptEle);
});