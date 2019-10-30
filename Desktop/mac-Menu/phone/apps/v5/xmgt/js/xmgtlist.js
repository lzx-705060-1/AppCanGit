var tk = window.localStorage.CMP_V5_TOKEN;
tk = tk!=undefined ? tk : ''  ;
//alert(tk)
var header={
    "Accept": "application/json; charset=utf-8",
    "Accept-Language": "zh-CN",
    "Content-Type": "application/json; charset=utf-8",
    "Cookie": "JSESSIONID=",
    "option.n_a_s": "1",
    "token": tk
}
cmp.ajax({
    type: "POST" ,
    data: "",
    //url : cmp.seeyonbasepath+'/cost/formNCController.do?method=userInfo' ,
    url : cmp.seeyonbasepath+'/rest/oa3/revert/queryLoginUserInfo' ,
    async : false,
    headers: header,
    dataType : "html",
    success : function ( r, textStatus, jqXHR ){
        if(r&&r!=""){
            cmp.storage.save("xmgt_loginname",r)
        }
    },
    error: function(r){
        console.log(JSON.stringify(r))
    }
})

var currentPage;//定义当前页面对象

function getUserInfo(){
    //alert(JSON.stringify(cmp.member))
    //alert(typeof(cmp.storage.get("currentUserInfo"))+"--"+cmp.storage.get("currentUserInfo").account)
    //var username = cmp.member.account
    var username = cmp.storage.get("xmgt_loginname")
    //var username = "A019246"
    var obj = new Object()
    //var serviceUrl = "https://mportal.agile.com.cn:8443";
	var serviceUrl = "http://10.1.9.144";
    var url = serviceUrl + "/servlet/PublicServiceServlet?&message_id=nhoa_login&stype=getgroup";
    url = url + "&username=" + username
    obj.url=url
    obj.async=false
    obj.successFun='httpsucess11'
    obj.async=false
    ajaxJson_v1(obj);
}
function httpsucess11(info_list){
    if(info_list.user&&info_list.user!=""){
        cmp.storage.save("loginname",(cmp.storage.get("xmgt_loginname")));
        //cmp.storage.save("serviceUrl","https://mportal.agile.com.cn:8443");
		cmp.storage.save("serviceUrl","http://10.1.9.144");
        cmp.storage.save("org_account_id",info_list.user.org_account_id);
        cmp.storage.save("superior",info_list.user.superior);
    }
}

cmp.ready(function() {
    //cmp.storage.save('serviceUrl', "https://mportal.agile.com.cn:8443");
	cmp.storage.save('serviceUrl', "http://10.1.9.144");
	cmp.storage.save("loginname",(cmp.storage.get("xmgt_loginname")));
    // cmp.storage.save('loginname', "A059571");
    // cmp.storage.save('password', "asdf123");
    //cmp.storage.save("loginname","A019246");
    //cmp.storage.save("password","asdf123");
    getUserInfo();
    jiazai();
    cmp.backbutton.push(cmp.href.closePage)//首页清空堆栈
    if(!cmp.platform.CMPShell) cmp.platform.wechatOrDD = true;
    intiPage();//初始化页面，对页面中的显示进行初始化
    bindEvent();//给页面中的按钮绑定事件
});

function jiazai(){
    var width = window.screen.width
    if (width < 640) {
        if(width<360){
            get_html3()
        }else if (width<400){
            get_html2();
        }else{
            get_html1();
        }
    } else{
        if(width<=720){
            get_html3();
        }else if(width<1200){
            get_html2();
        }else{
            get_html1();
        }
    }

    getGtApply0Data();
    getGtHomeData();
};

function get_html1() {

    var html = '';
    html += '<div style="width: 100%;position: relative;">';
    html += '<img style="width: 100%;height: 13em;position: absolute;" src="../img/fangdichan_sucai-002.jpg?buildversion=96adfa5" />';
    html += '<div style="position: absolute;height: 6em;width: 70%;margin-left: 15%;margin-top:0.8em;background-color: black;opacity: 0.3;text-align: center;border-radius:0.5em;" id="bk">';
    html += '<div style="opacity: 1;font-weight: bold;color: white;margin-top: 0.8em;letter-spacing: 0.15em;opacity:0; ">2019年二季度认购 </div>';
    html += '<div style="opacity: 1;font-weight: bold;color: white;margin-top: 0.6em;letter-spacing: 0.25em;margin-top:0!important;" id ="bm"  >雅居乐跟投管理平台</div>';
    html += '<div style="opacity: 1;font-weight: bold;color: white;margin-top: 0.6em;font-size: 0.7em; display:none" id ="time" >认购截止时间：2016-6-26</div></div>';
    html += '<div style="position: absolute;margin-left: 40%;margin-top:8.5em;font-size: 0.9em;background-color: rgb(255, 165, 0);text-align: center;border-radius:0.4em;padding: 0.35em 0.65em;color: white; display:none" id ="gt" onclick="show_rengou()">我要认购</div>';
    html += '<div style="margin-left:2% ;width: 96%;height: 10em;position: absolute;margin-top: 10em;background-color: #FFFFFF;border-radius: 5px;box-shadow: 0px 3px 5px #888888;">';
    html += '<div style="height: 100%;width: 100%;"><div>';
    html += '<div class="box" style="width: 37%">';
    html += '<div id="xiangmu" style="text-align: center;margin-top: 1em;font-weight: bold;font-size: 1.3em;color: #FC9002">0</div>';
    html += '<div style="text-align: center;font-size: 0.8em;margin-top: 1em;color: gray;">累计跟投项目</div>';
    html += '<div style="text-align: center;border: 1px solid #F4941D;border-radius: 1em;font-size: 0.8em;margin-top: 1em;padding: 0.3em;margin-left: 2em;margin-right: 2em;color: #F4941D;" onclick="show_rengouxiangqing()">跟投详情</div></div>';
    html += '<div class="box" style="width: 61%"><div>';
    html += '<div class="box1" style="width: 47%;">';
    html += '<img src="../img/gt-index-gentou2.png?buildversion=60681e5" style="width: 1.5em;height: 1.5em;display: inline-block;margin-right: 0.5em;" />';
    html += '<div style="display: inline-block;">';
    html += '<div class="box-text1-b box-text1-3" style="margin-top: 0.6em;color: #FF5A59;">';
    html += '<span id="gt_amount" style="font-size: 1.3em;">0.0</span>万</div>';
    html += '<div class="box-text3-b">跟投总额</div></div></div>';
    html += '<div class="box1" style="width: 51%;">';
    html += '<img src="../img/gt-index-jiantou.png?buildversion=24f26c7" style="width: 0.5em;height: 0.8em;display: inline-block;margin-right: 0.5em;" />';
    html += '<div style="display: inline-block;">';
    html += '<div class="box-text-rig" style="text-align: left;font-size:0.7em;">';
    html += '投入金额<span style="color: #FF5A59;margin-left: 0.3em;font-size:1.2em;" id="gt_touru">0.0</span><span style="color:#FF5A59;">万</span></div>';
    html += '<div class="box-text-rig" style="text-align: left;font-size:0.7em;display:none">';
    html += '配资金额<span style="color: #FF5A59;margin-left: 0.3em;font-size:1.2em;" id="gt_peizi">0.0</span><span style="color:#FF5A59;">万</span></div></div></div></div><div>';
    html += '<div class="box1" style="width: 47%;">';
    html += '<img src="../img/gt-index-benjin2.png?buildversion=6f38b52" style="width: 1.5em;height: 1.5em;display: inline-block;margin-right: 0.5em;" />';
    html += '<div style="display: inline-block;">';
    html += '<div class="box-text1-b box-text1-3" style="color: #00AEE1;">';
    html += '<span id="fb_amount" style="font-size: 1.3em;">0.0</span>万</div>';
    html += '<div class="box-text3-b">返本</div></div></div>';
    html += '<div class="box1" style="width: 51%;">';
    html += '<img src="../img/gt-index-jiantou.png?buildversion=24f26c7" style="width: 0.5em;height: 0.8em;display: inline-block;margin-right: 0.5em;" />';
    html += '<div style="display: inline-block;">';
    html += '<div class="box-text-rig" style="text-align: left;font-size:0.7em;">';
    html += '投入返还<span style="color: #00AEE1;margin-left: 0.3em;font-size:1.2em;" id="fb_touru">0.0</span><span style="color:#00AEE1;">万</span></div>';
    html += '<div class="box-text-rig" style="text-align: left;font-size:0.7em;display:none">';
    html += '配资返还<span style="color: #00AEE1;margin-left: 0.3em;font-size:1.2em;" id="fb_peizi">0.0</span><span style="color:#00AEE1;">万</span></div></div></div></div><div>';
    html += '<div class="box1" style="width: 47%;">';
    html += '<img src="../img/gt-index-shouyi.png?buildversion=b1fb86e" style="width: 1.5em;height: 1.5em;display: inline-block;margin-right: 0.5em;" />';
    html += '<div style="display: inline-block;">';
    html += '<div class="box-text1-b box-text1-3" style="color: #00AEE1">';
    html += '<span id="sy_amount" style="font-size: 1.3em;">0.0</span>万</div>';
    html += '<div class="box-text3-b">收益</div></div></div>';
    html += '<div class="box1" style="width: 51%;">';
    html += '<img src="../img/gt-index-jiantou.png?buildversion=24f26c7" style="width: 0.5em;height: 0.8em;display: inline-block;margin-bottom: 0.4em;margin-right: 0.5em;" />';
    html += '<div style="display: inline-block;">';
    html += '<div class="box-text-rig" style="text-align: left;font-size:0.7em;">';
    html += '预分红<span style="color: #00AEE1;margin-left: 1.2em;font-size:1.2em;" id="sy_yufenhong">0.0</span><span style="color:#00AEE1;">万</span></div>';
    html += '<div class="box-text-rig" style="text-align: left;font-size:0.7em;">';
    html += '退出收益<span style="color: #00AEE1;margin-left: 0.3em;font-size:1.2em;" id="tcsy">0.0</span><span style="color:#00AEE1;">万</span>';
    html += '</div></div></div></div></div></div></div></div></div>';

    html += '<div style="width: 100%;margin-top: 21.5em;position: absolute;">';
    html += '<div class="box2" onclick="show_rengou()">';
    html += '<div style="width: 2.5em;height: 2.5em;border-radius: 50%;background-color: #F4941D;margin: auto;position: relative">';
    html += '<img src="../img/gt-index-gongzi.png?buildversion=02cb83c" class="box-img" /></div>';
    html += '<div class="box-text">认购</div></div>';
    html += '<div class="box2"  onclick="show_daishijiao()"><div style="width: 2.5em;height: 2.5em;border-radius: 50%;background-color: #F4941D;margin: auto;position: relative">';
    html += '<img src="../img/gt-index-daifukuan.png?buildversion=1b2a4c4" class="box-img" /></div>';
    html += '<div class="box-text">待实缴</div></div>';
    html += '<div class="box2" onclick="show_fanben()"> <div style="width: 2.5em;height: 2.5em;border-radius: 50%;background-color: #F4941D;margin: auto;position: relative">';
    html += '<img src="../img/gt-index-lirun.png?buildversion=5aa172a" class="box-img" /></div>';
    html += '<div class="box-text" >已返本</div></div>';
    html += '<div class="box2" onclick="show_fenhong()"><div style="width: 2.5em;height: 2.5em;border-radius: 50%;background-color: #F4941D;margin: auto;position: relative">';
    html += '<img src="../img/gt-index-fenhong.png?buildversion=816f61f" class="box-img" /></div>';
    html += '<div class="box-text">已分红</div></div>';
    html += '<div class="box2" onclick="show_tuichu()"><div style="width: 2.5em;height: 2.5em;border-radius: 50%;background-color: #F4941D;margin: auto;position: relative">';
    html += '<img src="../img/gt-index-tuichu.png?buildversion=dd9bbbe" class="box-img" /></div>';
    html += '<div class="box-text">已退出</div></div></div>';

    html += '<div style="position: absolute;height: 2.5em;width: 100%;margin-top: 25.75em;line-height: 2.5em;" id = "ckgd">';
    html += '<div style="display: inline-block;width: 0.3em;height: 0.8em;background-color: rgb(255, 144, 144);margin-left: 1em;"></div>';
    html += '<span style="margin-left: 0.5em;font-fize:0.8em;">最新返本项目</span>';
    html += '<span style="float: right;margin-right: 1em;font-size: 0.8em;color: gray;" onclick="show_fanben()">查看更多</span></div>';

    html += '<div id ="zuixingentou" style="position: absolute; margin-top: 27em;width: 100%;margin-bottom: 50px;padding-bottom:1.5em">';
    html += '</div>';
    $("#gt_content").html(html);
}

function get_html2() {

    var html = '';
    html += '<div style="width: 100%;position: relative;">';
    html += '<img style="width: 100%;height: 13em;position: absolute;" src="../img/fangdichan_sucai-002.jpg?buildversion=96adfa5" />';
    html += '<div style="position: absolute;height: 6em;width: 70%;margin-left: 15%;margin-top:0.8em;background-color: black;opacity: 0.3;text-align: center;border-radius:0.5em;"id="bk">';
    html += '<div style="opacity: 1;font-weight: bold;color: white;margin-top: 0.8em;letter-spacing: 0.15em;opacity:0;">  2019年二季度认购 </div>';
    html += '<div style="opacity: 1;font-weight: bold;color: white;margin-top: 0.6em;letter-spacing: 0.25em;margin-top:0!important;" id ="bm">雅居乐跟投管理平台</div>';
    html += '<div style="opacity: 1;font-weight: bold;color: white;margin-top: 0.6em;font-size: 0.7em;display:none" id ="time">认购截止时间：2016-6-26</div></div>';
    html += '<div style="position: absolute;margin-left: 40%;margin-top:8.5em;font-size: 0.9em;background-color: rgb(255, 165, 0);text-align: center;border-radius:0.4em;padding: 0.35em 0.65em;color: white; display:none"id="gt" onclick="show_rengou()">我要认购</div>';
    html += '<div style="margin-left:2% ;width: 96%;height: 9.25em;position: absolute;margin-top: 10em;background-color: #FFFFFF;border-radius: 5px;box-shadow: 0px 3px 5px #888888;">';
    html += '<div style="height: 100%;width: 100%;"><div>';
    html += '<div class="box" style="width: 33%">';
    html += '<div  id  ="xiangmu" style="text-align: center;margin-top: 1em;font-weight: bold;font-size: 1.3em;color: #FC9002">0</div>';
    html += '<div style="text-align: center;font-size: 0.8em;margin-top: 1em;color: gray;">累计跟投项目</div>';
    html += '<div style="text-align: center;border: 1px solid #F4941D;border-radius: 1em;font-size: 0.7em;margin-top: 1em;padding: 0.2em;margin-left: 2em;margin-right: 2em;color: #F4941D;" onclick="show_rengouxiangqing()">跟投详情</div></div>';
    html += '<div class="box" style="width: 65%"><div>';
    html += '<div class="box1" style="width: 43%;">';
    html += '<img src="../img/gt-index-gentou2.png?buildversion=60681e5" style="width: 1.3em;height: 1.3em;display: inline-block;margin-right: 0.5em;" />';
    html += '<div style="display: inline-block;">';
    html += '<div class="box-text1 box-text1-3" style="margin-top: 0.6em;color: #FF5A59;">';
    html += '<span id ="gt_amount" style="font-size: 1.3em;">0.0</span>万</div>';
    html += '<div class="box-text3">跟投总额</div></div></div>';
    html += '<div class="box1" style="width: 55%;">';
    html += '<img src="../img/gt-index-jiantou.png?buildversion=24f26c7" style="width: 0.4em;height: 0.8em;display: inline-block;margin-right: 0.3em;" />';
    html += '<div style="display: inline-block;">';
    html += '<div class="box-text-rig" style="text-align: left;font-size:0.7em;">';
    html += '投入金额<span style="color: #FF5A59;margin-left: 0.3em;font-size:1.2em;" id ="gt_touru">0.0</span><span style="color:#FF5A59;">万</span></div>';
    html += '<div class="box-text-rig" style="text-align: left;font-size:0.7em;display:none">';
    html += '配资金额<span style="color: #FF5A59;margin-left: 0.3em;font-size:1.2em;" id ="gt_peizi">0.0</span><span style="color:#FF5A59;">万</span>';
    html += '</div></div></div></div><div>';
    html += '<div class="box1" style="width: 43%;">';
    html += '<img src="../img/gt-index-benjin2.png?buildversion=6f38b52" style="width: 1.3em;height: 1.3em;display: inline-block;margin-right: 0.5em;" />';
    html += '<div style="display: inline-block;">';
    html += '<div class="box-text1 box-text1-3" style="color: #00AEE1;">';
    html += '<span id="fb_amount" style="font-size: 1.3em;">0.0</span>万</div>';
    html += '<div class="box-text3">返本</div></div></div>';
    html += '<div class="box1" style="width: 55%;">';
    html += '<img src="../img/gt-index-jiantou.png?buildversion=24f26c7" style="width: 0.4em;height: 0.8em;display: inline-block;margin-right: 0.3em;" />';
    html += '<div style="display: inline-block;">';
    html += '<div class="box-text-rig" style="text-align: left;font-size:0.7em;">';
    html += '投入返还<span style="color: #00AEE1;margin-left: 0.3em;font-size:1.2em;" id ="fb_touru">0.0</span><span style="color:#00AEE1;">万</span></div>';
    html += '<div class="box-text-rig" style="text-align: left;font-size:0.7em;display:none">';
    html += '配资返还<span style="color: #00AEE1;margin-left: 0.3em;font-size:1.2em;" id = "fb_peizi">0.0</span><span style="color:#00AEE1;">万</span>';
    html += '</div></div></div></div><div>';
    html += '<div class="box1" style="width: 43%;">';
    html += '<img src="../img/gt-index-shouyi.png?buildversion=b1fb86e" style="width: 1.3em;height: 1.3em;display: inline-block;margin-right: 0.5em;" />';
    html += '<div style="display: inline-block;">';
    html += '<div class="box-text1 box-text1-3" style="color: #00AEE1">';
    html += '<span id="sy_amount" style="font-size: 1.3em;">0.0</span>万</div>';
    html += '<div class="box-text3">收益</div></div></div>';
    html += '<div class="box1" style="width: 55%;">';
    html += '<img src="../img/gt-index-jiantou.png?buildversion=24f26c7" style="width: 0.4em;height: 0.8em;display: inline-block;margin-bottom: 0.4em;margin-right: 0.3em;" />';
    html += '<div style="display: inline-block;">';
    html += '<div class="box-text-rig" style="text-align: left;font-size:0.7em;">';
    html += '预分红<span style="color: #00AEE1;margin-left: 1.2em;font-size:1.2em;" id="sy_yufenhong">0.0</span><span style="color:#00AEE1;">万</span></div>';
    html += '<div class="box-text-rig" style="text-align: left;font-size:0.7em;">';
    html += '退出收益<span style="color: #00AEE1;margin-left: 0.3em;font-size:1.2em;" id="tcsy">0.0</span><span style="color:#00AEE1;">万</span>';
    html += '</div></div></div></div></div></div></div></div></div>';

    html += '<div style="width: 100%;margin-top: 19.75em;position: absolute;">';
    html += '<div class="box2" onclick="show_rengou()">';
    html += '<div style="width: 2.5em;height: 2.5em;border-radius: 50%;background-color: #F4941D;margin: auto;position: relative">';
    html += '<img src="../img/gt-index-gongzi.png?buildversion=02cb83c" class="box-img"/>';
    html += '</div><div class="box-text">认购</div></div>';
    html += '<div class="box2"  onclick="show_daishijiao()" >';
    html += '<div style="width: 2.5em;height: 2.5em;border-radius: 50%;background-color: #F4941D;margin: auto;position: relative">';
    html += '<img src="../img/gt-index-daifukuan.png?buildversion=1b2a4c4" class="box-img" />';
    html += '</div><div class="box-text">待实缴</div></div>';
    html += '<div class="box2" onclick="show_fanben()">';
    html += '<div style="width: 2.5em;height: 2.5em;border-radius: 50%;background-color: #F4941D;margin: auto;position: relative">';
    html += '<img src="../img/gt-index-lirun.png?buildversion=5aa172a" class="box-img" />';
    html += '</div><div class="box-text">已返本</div></div>';
    html += '<div class="box2" onclick="show_fenhong()">';
    html += '<div style="width: 2.5em;height: 2.5em;border-radius: 50%;background-color: #F4941D;margin: auto;position: relative">';
    html += '<img src="../img/gt-index-fenhong.png?buildversion=816f61f" class="box-img" />';
    html += '</div><div class="box-text">已分红</div></div>';
    html += '<div class="box2" onclick="show_tuichu()">';
    html += '<div style="width: 2.5em;height: 2.5em;border-radius: 50%;background-color: #F4941D;margin: auto;position: relative">';
    html += '<img src="../img/gt-index-tuichu.png?buildversion=dd9bbbe" class="box-img" />';
    html += '</div><div class="box-text">已退出</div></div></div>';

    html += '<div style="position: absolute;height: 2.5em;width: 100%;margin-top: 24em;line-height: 2.5em;" id = "ckgd"> ';
    html += '<div style="display: inline-block;width: 0.3em;height: 0.8em;background-color: rgb(255, 144, 144);margin-left: 1em;"></div>';
    html += '<span style="margin-left: 0.5em;font-fize:0.8em;">最新返本项目</span>';
    html += '<span style="float: right;margin-right: 1em;font-size: 0.8em;color: gray;" onclick="show_fanben()">查看更多</span></div>';

    html += '<div id ="zuixingentou" style="position: absolute; margin-top: 25.25em;width: 100%;margin-bottom: 50px;padding-bottom:1.5em">';
    html += '</div>';
    $("#gt_content").html(html);
}

function get_html3() {
    var html = '';
    html += '<div style="width: 100%;position: relative;">';
    html += '<img style="width: 100%;height: 13em;position: absolute;" src="../img/fangdichan_sucai-002.jpg?buildversion=96adfa5" />';
    html += '<div style="position: absolute;height: 6em;width: 70%;margin-left: 15%;margin-top:0.8em;background-color: black;opacity: 0.3;text-align: center;border-radius:0.5em;" id="bk">';
    html += '<div style="opacity: 1;font-weight: bold;color: white;margin-top: 0.8em;letter-spacing: 0.15em;opacity:0;">  2019年二季度认购 </div>';
    html += '<div style="opacity: 1;font-weight: bold;color: white;margin-top: 0.6em;letter-spacing: 0.25em;margin-top:0!important;" id ="bm">雅居乐跟投管理平台</div>';
    html += '<div style="opacity: 1;font-weight: bold;color: white;margin-top: 0.6em;font-size: 0.7em;display:none" id ="time" >认购截止时间：2016-6-26</div></div>';
    html += '<div style="position: absolute;margin-left: 40%;margin-top:8.5em;font-size: 0.9em;background-color: rgb(255, 165, 0);text-align: center;border-radius:0.4em;padding: 0.35em 0.65em;color: white; display:none" id="gt" onclick="show_rengou()" >我要认购</div>';
    html += '<div style="margin-left:2% ;width: 96%;height: 9.25em;position: absolute;margin-top: 10em;background-color: #FFFFFF;border-radius: 5px;box-shadow: 0px 3px 5px #888888;">';
    html += '<div style="height: 100%;width: 100%;">';
    html += '<div style="margin-top: 0.3em;"><div class="box" style="width: 33%">';
    html += '<div  id  ="xiangmu" style="text-align: center;margin-top: 1em;font-weight: bold;font-size: 1.3em;color: #FC9002">0</div>';
    html += '<div style="text-align: center;font-size: 0.8em;margin-top: 1em;color: gray;">累计跟投项目</div>';
    html += '<div style="text-align: center;border: 1px solid #F4941D;border-radius: 1em;font-size: 0.6em;margin-top: 1em;padding: 0.2em;margin-left: 2em;margin-right: 2em;color: #F4941D;" onclick="show_rengouxiangqing()">跟投详情</div></div>';
    html += '<div class="box" style="width: 65%">';
    html += '<div><div class="box1" style="width: 43%;">';
    html += '<img src="../img/gt-index-gentou2.png?buildversion=60681e5" style="width: 1.3em;height: 1.3em;display: inline-block;margin-right: 0.5em;" />';
    html += '<div style="display: inline-block;">';
    html += '<div class="box-text1 box-text1-3" style="margin-top: 0.6em;color: #FF5A59;">';
    html += '<span id ="gt_amount" style="font-size: 1.2em;">0.0</span>万</div>';
    html += '<div class="box-text3" style="font-size: 0.6em;">跟投总额</div></div></div>';
    html += '<div class="box1" style="width: 53%;">';
    html += '<img src="../img/gt-index-jiantou.png?buildversion=24f26c7" style="width: 0.4em;height: 0.8em;display: inline-block;margin-right: 0.3em;" />';
    html += '<div style="display: inline-block;">';
    html += '<div class="box-text-rig" style="text-align: left;font-size: 0.6em;">';
    html += '投入金额<span style="color: #FF5A59;margin-left: 0.3em;font-size:1.2em;" id ="gt_touru">0.0</span><span style="color:#FF5A59;">万</span></div>';
    html += '<div class="box-text-rig" style="text-align: left;font-size: 0.6em;display:none">';
    html += '配资金额<span style="color: #FF5A59;margin-left: 0.3em;font-size:1.2em;" id ="gt_peizi">0.0</span><span style="color:#FF5A59;">万</span>';
    html += '</div></div></div></div>';
    html += '<div><div class="box1" style="width: 43%;">';
    html += '<img src="../img/gt-index-benjin2.png?buildversion=6f38b52" style="width: 1.3em;height: 1.3em;display: inline-block;margin-right: 0.5em;" />';
    html += '<div style="display: inline-block;">';
    html += '<div class="box-text1 box-text1-3" style="color: #00AEE1;">';
    html += '<span id="fb_amount" style="font-size: 1.2em;">0.0</span>万</div>';
    html += '<div class="box-text3" style="font-size: 0.6em;">返本</div></div></div>';
    html += '<div class="box1" style="width: 53%;">';
    html += '<img src="../img/gt-index-jiantou.png?buildversion=24f26c7" style="width: 0.4em;height: 0.8em;display: inline-block;margin-right: 0.3em;" />';
    html += '<div style="display: inline-block;">';
    html += '<div class="box-text-rig" style="text-align: left;font-size: 0.6em;">';
    html += '投入返还<span style="color: #00AEE1;margin-left: 0.3em;font-size:1.2em;" id ="fb_touru">0.0</span><span style="color:#00AEE1;">万</span></div>';
    html += '<div class="box-text-rig" style="text-align: left;font-size: 0.6em;display:none">';
    html += '配资返还<span style="color: #00AEE1;margin-left: 0.3em;font-size:1.2em;" id = "fb_peizi">0.0</span><span style="color:#00AEE1;">万</span>';
    html += '</div></div></div></div>';
    html += '<div><div class="box1" style="width: 43%;">';
    html += '<img src="../img/gt-index-shouyi.png?buildversion=b1fb86e" style="width: 1.3em;height: 1.3em;display: inline-block;margin-right: 0.5em;" />';
    html += '<div style="display: inline-block;">';
    html += '<div class="box-text1 box-text1-3" style="color: #00AEE1">';
    html += '<span id="sy_amount" style="font-size: 1.2em;">0.0</span>万</div>';
    html += '<div class="box-text3" style="font-size: 0.6em;">收益</div></div></div>';
    html += '<div class="box1" style="width: 53%;">';
    html += '<img src="../img/gt-index-jiantou.png?buildversion=24f26c7" style="width: 0.4em;height: 0.8em;display: inline-block;margin-bottom: 0.4em;margin-right: 0.3em;" />';
    html += '<div style="display: inline-block;">';
    html += '<div class="box-text-rig" style="text-align: left;font-size: 0.6em;">';
    html += '预分红<span style="color: #00AEE1;margin-left: 1.2em;font-size:1.2em;" id="sy_yufenhong">0.0</span><span style="color:#00AEE1;">万</span></div>';
    html += '<div class="box-text-rig" style="text-align: left;font-size: 0.6em;">';
    html += '退出收益<span style="color: #00AEE1;margin-left: 0.3em;font-size:1.2em;" id="tcsy">0.0</span><span style="color:#00AEE1;">万</span>';
    html += '</div></div></div></div></div></div></div></div></div>';

    html += '<div style="width: 100%;margin-top: 19.75em;position: absolute;">';
    html += '<div class="box2" onclick="show_rengou()"><div style="width: 2.5em;height: 2.5em;border-radius: 50%;background-color: #F4941D;margin: auto;position: relative">';
    html += '<img src="../img/gt-index-gongzi.png?buildversion=02cb83c" class="box-img"/></div>';
    html += '<div class="box-text">认购</div></div>';
    html += '<div class="box2" onclick="show_daishijiao()"><div style="width: 2.5em;height: 2.5em;border-radius: 50%;background-color: #F4941D;margin: auto;position: relative">';
    html += '<img src="../img/gt-index-daifukuan.png?buildversion=1b2a4c4" class="box-img" /></div>';
    html += '<div class="box-text">待实缴</div></div>';
    html += '<div class="box2" onclick="show_fanben()"><div style="width: 2.5em;height: 2.5em;border-radius: 50%;background-color: #F4941D;margin: auto;position: relative">';
    html += '<img src="../img/gt-index-lirun.png?buildversion=5aa172a" class="box-img" /></div>';
    html += '<div class="box-text">已返本</div></div>';
    html += '<div class="box2" onclick="show_fenhong()"><div style="width: 2.5em;height: 2.5em;border-radius: 50%;background-color: #F4941D;margin: auto;position: relative">';
    html += '<img src="../img/gt-index-fenhong.png?buildversion=816f61f" class="box-img" /></div>';
    html += '<div class="box-text">已分红</div></div>';
    html += '<div class="box2" onclick="show_tuichu()"><div style="width: 2.5em;height: 2.5em;border-radius: 50%;background-color: #F4941D;margin: auto;position: relative">';
    html += '<img src="../img/gt-index-tuichu.png?buildversion=dd9bbbe" class="box-img" /></div>';
    html += '<div class="box-text">已退出</div></div></div>';

    html += '<div style="position: absolute;height: 2.5em;width: 100%;margin-top: 24em;line-height: 2.5em;" id = "ckgd">';
    html += '<div style="display: inline-block;width: 0.3em;height: 0.8em;background-color: rgb(255, 144, 144);margin-left: 1em;"></div>';
    html += '<span style="margin-left: 0.5em;font-fize:0.8em;">最新返本项目</span>';
    html += '<span style="float: right;margin-right: 1em;font-size: 0.8em;color: gray;" onclick="show_fanben()">查看更多</span></div>';

    html += '<div id ="zuixingentou" style="position: absolute; margin-top: 25.25em;width: 100%;margin-bottom: 50px; padding-bottom:1.5em"></div>';
    $("#gt_content").html(html);
}

function getGtHomeData() {
    var serviceUrl = cmp.storage.get('serviceUrl');
    var loginname = cmp.storage.get('loginname');
    var password = cmp.storage.get('password');
    var obj = new Object();
    obj.url = serviceUrl + "/servlet/PublicServiceServlet";
    obj.data = {
        'message_id' : 'gtpt',
        'branch' : 'home',
        'loginname' : loginname
        //'password' : password
    };
    obj.successFun = 'homeDataSucess';
    ajaxJson_v1(obj);
}

//首页跟投数据
function homeDataSucess(data) {
    var gtpt_docArr = new Array();
    console.log(data.login.DATA);
    if (undefined != data.login.DATA && data.login.DATA.msg == '登录成功') {

        var gtpt_userinfo = data.login.DATA.obj;
        var gtpt_docArr = data.mainPage.DATA.rows;
        cmp.storage.save('gtpt_userinfo', JSON.stringify(gtpt_userinfo));
        cmp.storage.save('gtpt_docArr', JSON.stringify(gtpt_docArr));
        var fanbenmx = data.fanben.DATA.rows;
        var yufenhong = data.yufenhong.DATA.rows;
        var mainArr = data.gtxq.DATA.rows;
        var floor = data.querySum.FLOOR;
        var fanben = data.querySum2.FANBEN;

        //  console.log(fanbenmx)
        // console.log(yufenhong)
        console.log(mainArr)
        //  console.log(floor)
        // console.log(fanben)

        // if(floor!=''&&fanben!=''){
        cmp.storage.save('mainArr', JSON.stringify(mainArr));
        cmp.storage.save('floor', JSON.stringify(floor));
        cmp.storage.save('fanben', JSON.stringify(fanben));
        //}
        cmp.storage.save('fanbenmx', JSON.stringify(fanbenmx));
        cmp.storage.save('yufenhong', JSON.stringify(yufenhong));
        var xiangmu = 0;
        var gt_amount = 0;
        var fb_amount = 0;
        var sy_amount = 0;
        var gt_touru = 0;
        var gt_peizi = 0;
        var fb_touru = 0;
        var fb_peizi = 0
        var sy_yufenhong = 0;
        var sy_tuichu = 0;
        var yunxin = 0;
        var aa=0;
        var tcsy=data.tcsy.TCSY//退出收益
        if(tcsy==null||tcsy==""){
            tcsy=0
        }else{
            tcsy=Number(tcsy)
        }
        cmp.storage.save('tcsy', JSON.stringify(tcsy));
        //去掉重复项目名 获取项目数量
        // var result = [],
        // isRepeated;
        // var touru = [];
        // for (var i = 0; i < mainArr.length; i++) {
        // if(mainArr[i].realamountTotal!=0){
        // isRepeated = false;
        // for (var j = 0; j < result.length; j++) {
        // if (mainArr[i].projectname == result[j]) {
        // isRepeated = true;
        // break;
        // }
        // }
        // if (!isRepeated) {
        // result.push(mainArr[i].projectname);
        // }
        // }
        // }

        for (var i = 0; i < mainArr.length; i++) {


            if ('运行中' == mainArr[i].status || '退出中' == mainArr[i].status || '退出关闭' == mainArr[i].status || '合伙人签订中' == mainArr[i].status || '跟投人签订中' == mainArr[i].status || '已退出' == mainArr[i].status) {

                xiangmu++;

            }
        };


        for (var i = 0; i < mainArr.length; i++) {

            yunxin += 1;
            var realamount = Number(mainArr[i].realamountTotal);
            //投入
            var releaseamount = Number(mainArr[i].releaseamount);
            //返本
            var devidendamount = Number(mainArr[i].devidendamount);
            //预分红
            var matchMount = Number(mainArr[i].matchMount);//配资
            if (String(realamount) != 'NaN' && String(matchMount) != 'NaN') {
                /// gt_amount = realamount + matchMount ;
                gt_touru += realamount


                if (realamount !=null&&realamount!=''){

                    console.log(matchMount)

                    //跟投投入
                    gt_peizi += matchMount//跟投配资
                }

                gt_amount = gt_touru + gt_peizi;
                //跟投总额
            }


            //fb_amount +=  Number(mainArr[i].releaseamount); //投入返本
            fb_touru+=Number(mainArr[i].releaseamount); //投入返本
            for (var j = 0; j < fanbenmx.length; j++) {//返本明细

                if (fanbenmx[j].p_name == mainArr[i].projectname) {
                    var proportion = fanbenmx[j].proportion;
                    //返本比利
                    proportion = proportion.substring(0, proportion.length);
                    proportion = proportion / 100

                    fb_peizi += Number((matchMount * proportion).toFixed(2));
                    //配资返本
                    //fb_touru   = Number(fb_amount)- Number(fb_peizi)//返本总额
                    fb_amount   = Number(fb_touru)+Number(fb_peizi)//返本总额
                }
            }

            if (String(devidendamount) != 'NaN') {
                sy_yufenhong += devidendamount;
                sy_amount = sy_yufenhong + tcsy;
            }

        }

        xiangmu = isxiaoshu(xiangmu);
        gt_amount = isxiaoshu(gt_amount);
        fb_amount = isxiaoshu(fb_amount);
        sy_amount = isxiaoshu(sy_amount);
        gt_touru = isxiaoshu(gt_touru);
        gt_peizi = isxiaoshu(gt_peizi);
        fb_touru = isxiaoshu(fb_touru);
        fb_peizi = isxiaoshu(fb_peizi);
        sy_yufenhong = isxiaoshu(sy_yufenhong);

        $("#xiangmu").text(xiangmu);
        $("#gt_amount").text(gt_amount.toFixed(1));
        $("#fb_amount").text(fb_amount.toFixed(1));
        $("#sy_amount").text(sy_amount.toFixed(1));
        $("#gt_touru").text(gt_touru.toFixed(1));
        $("#gt_peizi").text(gt_peizi.toFixed(1));
        $("#fb_touru").text(fb_touru.toFixed(1));
        $("#fb_peizi").text(fb_peizi.toFixed(1));
        $("#sy_yufenhong").text(sy_yufenhong.toFixed(1));
        $("#tcsy").text(tcsy.toFixed(1));

        var html = '';
        var j = 0;
        var k =0;
        rengou();
        zuixinFanben();


     } else if (undefined == data.login.DATA.msg) {
        /* cmp.notification.alert("跟投平台连接失败！请重试",function(){
        },"提示","确定","",false,false);
 */
    } else {
       /* cmp.notification.alert("用户不存在",function(){
        },"提示","确定","",false,false); */
    }
}

//判断小数点后数字是否大于2位
function  isxiaoshu(obj){
    if((obj.toString()).indexOf(".") !=-1 ){
        if (obj.toString().split(".")[1].length>2){
            obj=Math.round(obj*100)/100
            /// Number(obj).toFixed(2);
        }
    }
    return obj;

}


//获取认购数据
function getGtApply0Data() {
    $("#gt_apply_content #gt_listview2").addClass("uhide");
    $("#gt_apply_content #gt_listview").removeClass("uhide");
    var serviceUrl = cmp.storage.get('serviceUrl');
    var loginname = cmp.storage.get('loginname');
    var password = cmp.storage.get('password');
    var obj = new Object();
    obj.url = serviceUrl + "/servlet/PublicServiceServlet";
    obj.data = {
        'message_id' : 'gtpt',
        'branch' : 'apply',
        'loginname' : loginname
        //'password' : password
    };
    obj.successFun = 'apply0DataSucess';
    ajaxJson_v1(obj);
}

function apply0DataSucess(data) {
    
	if (undefined != data.login.DATA && data.login.DATA.msg == '登录成功') {
		var rgArr = data.rgquery.DATA.rows;
		cmp.storage.save('rgArr', JSON.stringify(rgArr));
	
	} else if (undefined == data.login.DATA.msg) {
		cmp.notification.alert("跟投平台连接失败！请重试",function(){
			cmp.href.back()
		},"提示","确定","",false,false);
	} else {
		cmp.notification.alert(data.login.DATA.msg,function(){
			cmp.href.back()
		},"提示","确定","",false,false);
	
	}
}

function show_rengou() {
    cmp.href.next(xmgtBasePath +"/html/gtpt_rgapply.html",{data:""},"left");
}

function show_fanben() {
    cmp.href.next(xmgtBasePath +"/html/gtpt_fanben.html",{data:""},"left");
    //cmp.href.next(xmgtBasePath +"/html/gtpt_fanben.html",{},{openWebViewCatch: true,nativeBanner: true})
    //cmp.href.next(xmgtBasePath +"/html/gtpt_fanben.html?useNativebanner=1",{data:""},"left");
}

function show_fenhong() {
    cmp.href.next(xmgtBasePath +"/html/gtpt_grfh.html",{data:""},"left");
}

function show_tuichu() {
    cmp.href.next(xmgtBasePath +"/html/gtpt_tuichu.html",{data:""},"left");
}

function show_daishijiao() {
    cmp.href.next(xmgtBasePath +"/html/gtpt_zzxinxi.html",{data:""},"left");
}

function show_rengouxiangqing() {
    cmp.href.next(xmgtBasePath +"/html/gtpt_rgxiangqing.html",{data:""},"left");
}

function zuixinFanben(){
    var fanben = cmp.storage.get('fanbenmx');
    fanben = JSON.parse(fanben);

    html ='';
    if(fanben.length!=0){
        var date =fanben[0].returnDate;
        html += '<div  style="width: 90%;margin-top:1.5em;margin-left: 5%;font-size: 0.8em;color: gray">';

        for (var i=0; i < fanben.length; i++) {
            if(fanben[i].returnDate==date){
                html+= "<div  style='width: 100%;BACKGROUND-COLOR: #DEEBF7;margin-top: 1%;padding-top: 1%;padding-bottom: 1%'>"
                html += '<span style="margin-left: 1.5%;position: absolute; ">'+fanben[i].p_name+'</span>';
                html +='<span style="margin-left: 45%;position: absolute;" >返本';
                html +=fanben[i].proportion == "" ? "" : fanben[i].proportion+"%</span>";
                html +='<span style="margin-left: 75%">'+fanben[i].returnDate+'</span>'
                html+= "</div>"
            }
        };
        html += '</div>';


        var yfenhong = cmp.storage.get('yufenhong');
        yfenhong = JSON.parse(yfenhong)
        if(yfenhong.length!=0){
            html += '<div style="height: 2.5em;width: 100%;line-height: 2.5em;" id = "ckgd">';
            html += '<div style="display: inline-block;width: 0.3em;height: 0.8em;background-color: rgb(255, 144, 144);margin-left: 1em;"></div>';
            html += '<span style="margin-left: 0.5em;font-fize:0.8em;">最新预分红项目</span>';
            html += '<span style="float: right;margin-right: 1em;font-size: 0.8em;color: gray;" onclick="show_fenhong()">查看更多</span></div>';
            html += '</div>';
            var date1=yfenhong[0].bonustime
            html += '<div  style=" width: 90%;margin-left: 5%;font-size: 0.8em;color: gray">';
            for (var i=0; i < yfenhong.length; i++) {
                if(yfenhong[i].bonustime==date1){
                    html+= "<div style='width: 100%;BACKGROUND-COLOR: #DEEBF7;margin-top: 1%; padding-top: 1%;padding-bottom: 1%'>"
                    html += '<span style="margin-left: 1.5%; position: absolute; ">'+yfenhong[i].p_name+'</span>';
                    html += '<span style="margin-left: 45%;position: absolute;">预分红';
                    html += yfenhong[i].rateMount == undefined ? "" : yfenhong[i].rateMount+'</span>';
                    html +='<span style="margin-left: 75%">'+yfenhong[i].bonustime+'</span>'

                    html+= "</div>"
                }

            };
            html += '</div>';
        }else{
            html += '<div style="height: 2.5em;width: 100%;line-height: 2.5em;" id = "ckgd">';
            html += '<div style="display: inline-block;width: 0.3em;height: 0.8em;background-color: rgb(255, 144, 144);margin-left: 1em;"></div>';
            html += '<span style="margin-left: 0.5em;font-fize:0.8em;">最新预分红项目</span>';
            html += '<span style="float: right;margin-right: 1em;font-size: 0.8em;color: gray;" onclick="show_fenhong()">查看更多</span></div>';
            html += '</div>';
            html += '<div  style=" width: 90%;margin-left: 5%;font-size: 0.8em;color: gray">';
            html+= "<div style='width: 100%;BACKGROUND-COLOR: #DEEBF7;margin-top: 1%; padding-top: 1%;padding-bottom: 1%'>"
            html += '<span style="margin-left: 1.5%; ">暂无预分红项目！</span>';
            html+= "</div>"
            html+= "</div>"
            html += '</div>';
        }
    }else{
        html += '<div  style=" width: 90%;margin-top:1.5em;margin-left: 5%;font-size: 0.8em;color: gray">';
        html+= "<div style='width: 100%;BACKGROUND-COLOR: #DEEBF7;margin-top: 1%; padding-top: 1%;padding-bottom: 1%'>"
        html += '<span style="margin-left: 1.5%; ">暂无返本项目！</span>';
        html+= "</div>"
        html+= "</div>"
    }
    $("#zuixingentou").html(html);
}


//获取认购截止时间
function rengou() {
    var serviceUrl = cmp.storage.get('serviceUrl');
    var loginname = cmp.storage.get('loginname');
    var password = cmp.storage.get('password');
    var obj = new Object();
    obj.url = serviceUrl + "/servlet/PublicServiceServlet";
    obj.data = {
        'message_id' : 'gtpt',
        'branch' : 'apply',
        'loginname' : loginname
        //'password' : password
    };
    obj.successFun = 'applyDataSucess';
    ajaxJson_v1(obj);
}

var applyObj;
function applyDataSucess(data) {
    applyObj = data.rgquery.DATA.rows;
    console.log(applyObj)
    if(applyObj == null || applyObj ==undefined){
        return "";
    }
    else if (applyObj.length == 0) {
        rengoujiezhi();
    }else{
        var end_time = getConvertTime(applyObj[0].end_time);
        var date =getConvertTime(new Date().getTime());

        $("#time").text("认购截止时间："+end_time);
        $("#time").show();
        $("#gt").show();
        if(date>end_time){
            rengoujiezhi();
        }
    }
}


//将时间戳转换方便阅读的时间
function getConvertTime(timestamp) {
    if (undefined == timestamp || null == timestamp) {
        return "";
    } else {
        var entrytime = new Date(timestamp);
        var year = entrytime.getFullYear();
        var month = entrytime.getMonth() + 1;
        var date = entrytime.getDate();
        var hours = entrytime.getHours();
        var seconds = entrytime.getSeconds();
        var minutes = entrytime.getMinutes();
        if (month < 10) {
            month = "0" + month;
        }
        if (date < 10) {
            date = "0" + date;
        }
        if (hours < 10) {
            hours = "0" + hours;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        return year + '-' + month + '-' + date + ' ' + hours + ':' + seconds;
    }
}

//获取实缴截止时间
function rengoujiezhi(){

    var serviceUrl = cmp.storage.get('serviceUrl');
    var loginname = cmp.storage.get('loginname');
    var password = cmp.storage.get('password');
    var obj2 = new Object();
    obj2.url = serviceUrl + "/servlet/PublicServiceServlet";
    obj2.data = {
        'type':'post',
        'message_id' : 'gtpt',
        'branch' : 'shoukuan',
        'loginname' : loginname
        //'password' : password
    };
    obj2.successFun = 'selectShoukuanSucess';
    ajaxJson_v1(obj2);
}

function selectShoukuanSucess(data){
    var json =data.zhuanzhang.DATA ;
    json =JSON.parse(json)
    if(json.length!=0){
        console.log(json);
        var intmantime='';//实缴截止时间
        var endtime =  getConvertTime(json[0].end_time);//认购截止时间
        var a =false;
        var b =false;
        var   payBatch ;
        var intmantime2='';
        var m;
        for(var i =0;i<json.length;i++){
            payBatch = json[i].payBatch;

            if(payBatch!=undefined){
                m = payBatch.substring(4,6);
                if(m<10){
                    m=m.substring(1,2);
                }
            }
            var confirm_amount =json[i].confirm_amount==undefined ?'0':json[i].confirm_amount
            console.log(confirm_amount);

            if(payBatch>json[0].payBatch){
                b=true;
                if(confirm_amount!=0){
                    intmantime2 =json[i-1].intmantime;
                }
            }

            if(json[i].intmantime!=undefined){
                a=true
                if(confirm_amount!=0&& b==false){
                    intmantime  =json[i].intmantime;
                }

            }



            console.log(json.length);
        }

        console.log(a);
        var o= document.getElementById("gt");
        $("#gt").html("我要实缴");

        if(a==true){
            $("#gt").html("我要实缴");
            if(intmantime2!=''){
                intmantime2 =intmantime2.substring(0,10)
                intmantime= intmantime.substring(0,10)
                var yue = m-1;
                if(intmantime!=''){
                    $("#time").text("实缴截止时间："+intmantime2+'/'+intmantime);
                }else{
                    $("#time").text("实缴截止时间："+intmantime2);
                }

                $("#time").show();
            }else if(intmantime!=''){
                intmantime= intmantime.substring(0,10)
                $("#time").text("实缴截止时间："+intmantime);
                $("#time").show();
            }
            $("#gt").show();
            $("#bm").text("跟投项目额度已确认")
            gt.onclick  = show_daishijiao;

        }else{


            var date =getConvertTime(new Date().getTime());
            $("#gt").show();
            $("#time").show();
            $("#time").text("认购截止时间："+endtime);

        }

        var date =getConvertTime(new Date().getTime());

        /* if(date>intmantime){
              $("#bm").html("跟投项目已结束");
              $("#gt").hide();
              $("#time").hide();
         }  */
    }

}

//获取我的页面数据
function getGtMineData() {
    var html = '';
    html += '<div class="basecontent">';
    html += '<div class="ub baseline" style=" color:#FFA500;" >';
    html += '基本信息';
    html += '</div>';
    html += '<div class="ub t_black">';
    html += '<div class="t_employee_code" id="t_employee_code">';
    html += '工&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号：';
    html += '<span class="ziti_hei" id="code"></span>';
    html += '</div>';
    html += '</div>';
    html += '<div class="ub t_black">';
    html += '<div class="t_employee_name">';
    html += '姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：';
    html += '<span class="ziti_hei" id="name"></span>';
    html += '</div>';
    html += '</div>';
    html += '<div class="ub t_black">';
    html += '<div class="t_sex">';
    html += '性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别：';
    html += '<span class="ziti_hei" id="sex"></span>';
    html += '</div>';
    html += '</div>';
    html += '<div class="ub t_black">';
    html += '<div class="t_nation">';
    html += '国&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;籍：';
    html += '<span class="ziti_hei" id="nation"></span>';
    html += '</div>';
    html += '</div>';
    html += '<div class="ub t_black">';
    html += '<div class="t_identityno">';
    html += '身份证号码：';
    html += '<span class="ziti_hei" id="identityno"></span>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '<div class="basecontent">';
    html += '<div class="ub baseline" style=" color:#FFA500;">';
    html += ' 银行信息';
    html += '</div>';
    html += '<div class="ub t_black">';
    html += '<div class="t_accountname">';
    html += '开户名称：';
    html += '<span class="ziti_hei" id="accountname"></span>';
    html += '</div>';
    html += '</div>';
    html += '<div class="ub t_black">';
    html += '<div class="t_accountcode">';
    html += '银行账号：';
    html += '<span class="ziti_hei" id="accountcode"></span>';
    html += '</div>';
    html += '</div>';
    html += '<div class="ub t_black">';
    html += '<div class="t_bankname">';
    html += '开户银行：';
    html += '<span class="ziti_hei" id="bankname"></span>';
    html += '</div>';
    html += '</div>';
    html += '<div class="ub t_black">';
    html += '<div class="t_bankcode">';
    html += '银行联行号：';
    html += '<span class="ziti_hei" id="bankcode"></span>';
    html += '</div>';
    html += '</div>';
    html += '</div>';


    html += '<div class="basecontent">';
    html += '<div class="ub baseline" style=" color:#FFA500;">';
    html += '跟投资金名词解释';
    html += '</div>';
    html += '<div class="ub t_black">';
    html += '<div class="t_accountname">';
    html += '<span style="color:#000000">1、实缴金额：</span></br>跟投人在项目发布时统一实缴的自有资金。';
    html += '</div>';
    html += '</div>';
    html += '<div class="ub t_black">';
    html += '<div class="t_accountcode">';
    html += '<span style="color:#000000">2、投入金额：</span></br>跟投人在参投项目中的自有资金投入（包含从其他跟投人处受让过来的金额）。</br>投入金额= 实缴金额 - │出让金额│ + 受让金额';
    html += '</div>';
    html += '</div>';
    html += '<div class="ub t_black">';
    html += '<div class="t_bankname">';
    html += '<span style="color:#000000">3、杠杆配资：</span></br>公司为强制跟投参与人提供每项目跟投下限一定占比的配资额度，按年化利率10%由雅居乐方收取配资利息，根据配资的实际占用时间来计息；跟投人获得配资部分的劣后收益和承担配资部分的劣后义务。';
    html += '</div>';
    html += '</div>';
    html += '<div class="ub t_black">';
    html += '<div class="t_bankcode">';
    html += '<span style="color:#000000">4、跟投份额：</span></br>跟投人在参投项目中的分红占比权益金额，含杠杆配资。</br>跟投份额 = 投入金额 + 配资金额';
    html += '</div>';
    html += '</div>';
    html += '<div class="ub t_black">';
    html += '<div class="t_bankcode">';
    html += '<span style="color:#000000">5、出让金额：</span></br>项目未100%“返本”前，退出项目的跟投份额（包括离职/调离转让退出、特殊退出等），显示为负值。</br>注：只要发生转让退出的，均取消杠杆配资，故此处的跟投份额不含杠杆配资，等同实缴金额。';
    html += '</div>';
    html += '</div>';
    html += '<div class="ub t_black">';
    html += '<div class="t_bankcode">';
    html += '<span style="color:#000000">6、受让金额：</span></br>从离职/调离员工处接受转让的跟投份额。</br>注：发生受让的，受让金额在系统会新增一行独立显示。';
    html += '</div>';
    html += '</div>';
    html += '<div class="ub t_black">';
    html += '<div class="t_bankcode">';
    html += '<span style="color:#000000">7、“返本”：</span></br>以投入金额为限进行的项目盈余资金分配。（为便于查看，移动端取消引号“”显示）';
    html += '</div>';
    html += '</div>';
    html += '<div class="ub t_black">';
    html += '<div class="t_bankcode">';
    html += '<span style="color:#000000">8、“预分红”：</span></br>个人收到的超过投入资金的项目盈余资金，跟投收益以项目最终结算净利润为准。（为便于查看，移动端取消引号“”显示）';
    html += '</div>';
    html += '</div>';
    html += '</div>';


    $("#gt_userinfo_content #boxcontent").html(html);
    var gt_userinfo = cmp.storage.get('gtpt_userinfo');
    var userinfo = JSON.parse(gt_userinfo);


    $('#code').text(userinfo.isLand);
    $('#name').text(userinfo.employee_name);
    $('#sex').text(userinfo.sex);
    $('#nation').text(userinfo.nation);
    $('#identityno').text(userinfo.identityno);
    $('#email').text(userinfo.email);
    $('#dept').text(userinfo.deptname);
    $('#employeepost').text(userinfo.jobname);
    $('#employeelevel').text(userinfo.employee_level);
    $('#officenumber').text(userinfo.officenumber);
    $('#officecornet').text(userinfo.officecornet);
    $('#mobilenumber').text(userinfo.mobilenumber);
    $('#zhuanzhen').text(userinfo.zhuanzheng);
    $('#ifinvest').text(userinfo.ifinvest);
    $('#accountname').text(userinfo.accountname);
    $('#accountcode').text(userinfo.accountcode);
    $('#bankname').text(userinfo.bankname);
    $('#bankcode').text(userinfo.bankcode);
}

//获取跟投详情数据***************************************************
function fnGoxiangqingPage() {
    var serviceUrl = cmp.storage.get('serviceUrl');
    var loginname = cmp.storage.get('loginname');
    var password = cmp.storage.get('password');
    var obj = new Object();
    obj.url = serviceUrl + "/servlet/PublicServiceServlet";
    obj.data = {
        'message_id': 'gtpt',
        'branch': 'home',
        'loginname': loginname
        //'password': password
    };
    obj.successFun = 'getGtApply0';
    ajaxJson_v1(obj);
    //getGtApply0Data();
}

//获取认购数据
function getGtApply0(data) {
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

//获取跟投详情数据***************************************************

// 页面跳转


function intiPage(){
    //获取回退参数
    var backParam = cmp.href.getBackParam("pagetip")
    if (backParam!="" && backParam!=null){
        $(".cmp-tabview-item").each(function(index){
            var tabtip = $(this).attr("href")
            if(tabtip.indexOf(backParam)!=-1){
                $(this).addClass("cmp-active")
            }else{
                $(this).removeClass("cmp-active")
            }
        })
        $(".cmp-control-content").each(function(index){
            var tabtip = $(this).attr("id")
            if(tabtip.indexOf(backParam)!=-1){
                $(this).addClass("cmp-active")
            }else{
                $(this).removeClass("cmp-active")
            }
        })
        loadData(backParam)
    }
    else{
        loadData("tabbar1")
    }
    //document.getElementById("currentDay").innerHTML = formatDay + "  " + currentDay;
    //document.getElementById("signTime").innerHTML = formatTime;
}

function loadData(containId){
    if(containId != currentPage){
        // _$(containId).style.display = "";
        // document.getElementById(containId).style.display="";
        //document.getElementById(containId).style.marginTop=document.getElementsByTagName("header")[0].offsetHeight+"px";

        currentPage = containId;
        loadData2(containId)
    }
}

function loadData2(containId){
    if(containId=="tabbar1"){
        document.title ="首页";
        //document.getElementById("cmp-header-right").innerHTML="";
        //var htmlStr = '<div class="ub ub-ver">'
        //htmlStr+='<div class="ub-f1 ub ub-ver">'
        //htmlStr+='<span class="title-scope"><label style="width:0.6em;height:1em;background-color: #00Caf9;float: left;position: relative;top:0.67em;left:0.3em;"></label>&nbsp;员工服务</span>'
        //htmlStr+=''
        // var classObj = document.getElementsByClassName("ub-pc")
        // for(i=0;i<classObj.length;i++){
        //     classObj[i].addEventListener("tap",fnGoLinkPage)
        // }
        //addEventListener("tap",homeDataSucess);

    }else if(containId=="tabbar2"){
        document.title ="跟投详情";
        //document.getElementById("cmp-header-right").innerHTML="";
        fnGoxiangqingPage()
    }else if(containId=="tabbar3"){
        document.title ="我的";
        //document.getElementById("cmp-header-right").innerHTML="";
        getGtMineData()
    }
}

function bindEvent(){
    //给头部返回按钮绑定事件
    /*document.getElementById("backBtn").addEventListener("tap",function(){
        cmp.href.closePage();//关闭页面，清空历史堆栈
    });*/

    //跳转到首页
    document.getElementById("home").addEventListener("tap",getGtHomeData2);
    //跳转到认购
    document.getElementById("rgapply").addEventListener("tap",show_rengou);
    //跳转到跟投详情页面
    document.getElementById("rgxiangqing").addEventListener("tap",fnGoFunctionPage);
    //跳转到我的页面
    document.getElementById("wode").addEventListener("tap",fnGoSettingPage);

}

/********************************** 页面跳转  ***********************************/

function getGtHomeData2() {
    if("#tabbar1" == currentPage) return;
    loadData("tabbar1")
    //cmp.href.next(xmgtBasePath +"/html/xmgtlist_home.html");//跳转到首页
}
function fnGoFunctionPage() {
    if("#tabbar2" == currentPage) return;
    loadData("tabbar2")
    //cmp.href.next(xmgtBasePath +"/html/xmgtlist_app.html");//跳转到跟投详情
}
function fnGoSettingPage() {
    if("#tabbar3" == currentPage) return;
    loadData("tabbar3")
    //cmp.href.next(xmgtBasePath +"/html/xmgtlist_setup.html");//跳转到我的页面
}



