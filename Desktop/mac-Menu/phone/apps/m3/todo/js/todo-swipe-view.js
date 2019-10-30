;(function() {
    var iscroll, listView;
    define('todo/js/todo-swipe-view.js', function(require, exports, module) {
        require('zepto');
        listView = require('todo/js/cmp-list-view.js');
        module.exports = swipeView;
    });

    function swipeView(el, options) {
        if (this instanceof swipeView) {
            this.el = $(el);
            this.navStack = options.navStack;
            this.wapperSize = options.wapperSize || 5;
            this.swipeHandle = options.swipeHandle || function() {};
            this.swipeInitHandle = options.swipeInitHandle || function() {};
            initView(this);
            initStyle(this);
            initEvent(this);
        } else {
            return new swipeView(el, options);
        }
    }

    function initEvent(_this) {
        var startX, _x, _y, distX, distY, canMove, direction, maxIndex;
        //列表拖拽事件
        _this.el.on('touchstart', function(e) {
            if (_this.eventDisable) {return;}
            _x = e.touches[ 0 ].pageX;
            _y = e.touches[ 0 ].pageY;
            maxIndex = _this.navStack.length - 1;
            canMove = null;
            direction = 0;
            startX = parseInt($(this).attr('data-curx') || 0);
            console.log('startX', startX);
        }).on('touchmove', function(e) {
            if (_this.eventDisable) {return;}
            canMove = Math.abs(distX) >= 80;
            distY = Math.abs(e.touches[ 0 ].pageY - _y);
            distX = e.touches[ 0 ].pageX - _x;
            if (distY > 20) {
                return;
            }
            //上一页
            if (distX > 0 && canMove && _this.curIndex > 0) {
                direction = -1;
            //下一页
            } else if (distX < 0 && canMove && _this.curIndex < maxIndex){
                direction = 1;
            }
        }).on('touchend', function() {
            if (_this.eventDisable) {return;}
            if (distY > 60 || direction === undefined) {
                return;
            }
            if (direction !== 0) {
                _this.scrollToView(_this.curIndex + direction);
            }
        });
    }

    function initView(_this) {
        var blank = '';
        for (var i = 0;i < _this.navStack.length;i++) {
            if (i >= _this.wapperSize - 1) {
                blank += '<div class="blank-view display-none"></div>'
            } else {
                blank += '<div class="blank-view show-list"></div>'
            }
        }
        _this.el.append(blank);
    }

    function initStyle(_this) {
        _this.el.css('width', ((_this.wapperSize + 1) * document.body.offsetWidth) + 'px');
        _this.el.children().css({
            'width': document.body.offsetWidth + 'px',
            'height':  _this.el.height() + 'px'
        });
    }

    function initListView(_this, id, scrollOps, index) {
        var scroll = listView('#' + id, scrollOps);
        _this.navStack[ index ].scroll = scroll;
    };

    function appendView(_this, template, nId, index) {
        var node = $(template);
        _this.el.children().eq(index)
            .removeClass('blank-view')
            .addClass('list-view')
            .html(node)
            .attr('id', 'list-' + nId)
            .children().eq(0).attr('id', 'list-content-' + nId);
    }

    function getIndexInStack(_this, id) {
        console.log(_this.navStack, id);
        for (var i = 0;i < _this.navStack.length;i++) {
            if (_this.navStack[ i ].id === id) {
                return i;
            }
        }
        return -1;
    }

    function translateTo(_this, step, time) {
        var _wid = document.body.offsetWidth;
        translateX(_this, (_wid * step), time === undefined ? 400 : time);
        _this.el.attr('data-curx', _wid * step);
    }

    function translateX(_this, x, time) {
        _this.el.css({
            transform: 'translate3d(' + x + 'px, 0, 0)',
            '-webkit-transform': 'translate3d(' + x + 'px, 0, 0)',
            transitionDuration: time + 'ms'
        });
    }

    function gc(_this, index) {
        _this.el.find('.show-list').addClass('display-none').removeClass('show-list');
        _this.el.find('.cur-show-list').addClass('show-list').removeClass('cur-show-list display-none');
        if (index === 0) {
            translateTo(_this, 0, 0);
        } else {
            translateTo(_this, -1, 0);
        }
    }

    function formatView(_this, index) {
        //隐藏当前index周边
        _this.el.children().eq(_this.curIndex - 1).addClass('display-none').removeClass('show-list');
        _this.el.children().eq(_this.curIndex + 1).addClass('display-none').removeClass('show-list');
        //显示点击周边的view
        _this.el.children().eq(index).removeClass('display-none').addClass('cur-show-list');
        _this.el.children().eq(index - 1).addClass('cur-show-list');
        _this.el.children().eq(index + 1).addClass('cur-show-list');
    }

    swipeView.prototype = {

        refresh: function() {
            initStyle(this);
            for (var i = 0;i < this.navStack.length;i++) {
                this.navStack[ i ].scroll && this.navStack[ i ].scroll.refresh();
            }
        },

        //渲染整体view
        renderView: function(index, id, scrollOps, template) {
            appendView(this, template, id, index);
            initListView(this, 'list-' + id, scrollOps, index);
            this.curIndex = index;
        },

        //渲染列表内容
        scrollRender: function(id, totalPage, template, isRefresh) {
            var index = getIndexInStack(this, id),
                node = $('#list-content-' + id).find('.list-view-content');
            if (isRefresh) {
                node.html(template);
            } else {
                node.append(template);
            }
            this.navStack[ index ].scroll.refresh({totalPage: totalPage});
        },

        scrollToView: function(index) {
            var _this = this;
            // showViewByIndex(this, index);
            if (index === this.curIndex) {return;}
            formatView(this, index);
            if (this.curIndex > index) {
                translateTo(this, 0);
            } else {
                if (this.curIndex !== 0) {
                    translateTo(this, 0, 0);
                } 
                translateTo(this, -1);
            }
            setTimeout(function() {
                gc(_this, index);
            }, 400);
            //不存在
            if (!this.navStack[ index ].scroll) {
                this.swipeInitHandle(index);
            }
            this.swipeHandle(index);
            this.curIndex = index;
            this.el.children().removeClass('active').eq(index).addClass('active');
        },

        destroy: function() {
            for (var i = 0;i < this.navStack.length;i++) {
                this.navStack[ i ].scroll && this.navStack[ i ].scroll.destroy();
            }
            this.el.off('touchstart').off('touchmove').off('touchend');
            this.el.removeAttr('style').children().remove();
        },

        swipeDisabled: function() {
            this.eventDisable = true;
        },

        swipeActive: function() {
            this.eventDisable = false;
        }
    }
})();