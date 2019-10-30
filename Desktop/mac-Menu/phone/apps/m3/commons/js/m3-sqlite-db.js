/**
 * Created by yang on 16/9/22.
 */

(function() {
    var m3;
    var _m3DB,
        m3DB,
        // messageTableName = "messageTable",
        // userInfoTableName = "userInfoTable",
        // userConfigTableName = "userConfigTable",
        messageCategoryTableName = "messageCategoryTable",
        appListTableName = "appListTable",
        todoCategoryTableName = "todoCategoryTable",
        newAppListTable = "newAppListTable",

        memberDBName = function() {

            var _serverId = m3.getCurServerInfo().serverID;
            var _userId = m3.userInfo.getId();

            if (!_serverId || !_userId)
                return "";

            return "serverId_" + _serverId + "_userId_" + _userId + "_v201705262";
        },

        _openMemberDB = function(calback, fnname) {

            var curUserID = m3.userInfo.getId();

            if (!_m3DB || _m3DB.dbname.indexOf(curUserID) == -1) {
                m3DB.openMemberDB(calback);
            } else {
                calback(_m3DB);
            }
        };

    m3DB = {

        /**
         * 开启数据库
         */


        openMemberDB: function(callback) {

            var dbNameT = memberDBName();

            if (!dbNameT || dbNameT == "") {
                //console.log("服务器唯一标示不存在,无法创建人员相关数据库");
                return false;
            }

            _m3DB = window.sqlitePlugin.openDatabase({
                name: dbNameT,
                location: 'default'
            }, callback);

            return _m3DB;
        },
        /**
         * [initTables 初始化本地数据库表]
         * @param  {Function} callback [回调函数]
         */
        initTables: function(callback) {
            _openMemberDB(function(db) {
                db.sqlBatch([
                    'CREATE TABLE IF NOT EXISTS ' + newAppListTable + ' (id integer primary key, appId VARCHAR(30),domain varchar(20), appName VARCHAR(30),desc VARCHAR(20), bundleIdentifier VARCHAR(50),version VARCHAR(20), appShortAddress VARCHAR(100),cmpShellVersion varchar(10), appType VARCHAR(20), iconUrl text, serverIdentifier VARCHAR(30),urlSchemes VARCHAR(50),entry VARCHAR(200), updateDate VARCHAR(50), appJoinAddress text,md5 VARCHAR(50),jsUrl VARCHAR(200),tags text,appStatus VARCHAR(5),bundleName VARCHAR(40),bizMenuId VARCHAR(40),gotoParam VARCHAR(100),sortNum integer,isShow VARCHAR(5),unSelect VARCHAR(5),isDelete integer,isThird  integer,isPreset integer,hasPlugin integer,ext1 text,ext2 text,ext3 text,ext4 text,ext5 text,ext6 text,ext7 text,ext8 text,ext9 text,ext10 text,ext11 text,ext12 text,ext13 text,ext14 text,ext15 text);',
                    'CREATE TABLE IF NOT EXISTS ' + appListTableName + ' (id integer primary key, appId VARCHAR(30),domain varchar(20), appName VARCHAR(30),desc VARCHAR(20), bundleIdentifier VARCHAR(50),version VARCHAR(20), appShortAddress VARCHAR(100),cmpShellVersion varchar(10), appType VARCHAR(20), iconUrl text, serverIdentifier VARCHAR(30),urlSchemes VARCHAR(50),entry VARCHAR(200), updateDate VARCHAR(50), appJoinAddress text,md5 VARCHAR(50),jsUrl VARCHAR(200),tags text,appStatus VARCHAR(5),bundleName VARCHAR(40),bizMenuId VARCHAR(40),gotoParam VARCHAR(100),sortNum integer,isShow VARCHAR(5),unSelect VARCHAR(5),isDelete integer,isThird  integer,isPreset integer,hasPlugin integer,ext1 text,ext2 text,ext3 text,ext4 text,ext5 text,ext6 text,ext7 text,ext8 text,ext9 text,ext10 text,ext11 text,ext12 text,ext13 text,ext14 text,ext15 text);',
                    //致信消息与其他消息揉成一张表了
                    'CREATE TABLE IF NOT EXISTS ' + messageCategoryTableName + ' (id integer primary key, appId VARCHAR(30),unreadCount varchar(5),content varchar(50),createTime varchar(30),serverIdentifier varchar(30),orderId integer,thirdAppId VARCHAR(100),appName varchar(50),appType varchar(20),iconUrl text,isDelete integer,body varchar(50), fromId varchar(50), fromname varchar(50), gotoParams text, groupname varchar(50), msgtype varchar(20), timestamp varchar(50), toId varchar(50), toname varchar(30), type varchar(20),ext1 text,ext2 text,ext3 text,ext4 text,ext5 text,ext6 text,ext7 text,ext8 text,ext9 text,ext10 text,ext11 text,ext12 text,ext13 text,ext14 text,ext15 text)',
                    'create table if not exists ' + todoCategoryTableName + '(id integer primary key,appId VARCHAR(30),classificationName varchar(50),subAppId varchar(5),isThird integer,sortNum integer,status integer,isPortlet integer,portletParams text,canDrag integer,total integer,isDelete integer)',
                    // 'create table if not exists ' + userConfigTableName + '(id integer primary key,configValue varchar(30))'
                ], function() {
                    callback && callback({success: true});
                }, function(error) {
                    console.log(error);
                    console.log('DB异常');
//                    alert('initTables异常' + JSON.stringify(error));
                    callback && callback(error);
                });
            });
        },

        insertTodoCategory: function(appList, callback) {
            _openMemberDB(function(db) {
                db.transaction(function(tx) {
                    tx.executeSql("update " + todoCategoryTableName + " set isDelete=?", [1], function(tx, res) {
                        for (var i = appList.length - 1; i >= 0; i--) {
                            (function(app, i) {
                                tx.executeSql("select * from " + todoCategoryTableName + " where  subAppId =? and appId=? and isThird = ? and portletParams=? and isPortlet=? and canDrag=? and classificationName=?;", [app.subAppId, app.appId, app.isThird, app.portletParams, app.isPortlet, app.canDrag, app.classificationName], function(tx, res) {
                                    if (res.rows.length === 0) {

                                        var sort = i + 1,
                                            status = 1;

                                        //PC默认不显示
                                        if (app.isHide) {
                                            status = 0;
                                        }

                                        //sortNum 排序,status 是否显示
                                        tx.executeSql("INSERT INTO " + todoCategoryTableName + " (appId,classificationName,subAppId,isThird,sortNum,status,isDelete, isPortlet,portletParams,canDrag,total)  VALUES (?,?,?,?,?,?,?,?,?,?,?)", [app.appId, app.classificationName, app.subAppId, app.isThird, sort, status, 0, app.isPortlet, app.portletParams, app.canDrag, app.total], function() {}, function(msg) {});
                                    } else {
                                        tx.executeSql("update " + todoCategoryTableName + " set isDelete=?,total=? where subAppId =? and appId=? and isThird = ? and portletParams=? and isPortlet=? and canDrag=? and classificationName=?;", [0, app.total, app.subAppId, app.appId, app.isThird, app.portletParams, app.isPortlet, app.canDrag, app.classificationName], function() {}, function(msg) {});
                                    }
                                }, function(e) {});
                            })(appList[i], i);
                        }
                    }, function(e) {});

                }, function(error) {
                    console.log(error);
                    callback && callback();
                }, function() {
                    deleteTodoCategory(callback);
                });
            }, "updateVoice");

            function deleteTodoCategory(callback) {
                _openMemberDB(function(db) {
                    var sql = [];
                    sql.push(["delete from " + todoCategoryTableName + " where isDelete = ?;", [1]])

                    db.sqlBatch(sql, function() {

                        callback && callback();
                    }, function(error) {
                        console.log(error);
                        callback && callback();
                    });
                }, "deleteTodoCategory");
            }
        },

        getTodoCategory: function(callback) {
            var sql = "select * from " + todoCategoryTableName + " where isDelete = 0 and sortNum !=-1 order by sortNum desc;";
            var rs1 = [],
                rs2 = [];

            _openMemberDB(function(db) {
                db.transaction(function(tx) {
                    tx.executeSql(sql, [], function(tx, res) {
                        for (var i = 0; i < res.rows.length; i++) {
                            if (res.rows.item(i).status == 1) {
                                rs1.push(res.rows.item(i));
                            } else {
                                rs2.push(res.rows.item(i));
                            }
                        }
                    }, function(e) {});
                }, function(error) {
                    console.log(error);
                    callback && callback(rs1, rs2);
                }, function() {
                    callback && callback(rs1, rs2);
                });
            }, "getTodoCategory")
        },

        updateTodoCategorySort: function(apps, callback) {
            _openMemberDB(function(db) {
                if (!apps) {
                    return;
                }

                var sql = [];
                for (var i = 0; i < apps.length; i++) {
                    if (apps[i]) {
                        sql.push(["update " + todoCategoryTableName + " set status=?, sortNum=? where id=?", [apps[i].status, apps[i].sortNum, apps[i].id]]);
                    }
                }


                db.sqlBatch(sql, function() {
                    callback && callback();
                }, function(error) {
                    console.log(error);
                    callback && callback();
                });
            }, "updateTodoCategorySort");
        },

        //获取应用
        getApps: function(appType, callback) {
            //appType: 0全部,排序  1只取快捷方式,排序  2除去快捷方式,排序  3除去快捷方式,不排序  4,只取biz  5,只取第三方,非预制
            var sql = "";

            switch (appType) {
                case 0:
                    sql = "select * from " + appListTableName + " where isShow ='1' and isDelete = 0 order by sortNum asc ;"

                    break;
                case 1:
                    sql = "select * from " + appListTableName + " where isShow ='1' and appType = 'integration_shortcut' and isDelete = 0 order by sortNum asc ;"

                    break;
                case 2:
                    sql = "select * from " + appListTableName + " where isShow ='1' and appType != 'integration_shortcut' and isDelete = 0 order by sortNum asc ;"

                    break;
                case 3:
                    sql = "select * from " + appListTableName + " where isShow ='1' and appType != 'integration_shortcut' and isDelete = 0;"

                    break;
                case 4:
                    sql = "select * from " + appListTableName + " where isShow ='1' and appType = 'biz' and isDelete = 0;"

                    break;
                case 5:
                    sql = "select * from " + appListTableName + " where  isThird = '1' and isPreset = '1' and isDelete = 0;"

                    break;
                default:
                    sql = "select * from " + appListTableName + " where isShow ='1' and isDelete = 0;"

                    break;
            }
            var rs = [];
            _openMemberDB(function(db) {
                db.transaction(function(tx) {
                    tx.executeSql(sql, [], function(tx, res) {
                        for (var i = 0; i < res.rows.length; i++) {
                            rs.push(res.rows.item(i));
                        }
                    }, function(e) {});
                }, function(error) {
                    console.log(error);
                    callback && callback(rs);
                }, function() {
                    callback && callback(rs);
                });
            }, "getApps")
        },
        
        insertAppList: function(appList, callback) {
            var objThis = this;
            _openMemberDB(function(db){
                if (appList.length === 0){
                    callback({msg: 'insert的数据为空'});
                    return;
                }
                //ext1 表示 类别ID
                //ext2 表示 类别名称
                //ext3 表示 类别sort值
                db.transaction(function(tx) {
                    var successAccount = 0;
                    for (var i = 0;i < appList.length;i++) {
                        var app = appList[i];
                        var sqlStr = "INSERT INTO " + newAppListTable + " (appId,domain,appName,desc, bundleIdentifier,version, appShortAddress,cmpShellVersion, appType, iconUrl, serverIdentifier,urlSchemes,entry, updateDate, appJoinAddress,md5,jsUrl,tags,appStatus,bundleName,bizMenuId,gotoParam,sortNum,isShow,unSelect,isThird, isPreset, hasPlugin,isDelete,ext1,ext2,ext3)  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                        tx.executeSql(sqlStr, [app.appId, app.domain, app.appName, app.desc, app.bundleIdentifier, app.version, app.appShortAddress, app.cmpShellVersion, app.appType, app.iconUrl, app.serverIdentifier, app.urlSchemes, app.entry, app.updateDate, app.appJoinAddress, app.md5, app.jsUrl, app.tags, app.appStatus, app.bundleName, app.bizMenuId, app.gotoParam, app.sortNum, app.isShow, app.unSelect, app.isThird, app.isPreset, app.hasPlugin, 0, app.m3AppType.id, app.m3AppType.name, app.m3AppType.sort], function() {
                            successAccount++;
                            if (successAccount === appList.length) {
                                callback({success:true});
                            }
                        }, function(msg) {
                             //异常
                            callback(e);
                        });
                    }
                });
            });
        },
        
        checkAppListExist: function(callback) {
            var objThis = this;
            _openMemberDB(function(db){
                db.transaction(function(tx) {
                    var sqlStr = 'select * from ' + newAppListTable + ';';
                    tx.executeSql(sqlStr, [], function(tx, res) {
                        callback(res.rows.length);
                    }, function(e) {
                        //异常
                        alert('checkAppListExist 异常');
                        callback(0);
                    })
                });
            });
        },
        
        //删除原有的applist表
        deleteAppList: function(callback) {
            //删除原有数据
            _openMemberDB(function(db){
                db.transaction(function(tx) {
                    var sqlStr = 'DELETE FROM ' + newAppListTable;
                    tx.executeSql(sqlStr, [], function(tx, res) {
                        callback({success:true});
                    }, function(e) {
                        //异常
                        callback(e);
                    })
                });
            });
        },
        
        //新版 获取appList
        getAppList: function(callback) {
            _openMemberDB(function(db){
                db.transaction(function(tx) {
                    var sqlStr = "select * from " + newAppListTable + ";"
                    tx.executeSql(sqlStr, [], function(tx, res) {
                        callback(res);
                    });
                });
            });
        },


        insertApps: function(appList, callback) {
            _openMemberDB(function(db) {

                if (!appList || appList.length <= 0) {
                    return;
                }

                db.transaction(function(tx) {
                    tx.executeSql("update " + appListTableName + " set isDelete=?", [1], function(tx, res) {
                        for (var i = appList.length - 1; i >= 0; i--) {
                            (function(app) {
                                if (app.appId != null) {
                                    //设置新建协同权限
                                    if (app.bundleName == "newcoll") {
                                        if (app.isShow == "1") {
                                            m3.hasColNew = true;
                                        } else {
                                            m3.hasColNew = false;
                                        }
                                    }

                                    tx.executeSql("select * from " + appListTableName + " where appType =? and appId=? and bizMenuId = ? and bundleName=?  ;", [app.appType, app.appId, app.bizMenuId, app.bundleName], function(tx, res) {
                                        if (res.rows.length === 0) {
                                            //pc端默认隐藏
                                            app.appStatus = '1';
                                            if (app.sortNum == -1) {
                                                app.appStatus = '0';
                                            }
                                            //第三方应用默认隐藏
                                            if (app.appType != "default" && app.appType != "biz" && app.appType != "integration_shortcut") {
                                                app.appStatus = -1;
                                            }
                                            tx.executeSql("INSERT INTO " + appListTableName + " (appId,domain,appName,desc, bundleIdentifier,version, appShortAddress,cmpShellVersion, appType, iconUrl, serverIdentifier,urlSchemes,entry, updateDate, appJoinAddress,md5,jsUrl,tags,appStatus,bundleName,bizMenuId,gotoParam,sortNum,isShow,unSelect,isThird,  isPreset, hasPlugin,isDelete)  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [app.appId, app.domain, app.appName, app.desc, app.bundleIdentifier, app.version, app.appShortAddress, app.cmpShellVersion, app.appType, app.iconUrl, app.serverIdentifier, app.urlSchemes, app.entry, app.updateDate, app.appJoinAddress, app.md5, app.jsUrl, app.tags, app.appStatus, app.bundleName, app.bizMenuId, app.gotoParam, app.sortNum, app.isShow, app.unSelect, app.isThird, app.isPreset, app.hasPlugin, 0], function() {}, function(msg) {});
                                        } else {
                                            tx.executeSql("update " + appListTableName + " set appId=?, domain=?,appName=?,desc=?, bundleIdentifier=?,version=?, appShortAddress=?,cmpShellVersion=?, appType=?, iconUrl=?, serverIdentifier=?,urlSchemes=?,entry=?, updateDate=?, appJoinAddress=?,md5=?,jsUrl=?,tags=?,bundleName=?,bizMenuId=?,gotoParam=?,isShow=?,isThird=?,  isPreset=?, hasPlugin=?, isDelete =? where appId = ? and appType=? and bizMenuId=? and bundleName=? ", [app.appId, app.domain, app.appName, app.desc, app.bundleIdentifier, app.version, app.appShortAddress, app.cmpShellVersion, app.appType, app.iconUrl, app.serverIdentifier, app.urlSchemes, app.entry, app.updateDate, app.appJoinAddress, app.md5, app.jsUrl, app.tags, app.bundleName, app.bizMenuId, app.gotoParam, app.isShow, app.isThird, app.isPreset, app.hasPlugin, 0, app.appId, app.appType, app.bizMenuId, app.bundleName], function() {}, function(msg) {

                                            });
                                        }
                                    }, function(e) {});
                                }
                            })(appList[i]);
                        }

                    }, function(e) {});

                }, function(error) {
//                    alert('insertApps异常' + JSON.stringify(error));
                    console.log(error);
                    callback && callback();
                }, function() {
                    callback && callback();
                });
            }, "insertApps");
        },

        getAppById: function(id, callback) {
            var rs = null;

            if (!id) {
                return;
            }
            _openMemberDB(function(db) {
                db.transaction(function(tx) {
                    var sql = "select * from " + appListTableName + " where id = '" + id + "';"
                    tx.executeSql(sql, [], function(tx, res) {
                        rs = res.rows.item(0);
                    }, function(error) {});
                }, function(error) {
                    console.log(error);
                    callback && callback(rs);
                }, function() {
                    callback && callback(rs);
                });
            }, "getAppByAppId");
        },
        //应用列表排序隐藏控制
        updateAppSort: function updateAppSort(apps, callback) {
            _openMemberDB(function(db) {
                if (!apps) {
                    return;
                }

                var sql = [];
                for (var i = 0; i < apps.length; i++) {
                    sql.push(["update " + appListTableName + " set appStatus=?, sortNum=? where id=?", [apps[i].appStatus, apps[i].sortNum, apps[i].id]]);
                }


                db.sqlBatch(sql, function() {
                    callback && callback();
                }, function(error) {
                    console.log(error);
                    callback && callback();
                });
            }, "updateAppSort");
        },
        //应用中心隐藏控制
        updateAppStatus: function(apps, callback) {
            _openMemberDB(function(db) {
                if (!apps) {
                    callback && callback();
                }

                var sql = [];
                for (var i = 0; i < apps.length; i++) {
                    sql.push(["update " + appListTableName + " set sortNum=?,appStatus=? where id =?", [apps[i].sortNum, apps[i].appStatus, apps[i].id]]);
                }


                db.sqlBatch(sql, function() {
                    callback && callback();
                }, function(error) {
                    console.log(error);
                    callback && callback();
                });
            }, "updateAppStatus");
        },

        /**
         * [insertUserInfo 插入用户信息]
         * @param  {obj}   user        [单条用户信息]
         * @param  {Function} callback [回调函数]
         */
        // insertUserInfo: function(user, callback) {
        //     _openMemberDB(function(db) {
        //         if (!user || !user.id) {
        //             return;
        //         }

        //         db.transaction(function(tx) {
        //             tx.executeSql("select * from " + userInfoTableName + " where id ='" + user.id + "';", [], function(ts, res) {
        //                 if (res.rows.length <= 0) {
        //                     tx.executeSql("INSERT INTO " + userInfoTableName + "(id,departmentId,departmentName ,accountId,name ,jobNumber ,iconUrl, levelName ,status ,postName ,auth ,accName ,accShortName ,accMotto,accSort ,contacts ,gesture ,gesturePwd,deviceState,soundRemind,vibrationRemind,voiceStatus,voicePwd,showAppCategory,indexPage) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [user.id, user.departmentId, user.departmentName, user.accountId, user.name, user.jobNumber, user.iconUrl, user.status, user.levelName, user.postName, user.auth, user.accName, user.accShortName, user.accMotto, user.accSort, user.contacts, 2, "", "", 1, 1, 2, "", "true", "todo"], function() {

        //                     }, function() {});
        //                 } else {
        //                     tx.executeSql("update " + userInfoTableName + " set departmentId=? ,departmentName=?,accountId =?,name =?,jobNumber =?,iconUrl =?, levelName =?,status =?,postName =?,auth =?,accName =?,accShortName =?,accMotto =?,accSort =?,contacts =?", [user.departmentId, user.departmentName, user.accountId, user.name, user.jobNumber, user.iconUrl, user.status, user.levelName, user.postName, user.auth, user.accName, user.accShortName, user.accMotto, user.accSort, user.contacts], function() {}, function(msg) {});
        //                 }
        //             }, function(error) {});
        //         }, function(error) {
        //             console.log(error);
        //             callback && callback();
        //         }, function() {
        //             callback && callback();
        //         });
        //     }, "insertUserInfo");
        // },

        /**
         * [getUserInfo 获取用户信息]
         * @param  {Function} callback [回调函数]
         */
        // getUserInfo: function(callback) {
        //     _openMemberDB(function(db) {
        //         var rs = null;
        //         db.transaction(function(tx) {
        //             tx.executeSql("SELECT * FROM " + userInfoTableName + ";", [], function(tx, res) {
        //                 rs = res.rows.item(0);
        //             }, function(e) {});
        //         }, function(error) {
        //             console.log(error);
        //             callback && callback(rs);
        //         }, function() {
        //             callback && callback(rs);
        //         });
        //     }, "getUserInfo");

        // },


        //插入消息
        /**
         * [insertMessageCategoryList 插入消息一级页面]
         * @param  {[type]}   messageCategoryList [消息类别列表]
         * @param  {Function} callback            [回调函数]
         */
        insertMessageCategoryList: function(messageCategoryList, isUc, callback) {
            _openMemberDB(function(db) {
                if (!messageCategoryList) {
                    return;
                }

                db.transaction(function(tx) {
                        if (isUc) {
                            tx.executeSql("select * from " + messageCategoryTableName + " where appId = ? ", [messageCategoryList[0].appId], function(tx, res) {
                                if (res.rows.length === 0) {
                                    tx.executeSql("INSERT INTO " + messageCategoryTableName + " (appId,unreadCount,content,createTime,serverIdentifier,orderId,thirdAppId,appName,appType,iconUrl,isDelete) VALUES (?,?,?,?,?,?,?,?,?,?,?);", [messageCategoryList[0].appId, messageCategoryList[0].unreadCount, messageCategoryList[0].latestMessage.content, messageCategoryList[0].latestMessage.createTime, messageCategoryList[0].latestMessage.serverIdentifier, 0, messageCategoryList[0].latestMessage.thirdAppId, messageCategoryList[0].latestMessage.appName, messageCategoryList[0].latestMessage.appType, messageCategoryList[0].latestMessage.iconUrl, 0], function() {}, function(e) {});
                                } else {
                                    tx.executeSql("update " + messageCategoryTableName + " set appName=?,content = ?,createTime = ?,unreadCount =?,isDelete =? where appId = ?;", [messageCategoryList[0].latestMessage.appName, messageCategoryList[0].latestMessage.content, messageCategoryList[0].latestMessage.createTime, messageCategoryList[0].unreadCount, 0, messageCategoryList[0].appId], function() {}, function(e) {});
                                }
                            }, function(e) {});
                        } else {
                            tx.executeSql("update " + messageCategoryTableName + " set content = ?,createTime = ?,unreadCount =? where appId != ?;", ["", "", "", "61"], function(tx, res) {
                                for (var i = messageCategoryList.length - 1; i >= 0; i--) {
                                    (function(tmp) {
                                        //移除换行符
                                        messageCategoryList[tmp].latestMessage.content = messageCategoryList[tmp].latestMessage.content.replace(/\r|\n|\r\n/g, '');
                                        tx.executeSql("select * from " + messageCategoryTableName + " where appId = ? ", [messageCategoryList[tmp].appId], function(tx, res) {
                                            if (res.rows.length === 0) {
                                                var orderid = 0;
                                                switch (messageCategoryList[tmp].appId) {
                                                    case "1":
                                                        orderid = 4;
                                                        break;
                                                    case "4":
                                                        orderid = 3;
                                                        break;
                                                    case "7":
                                                        orderid = 2;
                                                        break;
                                                    case "6":
                                                        orderid = 1;
                                                        break;
                                                    default:

                                                }

                                                tx.executeSql("INSERT INTO " + messageCategoryTableName + " (appId,unreadCount,content,createTime,serverIdentifier,orderId,thirdAppId,appName,appType,iconUrl,isDelete) VALUES (?,?,?,?,?,?,?,?,?,?,?);", [messageCategoryList[tmp].appId, messageCategoryList[tmp].unreadCount, messageCategoryList[tmp].latestMessage.content, messageCategoryList[tmp].latestMessage.createTime, messageCategoryList[tmp].latestMessage.serverIdentifier, orderid, messageCategoryList[tmp].latestMessage.thirdAppId, messageCategoryList[tmp].latestMessage.appName, messageCategoryList[tmp].latestMessage.appType, messageCategoryList[tmp].latestMessage.iconUrl, 0], function() {}, function(e) {});
                                            } else {
                                                var orderId = res.rows.item(0).orderId;
                                                tx.executeSql("update " + messageCategoryTableName + " set appName=?,content = ?,createTime = ?,unreadCount =?,isDelete =? where appId = ?;", [messageCategoryList[tmp].latestMessage.appName, messageCategoryList[tmp].latestMessage.content, messageCategoryList[tmp].latestMessage.createTime, messageCategoryList[tmp].unreadCount, 0, messageCategoryList[tmp].appId], function() {}, function(e) {});
                                            }
                                        }, function(e) {});

                                    })(i);
                                }
                            }, function(e) {

                            });
                        }

                    },
                    function(e) {
                        console.log(e);
                        callback && callback();
                    },
                    function() {
                        callback && callback();
                    });
            }, "insertMessageCategoryList");
        },

        /**
         * [setCatagoryTop 一级页面消息置顶]
         * @param {[type]}   appId    [应用Id]
         * @param {Function} callback [回调函数]
         */
        setCatagoryTop: function(id, callback) {
            _openMemberDB(function(db) {
                db.transaction(function(tx) {
                    tx.executeSql("select orderId from " + messageCategoryTableName + " order by orderId desc limit 0,1 ", [], function(tx, res) {
                        var maxOrderId = res.rows.item(0).orderId;

                        tx.executeSql("UPDATE " + messageCategoryTableName + " set  orderId =? where id = ?;", [maxOrderId + 1, id], function() {});

                    });
                }, function(error) {
                    console.log(error);
                    callback && callback();
                }, function() {
                    callback && callback();
                });
            }, "setCatagoryTop");
        },

        /**
         * [unsetCatagoryTop 一级页面消息取消置顶]
         * @param  {[type]}   appId    [应用Id]
         * @param  {Function} callback [回调函数]
         */
        unsetCatagoryTop: function(id, callback) {
            _openMemberDB(function(db) {
                if (!id) {
                    return;
                }

                db.sqlBatch([
                    ["update " + messageCategoryTableName + " set orderId = 0 where id = ? ; ", [id]]
                ], function() {
                    callback && callback();
                }, function(error) {
                    console.log(error);
                    callback && callback();
                });
            }, "unsetCatagoryTop");
        },

        /**
         * [getMessageList 一级页面获取消息]
         * @param  {Function} callback [回调函数]
         */
        getMessageCategoryList: function(callback) {
            var rs = [],
                unReadCount = 0;

            _openMemberDB(function(db) {
                db.transaction(function(tx) {
                    tx.executeSql("select * from " + messageCategoryTableName + "  where isDelete = 0 order by orderId,createTime asc", [], function(tx, res) {
                        for (var i = res.rows.length - 1; i >= 0; i--) {
                            var msg = res.rows.item(i);
                            if (msg.content.indexOf("\n") != -1) {
                                msg.content = msg.content.slice(0, msg.content.indexOf("\n"));
                            }
                            if (msg.createTime == "" && msg.content == "") {
                                msg.content = m3.i18n[cmp.language].noMsg;
                            }

                            msg.createTime = m3.showTime(msg.createTime);
                            unReadCount += ~~msg.unreadCount
                            rs.push(msg);
                        }
                    });
                }, function(error) {
                    console.log(error);
                    callback && callback(rs);
                }, function() {
                    callback && callback(rs);
                });
            }, "getMessageCategoryList")
        },

        /**
         * [changeCategoryMessageToRead 一级页面标记为已读]
         * @param  {[type]}   appId    [应用Id]
         * @param  {Function} callback [回调函数]
         */
        changeCategoryMessageToRead: function(appId, callback) {
            _openMemberDB(function(db) {
                if (!appId) {
                    return;
                }

                db.sqlBatch([
                    ["UPDATE " + messageCategoryTableName + " set  unreadCount =? where appId = ?;", ["0", appId]]
                ], function() {
                    callback && callback();
                }, function(error) {
                    console.log(error);
                    callback && callback();
                });
            }, "changeCategoryMessageToRead");
        },

        /**
         * [deleteCategoryMessage 一级页面删除消息]
         * @param  {[type]}   appId    [应用Id]
         * @param  {Function} callback [回调函数]
         */
        deleteCategoryMessage: function(appId, callback) {
            _openMemberDB(function(db) {
                if (!appId) {
                    return;
                }
                if (appId != -1111) {
                    sql = ["update " + messageCategoryTableName + " set isDelete = ?, content = ?,unreadCount = ?,createTime = ? where id =?;", [1, "", 0, "", parseInt(appId)]]
                } else {
                    sql = ["update " + messageCategoryTableName + " set isDelete = ?, content = ?,unreadCount = ?,createTime = ? ;", [1, "", 0, ""]]
                }

                db.sqlBatch([
                    sql
                ], function() {
                    callback && callback();
                }, function(error) {
                    console.log(error);
                    callback && callback();
                });
            }, "deleteCategoryMessage");
        },

        //二级消息列表清空消息
        clearCategoryMessage: function clearCategoryMessage(appId, callback) {
            _openMemberDB(function(db) {
                if (!appId) {
                    return;
                }
                db.sqlBatch([
                    ["update " + messageCategoryTableName + " set content = ?,unreadCount = ?,createTime = ? WHERE appId = ?;", ["", 0, "", appId]]
                ], function() {
                    callback && callback();
                }, function(error) {
                    console.log(error);
                    callback && callback();
                });
            }, "clearCategoryMessage");
        },
        //获取消息未读数
        getMessageUnreadCount: function getMessageUnreadCount(callback) {
            var rs = 0;
            _openMemberDB(function(db) {
                db.transaction(function(tx) {
                    tx.executeSql("select SUM(unreadCount) unreadCount from  " + messageCategoryTableName + " m left join appListTable a on a.appId = m.appId and m.appType = a.appType where orderId >-1 ; ", [], function(tx, res) {
                        rs = res.rows.item(0) && parseInt(res.rows.item(0).unreadCount || 0);
                    }, function(e) {});
                }, function(error) {
                    console.log(error);
                    callback && callback(rs);
                }, function() {
                    callback && callback(rs);
                });
            }, "getMessageUnreadCount")
        }
    }
    define(function(require, exports, module){
        m3 = require('m3');
        window.m3DB = m3DB;
        module.exports = m3DB;
    });
})()
