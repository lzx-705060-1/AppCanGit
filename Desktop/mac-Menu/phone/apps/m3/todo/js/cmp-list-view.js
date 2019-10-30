;(function() {
    var iscroll;
    define('todo/js/cmp-list-view.js', function(require, exports, module) {
        require('zepto');
        iscroll = require('iscroll1');
        module.exports = listView;
    });

    function listView(el, options) {
        if (this instanceof listView) {
            this.el = $(el);
            //simple-paging 简单分页，Complex-paging 复杂分页
            this.listviewType = options.listviewType || 'simple-paging'
            this.pageNum = options.pageNum || 1;
            this.totalPage = options.totalPage || 1;
            this.maxPageNum = options.maxPageNum || 5;
            this.nextHandle = options.nextHandle || function() {};
            this.refreshHandle = options.refreshHandle || function() {};
            initStyle(this);
            initScroll(this, el);
            initRefreshStyle(this);
            initEvent(this);
        } else {
            return new listView(el, options)
        }
    }

    function initRefreshStyle(_this) {
        var loadStr = '<div class="cmp-listview-loading"></div>',
            refreshText = '<span class="listview-top-text">' + i18n('pulldownTipDown') + '</span>';
        _this.el.append('<div class="listview-refresh"></div>');
        _this.refreshNode = _this.el.find('.listview-refresh');
        _this.refreshH = 0;
        _this.refreshOffset = _this.refreshNode.height();
        //loading
        _this.refreshNode.append(loadStr + refreshText);
        _this.refreshLoading = _this.refreshNode.find('.cmp-listview-loading');
        _this.refreshTextNode = _this.refreshNode.find('.listview-top-text');
    }

    function i18n(key){
        return window.fI18nData[ key ];
    }

    function initScroll(_this, el) {
        window.aaa = _this.scroll = new iscroll(el, {
            probeType: 2,
            eventPassthrough: 'horizontal',
            scrollY: true,
            scrollbars: false,
            disableMouse: true,
            offsetT: _this.listviewType !== 'simple-paging' ? _this.topContH : 0,
            offsetD: 0,
            disablePointer: true,
            preventDefaultException: { 
                tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|LI)$/,
                className: /^(listview-top-content)$/
            }
        });
        _this.scrollState = 'normal';
        _this.scroll.scrollTo(0, -(_this.topContH), 0);
    }

    function initEvent(_this) {
        var timer;
        //自定义事件
        _this.scroll.on('scrollStart', function(e) {scrollStart(_this);});
        _this.scroll.on('scroll', function(e) {
            clearTimeout(timer);
            timer = setTimeout(function() {
                _this.scroll._execEvent('scrollEnd');
            }, 700);
            scrollMove(_this);
        });
        _this.scroll.on('scrollEnd', function(e) {
            clearTimeout(timer);
            scrollEnd(_this);
        });
    }

    function scrollStart(_this) {
        _this.y = _this.scroll.y;
        _this.direction = '';
    }

    function scrollMove(_this) {
        var curY = Math.floor(_this.scroll.y);
        //方向
        _this.direction = curY - _this.y < 0 ? 1 : -1;
        if (_this.direction < 0) {
            _this.refreshLoading.addClass('visibility');
            if (_this.listviewType === 'Complex-paging') { 
                if (curY > _this.refreshOffset) {
                    _this.curTopState = 'refresh';
                    _this.refreshTextNode.text(i18n('_pullupTipOver'));
                    setOffsetT(_this, 0 - _this.refreshOffset);
                } else if (curY > -(_this.refreshOffset + _this.topContH) && _this.scrollState !== 'showContent') {
                    _this.refreshTextNode.text(i18n('pulldownTipDown'));
                    _this.curTopState = 'showContent';
                    setOffsetT(_this, 0);
                }
            } else {
                if (curY > _this.refreshOffset) {
                    _this.curTopState = 'refresh';
                    _this.refreshTextNode.text(i18n('_pullupTipOver'));
                    setOffsetT(_this, 0 - _this.refreshOffset);
                } else if (curY > -(_this.refreshOffset + _this.topContH)) {
                    _this.refreshTextNode.text(i18n('pulldownTipDown'));
                    _this.curTopState = 'showContent';
                    setOffsetT(_this, 0 - _this.refreshOffset);
                }
            }
            if (curY > 0 && curY <= _this.refreshOffset) {
                animate(_this, curY);
            }
        } else {
            if (curY < _this.scroll.maxScrollY - _this.downH){
                if (_this.pageNum >= _this.totalPage) { return; }
                _this.curTopState = 'next';
                _this.nextTextNode.text(i18n('pulldownRelease'));
            } else if (curY < _this.scroll.maxScrollY && _this.scroll.hasVerticalScroll) {
                if (_this.pageNum >= _this.totalPage) { return; }
                _this.nextTextNode.text(i18n('pullupTipDown'));
                initLoading(_this);
                _this.curTopState = 'nextAnimate';
            } else if (curY > -(_this.refreshOffset + _this.topContH)) {
                _this.curTopState = 'hideContent';
                setOffsetT(_this, _this.topContH);
            }
        }
        
    }

    function animate(_this, curY) {
        var _opacity = Math.floor(curY / _this.refreshOffset * 100);
        _this.refreshNode.css({
            opacity: _opacity / 100
        })
    }

    function initLoading(_this) {
        _this.nextLoading.addClass('visibility');
    }

    function openLoading(_this, type) {
        var node = type === 'refresh' ? _this.refreshNode : _this.bottomNode;
        node.addClass('active');
    }

    function closeLoading(_this, type) {
        var node = type === 'refresh' ? _this.refreshNode : _this.bottomNode;
        node.removeClass('active');
    }


    function scrollEnd(_this) {
        _this.scrollState = _this.curTopState;
        if (_this.scrollState === 'refresh') {
            refresh(_this);
        } else if (_this.scrollState === 'next') {
            next(_this)
        } else if (_this.scrollState === 'showContent' || _this.scrollState === 'refreshAnimate') {
            _this.scroll.scrollTo(0, 0, 300);
            setTimeout(function() {
                _this.scroll.scrollTo(0, 0, 0);
            }, 300);
        }
        _this.scroll.refresh();
        _this.curTopState = 'normal';
    }

    function next(_this) {
        openLoading(_this, 'next');
        _this.scrollState = 'normal';
        _this.nextHandle(++_this.pageNum);
        _this.nextTextNode.text(i18n('pullupTipRefresh'));
    }

    function refresh(_this) {
        _this.refreshTip = true;
        _this.scrollState = 'normal';
        //第一页刷新
        _this.pageNum = 1;
        _this.refreshHandle(1);
        openLoading(_this, 'refresh')
        _this.refreshTextNode.text(i18n('pullupTipRefresh'));
    }

    function resetText(_this) {
        if (_this.scroll.scrollerHeight <= _this.el.height()) {
            _this.bottomNode.removeClass('visibility');
        } else {
            _this.bottomNode.addClass('visibility');
        }
        if (_this.totalPage > _this.pageNum) {
            _this.nextTextNode.text(i18n('pullupTipDown'));
        } else {
            _this.nextTextNode.text(i18n('pullupTipNomore'));
        }
        _this.refreshTextNode.text(i18n('pulldownTipDown'));
        _this.refreshLoading.removeClass('visibility');
        _this.nextLoading.removeClass('visibility');
    }

    function setOffsetT(_this, y) {
        _this.scroll.options.offsetT = y;
    }

    function initStyle(_this) {
        var loadStr = '<div class="cmp-listview-loading"></div>',
            nextText = _this.pageNum < _this.totalPage ? '<span class="listview-bottom-text">' + i18n('pullupTipDown') + '</span>' : '<span class="listview-bottom-text">' + i18n('pullupTipNomore') + '</span>';
        _this.topContentNode = _this.el.find('.listview-top-content');
        _this.bottomNode = _this.el.find('.listview-bottom');
        _this.bottomNode.append(loadStr + nextText);
        _this.nextLoading = _this.bottomNode.find('.cmp-listview-loading');
        _this.nextTextNode = _this.bottomNode.find('.listview-bottom-text');
        _this.topContH = _this.topContentNode.height();
        _this.downH = _this.bottomNode.height();
        setTimeout(function() {
            if (_this.scroll.scrollerHeight <= _this.el.height()) {
                _this.bottomNode.removeClass('visibility');
            } else {
                _this.bottomNode.addClass('visibility');
            }
            _this.refreshNode.addClass('visibility');
        }, 500);
    }

    listView.prototype = {
        refresh: function(options) {
            var _this = this,
                disY = this.topContH;
            setOffsetT(this, disY);
            closeLoading(this, 'refresh');
            closeLoading(this, 'next');
            _this.refreshTip && _this.scroll.scrollTo(0, -disY, 400);
            if (options) {
                this.totalPage = options.totalPage;
            }
            setTimeout(function() { 
                _this.scroll.refresh();
                resetText(_this);
                _this.refreshTip = false;
            }, 400);
        },

        destroy: function() {
            this.scroll.destroy();
        }
    }
})();