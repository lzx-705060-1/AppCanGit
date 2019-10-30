(function () {
    initPage_credit();
})();

/**
 * 初始化页面信息
 */
function initPage_credit() {
    //初始化回退
   // initPageBackCridet();

    // cmp("#dataCommonDiv")[0].style.height = (cmp("#creditListContent")[0].offsetHeight - cmp("#searchContent")[0].offsetHeight) + "px";
    cmp("#dataCommonDiv")[0].style.height = '600px'
    cmp("#creditSubject")[0].disabled = false;

    cmp.i18n.init(urlPath + "/i18n/", "Formcreditqueryctrl", function () {


        cmp("#creditSubject")[0].addEventListener("keyup", function (e) {
            if (e.keyCode == 13) {
                cmp("#creditSubject")[0].blur();
                initSearch();
            }
        });
        cmp("#creditSubject")[0].addEventListener("focus", function (e) {

            var searchIcon = cmp("#searchClear")[0];
            if (!searchIcon.classList.contains("display_none")) {
                searchIcon.classList.add("display_none");
            }
        });
        cmp("#creditSubject")[0].addEventListener("blur", function (e) {
            if (this.value != "") {
                if (!this.classList.contains("text-left")) {
                    this.classList.add("text-left");
                }
            } else {
                cmp("#searchClear")[0].classList.remove("display_none");
                if (this.classList.contains("text-left")) {
                    this.classList.remove("text-left");
                }
            }
        });


    });

    //初始化列表点击
    templateList_crediteTap();

    document.getElementById("creditSubject").setAttribute("placeholder", "搜索");

}

/**
 * 初始化搜索组件
 */
function initSearch() {
    var subject = cmp("#creditSubject")[0].value;
    if (subject != "" && subject.trim() != "") {
        loadTemplates(subject);
    }
}

/**
 * 根据关键字获取企业信息
 */
function loadTemplates(subject) {
    cmp.dialog.loading();
    cmp.ajax({
        type: 'post',
        url: cmp.seeyonbasepath +
        "/rest/cap4/formCreditquery/getCreditqueryFieldInfoM3?keyword=" + subject,
        dataType: 'JSON',
        headers: {
            "Accept": "application/json; charset=utf-8",
            "Accept-Language": "zh-CN",
            "Content-Type": "application/json; charset=utf-8",
            "token": cmp.token
        },
        success: function (data) {
            var param = eval(data);
            cmp.dialog.loading(false);
            initTPL_credit(param, 'templateTpl_credite', 'templateList_credite');
        },
        error: function (data) {
            cmp.dialog.loading(false);
            cmp.dialog.error(data.message, function (index) {
            }, "错误", ["确认", "取消"]);
        }
    });


}

/**
 * 模板数据加载
 * @param data
 */
function initTPL_credit(data, tplId, listViewId) {
    try {
        var liTpl = document.getElementById(tplId).innerHTML;
        var table = document.getElementById(listViewId);
        var html = cmp.tpl(liTpl, data);
        table.innerHTML = html;
        if (table && table.innerHTML.trim() == "") {
            table.style.textAlign = 'center';
            table.style.marginTop = '30%';
            var msg = '<div class="StatusContainer"><div class="nocontent"></div><span class="text nocontent_text">' + '没有数据' + '</span></div>';
            table.innerHTML = msg;
        }
    } catch (e) {
        console.log(e.message);
    }
}

function initPageBackCridet() {
   // document.querySelector("#prev_search").addEventListener('tap', _goBack_search);
    cmp.backbutton();
    cmp.backbutton.push(_goBack_search);

}

function _goBack_search() {
    var five = '<div class="StatusContainer">' +
        '<div class="nocontent"></div>' +
        '<span class="text nocontent_text">' +
        '最多显示五条记录' +
        '</span></div>';
    document.querySelector('#templateList_credite').innerHTML = five;
    var input = document.getElementById('creditSubject');
    input.value = "";
    if (input.classList.contains("text-left")) {
        input.classList.remove("text-left");
    }
    cmp("#searchClear")[0].classList.remove("display_none");
    ClassList.remove('cmp-active');
    cmp.backbutton.pop();
}

function templateList_crediteTap() {
    //所有表单列表点击跳转至新建页面
    cmp("#templateList_credite").on("tap", ".templateList_credite", function () {
        var privateId = cmp("#creditSubject")[0].attributes.privateId;
        document.querySelector("#custom" + privateId).value = this.getAttribute("data");
        _goBack_search();
        ClassList.remove('cmp-active');
        var msg = cmp("#creditSubject")[0].attributes.messageObj;
        var adp = cmp("#creditSubject")[0].attributes.adaptation;
        myself.initBackData(this.getAttribute("data"), msg, adp);

    });
}



