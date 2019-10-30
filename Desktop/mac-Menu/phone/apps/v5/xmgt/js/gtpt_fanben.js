cmp.ready(function() {

    var fanben = cmp.storage.get('fanbenmx');
    fanben = JSON.parse(fanben);

    var mainArr = cmp.storage.get('mainArr');

    mainArr = JSON.parse(mainArr);

    console.log(fanben);
    console.log(mainArr);

    var  fanbennum =0;
    var tourunum  =0;
    for(var i =0 ; i<fanben.length;i++){

        fanbennum+=Number(fanben[i].amount);
    }

    for(var i =0 ; i<mainArr.length;i++){
        tourunum+=Number(mainArr[i].realamountTotal);
    }

    console.log(fanbennum)
    console.log(tourunum)


    if (tourunum != 0) {
        $("#zongtouru").css('width', '10em');
    }
    $("#zongfanben").css('width', fanbennum / tourunum * 10 + 'em');
    if (tourunum != 0) {
        $("#zongtourunum").html(tourunum + '万');
    }
    if (tourunum != 0) {
        $("#zongfanbennum").html(Math.round(fanbennum * 100) / 100 + '万');
    }


    // getfanben(fanben);
    qiehuan();
})

function getfanben(fanben) {
    console.log(fanben)
    $("#leixin").css("background-image", "url(../img/tixing8.png)");
    $("#leixin").css("color", "#FFFFFF");
    $("#cishu").css("background-image", "url(../img/tixing2.png)");
    $("#cishu").css("color", "#000000");
    document.getElementById("gt_fanbenContent").setAttribute("value", 1);
    var result = [],
        isRepeated;
    var touru = [];
    for (var i = 0; i < fanben.length; i++) {
        isRepeated = false;
        for (var j = 0; j < result.length; j++) {
            if (fanben[i].p_name == result[j]) {
                isRepeated = true;
                break;
            }
        }
        if (!isRepeated) {
            result.push(fanben[i].p_name);
            touru.push(fanben[i].realamount);
        }
    }
    console.log(touru);

    var tourunum = 0;
    var tourunum1 = '';
    var fanbennum = 0;
    var realamounts = 0;
    var amounts = 0;
    var html = '';
    html += '<li>';
    html += '<div>';
    html += '<table id="gt_table" cellspacing="0" class="gt_table" width="100%" style="table-layout: fixed;">';
    // html +='<thead>'
    html += '<tr style="background-color:#034373;color:#ffffff;">';
    //html += '<td width="25%" id="t_gt_end_time" class="t_gt_end_time">认购截止时间</td>';
    html += '<td width="20%;" id="t_gt_xmlx" class="gt_header">项目名称</td>';
    html += '<td width="20%" id="t_gt_apply_amount" class="gt_header">投入金额</td>';
    html += '<td width="20%" id="t_gt_confirm_amount" class="gt_header">返本金额</td>';
    html += '<td width="20%" id="t_gt_fact_amount" class="gt_header">返本比例</td>';
    html += '<td width="20%" id="t_gt_int_mantime" class="gt_header">发放时间</td>';
    // html += '<td width="23%" id="t_gt_int_mantime" class="t_gt_xmlx">备注</td>';
    html += '</tr>';
    //  html +='</thead>'
    //    html +='<tbody>';

    for (var i = 0; i < touru.length; i++) {
        tourunum += Number(touru[i]);
    }

    for (var i = 0; i < fanben.length; i++) {

        html += '<tr>';
        html += '<td  style="text-align: left;" width="20%; id="t_gt_xmlx" class="t_gt_xmlx">';
        html += fanben[i].p_name;
        html += '</td>';
        html += '<td   width="20%;id="gt_apply_amount" class="t_gt_xmlx">';
        html += fanben[i].realamount == "" ? "" : fanben[i].realamount + '万 ';
        html += '</td>';
        html += '<td   width="20%; id="gt_fact_amount" class="t_gt_xmlx">';
        html += fanben[i].amount == "" ? "" : fanben[i].amount + '万';
        html += '</td>';
        html += '<td   width="20%; id="gt_confirm_amount" class="t_gt_xmlx">';
        html += fanben[i].proportion == "" ? "" : fanben[i].proportion;
        html += '%</td>';
        html += '<td   width="20%; id="gt_int_mantime" class="t_gt_xmlx">';
        html += fanben[i].returnDate == undefined ? "" : fanben[i].returnDate;
        html += '</td>';
        /* html += '<td class="t_gt_xmlx">';
         html += fanben[i].note==undefined?"":fanben[i].note;
         html += '</td>';*/
        html += '</tr>';
        realamounts += fanben[i].realamount;
        amounts += fanben[i].amount;

        //tourunum += fanben[i].realamount;
        fanbennum += fanben[i].amount;
    }
    html += '<tr>';
    html += '<td   width="20%;id="t_gt_xmlx" class="t_gt_xmlx">';
    html += '合计';
    html += '</td>';
    html += '<td  width="20%; id="gt_apply_amount" class="t_gt_xmlx">';
    html += '</td>';
    html += '<td   width="20%; id="gt_fact_amount" class="t_gt_xmlx">';
    html += Math.round(amounts * 100) / 100  + '万';
    html += '</td>';
    html += '<td  width="20%; id="gt_confirm_amount" class="t_gt_xmlx">';
    html += '</td>';
    html += '<td   width="20%; id="gt_int_mantime" class="t_gt_xmlx">';
    html += '</td>';
    html += '</tr>';
    /* html += '<td class="t_gt_xmlx">';
    html += fanben[i].note==undefined?"":fanben[i].note;
    html += '</td>';*/
    //  html+='</tbody>';
    html += '</table>';
    html += '</div>';
    html += '</li>';

    $("#gt_fanbenContent #gt_fanbenlistview").html(html);

}

function select() {

    var k2 = $("#infoName").val();

    var serviceUrl = cmp.storage.get('serviceUrl');
    var loginname = cmp.storage.get('loginname');
    var password = cmp.storage.get('password');
    var obj2 = new Object();
    obj2.url = serviceUrl + "/servlet/PublicServiceServlet";
    obj2.data = {
        'type' : 'post',
        'message_id' : 'gtpt',
        'branch' : 'fanbenmx',
        "k2" : k2,
        'loginname' : loginname,
        //'password' : password
    };
    obj2.successFun = 'selectFanbenSucess';
    ajaxJson_v1(obj2);
}

var fenlei =1;

function selectFanbenSucess(data) {

    console.log(data);
    var fanben = data.fanben.DATA.rows;
    console.log(fanben);
    if(fenlei==1){
        xiangmuheji(fanben);
    }else if(fenlei ==2){
        getfanben(fanben);
    }

}

function qiehuan(obj) {
    // var a = document.getElementById("gt_fanbenContent").getAttribute("value");
    var a;
    if(obj==undefined){
        a=1;
    }else{
        a = $(obj).attr("value");
    }

    var fanben = cmp.storage.get('fanbenmx');
    fanben = JSON.parse(fanben)
    if (a == 2) {
        fenlei=2;
        getfanben(fanben);
    } else {
        fenlei=1;
        xiangmuheji(fanben);
    }

}

function xiangmuheji(fanben){
    $("#leixin").css("background-image", "url(../img/tixing7.png)");
    $("#leixin").css("color", "#000000");
    $("#cishu").css("background-image", "url(../img/tixing1.png)");
    $("#cishu").css("color", "#ffffff");

    document.getElementById("gt_fanbenContent").setAttribute("value", 2);
    var result = [],
        isRepeated;
    for (var i = 0; i < fanben.length; i++) {
        isRepeated = false;
        for (var j = 0; j < result.length; j++) {
            if (fanben[i].p_name == result[j]) {
                isRepeated = true;
                break;
            }
        }
        if (!isRepeated) {
            result.push(fanben[i].p_name);
        }
    }
    console.log(result);

    var tourunum = 0;
    var tourunum1 = '';
    var fanbennum = 0;
    var realamounts = 0;
    var amounts = 0;
    var html = '';
    html += '<li>';
    html += '</div>';
    html += '<table id="gt_table" cellspacing="0" class="gt_table" width="100%" style="table-layout: fixed;">';
    html += '<tr style="background-color:#034373;color:#ffffff;" id ="diyi">';
    html += '<td width="20%;" id="t_gt_xmlx" class="gt_header">项目名称</td>';
    html += '<td width="20%" id="t_gt_apply_amount" class="gt_header">投入金额</td>';
    html += '<td width="20%" id="t_gt_confirm_amount" class="gt_header">返本金额</td>';
    html += '<td width="20%" id="t_gt_fact_amount" class="gt_header">返本比例</td>';
    html += '<td width="20%" id="t_gt_int_mantime" class="gt_header">发放时间</td>';
    html += '</tr>';
    for (var i = 0; i < result.length; i++) {
        var fanbens = 0;
        var bili = 0;
        var touru = 0;
        for (var j = 0; j < fanben.length; j++) {
            if (fanben[j].p_name == result[i]) {
                fanbens += Number(fanben[j].amount);
                bili += Number(fanben[j].proportion);
                touru = fanben[j].realamount;
            }
        }
        tourunum  += touru;
        fanbennum += fanbens;

        fanbens = Math.round(fanbens * 100) / 100
        html += '<tr id ="di' + i + '">';
        html += '<td style="text-align: left;" width="20%; id="t_gt_xmlx" class="t_gt_xmlx">';
        html += result[i];
        html += '</td>';
        html += '<td   width="20%;id="gt_apply_amount" class="t_gt_xmlx">';
        html += touru;
        html += '万</td>';
        html += '<td   width="20%; id="gt_fact_amount" class="t_gt_xmlx">';
        html +=  Math.round(fanbens * 100)/100 ;
        html += '万</td>';
        html += '<td   width="20%; id="gt_confirm_amount" class="t_gt_xmlx">';
        html +=   Math.round(bili * 100)/100;
        html += '%</td>';
        html += '<td   width="20%; id="gt_int_mantime" class="t_gt_xmlx">';
        html += '<div id="zhankai1' + i + '" class="zhankai1"  value="1" onclick="zhankai(' + i + ')" style=" " ><img src="../img/gt_zk1.png?buildversion=2f8a796" style="width: 1.5em;height:1.5em;" />';
        html += '</div></td>';
        html += '</tr>';
        html += '<tr style="height:1px; "><td  ><div  style="display:none"  id="conten' + i + '"><span  id ="xiaoguo' + i + '" value="1"/>'
        for (var j = fanben.length - 1; j >= 0; j--) {
            if (fanben[j].p_name == result[i]) {
                html += '<table><tr>';
                html += '<td  width="20%; id="t_gt_xmlx" class="t_gt_xmlx">';
                html += '</td>';
                html += '<td   width="20%;id="gt_apply_amount" class="t_gt_xmlx">';
                html += '</td>';
                html += '<td   width="20%; id="gt_fact_amount" class="t_gt_xmlx">';
                html += fanben[j].amount == "" ? "" : fanben[j].amount + '万';
                html += '</td>';
                html += '<td   width="20%; id="gt_confirm_amount" class="t_gt_xmlx">';
                html += fanben[j].proportion == "" ? "" : fanben[j].proportion;
                html += '%</td>';
                html += '<td   width="20%; id="gt_int_mantime" class="t_gt_xmlx">';
                html += fanben[j].returnDate == undefined ? "" : fanben[j].returnDate;
                html += '</td>';
                html += '</tr></table>';
            }
        }
        html += '</div></td></tr>'

    }

    html += '<tr>';
    html += '<td   width="20%;id="t_gt_xmlx" class="t_gt_xmlx">';
    html += '合计';
    html += '</td>';
    html += '<td  width="20%; id="gt_apply_amount" class="t_gt_xmlx">';
    html += '</td>';
    html += '<td   width="20%; id="gt_fact_amount" class="t_gt_xmlx">';
    html += Math.round(fanbennum * 100) / 100  + '万';
    html += '</td>';
    html += '<td  width="20%; id="gt_confirm_amount" class="t_gt_xmlx">';
    html += '</td>';
    html += '<td   width="20%; id="gt_int_mantime" class="t_gt_xmlx">';
    html += '</td>';
    html += '</tr>';
    html += '</table>';
    html += '</div>';
    html += '</li>';


    $("#gt_fanbenContent #gt_fanbenlistview").html(html);




}


function zhankai(obj) {
    var a = document.getElementById("xiaoguo" + obj).getAttribute("value");
    var b = document.getElementById("zhankai1" + obj);
    $('#conten' + obj).slideToggle("slow");
    if (a == 1) {
        setTimeout(function() {
            $('#tr' + obj + '').hide();

        }, 1500);

        document.getElementById("xiaoguo" + obj).setAttribute("value", 2);
        b.style.cssText = '-moz-transform:scaleY(-1);-webkit-transform:scaleY(-1); -o-transform:scaleY(-1);  transform:scaleY(-1); filter:FlipV;'
    }
    if (a == 2) {
        $('#tr' + obj + '').css("display", "")

        document.getElementById("xiaoguo" + obj).setAttribute("value", 1);
        b.style.cssText = '-moz-transform:scaleY(1);-webkit-transform:scaleY(1); -o-transform:scaleY(1);  transform:scaleY(1); filter:FlipV;'
    }
}
