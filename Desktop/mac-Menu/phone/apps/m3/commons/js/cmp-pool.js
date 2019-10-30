/**
 * @module util
 * @description 连接池模型 create date: 2018-08-01
 * @author Clyne
 */

;(function() {
    var uuid;
    //模块定义
    define && define.cmd && define('cmpUtil/cmp-pool.js', function(require, exports, module) {
        uuid = require('cmpUtil/cmp-uuid.js');
        module.exports = pool;
    });

    /**
     * @constructor
     * @description 连接池构造函数
     * @param {number}} size 大小
     */
    function pool(size) {
        this.size = size || 20;
        this.queue = [];
        this.pools = [];
    }

    /**
     * @private
     * @method createId
     * @description 创建uuid
     * @return {string} uuid
     */
    function createId() {
        // return Math.floor(Math.random() * 10000000000000000);
        return uuid.generate();
    }

    //原型链
    pool.prototype = {

        /**
         * @public
         * @method run
         * @description 连接池操作
         * @param {function} handle 处理函数
         */
        run: function(handle) {
            //给handle生成ID
            var id = createId();
            //判断连接池是否占满
            if (this.pools.length === this.size) {
                //进入队列
                this.queue.push({
                    id: id,
                    handle: handle
                });
            } else {
                //连接池未满，则push到池中，并且开始执行函数
                this.pools.push({
                    id: id
                });
                handle(id);
            }
            return this;
        },

        /**
         * @public
         * @method release
         * @description 释放池资源
         * @param {object String} id 池id
         */
        release: function(id) {
            var queueItem = this.queue[0];
            //TODO 查找算法优化项
            for (var i = 0;i < this.pools.length; i++) {
                if (id === this.pools[ i ].id) {
                    //释放pool
                    this.pools.splice(i, 1);
                    //队列为空，return
                    if (!queueItem) { break; }
                    //入池，执行队列第一个，并且清理队列
                    this.pools.push({
                        id: queueItem.id
                    });
                    queueItem.handle(queueItem.id, queueItem.params);
                    this.queue.splice(0, 1);
                    break;
                }
            }
            //检查
            if (this.pools.length === 0 && this.queue.length === 0) {
                this.freeHandle && this.freeHandle();
            }
        },
        
        /**
         * @public
         * @method free
         * @description 释放池资源
         * @param {object String} id 池id
         */
        free: function(handle) {
            if (typeof handle === 'function') {
                this.freeHandle = handle;
            }
        },

        /**
         * @public
         * @method clean
         * @description 清除连接池
         */
        clean: function() {
            this.pools = [];
            this.queue = [];
        }
    }
})();