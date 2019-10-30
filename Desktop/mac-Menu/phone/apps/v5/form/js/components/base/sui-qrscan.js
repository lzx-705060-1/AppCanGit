/**
 * Created by yangchao on 2016/8/24.
 */

(function ($, Vue, doc) {
    'use strict';

    Vue.directive('sui-qrscan', {
        params: ['scope'],
        twoWay: true,
        bind: function () {
        },
        update: function (newValue, oldValue) {
            this.unbind();
            if (!s3scope.allowQRScan) {
                return;
            }
            var dom = document.createElement('div');
            dom.classList.add('sui-form-drag');
            dom.setAttribute('draggable', 'true');
            dom.innerHTML = '<i class="see-icon-v5-form-qrscan"></i>';
            document.body.appendChild(dom);
            var that = this;
            var availHeight = window.screen.availHeight;
            var availWidth = window.screen.availWidth;
            var draggable = false;
            var dragging = false;
            var dragStart = {x:0, y: 0};
            //初始化图标left 和 top
            var _timer = null;

            this.clickHandler = function (e) {
                draggable = false;
                dragging = false;

                var target = dom;
                if (target) {
                    target.classList.remove('sui-form-drag-active');
                }

                if (!$.platform.CMPShell) {
                    $.notification.alert($.i18n('form.qr.alert'), null, '', $.i18n('form.btn.ok'));
                    return;
                }

                var options = {
                    success: function (data) {
                        if (!data || data.cancelled == 'Cancel') {
                            return;
                        }

                        $.sui.doDecodeBarCode(data);
                    },
                    error: function (err) {
                        if (err && err.message && err.code != '18006') {
                            if (typeof err.message == 'string') {
                                err.message = JSON.parse(err.message);
                            }
                            if (!err.message.cancelled) {
                                $.notification.alert(JSON.stringify(err.message), null, '', $.i18n('form.btn.ok'));
                            }
                        }
                    }
                };

                $.barcode.scan(options);
            }.bind(this);

            this.touchendHandler = function (e) {
                draggable = false;
                dragging = false;
                var target = dom;
                if (target) {
                    target.classList.remove('sui-form-drag-active');
                }

            }.bind(this);

            this.dragHandler = function (e) {
                var target = dom;
                if (!dragging && target) {
                    dragging = true;
                    target.classList.add('sui-form-drag-active');
                }

                if (draggable) {
                    var limitedBottom = 60;
                    var rect = target.getBoundingClientRect();
                    var realX = dragStart.x + (e.detail.move.x - e.detail.start.x);
                    var realY = dragStart.y + (e.detail.move.y - e.detail.start.y);
                    var maxX = availWidth - parseInt(rect.width);
                    var maxY = availHeight - parseInt(rect.height) - limitedBottom;
                    realX = realX < 0 ? 0 : realX > maxX ? maxX : realX;
                    realY = realY < limitedBottom ? limitedBottom : realY > maxY ? maxY : realY;
                    target.style.top = realY + 'px';
                    target.style.left = realX + 'px';
                }

                e.stopPropagation();
                e.preventDefault();
            }.bind(this);

            this.touchstartHandler = function (e) {
                draggable = true;
                var target = dom;
                var rect = target.getBoundingClientRect();
                dragStart = {x: parseInt(rect.left), y: parseInt(rect.top)};
            }.bind(this);

            this.touchmoveHandler = function (e) {
                e.preventDefault();
            }.bind(this);

            dom.addEventListener('tap',  this.clickHandler);
            dom.addEventListener('touchend', this.touchendHandler);
            dom.addEventListener('drag',  this.dragHandler);
            dom.addEventListener('touchmove',  this.touchmoveHandler);
            dom.addEventListener('touchstart', this.touchstartHandler);

        },
        unbind: function () {
            var domArr = document.querySelectorAll('.sui-form-drag');
            if (domArr && domArr.length > 0) {
                var len = domArr.length;
                for (var i=0; i < len; i++) {
                    var dom = domArr[i];
                    dom.removeEventListener('tap',  this.clickHandler);
                    dom.removeEventListener('touchend', this.touchendHandler);
                    dom.removeEventListener('drag',  this.dragHandler);
                    dom.removeEventListener('touchmove',  this.touchmoveHandler);
                    dom.removeEventListener('touchstart', this.touchstartHandler);
                    dom.remove();
                    dom = null;
                }
            }
        }
    })

})(cmp, Vue, document);