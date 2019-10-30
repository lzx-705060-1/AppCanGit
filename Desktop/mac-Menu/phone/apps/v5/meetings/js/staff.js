var url = "http://10.1.19.170";
window.onload = function () {


}
// function  DeptId() {
//         var deptId=document.getElementById("inputHideen").value;
//         console.log(deptId);
// }
function InputHidden() {
    console.log(this)
    var strIn = document.getElementById("inputHidden").value;
    console.log(strIn);
    // $(this).hide();
}

function searchMessage() {
    var inputSearch = document.getElementById("input-search").value;
    var token = getToken("rest", "123456");
    console.log("token:", token);
    $.ajax({
        url: (url + "/seeyon/rest/orgMembers/name/" + inputSearch + "?token=" + token),
        type: "GET",
        dataType: "json",
        async: false,
        processData: false,
        contentType: "application/json",
        success: function (data) {
            // var datas = document.querySelectorAll("div[class='div-label-primary']")
            // console.log(datas)
            console.log(data);
            data.forEach(function (value, index) {
                var DivRight = document.getElementsByClassName("div-staff-messages")[0];

                function createTabRight() {
                    var div = document.createElement("div");
                    div.className = "div-label-primary";
                    //追加 span 标签
                    div.innerHTML = " <span class=\"label label-primary\" id=\"label-primary\" onclick=\"InputHidden(this)\">" + data[index].name + "(" + data[index].orgPostName + ")" + " <input type='hidden' value=" + data[index].id + " " + data[index].orgDepartmentId + " id=\"inputHidden\"/></span>";
                    DivRight.appendChild(div);
                }

                createTabRight();
                return value;
            })
            // console.log(data[0].id);

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log("[ ERROR ]" + textStatus + ":" + errorThrown);
        }
    });
}


function getToken(username, password) {

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
        }
    });

    return token;
}
