/**
 * author Clyne
 * description JS develop tools bag，Suitable for mobile terminal development
 * create-date 2017-07-25
 */
;(function() {
    var tools = {

        //缓存原型链对象toString
        objToString: Object.prototype.toString,
        /**
         *  ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝数据类型类工具＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
         */

        //类型判断（浅）
        getTypeof: function(){
            return typeof arguments[0];
        },

        //类型判断（深）
        getType: function(){
            return this.objToString.call(arguments[0]);
        },

        //是否为数组
        isArray: function(){
            return this.objToString.call(arguments[0]) === '[object Array]';
        },

        //是否为字符串
        isString: function(){
            return this.objToString.call(arguments[0]) === '[object String]';
        },

        //是否绝对对象
        isObject: function(){
            return this.objToString.call(arguments[0]) === '[object Object]';
        },

        //是否数字类型
        isNumber: function(){
            return this.objToString.call(arguments[0]) === '[object Number]';
        },

        //是否方法类型
        isFunction: function(){
            return this.objToString.call(arguments[0]) === '[object Function]';
        },

        //是否为布尔类型
        isBoolean: function(){
            return this.objToString.call(arguments[0]) === '[object Boolean]';
        },

        //是否为Null类型
        isNull: function(){
            return this.objToString.call(arguments[0]) === '[object Null]';
        },

        //是否为Undefined类型
        isUndefined: function(){
            return this.objToString.call(arguments[0]) === '[object Undefined]';
        },

        //是否为error对象
        isError: function() {
            return Object.prototype.toString.call(arguments[0]) === '[object Error]';
        },

        //是否为事件对象
        isEvent: function() {
            return Object.prototype.toString.call(arguments[0]) === '[object Event]';
        },

        //是否为事件对象
        isArguments: function() {
            return Object.prototype.toString.call(arguments[0]) === '[object Arguments]';
        },

        /**
         *  ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝数组类工具＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
         */

        /**
         * @description 根据值获取当前序列号
         * @param arr,原数组 [object Array]
         * @param value,匹配值 任意类型
         * @param isJSONString,是否需要转换JSON字符串 [object Boolen] 非必填
         */
        arrIndex: function(arr, value){
            //判断是否存在indexOf方法
            if(arr.indexOf){
                return arr.indexOf(value);
            }else{
                //遍历匹配
                for(var i = 0;i < arr.length;i++){
                    if(arr[i] === value){
                        return i;
                    }
                }
                return -1;
            }
        },
        
        /**
         * @description 根据key值获取当前序列号
         * @param arr,原数组 [object Array]
         * @param key,需要匹配的键值[object String]
         * @param value,匹配值 任意类型
         * @param isJSONString,是否需要转换JSON字符串 [object Boolen] 非必填
         */
        arrIndexByKey: function(arr, key, value) {
            for (var i = 0;i < arr.length;i++) {
                if (arr[i][key] === value) {
                    return i;
                }
            }
            return -1;
        },

        /**
         * @description 将一个值插入数组的指定位置
         * @param arr,原数组 [object Array]
         * @param index,插入位置 [object Number]
         * @param value,插入值 任意类型
         */
        arrInsert: function(arr, index, value){
            arr.splice(index, 0, value);
            return arr;
        },

        /**
         * @description 删除数组的指定元素
         * @param arr,原数组 [object Array]
         * @param value,删除值 任意类型 非必填
         * @param index,删除的位置 [object Number] 非必填
         * PS：value与index必须存在一个，index优先级高，有index按index坐标来删除
         */
        arrRmove: function(arr, value, index){
            if(!index){
                index = this.arrIndex(value);
            }
            arr.splice(index, 1);
            return arr;
        },

        /**
         * @description 数组排序
         * @param arr,原数组 [object Array]
         * @param isReverse,是否逆序 [object Boolen] 非必填
         * PS:ES5以上才支持
         */
        arrSort: function(arr, isReverse){
            //利用元素Array的sort的特性
            return arr.sort(function(a, b){
                //是否为逆序
                if(isReverse){
                    return b - a;
                //顺序
                }else{
                    return a - b;
                }
            });
        },

        /**
         * @description 数组去重，去重算法以及Set对象
         * @param arr,原数组 [object Array]
         * @param isReverse,是否逆序 [object Boolen] 非必填
         * PS:ES5以上才支持
         */
        arrUnique: function(value){
            var obj,
                arr = [],
                type;
            //判断是否存在ES5，ES6 Set对象（兼容些渣渣浏览器，例如说某些安卓原生浏览器，fk碧池）
            if(Set){
                obj = new Set(value);
                obj.forEach(function(i){
                    arr.push(i);
                });
                return arr;
            }
            obj = {};
            //正常的去重算法，算法：比对对象键值
            for(var i = 0; i < value.length;i++){
                type = this.getType(value[i]);
                //是否存在
                if(!obj[value[i]]){
                    //储存它的键值
                    obj[value[i]] = type;
                    arr.push(value[i]);
                //当存在的时候，去比较储存的键值，不完全一致则插入
                }else if(obj[value[i]] !== type){
                    obj[value[i]] = type;
                    arr.push(value[i]);
                }
            }
            return arr;
        },

        extend: function(obj1, obj2) {

        },

        /**
         *  ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝其他类型工具＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
         */

        /**
         * @description 字典型对象长度
         * @param value,数据源 [object Object]
         */
        objLength: function(value){
            var count = 0;
            for(var i in value){
                count++;
            }
            return count;
        },

        /**
         * @description 判断是否数据是否为空
         * @param value,数据源 任意类型
         * PS:对[object Function]无效
         */
        isEmpty: function(value){
            if(value){
                //对象，且长度为0
                if(this.isObject(value)){
                    if(this.objLength(value) === 0){
                        return true
                    }
                //数组，且长度为0
                }else if(this.isArray(value)){
                    if(val.length === 0){
                        return true
                    }
                }
                return false;
            }else{
                //数字，且不为0
                if(value === 0 || value === false){
                    return false;
                }
                return true;
            }
        },
       /**
        * @description 将类url.search的字符串处理成对象
        * @params str 序列化字符串
        */
       getParamByUrl: function (str) {
           try {
               var url = decodeURI(str || '');
               url = url.split('?')[1];
               url = url.replace(/=/g, '":"');
               url = url.replace(/&/g, '","');
               url = url.replace('?', '');
               url = url.replace(/#\S*/g, '')
               url = '{"' + url + '"}';
           } catch (e) {
               return {};
           }
           return JSON.parse(url);
       },

        /**
         * @description 浮点数相乘，由于浮点数相乘会出现精度问题
         * @param arg1,被乘数 [object Number]
         * @param arg2,乘数 [object Number]
         */
        MathFloatmul: function(arg1, arg2) {
            var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
            try { m += s1.split(".")[1].length } catch (e) { }
            try { m += s2.split(".")[1].length } catch (e) { }
            return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
        },

        /**
         * @description 日期时间的格式转换
         * @param value,被转换的值 [object String]|[object Object]（必须为时间Date对象），格式实例： 2016-12-30，2016/12/30,date对象
         * @param formatType,格式 [object String],具体如下：
         * y表示年，M表示月，d表示日，h表示小时，m表示分钟，s表示小时，S表示毫秒
         * 实例：1,yy-MM-dd hh:mm:ss 2,yy年MM月dd日 hh时mm分ss秒
         */
        formatDate: function(value, formatType){
            var dateObj = this.isObject(value) ? value : new Date(value),
                o = {
                    "M+": dateObj.getMonth() + 1, //月份 
                    "d+": dateObj.getDate(), //日 
                    "h+": dateObj.getHours(), //小时 
                    "m+": dateObj.getMinutes(), //分 
                    "s+": dateObj.getSeconds(), //秒 
                    "q+": Math.floor((dateObj.getMonth() + 3) / 3), //季度 
                    "S": dateObj.getMilliseconds() //毫秒 
                };
            if(/(y+)/.test(formatType)){
                formatType = formatType.replace(RegExp.$1, (dateObj.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            for(var k in o){
                if(new RegExp("(" + k + ")").test(formatType)){
                    formatType = formatType.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" +   o[k]).substr(("" + o[k]).length)));
                } 
            }
            return formatType;
        }
    };
    //定义配置参数模块
    define(function(require, exports, module){
        module.exports = tools;
    });
})();