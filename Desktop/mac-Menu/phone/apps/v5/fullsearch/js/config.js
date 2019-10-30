;(function() {
        //common路径
    var __baseUrl__ = window.commonsUrl || window.__baseUrl__,
        //门户，应用路径
        application = window.applicationUrl,
        //我的路径
        myPath = window.myUrl,
        loginPath = window.loginUrl;
    var wechat = cmp.platform.wechat;
    if(wechat){
        seajs.config({
            //别名配置
            alias: {
                //vue
                // vue: __baseUrl__ + '/js/js/vue-2.4.2.js',
                //scroll
                scroll: __baseUrl__ + '/js/js/m3-scroll.js',
                //iscroll
                iscroll: __baseUrl__ + '/js/js/iscroll-5.1.3.js',
                //zepto
                zepto: __baseUrl__ + '/js/js/zepto-1.2.0.js',
                //事件流模块
                event: __baseUrl__ + '/js/js/m3-event.js',
                //数据请求模块
                ajax: __baseUrl__ + '/js/js/m3-ajax.js',
                //错误模块
                error: __baseUrl__ + '/js/js/m3-error.js',
                //原生API
                // native: __baseUrl__ + '/js/js/m3-native-api.js',
                //调试模块
                debug: __baseUrl__ +'/js/js/m3-debug-2.0.js',
                //工具类函数
                tools: __baseUrl__ + '/js/js/m3-tools.js',
                //M3配置参数
                m3Config: __baseUrl__ + '/js/m3-config.js',
                //国际化文件
                m3i18n: __baseUrl__ + '/js/js/m3i18n.js',
                //m3公共文件
                m3: __baseUrl__ + '/js/js/m3.js',
                //m3 indexedDB
                // indexDB: __baseUrl__ + '/js/js/m3-db.js',
                //M3 sqlDB
                sqliteDB: __baseUrl__ + '/js/js/m3-sqlite-db.js',
                //M3常用业务
                commons:__baseUrl__ + '/js/js/m3-commons.js',
                //原生缓存
                nativeCache: __baseUrl__ + '/js/js/m3-cache.js'
            },
            // 路径配置
            paths: {
                //信息门户
                portal: application + 'portal-module/',
                //应用 zip
                application: application,
                //我的 
                myPath: myPath,
                //登录
                login: loginPath,
                //commons
                commons: __baseUrl__,
                //components
                components: __baseUrl__ + '/components/',
                //template
                template: __baseUrl__ + '/template/'
            },
            //seaJS基础路径(回到根路径)
            base: '',
            //编码格式
            charset: 'utf-8'
        });
    }else{
        seajs.config({
            //别名配置
            alias: {
                //vue
                vue: __baseUrl__ + '/js/js/vue-2.4.2.js',
                //scroll
                scroll: __baseUrl__ + '/js/js/m3-scroll.js',
                //iscroll
                iscroll: __baseUrl__ + '/js/js/iscroll-5.1.3.js',
                //zepto
                zepto: __baseUrl__ + '/js/js/zepto-1.2.0.js',
                //事件流模块
                event: __baseUrl__ + '/js/js/m3-event.js',
                //数据请求模块
                ajax: __baseUrl__ + '/js/js/m3-ajax.js',
                //错误模块
                error: __baseUrl__ + '/js/js/m3-error.js',
                //原生API
                native: __baseUrl__ + '/js/js/m3-native-api.js',
                //调试模块
                debug: __baseUrl__ +'/js/js/m3-debug-2.0.js',
                //工具类函数
                tools: __baseUrl__ + '/js/js/m3-tools.js',
                //M3配置参数
                m3Config: __baseUrl__ + '/js/m3-config.js',
                //国际化文件
                m3i18n: __baseUrl__ + '/js/js/m3i18n.js',
                //m3公共文件
                m3: __baseUrl__ + '/js/js/m3.js',
                //m3 indexedDB
                indexDB: __baseUrl__ + '/js/js/m3-db.js',
                //M3 sqlDB
                sqliteDB: __baseUrl__ + '/js/js/m3-sqlite-db.js',
                //M3常用业务
                commons:__baseUrl__ + '/js/js/m3-commons.js',
                //原生缓存
                nativeCache: __baseUrl__ + '/js/js/m3-cache.js'
            },
    
            // 路径配置
            paths: {
                //信息门户
                portal: application + 'portal-module/',
                //应用 zip
                application: application,
                //我的 
                myPath: myPath,
                //登录
                login: loginPath,
                //commons
                commons: __baseUrl__,
                //components
                components: __baseUrl__ + '/components/',
                //template
                template: __baseUrl__ + '/template/'
            },
    
            //seaJS基础路径(回到根路径)
            base: '',
    
            //编码格式
            charset: 'utf-8'
        });
    }
    


})();