/**
 * Created by Administrator on 2016/10/17 0017.
 */
//分享插件
(function(_){
    _.share = function (options) {
        var _options = {
            title:"",//标题
            text:"",//内容
            url:null,//链接地址
            imgUrl:null,//需要显示的图片地址
            success: null,
            error: null
        };
        _options = _.extend(_options, options);
        if(typeof _options.title != "string"){
            throw "分享插件的标题必须设置成字符串";
        }
        cordova.exec(
            _options.success,
            _options.error,
            "CMPSharePlugin",
            "share",
            [
                {
                    title:_options.title,//标题
                    text:_options.text,//内容
                    url:_options.url,//链接地址
                    imgUrl:_options.imgUrl//需要显示的图片地址
                }
            ]
        );
    };
})(cmp);
