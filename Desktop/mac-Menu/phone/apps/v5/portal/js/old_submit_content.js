cmp.ready(function() {
            appcan.initBounce();
            var option = cmp.storage.get('option');
            $("#select1").append(option);
            uexWidgetOne.onError = function(opCode, errorCode, errorDesc) {
                alert(errorCode + ":" + errorDesc);
            }
        })
        function closepop() {
            appcan.closePopover("old_submit_content");
        }

		$(".btn").on("tap", function(){
            switch(this.id) {
            case "btn1":
                closepop();
                break;
            case "submit":
                //alert($("#select1").val());
                if($("#select1").val().length<7){
                    cmp.notification.alert({
                                title : '提示',
                                content : '请选择人员',
                                buttons : '确定'
                            });
                    break;
                }
                var se = $("#select1").val().split(",");
                var auditor = se[0];
                var auditorname = se[1];
                var oid = cmp.storage.get("link_uniqueid").toUpperCase();
                var serviceUrl = cmp.storage.get('serviceUrl');
                var phoneid = cmp.storage.get('phoneid');
                var olduser = cmp.storage.get('olduser');
                var oldpwd = cmp.storage.get('oldpwd');
                var StationGUID = cmp.storage.get('StationGUID', StationGUID);
                var url = serviceUrl+"/servlet/PublicServiceServlet?message_id=oldoa_cz&passValue=1&stype=submitgo";
                url = url + "&username=" + olduser + "&password=" + oldpwd + "&PHONE_ID=" + phoneid + "&content=" + cmp.storage.get('content') + "&oid=" + oid;
                url = url + "&auditor=" + auditor + "&auditorname=" + auditorname;
                url = url + "&StationGUID=" + StationGUID;
                //alert(url);
                console.log(url);
                ajaxJson(url, success);
                break;
            }
        })
        function success(data) {
            console.log(data);
            if(data['submit'].RESULT){
                appcan.window.evaluateScript({
                    name : 'old_banli',
                    scriptContent : 'cmp.href.back()'
                });
                appcan.window.evaluateScript({
                            name : 'gw_atricle',
                            scriptContent : 'cmp.href.back()'
                        });
                cmp.href.next({
                    name : 'myApply',
                    data : 'myApply.html',
                    aniId : 10,
                    type : 4
                });
                closepop();
            }
        }
        appcan.select(".select", function(ele, value) {
            console.log(value);
        });