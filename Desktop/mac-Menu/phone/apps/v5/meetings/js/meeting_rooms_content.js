var d = new Date();
$(function () {
    search();
    // var dateTime = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    getFormat();
    //date初始化值
    // document.getElementById("input-date").value = format;
    $(".form_date").datetimepicker({
        format: 'yyyy-mm-dd',
        language: 'zh-CN',
        weekStart: 1,
        todayBtn: true,
        autoclose: true,
        todayHighlight: 1,
        startView: 2,//开始选择月
        minView: 2,
        forceParse: 0,
        keyboardNavigation: true,
        // startDate: new Date(),
        initialDate: new Date(),
        clearBtn: true,
        // daysOfWeekDisabled:[0,6],
        weekStart: 0,
        orientaion: "bottom left"
    });
    $('.form_date').datetimepicker("setDate", new Date());

})
// });
var urlPath = "http://oamobile.agile.com.cn:8088";
// var urlPath = "http://10.20.19.70";
// var urlPath = "http://10.1.19.170";

//获取当前时间并且格式化
function getFormat() {
    format = "";
    var nTime = new Date();
    format += nTime.getFullYear() + "-";
    format += (nTime.getMonth() + 1) < 10 ? "0" + (nTime.getMonth() + 1) : (nTime.getMonth() + 1);
    format += "-";
    format += nTime.getDate() < 10 ? "0" + (nTime.getDate()) : (nTime.getDate());
    format += "T";
    format += nTime.getHours() < 10 ? "0" + (nTime.getHours()) : (nTime.getHours());
    format += ":";
    format += nTime.getMinutes() < 10 ? "0" + (nTime.getMinutes()) : (nTime.getMinutes());
    format += ":00";
}

//获取 token
function getToken(username, password) {

    var token = null;

    $.ajax({
        url: (urlPath + "/seeyon/rest/token"),
        type: "POST",
        dataType: "json",
        async: false,
        data: '{"userName":"' + username + '", "password":"' + password + '"}"}',
        processData: false,
        headers: {"Accept": "application/json", "Content-Type": "application/json"},
        success: function (data) {
            token = data.id;

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log("获取 TOKEN 失败！");
            hint("token获取失败");
        }
    });


    return token;
}


//弹出框
function TanAlert(DESCRIPTION, NAME, EXT_ATTR_1, startDate, endDate) {
    var start = startDate.substring(0, 16);
    var end = endDate.substring(0, 16);
    var Classalert = "";
    Classalert+="<div class=\"div-content-alert\" style=\"display: block;\">";
    Classalert+="<div class=\"Theme\" style=\"overflow-x:hidden;overflow-y:scroll\">主题:"+DESCRIPTION+"</div>";
    // Classalert += "<div class=\"ApplyName\">申请人:" + NAME + "</div>";
    if (EXT_ATTR_1 == undefined) {
        Classalert += "<div class=\"ApplyHone\">电话:<a href='#'>'电话未填'</a></div>";
    } else {
        Classalert += "<div class=\"ApplyHone\">电话:<a id=\"telPhone\" href='tel:" + EXT_ATTR_1 + "'>" + EXT_ATTR_1 + "</a></div>";
    }
    Classalert += "<div class=\"meetingDateTime\">会议时间:<br/>" + start + "<br/>" + end + "</div>";
    Classalert += "</div>";
    Classalert += "<div class=\"div_close\" onclick=\"btnHidden(3)\">";
    Classalert += "<div class=\"alert_closes\">关闭</div>";
    Classalert += "</div>";
    Classalert += "</div>";
    $(".alert").css("display", "block");
    $(".alert").html(Classalert);
}

// /*计时器隐藏提示框*/
// function btnShow() {
//     $(".new_alert_hint").css("display", "block");
//     setTimeout(function () {
//         $(".new_alert_hint").css("display", "none");
//         console.log(" 3 秒")
//     }, 3000);
// }

function btnHidden(strThis) {
    if (strThis == 1) {
        $("#src_form_view_hint").css("display", "none");
    } else if (strThis == 2) {
        $(".New_alert").css("display", "none");
    } else if (strThis == 3) {
        $(".alert").css("display", "none");
    }

}

function search() {
    var mrId = 0;
    var divContent = "";
    var token = getToken("rest", "123456");
    var dateTime = document.getElementById("input_form_date").value;
    var inputSearch = document.getElementById("input-search").value;
    // var dateTime = "2019-10-08";
    if (dateTime == "") {
        //获取当前时间 2019-09-09 格式
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }
        var Time = year + "-" + month + "-" + day;
        // console.log("当前时间:", Time);
        dateTime = Time;
    }
    if (inputSearch == "") {
        inputSearch = '3';
    }
    // dateTime = '2018-11-06';
    console.log("搜索框:", dateTime, inputSearch);


    $.ajax({
        url: (urlPath + "/seeyon/rest/meeting/list/" + inputSearch + "/" + dateTime + "/?token=" + token),
        // url: "http://localhost:8080/Result_war/rest/meeting/list/"+inputSearch+"/"+dateTime+"",
        type: "GET",
        dataType: "JSON",
        async: false,
        processData: false,
        success: function (datamr) {
            datamr.forEach(function (value, index) {
                divContent += "<div class=\"tab-div-message\">";
                divContent += "<div class=\"tab-room-name\">";
                divContent += "<label class=\"label-th\" >" + datamr[index].meeting_name + "可容纳" + datamr[index].seatCount + "人</label>";
                divContent += "<br>";
                divContent += "<input type=\"hidden\" value=" + datamr[index].roomId + ">";
                divContent += "</div>";
                divContent += "<div class=\"tab-datetime\">";
                divContent += "<table border=\"1\" id=" + datamr[index].roomId + ">";
                divContent += "<tr>";
                if(datamr[index].message.length==0){
                    divContent += "<td class=\"tbody-td-null\"><img id=\"img-null\" src=\"/seeyon/m3/apps/v5/meetings/img/null.png\" ><div class=\"label-null\"><label>暂无申请记录</label></div></td>";
                }else{
                    for (var i = 0; i < datamr[index].message.length; i++) {
                        var start = datamr[index].message[i].MRPSTARTDATETIME.substring(10, 16);
                        var end = datamr[index].message[i].MRPENDDATETIME.substring(10, 16);
                        divContent += "<td class=\"tbody-td\"id=" + datamr[index].message.MEETINGROOMID + " onclick=\"TanAlert('" + datamr[index].message[i].FIELD0005 + "','" + datamr[index].message[i].NAME + "'," + datamr[index].message[i].FIELD0010 + ",'" + datamr[index].message[i].MRPSTARTDATETIME + "','" + datamr[index].message[i].MRPENDDATETIME + "')\">" + datamr[index].message[i].FIELD0005 + "<br/>" + start + "-" + end + "</td>";
                    }
                }

                divContent += "</tr>";
                divContent += "</table>";
                divContent += "</div>";
                divContent += "</div>";
                $(".content").html(divContent);
            })
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log("获取错误[ ERROR ]" + textStatus + ":" + errorThrown);
            hint("获取错误..");
        }
    })

}

/*提示框*/
function hint(str) {
    var hintBox = document.createElement("div");
    hintBox.id = "hintBox";
    hintBox.style.position = "fixed";
    hintBox.style.width = "180px";
    hintBox.style.background = "#555555";
    hintBox.style.border = "1px solid grey";
    hintBox.style.left = "50%";
    hintBox.style.top = "50%";
    hintBox.style.transform = "translate(-50%, -50%)";
    hintBox.style.textAlign = "center";
    hintBox.style.zIndex = "100";
    hintBox.style.opacity = "0.9";
    hintBox.style.borderRadius = "8px";
    hintBox.style.float = "left";
    var strHtml = "";
    strHtml += '<div id="content">' + str + '</div>';
    strHtml += '<div id="certain"><div id="btn" type="button" value="确定" onclick="hide()"  >确定</div></div>';
    hintBox.innerHTML = strHtml;
    $("#hint").html(hintBox);
    var content = document.getElementById("content");
    content.style.width = "180px";
    content.style.height = "80px";
    content.style.margin = "5";
    content.style.background = "#555555";
    content.style.fontSize = "14px";
    content.style.borderRadius = "8px";
    content.style.display = "table";
    content.style.display = "table-cell";
    content.style.verticalAlign = "middle";
    content.style.color = "#fff";
    var certain = document.getElementById("certain");
    certain.style.position = "relative";
    certain.style.float = "left";
    certain.style.width = "180px";
    certain.style.height = "23px";
    certain.style.borderRadius = "8px";
    var btn = document.getElementById("btn");
    btn.style.background = "#555555";
    btn.style.color = "#fff";
    btn.style.borderRadius = "8px";
};

function hide() {
    $("#hintBox").css("display", "none");
}

// function xx() {
//     var y = document.getElementById("input-date").value;
//     console.log(y);
// }

// function open_win() {
//     window.open("bootstrap-Datetimepicker.html", "_blank", "top=100,left=100,width=100,height=100,menubar=yes,scrollbars=no,toolbar=yes,status=yes");
// }



