cmp.ready(function() {

    var yfenhong = cmp.storage.get('yufenhong');
    yfenhong = JSON.parse(yfenhong)

    var mainArr = cmp.storage.get('mainArr');
    mainArr = JSON.parse(mainArr);

    console.log(yfenhong);
    console.log(mainArr);

    var  fenhongnum =0;
    var tourunum  =0;
    for(var i =0 ; i<yfenhong.length;i++){

        fenhongnum+=Number(yfenhong[i].bonus_mount);
    }

    for(var i =0 ; i<mainArr.length;i++){
        tourunum+=Number(mainArr[i].realamountTotal);
    }

    console.log(fenhongnum)
    console.log(tourunum)


    if (tourunum != 0) {
        $("#zongtouru").css('width', '10em');
    }
    $("#zongfenhong").css('width', fenhongnum / tourunum * 10 + 'em');
    //$("#zongpeizijine").css('width', matchmounts / mounts * 10 + 'em');
    //$("#zongpeizifenhong").css('width', bonus_matchmounts / mounts * 10 + 'em');

    if (tourunum != 0) {
        $("#zongtourunum").html(Math.round(tourunum * 100)/100 + '万');
    }
    if (fenhongnum != 0) {
        $("#zongfenhongnum").html(  Math.round(fenhongnum * 100)/100 + '万');
    }

    qiehuan();
})
function getYfenhong(yfenhong) {
    $("#leixin").css("background-image", "url(../img/tixing8.png)");
    $("#leixin").css("color", "#FFFFFF");
    $("#cishu").css("background-image", "url(../img/tixing2.png)");
    $("#cishu").css("color", "#000000");
    document.getElementById("gt_yufenhong").setAttribute("value", 1);

    console.log(yfenhong)
    var html = '';
    html += '<li>';
    html += '<div>';
    html += '<table id="gt_table" cellspacing="0" class="gt_table" width="100%">';
    //   html+="<thead>";
    html += '<tr style="background-color:#034373;color:#ffffff;">';
    html += '<td width="20%" id="t_gt_xmlx" class="gt_header">项目名称</td>';
    //  html += '<td width="12%" id="t_gt_apply_amount" class="gt_header">跟投份额</td>';
    html += '<td width="20%" id="t_gt_confirm_amount" class="gt_header">投入金额</td>';
    html += '<td width="20%" id="t_gt_fact_amount" class="gt_header">预分红</td>';
    //  html += '<td width="14%" id="t_gt_int_mantime" class="gt_header">配资金额</td>';
    // html += '<td width="12%" id="t_gt_apply_amount" class="gt_header">配资分红</td>';
    html += '<td width="20%" id="t_gt_confirm_amount" class="gt_header">预分红比例</td>';
    html += '<td width="20%" id="t_gt_fact_amount" class="gt_header">发放时间</td>';
    html += '</tr>';
    //     html+="</thead>";
    var mounts = 0;//投入
    var bonus_mounts = 0;//预分红
    var matchmounts = 0;
    var bonus_matchmounts = 0;
    //  html+=" <tbody>";
    for (var i = 0; i < yfenhong.length; i++) {
        html += '<tr>';
        html += '<td  style="text-align: left; id="gt_apply_amount"  width="20%" class="t_gt_xmlx">';
        html += yfenhong[i].p_name == undefined ? "-" : yfenhong[i].p_name;
        html += '</td>';
        var mount = yfenhong[i].mount == undefined ? "-" : yfenhong[i].mount
        mounts += Number(mount);
        html += '<td id="gt_confirm_amount"  width="20%" class="t_gt_xmlx">';
        html += yfenhong[i].mount == undefined ? "-" : yfenhong[i].mount + '万';
        html += '</td>';
        html += '<td id="gt_fact_amount" width="20%"  class="t_gt_xmlx">';
        var bonus_mount = yfenhong[i].bonus_mount == undefined ? "-" : yfenhong[i].bonus_mount
        bonus_mounts += Number(bonus_mount);
        html += Math.round(bonus_mount * 100)/100+ '万';
        html += '</td>';
        html += '<td id="gt_apply_amount" width="20%" class="t_gt_xmlx">';
        html += yfenhong[i].rateMount == undefined ? "-" : yfenhong[i].rateMount;
        html += '</td>';
        html += '<td id="gt_apply_amount" width="20%" class="t_gt_xmlx">';
        html += yfenhong[i].bonustime == undefined ? "-" : yfenhong[i].bonustime;
        html += '</td>';
        html += '</tr>'
    }
    html += '<tr>';
    html += '<td id="t_gt_xmlx" class="t_gt_xmlx">';
    html += '合计';
    html += '</td>';
    html += '<td id="gt_apply_amount" class="t_gt_xmlx">';
    html += '</td>';
    html += '<td id="gt_apply_amount" class="t_gt_xmlx">';
    html += Math.round(bonus_mounts * 100)/100  + '万';
    html += '</td>';
    html += '<td id="gt_fact_amount" class="t_gt_xmlx">';
    html += '</td>';
    html += '<td id="gt_int_mantime" class="t_gt_xmlx">';
    html += '</td>';
    html += '</tr>'
    html += '</table>';
    html += '</div>';
    html += '</li>';
    $("#gt_yufenhong #gt_yufenhonglistview").html(html);

    mounts=Math.round(mounts*100)/100
    bonus_mounts=Math.round( bonus_mounts*100)/100



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
        'branch' : 'yfenhongmx',
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
    var yfenhong = data.yfenhong.DATA.rows;
    getYfenhong(yfenhong);
    if(fenlei==1){
        xiangmuheji(yfenhong);
    }else if(fenlei ==2){
        getYfenhong(yfenhong);
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

    var yfenhong = cmp.storage.get('yufenhong');
    yfenhong = JSON.parse(yfenhong)
    if (a == 2) {
        fenlei=2;
        getYfenhong(yfenhong);
    } else {
        fenlei=1;
        xiangmuheji(yfenhong);
    }

}


function xiangmuheji(yfenhong){
    $("#leixin").css("background-image", "url(../img/tixing7.png)");
    $("#leixin").css("color", "#000000");
    $("#cishu").css("background-image", "url(../img/tixing1.png)");
    $("#cishu").css("color", "#ffffff");

    document.getElementById("gt_yufenhong").setAttribute("value", 2);
    var result = [],
        isRepeated;
    for (var i = 0; i < yfenhong.length; i++) {
        isRepeated = false;
        for (var j = 0; j < result.length; j++) {
            if (yfenhong[i].p_name == result[j]) {
                isRepeated = true;
                break;
            }
        }
        if (!isRepeated) {
            result.push(yfenhong[i].p_name);
        }
    }
    console.log(result);
    var yufenhongnum=0 ;
    var tourunum = 0;
    var html = '';
    html += '<li>';
    html += '</div>';
    html += '<table id="gt_table" cellspacing="0" class="gt_table" width="100%" style="table-layout: fixed;">';
    html += '<tr style="background-color:#034373;color:#ffffff;" id ="diyi">';
    html += '<td width="20%;" id="t_gt_xmlx" class="gt_header">项目名称</td>';
    html += '<td width="20%" id="t_gt_apply_amount" class="gt_header">投入金额</td>';
    html += '<td width="20%" id="t_gt_confirm_amount" class="gt_header">预分红</td>';
    html += '<td width="20%" id="t_gt_fact_amount" class="gt_header">预分红比例</td>';
    html += '<td width="20%" id="t_gt_int_mantime" class="gt_header">发放时间</td>';
    html += '</tr>';
    for (var i = 0; i < result.length; i++) {
        var yfenhongs = 0;
        var bili = 0;
        var touru = 0;
        for (var j = 0; j < yfenhong.length; j++) {
            if (yfenhong[j].p_name == result[i]) {
                yfenhongs += Number(yfenhong[j].bonus_mount);
                var rateMount  =  yfenhong[j].rateMount;
                rateMount = rateMount.substring(0,rateMount.length-1);

                bili += Number(rateMount);

                touru = Number(yfenhong[j].mount);
            }
        }
        tourunum += touru;
        yufenhongnum += yfenhongs;

        yfenhongs = Math.round(yfenhongs * 100) / 100
        html += '<tr id ="di' + i + '">';
        html += '<td style="text-align: left;" width="20%; id="t_gt_xmlx" class="t_gt_xmlx">';
        html += result[i];
        html += '</td>';
        html += '<td   width="20%;id="gt_apply_amount" class="t_gt_xmlx">';
        html += touru;
        html += '万</td>';
        html += '<td   width="20%; id="gt_fact_amount" class="t_gt_xmlx">';
        html +=  Math.round(yfenhongs * 100)/100 ;
        html += '万</td>';
        html += '<td   width="20%; id="gt_confirm_amount" class="t_gt_xmlx">';
        html +=  Math.round(bili * 100)/100;
        html += '%</td>';
        html += '<td   width="20%; id="gt_int_mantime" class="t_gt_xmlx">';
        html += '<div id="zhankai1' + i + '" class="zhankai1"  value="1" onclick="zhankai(' + i + ')" style=" " ><img src="../img/gt_zk1.png?buildversion=2f8a796" style="width: 1.5em;height:1.5em;" />';
        html += '</div></td>';
        html += '</tr>';
        html += '<tr style="height:1px; "><td  ><div  style="display:none"  id="conten' + i + '"><span  id ="xiaoguo' + i + '" value="1"/>'
        for (var j = yfenhong.length - 1; j >= 0; j--) {
            if (yfenhong[j].p_name == result[i]) {
                html += '<table><tr>';
                html += '<td  width="20%; id="t_gt_xmlx" class="t_gt_xmlx">';
                html += '</td>';
                html += '<td   width="20%;id="gt_apply_amount" class="t_gt_xmlx">';
                html += '</td>';
                html += '<td   width="20%; id="gt_fact_amount" class="t_gt_xmlx">';
                var bonus_mount = yfenhong[j].bonus_mount == "" ? "" : yfenhong[j].bonus_mount;
                html += Math.round(bonus_mount * 100)/100 + '万';
                html += '</td>';
                html += '<td   width="20%; id="gt_confirm_amount" class="t_gt_xmlx">';
                html += yfenhong[j].rateMount == "" ? "" : yfenhong[j].rateMount;
                html += '</td>';
                html += '<td   width="20%; id="gt_int_mantime" class="t_gt_xmlx">';
                html += yfenhong[j].bonustime == undefined ? "" : yfenhong[j].bonustime;
                html += '</td>';
                html += '</tr></table>';
            }
        }
        html += '</div></td></tr>'

    }

    html += '<tr>';
    html += '<td id="t_gt_xmlx" class="t_gt_xmlx">';
    html += '合计';
    html += '</td>';
    // html += '<td id="gt_apply_amount" class="t_gt_xmlx">';
    // html += mounts + '万元';
    // html += '</td>';
    html += '<td id="gt_apply_amount" class="t_gt_xmlx">';
    html += '</td>';
    html += '<td id="gt_apply_amount" class="t_gt_xmlx">';
    html +=   Math.round(yufenhongnum * 100)/100  + '万';
    html += '</td>';
    // html += '<td id="gt_apply_amount" class="t_gt_xmlx">';
    //html += matchmounts + '万元';
    //  html += '</td>';
    //   html += '<td id="gt_confirm_amount" class="t_gt_xmlx">';
    // html += bonus_matchmounts + '万元</td>';
    html += '<td id="gt_fact_amount" class="t_gt_xmlx">';
    html += '</td>';
    html += '<td id="gt_int_mantime" class="t_gt_xmlx">';
    html += '</td>';
    html += '</tr>'
    html += '</table>';
    html += '</div>';
    html += '</li>';


    $("#gt_yufenhong #gt_yufenhonglistview").html(html);

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
