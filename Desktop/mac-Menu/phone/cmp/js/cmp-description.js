/**
 * Created by Ms on 2017/3/22 0022.
 */

/**
 * @description 针对处理文本框，文本域的iOS光标问题
 * @param el 原生DOM对象
 * @tip 这里不能完全解决光标问题，有一个闪的过程
 *
 * CMP新增_.description.init(el);方法，el:文本框  处理文本框，文本域的iOS光标问题
 * 需要引入cmp-description.js文件，文本框多的话，需要重复循环调用此方法。
 */
(function(_){

    _.description={};

    function iOSTextRanger(el) {
        //非iOS return
        if(!window.navigator.userAgent.toUpperCase().match(/IPHONE|IPOD|IPAD/))return;
        var timer,
            keyboardShowTime = 400;
        // 获取焦点
        el.onfocus = function() {
            //避免重复触发，对其进行函数节流
            clearTimeout(timer);
            timer = setTimeout(function() {
                //若el的value为空
                if(el.value === '') {
                    //赋值空格
                    el.value = ' ';
                    //移动光标
                    //el.setSelectionRange(1, 0);
                    //还原
                    el.value = '';
                } else {
                    //获取当前元素光标的位置
                    var start = el.selectionStart,
                        hisStart = el.selectionStart,
                        end;
                    if(start === 0) {
                        start++;
                        end = start;
                    } else {
                        end = start - 1;
                    }
                    el.setSelectionRange(start, end);
                    //还原光标位置
                    if(hisStart === 0)
                        el.setSelectionRange(0, 0);
                    else
                        el.setSelectionRange(hisStart, end + 1);
                }
            }, keyboardShowTime);
        }
    }


    _.description.init = function(val){
        return new iOSTextRanger(val);
    }



})(cmp);


