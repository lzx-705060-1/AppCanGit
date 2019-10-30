/**
 * @description 
 */
;(function() {
    var pageObj, m3Ajax, m3, m3i18n, cache, nativeApi;
    define(function( require, exports, module ) {
        require('zepto');
        m3 = require('m3');
        cache = require('nativeCache');
        nativeApi = require('native');
        m3Ajax = require('ajax');
        m3i18n = require('m3i18n');
        cmp.ready(function () {
            pageObj.initPage();
        });
        window.aaa = pageObj;
    });
    
    pageObj = {
        //数据源
        data: {},
        
        //页面初始化
        initPage: function() {
            var objThis = this;
            this.initEvent();
            this.initData(function( data ) {
                objThis.initMainBtn(data);
            });
        },
        
        setSwitch: function( id, state ) {
            var obj = $('#' + id);
            if ( id === 'mainSwitch' && state == '0' ) {
                obj.removeClass('cmp-active');
                $('#ring').removeClass('cmp-active');
                $('#shake').removeClass('cmp-active');
                $('.cmp-switch-handle').removeAttr('style');
                this.data['mainSwitch'] = '0';
                this.data['shake'] = '0';
                this.data['ring'] = '0';
            } else {
                if ( state == '1' ) {
                    obj.addClass('cmp-active');
                    $('#mainSwitch').addClass('cmp-active');
                    this.data['mainSwitch'] = '1';
                } else {
                    obj.removeClass('cmp-active');
                }
                this.data[id] = state;
            }
        },
        
        formatDate: function( str ) {
            if ( str.length > 5 ) {
                return str.substring(0, 5);
            } else {
                return str;
            }
        },
        
        //事件初始化
        initEvent: function() {
            var _this = this;
            //安卓自带返回键
            document.addEventListener("backbutton", function() {
                cmp.href.back();
            });
            
            //返回
            $('.m3-back').on('tap', function() {
                cmp.href.back();
            });
            
            $('.app-save').on('tap', function() {
                if ( $(this).hasClass('opacity-0') ) {
                    return;
                }
                _this.saveData();
            });
            
            //点击开关
            $('.cmp-switch').on('touchend', function() {
                var id = $(this).attr('id');
                if ( _this.data[id] == '1' ) {
                    _this.setSwitch(id, '0');
                } else {
                    _this.setSwitch(id, '1');
                }
                $('.app-save').removeClass('opacity-0');
            });
            
            //时间
            $('#data').on('tap', function() {
                $('.app-save').removeClass('opacity-0');
                var options = $(this).find('.data-time').attr('data-options') || '{}',
                    timeDate = _this.data,
                    objThis = $(this);
                _this.picker = new cmp.DtPicker(JSON.parse(options));
                _this.picker.show(function(rs) {
                    var startH = parseInt(rs.h.text);
                    var endH = parseInt(rs.hTwo.text);
                    var startM = parseInt(rs.i.text);
                    var endM = parseInt(rs.iTwo.text);
                    if (_this.decideLegal(startH, endH, startM, endM)) {
                        startH = ( startH > 9 ) ? startH : '0' + startH;
                        endH = ( endH > 9 ) ? endH : '0' + endH;
                        startM = ( startM > 9 ) ? startM : '0' + startM;
                        endM = ( endM > 9 ) ? endM : '0' + endM;
                        objThis.find('.data-time').text(rs.value);
                        timeDate.startDate = startH + ':' + startM;
                        timeDate.endDate = endH + ':' + endM;
                        objThis.find('.data-time').attr("data-options", '{"type":"timeInterval","value":"' + rs.value + '"}');
                    } else {
                        var str = '';
                        if ( !timeDate.startDate && !timeDate.endDate ) {
                            str = '00:00-23:59';
                            timeDate.startDate = '00:00';
                            timeDate.endDate = '23:59';
                            objThis.find('.data-time').attr("data-options", '{"type":"timeInterval","value":"' + str + '"}');
                        }
                        cmp.notification.toast(m3i18n[cmp.language].messageNoticeTime, "center");
                    }
                    _this.picker.hide();
                });
            });
        },
        
        //判断设置的时间段是否合法
        decideLegal: function( startH, endH, startM, endM ) {
            if (startH > endH) {
                return false;
            } else if (startH == endH) {
                if (startM > endM) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        },
        
        //数据初始化
        initData: function( callback ) {
            nativeApi.getPushConfig(function(data) {
                try {
                    data = JSON.parse(data);
                } catch(e) {
                    console.log('原生数据返回格式异常');
                }
                callback(data);
            });
        },
        
        //保存
        saveData: function() {
            var objThis = this;
            this.data.endDate += ':59';
            this.data.startDate += ':00';
            m3Ajax({
                url: m3.getCurServerInfo().url + '/mobile_portal/seeyon/rest/m3/config/user/new/message/setting',
                type: 'POST',
                data: JSON.stringify(objThis.data),
                noNetworkTgt: '.m3-content',
                success: function( data ) {
                    nativeApi.setPushConfig(objThis.data, function() {
                        cmp.notification.toast(m3i18n[cmp.language].setAppSuccess, "top");
                        setTimeout(function() {
                            cmp.href.back();
                        }, 2000);
                    }, function(e) {
                        cmp.notification.toast(m3i18n[cmp.language].setAppFail, "top");
                    })
                },
                error: function( e ) {
                    cmp.notification.toast(m3i18n[cmp.language].setAppFail, "top");
                }
            })
        },
        
        initMainBtn: function( data ) {
            console.log(data);
            var start = this.formatDate(data.startReceiveTime || '00:00') || '00:00',
                end = this.formatDate(data.endReceiveTime || '23:59') || '23:59',
                date = start + '-' + end;
            this.setSwitch('mainSwitch', data.useReceive || '1');
            this.setSwitch('shake', data.vibrationRemind || '1');
            this.setSwitch('ring', data.soundRemind || '1');
            this.data.startDate = start;
            this.data.endDate = end;
            $('.data-time').attr("data-options", '{"type":"timeInterval","value":"' + date + '"}').text(date);
        }
    };
})();