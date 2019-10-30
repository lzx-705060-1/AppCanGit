cmp.ready(function() {
    rengou();
});
function rengou() {

    var serviceUrl = cmp.storage.get('serviceUrl');
    var loginname = cmp.storage.get('loginname');
    var password = cmp.storage.get('password');
    var obj = new Object();
    obj.url = serviceUrl + "/servlet/PublicServiceServlet";
    obj.async = false;
    obj.data = {
        'message_id' : 'gtpt',
        'branch' : 'apply',
        'loginname' : loginname,
        //'password' : password
    };
    obj.successFun = 'applyDataSucess';
    ajaxJson_v1(obj);
}

var applyObj;
var f  =0;
function applyDataSucess(data) {
    applyObj = data.rgquery.DATA.rows;
    console.log(applyObj)
    if (applyObj.length == 0) {
        apply2DataSucess();
    }
    var serviceUrl = cmp.storage.get('serviceUrl');
    var loginname = cmp.storage.get('loginname');
    var password = cmp.storage.get('password');
    for (var i = 0; i < applyObj.length; i++) {
        var obj = new Object();
        var id = applyObj[i].id;
        obj.url = serviceUrl + "/servlet/PublicServiceServlet";
        obj.async = false;
        obj.data = {
            'message_id' : 'gtpt',
            'branch' : 'yuqi',
            'id' : id,
            'loginname' : loginname,
            //'password' : password
        };
        obj.successFun = 'apply0DataSucess';
        ajaxJson_v1(obj);

    }
    if (f>0) {

        if(f==applyObj.length){
            f=0;	
			cmp.notification.alert("认购已逾期",function(err, data, dataType, optId){
				rengou();
			},"提醒","确定","",false,false);
        }else{
            f=0;
			cmp.notification.alert("部分认购已逾期",function(err, data, dataType, optId){
				rengou();
			},"提醒","确定","",false,false);

        }
        return false;
    } else {
        apply2DataSucess();
    }
}



function apply0DataSucess(data) {

    var canSubmit = data.yuqi.DATA.success;
    console.log(canSubmit)
    if(!canSubmit){
        f++;
    }

}

function apply2DataSucess() {

    console.log(applyObj);
    var html = '';
    if (applyObj.length == 0) {
        $("#content").css("display", "");
        html += '<div class="beijin">';
        html += '</div>';
        html += '<div style="text-align:center; padding-top:68%;"><span style="color:gray;">您还没有待认购信息';
        html += '</span></div>';
        $("#content").html(html);
    } else {
        var id = applyObj[0].id

        console.log(id);
        var serviceUrl = cmp.storage.get('serviceUrl');
        var loginname = cmp.storage.get('loginname');
        var password = cmp.storage.get('password');
        var obj = new Object();
        obj.url = serviceUrl + "/servlet/PublicServiceServlet";
        obj.data = {
            'message_id' : 'gtpt',
            'branch' : 'apply',
            'id' : id,
            'loginname' : loginname,
            //'password' : password
        };
        obj.successFun = 'getGtData_rgapply';
        ajaxJson_v1(obj);
        //  getGtData_rgapply();

        //  getGtData_rgapply(data);
    }

}

function getGtData_rgapply(data) {
    $("#gt").css("display", "");
    $("#time").css("display", "");
    $("#gt_rgapply_content").css("display", "");
    $("#jiewei").css("display", "");
    console.log(data);
    //  var rgArr = data.rgquery.DATA.rows;
    var jsonStr = data.rengou.DATA;
    var applyObj = JSON.parse(jsonStr);
    //  console.log(rgArr);
    console.log(applyObj);
    var count = 0;
    var html = '';
    var time = "";
    var qiangzhi = false;

    for (var i = 0; i < applyObj.length; i++) {
        //applyObj[1].invest_type = '强制';
        //  applyObj[1].matchMount = 0;
        //  applyObj[1].lower_amount = 0;

        html += '<input type="hidden" name="rg_project_id" id="rg_project_id" value="' + applyObj[i].project_id + '" />';
        html += '<input type="hidden" name="rg_apply_id" id="rg_apply_id" value="' + applyObj[i].id + '" />';
        html += '<input type="hidden" name="create_date" id="create_date" value="' + applyObj[i].create_date + '" />';
        /*html += '<table id="gt_table" class="gt_table" width="100%">';
         html += '<tr class="uhide">';
         html += '<td id="t_gt_p_group" class="t_gt_p_group">产业集团</td>';
         html += '<td id="gt_p_group" class="gt_p_group">';
         html += applyObj[i].p_group == undefined ? "" : applyObj[i].p_group;
         html += '</td>';
         html += '</tr>';
         html += '<tr class="uhide">';
         html += '<td id="t_gt_next_company" class="t_gt_next_company">下属公司</td>';
         html += '<td id="gt_next_company" class="gt_next_company">';
         html += applyObj[i].next_company == undefined ? "" : applyObj[i].next_company;
         html += '</td>';
         html += '</tr>';
         html += '<tr class="uhide">';
         html += '<td id="t_gt_center_name" class="t_gt_center_name">所属中心</td>';
         html += '<td id="gt_center_name" class="gt_center_name">';
         html += applyObj[i].center_name == undefined ? "" : applyObj[i].center_name;
         html += '</td>';
         html += '</tr>';
         html += '<tr class="uhide">';
         html += '<td id="t_gt_dept_name" class="t_gt_dept_name">所属部门</td>';
         html += '<td id="gt_dept_name" class="gt_dept_name">';
         html += applyObj[i].dept_name == undefined ? "" : applyObj[i].dept_name;
         html += '</td>';
         html += '</tr>';
         html += '<tr class="uhide">';
         html += '<td id="t_gt_employee_code" class="t_gt_employee_code">工号</td>';
         html += '<td id="gt_employee_code" class="gt_employee_code">';
         html += applyObj[i].employee_code == undefined ? "" : applyObj[i].employee_code;
         html += '</td>';
         html += '</tr>';
         html += '<tr class="uhide">';
         html += '<td id="t_gt_employee_name" class="t_gt_employee_name">姓名</td>';
         html += '<td id="gt_employee_name" class="gt_employee_name">';
         html += applyObj[i].employee_name == undefined ? "" : applyObj[i].employee_name;
         html += '</td>';
         html += '</tr>';
         html += '<tr class="uhide">';
         html += '<td id="t_gt_job_name" class="t_gt_job_name">任职岗位</td>';
         html += '<td id="gt_job_name" class="gt_job_name">';
         html += applyObj[i].job_name == undefined ? "" : applyObj[i].job_name;
         html += '</td>';
         html += '</tr>';
         html += '<tr class="uhide">';
         html += '<td id="t_gt_employee_level" class="t_gt_employee_level">职层</td>';
         html += '<td id="gt_employee_level" class="gt_employee_level">';
         html += applyObj[i].employee_level == undefined ? "" : applyObj[i].employee_level;
         html += '</td>';
         html += '</tr>';
         var  time= getConvertTime(applyObj[i].end_time);;
         /* if(count){

         html += '<tr>';
         html += '<td id="t_gt_int_mantime" class="t_gt_int_mantime">认购截止时间</td>';
         html += '<td id="gt_int_mantime" class="gt_int_mantime">';
         html += getConvertTime(applyObj[i].end_time);
         html += '</td>';
         html += '</tr>';
         }*/
        /* html += '<tr>';
         html += '<td id="t_gt_p_name" class="t_gt_p_name">项目名称</td>';
         html += '<td id="gt_p_name"  name ="p_name1" class="gt_p_name">';
         html += applyObj[i].p_name == undefined ? "" : applyObj[i].p_name;
         html += '</td>';
         html += '</tr>';
         html += '<tr>';
         html += '<td id="t_gt_company_name" class="t_gt_company_name">所属区域</td>';
         html += '<td id="gt_company_name" class="gt_company_name">';
         html += applyObj[i].company_name == undefined ? "" : applyObj[i].company_name;
         html += '</td>';
         html += '</tr>';
         html += '<tr>';
         html += '<td id="t_gt_project_type" class="t_gt_high_amount">项目类型</td>';
         html += '<td id="gt_project_type" class="t_gt_high_amount">';
         html += applyObj[i].project_type == undefined ? "" : applyObj[i].project_type;
         html += '</td>';
         html += '</tr>';
         html += '<tr>';
         html += '<tr>';
         html += '<td id="t_gt_invest_type" class="t_gt_invest_type">跟投类型</td>';
         html += '<td id="gt_invest_type" class="gt_invest_type">'
         html += applyObj[i].invest_type == undefined ? "" : applyObj[i].invest_type;
         html += '</td>';
         html += '</tr>';
         if(applyObj[i].invest_type=='强制'){
         html += '<tr>';
         html += '<td id="t_gt_project_type" class="t_gt_high_amount">累计强制跟投总额</td>';
         html += '<td id="gt_project_type" class="t_gt_high_amount" style="color:#6495ED"  onClick="chakan()">查看';
         html += '</td>';
         html += '</tr>';
         }
         if(count<rgArr.length){
         var filename = rgArr[i].filename==undefined ? "1":rgArr[i].filename;
         var projectid = rgArr[i].p_code==undefined ? "1":rgArr[i].p_code;
         var fileid = rgArr[i].fileid==undefined ? "1":rgArr[i].fileid;
         var fileclass = rgArr[i].fileclass==undefined ? "0":rgArr[i].fileclass;
         if (filename != 1&& filename != null) {
         filename = filename.replace(".pdf", "");
         }
         if ('1' == fileclass && 1 != filename && null != filename && projectid && fileid) {

         html += '<tr>';
         html += '<td id="t_gt_p_doc" class="t_gt_high_amount">路演材料</td>';
         html += '<td id="gt_filename" class="t_gt_high_amount" style="color:#6495ED"  onClick="luyan()">';
         html += '<span id="gt_p_doc" class="gt_p_doc" data-docRealName="' + filename + '" data-docShowName="' + filename + '" data-gt_projectId="' + projectid + '" data-gt_fileid="'+fileid+'">查看</span>';
         html += '</td>';
         html += '</tr>';

         }
         count++;
         }
         html += '<tr>';
         html += '<td id="t_gt_lower_amount" class="t_gt_lower_amount">额度下限(万元)</td>';
         html += '<td id="gt_lower_amount" class="gt_lower_amount">';
         var lower_amount = applyObj[i].lower_amount == undefined ? "" : applyObj[i].lower_amount
         html += '<input type="tel" id="lower_amount"  name="lower_amount1"class="input" readOnly="true" value="'+lower_amount+'"/>'
         html += '</td>';
         html += '</tr>';
         html += '<tr>';
         html += '<td id="t_gt_high_amount" class="t_gt_high_amount">额度上限(万元)</td>';
         html += '<td id="gt_high_amount" class="gt_high_amount">';
         var high_amount = applyObj[i].high_amount == undefined ? "" : applyObj[i].high_amount
         html += '<input type="tel" id="high_amount"  name ="high_amount1"  class="input"  readOnly="true" value="'+high_amount+'"/>'
         html += '</td>';
         html += '</tr>';
         if(applyObj[i].invest_type=='强制'){
         html += '<tr name="tr_matchMount" >';
         html += '<td id="t_gt_matchMount"  class="t_gt_high_amount">配资金额(万元)</td>';
         html += '<td id="gt_matchMount" class="t_gt_high_amount">';
         var matchMount = applyObj[i].matchMount == undefined ? "" : applyObj[i].matchMount
         html += '<input type="tel" id="matchMount"   name = "matchMount1" class="input" readOnly="true" value="'+matchMount+'"/>'
         html += '</td>';
         html += '</tr>';
         html += '<tr name = "tr_isMatch" >';
         html += '<td id="t_gt_high_amount" class="t_gt_high_amount">是否配资</td>';
         html += '<td id="isMatch" class="gt_high_amount">';
         html +='<div name="isMatch">'
         html += '<input name="danxuan'+i+'" id ="" type="radio"   checked ="checked" onChange="setIsMatch(this,'+i+')" value="0"/><label>是</label>'
         html += '<input name="danxuan'+i+'" id ="" type="radio"  onChange="setIsMatch(this,'+i+')" value="1"/><label>否</label>'
         html += '</div>'
         html += '</td>';
         html += '</tr>';
         }else{
         html += '<tr name="tr_matchMount"  style="display:none" >';
         html += '<td id="t_gt_matchMount"  class="t_gt_high_amount">配资金额(万元)</td>';
         html += '<td id="gt_matchMount" class="t_gt_high_amount">';
         var matchMount = applyObj[i].matchMount == undefined ? "" : applyObj[i].matchMount
         html += '<input type="tel" id="matchMount"  name = "matchMount1" class="input" readOnly="true" value="'+matchMount+'"/>'
         html += '</td>';
         html += '</tr>';
         html += '<tr name = "tr_isMatch" style="display:none">';
         html += '<td id="t_gt_high_amount" class="t_gt_high_amount">是否配资</td>';
         html += '<td  class="gt_high_amount">';
         html +='<div name="isMatch">'
         html += '<input name="danxuan'+i+'" id ="" type="radio"   checked ="checked" onChange="setIsMatch(this,'+i+')" value="0"/><label>是</label>'
         html += '<input name="danxuan'+i+'" id ="" type="radio"  onChange="setIsMatch(this,'+i+')" value="1"/><label>否</label>'
         html += '</div>'
         html += '</td>';
         html += '</tr>';
         }
         html += '<tr>';
         html += '<td id="t_gt_apply_amount" class="t_gt_apply_amount">认购额度(万元)</td>';
         html += '<td id="gt_apply_amount" class="gt_apply_amount">';
         html += '<input type="tel" id="apply_amount" name ="apply_amount1" class="apply_amount" value="" onChange="changeElement(this);" />';
         html += '</td>';
         html += '</tr>';
         if(applyObj[i].invest_type=='强制'){

         html += '<tr name="tr_fact_amount"   >';
         html += '<td id="t_gt_matchMount" class="t_gt_high_amount">需实缴金额(万元)</td>';
         html += '<td id="gt_fact_amount" class="t_gt_high_amount">';
         html += '<input type="tel" id="fact_amount"  name = "fact_amount1" readOnly="true"  class="input" value=""/>'
         html += '</td>';
         html += '</tr>';
         }else{
         html += '<tr name="tr_fact_amount" style="display:none"   >';
         html += '<td id="t_gt_matchMount" class="t_gt_high_amount">需实缴金额(万元)</td>';
         html += '<td id="gt_fact_amount" class="t_gt_high_amount">';
         html += '<input type="tel" id="fact_amount"  name = "fact_amount1" readOnly="true"  class="input" value=""/>'
         html += '</td>';
         html += '</tr>';
         }
         html += '</table>'; */
        html += '<div style="width:95%; margin-left:2.5%;border-bottom: 1px solid #E8E8E8;" class="rg_xiangmu">';
        html += '<div style="width:100%;color:#000000;font-size: 0.9em;font-weight: bold;"  name="p_name1" class="rg_xiangmu_0">';
        html += applyObj[i].p_name == undefined ? "" : applyObj[i].p_name;
        html += '</div>'
        html += '<div style="width:45%;display:inline-block;" class="rg_xiangmu_1">';
        html += '<table id="gt_table"  style =" table-layout: fixed; color :#9D9D9D" class="gt_table" width="100%">';
        // html += '<tr>';
        //html += '<td id="t_gt_p_name" style="font-weight:bold;font-size: 0.9em " class="">项目名称</td>';
        // html += '<td id="gt_p_name" style="font-weight:bold;font-size: 0.9em " name ="p_name1" class="gt_p_name">';
        //  html += applyObj[i].p_name == undefined ? "" : applyObj[i].p_name;
        // html += '</td>';
        // html += '</tr>';
        html += '<tr>';
        html += '<td id="t_gt_company_name" class="">所属区域</td>';
        html += '<td id="gt_company_name" class="" style="color:#000000">';
        html += applyObj[i].company_name == undefined ? "" : applyObj[i].company_name;
        html += '</td>';
        html += '</tr>';
        html += '<tr>';
        html += '<td id="t_gt_project_type" class="">项目类型</td>';
        html += '<td id="gt_project_type" class="" style="color:#000000">';
        html += applyObj[i].project_type == undefined ? "" : applyObj[i].project_type;
        html += '</td>';
        html += '</tr>';
        html += '<tr>';
        html += '<tr>';
        html += '<td id="t_gt_invest_type" class="">跟投类型</td>';
        html += '<td id="gt_invest_type" name="invest_type1" class="" style="color:#000000">'
        html += applyObj[i].invest_type == undefined ? "" : applyObj[i].invest_type;
        html += '</td>';
        html += '</tr>';
        html += '<tr>';
        html += '<td id="t_gt_lower_amount" class="">额度下限</td>';
        html += '<td id="gt_lower_amount" class="" style="color:#000000">';
        var lower_amount = applyObj[i].lower_amount == undefined ? "" : applyObj[i].lower_amount
        html += '<span id ="lower_amount"  name  ="lower_amount1" >' + lower_amount + '</span>&nbsp;万'
        html += '</td>';
        html += '</tr>';
        html += '<tr>';
        html += '<td id="t_gt_high_amount" class="">额度上限</td>';
        html += '<td id="gt_high_amount" class="" style="color:#000000">';
        var high_amount = applyObj[i].high_amount == undefined ? "" : applyObj[i].high_amount
        html += '<span id ="high_amount"  name ="high_amount1" style =" ">' + high_amount + '</span>&nbsp;万'
        html += '</td>';
        html += '</tr>';
        html += '</table>'
        html += '</div>'
        html += '<div class="biankuang"></div>'
        html += '<div style="width:53%;display:inline-block;">';
        var apply_amount = applyObj[i].apply_amount == undefined ? "0" : applyObj[i].apply_amount;
        html += '<div style="width:100%;height:20%;margin-left:3%;padding-top:0.3em">'
        html += '<input placeholder="输入认购额度(万元)" type="text"  name="apply_amount1"  onfocus="a()" onChange="changeElement(this);" value ="' + apply_amount + '" style="text-align:center;display:inline-block;width:13em;height:2em;border:0.1em solid #FFA500;font-size: 0.75em;"/>'
        // html +='&nbsp;&nbsp;&nbsp;&nbsp;<span style="display:inline-block;margin-top:0.5em;padding-top:0.4em;width:4em;height:1.8em;background-color:#FFA500;font-size: 0.65em;color:#FFFFFF;text-align:center;" >保存<span>'
        html += '</div>'
        var matchMount = applyObj[i].matchMount == undefined ? "0" : applyObj[i].matchMount;
        var fact_amount = applyObj[i].fact_amount == undefined ? "0" : applyObj[i].fact_amount;

        if (applyObj[i].invest_type == '强制') {
            html += '<div style="display:none;font-size: 0.75em;color:red">';
            html += '<span style="margin-left:3%;padding-top:0.3em;display:none;color:#000000" >配资金额：</span>'
            html += '<span   id ="matchMount"  name ="matchMount1" style="margin-left:3%;padding-top:0.5em;display:none;color:#000000" >' + matchMount + '</span><span style="color:#000000;display:none">万<span>'
            html += '</div>'

            html += '<div style="display:none;">';
            html += '<span style="margin-left:3%;padding-top:0.3em;display:none;font-size: 0.75em;color:#000000" >是否配资：</span>'
            html += '<div name="isMatch" style="margin-left:0.5em;padding-top:;display:none;font-size: 0.75em;">';
            html += '<input style="padding-top: 0.5em;" type="radio" name="danxuan' + i + '" value="0" checked="checked " onChange="setIsMatch(this,' + i + ')">&nbsp;是 '
            html += '<input  style=" margin-left :0.5em;padding-top: 0.5em;" type="radio"  name ="danxuan' + i + '" value ="1" onChange="setIsMatch(this,' + i + ')">&nbsp;否'
            html += '</div >';
            html += '</div>'

            html += '<br/><div style = "font-size: 0.75em;color:red";style="display:none" >';
            html += '<span style="margin-left:3%;bottom:5%;padding-top:0.3em;display:none;color:#000000" >需实缴金额：</span>';console.log(fact_amount);
            html += '<span  id ="fact_amount"  name ="fact_amount1" style="margin-left:3%;bottom:5%;padding-top:0.5em;display:none;" >' + fact_amount + '</span>'
            html += '</div><br/><br/>'
        } else {
            html += '<div id ="peizi" style="display:none;font-size: 0.75em;color:red">';
            html += '<span style="margin-left:3%;padding-top:0.3em;display:inline-block;font-size: 0.75em;color:#000000" on >配资金额：</span>'
            html += '<span  id ="matchMount"  name="matchMount1" style="margin-left:3%;padding-top:0.5em;display:inline-block;" >' + matchMount + '</span>万'
            html += '</div>'

            html += '<div id="isMatch1" style="display:none">';
            html += '<span style="margin-left:3%;padding-top:0.3em;display:inline-block;font-size: 0.75em;color:#000000"  >是否配资：</span>'
            html += '<div name="isMatch" style="margin-left:0.3em;padding-top:;display:inline-block;font-size: 0.75em;">';
            html += '<input style="padding-top: 0.5em;" type="radio" name="danxuan' + i + '" value="0" checked="checked " onChange="setIsMatch(this,' + i + ')">&nbsp;是 '
            html += '<input  style=" margin-left :0.5em;padding-top: 0.5em;" type="radio"  name ="danxuan' + i + '" value ="1" onChange="setIsMatch(this,' + i + ')">&nbsp;否'
            html += '</div >';
            html += '</div>'

            html += '<br/><div style ="font-size: 0.75em;color:red;display:none">';
            html += '<span style="margin-left:3%;bottom:5%;padding-top:0.3em;display:inline-block;color:#000000" >需实缴金额：</span>';
            html += '<span  id ="fact_amount" name ="fact_amount1" style="margin-left:3%;bottom:5%;padding-top:0.5em;display:inline-block; white-space: nowrap" >' + fact_amount + '</span>万'
            html += '</div><br/><br>'
        }
        html += '</div>'
        html += '</div>'
        time = getConvertTime(applyObj[i].end_time);
    }

    var floor =cmp.storage.get('floor');
    var fanben =cmp.storage.get('fanben');


    if (floor!=''&& floor!=null&& floor!=undefined) {
        $("#qz").css("display", "");
    }

    $("#gt_rgapply_content").html(html);
    console.log(time);
    getGtHeadData();
    $("#z_time").text(time);

    var applyMount = 0;
    var ganggan = 0;
    var mounts = 0;
    var isMatchs = $("div[name='isMatch']");
    for (var i = 0; i < applyObj.length; i++) {
        console.log(applyObj[i].isMatch)

        if(applyObj[i].isMatch==1){
            $("input:radio[name='danxuan" + i + "'][value=0]").attr("checked", false);
            $("input:radio[name='danxuan" + i + "'][value=1]").attr("checked", true);
        }
        var apply_amount = document.getElementsByName("apply_amount1")[i];
        var lower_amount = document.getElementsByName("lower_amount1")[i].innerText;
        var matchMount = document.getElementsByName("matchMount1")[i].innerText;
        var fact_amount = document.getElementsByName("fact_amount1")[i];
        isMatch = isMatchs.find($("input[name='danxuan" + i + "']:checked")).val();




        if (applyObj[i].invest_type == '强制') {
            //如果是强制  认购金额为空 ，则让其为下限，计算出实缴
            if (apply_amount.value == 0) {
                apply_amount.value = lower_amount;
            }

            if (isMatch == 0) {

                fact_amount.innerText =  (apply_amount.value - matchMount).toFixed(1);

                ganggan += Number(matchMount);
            } else {
                fact_amount.innerText = apply_amount.value


            }
            // 计算出为强制时 必要的  认购  实缴 配资
            applyMount += Number(apply_amount.value);

            mounts += Number(fact_amount.innerText);

        } else {

            fact_amount.innerText = apply_amount.value

            applyMount += Number(apply_amount.value);
            mounts += Number(fact_amount.innerText);
        }

    }
    applyMount = applyMount
    ganggan = ganggan;
    mounts = mounts
    $("#z_apply_amount").html(    Math.round(applyMount * 100)/100 );
    $("#z_matchMount").html( Math.round(ganggan * 100)/100 );
    $("#z_mounts").html(Math.round(mounts * 100)/100  );

    //uexWindow.evaluateScript("gtpt_rgapply", 0, "doScript($('#nav-right').removeClass('uhide'))");
}

//将时间戳转换方便阅读的时间
function getConvertTime(timestamp) {
    if (undefined == timestamp || null == timestamp) {
        return "";
    } else {
        var entrytime = new Date(timestamp);
        var year = entrytime.getFullYear();
        var month = entrytime.getMonth() + 1;
        var date = entrytime.getDate();
        var hours = entrytime.getHours();
        var seconds = entrytime.getSeconds();
        var minutes = entrytime.getMinutes();
        if (month < 10) {
            month = "0" + month;
        }
        if (date < 10) {
            date = "0" + date;
        }
        if (hours < 10) {
            hours = "0" + hours;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        return year + '-' + month + '-' + date + ' ' + hours + ':' + seconds;
    }
}

//认购值改变
function changeElement(obj1) {
    //只允许输入数字
    var reg =/^[0-9]\d*(\.\d+)?$/;
    var reg1 = /^[0-9]\d*$/;

    if (!reg.test(obj1.value)) {
        if(obj1.value!=''){
			cmp.notification.alert("认购金额错误,必须为数字",function(){
			},"","","",false,false);
            return false;
        }
    }

    console.log(Number($(obj1).val()));
    /* if (obj1.value.length == 1) {
         obj1.value = obj1.value.replace(/[^0-9]/g, '0');
         console.log(Number($(obj1).val()));
     } else {
         obj1.value = obj1.value.replace(/\D/g, '');
         console.log(Number($(obj1).val()));
     }*/
    var fact_amount = $(obj1).parent().parent().find("#fact_amount");
    //需实缴
    var matchMount = $(obj1).parent().parent().find("#matchMount").text();
    //配资
    var lower_amount = $(obj1).parent().parent().parent().find("#lower_amount").text();
    //下限
    var isMatch = $(obj1).parent().parent().find("input:radio[checked]").val();
    //是否配资
    var high_amount = $(obj1).parent().parent().parent().find("#high_amount").text();
    //上限
    var invest_type = $(obj1).parent().parent().parent().find("#gt_invest_type").text();
    //跟投类型


    if(obj1.value!=lower_amount){

        if (!reg1.test(obj1.value)) {
            if(obj1.value!=''){
				cmp.notification.alert("认购必须为整数",function(){
				},"","","",false,false);
                return false;
            }
        }

    }


    if (Number($(obj1).val()) > Number(high_amount)) {
		cmp.notification.alert("认购金额不能大于上限金额",function(){
		},"","","",false,false);
        /*if (isMatch == "0") {
           $(obj1).val(Number(fact_amount[0].innerText) + Number(matchMount));
       } else {
           $(obj1).val(Number(fact_amount[0].innerText));
       }*/

        return false;
    }



    if (invest_type == "强制"){
        if (Number($(obj1).val()) < Number(lower_amount)){
			cmp.notification.alert("认购金额不能小于下限金额",function(){
			},"","","",false,false);
            /* if (isMatch == "0") {
                 $(obj1).val(Number(fact_amount[0].innerText) + Number(matchMount));
             } else {
                 $(obj1).val(Number(fact_amount[0].innerText));
             }*/
            return false;
        }
    }else{
        if($(obj1).val()==''){
			cmp.notification.alert("认购金额不能为空",function(){
			},"","","",false,false);
            $(obj1).val(0);
        }

    }



    if (isMatch == "0") {
        var a = $(obj1).val() - matchMount;
        if(a<0){
            a=0
        }
        fact_amount.text(a);
    } else {
        fact_amount.text(Number($(obj1).val()));
    }
    var applyMount = 0;
    var ganggan = 0;
    var mounts = 0;
    var isMatchs = $("div[name='isMatch']");
    console.log(isMatchs);
    $("input[name='apply_amount1']").each(function(i, obj) {
        var apply_amount = obj.value;
        if (apply_amount == '')
            apply_amount = 0;
        //console.log ("m-----"+ mounts);
        isMatch = isMatchs.find($("input[name='danxuan" + i + "']:checked")).val();
        applyMount += Number(apply_amount);
        //  console.log ("a-------"+ applyMount);
        if (isMatch == 0) {
            var fact_amount = document.getElementsByName("fact_amount1")[i].innerText;
            var match_Mount = document.getElementsByName("matchMount1")[i].innerText;
            ganggan += Number(match_Mount);
            // console.log("g--------"+ganggan);
            if (!fact_amount)
                fact_amount = 0;
            mounts = mounts + Number(fact_amount);
        } else {
            mounts = mounts + Number(apply_amount);
        }
    });

    /* applyMount =applyMount.toFixed(2);
     ganggan= ganggan.toFixed(2);
     mounts = mounts.toFixed(2);*/
    $("#z_apply_amount").html( Math.round(applyMount * 100)/100 );
    $("#z_matchMount").html( Math.round(ganggan * 100)/100 );
    $("#z_mounts").html(  Math.round(mounts * 100)/100 );
    //document.getElementsByName("applyAmountTotal")[1].value = applyMount;
    //document.getElementsByName("applyAmountTotal")[2].value = mounts;
    //          $("#applyAmountTotal").val(applyMount);
}

/**
 * 是否配资选择
 * @param obj
 */
function setIsMatch(obj, i) {
    var a = $(obj).val();
    console.log(a);
    var matchMount = document.getElementsByName("matchMount1")[i].innerText;
    var apply_amount = document.getElementsByName("apply_amount1")[i].value;
    var fact_amount = document.getElementsByName("fact_amount1")[i];
    var lower_amount = document.getElementsByName("lower_amount1")[i].innerText;
    var applyMount1 = $("#z_apply_amount");
    var applyMount2 = $("#z_matchMount");
    var applyMount3 = $("#z_mounts");
    if (apply_amount == '')
        apply_amount = 0;
    if (a == 0) {
        if ((apply_amount - lower_amount) < 0) {
			cmp.notification.alert("认购金额不能小于下限金额",function(){
			},"","","",false,false);
            $("input:radio[name='danxuan" + i + "'][value=0]").attr("checked", false);
            $("input:radio[name='danxuan" + i + "'][value=1]").attr("checked", true);
            return false;
        } else {

            $("input:radio[name='danxuan" + i + "'][value=0]").attr("checked", true);
            $("input:radio[name='danxuan" + i + "'][value=1]").attr("checked", false);
            fact_amount.innerText = apply_amount - matchMount;
            applyMount2.text((parseInt(applyMount2.text()) + parseInt(matchMount)));
            if (apply_amount > 0) {//认购金额大于0 时 认购才减配资
                applyMount3.text((applyMount3.text() - matchMount));
            }
        }
    } else {
        $("input:radio[name='danxuan" + i + "'][value=0]").attr("checked", false);
        $("input:radio[name='danxuan" + i + "'][value=1]").attr("checked", true);
        if (apply_amount == "") {
            fact_amount.innerText = Number(lower_amount);
        } else {
            fact_amount.innerText = apply_amount;
        }

        if (parseInt(applyMount2.text()) > 0) {
            applyMount2.text((parseInt(applyMount2.text()) - parseInt(matchMount)));
        }

        applyMount3.text((parseInt(applyMount3.text()) + parseInt(matchMount)));
    }
}

//提交
function submitFormData() {
    /* var flag = true;
     var project_id = $("#rg_project_id").val();
     var id = $("#rg_apply_id").val();
     var apply_amount = $("#apply_amount").val();
     if(undefined==project_id || ""==project_id || null==project_id){
     flag = false;
     openToast ("校验项目信息出现异常");
     }
     if(undefined==id || ""==id || null==id){
     flag = false;
     openToast ("校验认购信息出现异常");
     }
     if(undefined==apply_amount || ""==apply_amount || null==apply_amount){
     flag = false;
     openToast ("请填写认购额度");
     }
     if(String(Number(apply_amount))=='NaN'){
     flag = false;
     openToast ("认购额度必须是整数");
     }
     if(flag == true){*/

    var serviceUrl = cmp.storage.get('serviceUrl');
    var loginname = cmp.storage.get('loginname');
    var password = cmp.storage.get('password');
	
	cmp.notification.confirm("您确定提交认购吗",function(index){
		if(index == 0){
			var applyIds = document.getElementsByName("rg_apply_id");
			var apply_amounts = document.getElementsByName("apply_amount1");
			var lower_amounts = document.getElementsByName("lower_amount1");
			//下限
			var high_amounts = document.getElementsByName("high_amount1");
			//上限
			var isMatchs = $("div[name='isMatch']");
			//是否配资
			var fact_amounts = document.getElementsByName("fact_amount1");
			//实缴金额
			var p_names = document.getElementsByName("p_name1");
			var invest_types = document.getElementsByName("invest_type1");
			var applyId = "";
			var apply_amount = "";
			var isMatch = '';
			var fact_amount = "";
			var reg = /^[0-9]\d*(\.\d+)?$/;
			var reg1 = /^[0-9]\d*$/;
			var alertStr = "";
					
			var applyId = "";
			var apply_amount = "";
			var apply_amount_total = 0;
			console.log(p_names);
			for (var i = 0; i < applyIds.length; i++) {
			    applyId = applyId + applyIds[i].value + ";";
					
			    apply_amount = apply_amount + apply_amounts[i].value + ";";
			    isMatch = isMatch + isMatchs.find($("input[name='danxuan" + i + "']:checked")).val() + ";";
			    fact_amount = fact_amount + fact_amounts[i].innerText + ";";
			    apply_amount_total = apply_amount_total + Number(apply_amounts[i].value);
			    console.log(applyId)
			    console.log(apply_amount)
			    console.log(isMatch)
			    console.log(fact_amount)
			    if (apply_amounts[i].value == "") {
					cmp.notification.alert(p_names[i].innerText + "认购金额不能为空",function(){
					},"","","",false,false);
			        return;
			    }
					
			    if (!reg.test(apply_amounts[i].value)) {
			        alertStr = alertStr + p_names[i].innerText + "认购金额错误\r\n";
			        break;
			    }
			    if (Number(lower_amounts[i].innerText) != Number(apply_amounts[i].value)) {
			        if (!reg1.test(apply_amounts[i].value)) {
			            alertStr = alertStr + p_names[i].innerText + "认购金额必须为整数\r\n";
			            break;
			        }
			    }
			    console.log(apply_amounts[i].value);
			    console.log(high_amounts[i].value);
			    if (Number(apply_amounts[i].value) > Number(high_amounts[i].innerText)) {
			        alertStr = alertStr + p_names[i].innerText + "认购金额已大于上限金额\r\n";
			        break;
			    }
					
					
			    if ((Number(apply_amounts[i].value) - Number(lower_amounts[i].innerText)) < 0) {
			        if (invest_types[i].innerText != '强制(试用期)') {
			            alertStr = alertStr + p_names[i].innerText + "认购金额不能小于下限金额\r\n";
			            break;
			        }
			    }
					
			}
					
			if (alertStr != "") {
				cmp.notification.alert(alertStr,function(){
				},"","","",false,false);
			    return false;
			}
					
			isMatch = isMatch.substring(0, applyId.length - 1);
			fact_amount = fact_amount.substring(0, applyId.length - 1);
			applyId = applyId.substring(0, applyId.length - 1);
			apply_amount = apply_amount.substring(0, apply_amount.length - 1);
					
			console.log(isMatch);
			console.log(apply_amount);
			console.log(applyId);
			if (Number(apply_amount_total) > 10000) {
				cmp.notification.alert("合计认购额度不能大于10000(万元)",function(){
				},"","","",false,false);
			    return;
			}
			var obj = new Object();
			obj.url = serviceUrl + "/servlet/PublicServiceServlet";
			obj.data = {
					
			    'message_id' : 'gtpt',
			    'branch' : 'rgsubmit',
			    'isMatch' : isMatch,
			    'fact_amount' : fact_amount,
			    'applyId' : applyId,
			    'apply_amount' : apply_amount,
			    'loginname' : loginname,
			    //'password' : password
			};
			obj.successFun = 'httpsucess01';
			ajaxJson_v1(obj);
		}else if(index == 1){
					//点击了第二个按钮
		}
	},"提醒",["确定","取消"],"",false,0);
	
	// cmp.notification.alert("您确定提交认购吗",function(err, data, dataType, optId){
	// 	if (data == 0) {
	// 	    
	// 	}
	// },"提醒","确定","取消",false,false);
}

function httpsucess01(data) {
    console.log(data);
    /*var checkStatus=data.reqdata.DATA.success;
     var checkmessage=data.reqdata.DATA.msg;
     if(checkStatus==false || checkStatus=='false'){
     //检查失败
     appcan.window.evaluatePopoverScript({
     name:"gtpt_menu",
     popName:'gtpt_apply',
     scriptContent:"showApplyTabview();"
     });
     cmp.notification.alert({
     title : "提醒",
     content : checkmessage,
     buttons : '确定',
     callback : function(err, data, dataType, optId) {
     uexWindow.evaluateScript("gtpt_rgapply", 0, "doScript(appcan.window.close(-1))");
     }
     });
     }else{ */
    var exception = data.submit.DATA.exception;
    var updateStatus = data.submit.DATA.updateStatus;
    if (updateStatus == true || updateStatus == 'true') {
        //认购成功
        // appcan.window.evaluatePopoverScript({
        //     name : "gtpt_menu",
        //     popName : 'gtpt_apply',
        //     scriptContent : "showApplyTabview();"
        // });	
		
		cmp.notification.alert("认购成功",function(err, data, dataType, optId){
			cmp.href.back()
		},"提醒","确定","",false,false);
    } else {
        //认购失败
		cmp.notification.alert("认购失败",function(err, data, dataType, optId){
		},"提醒","确定","",false,false);
    }
    //}
}

// 认购申请单保存
function saveApply() {
    var applyIds = document.getElementsByName("rg_apply_id");

    var apply_amounts = document.getElementsByName("apply_amount1");
    var lower_amounts = document.getElementsByName("lower_amount1");
    //下限
    var high_amounts = document.getElementsByName("high_amount1");
    //上限
    var isMatchs = $("div[name='isMatch']");
    //是否配资
    var fact_amounts = document.getElementsByName("fact_amount1");
    //实缴金额
    var p_names = document.getElementsByName("p_name1");
    console.log(p_names);

    var applyId = "";
    var isMatch = '';
    var fact_amount = "";
    var apply_amount = "";
    var reg = /^[0-9]\d*(\.\d+)?$/;
    var reg1 = /^[0-9]\d*$/;
    var alertStr = "";
    console.log(applyIds.length);
    for (var i = 0; i < applyIds.length; i++) {
        console.log(i);
        if (apply_amounts[i].value == '')
            continue;
        if (!reg.test(apply_amounts[i].value)) {
            alertStr = alertStr + p_names[i].innerText + "认购金额错误,必须为数字\r\n";
            break;
        }
        if (Number(lower_amounts[i].innerText) != Number(apply_amounts[i].value)) {
            if (!reg1.test(apply_amounts[i].value)) {
                alertStr = alertStr + p_names[i].innerText + "认购金额必须为整数\r\n";
                break;
            }
        }
        if (Number(apply_amounts[i].value) > Number(high_amounts[i].innerText)) {
            alertStr = alertStr + p_names[i].innerText + "认购金额已大于上限金额\r\n";
            break;
        }
        if ((Number(apply_amounts[i].value) - Number(lower_amounts[i].innerText)) < 0) {
            alertStr = alertStr + p_names[i].innerText + "认购金额不能小于下限金额\r\n";
            break;
        }

        isMatch = isMatch + isMatchs.find($("input[name='danxuan" + i + "']:checked")).val() + ";";

        fact_amount = fact_amount + fact_amounts[i].innerText + ";";

        applyId = applyId + applyIds[i].value + ";";

        apply_amount = apply_amount + apply_amounts[i].value + ";";

    }
    if (alertStr != "") {
		cmp.notification.alert(alertStr,function(){
		},"","","",false,false);
        return false;
    }

    applyId = applyId.substring(0, applyId.length - 1);
    apply_amount = apply_amount.substring(0, apply_amount.length - 1);
    fact_amount = fact_amount.substring(0, fact_amount.length - 1);
    isMatch = isMatch.substring(0, isMatch.length - 1);
    console.log(applyId)
    console.log(apply_amount)
    console.log(isMatch)
    console.log(fact_amount)

    if (applyId != "") {
        var serviceUrl = cmp.storage.get('serviceUrl');
        var loginname = cmp.storage.get('loginname');
        var password = cmp.storage.get('password');
        var obj = new Object();
        obj.url = serviceUrl + "/servlet/PublicServiceServlet";
        obj.data = {
            'message_id' : 'gtpt',
            'branch' : 'rgbaocun',
            'applyId' : applyId,
            'apply_amount' : apply_amount,
            'fact_amount' : fact_amount,
            'isMatch' : isMatch,
            'loginname' : loginname,
            //'password' : password
        };
        obj.successFun = 'baocun';
        ajaxJson_v1(obj);
    }
}

function baocun(data) {

    var updateStatus = data.baocun.DATA.updateStatus;

    if ('true' == updateStatus) {
		cmp.notification.alert("保存成功",function(){
		},"","","",false,false);
    } else {
		cmp.notification.alert(result.exception,function(){
		},"","","",false,false);
    }
}

//首页头部数据
function getGtHeadData() {

    var headHTML = '';
    headHTML += '<table id="gt_total_table" class="gt_total_table" width="100%" >';
    headHTML += '<tr>';
    headHTML += '<header id="gt_total_header" class="gt_total_header">';
    headHTML += '<td width="33%" id="t_gt_total_realamount" class="t_gt_total_realamount">认购合计</td>';
    headHTML += '<td width="33%" id="t_gt_total_releaseamount" class="t_gt_total_releaseamount">配资合计</td>';
    headHTML += '<td width="34%" id="t_gt_total_devidendamount" class="t_gt_total_devidendamount">需实缴合计</td>';
    headHTML += '</header>';
    headHTML += '</tr>';
    headHTML += '<tr>';
    headHTML += '<tbody id="gt_total_tbody" class="gt_total_tbody">';
    headHTML += '<td id="gt_total_realamount" class="gt_total_realamount">';
    headHTML += '<span id="z_apply_amount" ></span>';
    headHTML += '万元</td>';
    headHTML += '<td id="gt_total_releaseamount" class="gt_total_releaseamount">';
    headHTML += '<span  id="z_matchMount" ></span>';
    headHTML += '万元</td>';
    headHTML += '<td id="gt_total_devidendamount" class="gt_total_devidendamount">';
    headHTML += '<span  id="z_mounts" ></span>'
    headHTML += '万元</td>';
    headHTML += '</tbody>';
    headHTML += '</tr>';
    headHTML += '<tr>';
    headHTML += '<td   colspan="3"   id="time" class="gt_total_releaseamount">认购截止时间：';
    headHTML += '<span  id="z_time" ></span>';
    headHTML += '</td>';
    headHTML += '</tr>';
    headHTML += '</table>';
    $($("#gt_main_content")[0]).css("position", 'fixed');
    $($("#gt_main_content")[0]).css("zIndex", 999);
    $($("#gt_main_content")[0]).css("width", '101%');
    $("#gt_main_content #gt_head").html(headHTML);
}

//查看路演材料
// $("#gt_rgapply_content").on("tap", ".gt_p_doc", function(object) {
//     var btn = $(object.currentTarget);
//     var docRealName = btn.attr('data-docRealName');
//     var docShowName = btn.attr('data-docShowName');
//     var projectId = btn.attr('data-gt_projectId');
//     var fileid = btn.attr('data-gt_fileid');
//     console.log("docRealName:" + docRealName);
//     console.log("docShowName:" + docShowName);
//     if (docRealName) {
//         cmp.storage.save('gtpt_docRealName', docRealName);
//         cmp.storage.save('gtpt_docShowName', docShowName);
//         cmp.storage.save('gtpt_projectId', projectId);
//         cmp.storage.save('gtpt_fileid', fileid);
//         uexWindow.evaluateScript("gtpt_menu", 0, "doScript(appcan.window.open('gtpt_docDetail', 'gtpt_docDetail.html', 10, 4))");
//     }
// });

//打开累计强制跟投
// function chakan() {
//     appcan.window.open('gtpt_qzgt', 'gtpt_qzgt.html', 10, 4);
// }

//提示
// function openToast(str) {
//     appcan.window.openToast({
//         msg : str,
//         duration : 1500,
//         position : 5,
//         type : 0
//     });
// }


$(document).on('tap', 'input[type="text"]', function() {
    var target = this;
    setTimeout(function() {
        target.scrollIntoViewIfNeeded();
    }, 400);
});

// var winHeight = $(window).height();
// //获取当前页面高度
// window.onresize = function() {
// var thisHeight = $(this).height();
// if (winHeight - thisHeight > 50) {
// //当软键盘弹出，在这里面操作
// //alert('aaa');
// $('body').css('height', winHeight + 'px');
// } else {
// //alert('bbb');
// //当软键盘收起，在此处操作
// $('body').css('height', '100%');
// }
// };


