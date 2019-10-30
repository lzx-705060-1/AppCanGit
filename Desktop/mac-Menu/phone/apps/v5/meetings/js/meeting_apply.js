//公共
$(function () {
    var tk = window.localStorage.CMP_V5_TOKEN;
    tk = tk != undefined ? tk : '';
    // tk = 'f3f8fd7e-3bf8-4130-871a-73d1587f1723';
    var header = {
        "Accept": "application/json; charset=utf-8",
        "Accept-Language": "zh-CN",
        "Content-Type": "application/json; charset=utf-8",
        "Cookie": "JSESSIONID=",
        "option.n_a_s": "1",
        "token": tk
    }
    cmp.ajax({
        type: "POST",
        data: "",
        url: cmp.seeyonbasepath + '/rest/oa3/revert/queryLoginUserInfo',
        async: false,
        headers: header,
        dataType: "html",
        success: function (r, textStatus, jqXHR) {
            if (r && r != "") {
                localStorage.setItem("meeting_loginname", r);
            }
        },
        error: function (r) {
            console.log(JSON.stringify(r))
        }
    });
    // localStorage.setItem("meeting_loginname", "A108248")
    // localStorage.setItem("meeting_loginname", "10001")
    $("#input-apply-hone").bind("input propertychange", function (event) {
        var phone = $("#input-apply-hone").val();
        var re = /^[0-9]+.?[0-9]*/;
        if (!re.test(phone)) {
            hint("电话必须是数字");
            document.getElementById("input-apply-hone").value = "";
        }

    });
    $("#input-chuxi").bind("input propertychange", function (event) {
        var chuxi = $("#input-chuxi").val();
        var re = /^[0-9]+.?[0-9]*/;
        if (!re.test(chuxi)) {
            hint("人数必须是数字")
            document.getElementById("input-chuxi").value = "";
        }
    });
    var cli = localStorage.getItem('click');
    if (cli == 1) {
        $("#src_form_view_hint").remove();
    }

    // document.getElementById("input-apply-hone").value = localStorage.getItem("phone");


    var future;
    $(".form_date2").datetimepicker({
        format: 'yyyy-mm-dd hh:ii',
        language: 'zh-CN',
        weekStart: 1,
        todayBtn: true,
        autoclose: true,
        todayHighlight: 1,
        startView: 2,//开始选择月
        minView: 0,
        forceParse: 0,
        keyboardNavigation: true,
        startDate: new Date(),
        initialDate: new Date(),
        clearBtn: true,
        // daysOfWeekDisabled:[0,6],
        weekStart: 0,
        orientaion: "bottom left"
    }).on("changeDate", function () {
        var startTime = document.getElementById("input-start").value;
        localStorage.setItem("startTime", startTime);
    });

    $(".form_date3").datetimepicker({
        format: 'yyyy-mm-dd hh:ii',
        language: 'zh-CN',
        weekStart: 1,
        todayBtn: true,
        autoclose: true,
        todayHighlight: 1,
        startView: 2,//开始选择月
        minView: 0,
        forceParse: 0,
        keyboardNavigation: true,
        startDate: new Date(),
        initialDate: new Date(),
        clearBtn: true,
        // daysOfWeekDisabled:[0,6],
        weekStart: 0,
        orientaion: "bottom left"
    }).on("changeDate", function () {
        var endTime = document.getElementById("input-end").value;
        localStorage.setItem("endTime", endTime);
    });
    $('.form_date2').datetimepicker("setDate", new Date());
    $('.form_date3').datetimepicker("setDate", new Date());

    var date = new Date();
    var year = date.getFullYear(); //获取当前年份
    var mon = date.getMonth() + 1; //获取当前月份
    var da = date.getDate(); //获取当前日
    var day = date.getDay(); //获取当前星期几
    var h = date.getHours(); //获取小时
    var m = date.getMinutes(); //获取分钟
    var s = date.getSeconds(); //获取秒
    var applydate = "";
    applydate += "  <strong id=\"input-apply-date\" style=\"width:87%;font-size: 17px;margin-left: 52px;\">" + year + '-' + mon + '-' + da + "</strong>";
    $(".div-applydate").append(applydate);


    login();
    Personnel();
    save();
    applyhone();
});
// var urlPath = "http://10.20.19.70";
// var urlPath = "http://10.1.19.170";
var urlPath = "http://oamobile.agile.com.cn:8088";
var legalHoliday = ['2019-09-28', '2019-10-01', '2019-10-02', '2019-10-03', '2019-10-04', '2019-10-05', '2019-10-06', '2019-10-07', '2019-10-13', '2019-10-19', '2019-10-20',
    '2019-10-26', '2019-10-27', '2019-11-2', '2019-11-03', '2019-11-09', '2019-11-10', '2019-11-16', '2019-11-17', '2019-11-23', '2019-11-24', '2019-11-30',
    '2019-12-01', '2019-12-07', '2019-12-08', '2019-12-14', '2019-12-15', '2019-12-21', '2019-12-22', '2019-12-29'];
var loginName;
var names;


function login() {
    loginName = localStorage.getItem("meeting_loginname");
    var token = getToken("rest", "123456");
    var keyapplyName = localStorage.getItem('applyName');
    var applyName = eval('(' + keyapplyName + ')');
    var name;
    var applyid;
    var DepartmentId;
    if (applyName != null) {
        for (var a = 0; a < applyName.length; a++) {
            names = document.getElementById("input-apply-name").value = applyName[a].name;
            applyid = document.getElementById("hidden-apply-id").value = applyName[a].id;

            DepartmentId = document.getElementById("hidden-DepartmentId").value = applyName[a].orgDepartmentId;
            var phone = applyName[a].telNumber;
            name = applyName[a].loginName;
            localStorage.setItem("name", name);
            var applyPhone = localStorage.getItem("phone");
            if (applyPhone == "" || applyPhone == null) {
                document.getElementById("input-apply-hone").value = phone;
                localStorage.setItem("phone", phone);
            } else {
                document.getElementById("input-apply-hone").value = applyPhone;
            }
            var meeting_applyid = localStorage.getItem("meeting_applyid")
            if (meeting_applyid != applyName[a].id) {
                document.getElementById("input-apply-hone").value = applyName[a].telNumber;
                localStorage.setItem('phone', applyName[a].telNumber)
            }
            localStorage.setItem("meeting_applyid", applyid)

        }
        // $.ajax({
        //     //A108248黄浩彬
        //     url: (url + "/seeyon/rest/orgMember/code/" + name + "?token=" + token),
        //     // url: (url + "/seeyon/rest/orgMember?loginName=" + loginName + "&token=" + token),
        //     type: "GET",
        //     dataType: "text",
        //     async: false,
        //     processData: false,
        //     success: function (data) {
        //         var orgmeber = data.replace(/(\".*?\"\s*\:\s*)(\-{0,1}\d+)/g, '$1' + '"$2"');
        //         var dateOrgmeber = eval('(' + orgmeber + ')');
        //         for(var i=0;i<dateOrgmeber.length;i++){
        //             document.getElementById("input-apply-name").value = dateOrgmeber[i].name;
        //             document.getElementById("hidden-apply-id").value = dateOrgmeber[i].id;
        //             document.getElementById("hidden-DepartmentId").value = dateOrgmeber[i].orgDepartmentId;
        //             var meeting_applyid = localStorage.getItem("meeting_applyid")
        //             if (meeting_applyid != dateOrgmeber.id) {
        //                 document.getElementById("input-apply-hone").value = dateOrgmeber[i].telNumber;
        //                 localStorage.setItem('phone',dateOrgmeber[i].telNumber)
        //             }
        //         }
        //
        //
        //         console.log(name);
        //     },
        //     error: function (XMLHttpRequest, textStatus, errorThrown) {
        //         console.log("[ ERROR ]" + textStatus + ":" + errorThrown);
        //     }
        // });

        name = localStorage.getItem("name");
    } else {
        // loginName=localStorage.getItem('meeting_loginname');
        $.ajax({
            //A108248黄浩彬
            url: (urlPath + "/seeyon/rest/orgMember/code/" + loginName + "?token=" + token),
            // url: (url + "/seeyon/rest/orgMember?loginName=" + loginName + "&token=" + token),
            type: "GET",
            dataType: "text",
            async: false,
            processData: false,
            success: function (data) {
                var orgmeber = data.replace(/(\".*?\"\s*\:\s*)(\-{0,1}\d+)/g, '$1' + '"$2"');
                var dateOrgmeber = eval('(' + orgmeber + ')');
                console.log(dateOrgmeber);
                for (var i = 0; i < dateOrgmeber.length; i++) {
                    document.getElementById("input-apply-name").value = dateOrgmeber[i].name;
                    document.getElementById("hidden-apply-id").value = dateOrgmeber[i].id;
                    document.getElementById("hidden-DepartmentId").value = dateOrgmeber[i].orgDepartmentId;
                    document.getElementById("input-apply-hone").value = dateOrgmeber[i].telNumber;
                    var telNumber = dateOrgmeber[i].telNumber;
                    var Datename = dateOrgmeber[i].loginName;
                    loginName = localStorage.getItem('meeting_loginname');
                    localStorage.setItem('name', Datename);
                    localStorage.setItem("phone", telNumber)
                    console.log(telNumber, Datename);
                }


            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log("[ ERROR ]" + textStatus + ":" + errorThrown);
            }
        });
    }


    var keystartTime = localStorage.getItem("startTime");
    if (keystartTime != null) {
        var startTime = document.getElementById("input-start").value = keystartTime;
    }
    var keyendTime = localStorage.getItem("endTime");
    if (keyendTime != null) {
        document.getElementById("input-end").value = keyendTime;
    }

}

//缓存
function applyhone() {
    var applyHone = document.getElementById("input-apply-hone").value;
    localStorage.setItem("phone", applyHone);
}

function theme() {
    var theme = document.getElementById("input-theme").value;
    localStorage.setItem("theme", theme);
}

function apply() {
    var startTime = document.getElementById("input-start").value;
    localStorage.setItem("startTime", startTime);
}

function xinshi() {
    var xinshi = document.getElementById("xinshi-select").value;
    localStorage.setItem("xinshi", xinshi);
}

function chuxi() {
    var chuxi = document.getElementById("input-chuxi").value;
    localStorage.setItem("chuxi", chuxi);
}

function types() {
    var type = document.getElementById("type-select").value;
    localStorage.setItem("type", type);
}

function lingdaoshenke() {
    var lingdaoshenke = document.getElementById("input-lingdaoshenke").value;
    localStorage.setItem("lingdaoshenke", lingdaoshenke)
}

function waiqi() {
    var waiqi = document.getElementById("input-waiqi").value;
    localStorage.setItem("waiqi", waiqi)
}

function txt() {
    var txt = document.getElementById("yiti-txt").value;
    localStorage.setItem("txt", txt)
}

function remark() {
    var remark = document.getElementById("remark-txt").value;
    localStorage.setItem("remark", remark)
}


function save() {
    console.log("缓存输入信息");
    // var keyapplyName = localStorage.getItem('applyName');
    // var applyName = eval('(' + keyapplyName + ')');
    // if (applyName != null) {
    //     for (var a = 0; a < applyName.length; a++) {
    //         var name = document.getElementById("input-apply-name").value = applyName[a].name;
    //         var applyid = document.getElementById("hidden-apply-id").value = applyName[a].id;
    //         var DepartmentId = document.getElementById("hidden-DepartmentId").value = applyName[a].orgDepartmentId;
    //         loginName = localStorage.getItem("loginName");
    //         console.log(applyName[a].telNumber,applyName[a].name)
    //         if (applyName[a].telNumber != null) {
    //             var locadphone = localStorage.getItem("phone");
    //             if (locadphone == null) {
    //                 var telNumber = applyName[a].telNumber;
    //                 localStorage.setItem("phone", telNumber);
    //             }
    //
    //         }
    //
    //     }
    // }

    // var keyphone = localStorage.getItem("phone");
    // console.log("电话:", keyphone)
    // if (keyphone != null) {
    //     document.getElementById("input-apply-hone").value = keyphone;
    // }

    var keytexture = localStorage.getItem('texture');
    var texture = eval('(' + keytexture + ')');
    if (texture != null) {
        for (var b = 0; b < texture.length; b++) {
            document.getElementById("input-texture").value = texture[b].name;
            document.getElementById("hidden-texture-id").value = texture[b].id;
        }
    }
    var keydirect = localStorage.getItem('direct');
    var direct = eval('(' + keydirect + ')');
    if (direct != null) {
        for (var c = 0; c < direct.length; c++) {
            document.getElementById("input-direct").value = direct[c].name;
            document.getElementById("hidden-direct-id").value = direct[c].id;
        }
    }
    var keyjilu = localStorage.getItem('jilu');
    var jilu = eval('(' + keyjilu + ')');
    if (jilu != null) {
        for (var d = 0; d < jilu.length; d++) {
            document.getElementById("input-jilu").value = jilu[d].name;
            document.getElementById("hidden-jilu-id").value = jilu[d].id;
        }
    }
    var keyshenKe = localStorage.getItem('shenKe');
    var shenKe = eval('(' + keyshenKe + ')');
    if (shenKe != null) {
        for (var e = 0; e < shenKe.length; e++) {
            document.getElementById("input-lingdaoshenke").value = shenKe[e].name;
            document.getElementById("hidden-lingdaoshenke-id").value = shenKe[e].id;
        }
    }
    var keyrenyuan = localStorage.getItem('renyuan');
    var renyuan = eval('(' + keyrenyuan + ')');
    var nameList = [];
    var idList = [];
    if (renyuan != null) {
        for (var f = 0; f < renyuan.length; f++) {
            nameList.push(renyuan[f].name);
            idList.push(renyuan[f].id);
        }
        document.getElementById("renyuan-txt").value = nameList;
        document.getElementById("hidden-renyuan-id").value = idList;
        document.getElementById("hidden-renyuan-name").value = nameList;
    }

    var keyapplyDate = localStorage.getItem("applyDate");
    if (keyapplyDate != null) {
        document.getElementById("input-apply-date").value = keyapplyDate;
    }

    var keytheme = localStorage.getItem("theme");
    if (keytheme != null) {
        var the = document.getElementById("input-theme").value = keytheme;
    }
    var keyxinshi = localStorage.getItem("xinshi");
    if (keyxinshi != null) {
        document.getElementById("xinshi-select").value = keyxinshi;
    }
    var keychuxi = localStorage.getItem("chuxi");
    if (keychuxi != null) {
        document.getElementById("input-chuxi").value = keychuxi;
    }
    var keytype = localStorage.getItem("type");
    if (keytype != null) {
        document.getElementById("type-select").value = keytype;
    }
    var keykonggu = localStorage.getItem("konggu");
    if (keykonggu != null) {
        document.getElementById("input-konggu").value = keykonggu;
    }
    var keywaiqi = localStorage.getItem("waiqi");
    if (keywaiqi != null) {
        document.getElementById("input-waiqi").value = keywaiqi;
    }
    var keytxt = localStorage.getItem("txt");
    if (keytxt != null) {
        document.getElementById("yiti-txt").value = keytxt;
    }
    var keyremark = localStorage.getItem("remark");
    if (keyremark != null) {
        document.getElementById("remark-txt").value = keyremark;
    }

}

function submit() {
    var Theme = document.getElementById("input-theme").value;         //会议主题 *
    var ApplyName = document.getElementById("input-apply-name").value;//申请人姓名
    var applyId = document.getElementById("hidden-apply-id").value;//申请人ID
    var DepartmentId = document.getElementById("hidden-DepartmentId").value;//申请人部门 ID
    var ApplyHone = document.getElementById("input-apply-hone").value;//申请人联系电话 *
    var dateStart = document.getElementById("input-start").value;         //开始日期 *
    var dateEnd = document.getElementById("input-end").value;             //结束日期 *
    var Texture = document.getElementById("input-texture").value;        //会议组织者 *
    var TextureId = document.getElementById("hidden-texture-id").value;   //会议组织者 * id
    var Direct = document.getElementById("input-direct").value;           //会议主持人 *
    var DirectId = document.getElementById("hidden-direct-id").value;       //会议主持人 * id
    var JiLu = document.getElementById("input-jilu").value;               //会议记录人 *
    var JiLuId = document.getElementById("hidden-jilu-id").value;           //会议记录人 * id
    var WaiQi = document.getElementById("input-waiqi").value;         //是否有外企业参加
    var ChuXi = document.getElementById("input-chuxi").value;         //会议出席人数 *
    var KongGu = document.getElementById("input-konggu").value;       //是否邀请控股L1领导 *
    var LingDaoShenKe = document.getElementById("input-lingdaoshenke").value;//控股领导会议审核人 *
    var LingDaoShenKeId = document.getElementById("hidden-lingdaoshenke-id").value;//控股领导会议审核人 *id

    var typeSelect = document.getElementById("type-select").value;//会议类型  *
    var xinshiSelect = document.getElementById("xinshi-select").value;//会议形式
    var yitiTxt = document.getElementById("yiti-txt").value;//议题
    var renyuanTxt = document.getElementById("renyuan-txt").value;//参会人数 *
    var renyuanTxtId = document.getElementById("hidden-renyuan-id").value;//参会人数 *
    var remarkTxt = document.getElementById("remark-txt").value;//备注
    var keykonggu = localStorage.getItem("konggu");
    var konggu = eval('(' + keykonggu + ')');

    var startTime = dateStart.substring(0, 10);
    var start = dateStart.substring(10, 16);
    var end = dateEnd.substring(10, 16);
    var endTime = dateEnd.substring(0, 10);
    var date = new Date();
    var year = date.getFullYear(); //获取当前年份
    var mon = date.getMonth() + 1; //获取当前月份
    var da = date.getDate(); //获取当前日
    var h = date.getHours(); //获取小时
    var m = date.getMinutes(); //获取分钟
    var s = date.getSeconds(); //获取秒
    if (mon < 10) {
        mon = "0" + mon;
    }
    if (m < 10) {
        m = "0" + m;
    }
    var applyDateTime = year + "-" + mon + "-" + da;
    var applyDate = h + ":" + m;

    // console.log("申请时间", applyDateTime, "开始时间", startTime, "结束时间", endTime)
    if (Theme == "") {
        hint("请填写主题");
        return false;
    } else if (ApplyHone == "") {
        hint("请填写电话");
        return false;
    } else if (Texture == "") {
        hint("请填写信息");
        return false;
    } else if (Direct == "") {
        hint("请填写信息");
        return false;
    } else if (JiLu == "") {
        hint("请填写信息");
        return false;
    } else if (renyuanTxtId == "") {
        hint("请填写信息");
        return false;
    } else if (renyuanTxt == "") {
        hint("请填写信息");
        return false;
    } else if (ChuXi == 0 && ChuXi == "") {
        hint("请填写出席人数");
        return false;
    } else if (dateStart >= dateEnd) {
        hint("日期有误!");
        return false;
    } else if (startTime < endTime) {
        hint("必须同一天!");
        return false;
    } else if (konggu == 0) {
        if (LingDaoShenKe == "") {
            hint("审核人未填!");
        }
        return false;
    } else if (start > applyDate) {
        hint("申请时间与开会时间太近!");
        console.log("申请时间", applyDate, "开始时间", start)
        return false;
    }
    futureDate = getdiffdate(applyDateTime, startTime);

    var temp = []; //临时数组1
    var temparray = [];//临时数组2
    for (var i = 0; i < legalHoliday.length; i++) {
        temp[legalHoliday[i]] = true;//巧妙地方：把数组B的值当成临时数组1的键并赋值为真
    }
    ;
    for (var i = 0; i < futureDate.length; i++) {
        if (!temp[futureDate[i]]) {
            temparray.push(futureDate[i]);//巧妙地方：同时把数组A的值当成临时数组1的键并判断是否为真，如果不为真说明没重复，就合并到一个新数组里，这样就可以得到一个全新并无重复的数组
        }
        ;
    }
    ;
    console.log(temparray)
    if (temparray.length > 5) {
        hint("会议开始日期请选择最近5个工作日范围内的时间")
        return false
    }

    var str = "<formExport version=\"2.0\" ><summary id=\"-1\"  name=\"formmain_0015\" /><values><column name=\"行政_其他_内容\" ><value>mobile</value></column><column name=\"申请人\" ><value>" + applyId + "</value></column><column name=\"申请日期\" ><value>" + applyDateTime + "</value></column><column name=\"会议主题\" ><value>" + Theme + "</value></column><column name=\"申请部门\" ><value>" + DepartmentId + "</value></column><column name=\"会议开始时间\" ><value>" + dateStart + "</value></column><column name=\"是否有外单位参加\" ><value>" + WaiQi + "</value></column><column name=\"会议组织者\" ><value>" + TextureId + "</value></column><column name=\"申请人联系电话\" ><value>" + ApplyHone + "</value></column><column name=\"会议出席人数\" ><value>" + ChuXi + "</value></column><column name=\"备注\" ><value>" + remarkTxt + "</value></column>          <column name=\"会议截止时间\" ><value>" + dateEnd + "</value></column><column name=\"参会人员\" ><value>" + renyuanTxtId + "</value></column><column name=\"会议记录者\" ><value>" + JiLuId + "</value></column><column name=\"会议类型\" ><value>" + typeSelect + "</value></column><column name=\"会议主持者\" ><value>" + DirectId + "</value></column><column name=\"议程议题\"><value>" + yitiTxt + "</value></column><column name=\"会议实际结束时间\" ><value/></column><column name=\"会议室所在地\" ><value>956163389618735506</value></column><column name=\"L1层领导参会\" ><value>" + KongGu + "</value></column><column name=\"是否邀请L1领导参会\" ><value>" + KongGu + "</value></column><column name=\"会议形式\" ><value>" + xinshiSelect + "</value></column></values></formExport>";
    var token = getToken("rest", "123456");
    names = localStorage.getItem("name");
    console.log("发起人:", names)
    var jsonData = {
        // "senderLoginName": "seeyon",
        "senderLoginName": names,
        "subject": "",
        "data": str
    };
    console.log(str);
    $.ajax({
        url: (urlPath + "/seeyon/rest/flow/MeetingApply?token=" + token),
        type: "POST",
        dataType: "json",
        async: false,
        data: JSON2.stringify(jsonData),
        processData: false,
        contentType: "application/json",
        success: function (data) {
            hint("发起成功");
            setTimeout(function () {
                location.reload();//发起成功后2秒刷新页面
                console.log("发起成功后2秒刷新页面")
                localStorage.removeItem('remark');
                localStorage.removeItem('endTime');
                localStorage.removeItem('startTime');
                localStorage.removeItem('theme');
                localStorage.removeItem('texture');
                localStorage.removeItem('txt');
                localStorage.removeItem('applyName');
                localStorage.removeItem('waiqi');
                localStorage.removeItem('direct');
                localStorage.removeItem('chuxi');
                localStorage.removeItem('jilu');
                localStorage.removeItem('renyuan');
                localStorage.removeItem('phone');
                localStorage.removeItem('xinshi');
                localStorage.removeItem('applyDate');
                localStorage.removeItem('type');
                localStorage.removeItem('lingdaoshenke');
                localStorage.removeItem('name');
            }, 2000);

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log("发起[ ERROR ]" + textStatus + ":" + errorThrown);
            hint("发起失败")
        }
    });
};

function isAllEqual(array) {
    if (array.length > 0) {
        return !array.some(function (value, index) {
            return value !== array[0];
        });
    } else {
        return true;
    }
}

function clears() {
    localStorage.clear();
    location.reload();
}

function sel(value) {
    var konggu = document.getElementById("input-konggu").value;
    localStorage.setItem("konggu", value);
    var ShenHe = "";
    if (value == 0) {
        ShenHe += "<div class=\"div-span\">";
        ShenHe += " <label class=\"theme-label\" style=\"margin-left: 13px;\">";
        ShenHe += " 控股领导会议审核人:";
        ShenHe += "</label>";
        ShenHe += "</div>";
        ShenHe += "";
        ShenHe += "<div class=\"div-input\"  onclick=\"handleclick('shenKe');\">";
        ShenHe += "<input type=\"text\" class=\"input-lingdaoshenke\"   id=\"input-lingdaoshenke\"  style=\"border-top-style: none;border-left-style: none;border-right-style: none; font-size:16px;color:#101010;background: #FFF5D2 !important;\"/>";
        ShenHe += " <input type=\"hidden\" id=\"hidden-lingdaoshenke-id\"/>";
        ShenHe += "</div>";
        $("#shenhe").html(ShenHe);
        return false;
    } else if (value == 1) {
        localStorage.removeItem('lingdaoshenke');
        localStorage.removeItem('shenKe');
        location.reload();
        return false;
    }
}

var flag = true;
var theme;

function TabTwo() {
    loginName = localStorage.getItem("meeting_loginname");
    console.log("进入已发记录选项卡！！！", loginName);
    var memberId = "";
    var id = "";
    var logName = "";
    var token = getToken("rest", "123456");
    //忽略
    if (flag) {
        $.ajax({
            // url: (url + "/seeyon/rest/orgMember?loginName=" + loginName + "&token=" + token),
            url: (urlPath + "/seeyon/rest/orgMember/code/" + loginName + "?token=" + token),
            type: "GET",
            dataType: "text",
            async: false,
            processData: false,
            success: function (data) {
                var orgLogin = data.replace(/(\".*?\"\s*\:\s*)(\-{0,1}\d+)/g, '$1' + '"$2"');
                var dateLogin = eval('(' + orgLogin + ')');
                for (var i = 0; i < dateLogin.length; i++) {
                    memberId = dateLogin[i].id;
                    logName = dateLogin[i].loginName;
                }

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log("发起[ ERROR ]" + textStatus + ":" + errorThrown);
            }
        });

        $.ajax({
            url: (urlPath + "/seeyon/rest/token/rest/123456?loginName=" + logName + "&memberId=" + memberId + "&userAgentFrom=weixin"),
            // url: (url + "/seeyon/rest/token/rest/123456?loginName=" + loginName + "&memberId=-" + memberId + "&userAgentFrom=weixin"),
            type: "GET",
            dataType: "text",
            async: false,
            processData: false,
            success: function (data) {
                id = data;
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log("获取[ ERROR ]" + textStatus + ":" + errorThrown);
                hint("获取失败");
            }
        });


        $.ajax({
            url: (urlPath + "/seeyon/rest/coll/sentAffairs?token=" + id),
            type: "POST",
            dataType: "text",
            contentType: "application/json",
            async: false,
            processData: false,
            data: JSON.stringify({"openFrom": "listDone", "pageNo": 1, "pageSize": 10000}), //==body设置
            success: function (date) {
                var menu = "";
                var strDate = date.replace(/(\".*?\"\s*\:\s*)(\-{0,1}\d+)/g, '$1' + '"$2"');
                var result = eval('(' + strDate + ')');
                if (result.data.length == 0) {
                    menu += "<div id=\"messageNull-img\">";
                    // menu += "<img src=\"img/null.png\" >";
                    menu += "<img src=\"/seeyon/m3/apps/v5/meetings/img/null.png\" >";
                    menu += "<label class=\"label-null\">暂无信息</label>";
                    menu += "</div>";
                    $(".menu").html(menu);
                    return false;
                } else {
                    for (var j = 0; j < result.data.length; j++) {
                        var summaryId = result.data[j].summaryId;
                        menu += "<li class=\"menu-item\">";
                        menu += "<div class=\"menu-title\" onclick=\"summary('" + summaryId + "')\"><span class=\"span-menu-title\">" + result.data[j].startMemberName + "  发起时间:" + result.data[j].startDateStandard + "</span></div>";
                        menu += "<input type=\"hidden\" value='" + summaryId + "' id=\"hidden-" + [j] + "\">";
                        menu += "<ul class=\"sub-menu\">";
                        menu += "</ul>";
                        menu += "</li>";
                    }
                    $(".menu").append(menu);
                }

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log("发起[ ERROR ]" + textStatus + ":" + errorThrown);
                hint("查询失败");
            }
        });
        flag = false;
    }

    /*******折叠菜单交互********/

    const toggleShow = (e) => {
        e.currentTarget.classList.toggle("active-menu");
        Array.from(document.querySelectorAll(".menu-item")).filter(el => el !== e.currentTarget)
            .forEach(el => {
                el.classList.remove("active-menu");
            })
    }
    document.querySelectorAll(".menu-item").forEach(item => {
        item.addEventListener("click", toggleShow)
    });
}

function summary(summayId) {
    // console.log(summayId);
    var token = getToken("rest", "123456");
    var sid = summayId;
    var subMenu = "";
    $.ajax({
        url: (urlPath + "/seeyon/rest/meeting/colSummary/" + sid + "/?token=" + token),
        type: "GET",
        dataType: "JSON",
        contentType: "application/json",
        async: false,
        processData: false,
        success: function (date) {
            if (date == "") {
                $.ajax({
                    url: (urlPath + "/seeyon/rest/meeting/activity/" + sid + "/?token=" + token),
                    type: "GET",
                    dataType: "JSON",
                    contentType: "application/json",
                    async: false,
                    processData: false,
                    success: function (res) {
                        res.forEach(function (value, index) {
                            var waiqi = res[index].FIELD0008;
                            var meetingtype = res[index].FIELD0039;
                            var apply = res[index].FFIELD0053;
                            var startDateTime = res[index].FFIELD0007;
                            var endDateTime = res[index].FFIELD0030;
                            var start = startDateTime.slice(2, 19);
                            var end = endDateTime.slice(2, 19);
                            var applys = apply.slice(2, 19);
                            subMenu += "<table border=\"1\" class=\"table-details\">";
                            subMenu += "<tbody>";
                            subMenu += "<tr class=\"tr-message\">";
                            subMenu += "<th>会议室所在地:</th>";
                            subMenu += "<td class=\"td-message\">雅居乐会议中心</td>";
                            subMenu += "<th>会议主题:</th>";
                            subMenu += "<td class=\"td-message\">" + res[index].FIELD0005 + "</td>";
                            subMenu += "</tr>";
                            subMenu += "<tr class=\"tr-message\">";
                            subMenu += "<th>申请人:</th>";
                            subMenu += "<td class=\"td-message\">" + res[index].FIELD0003_NAME + "</td>";
                            subMenu += "<th>申请部门:</th>";
                            subMenu += "<td class=\"td-message\">" + res[index].OUNAME + "</td>";
                            subMenu += "</tr>";
                            subMenu += "<tr class=\"tr-message\">";
                            subMenu += "<th>发起日期:</th>";
                            subMenu += "<td class=\"td-message\">" + applys + "</td>";
                            subMenu += "<th>申请人联系电话:</th>";
                            subMenu += "<td class=\"td-message\">" + res[index].FIELD0010 + "</td>";
                            subMenu += "</tr>";
                            subMenu += "<tr class=\"tr-message\">";
                            subMenu += "<th>会议时间:</th>";
                            subMenu += "<td class=\"td-message\">" + start + "<br/>" + end + "</td>";
                            subMenu += "<th>会议组织者:</th>";
                            subMenu += "<td class=\"td-message\">" + res[index].FIELD0009_NAME + "</td>";
                            subMenu += "</tr>";
                            subMenu += "<tr class=\"tr-message\">";
                            subMenu += "<th>会议主持者:</th>";
                            subMenu += "<td class=\"td-message\">" + res[index].FIELD0040_NAME + "</td>";
                            subMenu += "<th>会议记录者:</th>";
                            subMenu += "<td class=\"td-message\">" + res[index].FIELD0038_NAME + "</td>";
                            subMenu += "</tr>";
                            subMenu += "<tr class=\"tr-message\">";
                            subMenu += "<th>议程/议题:</th>";
                            var yiti = res[index].FIELD0046;
                            if (yiti == '' || yiti == undefined) {
                                subMenu += "<td class=\"td-message\">未填</td>";
                            } else {
                                subMenu += "<td class=\"td-message\"><div style=\"width:100%;height:100px;overflow-x:hidden;overflow-y:scroll\">" + yiti + "</div></td>";
                            }
                            subMenu += "<th>参会人员:</th>";
                            subMenu += "<td class=\"td-message\">" + res[index].FIELD0032_NAME + "</td>";
                            subMenu += "</tr>";
                            subMenu += "<tr class=\"tr-message\">";
                            subMenu += "<th>会议出席人数:</th>";
                            subMenu += "<td class=\"td-message\">" + res[index].FIELD0011 + "</td>";
                            subMenu += "<th>会议形式:</th>";
                            var type = res[index].FIELD0058;
                            if (type == '-7400262493883379753') {
                                subMenu += "<td class=\"td-message\">现场</td>";
                            } else if (type == '-6266237119449510811') {
                                subMenu += "<td class=\"td-message\">视频</td>";
                            } else if (type == '-2165911456725906503') {
                                subMenu += "<td class=\"td-message\">现场+视频</td>";
                            }
                            subMenu += "</tr>";
                            subMenu += "<tr class=\"tr-message\">";
                            subMenu += "<th>是否有外单位参加:</th>";
                            if (waiqi == '-608269136254057737') {
                                subMenu += "<td class=\"td-message\">是</td>";
                            } else if (waiqi == '-4067160942763881636') {
                                subMenu += "<td class=\"td-message\">否</td>";
                            } else if (waiqi == null || waiqi == undefined) {
                                subMenu += "<td class=\"td-message\">未填</td>";
                            }
                            subMenu += "<th>会议类型:</th>";
                            if (meetingtype == '-288312812531596042') {
                                subMenu += "<td class=\"td-message\">固定会议</td>";
                            } else if (meetingtype == '-9140242611314146983') {
                                subMenu += "<td class=\"td-message\">非固定会议</td>";
                            }
                            subMenu += "</tr>";
                            subMenu += "<th>是否邀请控股L1领导:</th>";
                            if (res[index].FIELD0031 == '-608269136254057737') {
                                subMenu += "<td class=\"td-message\">是</td>";
                            } else if (res[index].FIELD0031 == '-4067160942763881636') {
                                subMenu += "<td class=\"td-message\">否</td>";
                            } else if (res[index].FIELD0031 == null) {
                                subMenu += "<td class=\"td-message\">未填</td>";
                            }
                            subMenu += "<th>留言:</th>";
                            subMenu += "<td class=\"td-message\"></td>";
                            subMenu += "</tr>";
                            subMenu += "</tr>";
                            subMenu += "<tr class=\"tr-message\">";
                            subMenu += "<th>状态:</th>";
                            subMenu += "<td class=\"td-message\">审批中</td>";
                            subMenu += "<th>备注:</th>";
                            if (res[index].FIELD0012 == "" || res[index].FIELD0012 == undefined) {
                                subMenu += "<td class=\"td-message\">未填</td>";
                            } else {
                                subMenu += "<td class=\"td-message\">" + res[index].FIELD0012 + "</td>";
                            }
                            subMenu += "</tr>";
                            subMenu += "<tr class=\"tr-message\">";
                            subMenu += "<th>发起设备:</th>";
                            if(res[index].FIELD0025=='mobile'){
                                subMenu += "<td class=\"td-message\" colspan='3'>移动端</td>";
                            }else{
                                subMenu += "<td class=\"td-message\" colspan='3'>电脑端</td>";
                            }
                            subMenu += "</tr>";
                            subMenu += "</tbody>";
                            subMenu += "</table>";
                            $(".sub-menu").html(subMenu);
                        })
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        console.log("发起[ ERROR ]" + textStatus + ":" + errorThrown);
                        hint("查询失败");
                    }
                });
            } else {
                date.forEach(function (value, index) {
                    var waiqi = date[index].FIELD0008;
                    var meetingtype = date[index].FIELD0039;
                    var apply = date[index].FFIELD0053;
                    var startDateTime = date[index].FFIELD0007;
                    var endDateTime = date[index].FFIELD0030;
                    var start = startDateTime.slice(2, 19);
                    var end = endDateTime.slice(2, 19);
                    var applys = apply.slice(2, 19);
                    var Perm = date[index].EXT_ATT1;
                    if (Perm == "collaboration.dealAttitude.agree") {
                        subMenu += "<table border=\"1\" class=\"table-details\">";
                        subMenu += "<tbody>";
                        subMenu += "<tr class=\"tr-message\">";
                        subMenu += "<th>会议主题:</th>";
                        subMenu += "<td class=\"td-message\" colspan='3'>" + date[index].FIELD0005 + "</td>";
                        subMenu += "</tr>";
                        subMenu += "<tr class=\"tr-message\">";
                        subMenu += "<th>组织者:</th>";
                        subMenu += "<td class=\"td-message\">" + date[index].FIELD0009_NAME + "</td>";
                        subMenu += "<th>申请部门:</th>";
                        subMenu += "<td class=\"td-message\">" + date[index].OUNAME + "</td>";
                        subMenu += "</tr>";
                        subMenu += "<tr class=\"tr-message\">";
                        subMenu += "<th>会议时间:</th>";
                        subMenu += "<td class=\"td-message\">" + start + "<br/>" + end + "</td>";
                        subMenu += "<th>会议室:</th>";
                        subMenu += "<td class=\"td-message\">" + date[index].FIELD0065 + "</td>";
                        subMenu += "</tr>";
                        subMenu += "<tr class=\"tr-message\">";
                        subMenu += "<th>议程/议题:</th>";
                        if (date[index].FIELD0046 == '' || date[index].FIELD0046 == undefined) {
                            subMenu += "<td class=\"td-message\" colspan='3'>未填</td>";
                        } else {
                            subMenu += "<td class=\"td-message\" colspan='3'><div style=\"width:100%;height:100px;overflow-x:hidden;overflow-y:scroll\">" + date[index].FIELD0046 + "</div></td>";
                        }
                        subMenu += "</tr>";
                        subMenu += "<tr class=\"tr-message\">";
                        subMenu += "<th>发起设备:</th>";
                        if(date[index].FIELD0025=='mobile'){
                            subMenu += "<td class=\"td-message\" colspan='3'>移动端</td>";
                        }else{
                            subMenu += "<td class=\"td-message\" colspan='3'>电脑端</td>";
                        }
                        subMenu += "</tr>";
                        subMenu += "</tbody>";
                        subMenu += "</table>";
                        $(".sub-menu").html(subMenu);

                    } else if (Perm == "collaboration.dealAttitude.disagree") {
                        subMenu += "<table border=\"1\" class=\"table-details\">";
                        subMenu += "<tbody>";
                        subMenu += "<tr class=\"tr-message\">";
                        subMenu += "<th>状态:</th>";
                        subMenu += "<td class=\"td-message\">不同意</td>";
                        subMenu += "<th>意见:</th>";
                        subMenu += "<td class=\"td-message\">" + date[index].CONTENT + "</td>";
                        subMenu += "</tr>";
                        subMenu += "<tr class=\"tr-message\">";
                        subMenu += "<th>发起设备:</th>";
                        if(date[index].FIELD0025=='mobile'){
                            subMenu += "<td class=\"td-message\" colspan='3'>移动端</td>";
                        }else{
                            subMenu += "<td class=\"td-message\" colspan='3'>电脑端</td>";
                        }
                        subMenu += "</tr>";
                        subMenu += "</tbody>";
                        subMenu += "</table>";
                        $(".sub-menu").html(subMenu);
                    }

                });
            }
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log("发起[ ERROR ]" + textStatus + ":" + errorThrown);
            hint("查询失败");
        }
    })

}


function handleclick(str) {
    window.location.href = ('/seeyon/m3/apps/v5/meetings/dist/index.html');
    //window.location.href = ('dist/index.html');
    if (str == 'applyName') {
        localStorage.setItem('Cache', 'applyName')
    } else if (str == 'texture') {
        localStorage.setItem('Cache', 'texture')
    } else if (str == 'direct') {
        localStorage.setItem('Cache', 'direct')
    } else if (str == 'jilu') {
        localStorage.setItem('Cache', 'jilu')
    } else if (str == 'shenKe') {
        localStorage.setItem('Cache', 'shenKe')
    } else if (str == 'renyuan') {
        localStorage.setItem('Cache', 'renyuan')
    }
}


//选择人员
function Personnel() {
    var localapplyName = localStorage.getItem('applyName');
    var localapplyName = eval('(' + localapplyName + ')');
    var localtexture = localStorage.getItem('texture');
    var localtexture = eval('(' + localtexture + ')');
    var localdirect = localStorage.getItem('direct');
    var localdirect = eval('(' + localdirect + ')');
    var localjilu = localStorage.getItem('jilu');
    var localjilu = eval('(' + localjilu + ')');
    var localshenKe = localStorage.getItem('shenKe');
    var localshenKe = eval('(' + localshenKe + ')');
    var localrenyuan = localStorage.getItem('renyuan');
    var renyuan = eval('(' + localrenyuan + ')');


    if (localapplyName !== null) {
        document.getElementById("input-apply-name").value = localapplyName[0].name;
        document.getElementById("hidden-apply-id").value = localapplyName[0].id;
        document.getElementById("hidden-DepartmentId").value = localapplyName[0].orgDepartmentId;
    }
    ;
    if (localtexture !== null) {
        document.getElementById("input-texture").value = localtexture[0].name;
        document.getElementById("hidden-texture-id").value = localtexture[0].id;
    }
    ;
    if (localdirect !== null) {
        document.getElementById("input-direct").value = localdirect[0].name;
        document.getElementById("hidden-direct-id").value = localdirect[0].id;
    }
    ;
    if (localjilu !== null) {
        document.getElementById("input-jilu").value = localjilu[0].name;
        document.getElementById("hidden-jilu-id").value = localjilu[0].id;
    }
    ;
    if (localshenKe !== null) {
        document.getElementById("input-lingdaoshenke").value = localshenKe[0].name;
        document.getElementById("hidden-lingdaoshenke-id").value = localshenKe[0].id;
    }
    ;
    var jsonData = JSON.parse(localStorage.getItem('renyuan'));
    if (!jsonData) {
        jsonData = [];
    } else {
        show();
    }

    function btn() {
        if (!$(".renyuan").val()) {
            NewAlert("不能为空!");
        } else {
            jsonData.push({
                name: $('#hidden-renyuan-name').val(),
                id: $('#hidden-renyuan-id').val()
            });
            var s = localStorage.setItem("renyuan", JSON.stringify(jsonData));
            $("#renyuan-txt").empty();
            show();
        }
    }

    function show() {
        var nameList = [];
        var idList = [];
        for (var i = 0; i < jsonData.length; i++) {
            nameList.push(jsonData[i].name);
            idList.push(jsonData[i].id);
        }
        document.getElementById("renyuan-txt").value = nameList;
        document.getElementById("hidden-renyuan-id").value = idList;
        document.getElementById("hidden-renyuan-name").value = nameList;
    }

}


//             if (str == 'renyuan') {
//                 var nameList = [];
//                 var idList = [];
//                 for (var i = 0; i < Personnel.length; i++) {
//                     nameList.push(Personnel[i].name);
//                     idList.push(Personnel[i].id);
//                 }
//                 document.getElementById("renyuan-txt").value = nameList;
//                 document.getElementById("hidden-renyuan-id").value = idList;
//                 return false;
//             } else {
//                 return true;
//             }
//
//         }
//     }
// }
//关闭提示框
function btnHidden(strThis) {
    if (strThis == 1) {
        localStorage.setItem("click", 1)
        $("#src_form_view_hint").remove();
    } else if (strThis == 2) {
        $(".New_alert").css("display", "none");
    } else if (strThis == 3) {
        $(".alert").css("display", "none");
    }


}

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
            hint("token有误！");
        }
    });
    return token;
}

/*时间戳转换成年月日时分秒*/
function formatDate(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    //  return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second;
    return year + '-' + (String(month).length > 1 ? month : '0' + month) + '-' +
        (String(day).length > 1 ? day : '0' + day) + ' ' + (String(hour).length > 1 ? hour : '0' + hour) + ':' + (String(minute).length > 1 ? minute : '0' + minute)
        + ':' + (String(second).length > 1 ? second : '0' + second)
}

/*提示框*/
function NewAlert(str) {
    var NewAlert = "";
    NewAlert += "<div  class=\"new_alert_hint col\" style=\"display: none;\">";
    NewAlert += "<div class=\"content\">";
    NewAlert += "<div class=\"text\">";
    NewAlert += " <div class=\"src_text\">提示</div>";
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

/*计时器隐藏提示框*/
function btnShow() {
    $(".new_alert_hint").css("display", "block");
    setTimeout(function () {
        $(".new_alert_hint").css("display", "none");
        console.log(" 2秒")
    }, 2000);
}

/*选项卡*/
function Tab(num) {
    var i;
    for (i = 1; i <= 2; i++) {
        if (i == num) {
            document.getElementById("tab" + i).style.display = "block";
        } else {
            document.getElementById("tab" + i).style.display = "none";
        }

    }
    if (num == 2) {
        $(".hover-div").css("display", "none");
    } else {
        $(".hover-div").css("display", "block");
    }

}

//追加日期
function addDate(date, days) {
    if (days == undefined || days == '') {
        days = 1;
    }
    var date = new Date(date);
    date.setDate(date.getDate() + days);
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var mm = "'" + month + "'";
    var dd = "'" + day + "'";
    //单位数前面加0
    if (mm.length == 3) {
        month = "0" + month;
    }
    if (dd.length == 3) {
        day = "0" + day;
    }
    var time = date.getFullYear() + "-" + month + "-" + day
    return time;
}

//重写 alert
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

function getdiffdate(stime, etime) {
    //初始化日期列表，数组
    var diffdate = new Array();
    var i = 0;
    //开始日期小于等于结束日期,并循环
    while (stime <= etime) {
        diffdate[i] = stime;

        //获取开始日期时间戳
        var stime_ts = new Date(stime).getTime();
        //增加一天时间戳后的日期
        var next_date = stime_ts + (24 * 60 * 60 * 1000);

        //拼接年月日，这里的月份会返回（0-11），所以要+1
        var next_dates_y = new Date(next_date).getFullYear() + '-';
        var next_dates_m = (new Date(next_date).getMonth() + 1 < 10) ? '0' + (new Date(next_date).getMonth() + 1) + '-' : (new Date(next_date).getMonth() + 1) + '-';
        var next_dates_d = (new Date(next_date).getDate() < 10) ? '0' + new Date(next_date).getDate() : new Date(next_date).getDate();

        stime = next_dates_y + next_dates_m + next_dates_d;

        //增加数组key
        i++;
    }
    return diffdate;
}


