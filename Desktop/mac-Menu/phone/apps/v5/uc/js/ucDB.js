/**
 * Created by fut on 17/3/18
 */

(function(uc) {

	if (uc == undefined) {
		console.warn("uc object is null!");
		return;
	}

	var _ucDB, ucIndexTableName = "ucIndexTable";
	var _ucDB, ucMessageTableName = "ucMessageTable";

	var appDBName = function() {

		var _serverId = uc.getCurServerInfo().serverID;
		if (!_serverId)
			return "";

		return "serverId_" + _serverId;
	};

	var ucDBName = function() {

		var _serverId = uc.getCurServerInfo().serverID;
		var _userId = uc.userInfo.getId();

		if (!_serverId || !_userId)
			return "";

		return "UC" + _serverId + "_" + _userId + "_v2.0";
	}

	var _openUcDB = function(calback, fnname) {

		var curUserID = uc.userInfo.getId();

		if (!_ucDB || _ucDB.dbname.indexOf(curUserID) == -1) {
			console.log(fnname + "_____open");
			uc.db.openUcDB(calback);
		} else {
			console.log(fnname + "______is open");
			calback(_ucDB);
		}
	};

	uc.db = {

		/**
		 * 开启致信模块数据库
		 */
		openUcDB : function(callback) {

			var dbNameT = ucDBName();

			if (!dbNameT || dbNameT == "") {
				//console.log("服务器唯一标示不存在,无法创建人员相关数据库");
				return false;
			}

			_ucDB = window.sqlitePlugin.openDatabase({
				name : dbNameT,
				location : 'default'
			}, callback);

			return _ucDB;
		},

		/**
		 * [initTables 初始化本地数据库表]
		 * @param  {Function} callback [回调函数]
		 * @Author: fut <mars>
		 * @Date:   2017-03-19 09:01:32
		 * @Project: uc
		 */
		initTables : function(callback) {
			_openUcDB(function(db) {
				db.sqlBatch([
						'create table if not exists ' + ucIndexTableName
								+ '(id integer PRIMARY KEY AUTOINCREMENT,'
								+ 'userId text,' + 'fromJid text,'
								+ 'fromName text,'+ 'toJid text,'
								+ 'toName text,' + 'groupName text,'+ 'msgType text,'
								+ 'body text,' + 'state integer,'
								+ 'dateTime text,' + 'unreadmsg integer,'+'count integer DEFAULT 0,'+'block integer,'+'stick integer DEFAULT 0,'+'stickTime text,'
								+ 'extend1 text,' + 'extend2 text,'
								+ 'extend3 text,' + 'extend4 text,'
								+ 'extend5 text,' + 'extend6 text)',
						'create table if not exists ' + ucMessageTableName
								+ '( id integer PRIMARY KEY AUTOINCREMENT,'
								+ 'messageId text,'
								+ 'userId text,' + 'fromJid text,'
								+ 'fromName text,'+ 'toJid text,'
								+ 'toName text,' + 'msgType text,'
								+ 'body text,' + 'state integer,'
								+ 'dateTime text,' + 'msgFileName text,'+'msgFileIdThumbnail'
								+ 'msgFileSize text,	' + 'msgFileDate text,'
								+ 'msgFileId text,' + 'msgFilePath text,'
								+ 'msgFileState text,' + 'dateTimeNum int64,'
								+ 'msgFileDesc text,' + 'extend1 text,'
								+ 'extend2 text,' + 'extend3 text,'
								+ 'extend4 text,' + 'extend5 text,'
								+ 'extend6 text)' ], 
								function() {
					db.close(function() {
						_ucDB = null;
						callback && callback();
					});
				}, function(error) {
					console.log(error);
				});
			}, "initTables");
		},

		/**
		 * [insertUcIndexMsg 插入致信首页聊天信息]
		 * @param  {obj}   msgInfo        [聊天信息]
		 * @param  {boolean} isUpdateState [是否只更新状态]
		 * @param  {Function} callback [回调函数]
		 */
		insertUcIndexMsg : function(msgInfo,isUpdateState,callback) {
			_openUcDB(
					function(db) {
						
						db
								.transaction(
										function(tx) {
											tx
													.executeSql(
															"select * from "
																	+ ucIndexTableName
																	+ " where userid =?",
															[msgInfo.userId],
															function(ts, res) {
																if (res.rows.length <= 0) {
																	tx
																			.executeSql(
																					"insert into "
																									+ ucIndexTableName
																									+ "(userId,fromJid,fromName,toJid,toName,groupName,msgType,body,dateTime,count,block,state) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
																									[msgInfo.userId,
																									msgInfo.fromJid,
																									msgInfo.fromName,
																									msgInfo.toJid,
																									msgInfo.toName,
																									msgInfo.groupName,
																									msgInfo.type,
																									msgInfo.body,
																									msgInfo.dateTime,
																									msgInfo.count,
																									msgInfo.block,
																									1 ],
																					function() {

																					},
																					function() {
																					});
																} else {
																	if(isUpdateState){
																		tx.executeSql("update "+ ucIndexTableName+ " set state=1 where userId=?",
																							[msgInfo.userId],
																					function() {
																					},
																					function(
																							msgInfo) {
																						console.log(msgInfo);
																					});
																	}else{
																		tx.executeSql("update "+ ucIndexTableName+ " set fromJid=? ,fromName=?,toJid=?,toName=?,groupName=?,msgType=?,body=?,dateTime=?,count=count+1,block=?,state=1 where userId=?",
																							[msgInfo.fromJid,msgInfo.fromName,msgInfo.toJid,msgInfo.toName,msgInfo.groupName,msgInfo.type,msgInfo.body,msgInfo.dateTime,msgInfo.block,msgInfo.userId],
																					function() {
																					},
																					function(
																							msgInfo) {
																						console.log(msgInfo);
																					});
																	}
																	
																}
															}, function(error) {
																// console.log(error.message);
																_ucDB = null;
																callback && callback();
															});
										},
										function(error) {
											db
													.close(function() {
														// console.log('insertUserInfo:close_ 'error.message);
														_ucDB = null;
														callback && callback();
													});
										}, function() {
											db.close(function() {
												//console.log("insertUserInfo:close");
												_ucDB = null;
												callback && callback();
											});
										});
					}, "insertUcIndexMsg");
		},

		/**
		 * [getUcIndexMsg 获致信首页IM信息]
		 * @param  {Function} callback [回调函数]
		 */
		getUcIndexMsg : function(userId,callback) {
			_openUcDB(function(db) {
				var rs = null;
				db.transaction(function(tx) {
					tx.executeSql("select * from " + ucIndexTableName + " where userId=?;",
							[userId], function(tx, res) {
								rs = res.rows.item(0);
							}, function(e) {
								console.log(e.message);
							});
				}, function(error) {
					db.close(function() {
						// console.log('getUserInfo:close_ ' + error.message);
						_ucDB = null;
						callback && callback(rs);
					});
				}, function() {
					db.close(function() {
						// console.log("getUserInfo:close");
						_ucDB = null;
						callback && callback(rs);
					});
				});
			}, "getUcIndexMsg");

		},

		/**
		 * [getUcIndexMsgList 获取致信首页消息列表(有效)]
		 * @param  {Function} callback [回调函数]
		 */
		getUcIndexMsgList : function(callback) {
			var rs = [];
			_openUcDB(function(db) {
				db.transaction(function(tx) {
					tx.executeSql("select * from " + ucIndexTableName
							+ " where state=1 order by stick desc ,stickTime desc,dateTime desc",
							[], function(tx, res) {
								for (var i = res.rows.length - 1; i >= 0; i--) {
									rs.push(res.rows.item(i));
								}
							});
				}, function(error) {
					db.close(function() {
						_ucDB = null;
						callback && callback(rs);
					});
				}, function() {
					db.close(function() {
						_ucDB = null;
						// console.log("getMessageCategoryList:close");
						callback && callback(rs);
					});

				});
			}, "getUcIndexMsgList")
		},

		//插入消息
		/**
		 * [insertUcIndexMsgList 插入消息一级页面]
		 * @param  {[type]}   messageList [消息类别列表]
		 * @param  {Function} callback            [回调函数]
		 */
		insertUcIndexMsgList : function(curUserID, messageList, callback) {
			_openUcDB(
					function(db) {
						if (!messageList || !messageList.length) {
							return;
						}
						db
								.transaction(
										function(tx) {
											for (var i = messageList.length - 1; i >= 0; i--) {
												(function(tmp) {
													var msgInfo=uc.getFormatMsgInfo(curUserID,messageList[tmp]);
													if (msgInfo!=null) {
													tx
															.executeSql(
																	"select * from "
																			+ ucIndexTableName
																			+ " where userid = ? ",
																	[msgInfo.userId],
																	function(
																			tx,
																			res) {
																		if (res.rows.length === 0) {
																			tx
																					.executeSql(
																							"insert into "
																									+ ucIndexTableName
																									+ "(userId,fromJid,fromName,toJid,toName,groupName,msgType,body,dateTime,count,block,state) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
																									[msgInfo.userId,
																									msgInfo.fromJid,
																									msgInfo.fromName,
																									msgInfo.toJid,
																									msgInfo.toName,
																									msgInfo.groupName,
																									msgInfo.type,
																									msgInfo.body,
																									msgInfo.dateTime,
																									0,
																									msgInfo.block,
																									1 ],
																							function() {
																							},
																							function(
																									e) {
																								console.log(e.message);
																							});
																		} else {
																			tx
																					.executeSql(
																							"update "
																									+ ucIndexTableName
																									+ " set fromJid=? ,fromName=?,toJid=?,toName=?,groupName=?,msgType=?,body=?,dateTime=?,block=? where userId=?",
																							[
																									msgInfo.fromJid,
																									msgInfo.fromName,
																									msgInfo.toJid,
																									msgInfo.toName,
																									msgInfo.groupName,
																									msgInfo.type,
																									msgInfo.body,
																									msgInfo.dateTime,
																									msgInfo.block,
																									msgInfo.userId],
																							function(e,x) {
																								console.log(e.message);
																							},
																							function(e,x) {
																								console.log(e.message);
																							});
																		}
																	},

																	function(e) {
																		console.log(e.message);
																	});
															}
												})(i);
											}
										}, function(e) {
											db.close(function() {
												// console.log('insertUcIndexMsgList:close_ ' + e.message);
												_ucDB = null;
												callback && callback();
											});
										}, function() {
											db.close(function() {
												//console.log("insertMessageCategoryList:close");
												_ucDB = null;
												callback && callback();
											});
										});
					}, "insertUcIndexMsgList");
		},
		//插入消息
		/**
		 * [insertUcIndexMsgList 插入消息一级页面]
		 * @param  {[type]}   messageList [消息类别列表]
		 * @param  {Function} callback            [回调函数]
		 */
		insertUcMessageMsgList : function(curUserID, messageList, callback) {
			_openUcDB(
					function(db) {
						if (!messageList || !messageList.length) {
							return;
						}
						db
								.transaction(
										function(tx) {
											for (var i = messageList.length - 1; i >= 0; i--) {
												(function(tmp) {
													var msgInfo=uc.getFormatMsgInfo(curUserID,messageList[tmp]);
													tx
															.executeSql(
																	"select * from "
																			+ ucMessageTableName
																			+ " where messageId = ? ",
																	[msgInfo.userId],
																	function(
																			tx,
																			res) {
																		if (res.rows.length === 0) {
																			tx
																					.executeSql(
																							"insert into "
																									+ ucMessageTableName
																									+ "(messageId,userId,fromJid,fromName,toJid,toName,groupName,msgType," +
																											"body,state,unReaderState,unReaderTime,dateTime,msgFileId,msgFileIdThumbnail," +
																											"msgFileName,msgFileSize,msgFileDate,msgFileDesc,msgFileState," +
																											"extend1,extend2,extend3,extend3,extend4,extend5,extend6) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
																									[
																									msgInfo.messageId,
																									msgInfo.userId,
																									msgInfo.fromJid,
																									msgInfo.fromName,
																									msgInfo.toJid,
																									msgInfo.toName,
																									msgInfo.groupName,
																									msgInfo.type,
																									msgInfo.body,
																									msgInfo.state,
																									msgInfo.unReaderState,
																									msgInfo.unReaderTime,
																									1 ],
																							function() {
																							},
																							function(
																									e) {
																								console.log(e.message);
																							});
																		} else {
																			tx
																					.executeSql(
																							"update "
																									+ ucIndexTableName
																									+ " set fromJid=? ,fromName=?,toJid=?,toName=?,groupName=?,msgType=?,body=?,dateTime=?,block=? where userId=?",
																							[
																									msgInfo.fromJid,
																									msgInfo.fromName,
																									msgInfo.toJid,
																									msgInfo.toName,
																									msgInfo.groupName,
																									msgInfo.type,
																									msgInfo.body,
																									msgInfo.dateTime,
																									msgInfo.block,
																									msgInfo.userId],
																							function(e,x) {
																								console.log(e.message);
																							},
																							function(e,x) {
																								console.log(e.message);
																							});
																		}
																	},

																	function(e) {
																		console.log(e.message);
																	});
												})(i);
											}
										}, function(e) {
											db.close(function() {
												// console.log('insertUcIndexMsgList:close_ ' + e.message);
												_ucDB = null;
												callback && callback();
											});
										}, function() {
											db.close(function() {
												//console.log("insertMessageCategoryList:close");
												_ucDB = null;
												callback && callback();
											});
										});
					}, "insertUcIndexMsgList");
		},
		//插入消息
		/**
		 * [insertUcIndexMsg 插入消息,详情页面]
		 * @param  {[msgInfo]}   msgInfo [消息]
		 * @param  {Function} callback            [回调函数]
		 */
		insertUcMessageMsg : function(curUserID, msgInfo, callback) {
			_openUcDB(
					function(db) {
						
						db
								.transaction(
										function(tx) {
											tx
													.executeSql(
															"select * from "
																	+ ucMessageTableName
																	+ " where messageId =?",
															[msgInfo.messageId],
															function(ts, res) {
																if (res.rows.length <= 0) {
																	tx
																			.executeSql(
																					"insert into "
																					+ ucMessageTableName
																					+ "(messageId,userId,fromJid,fromName,toJid,toName,msgType," +
																							"body,state,msgFileState) VALUES (?,?,?,?,?,?,?,?,?,?)",
																					[
																					msgInfo.messageId,
																					msgInfo.userId,
																					msgInfo.fromJid,
																					msgInfo.fromName,
																					msgInfo.toJid,
																					msgInfo.toName,
																					msgInfo.type,
																					msgInfo.body,
																					msgInfo.state,
																					1],
																					function() {

																					},
																					function() {

																					});
																} else {
																		tx.executeSql("update "+ ucMessageTableName+ " set msgFileState=1 where messageId=?",
																							[msgInfo.messageId],
																					function() {

																					},
																					function(
																							msgInfo) {
																						// console.log(msgInfo);

																					});
																	}
															}, function(error) {
																// console.log(error.message);
																_ucDB = null;
																callback && callback();

															});
										},
										function(error) {
											db
													.close(function() {
														// console.log('insertUserInfo:close_ 'error.message);
														_ucDB = null;
														callback && callback();
													});
										}, function() {
											db.close(function() {
												//console.log("insertUserInfo:close");
												_ucDB = null;
												callback && callback();
											});
										});
					}, "insertUcMessageMsg");
		},
		
		/**
		 * [getUcMessageMsg 获致信首页IM信息]
		 * @param  {Function} callback [回调函数]
		 */
		getUcMessageMsg : function(messageId,callback) {
			_openUcDB(function(db) {
				var rs = null;
				db.transaction(function(tx) {
					tx.executeSql("select * from " + ucMessageTableName + " where messageId=?;",
							[messageId], function(tx, res) {
								rs = res.rows.item(0);
							}, function(e) {
								console.log(e.message);
							});
				}, function(error) {
					db.close(function() {
						
						_ucDB = null;
						callback && callback(rs);
					});
				}, function() {
					db.close(function() {
						
						_ucDB = null;
						callback && callback(rs);
					});
				});
			}, "getUcMessageMsg");

		},

		/**
		 * [getUcMessageMsgAll 获致所有历史消息messageId]
		 * @param  {Function} callback [回调函数]
		 */
		getUcMessageMsgAll : function(fromJid, toJid, callback) {
			_openUcDB(function(db) {
				var rs = [];
				if (fromJid && toJid) {
					db.transaction(function(tx) {
						tx.executeSql("select * from " + ucMessageTableName + " where fromJid=? and toJid=?;",[fromJid,toJid], function(tx, res) {
									for (var i = 0; i < res.rows.length; i++) {
										rs.push(res.rows.item(i));
									}
								}, function(e) {
									console.log(e.message);
								});
					}, function(error) {
						db.close(function() {
							
							_ucDB = null;
							callback && callback(rs);
						});
					}, function() {
						db.close(function() {
							
							_ucDB = null;
							callback && callback(rs);
						});
					});
				} else if ((!fromJid) && toJid) {
					db.transaction(function(tx) {
						tx.executeSql("select * from " + ucMessageTableName + " where toJid=?;",[toJid], function(tx, res) {
									for (var i = 0; i < res.rows.length; i++) {
										rs.push(res.rows.item(i));
									}
								}, function(e) {
									console.log(e.message);
								});
					}, function(error) {
						db.close(function() {
							
							_ucDB = null;
							callback && callback(rs);
						});
					}, function() {
						db.close(function() {
							
							_ucDB = null;
							callback && callback(rs);
						});
					});
				}
				
			}, "getUcMessageMsgAll");

		},

		/**
		 * [getUcIndexHistoryMsgList 获取致信首页历史消息列表(有效)]
		 * @param  {Function} callback [回调函数]
		 */
		getUcIndexHistoryMsgList : function(callback) {
			var rs = [];
			_openUcDB(function(db) {
				db.transaction(function(tx) {
					tx.executeSql("select msg from " + ucIndexTableName
							+ " where chatstatus=1 order by createtime desc",
							[], function(tx, res) {
								for (var i = res.rows.length - 1; i >= 0; i--) {
									rs.push(res.rows.item(i));
								}
							});
				}, function(error) {
					db.close(function() {
						_ucDB = null;
						callback && callback(rs);
					});
				}, function() {
					db.close(function() {
						_ucDB = null;
						// console.log("getMessageCategoryList:close");
						callback && callback(rs);
					});

				});
			}, "getUcIndexHistoryMsgList")
		},
 		//更新消息已读未读状态，将消息设置为已读，未读数置为0 fut
        updateUnreader: function(userId, callback) {
            _openUcDB(function(db) {
                if (!userId) {
                    return;
                }
                var sql = [];
                sql.push(["update " + ucIndexTableName + " set count=0  where userId =? ", [userId]])

                db.sqlBatch(sql, function() {
                    db.close(function() {
                        _ucDB = null;
                        callback && callback();
                    });
                }, function(error) {
                    db.close(function() {
                        
                        _ucDB = null;
                        callback && callback();
                    });
                });
            }, "updateUnreader");
        },
        //更新消息置顶状态，将消息置顶或取消置顶，未读数置为0 fut
        updateStick: function(userId,stickValue,stickTime, callback) {
            _openUcDB(function(db) {
                if (!userId) {
                    return;
                }
                var sql = [];
                sql.push(["update " + ucIndexTableName + " set stick=?,stickTime=?  where userId =? ", [stickValue,stickTime,userId]])

                db.sqlBatch(sql, function() {
                    db.close(function() {
                        _ucDB = null;
                        callback && callback();
                    });
                }, function(error) {
                    db.close(function() {
                        
                        _ucDB = null;
                        callback && callback();
                    });
                });
            }, "updateStick");
        },
        //更新消息状态 fut
        updateState: function(userId,stateValue, callback) {
            _openUcDB(function(db) {
                if (!userId) {
                    return;
                }
                var sql = [];
                sql.push(["update " + ucIndexTableName + " set state=?  where userId =? ", [stateValue,userId]])

                db.sqlBatch(sql, function() {
                    db.close(function() {
                        _ucDB = null;
                        callback && callback();
                    });
                }, function(error) {
                    db.close(function() {
                        
                        _ucDB = null;
                        callback && callback();
                    });
                });
            }, "updateStick");

        },
      //删除消息 fut
        deleteMessage: function(userId, callback) {
            _openUcDB(function(db) {
                if (!userId) {
                    return;
                }
                var sql = [];
                sql.push(["delete from " + ucIndexTableName + " where userId =? ", [userId]])

                db.sqlBatch(sql, function() {
                    db.close(function() {
                        _ucDB = null;
                        callback && callback();
                    });
                }, function(error) {
                    db.close(function() {
                        
                        _ucDB = null;
                        callback && callback();
                    });
                });
            }, "updateStick");

        },
		//删除群组消息 fut
        delGroupMessage: function(userId, callback) {
            _openUcDB(function(db) {
                if (!userId) {
                    return;
                }
                var sql = [];
                sql.push(["delete from " + ucIndexTableName + " where userId =? ", [userId]])

                db.sqlBatch(sql, function() {
                    db.close(function() {
                        _ucDB = null;
                        callback && callback(userId);
                    });
                }, function(error) {
                    db.close(function() {
                        
                        _ucDB = null;
                        callback && callback(userId);
                    });
                });
            }, "delGroupMessage");
        },
		//更新群组名称 fut
        updateGroupName: function(groupId,groupName, callback) {
            _openUcDB(function(db) {
                if (!groupId) {
                    return;
                }
                var sql = [];
                sql.push(["update " + ucIndexTableName + " set toName=?,groupName=?  where userId =? ", [groupName,groupName,groupId]])

                db.sqlBatch(sql, function() {
                    db.close(function() {
                        _ucDB = null;
                        callback && callback(groupId);
                    });
                }, function(error) {
                    db.close(function() {
                        
                        _ucDB = null;
                        callback && callback(groupId);
                    });
                });
            }, "updateGroupName");
        }

	}
})(uc)
