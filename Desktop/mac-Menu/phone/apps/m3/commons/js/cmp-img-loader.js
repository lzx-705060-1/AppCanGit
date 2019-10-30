;(function() {
    var Pool;
    //模块定义
    define && define.cmd && define('cmpComponents/cmp-img-loader.js', function(require, exports, module) {
        Pool = require('cmpUtil/cmp-pool.js');
        module.exports = imgloader;
    });
    /**
     * @constructor
     * @param {object} options
     * @param {array} options.config 
     * @param {object} options.config[0] 
     * @param {object} options.config[0].url 路径
     * @param {object} options.config[0].selector 目标节点选择器（开头不要用数字）
     * @param {string} options.defaultUrl 默认URL
     * @param {string} options.handleType 处理类型，background：背景图片方式；imgsrc: img src资源方式加载
     * @param {function} options.finishCb 加载完成回调
     */
    function imgloader(options) {
        var loader = window.__imgloader__ = new _loader(options);
    }

    function _loader(options) {
        this.init(options);
        this.load();
    }

    _loader.prototype = {
        //初始化
        init: function(options) {
            var _this;
            this.handleType = options.handleType || 'background';
            this.config = options.config;
            this.defaultUrl = options.defaultUrl;
            this.finishHandle = options.finishCb || function() {};
            this.pool = new Pool(5);
            this.imageMap = {};
        },

        load: function() {
            var _this = this,
                items = this.config;
            for (var i = 0;i < items.length;i++) {
                this.runLoop(items[ i ]);
            }
        },

        runLoop: function(config) {
            var _this = this;
            this.pool.run(function(poolId) {
                _this.createImage(poolId, config);
            });
        },

        createImage: function(poolId, config) {
            var _this = this, img;
            img = new Image();
            //释放
            var release = function() {
                _this.pool.release(poolId);
                img = null;
                delete _this.imageMap[ poolId ];
            }
            var setImg = function(url) {
                var node = document.querySelectorAll(config.selector);
                if(node.length === 0) {
                    console.warn('CMP ImageLoader: selector "' + config.selector + '" is not exist');
                }
                if (_this.handleType === 'background') {
                    node[ 0 ].style.backgroundImage = 'url(' + url + ')';
                } else {
                    node[ 0 ].src = url;
                }
            }
            img.onload = function(e) {
                setImg(config.url);
                release();
            };
            img.onerror = function() {
                setImg(_this.defaultUrl);
                release();
            };
            //加载
            img.src = config.url;
        }
    }
})();