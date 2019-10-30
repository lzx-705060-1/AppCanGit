cmp.ready(function() {
    var serviceUrl = cmp.storage.get('serviceUrl');
    var loginname = cmp.storage.get('loginname');
    var password = cmp.storage.get('password');
    var obj = new Object();
    obj.url = serviceUrl + "/servlet/PublicServiceServlet";
    obj.data = {
        'message_id' : 'gtpt',
        'branch' : 'home',
        'loginname' : loginname,
        //'password' : password
    };
    obj.successFun = 'getGtApply0Data';
    ajaxJson_v1(obj);
    //  getGtApply0Data();
});

//获取认购数据
function getGtApply0Data(data) {
    var gentou = data.gtxq.DATA.rows;
    var fanbenmx = data.fanben.DATA.rows;
    console.log(gentou)
    var html = '';
    var touru = 0;
    var peizi = 0;
    var tcsy=data.tcsy.TCSY//退出收益
    if(tcsy==null||tcsy==""){
        tcsy=0
    }else{
        tcsy=Number(tcsy)
    }
    var fanben = 0;
    var yufenhong = 0;
    for (var i = 0; i < gentou.length; i++) {

        if(gentou[i].realamountTotal!=null&&gentou[i].realamountTotal!=undefined&&gentou[i].realamountTotal!=''){
            touru += Number(gentou[i].realamountTotal);
            peizi += Number(gentou[i].matchMount);
        }

        if (gentou[i].status == '认购中' || gentou[i].status == '额度确认中' || gentou[i].status == '实缴中') {

            html += '<div class="fgt"></div>';
            if (gentou[i].p_type == '强制' || gentou[i].p_type == '强制(试用期)') {
                html += '<div style="width: 100%;height: 2.3em;"><img src="../img/sanjiao-r.png?buildversion=358b41b" style="width: 1.5em;height: 1.5em;" />';
            } else {
                html += '<div style="width: 100%;height: 2.3em;"><img src="../img/sanjiao-g.png?buildversion=7e0255d" style="width: 1.5em;height: 1.5em;" />';
            }
            html += '<span style="line-height: 1.5em;position: absolute;font-size: 0.8em;margin-top: 0.5em;font-weight:bold;">' + gentou[i].company + '-' + gentou[i].projectname + '</span>';
            html += '<span style="line-height: 1.5em;position: absolute;margin-left: 70%;font-size: 0.8em;margin-top: 0.5em;width: 5em;text-align: center;color: #F78839;  font-weight: bold;font-family: "微软雅黑";">' + gentou[i].status + '</span>'

            var filename = gentou[i].filename;
            var projectid = gentou[i].p_codeFile;
            var fileid = gentou[i].fileid;
            var fileclass = gentou[i].fileclass;

            if (filename != undefined && filename != null) {
                filename = filename.replace(".pdf", "");
            }

            /* html += '<span id="gt_status"  class="gt_status" >';
             if ('2' == fileclass && undefined != filename && null != filename && projectid && fileid) {
             html += '<span  style="line-height: 2em;position: absolute;margin-left: 80%;background-color: rgb(255, 164, 116);border-radius: 1em;padding-left: 0.5em;padding-right: 0.5em;font-size: 0.6em;"  id="gt_p_doc" class="gt_p_doc" data-docRealName="' + gentou[i].filename + '" data-docShowName="' + filename + '" data-gt_projectId="' + projectid + '"  data-gt_fileid="'+fileid+'">';
             html += '<span id="gt_filename" class="gt_filename" >';
             html += '项目月报';
             html += '</span>';
             html += '</span>&nbsp;&nbsp;';
             }*/
            html += ' </div>';

            html += '<div class="mx" style="color: rgb(250, 76, 0);">';
            html += '<div class="xmmx">项目类型</div>';
            html += '<div class="xmmx">认购金额</div>';
            html += '<div class="xmmx">确认金额</div>';
            html += '<div class="xmmx"><div style="display:none">其中配资金额</div></div>';
            html += '</div>';
            html += '<div class="mx">';
            html += '<div class="xmmx">' + gentou[i].projectType + '</div>';
            var realamount = 0;
            if (gentou[i].applyamount != undefined && gentou[i].applyamount != '' && gentou[i].applyamount != ' ') {
                realamount = gentou[i].applyamount;
            }

            html += '<div class="xmmx">' + realamount + '</div>';
            var confirmamount = 0;
            if (gentou[i].confirmamount != undefined && gentou[i].confirmamount != '' && gentou[i].confirmamount != ' ') {
                confirmamount = gentou[i].confirmamount;
            }

            html += '<div class="xmmx">' + confirmamount + '</div>';

            var matchMount = 0;
            if (gentou[i].matchMount != undefined && gentou[i].matchMount != '' && gentou[i].matchMount != ' ') {
                matchMount = gentou[i].matchMount;
            }
            html += '<div class="xmmx"></div>';
            html += '</div>';
        } else if(gentou[i].status == '退出中' || gentou[i].status == '已退出') {
            html += '<div class="fgt"></div>';
            if (gentou[i].p_type == '强制' || gentou[i].p_type == '强制(试用期)') {
                html += '<div style="width: 100%;height: 2.3em;"><img src="../img/sanjiao-r.png?buildversion=358b41b" style="width: 1.5em;height: 1.5em;" />';
            } else if (gentou[i].p_type == '自愿') {
                html += '<div style="width: 100%;height: 2.3em;"><img src="../img/sanjiao-g.png?buildversion=7e0255d" style="width: 1.5em;height: 1.5em;" />';
            }
            html += '<span style="line-height: 1.5em;position: absolute;font-size: 0.8em;margin-top: 0.5em;font-weight:bold;">' + gentou[i].company + '-' + gentou[i].projectname + '</span>';
            html += '<span style="line-height: 1.5em;position: absolute;margin-left: 70%;font-size: 0.8em;margin-top: 0.5em;width: 5em;text-align: center;color: #666;  font-weight: bold;font-family: "微软雅黑"; ">' + gentou[i].status + '</span>'


            var filename = gentou[i].filename;
            var projectid = gentou[i].p_codeFile;
            var fileid = gentou[i].fileid;
            var fileclass = gentou[i].fileclass;

            if (filename != undefined && filename != null) {
                filename = filename.replace(".pdf", "");
            }

            /* html += '<span id="gt_status"  class="gt_status" >';
             if ('2' == fileclass && undefined != filename && null != filename && projectid && fileid) {
             html += '<span  style="line-height: 2em;position: absolute;margin-left: 80%;background-color: rgb(255, 164, 116);border-radius: 1em;padding-left: 0.5em;padding-right: 0.5em;font-size: 0.6em;"  id="gt_p_doc" class="gt_p_doc" data-docRealName="' + gentou[i].filename + '" data-docShowName="' + filename + '" data-gt_projectId="' + projectid + '"  data-gt_fileid="'+fileid+'">';
             html += '<span id="gt_filename" class="gt_filename" >';
             html += '项目月报';
             html += '</span>';
             html += '</span>&nbsp;&nbsp;';
             }*/
            html += ' </div>';

            html += '<div class="mx" style="color: rgb(250, 76, 0);">';
            html += '<div class="xmmx">项目类型</div>';
            html += '<div class="xmmx">投入金额</div>';
            html += '<div class="xmmx">累计返本</div>';
            html += ' <div class="xmmx">累计预分红</div>';
            html += '<div class="xmmx"><div style="display:none">配资金额</div></div>';
            html += '</div>';
            html += '<div class="mx" style="border-bottom: 1px rgb(219, 210, 210) solid;">';
            html += '<div class="xmmx" >' + gentou[i].projectType + '</div>';
            var realamount = gentou[i].realamountTotal = undefined ? "-" : gentou[i].realamountTotal;
            html += '<div class="xmmx" >' + realamount + '</div>';
            var releaseamount = gentou[i].releaseamount = undefined ? "-" : gentou[i].releaseamount;
            html += '<div class="xmmx" >' + releaseamount + '</div>';
            var devidendamount = gentou[i].devidendamount = undefined ? "0" : gentou[i].devidendamount;
            html += '<div class="xmmx">' + devidendamount + '</div>';
            html += '</div>';
            html += '<div class="mx" style="color: rgb(250, 76, 0); ">';
            html += '  <div class="xmmx">税后退出收益</div>';
            html += '  <div class="xmmx">返本比例</div>';
            html += '<div class="xmmx">预分红比例</div>';
            html += '<div class="xmmx">跟投收益率</div>';
            html += '<div class="xmmx" style="border-bottom:none;"></div>';
            html += '</div>';
            html += '<div class="mx">';
            var taxafter = gentou[i].taxafter = undefined ? "0" : gentou[i].taxafter;
            html += '<div class="xmmx">' + taxafter + '</div>';
            var fanbenbl = 0;
            for (var j = 0; j < fanbenmx.length; j++) {
                if (fanbenmx[j].p_name == gentou[i].projectname) {
                    var proportion = fanbenmx[j].proportion;
                    //返本比例
                    proportion = proportion.substring(0, proportion.length);
                    fanbenbl += Number(proportion);
                }
            }
            html += ' <div class="xmmx">' + fanbenbl + '%</div>';
            var huibao = 0;
            if (devidendamount != 0) {

                var zong = Number(realamount) + Number(matchMount)
                huibao = devidendamount / zong
                console.log("-" + huibao);
                huibao = Math.round(huibao * 1000)/10
                console.log("-" + huibao);
            }
            html += ' <div class="xmmx">' + huibao + '%</div>';
            var shouyil = 0;
            shouyil = ((devidendamount + taxafter)/realamount*100).toFixed(2);
            html += '<div class="xmmx" style="border-bottom:none;">' + shouyil + '%</div>';
            html += '</div>';


            fanben += Number(releaseamount);
            yufenhong += Number(devidendamount);
        } else{
            html += '<div class="fgt"></div>';
            if (gentou[i].p_type == '强制' || gentou[i].p_type == '强制(试用期)') {
                html += '<div style="width: 100%;height: 2.3em;"><img src="../img/sanjiao-r.png?buildversion=358b41b" style="width: 1.5em;height: 1.5em;" />';
            } else if (gentou[i].p_type == '自愿') {
                html += '<div style="width: 100%;height: 2.3em;"><img src="../img/sanjiao-g.png?buildversion=7e0255d" style="width: 1.5em;height: 1.5em;" />';
            }
            html += '<span style="line-height: 1.5em;position: absolute;font-size: 0.8em;margin-top: 0.5em;font-weight:bold;">' + gentou[i].company + '-' + gentou[i].projectname + '</span>';
            html += '<span style="line-height: 1.5em;position: absolute;margin-left: 70%;font-size: 0.8em;margin-top: 0.5em;width: 5em;text-align: center;color: #3958F7;  font-weight: bold;font-family: "微软雅黑"; ">' + gentou[i].status + '</span>'


            var filename = gentou[i].filename;
            var projectid = gentou[i].p_codeFile;
            var fileid = gentou[i].fileid;
            var fileclass = gentou[i].fileclass;

            if (filename != undefined && filename != null) {
                filename = filename.replace(".pdf", "");
            }

            /* html += '<span id="gt_status"  class="gt_status" >';
             if ('2' == fileclass && undefined != filename && null != filename && projectid && fileid) {
             html += '<span  style="line-height: 2em;position: absolute;margin-left: 80%;background-color: rgb(255, 164, 116);border-radius: 1em;padding-left: 0.5em;padding-right: 0.5em;font-size: 0.6em;"  id="gt_p_doc" class="gt_p_doc" data-docRealName="' + gentou[i].filename + '" data-docShowName="' + filename + '" data-gt_projectId="' + projectid + '"  data-gt_fileid="'+fileid+'">';
             html += '<span id="gt_filename" class="gt_filename" >';
             html += '项目月报';
             html += '</span>';
             html += '</span>&nbsp;&nbsp;';
             }*/
            html += ' </div>';

            html += '<div class="mx" style="color: rgb(250, 76, 0);">';
            html += '<div class="xmmx">项目类型</div>';
            html += '<div class="xmmx">投入金额</div>';
            html += '<div class="xmmx">累计返本</div>';
            html += '<div class="xmmx"><div style="display:none">配资金额</div></div>';
            html += '</div>';
            html += '<div class="mx" style="border-bottom: 1px rgb(219, 210, 210) solid;">';
            html += '<div class="xmmx" >' + gentou[i].projectType + '</div>';
            var realamount = gentou[i].realamountTotal = undefined ? "-" : gentou[i].realamountTotal;
            html += '<div class="xmmx" >' + realamount + '</div>';
            var releaseamount = gentou[i].releaseamount = undefined ? "-" : gentou[i].releaseamount;
            html += '<div class="xmmx" >' + releaseamount + '</div>';
            var matchMount = gentou[i].matchMount = undefined ? "-" : gentou[i].matchMount;
            html += '<div class="xmmx" ></div>';
            html += '</div>';
            html += '<div class="mx" style="color: rgb(250, 76, 0); ">';
            html += ' <div class="xmmx">累计预分红</div>';
            html += '  <div class="xmmx">返本比例</div>';
            html += '<div class="xmmx">预分红比例</div>';
            html += '<div class="xmmx" style="border-bottom:none;"></div>';
            html += '</div>';
            html += '<div class="mx">';
            var devidendamount = gentou[i].devidendamount = undefined ? "0" : gentou[i].devidendamount;
            html += '<div class="xmmx">' + devidendamount + '</div>';
            var fanbenbl = 0;
            for (var j = 0; j < fanbenmx.length; j++) {
                if (fanbenmx[j].p_name == gentou[i].projectname) {
                    var proportion = fanbenmx[j].proportion;
                    //返本比例
                    proportion = proportion.substring(0, proportion.length);
                    fanbenbl += Number(proportion);
                }
            }
            html += ' <div class="xmmx">' + fanbenbl + '%</div>';
            var huibao = 0;
            if (devidendamount != 0) {

                var zong = Number(realamount) + Number(matchMount)
                huibao = devidendamount / zong
                console.log("-" + huibao);
                huibao = Math.round(huibao * 1000)/10
                console.log("-" + huibao);
            }
            html += ' <div class="xmmx">' + huibao + '%</div>';
            html += '<div class="xmmx" style="border-bottom:none;"></div>';
            html += '</div>';


            fanben += Number(releaseamount);
            yufenhong += Number(devidendamount);
        }
    }

    var fbbl = 0;
    var sybl = 0;

    if (touru != 0 && fanben != 0) {
        fbbl = (fanben / touru)
        fbbl = Math.round(fbbl * 100)
    }
    if (touru != 0) {
        sybl = (yufenhong / touru)
        sybl = Math.round(sybl * 1000)/10
    }

    $("#content").html(html);

    $("#touru").text(touru.toFixed(2));
    $("#peizi").text(peizi.toFixed(2));
    $("#fanben").text(fanben.toFixed(2));
    $("#yufenhong").text(yufenhong.toFixed(2));
    $("#fbbl").text(fbbl);
    $("#sybl").text(sybl);
    $("#tcsy").text(tcsy.toFixed(2));
}

//月报
$("#content").on('tap', ".gt_p_doc", function(object) {
    console.log(object);
    var btn = $(object.currentTarget);
    var docRealName = btn.attr('data-docRealName');
    var docShowName = btn.attr('data-docShowName');
    var projectId = btn.attr('data-gt_projectId');
    var fileid = btn.attr('data-gt_fileid');
    console.log("docRealName:" + docRealName);
    console.log("docShowName:" + docShowName);
    console.log("projectId:" + projectId);
    console.log("fileid:" + fileid);
    if (docRealName) {
        cmp.storage.save('gtpt_docRealName', docRealName);
        cmp.storage.save('gtpt_docShowName', docShowName);
        cmp.storage.save('gtpt_projectId', projectId);
        cmp.storage.save('gtpt_fileid', fileid);
        uexWindow.evaluateScript("gtpt_menu", 0, "doScript(appcan.window.open('gtpt_docDetail', 'gtpt_docDetail.html', 10, 4))");
    }
});

var timeOutEvent = 0;
/*  $(function() {
      $("#fanbenbl").on({
          touchstart : function(e) {
              timeOutEvent = setTimeout("longPress(1)", 500);
              e.preventDefault();
          },
          touchmove : function() {
              clearTimeout(timeOutEvent);
              timeOutEvent = 0;
          },
          touchend : function() {
              clearTimeout(timeOutEvent);
              if (timeOutEvent != 0) {
              }
              return false;
          }
      })

      $("#yufenhongbl").on({
          touchstart : function(e) {
              timeOutEvent = setTimeout("longPress(2)", 500);
              e.preventDefault();
          },
          touchmove : function() {
              clearTimeout(timeOutEvent);
              timeOutEvent = 0;
          },
          touchend : function() {
              clearTimeout(timeOutEvent);
              if (timeOutEvent != 0) {
              }
              return false;
          }
      })
  });*/
$("#fanbenbl").on('tap',function(){
    longPress(1);
});

$("#yufenhongbl").on('tap',function(){
    longPress(2);
});

var timeEvent = 0;
function longPress(idx) {
    timeOutEvent = 0;
    if (idx == 1) {
        $('#tk1').css("display", "");
        $('#tk2').css("display", "none");
        timeEvent = setTimeout("remove(1)", 2000);
    } else {
        $('#tk2').css("display", "");
        $('#tk1').css("display", "none");
        timeEvent = setTimeout("remove(2)", 2000);
    }
}


function remove(idx) {
    timeEvent = 0;
    if (idx == 1) {
        $('#tk1').css("display", "none");
    } else {
        $('#tk2').css("display", "none");
    }
    clearTimeout(timeOutEvent);
}

