/**
 * author Clyne,mashan
 * description 人员列表模板
 * createDate 2017-11-13
 */
;(function() {
    var tools;
    define(function(require, exports, module) {
        //加载模块
        tools = require('tools')
        module.exports = template;
    });
    
    function template(data,ip){
        if(!data)return;
        var str = ''; 
        for (var i = 0;i < data.length;i++) {
            var cliceName = data[i].N.substr(1);
            var imgUrl = ip + data[i].IMG;
            str += '<li id="'+ data[i].I +'" class="cmp-table-view-cell aspersonnel-item-cell cmp-media">\
                        <a href="javascript:;">\
                            <div class="personel_refer" style="background:url('+imgUrl+') no-repeat;">\
                                <span>'+ cliceName +'</span>\
                            </div>\
                            <div class="cmp-media-body personel_info">\
                                <span>'+data[i].N +'</span>\
                                <p class="cmp-ellipsis">'+ data[i].P +'</p>\
                            </div>\
                        </a>\
                    </li>';
        }
        return str;
    }
})();