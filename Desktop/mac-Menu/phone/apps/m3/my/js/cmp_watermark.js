/**
 * description: Create a watermark and turn for base64
 * author: Clyne
 * createDate: 2016-12-30
 * demo: 
    cmp.watermark({
        userName: 'Clyne',    //用户名
        department: 'Seeyon'  //单位名
    }).toBase64URL();
    
    //toBase64URL为watermark对象的开放的方法，把水印转为base64
 */

(function(){
            
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
        cav.setAttribute('width', 200);
        cav.setAttribute('height', 200);
        cav.style.width = '100px';
        cav.style.height = '100px';
        return {
            cav: cav,
            ctx: ctx
        };
    }

    //绘制水印
    function paintWatermark(objCav, options){
        var cav = objCav.cav,
            ctx = objCav.ctx;
        ctx.save();
        ctx.font = '24px Microsoft YaHei';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgb(220, 220, 220)';
        ctx.translate(100, 100);
        ctx.rotate((-1) * Math.PI / 4);
        ctx.fillText(options.userName + '      ' + options.department, 0, 0);
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