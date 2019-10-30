/**
 * description 代办列表
 * author 易成
 * createDate 2017-01-06
 */

// var demo = cmp.h2Base64({
//     l: 100, //头像边长（必填）
//         fontSize: 80,//字体大小（必填）
//         text: '12',//文本内容
//         imgUrl: 'images/img.jpeg',//图片地址（文本与图片地址必须有一个填写）
//         success: function(base64){
//         console.log(base64);
//     },
//     error: function(e){
//         console.log(e);
//     }
// });

(function() {

    //构造函数
    function h2Base64(options) {
        if(this instanceof h2Base64) {
            this.refresh(options);
        } else {
            return new h2Base64(options);
        }

    }

    //原型链
    h2Base64.prototype = {

        //初始化canvas
        initCanvas: function() {
            //边长
            var l = this.l,
                cenX = l / 2,
                cenY = l / 2;
            this.l = l;
            this.cav = document.createElement('canvas');
            this.ctx = this.cav.getContext('2d');
            //样式初始化
            this.cav.setAttribute('width', l);
            this.cav.setAttribute('height', l);
            this.cav.style.width = l / 2;
            this.cav.style.height = l / 2;
        },

        //绘制
        draw: function() {
            var ctx = this.ctx,
                objThis = this;
            //判断是否存在图片
            var imgBase64 = {};
            if(this.imgUrl){
                this.loadImg(function(obj){
                    objThis.ctx.translate(obj.tranX, obj.tranY);
                    objThis.ctx.drawImage(obj.img, 0, 0, obj.lx, obj.ly);
                    //回调
                    imgBase64 = objThis.cav.toDataURL()
                    objThis.save2Mobile(imgBase64);
                    objThis.success && objThis.success(imgBase64);
                });
            }else{
                ctx.beginPath();
                ctx.fillStyle = getColor();
                ctx.arc(this.l / 2, this.l / 2, this.l / 2, 0, Math.PI*2, true);
                ctx.fill();
                ctx.closePath();
                ctx.save();
                ctx.font = this.fontSize + 'px  Microsoft YaHei';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#ffffff';
                ctx.fillText(this.text, this.l / 2, this.l / 2);
                ctx.restore();
                imgBase64 = this.cav.toDataURL()
                objThis.save2Mobile(imgBase64);
                objThis.success && objThis.success(imgBase64);
            }

        },
        save2Mobile:function (img) {

            var _options = {
                success: null,
                error: null
            };
            cordova.exec(
                _options.success,
                _options.error,
                "CMPLocalDataPlugin",
                "write",
                [
                    {
                        identifier:"current_user_header",
                        data:img
                    }
                ]
            );
        },

        //加载img
        loadImg: function(callback, errorCb) {
            var img = new Image(),
                objThis = this,
                calObj;
            img.onload = function() {
                //计算缩放后的宽高以及位移坐标
                calObj = calImgScale(img.width, img.height, objThis.l);
                callback({
                    img: img,
                    tranX: calObj.x,
                    tranY: calObj.y,
                    lx: calObj.lx,
                    ly: calObj.ly
                });
            };
            img.onerror = function(e){
                console.log('图片加载错误');
                objThis.error(e);
            }
            img.crossOrigin = "Anonymous";
            img.src = this.imgUrl;
        },

        //刷新
        refresh: function(options) {
            options = options || {};
            for(var i in options){
                this[i] = options[i];
            }
            this.initCanvas();
            this.draw();
        }
    };

    //获取随机颜色
    function getColor() {
        var index = Math.floor(Math.random() * 10);
        var colors = [
            "#E95A4C", "#4098E6", "#A47566", "#777777", "#F3A64C",
            "#8A8A8A", "#F7B55E", "#F2725E", "#568AAD", "#4DA9EB"
        ];
        return index !== 10 ? colors[index] : getColor();
    }

    //按照比例换算
    function calImgScale(x, y, l) {
        var obj = {},
            tranX,
            tranY;
        //宽度大于高度
        if(x > y) {
            imgX = x * l / y;
            imgY = l;
            tranX = (l - imgX) / 2;
            tranY = 0;
            //宽度小于高度
        } else {
            imgX = l;
            imgY = y * l / x;
            tranX = 0;
            tranY = (l - imgY) / 2
        }

        return {
            x: tranX,
            y: tranY,
            lx: imgX,
            ly: imgY
        };
    }
    if(typeof cmp !== 'undefined')cmp.h2Base64 = h2Base64
    window.h2Base64 = h2Base64;
})();