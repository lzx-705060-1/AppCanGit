/**
 * description: Create a watermark and turn for base64
 * author: Clyne
 * createDate: 2016-12-30
 * demo: 
    cmp.watermark({
        userName: 'Clyne',    //用户名
        department: 'Seeyon'  //单位名
        date: '2017-01-10'    //时间
    }).toBase64URL();
    
    //toBase64URL为watermark对象的开放的方法，把水印转为base64
    //生成的图片大小是400 * 200，背景图片的size最好设为200 * 100比较清晰
 */

;(function(){
            
    //constructor
    var watermark = function(options){
        //安全作用域constructor
        if(this instanceof watermark){
            //初始化canvas 2d对象
            this.objCav = initCanvas(options);
            this.objCav = paintWatermark(this.objCav, options);
        }else{
            return new watermark(options);
        }
    };

    //watermark原型链，public的方法
    watermark.prototype = {
        //输出base64URL
        toBase64URL: function(){
            return this.objCav.cav.toDataURL();
        }
        //预留接口
        //预留接口
        //预留接口
    };

    /*private的方法*/
    //初始化canvas
    function initCanvas(options){
        var cav = document.createElement('canvas'),
            ctx = cav.getContext('2d');
        //样式初始化
        cav.setAttribute('width', 400);
        cav.setAttribute('height', 200);
        cav.style.width = '200px';
        cav.style.height = '100px';
        return {
            cav: cav,
            ctx: ctx
        };
    }
    
    var wordNum;

    function strlen(str, maxNum){
        var result = '',
            len = 0,
            c;
        maxNum = maxNum * 2;
        for (var i = 0; i < str.length; i++) { 
            c = str.charCodeAt(i); 
            //单字节加1 
            if((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c<=0xff9f)) { 
                if (len > maxNum) {
                    result += '...'
                    break;
                } else {
                    len++;
                    result += str[i];
                }
            } else { 
                if (len > maxNum) {
                    result += '...'
                    break;
                } else {
                    len += 2;
                    result += str[i];
                }
            } 
        } 
        return result;
    }
    //绘制水印
    function paintWatermark(objCav, options){
        var cav = objCav.cav,
            ctx = objCav.ctx,
            //人名
            numA = 0,
            //部门
            numB = 0,
            account = 0;
        ctx.save();
        ctx.font = '24px Microsoft YaHei';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#cecece';
        ctx.translate(200, 100);
        ctx.rotate((-1) * Math.PI / 10);
        options.userName ? account++ : account;
        options.department ? account++ : account;
        options.date ? account++ : account;
        if (account === 1) {
            numA = numB = 15;
        }
        if (account === 2) {
            numA = numB = 7;
        }
        if (account === 3) {
            numA = 3;
            numB = 5;
        }
        if(options.userName) {
            options.userName = strlen(options.userName, numA)
        }
        if(options.department) {
            options.department = strlen(options.department, numB)
        }
        ctx.fillText((options.userName || '') + ' ' + (options.department || '') + ' ' + (options.date || ''), 0, 0);
        ctx.restore();
        return {
            cav: cav,
            ctx: ctx
        };
    }

    //基于cmp,cmp不存在则不拓展到cmp
    if(window.cmp)
        cmp.watermark = watermark;
    else
        window.watermark = watermark;
})();