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
         minView:2,
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
});


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

    var url = "http://10.1.19.170";
    var token = null;

    $.ajax({
        url: (url + "/seeyon/rest/token"),
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
            NewAlert("token失败");
        }
    });


    return token;
}

/*提示框*/
function NewAlert(str) {
    console.log("触发提示框");
    var NewAlert = "";
    NewAlert += "<div  class=\"new_alert_hint col\" style=\"display: none;\">";
    NewAlert += "<div class=\"content\">";
    NewAlert += "<div class=\"text\">";
    NewAlert += " <div class=\"src_form_view_hint_txt\">提示</div>";
    NewAlert += "</div>";
    NewAlert += " <div class=\"message\">";
    NewAlert += " <div class=\"src_message_hint_txt\">" + str + "</div>";
    NewAlert += "</div>";
    NewAlert += "<div class=\"closes\" onclick=\"btnHidden(2)\">";
    NewAlert += "<div class=\"src__close\">关闭</div>";
    NewAlert += "</div>";
    NewAlert += "</div>";
    $(".New_alert").html(NewAlert);
    btnShow();
}

//弹出框
function TanAlert(DESCRIPTION, NAME, EXT_ATTR_1, startDate, endDate) {
    console.log(DESCRIPTION, NAME, EXT_ATTR_1, startDate, endDate)
    var start = startDate.substring(0, 16);
    var end = endDate.substring(0, 16);
    var Classalert = "";
    Classalert += "<div class=\"alert_content\" style=\"display: block;\">";
    Classalert += "<div class=\"alert_meeting\">";
    Classalert += "<div class=\"Theme\">主题:" + DESCRIPTION + "</div>";
    Classalert += "<div class=\"ApplyName\">申请人:" + NAME + "</div>";
    if (EXT_ATTR_1 == undefined) {
        Classalert += "<div class=\"ApplyHone\">电话:<a href='#'>'电话未填'</a></div>";
    } else {
        Classalert += "<div class=\"ApplyHone\">电话:<a href='#'>" + EXT_ATTR_1 + "</a></div>";
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

/*计时器隐藏提示框*/
function btnShow() {
    $(".new_alert_hint").css("display", "block");
    setTimeout(function () {
        $(".new_alert_hint").css("display", "none");
        console.log(" 3 秒")
    }, 3000);
}

function btnHidden(strThis) {
    console.log(strThis);
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
    var url = "http://10.1.19.170";
    var dateTime = document.getElementById("input_form_date").value;
    var inputSearch = document.getElementById("input-search").value;
    // var dateTime = "2018-11-06";
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
        console.log("当前:", Time);
        dateTime = Time;
    }
    if (inputSearch == "") {
        inputSearch = 3;
    }
    // dateTime = '2018-11-06';
    console.log("搜索框:", dateTime, inputSearch);

    $.ajax({
        url: (url + "/seeyon/rest/meeting/meetingroom/" + inputSearch + "/?token=" + token),
        type: "GET",
        dataType: "JSON",
        async: false,
        processData: false,
        success: function (datamr) {
            datamr.forEach(function (value, index) {
                mrId = datamr[index].ID;
                divContent += "<div class=\"tab-div-message\">";
                divContent += "<div class=\"tab-room-name\">";
                divContent += "<label class=\"label-th\" >" + datamr[index].NAME + "可容纳" + datamr[index].SEATCOUNT + "人</label>";
                divContent += "<br>";
                divContent += "<input type=\"hidden\" value=" + datamr[index].ID + ">";
                divContent += "</div>";
                divContent += "<div class=\"tab-datetime\">";
                divContent += "<table border=\"1\" id=" + datamr[index].ID + ">";
                divContent += "<tr>";
                $.ajax({
                    url: (url + "/seeyon/rest/meeting/meetoingroomapp/" + datamr[index].ID + "/" + dateTime + "/?token=" + token),
                    type: "GET",
                    dataType: "JSON",
                    async: false,
                    processData: false,
                    success: function (datamra) {
                        var result = [];
                        for (var i = 0; i < datamr.length; i++) {
                            var obj = datamr[i];
                            var ID = obj.ID;
                            var isExist = true;
                            for (var j = 0; j < datamra.length; j++) {
                                var aj = datamra[j];
                                var meetingroomid = aj.MEETINGROOMID;
                                if (meetingroomid == ID) {
                                    for (var k = 0; k < datamra.length; k++) {
                                        var startDate = datamra[k].MRPSTARTDATETIME;
                                        var endDate = datamra[k].MRPENDDATETIME;
                                        var start = startDate.substring(10, 16);
                                        var end = endDate.substring(10, 16);
                                        divContent += "<td class=\"tbody-td\"id=" + datamra[k].MEETINGROOMID + " onclick=\"TanAlert('" + datamra[k].DESCRIPTION + "','" + datamra[k].NAME + "'," + datamra[k].FIELD0010 + ",'" + startDate + "','" + endDate + "')\">" + datamra[k].DESCRIPTION + "<br/>" + start + "-" + end + "</td>";
                                    }
                                    isExist = false;
                                    break;
                                }
                            }
                            if (!isExist) {
                                result.push(datamra[j]);

                            }
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        console.log("获取错误[ ERROR ]" + textStatus + ":" + errorThrown);
                        NewAlert("获取错误");
                    }
                });
                divContent += "</tr>";
                divContent += "</table>";
                divContent += "</div>";
                divContent += "</div>";
                $(".content").html(divContent);
            })
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log("获取错误[ ERROR ]" + textStatus + ":" + errorThrown);
            NewAlert("获取错误..");
        }
    })

}

// function xx() {
//     var y = document.getElementById("input-date").value;
//     console.log(y);
// }

// function open_win() {
//     window.open("bootstrap-Datetimepicker.html", "_blank", "top=100,left=100,width=100,height=100,menubar=yes,scrollbars=no,toolbar=yes,status=yes");
// }



