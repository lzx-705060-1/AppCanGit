$(document).ready(function() {
	if (pageX.winParams.templateId == -6296995549603476793) {
			init_kaoqin='init_0453';
		}
	
});
//地产集团请假单-------------------------

function init_0453(templateId){
	$("#contentDiv").contents().find("input#field0006").change(changeByCode);
	$("input#field0006").change()
	
	//$("#contentDiv").contents().find("[id^=formson_0454]").on("change","div#field0027",changeByLeaveType)
	var leaveType = $("#contentDiv").contents().find("[id^=formson_0454]").find("div#field0027").html();
	/*setInterval(function(){
	    var field0027DivHtml = $("#contentDiv").contents().find("[id^=formson_0454]").find("div#field0027").html()
	    if(field0027DivHtml!=leaveType){
	        changeByLeaveType(field0027DivHtml);
	    }
	},200)*/
	$("#contentDiv").contents().find("[id^=formson_0454]").find("div#field0027").bind('DOMNodeInserted', function(e){alert(111)})
	//$("#contentDiv").contents().find("[id^=formson_0454]").find("input#field0027").on('change', changeByLeaveType)
}
function changeByCode2(obj){
    $.ajax({
            url:"http://10.1.9.144/servlet/PublicServiceServlet?&message_id=nhoa_login&stype=getgroup",
            async:false,
            data:{"username":"liuquan"},
            //type:"post", 
            dataType:"json",
            success:function(data){
                $("#contentDiv").contents().find("#field0002").val("data.unitname");// 单位名称
                $("#contentDiv").contents().find("div#field0002").html("data.unitname")
                $("#contentDiv").contents().find("#field0003").val("data.corp");// 单位编码
                $("#contentDiv").contents().find("div#field0003").html("data.corp")
                $("#contentDiv").contents().find("#field0004").val("data.deptname");// 部门名称
                $("#contentDiv").contents().find("div#field0004").html("data.deptname");
                $("#contentDiv").contents().find("#field0005").val("data.pk_deptdoc");// 部门编码
                $("#contentDiv").contents().find("div#field0005").html("data.pk_deptdoc")
                $("#contentDiv").contents().find("#field0007").val("data.psnname");// 请假人姓名
                $("#contentDiv").contents().find("div#field0007").html("data.psnname")
                $("#contentDiv").contents().find("#field0014").val("data.pk_psnbasdoc");//人员编码    
                $("#contentDiv").contents().find("div#field0014").html("data.pk_psnbasdoc")
            },
            error:function(){
                cmp.notification.alert("查询数据异常",function(){
                    
                },"提示","确定","",false,false);
            }
    });
}
//根据工号查询e-HR系统的信息
function changeByCode(obj){
    /*var code =""
    if(!obj){
        code = $("#field0006").val()
    }els{
        code = $(obj.currentTarget).val();
    }*/
    var code = $(obj.currentTarget).val();
    
        $.ajax({
            url:cmp.seeyonbasepath +"/ext/hrssc.do?method=getEHRUserByCode",
            async:false,
            data:{"code":code},
            type:"post", 
            dataType:"json",
            success:function(data){
                //var data = JSON.parse(result);
                $("#contentDiv").contents().find("#field0002").val(data.unitname);// 单位名称
                $("#contentDiv").contents().find("div#field0002").html(data.unitname)
                $("#contentDiv").contents().find("#field0003").val(data.corp);// 单位编码
                $("#contentDiv").contents().find("div#field0003").html(data.corp)
                $("#contentDiv").contents().find("#field0004").val(data.deptname);// 部门名称
                $("#contentDiv").contents().find("div#field0004").html(data.deptname);
                $("#contentDiv").contents().find("#field0005").val(data.pk_deptdoc);// 部门编码
                $("#contentDiv").contents().find("div#field0005").html(data.pk_deptdoc)
                $("#contentDiv").contents().find("#field0007").val(data.psnname);// 请假人姓名
                $("#contentDiv").contents().find("div#field0007").html(data.psnname)
                $("#contentDiv").contents().find("#field0014").val(data.pk_psnbasdoc);//人员编码    
                $("#contentDiv").contents().find("div#field0014").html(data.pk_psnbasdoc)
                //$("#contentDiv").contents().find("#field0010").find("option:contains('"+data.def9+"')").attr("selected",true); 
                if(data.def9){
                    if(data.def9=="L1"){
                        $("#contentDiv").contents().find("#field0010").val("-251083455945094164");//职层       
                    }else if (data.def9=="L2"){
                        $("#contentDiv").contents().find("#field0010").val("-3978245093107480329");
                    }else if (data.def9=="L3"){
                        $("#contentDiv").contents().find("#field0010").val("5087061037885375573");
                    }else if (data.def9=="L4"){
                        $("#contentDiv").contents().find("#field0010").val("9101236093953200090");
                    }else if (data.def9=="L"){
                        $("#contentDiv").contents().find("#field0010").val("409597968118336359");
                    }
                }
                $("#contentDiv").contents().find("div#field0010").html(data.def9);//职层  
                
                //移动端验证参数，字段值需做相应修改
                window.s3scope.data.master["field0002"].value=data.unitname?data.unitname:""
                window.s3scope.data.master["field0003"].value=data.corp?data.corp:""
                window.s3scope.data.master["field0004"].value=data.deptname?data.deptname:""
                window.s3scope.data.master["field0005"].value=data.pk_deptdoc?data.pk_deptdoc:""
                window.s3scope.data.master["field0007"].value=data.psnname?data.psnname:""
                window.s3scope.data.master["field0014"].value=data.pk_psnbasdoc?data.pk_psnbasdoc:""
                window.s3scope.data.master["field0010"].value=data.def9?data.def9:""
                var extend16 = data.extend16;//是否部门负责人
                var field0011Name = "非部门负责人";
                if(extend16=="Y"){
                    $("#contentDiv").contents().find("#field0011").val("-8532601206756913170");
                    field0011Name = "部门负责人";
                    window.s3scope.data.master["field0011"].value="-8532601206756913170"
                }else{
                    $("#contentDiv").contents().find("#field0011").val("-5026295969559589602");
                    window.s3scope.data.master["field0011"].value="-5026295969559589602"
                }
                $("#contentDiv").contents().find("div#field0011").removeClass("sui-form-placeholder")//移除默认字体样式
                $("#contentDiv").contents().find("div#field0011").val(field0011Name);
            },
            error:function(data){
                cmp.notification.alert("查询数据异常"+data.message,function(){
                    
                },"提示","确定","",false,false);
            }
        });
    }
    
    //假类事件
    function changeByLeaveType2(obj){
        $(obj.currentTarget).blur(function(){
            //当前行
            var current_tr = $(this).parent().parent().parent().parent().parent();
            var leavetype = $(this).val();
            var endtime ="";
            //未休假时
            var field0028 = "";
            //审批中假时
            var field0029 = "";
            //可申请假时
            var field0030 = "";
            if(leavetype == "年假" || leavetype == "加班转调休"){
                if(leavetype == "加班转调休"){
                     endtime = current_tr.find("#field0032").val();//结束日期 
                }
                //单位PK
                var pkcorp = $("#contentDiv").contents().find("#field0003").val();
                //工号
                var userCode = $("#contentDiv").contents().find("#field0006").val();
                if(userCode == ""){
                    alert("请先填写请假人工号");
                    return false;
                }
                $.ajax({
                    url : cmp.seeyonbasepath+"/formBase/formBase.do?method=queryXjjy",
                    async : false,
                    data:{"pkcorp":pkcorp,"userCode":userCode,"leavetype":leavetype,"endtime":endtime},
                    dataType:"json",
                    type : "post",
                    success : function(data) {
                        if(data.sucess == "1"){
                            //未休假时
                            field0028 = data.hour == undefined ? "0" : data.hour;                           
                            //审批中假时
                            field0029 = data.leavesumhour == undefined ? "0" : data.leavesumhour;               
                            //可申请假时
                            field0030 = data.def == undefined ? "0" : data.def;                                             
                        }else{
                            alert(data.message);
                            cmp.notification.alert(data.message,function(){
                    
                            },"提示","确定","",false,false);
                        }
                    },
                    error:function(data){
                        cmp.notification.alert("查询数据异常"+data.message,function(){
                
                        },"提示","确定","",false,false);                        
                    }
                });
            }else if(leavetype == "补钟"){    
                alert("地产集团没有补钟类型,请重新选择!");
            }
            //未休假时
            current_tr.find("#field0028").val(field0028);     
            window.s3scope.data.master["field0028"].value=field0028                     
            //审批中假时
            current_tr.find("#field0029").val(field0029);   
            window.s3scope.data.master["field0029"].value=field0029            
            //可申请假时
            current_tr.find("#field0030").val(field0030);
            window.s3scope.data.master["field0030"].value=field0030
        });
            
    }; 
    
    //假类事件
    function changeByLeaveType(obj){
        
            //当前行
            var current_tr = $("input#field0027").parent().parent().parent().parent().parent();
            var leavetype = $(this).val();
            var endtime ="";
            //未休假时
            var field0028 = "";
            //审批中假时
            var field0029 = "";
            //可申请假时
            var field0030 = "";
            if(leavetype == "年假" || leavetype == "加班转调休"){
                if(leavetype == "加班转调休"){
                     endtime = current_tr.find("#field0032").val();//结束日期 
                }
                //单位PK
                var pkcorp = $("#contentDiv").contents().find("#field0003").val();
                //工号
                var userCode = $("#contentDiv").contents().find("#field0006").val();
                if(userCode == ""){
                    alert("请先填写请假人工号");
                    return false;
                }
                $.ajax({
                    url : cmp.seeyonbasepath+"/formBase/formBase.do?method=queryXjjy",
                    async : false,
                    data:{"pkcorp":pkcorp,"userCode":userCode,"leavetype":leavetype,"endtime":endtime},
                    dataType:"json",
                    type : "post",
                    success : function(data) {
                        if(data.sucess == "1"){
                            //未休假时
                            field0028 = data.hour == undefined ? "0" : data.hour;                           
                            //审批中假时
                            field0029 = data.leavesumhour == undefined ? "0" : data.leavesumhour;               
                            //可申请假时
                            field0030 = data.def == undefined ? "0" : data.def;                                             
                        }else{
                            alert(data.message);
                            cmp.notification.alert(data.message,function(){
                    
                            },"提示","确定","",false,false);
                        }
                    },
                    error:function(data){
                        cmp.notification.alert("查询数据异常"+data.message,function(){
                
                        },"提示","确定","",false,false);                        
                    }
                });
            }else if(leavetype == "补钟"){    
                alert("地产集团没有补钟类型,请重新选择!");
            }
            //未休假时
            current_tr.find("#field0028").val(field0028);     
            window.s3scope.data.master["field0028"].value=field0028                     
            //审批中假时
            current_tr.find("#field0029").val(field0029);   
            window.s3scope.data.master["field0029"].value=field0029            
            //可申请假时
            current_tr.find("#field0030").val(field0030);
            window.s3scope.data.master["field0030"].value=field0030
}            





