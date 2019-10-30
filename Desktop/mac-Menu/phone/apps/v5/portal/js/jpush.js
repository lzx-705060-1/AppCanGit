
//这个是监听推送消息的被点击事件，由于index.html是本地界面，无法动态同步服务器代码
//因此需要将jpush.js移动到服务器，index.js引用服务器的代码，方面以后再动态添加代码和测试
function jpush_index_receive(data) {
     var jPushObjstr = data.replace(/"\[/g,"[").replace(/\]"/g,"]").replace(/\]\[/g,"").replace(/\\/g,"");
                    var jPushObj = JSON.parse(jPushObjstr);
                    var extrasObj = jPushObj.extras
                    var exeJpush = extrasObj.exeJpush;
                    if ("newoa_daiban" == exeJpush) {
                        //推送新OA待办
                        var affair_id = extrasObj.affair_id;
                        var summaryid = extrasObj.summaryid;
                        var title = extrasObj.title;
                        var node_policy = extrasObj.node_policy;
                        var processid = extrasObj.processid;
                        var sendername = extrasObj.sendername;
                        var create_date = extrasObj.create_date;
                        var jpushAlias = extrasObj.jpushAlias;
                        cmp.href.next({
                            name : 'chatmain',
                            data : 'https://mportal.agile.com.cn:8443/phone/chatmain.html',
                            aniId : 10,
                            type : 4
                        });
                    }else if("kaoqingyichang"==exeJpush){
                        var jpushAlias = extrasObj.jpushAlias;
                        var title = extrasObj.title;
                        //cmp.storage.save('jPush_kaoqing', JSON.stringify(extrasObj));
                        cmp.href.next({
                            name : 'chatmain',
                            data : 'https://mportal.agile.com.cn:8443/phone/chatmain.html?except_extrasObj='+JSON.stringify(extrasObj),
                            aniId : 10,
                            type : 4
                        });
                    }else if("srzn"==exeJpush){
                        //pushFlag = "true";
                        var jpushAlias = extrasObj.jpushAlias;
                        var title = extrasObj.title;
                        //cmp.storage.save('jPush_kaoqing', JSON.stringify(extrasObj));
                        cmp.href.next({
                            name : 'chatmain',
                            data : 'https://mportal.agile.com.cn:8443/phone/chatmain.html?ygzz_extrasObj='+JSON.stringify(extrasObj),
                            aniId : 10,
                            type : 4
                        });
                    }
}