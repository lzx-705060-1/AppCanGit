cmp.ready(function() {
    var serviceUrl = cmp.storage.get('serviceUrl');
    var loginname = cmp.storage.get('loginname');
    var password = cmp.storage.get('password');
    var tcsy = cmp.storage.get('tcsy');
    var obj = new Object();
    obj.url = serviceUrl + "/servlet/PublicServiceServlet";
    obj.data = {
        'message_id' : 'gtpt',
        'branch' : 'myshouyi',
        'loginname' : loginname,
        //'password' : password
    };
    obj.successFun = 'apply0DataSucess';
    ajaxJson_v1(obj);

    var yfenhong = cmp.storage.get('yufenhong');
    yfenhong = JSON.parse(yfenhong)

    var mainArr = cmp.storage.get('mainArr');
    mainArr = JSON.parse(mainArr);

    console.log(yfenhong);
    console.log(mainArr);
    console.log(tcsy);

    var fenhongnum =0;
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
    $("#zongfenhong").css('width', tcsy / tourunum * 10 + 'em');
    //$("#zongpeizijine").css('width', matchmounts / mounts * 10 + 'em');
    //$("#zongpeizifenhong").css('width', bonus_matchmounts / mounts * 10 + 'em');

    if (tourunum != 0) {
        $("#zongtourunum").html(Math.round(tourunum * 100)/100 + '万');
    }
    if (tcsy != 0) {
        $("#fenhong").html(  Math.round(tcsy * 100)/100 + '万');
    }

})

function apply0DataSucess(data){
    var wdtcsy = data.wdtcsy.DATA.rows;
    cmp.storage.save('wdtcsy', wdtcsy);
    console.log(wdtcsy);

    var html = '';
    html += '<li>';
    html += '<div>';
    html += '<table id="gt_table" cellspacing="0" class="gt_table" width="100%">';
    //   html+="<thead>";
    html += '<tr style="background-color:#034373;color:#ffffff;">';
    html += '<td width="18%" id="t_gt_xmlx" class="gt_header">项目名称</td>';
    //  html += '<td width="12%" id="t_gt_apply_amount" class="gt_header">跟投份额</td>';
    html += '<td width="16.5%" id="t_gt_confirm_amount" class="gt_header">投入金额</td>';
    html += '<td width="14%" id="t_gt_fact_amount" class="gt_header">预分红</td>';
    html += '<td width="16.5%" id="t_gt_fact_amount" class="gt_header">退出收益</td>';
    //  html += '<td width="14%" id="t_gt_int_mantime" class="gt_header">配资金额</td>';
    // html += '<td width="12%" id="t_gt_apply_amount" class="gt_header">配资分红</td>';
    html += '<td width="21%" id="t_gt_confirm_amount" class="gt_header">跟投收益率</td>';
    html += '<td width="18%" id="t_gt_fact_amount" class="gt_header">发放时间</td>';
    html += '</tr>';
    //     html+="</thead>";
    var mounts = 0;//投入
    var bonus_mounts = 0;//预分红
    var matchmounts = 0;
    var bonus_matchmounts = 0;
    var devidendamounts = 0;


    //  html+=" <tbody>";
    for (var i = 0; i < wdtcsy.length; i++) {
        html += '<tr>';
        html += '<td  style="text-align: left; id="gt_apply_amount"  width="18%" class="t_gt_xmlx">';
        html += wdtcsy[i].projectname == undefined ? "-" : wdtcsy[i].projectname;
        html += '</td>';
        var amount = wdtcsy[i].amount == undefined ? "-" : wdtcsy[i].amount
        mounts += Number(amount);
        html += '<td id="gt_confirm_amount"  width="14%" class="t_gt_xmlx">';
        html += wdtcsy[i].amount == undefined ? "-" : wdtcsy[i].amount + '万';
        html += '</td>';
        html += '<td id="gt_fact_amount" width="14%"  class="t_gt_xmlx">';
        html += wdtcsy[i].devidendamount == undefined ? "-" : wdtcsy[i].devidendamount + '万';
        var devidendamount = wdtcsy[i].devidendamount == undefined ? "-" : wdtcsy[i].devidendamount
        devidendamounts += Number(devidendamount);
        html += '</td>';
        html += '<td id="gt_fact_amount" width="16.5%"  class="t_gt_xmlx">';
        var taxafter = wdtcsy[i].taxafter == undefined ? "-" : wdtcsy[i].taxafter
        bonus_mounts += Number(taxafter);
        html += Math.round(taxafter * 100)/100+ '万';
        html += '</td>';
        html += '<td id="gt_fact_amount" width="16.5%"  class="t_gt_xmlx">';
        var rateMount = wdtcsy[i].rateMount == undefined ? "-" : wdtcsy[i].rateMount
        html += Math.round(rateMount * 100)/100+ '%';
        html += '</td>';
        html += '<td id="gt_apply_amount" width="18%" class="t_gt_xmlx">';
        html += wdtcsy[i].exittime == undefined ? "-" : wdtcsy[i].exittime;
        html += '</td>';
        html += '</tr>'
    }
    html += '<tr>';
    html += '<td id="t_gt_xmlx" width="20%" class="t_gt_xmlx">';
    html += '合计';
    html += '</td>';
    html += '<td id="gt_apply_amount" width="15%" class="t_gt_xmlx">';
    html += Math.round(mounts * 100)/100  + '万';
    html += '</td>';
    html += '<td id="gt_apply_amount" width="15%" class="t_gt_xmlx">';
    html += Math.round(devidendamounts * 100)/100  + '万';
    html += '</td>';
    html += '<td id="gt_fact_amount" width="16.5%" class="t_gt_xmlx">';
    html += Math.round(bonus_mounts * 100)/100  + '万';
    html += '</td>';
    html += '<td id="gt_int_mantime" width="21%" class="t_gt_xmlx">';
    html += '</td>';
    html += '<td id="gt_int_mantime" width="18%" class="t_gt_xmlx">';
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
        'branch' : 'myshouyi',
        "k2" : k2,
        'loginname' : loginname,
        //'password' : password
    };
    obj2.successFun = 'apply0DataSucess';
    ajaxJson_v1(obj2);

}
