var urlParam;
var memberId = false;
cmp.ready(function() {
    headerShowOrNot();
    prevPage();
	urlParam = getUrlParam();
	if(urlParam == null||typeof urlParam =="undefined" || !urlParam){
        cmp.href.closePage();
        return false;
    }
    memberId = urlParam['memberId'];
    if(memberId == "" || memberId == null || typeof memberId == 'undefined'){
        backFrom();
        return false;
    }else{
        getPeopleData();
    }
    cmp.i18n.detect();
});

function setWaterMark(result, id){
	if(result.waterMarkEnable && result.waterMarkEnable == "true"){
		var data = {};
		if(result.waterMarkName){
			data.userName = result.waterMarkName;
		}
		if(result.waterMarkDeptName){
			data.department = result.waterMarkDeptName;
		}
		if(result.waterMarkTime){
			data.date = result.waterMarkTime;
		}
		var imgUrl = cmp.watermark(data).toBase64URL();
		document.getElementById(id).style.backgroundImage = "url("+imgUrl+")";
		document.getElementById(id).style.backgroundRepeat = "repeat";
		document.getElementById(id).style.backgroundSize = "150px 75px"; 
		document.getElementById(id).style.backgroundColor = "#fff";
	}
}

/**
 * 调接口 获取人员信息
 */
function getPeopleData() {
    $s.Addressbook.getPeopleCardInfo(memberId, "", {
        success: function (personInfo) {
            loadData(personInfo);
            var height = window.innerHeight - 150;
            cmp.listView(".cmp-scroll-wrapper", {});
            cmp.listView(".cmp-scroll-wrapper").refreshHeight(height);
            setWaterMark(personInfo, "container");
        },
        error: function (error) {
            cmp.href.closePage();
        }
    });
}

/**
 * 模板数据加载
 * @param data
 *{
 *    "aDN": "部门2/部门2-1",                                                  主岗部门全路径名称
 *    "aId": "-4223498697793387298",                                          主岗单位id
 *    "cIf": "工位:1101,楼层:o座二层",                                         自定义字段的名称和值  格式： lable1:value1,lable2:value2,...
 *    "dId": "-1398993356608156398",                                          主岗部门的id
 *    "dN": "部门2-1",                                                        主岗部门的名称
 *    "eM": "",                                                               邮箱
 *    "i": "7280119999400331592",                                             人员id
 *    "img": "/seeyon/apps_res/v3xmain/images/personal/pic.gif",              头像
 *    "lId": "-1273205453281474159",                                          职级id
 *    "lN": "职务级别1",                                                       职级名称
 *    "n": "bj01",                                                            姓名
 *    "oNm": "",                                                              工作电话
 *    "pId": "4620300544002182015",                                           主岗岗位id
 *    "pN": "岗位1",                                                           岗位名称
 *    "tNm": ""                                                               手机
 *}
 */
function loadData(data) {
    document.getElementById("memberPhoto").setAttribute("src",data.img);
    document.getElementById("memberName").innerText = typeof data.n ==='undefined'?"":(data.n.length > 6 ? (data.n.slice(0, 6) + "...") : data.n);
    document.getElementById("memberDept").innerText = typeof data.dN ==='undefined'?"":(data.dN.length > 10 ? (data.dN.slice(0, 10) + "...") : data.dN);
    document.getElementById("vjoinOrg").innerText = typeof data.vjun ==='undefined'?"":(data.vjun.length > 10 ? (data.vjun.slice(0, 10) + "...") : data.vjun);
    document.getElementById("vjoinAcc").innerText = typeof data.vjan ==='undefined'?"":(data.vjan.length > 10 ? (data.vjan.slice(0, 10) + "...") : data.vjan);
    document.getElementById("memberPost").innerText = typeof data.pN ==='undefined'?"":(data.pN.length > 10 ? (data.pN.slice(0, 10) + "...") : data.pN);
    document.getElementById("memberLevel").innerText = typeof data.lN ==='undefined'?"":(data.lN.length > 10 ? (data.lN.slice(0, 10) + "...") : data.lN);

    var workTel = typeof data.oNm ==='undefined'?"":("<a href='tel:"+data.oNm+"'>" + data.oNm + "</a>");
    var phoneTel = typeof data.tNm ==='undefined'?"":(data.tNm === "******"? "******":("<a href='tel:"+data.tNm+"'>" + data.tNm + "</a>"));
    var mail = typeof data.eM ==='undefined'? "" : ("<a href='mailTo:"+data.eM+"'>" + data.eM + "</a>");

    document.getElementById("memberWorkTelNum").innerHTML = workTel;
    document.getElementById("memberPhoneNum").innerHTML = phoneTel;
    document.getElementById("memberMail").innerHTML = mail;

    if(data.ext === "1"){//vjoin人员
        document.getElementById("memberDeptDiv").style.display = "none";
        document.getElementById("memberLevelDiv").style.display = "none";
        document.getElementById("memberWorkTelNumDiv").style.display = "none";
        document.getElementById("vjoinOrgDiv").style.display = "block";
        document.getElementById("vjoinAccDiv").style.display = "block";
    }else{
        //自定义字段
        if(data.cIf !="" && typeof data.cIf != 'undefined'){
            var cIfList = data.cIf.split(",");
            for(var i = 0;i < cIfList.length;i++){
                var diyRow = cIfList[i].split(":");
                var data = {};
                data.label = diyRow[0];
                data.value = diyRow[1];
                addDiyInfo(data);
            }
        }
    }
}
function addDiyInfo(diyRow) {
    var content = document.getElementById("diyInfo").innerHTML;
    var htmlStr = cmp.tpl(content, diyRow);
    document.getElementById("infoDiv").innerHTML = document.getElementById("infoDiv").innerHTML + htmlStr;
}
function prevPage() {
    // cmp("header").on('tap', "#prev", function(e) {
    //     backFrom();
    // });
    // cmp(".add-detail-back").on('tap', ".see-icon-v5-common-arrow-back", function(e) {
    //     backFrom();
    // });
    //安卓手机返回按钮监听！
    cmp.backbutton();
    cmp.backbutton.push(backFrom);
}

function backFrom() {
    cmp.href.back();
}

/**
 * 获取url传递的参数
 * @returns
 */
function getUrlParam() {
    return urlParam = cmp.href.getParam();
}

//根据平台判断header是否隐藏
function headerShowOrNot() {
    // if (cmp.platform.wechat) { //是微信浏览器
    //     cmp.headerHide();
    // } else { //不是微信浏览器
    // }
    if(document.getElementById("shadow")){
        document.body.removeChild(document.getElementById("shadow"));
    }
}
/**
 * 简化选择器
 * @param selector 选择器
 * @param queryAll 是否选择全部
 * @param 父节点
 * @returns
 */
function _$(selector, queryAll, pEl) {

    var p = pEl ? pEl : document;

    if (queryAll) {
        return p.querySelectorAll(selector);
    } else {
        return p.querySelector(selector);
    }
}

/**
 * 取字符串实际长度
 * @param str
 * @returns {number}
 */
function getReallength(str) {
    var realLength = 0,
        len = str.length,
        charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) realLength += 1;
        else realLength += 2;
    }
    return realLength;
}
