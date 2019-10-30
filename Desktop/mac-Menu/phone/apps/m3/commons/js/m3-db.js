define(function(require, exports, module) {
    var error = require('error'),
        m3Config = require('m3Config');
    
    var DB = function() {
        this.DBName = m3Config.DBName;
        //初始化DB
        this.DBRequest = this.initDB();
        //失败终止执行
        if (this.dbRequest) return;
        //监听以及赋值this.DBStore对象
        this.dbRequestListener();
    };
    
    DB.prototype = {
        
        initDB: function() {
            var dbRequest;
            if (!this.DBName) {
                error.notify('m3常量配置文件DBName为空，请联系相关开发人员');
                return;
            }
            return window.indexedDB.open();
        },
        
        dbRequestListener: function() {
            var dbObj = this.DBRequest,
                objThis = this;
            
            //初始化DBResquest失败
            dbObj.onerror = function(e) {
                e.errorType = 'DBError';
                error.notify(e);
            };
            
            //初始化DBResquest成功
            dbObj.onsuccess = function(ret) {
                console.log(ret);
            };
            
            //第一次初始化DBResquest
            dbObj.onupgradeneeded = function(ret) {
                
            };
        }
    };
});