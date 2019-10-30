$(document).ready(function() {
	if (pageX.winParams.templateId == 5685646216400029631) {
			init_kaoqin='init_0400';
		}
	$("#contentDiv .sui-form-wrapper").load(function() {
		if (pageX.winParams.templateId == 5685646216400029631) {
			init_0400(templateId);
		}
	});
});
//环保集团请假单-------------------------

function init_0400(templateId) {	
	//表字段
	var formmain_id = "#formmain_0400";
	var bill_code = "#field0001";//单号
	var unit_name = "#field0002"//单位
	var unit_code = "#field0003";//单位编码
	var dept_name = "#field0004";//部门
	var dept_code = "#field0005";//部门编码
	var qjr_code = "#field0006";//请假人工号
	var qjr_name = "#field0007";//请假人姓名
	var tbr_name ="#field0008";//填表人
	var apply_date = "#field0009";//申请日期
	var post_level = "#field0010";//职层
	var is_dept_boss = "#field0011";//是否部门负责人
	var is_center_boss = "#field0012";//是否中心负责人	
	var qjr_unit = "#field0013";//请假人所属的oa的单位
	var person_code = "#field0014";//人员编码
	var hr_person = "#field0015";//HR复核人员
	var bus_dept = "#field0016";//事业部
	var cy_plate = "#field0017";//产业板块
	var is_check = "#field0018";//是否需要核对
	var process_type = "#field0019";//流程类别
	var isJtbb = "#field0020";//是否集团本部
	var direct_boss = "#field0021";//直接上司
	var is_first_dept = "#field0022";//是否一级部门
	var center_person = "#field0023";//中心负责人
	var oa_dept = "#field0024";//OA部门
	var vice_president = "#field0025";//业务分管副总裁	
	var is_sales_leave = "#field0026";//是否已销假
	var formson_id = "#formson_0401";
	var leave_types = "#field0039";//假类
	var no_leave_hour = "#field0040";//未休假时
	var approval_leave_hour = "#field0041";//审批中假时
	var apply_leave_hour = "#field0042";//可申请假时
	var leave_starttime = "#field0043";//请假开始时间	
	var leave_endtime = "#field0044";//请假结束时间	
	var leave_hour = "#field0045";//请假小时
	var detail_reason = "#field0046";//详细原因
	var is_overtime = "#field0047";//是否超时发起	 
	
	var is_terminate_leave = "#field0049";//是否是否销假	 
	var detail_number = "#field0048";//序号	 
	var detail_number_str = "#field0050";//序号文本 
	
	

	
//	$("#contentDiv").contents().find("#field0050_span").parent().show();


	
	//隐藏最下面的表格
	$("#contentDiv").contents().find("#field0005").parent().parent().parent().parent().parent().parent().hide();
	
	//$("#contentDiv").contents().find("#field0050").parent().parent().hide();
	
	//newdate();//初始化开始结束时间
	field0006Change();
	//隐藏是否部门负责人，隐藏是否中心负责人
	field0011change();
	//填写请假人工号，查询人员信息
	$("#contentDiv").contents().find(qjr_code).blur(function(){
	    field0006Change();
	});	
	
		//是否中心负责人	
	$("#contentDiv").contents().find("#field0012_txt").blur(function(){
	   field0011change();
	});		
	//是否部门负责人
	$("#contentDiv").contents().find("#field0011_txt").blur(function(){
	  field0011change();
	});		
	
	//设置只读
	$("#contentDiv").contents().find(no_leave_hour).attr("readonly","readonly");//未休假时
	$("#contentDiv").contents().find(approval_leave_hour).attr("readonly","readonly");//审批中假时
	$("#contentDiv").contents().find(apply_leave_hour).attr("readonly","readonly");//可申请假时
	$("#contentDiv").contents().find(unit_name).attr("readonly","readonly");//单位
	$("#contentDiv").contents().find(dept_name).attr("readonly","readonly");//部门
	$("#contentDiv").contents().find(qjr_name).attr("readonly","readonly");//请假人姓名
	$("#contentDiv").contents().find(tbr_name).attr("readonly","readonly");//填表人
	$("#contentDiv").contents().find(apply_date).attr("readonly","readonly");//申请日期
	$("#contentDiv").contents().find(post_level).next().attr("disabled","disabled");//职层不可选
	$("#contentDiv").contents().find(post_level).next().next().css("display","none");	
	$("#contentDiv").contents().find(post_level).next().next().removeAttr("onclick");
	
	
	$("#contentDiv").contents().find("#field0049_span").hide();
	$("#contentDiv").contents().find("#field0050_span").parent().show();
	//$("#contentDiv").contents().find(detail_number_str+"_span").parent().children("div").get(0).hide();
	$("#contentDiv").contents().find("#field0050_span").hide();
	$("#contentDiv").contents().find("#field0050").hide()
	
	
	var field0031list = $("#contentDiv").contents().find("input[name='field0043']");//开始时间
	for (var i = 0; i < field0031list.length; i++) {
		    var parent = $(field0031list[i]).parent().parent().parent().parent();
			parent.find(no_leave_hour).attr("readonly","readonly");	
			parent.find(approval_leave_hour).attr("readonly","readonly");
			parent.find(apply_leave_hour).attr("readonly","readonly");		
			parent.find(leave_starttime).attr("readonly","readonly");
			parent.find(leave_endtime).attr("readonly","readonly");		
			parent.find("#field0047_txt").attr("readonly","readonly");
			parent.find("#field0047_txt").attr("disabled","disabled");
			parent.find("#field0047_txt").next().css("display","none");	
			parent.find(is_overtime).next().next().removeAttr("onclick");	
			
	}

	//需要发送请求，查询枚举，给中心负责人下拉框赋值 。控股直接隐藏不需要的枚举即可。其他集团需要特殊处理,	
	//枚举显示还有问题，需要调整	
    $("#contentDiv").contents().find(is_center_boss).children("option").each(function(){
		 var id = $(this).val();
		 if(id !='868013550560428962' && id !="-240875727158359311" && id !="-2151857467345844625"){
			 $(this).remove();
		 }
	});
	
		

	
	//请假人所在单位     当工号更改时
/**	 $("#contentDiv").contents().find(qjr_code).on("change",function(){
		 $("#contentDiv").contents().find(qjr_unit+"_txt")
			.attr("comp",'type:"selectPeople",valueChange:orgFieldOnChange,showBtn:true,extendWidth:true,mode:"open",panels:"Account",selectType:"Account",maxSize:1,minSize:0,value:"Account|'+message.accountId+'",text:"'+message.unitname+'"');
		 initHr();//加载事业部 hr复核人员
	 });*/

	//假类事件
	$("#contentDiv").contents().find(formson_id).on("click","#field0039_txt",function(obj){
	   // console.log($(this).val());
		//field0027Change($("#contentDiv").contents().find(formson_id).find(obj).parent().parent().parent().parent());
		$(obj.currentTarget).blur(function(){
			$(obj.currentTarget).off("blur");
			field0027Change($(obj.currentTarget).parent().parent().parent().parent());
		});
	});			
	
	//开始时间改变事件
/**	$("#contentDiv").contents().find(formson_id).find(leave_starttime).on('onpropertychange',function(){
		var parent = $("#contentDiv").contents().find(formson_id).find(this).parent().parent().parent().parent();
			parent.find(leave_endtime).val("");
			parent.find(leave_hour).val("");
	});	*/
	
	$("#contentDiv").contents().on("click","#addImg",function(obj) {
			
			var field0031list = $("#contentDiv").contents().find("input[name='field0043']");//开始时间
			for (var i = 0; i < field0031list.length; i++) {
					var parent = $(field0031list[i]).parent().parent().parent().parent();
					parent.find(no_leave_hour).attr("readonly","readonly");	
					parent.find(approval_leave_hour).attr("readonly","readonly");
					parent.find(apply_leave_hour).attr("readonly","readonly");		
					parent.find(leave_starttime).attr("readonly","readonly");
					parent.find(leave_endtime).attr("readonly","readonly");		
					parent.find("#field0047_txt").attr("readonly","readonly");
					parent.find("#field0047_txt").attr("disabled","disabled");
					parent.find("#field0047_txt").next().css("display","none");	
					parent.find(is_overtime).next().next().removeAttr("onclick");	
					parent.find(is_terminate_leave+"_span").hide();
					parent.find(detail_number_str+"_span").parent().show();
					//$("#contentDiv").contents().find(detail_number_str+"_span").parent().children("div").get(0).hide();
					parent.find(detail_number_str+"_span").hide();
			}	
		
	});
	
	$("#sendId").removeAttr("onclick");
    $("#sendId").attr("onclick","sendbefore_0400();");

/**
 * 发起时验证同张单是否时间冲突
 * @param startTime
 * @param endTime
 * @param startTimes
 * @param endTimes
 * @param num
 */
function js_leave_CheckConflict(startTime,endTime,startTimes,endTimes,num){
	var str = "";
	for(var i=0; i <startTimes.length;i++){
		if(i == num) continue;//如果同一行则无需验证
		var st1 = new Date(startTimes[i].value.replace(/\-/g, "\/"));
		var et1 = new Date(endTimes[i].value.replace(/\-/g, "\/"));;
		var st = new Date(startTime.replace(/\-/g, "\/")); 
		var et = new Date(endTime.replace(/\-/g, "\/")); 
		
		if(st >= st1 && st < et1){//开始时间在另外一行的时间中间
			str = "第"+(num+1)+"行时间与"+(i+1)+"行数据冲突";
			break;
		}
		if(et < st1 && et >= et1){//开始时间在另外一行的时间中间
			str = "第"+(num+1)+"行时间与"+(i+1)+"行数据冲突";
			break;
		}
		if(st1 >= st && st1 < et){
			str = "第"+(num+1)+"行时间与"+(i+1)+"行数据冲突";
			break;
		}
		if(et1 < st && et1 >= et){
			str = "第"+(num+1)+"行时间与"+(i+1)+"行数据冲突";
			break;
		}
	}
	
	return str;
}

//初始化时间，设置默认日期
function newdate(){

	 var d=new Date();
	  var year=d.getFullYear();
	  var month=change(d.getMonth()+1);
	  var day=change(d.getDate());
	  var starthour=" 08:30";
	  var endhour=" 17:30";
	  function change(t){
		    if(t<10){
		     return "0"+t;
		    }else{
		     return t;
		    }
		  }
	
	  var starttime=year+'-'+month+'-'+day+starthour;
	  var endtime=year+'-'+month+'-'+day+endhour;
	  return endtime;

}
//计算小时
function js_leave_checktime(starttime,endtime,field0036val,num){
    
    var str="";
	 starttime=starttime.replace(new RegExp(/-/gm) ,"/");
	 endtime=endtime.replace(new RegExp(/-/gm) ,"/");
	 var date1=new Date(starttime);  //开始时间
    var date2=new Date(endtime);    //结束时间   
  
    var oHour = Number(date1.getHours());
    var oMin = Number(date1.getMinutes()); 	      
    var oHour2 = Number(date2.getHours());
    var oMin2 = Number(date2.getMinutes()); 
    var date3=date2.getTime()-date1.getTime();  //时间差的毫秒数
    //计算出相差天数
    var days=Math.floor(date3/(24*3600*1000));
	 var minutes = 0;
	 var hours = 0;
    if(oHour < 8 ||( oHour==8 && oMin <30)){ //开始时间在八点半之前
		 if(((oHour2 ==12 && oMin2 >=30) || oHour2>12 ) && (oHour2 <13 || (oHour2 == 13 && oMin2 <= 30))){//结束时间在十二点半以上到下午一点半之前
			hours = 4;
		 }else if(oHour2 <=12 ){ //结束时间在十二点半或者十二点半之前
			 if(  oMin2 < 30){
				minutes += oMin2 + 30;
				hours += oHour2 - 1 -8;
			}else{			
				minutes += oMin2 - 30;
				hours += oHour2 - 8;
			}
		 }else if( (oHour2 >13 ||(oHour2 == 13 && oMin2 >= 30)) &&( oHour2 <17 || (oHour2 ==17 && oMin2 <=30))){// 结束时间在 下午一点半到5点半之前
			 //if(  oMin2 <= 30){
				minutes +=  oMin2 + 60 - 30   ;
				hours += oHour2 - 1 -8 -1;
			
		 }else{//结束时间在下午5点或5点半以后
					
				minutes += 30 -30;
				hours += 17 - 1- 8;
			
		 }
	 
	 }else if( ((oHour ==8 && oMin >=30) || oHour >8) && (oHour <12 || (oHour == 12 && oMin <=30))){//开始时间在八点半到十二点半
		   if(((oHour2 >=12 && oMin2 >30)|| oHour2 >12 )&& (oHour2 <13 || (oHour2 == 13 && oMin2 <= 30))){//结束时间在十二点半以上到下午一点半之前
				if(  oMin <= 30){
				minutes += 30 - oMin ;
				hours += 12 - oHour;
				}else{			
					minutes += 90 - oMin;
					hours += 12 - 1-oHour;
				}
		   }else if(oHour2 <12 || (oHour2 == 12 && oMin2 <=30)){ //结束时间在十二点半或者十二点半之前
			 if(  oMin2 >= oMin){
				minutes += oMin2 -oMin;
				hours += oHour2 - oHour;
			}else{			
				minutes += oMin2+60 -oMin;
				hours += oHour2 -1- oHour;
			}
		  }else if( (oHour2 >13 ||(oHour2 == 13 && oMin2 >= 30) )&&(oHour2 <17 || (oHour2 ==17 && oMin2 <=30))){// 结束时间在 下午一点半到五点半
			   
				   minutes += oMin2 -oMin +60 ;
				   hours += oHour2 - 2 -oHour;
				
				
			
		 }else{//结束时间在下午5点或5点以后
				minutes +=  60 + 30-oMin;
				hours += 17 -2 - oHour;
		 }
	 
	 }
	 
	 else if( ((oHour ==12 && oMin >= 30) || oHour >12 ) && (oHour <13 || (oHour == 13 && oMin <= 30))){ //开始时间在十二点半以后到下午1点半
			if( (oHour2 >13 ||(oHour2 == 13 && oMin2 >= 30)) && (oHour2 < 17 || (oHour2 ==17 && oMin2 <=30))){// 结束时间在 下午一点半到5点半之前到六点之前
			 
				minutes += oMin2 +60 - 30;
				hours += oHour2 -1 - 13;
			
			 }else{			//结束时间在下午5点或5点以后
					minutes += 0;
					hours += 17 -13;
			 }
		
	 } else if( ((oHour ==13 && oMin >= 30) || oHour >13 ) && (oHour <17 || (oHour == 17 && oMin <= 30))){ //开始时间在下午一点或一点半以后,五点半之前
		if(  oHour2 >17 || (oHour2 ==17 && oMin2 >=30) ){ //结束时间在下午5点或5点以后
			
				minutes += 60 + 30 - oMin;
				hours += 17 - 1 -oHour;
			
		}else{  //结束时间在5点以前
			if( oMin > oMin2){
				minutes += oMin2 +60 - oMin;
				hours += oHour2 -1 -oHour;
			}else{
				minutes += oMin2 - oMin;
				hours += oHour2 - oHour;
			}
		}
	 }else{
		 alert("请重新选择开始时间");
		 return false;
	 }
	 var s = minutes/60;
	 s=  s.toFixed(1);
	 if(Number(days) >=0 ){
		  hours =Number(days)* 8 + Number(hours) + Number(s);
	 }else{
	  hours ="";
	 }
	 
	 if(num != null){
		  //hours  请假时长   ， Number(field0017val)  请假小时
		  if(hours > Number(field0036val) ){
			/*  && num == 0){		  
			 str = "请假时长与请假小时不一致,是否确认发起";			  
		  }else if(hours > Number(field0017val) && num != 0){*/
			  
			  str = "第"+Number(num+1)+"行请假时长与请假小时不一致，是否确认发起";
		  }else{
			  str ="";
		  }
	 }else{
		  str = hours;
	 }

	 return str;	 	
}

//工号改变事件
function field0006Change(){
	 var code = $("#contentDiv").contents().find(qjr_code).val();
		if (code.length != 7|| (code.substring(0, 1) != "a" && code.substring(0, 1) != "A")) {
			alert("请输入正确工号");
			$("#contentDiv").contents().find(qjr_code).val("");	
			return;
		}else{			
			var urlstr = "../formBase/formBase.do?method=getuserbycode";
			$.ajax({
				url : urlstr,
				data:{"code":code},
				async : false,
				success : function(data) {
					message = JSON.parse(data);
					if(message !=null){
						$("#contentDiv").contents().find(unit_name).val(message.unitname);// 单位名称
						$("#contentDiv").contents().find(unit_code).val(message.corp);// 单位编码
						$("#contentDiv").contents().find(dept_name).val(message.deptname);// 部门名称
						$("#contentDiv").contents().find(dept_code).val(message.pk_deptdoc);// 部门编码
						$("#contentDiv").contents().find(qjr_name).val(message.psnname);// 请假人姓名
						$("#contentDiv").contents().find(person_code).val(message.pk_psnbasdoc);//人员编码	
						$("#contentDiv").contents().find(post_level).find("option:contains('"+message.def9+"')").attr("selected",true);		
						$("#contentDiv").contents().find(post_level+"_txt").val(message.def9);// 职层													
						//如果职层为L2 选择是否中心公司负责人 非中心负责人 副总裁
						//层级为L3，怎需要选择是否部门负责人
						//层级为L4，则需要选择直接上司（可隐藏）
						if(message.def9 == 'L2'){
							$("#contentDiv").contents().find(is_center_boss+"_span").css("display","");
							$("#contentDiv").contents().find(is_dept_boss+"_span").css("display","none");
						}else if(message.def9 == 'L3'){
							$("#contentDiv").contents().find(is_dept_boss+"_span").css("display","");
							$("#contentDiv").contents().find(is_center_boss+"_span").css("display","none");
						}else{
							$("#contentDiv").contents().find(is_dept_boss+"_span").css("display","none");
							$("#contentDiv").contents().find(is_center_boss+"_span").css("display","none");
						}
						//根据工号查询OA单位和oa部门
						field0013Change(code);
					}
					
				}
			});
		}		
}
//是否部门负责人/中心负责人隐藏/显示
function field0011change(){		
	$("#contentDiv").contents().find(center_person).val("");//中心负责人
	$("#contentDiv").contents().find(vice_president).val("");//分管副总裁

	//是否部门负责人
	$("#contentDiv").contents().find("#field0011_span").css("display","none");
	//是否中心负责人	
	$("#contentDiv").contents().find("#field0012_span").css("display","none");
	//默认隐藏 部门负责人，直接上司、中心负责人
	//$("#contentDiv").contents().find(direct_boss).parent().parent().parent().parent().parent().parent().parent().parent().css("display","none");
	$("#contentDiv").contents().find(direct_boss).parent().parent().parent().parent().parent().css("display","none");
	//职层
	var field0010text = $("#contentDiv").contents().find("#field0010").find("option:selected").text();
	if(field0010text == "L2"){
		
		//$("#contentDiv").contents().find("#field0011_span").css("display","none");
		$("#contentDiv").contents().find("#field0012_span").css("display","");
		
	}else if (field0010text == "L3"){
		$("#contentDiv").contents().find("#field0012_txt").val("");
		$("#contentDiv").contents().find(is_center_boss).val("");//是否中心负责人
		
		$("#contentDiv").contents().find("#field0011_span").css("display","");
		//$("#contentDiv").contents().find("#field0012_span").css("display","none");
		
	}else if (field0010text == "L4" || field0010text == "L1"){
		$("#contentDiv").contents().find(is_center_boss).val("");//是否中心负责人
		$("#contentDiv").contents().find(center_person).val("");//中心负责人
		$("#contentDiv").contents().find(vice_president).val("");//分管副总裁
		//是否部门负责人
		$("#contentDiv").contents().find("#field0011_span").css("display","none");
		//是否中心负责人
		$("#contentDiv").contents().find("#field0012_span").css("display","none");
		
	}
	else{
		$("#contentDiv").contents().find(is_center_boss).val("");//是否中心负责人
		$("#contentDiv").contents().find(center_person).val("");//中心负责人
		$("#contentDiv").contents().find(vice_president).val("");//分管副总裁
		
		//是否部门负责人
		$("#contentDiv").contents().find("#field0011_span").css("display","none");
		//是否中心负责人
		$("#contentDiv").contents().find("#field0012_span").css("display","none");
	}
}

//转换OA单位事件 目前接口还不能使用
function field0013Change(code){
	if(code !=""){	
		$.ajax({
			url : "../formBase/formBase.do?method=getOAMessageById",
			async : false,
			data:{"code":code},
			dataType:"json",
			type : "GET",
			success : function(data) {
				//data = JSON.parse(data);
			
				$("#contentDiv").contents().find(qjr_unit).val(data.org_account_id);// 请假人所在单位
				$("#contentDiv").contents().find(oa_dept).val(data.org_department_id);// OA部门
				
			}
		});
	}
}

//假类改变事件
function field0027Change(parent){
	//var parent = $("#contentDiv").contents().find(formson_id).find(obj).parent().parent().parent().parent().parent();
	  var leavetype = parent.find(leave_types).find("option:selected").text();
	  // alert(leavetype);
		if(leavetype == "年假" || leavetype == "加班转调假"){
			var pkcorp = $("#contentDiv").contents().find(unit_code).val();
			var userCode = $("#contentDiv").contents().find(qjr_code).val();
			if(userCode == ""){
				alert("请先填写请假人工号");
				return ;
			}
			var endtime = $("#contentDiv").contents().find(leave_endtime).val();
			if(endtime == ""){
				endtime =newdate();
			}
			$.ajax({
				url : "../formBase/formBase.do?method=queryXjjy",
				async : false,
				data:{"pkcorp":pkcorp,"userCode":userCode,"leavetype":leavetype,"endtime":endtime},
				dataType:"json",
				type : "post",
				success : function(data) {
					if(data.sucess == "1"){
						parent.find(no_leave_hour).val(data.hour == undefined ? "0" : data.hour);							
						parent.find(approval_leave_hour).val(data.leavesumhour == undefined ? "0" : data.leavesumhour);				
						parent.find(apply_leave_hour).val(data.def == undefined ? "0" : data.def);												
					}else{
						alert(data.message);
						parent.find(no_leave_hour).val("");										
						parent.find(approval_leave_hour).val("");											
						parent.find(apply_leave_hour).val("");				
					}
				}
			});
		}else if(leavetype == "补钟"){	
			alert("地产集团没有补钟类型,请重新选择!");
			parent.find(leave_types).val("");
			parent.find(no_leave_hour).val("");										
			parent.find(approval_leave_hour).val("");											
			parent.find(apply_leave_hour).val("");	
		}else{
			parent.find(no_leave_hour).val("");										
			parent.find(approval_leave_hour).val("");											
			parent.find(apply_leave_hour).val("");	
		}
}
}
//发送前校验
function sendbefore_0400(){	
	var formson_id = "#formson_0401";
	var leave_types = "#field0039";//假类
	var no_leave_hour = "#field0040";//未休假时
	var unit_code = "#field0003";//单位编码
	var qjr_code = "#field0006";//请假人工号
	var person_code = "#field0014";//人员编码
	var is_check = "#field0018";//是否需要核对
	var approval_leave_hour = "#field0041";//审批中假时
	var apply_leave_hour = "#field0042";//可申请假时
	var leave_starttime = "#field0043";//请假开始时间	
	var leave_endtime = "#field0044";//请假结束时间	
	var leave_hour = "#field0045";//请假小时
	var is_overtime = "#field0047";//是否超时发起	 
	// 获取当前日期
	var newDate = new Date();
	
	var year=newDate.getFullYear();
	var month=newDate.getMonth()+1;
    var day=newDate.getDate();
	
	var usedYearLeave = 0;//本次休的年假数
	var usedJbtoTx = 0;//本次休的加班转调假
	var vacationLeave = 0;//制度假/补休假总时长
	var thingLeave = 0;//事假总时长
	var isCheck = false; //是否核对
	//统计年假 加班转调假  哺乳假
	
	var field0031list = $("#contentDiv").contents().find("select[name='field0039']");
	for (var i = 0; i < field0031list.length; i++) {
		var parent = $(field0031list[i]).parent().parent().parent().parent();
		var leavetype = parent.find(leave_types+"  option:selected").text();//请假类型
		var field0036val = parent.find(leave_hour).val();//请假小时
		if(leavetype == "年假"){
			if(field0036val != ""){
				field0036val = Number(field0036val);
			}else{
				field0036val;
			}	
			usedYearLeave = usedYearLeave + field0036val;
		}else if(leavetype == "加班转调假"){
			if(field0036val != ""){
				field0036val = Number(field0036val);
			}else{
				field0036val;
			}	
			usedJbtoTx = usedJbtoTx + field0036val;
		}
		var startTime =parent.find(leave_starttime).val();
		var ds = startTime.substring(11,16).split(":");
		if(ds[0] > 13 || (ds[0] == 13 && ds[1] > 30)){
			alert("下午的请假开始时间应从13:30开始，请重新选择");
			parent.find(leave_starttime).val("");
			return false;
		}
	}
	var field0031list = $("#contentDiv").contents().find("select[name='field0039']");
	for (var i = 0; i < field0031list.length; i++) {
		var parent = $(field0031list[i]).parent().parent().parent().parent();
		var leavetype = parent.find(leave_types+"  option:selected").text();// 请假类型
		var field0036val = parent.find(leave_hour).val();// 请假小时
		if (leavetype == "哺乳假") {
			if (field0036val == "") {
				alert("请输入请假小时数!");
				return false;
			} else if (field0036val == "0") {
				alert("请假小时数只能为1的倍数");
				return false;
			} else {
				if (Number(field0036val) % 1 != 0) {
					alert("请假小时数只能为1的倍数");
					return false;
				}
			}
		}else{
  			if(field0036val == ""){
  				alert("请输入请假小时数!");
  				return false;
  			}else if(field0036val == "0"){
  				alert("请假小时数只能为4的倍数");
  				return false;
  			}else{
  				if(Number(field0036val) % 4 !=0){
  					alert("请假小时数只能为4的倍数");
  					return false;
  				}
  			}
  		}
		//是否需核对判断
    	if(leavetype == "婚假" || leavetype == "恩恤假" || leavetype == "工伤假" || leavetype == "流产假" || leavetype == "产检假" || leavetype == "产假" || leavetype == "看护假" || leavetype == "哺乳假" || leavetype == "病假"){
    		isCheck = true;
    	}
    	//长短流程判断开始
    	if(leavetype == "事假"){
    		thingLeave = thingLeave + Number(parent.find(leave_hour).val());
    	}
    	if(leavetype != "事假"){
    		vacationLeave = vacationLeave + Number(parent.find(leave_hour).val());
    	}
    	//长短流程判断结束
    	//Modify By Vincent 2017-10-26 10:12 马来西亚的不要调用接口检验  Start 查询休假结余
    	//单位编码=00016A10000000001HPQ 
    	if($("#contentDiv").contents().find(unit_code).val() != "00016A10000000001HPQ"){
    		var pkcorp = $("#contentDiv").contents().find(unit_code).val();
    		var userCode = $("#contentDiv").contents().find(qjr_code).val();
    		var leavetype = parent.find(leave_types+"  option:selected").text();// 请假类型
    		if(leavetype == "年假" || leavetype == "加班转调假"){
    			var endtime="";
    			
    			$.ajax({
    				url : "../formBase/formBase.do?method=queryXjjy",
    				async : false,
    				data:{"pkcorp":pkcorp,"userCode":userCode,"leavetype":leavetype,"endtime":endtime},
    				dataType:"json",
    				type : "post",
    				success : function(data) {
    					if(data.sucess == "1"){
    						//未休假时
    						parent.find(no_leave_hour).val(data.hour);
    						parent.find(no_leave_hour).css("backgroundColor","#ffffff");
    						//审批中假时
    						parent.find(approval_leave_hour).val(data.leavesumhour);
    						parent.find(approval_leave_hour).css("backgroundColor","#ffffff");
    						//可申请假时
    						parent.find(apply_leave_hour).val(data.def);
    						parent.find(apply_leave_hour).css("backgroundColor","#ffffff");
    						if(leavetype == "年假"){
    							if(data.def < usedYearLeave){
        							alert("可用年假假时只有"+data.def+"，假类“年假”的请假小时合计已超"+(usedYearLeave - data.def)+"小时，超出部分请使用其他假类");
        							return false;
        						}
    						}
    						if(leavetype == "加班转调假"){
    							if(data.def < usedJbtoTx){
    								alert("可用加班转调假假时只有"+data.def+"，假类“加班转调假”的请假小时合计已超"+(usedJbtoTx - data.def)+"小时，超出部分请使用其他假类");
        							return false;
        						}
    						}  						
    					}else{
    						alert(data.message);
    						
    						parent.find(no_leave_hour).val("");
    						parent.find(approval_leave_hour).val("");   							
    						parent.find(apply_leave_hour).val("");

							return false;
    					}
    				}
    			});
    		}else{
    			parent.find(no_leave_hour).val("");
    			parent.find(approval_leave_hour).val("");
    			parent.find(apply_leave_hour).val("");    	
    		}
    	}
		
		
		
	}	
    	var field0031list = $("#contentDiv").contents().find("select[name='field0039']");
    	for (var i = 0; i < field0031list.length; i++) {
    		var parent = $(field0031list[i]).parent().parent().parent().parent();
    		var startTime = parent.find(leave_starttime).val();//请假开始时间
    		var endTime = parent.find(leave_endtime).val();//请假结算时间
    		var leavetype = parent.find(leave_types+"  option:selected").text();// 请假类型
    		var userPk = $("#contentDiv").contents().find(person_code).val();//人员编码
    
    		if(userPk == ""){
    			alert("请假人不能为空!");
    			return false;
    		}else{
    			if(startTime == ""){
    				alert("请假开始时间不能为空!");
    				return false;
    			}
    			if(endTime == ""){
    				alert("请假结束时间不能为空!");
    				return false;
    			}
    			if(new Date(startTime.replace(/\-/g, "\/")) >= new Date(endTime.replace(/\-/g, "\/"))){
    				alert("第"+(i+1)+"行开始时间大于或等于结束时间");
    				return false;
    			}
    			var fixation_date = new Date("2018/01/31 23:59:59");
    			var startTime_s = new Date(startTime.replace("-", "/"));
    			var endTime_s = new Date(endTime.replace("-", "/"));
    			if( startTime_s <= fixation_date || endTime_s <= fixation_date){
    				alert("第"+(i+1)+"行，禁止发起2018年2月1日前的请假单。");
    				return false;
    			}
    		}
    		
    		if(leavetype != "哺乳假"){
    			//计算当天的加班时间
    			var caclHour = (new Date(endTime.replace(/\-/g, "\/")).getTime() - new Date(startTime.replace(/\-/g, "\/")).getTime())/(60*60*1000);
    			var field0036 = Number(parent.find(leave_hour).val());
    			if(caclHour < field0036){
    				alert("请假小时不能大于请假时长（请假时长=请假结束时间-请假开始时间）");
    				return false;
    			}
    		}
    		var templateCode = getFormTemplateCode(templateId);
    		$.ajax({
    			url : "/formBase/formBase.do?method=repeatCheck",
    			async : false,
    			data:{"type":"0","userPk":userPk,"startTime":startTime,"endTime":endTime,"summaryId":summaryId,"templateId":templateId},
    			//dataType:"json",
    			type : "post",
    			success : function(data) {
    				if(data != ""){
    					alert("第【"+(i+1)+"】行请假时间与已发起流程【"+data+"】有冲突!");
						return false;
    				}
    			}
			}); 
				//是否超时
			if(startTime!=""){
				var jbDay = startTime.substring(0,10);
				if(year == jbDay.substring(0,4)){//同年的
					if(jbDay.substring(5,7) - month >= 1){
						canSendFlag = false;
					}
					if(month - jbDay.substring(5,7) >= 1){//如果只超过一个月，且本月大于4号
						if(day > 3 || (month - jbDay.substring(5,7) > 1)){
							parent.find(is_overtime).find("option:contains('是')").attr("selected",true);	
							parent.find("#field0047_txt").val("是");
						}else{
							parent.find(is_overtime).find("option:contains('否')").attr("selected",true);	
							parent.find("#field0047_txt").val("否");
						}
					}else{
						parent.find(is_overtime).find("option:contains('否')").attr("selected",true);			
						parent.find("#field0047_txt").val("否");
					}
				}else{
					if(((year - jbDay.substring(0,4))*12 + month) - jbDay.substring(5,7) >= 1){
						if(day > 3){
							parent.find(is_overtime).find("option:contains('是')").attr("selected",true);	
							parent.find("#field0047_txt").val("是");
						}else{
							parent.find(is_overtime).find("option:contains('否')").attr("selected",true);	
							parent.find("#field0047_txt").val("否");
						}
					}else{
						parent.find(is_overtime).find("option:contains('否')").attr("selected",true);		
						parent.find("#field0047_txt").val("否");
					}
				}
			}
			
	}
    	var strTip ="";
    	var field0034s = $("#contentDiv").contents().find("input[name='field0043']");//开始时间
    	var field0035s = $("#contentDiv").contents().find("input[name='field0044']");//结束时间
    	var field0036s = $("#contentDiv").contents().find("input[name='field0045']");//小时数
    	for(var i = 0;i<field0034s.length; i ++){
    		str = js_leave_CheckConflict(field0034s[i].value, field0035s[i].value, field0034s, field0035s, i);
    		if(str != ""){
    			alert(str);
    			return false;
    		}
    		var caclHour = (new Date(field0035s[i].value.replace(/\-/g, "\/")).getTime() - new Date(field0034s[i].value.replace(/\-/g, "\/")).getTime())/(60*60*1000);
    		var field0036 = Number(field0036s[i].value);
    		if(caclHour < field0036){
    			alert("请假小时不能大于请假时长（请假时长=请假结束时间-请假开始时间） ");
    			return false;
    		}
    		 
    		//验证请假小时与请假时间是否一致
    		strTip = js_leave_checktime(field0034s[i].value, field0035s[i].value,field0036s[i].value,i);
    		if(  strTip !=  ""){
    			alert(strTip);
    		}
    	}
    	//是否需要核对判断开始
    	if(isCheck){
    		$("#contentDiv").contents().find(is_check).find("option:contains('是')").attr("selected",true);
    	
    	}else{
    		$("#contentDiv").contents().find(is_check).find("option:contains('否')").attr("selected",true);
    		
    	}
    /**	$("#contentDiv").contents().find(process_type).find("option:contains('短流程')").attr("selected",true);		
    	$("#contentDiv").contents().find(process_type+"_txt").val("短流程");
    	if(thingLeave > 40){//事假大于5天为长流程
    		$("#contentDiv").contents().find(process_type).find("option:contains('短流程')").attr("selected",true);		
    		$("#contentDiv").contents().find(process_type+"_txt").val("短流程");
    	}
    	if(vacationLeave > 80){//非事假大于10天为长流程
    		$("#contentDiv").contents().find(process_type).find("option:contains('短流程')").attr("selected",true);		
    		$("#contentDiv").contents().find(process_type+"_txt").val("短流程");
    	}*/

  /**  	//请假总小时数
    	var acount = 0;
    	var field0036list = $("#contentDiv").contents().find(formson_id).find("input[name='"+leave_hour_name+"']");
    	for (var i = 0; i < field0036list.length; i++) {
    		acount = acount + Number(field0036list[i].value);
    	}
    	$("#contentDiv").contents().find(leave_allhour).val(acount);*/
	
		
		
    	//验证时间
    	if(strTip !=""){
    		if(confirm(strTip)){
    			send();
    		}else{
    			return false;
    		}
    	}else{
    		send();
    	}
	
}


