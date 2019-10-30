cmp.ready(function() {
			
			 //隐藏滚动条
			//uexWindow.setWindowScrollbarVisible(false);
			 //获取搜索框的高度赋值给列表
			var titHeight = $('#searchTop').offset().top;
			$("#dwxwlist").css('marginTop', titHeight);
			
			bindEvent();//给页面中的按钮绑定事件

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
			            cmp.storage.save("loginname",r)
			        }
			    },
			    error: function(r){
			        console.log(JSON.stringify(r))
			    }
			})
			cmp.storage.save("serviceUrl", 'https://mportal.agile.com.cn:8443')
			getList(1);
			cmp.backbutton();//将Android返回按钮劫持
			cmp.backbutton.push(cmp.href.back);//向返回按钮堆栈加入回退到上一个页面的函数
        });
		
		
        $("#nav-left").on("tap", function() {
            cmp.href.back();
        })
		function bindEvent() {
		    document.getElementById("search").addEventListener("tap", function () {
		        var infoName = $('#infoName').val();
		        if (infoName == "" || infoName == null) {
		            cmp.notification.alert("输入条件不能为空！", function () {
		            }, "提示", "确定", "", false, false);
		        } else {
		            getListSuoSo(infoName, 1);
		        }
		    });
		}

		
		function getList(page) {
			var obj = new Object();
		    var serviceUrl = cmp.storage.get('serviceUrl');
		    var phoneid = cmp.storage.get('phoneid');
		    var typeid = cmp.storage.get('typeid');
			typeid = "-926762446964306366";
		    //var memberid = cmp.storage.get('userid');
		    var loginname = cmp.storage.get('loginname');
		    //var password = cmp.storage.get('password');
		    // var url = serviceUrl + "/servlet/PublicServiceServlet?&message_id=nhoa_news";
		    // url = url + "&PHONE_ID=" + phoneid+"&memberid="+memberid+"&typeid="+typeid+"&pageNo="+page;
		    var url = serviceUrl + "/servlet/PublicServiceServlet?&message_id=newoa_list&stype=newslist";
		    url = url + "&username=" + loginname + "&PHONE_ID=" + phoneid + "&typeid=" + typeid + "&pageno=" + page;
		    console.log(url);
		    obj.url = url;
		    obj.successFun = "httpsucess";
		    ajaxJson_v1(obj);
		}
		
		//字符串转日期格式，strDate要转为日期格式的字符串
		function getDate(strDate) {
		    var date = eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/, function(a) {
		        return parseInt(a, 10) - 1;
		    }).match(/\d+/g) + ')');
		    return date;
		}
		
		function httpsucess(info_list) {
		    console.log(info_list);
		    var date = new Date();
		    var info_list_mode = new Array(info_list['newslist'].LIST.length);
		    var platform = cmp.storage.get('platform');
		
		    console.log(info_list['newslist'].LIST.length);
		    for (i = 0; i < info_list['newslist'].LIST.length; i++) {
		        var info_mode = new Object();
		        info_mode.id = info_list['newslist'].LIST[i].id;
		        info_mode.title = info_list['newslist'].LIST[i].title;
		        info_mode.publish_user = info_list['newslist'].LIST[i].publish_user;
		        info_mode.publish_date = info_list['newslist'].LIST[i].publish_date;
		        info_mode.describe = "<div >" + info_list['newslist'].LIST[i].publish_user + info_list['newslist'].LIST[i].publish_date + "</div>";
		
		        var services_date = new Date(info_list['newslist'].LIST[i].publish_date);
		        /* if (platform.toLowerCase() == 'ios') {
		             services_date = getDate(info_list['newslist'].LIST[i].publish_date);
		         }*/
		        var iDays = (date.getTime() - services_date.getTime()) / 1000 / 60 / 60 / 24;
		        //把相差的毫秒数转换为天数
		        if (iDays <= 3) {
		            info_mode.title = "<div style='font-weight:bold;'>" + info_list['newslist'].LIST[i].title + "</div>";
		            info_mode.describe = "<div style='font-weight:bold;'>" + info_mode.describe + "</div>";
		        }
		
		        info_list_mode.push(info_mode);
		    }
		    console.log(info_list_mode);
		
		    var html = ""
		    html += '<ul>'
		    for (i = 0; i < info_list_mode.length; i++) {
		        if (info_list_mode[i] == null) {
		            continue;
		        }
		        html += '<li class="ubb ub bc-border t-bla ub-ac lis" data-index="' + i + '">'
		        html += '<ul class="ub-f1 ub ub-pj ub-ac">'
		        html += '<ul class="ub-f1 ub ub-ver marg-l">'
		        html += '<li class="bc-text ub ub-ver ut-m line3">'
		        html += info_list_mode[i].title
		        html += '<div>'
		        html += info_list_mode[i].publish_user;
		        html += info_list_mode[i].publish_date;
		        html += '</div>'
		        html += '</li>'
		        html += '</ul>'
		        html += '<li class="fa fa-angle-right ulev2">'
		        html += '</li>'
		        html += '</ul>'
		
		
		        html += '</li>'
		    }
		    html += '</ul>'
		    $("#goodsList").html(html);
		    $('#goodsList>ul>li').each(function (index, item) {
		        if ($(item).data('index') && ($(item).data('index') % 2 == 1)) {
		            $(item).css("background-color", "#77CFAD");
		        } else {
		
		        }
		    });
		    $("#goodsList>ul>li").on('tap', function(event) {
		        //console.log(ele, obj, subobj);
		        //openDetail(encodeURI(obj.id), obj.title);
				openDetail(info_list_mode[event.currentTarget.attributes["data-index"].value])
		    });
		
		    function openDetail(obj) {
		        // cmp.href.next({
		        //     name : 'newsdetail',
		        //     data : 'newsdetail.html',
		        //     aniId : 10
		        // });
		        var extData = {
		            'newsid': obj.id,
		            'title': obj.title
		        }
		    	cmp.href.next("/seeyon/m3/apps/v5/mtbd/html/newsdetail.html", extData, {openWebViewCatch: true, nativeBanner: true})
		    }
		
		}
		
		//搜索
		function getListSuoSo(title, page) {
		    var paramObj = cmp.href.getParam();
		    var serviceUrl = cmp.storage.get('serviceUrl');
		    var phoneid = cmp.storage.get('phoneid');
		    var typeid = cmp.storage.get('typeid');
		    typeid = "-926762446964306366";
		    var memberid = cmp.storage.get('userid');
		    var loginname = cmp.storage.get('loginname');
		    //var password = cmp.storage.get('password');
		    var url = serviceUrl + "/servlet/PublicServiceServlet?&message_id=newoa_list&stype=newsqry";
		    url = url + "&username=" + loginname +  "&PHONE_ID=" + phoneid + "&newstypeid=" + typeid + "&typeid=" + typeid + "&pageno=" + page + "&key=" + title;
		    var obj = new Object();
		    obj.url = url;
		    obj.successFun = "httpsucess1";
		    ajaxJson_v1(obj);
		}
		
		function httpsucess1(info_list) {
		    console.log(info_list);
		    var info_list_mode = new Array(info_list['newsqry'].LIST.length);
		    console.log(info_list['newsqry'].LIST.length);
		    for (i = 0; i < info_list['newsqry'].LIST.length; i++) {
		        var info_mode = new Object();
		        info_mode.id = info_list['newsqry'].LIST[i].id;
		        info_mode.title = info_list['newsqry'].LIST[i].title;
		        info_mode.publish_user = info_list['newsqry'].LIST[i].publish_user;
		        info_mode.publish_date = info_list['newsqry'].LIST[i].publish_date;
		        info_mode.describe = "<div>" + info_list['newsqry'].LIST[i].publish_user + info_list['newsqry'].LIST[i].publish_date + "</div>";
		        info_list_mode.push(info_mode);
		    }
		    console.log(info_list_mode);
		    var html = ""
		    html += '<ul>'
		    for (i = 0; i < info_list_mode.length; i++) {
		        if (info_list_mode[i] == null) {
		            continue;
		        }
		        html += '<li class="ubb ub bc-border t-bla ub-ac lis" data-index="' + i + '">'
		        html += '<ul class="ub-f1 ub ub-pj ub-ac">'
		        html += '<ul class="ub-f1 ub ub-ver marg-l">'
		        html += '<li class="bc-text ub ub-ver ut-m line3">'
		        html += info_list_mode[i].title
		        html += '<div>'
		        html += info_list_mode[i].publish_user;
		        html += info_list_mode[i].publish_date;
		        html += '</div>'
		        html += '</li>'
		        html += '</ul>'
		        html += '<li class="fa fa-angle-right ulev2">'
		        html += '</li>'
		        html += '</ul>'
		    }
		    html += '</ul>'
		    $("#goodsList").html(html);
		    $('#goodsList>ul>li').each(function (index, item) {
		        if ($(item).data('index') && ($(item).data('index') % 2 == 1)) {
		            $(item).css("background-color", "#77CFAD");
		        } else {
		
		        }
		    });
		    $("#goodsList>ul>li").on('tap', function(event) {
		        //console.log(ele, obj, subobj);
		        //openDetail(encodeURI(obj.id), obj.title);
				openDetail2(info_list_mode[event.currentTarget.attributes["data-index"].value])
		    });
		
		    function openDetail2(obj) {
		        // cmp.href.next({
		        //     name : 'newsdetail',
		        //     data : 'newsdetail.html',
		        //     aniId : 10
		        // });
		        var extData = {
		            'newsid': obj.id,
		            'title': obj.title
		        }
				cmp.href.next("/seeyon/m3/apps/v5/mtbd/html/newsdetail.html", extData, {openWebViewCatch: true, nativeBanner: true})
		    }
		
		}
		
