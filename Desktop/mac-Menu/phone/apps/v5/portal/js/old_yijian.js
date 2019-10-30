cmp.ready(function() {
            var titHeight = $('#header').offset().height;
            appcan.initBounce();
            getFujian();
        });
		$("#nav-left").on("tap", function(){
            cmp.href.back();
        })
		
		function getFujian() {
		    //var oid = cmp.storage.get("link_uniqueid").toUpperCase();
		    var processGUID = cmp.storage.get("processGUID") ;
		    var serviceUrl = cmp.storage.get('serviceUrl');
		    var phoneid = cmp.storage.get('phoneid');
		    var olduser = cmp.storage.get('olduser');
		    var oldpwd = cmp.storage.get('oldpwd');
		     var url = serviceUrl + "/servlet/PublicServiceServlet?message_id=oldoa_detail&stype=yijian";
		    url = url + "&username=" + olduser + "&password=" + oldpwd + "&PHONE_ID=" + phoneid + "&processGUID=" + processGUID;
		    ajaxJson(url,httpsucess);
		}
		
		function httpsucess(info_list) {
		    console.log(info_list['opinions'].RESULT);
		    var info_list_mode = new Array(info_list['opinions'].RESULT.length);
		    var result = info_list['opinions'].RESULT ;
		    console.log(result);
		    for ( i = 0; i < result.length; i++) {
		        var info_mode = new Object();
		        //console.log(result[i].yijian);
		        info_mode.title = result[i].yijian;//"<div>" + result[i].yijian"</div>";
		        info_mode.describe = "<div>" + result[i].content+"</div><div>"+result[i].time+"</div>";
		        info_list_mode.push(info_mode);
		    }
		
		    var lv1 = appcan.listview({
		        selector : "#listview",
		        type : "thinLineTmp",
		        hasIcon : false,
		        hasAngle : false,
		        hasSubTitle : false,
		        multiLine : 3
		    });
		    lv1.set(info_list_mode);
		    lv1.on('tap', function(ele, obj, subobj) {
		        console.log(ele, obj, subobj);
		    });
		}