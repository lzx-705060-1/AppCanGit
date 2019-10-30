/**
 * @description门户banner
 */
;(function() {
    var portalSetting, m3, m3Ajax, m3Cache, tools;
    define(function(require, exports, module) {
        require('zepto');
        m3 = require('m3');
        tools = require('tools');
        m3Ajax = require('ajax');
        m3Cache = require('nativeCache');
        cmp.ready(function() {
            portalSetting.initPage();
        });
    });
    
    portalSetting = {
        //是否保存
        isSave: true,
        //数据源
        data: null,
        //拖拽对象
        sortObj: null,
        //拖拽状态
        drugState: false,
        //初始化
        initPage: function() {
            var _this = this;
            //事件初始化
            this.initEvent();
            //数据初始化
            this.initData(function( data ) {
                _this.render();
                _this.initSort();
            });
        },
        
        //初始化事件
        initEvent: function() {
            var timer,
                _this = this;
            //返回事件
            $('.m3-back').on('tap', function() {
                cmp.href.back();
            });
            
            //安卓自带返回键
            document.addEventListener("backbutton", function() {
                $('.m3-back').trigger('tap');
            });
            
            //激活事件
            $('.app-active').on('touchstart',function(e) {
                if ( !e.target.className.match('drug-btn')) {
                    _this.sortObj.options.disabled = true;
                } else {
                    e.preventDefault();
                }
            }).on('touchend',function(e) {
                _this.sortObj.options.disabled = false;
            });
            
            //删除
            $('.app-active').on('tap','.del-btn', function() {
                var portId = $(this).parent().attr('data-portalid'),
                    index = -1,
                    curData;
                //获取序列号
                index = tools.arrIndexByKey(_this.data.add, 'portalId', portId);
                if ( index === -1 ) {
                    alert('没有匹配到该门户');
                    return;
                }
                if ( portId == '0' ) {
                    return;
                }
                //数据处理
                curData = _this.data.add[index];
                _this.data.add.splice(index, 1);
                _this.data.del.push(curData);
                //DOM处理
                $('.app-unactive').append(_this.template([], [curData]).delStr);
                $(this).parent().remove();
                $('.app-save').removeClass('opacity-0');
                $('.app-unactive,.unactive-title').removeClass('display-none');
                console.log('delete');
                console.log(_this.data);
            });
            
            //添加
            $('.app-unactive').on('tap','.add-btn', function() {
                var portId = $(this).parent().attr('data-portalid'),
                    index = -1,
                    curData;
                //获取序列号
                index = tools.arrIndexByKey(_this.data.del, 'portalId', portId);
                if ( index === -1 ) {
                    alert('没有匹配到该门户');
                    return;
                }
                //数据处理
                curData = _this.data.del[index];
                _this.data.del.splice(index, 1);
                _this.data.add.push(curData);
                //DOM
                $('.app-active').append(_this.template([curData], []).addStr);
                $(this).parent().remove();
                $('.app-save').removeClass('opacity-0');
                if ( _this.data.del.length == 0 ) {
                    $('.app-unactive,.unactive-title').addClass('display-none');
                }
                console.log('add');
                console.log(_this.data);
            });
            
            //返回事件
            $('.app-save').on('tap', function() {
                if ( !$(this).hasClass('opacity-0') ) {
                    _this.updataCache(function() {
                        cmp.webViewListener.fire({
                            type: 'portal-set'
                            
                        })
                        cmp.href.back();
                    });
                }
            });
        },
        
        //获取缓存
        initData: function(callback) {
            var data,
                _this = this;
            //获取缓存
            m3Cache.getCache('m3-portal-cache', function(ret) {
                console.log(ret);
                //获取缓存成功
                _this.data = ret;
                _this.render();
                callback()
            });
        },
        //渲染
        template: function( add, del ) {
            var str1 = '',
                str2 = '',
                className;
            for ( var i = 0;i < add.length;i++ ) {
                if ( add[i].portalId === '0' ) {
                    className = ' del-disable';
                } else {
                    className = '';
                }
                str1 += '<li class="flex-h set-list" data-portalid="' + add[i].portalId + '">\
                            <i class="iconfont see-icon-menhushezhiquxiao del-btn' + className + '"></i>\
                            <span class="flex-1">' + add[i].portalName.escapeHTML() + '</span>\
                            <i class="iconfont see-icon-menhushezhituozhuai drug-btn"></i>\
                        </li>';
            }
            for ( var i = 0;i < del.length;i++ ) {
                str2 += '<li class="flex-h set-list" data-portalid="' + del[i].portalId + '">\
                            <i class="iconfont see-icon-menhushezhitianjia add-btn"></i>\
                            <span class="flex-1">' + del[i].portalName.escapeHTML() + '</span>\
                        </li>';
            }
            return {
                addStr: str1,
                delStr: str2
            };
        },
        
        render: function() {
            var str = this.template(this.data.add, this.data.del);
            $('.app-active').html(str.addStr);
            $('.app-unactive').html(str.delStr);
            if ( this.data.del.length == 0 ) {
                $('.app-unactive,.unactive-title').addClass('display-none');
            }
        },
        
        initSort: function() {
            var _this = this;
            if ( this.sortObj )return;
            this.sortObj = new cmp.Sortable($('.app-active')[0], {
                animation: 300,
                disabled: false,
                onStart: function(e) {
                    console.log($('.sortable-ghost'));
                    setTimeout(function() {
                        $(e.target).find('.sortable-ghost').addClass('list-opacity-0');
                    },100)
                },
                onEnd: function(e) {
                    $(e.target).find('.list-opacity-0').removeClass('list-opacity-0');
                    if (e.oldIndex === e.newIndex) return;
                    $('.app-save').removeClass('opacity-0');
                    _this.arrSort(e.oldIndex, e.newIndex);
                }
            });
        },
        
        arrSort: function(from, to) {
            var hisData = this.data.add[from]
            this.data.add.splice(from, 1);
            this.data.add.splice(to, 0, hisData);
        },
        
        //更新缓存
        updataCache: function(callback) {
            callback = callback || function() {}
            //更新保存门户缓存
            m3Cache.setCache('m3-portal-cache', this.data, callback, callback);
        }
    }
})();