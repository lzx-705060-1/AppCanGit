/*
 * @Author: Mars
 * @Date:   2017-05-25 10:48:00
 * @Last Modified by:   lizhiheng
 * @Last Modified time: 2017-05-24 11:47:44
 */

var messageDetail = {};
(function() {
    var m3Error, m3i18n, m3Ajax, setting, nativeApi, icon;
    define(function(require, exports, module) {
        //加载模块
        require('zepto');
        require('m3');
        m3Error = require('error');
        m3i18n = require("m3i18n");
        m3Ajax = require("ajax");
        m3DB = require("sqliteDB");
        nativeApi = require('native');
        icon = require('commons/js/app-icon-config.js');
        cmp.ready(function() {
            setting.initPage();
        });
        module.exports = setting;
    });
    
    //设置
    setting = {
        
        //总开关对象
        dataSwitch: null,
        
        //初始化
        initPage: function() {
            this.param = cmp.href.getParam();
            this.initEvent();
            this.initData();
        },
        
        //事件初始化
        initEvent: function() {
            var objThis = this;
            m3.netWorkChangeListener(function(state) {
                if (state === 'connect' && objThis.loadHeaderFail === false) {
                    objThis.loadAppIcon();
                }
            });
            //返回
            $('.m3-back').on('tap', function() {
                cmp.href.back();
            });
            
            $('.clear-all').on('tap', function() {
                cmp.notification.confirm(fI18nData['message.m3.h5.clearAll'], function(index) {
                    if ( index === 1 ) {
                        objThis.clearMsg();
                    }
                });
            });
            
            //
            $('.cmp-switch').on('touchend', function() {
                var id = $(this).attr('id'),
                    status = $(this).hasClass('cmp-active') ? '1' : '0';
                objThis.saveByNative(id, status)
            });

            //安卓自带返回键
            document.addEventListener("backbutton",this.androidBackBtn);
        },
        
        initData: function() {
            this.initStyle();
            this.initBtn();
        },

        initStyle: function() {
            var objThis = this,
                appId = this.param.appId;
            //初始化数据
            $('title').text(this.param.title + '消息设置');
            $('.m3-header').find('h1').text(this.param.title);
            $('.msg-title').find('.flex-1').text(this.param.title);
            if(!this.checkWhiteListByAppId(appId)) {
                nativeApi.getAppIconUrlByAppId(appId, function(iconUrl) {
                    console.log(iconUrl);
                    objThis.iconUrl = iconUrl;
                    objThis.loadAppIcon();
                }, function() {
                    objThis.iconUrl = '';
                    objThis.loadAppIcon();
                });
            } else {
                var iconObj = icon[ 'appId_' + appId ] || {};
                this.iconUrl = 'http://commons.m3.cmp/v1.0.0/imgs/' + iconObj.icon;
                this.bgColor = iconObj.color;
                this.loadAppIcon();
            }
        },

        initBtn: function() {
            var objThis = this,
                appId = this.param.appId;
            nativeApi.getTopStatus(appId, function(data) {
                console.log(Object.prototype.toString.call(data));
                objThis.setBtn('#top', data)
            }, function(e) {
                objThis.toast('GET');
            });
            nativeApi.getPushConfig(function(data) {
                try {
                    data = JSON.parse(data);
                } catch(e) {
                    console.log('原生数据返回格式异常');
                }
                objThis.dataSwitch = data;
                console.log(data);
                nativeApi.getRemindStatus(appId, function(ret) {
                    console.log(data.useReceive);
                    if ( data.useReceive == '0' ) {
                        objThis.setBtn('#disturb', '1');
                    } else {
                        objThis.setBtn('#disturb', ret);
                    }
                }, function(e) {
                    objThis.toast('GET');
                });
            })
            if ( !appId.match(/leadership|at_me|track|intelligent/) ) {
                $('.display-none').removeClass('display-none');
                nativeApi.getAggregationStatus({
                    appID: appId
                }, function(data) {
                    console.log(data);
                    objThis.setBtn('#combine', data)
                }, function(e) {
                    objThis.toast('GET');
                });
            } else {
                $('.display-none').remove();
            }
        },

        checkWhiteListByAppId: function(appId) {
            if (appId === 'leadership' || appId === 'at_me' || appId === 'track') {
                return true;
            }
            return false;
        },

        loadAppIcon: function() {
            var objThis = this,
                img = new Image();
            img.onerror = function(e) {
                objThis.loadHeaderFail = true;
            };

            img.onload = function() {
                var _style = {
                    'background-image': 'url(' + objThis.iconUrl + ')'
                };
                if (objThis.bgColor) {
                    _style[ 'background-color' ] = objThis.bgColor;
                    _style[ 'background-size' ] = '24px 24px';
                }
                objThis.loadHeaderFail = false;
                $('.icon').css(_style);
            };
            img.src = this.iconUrl;
        },
        
        setBtn: function( id, status ) {
            console.log(id);
            if ( status === '0' ) {
                $(id).removeClass('cmp-active');
            } else {
                $(id).addClass('cmp-active');
            }
        },
        
        saveByNative: function( id, status ) {
            var objThis = this,
                data = { appID: this.param.appId, status: status };
            if ( id === 'top' ) {
                nativeApi.setTopStatus(data, null, function() {
                    objThis.toast('SET');
                });
            } else if ( id === 'disturb' ) {
                if ( this.dataSwitch.useReceive == '0' ) {
                    this.dataSwitch.useReceive = '1';
                    var config = {}
                    config['mainSwitch'] = this.dataSwitch.useReceive;
                    config['shake'] = this.dataSwitch.vibrationRemind;
                    config['ring'] = this.dataSwitch.soundRemind;
                    config['startDate'] = this.dataSwitch.startReceiveTime;
                    config['endDate'] = this.dataSwitch.endReceiveTime;
                    nativeApi.setPushConfig(config);
                }
                nativeApi.setRemindStatus(data, null, function() {
                    objThis.toast('SET');
                });
            } else {
                nativeApi.setAggregationStatus(data, null, function() {
                    objThis.toast('SET');
                });
            }
        },
        
        toast: function( type ) {
            if ( $('.cmp_toast_container').length > 0 ) return;
            if ( type === 'GET' ) {
                cmp.notification.toast(fI18nData["message.m3.h5.getFail"], "center");
            } else {
                cmp.notification.toast(fI18nData["message.m3.h5.setFail"], "center");
            }
        },
        
        clearMsg: function() {
            var objThis = this;
            m3Ajax({
                url: m3.curServerInfo.url + "/mobile_portal/api/message/delete/" + this.param.appId + "/1",
                data: JSON.stringify([]),
                success: function(msg) {
                    cmp.webViewListener.fire({
                        type: "com.seeyon.m3.message.statusChange",
                        data: {
                            appId: objThis.param.appId,
                            changeType: "deleteAll"
                        }
                    });
                },
                error: function(e) {
                    console.log(e)
                }
            });
        },

        //安卓返回键
        androidBackBtn:function() {
            var obj = $('.window_alert');
            if (obj.length !== 0) {
                obj.remove();
                $('.cmp-backdrop').remove();
            } else {
                cmp.webViewListener.fire({
                    type: "com.seeyon.m3.message.statusChange",
                    data: {
                        appId: messageDetail.category,
                        changeType: "read"
                    }
                });
                cmp.href.back();
            }
        }
        
        
    };
    
}());