/**
 * @description 页面塘狂
 * @author ybjuejue
 * @createDate 2018/9/28/028
 */
;(function (win) {
    var modelWarp = '<div class="notice-component">\n' +
        '    <div class="window_alert">\n' +
        '        <div class="window_alert_content">\n' +
        '            <div class="container">\n' +
        '            </div>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '    <div class="cmp-backdrop cmp_bomb_box_backdrop "></div>\n' +
        '</div>'
    win.alertModal = function (v, info) {
        $('.notice-component').remove();
        var alertHtml = '<h5 class="window_alert_title">' + info.title + '</h5>\n' +
            '                <div class="window_alert_cont"><span class="text">' + v + '</span></div>\n' +
            '                <div class="window_alert_sub cmp-before-line">\n' +
            '                    <button class="cmp-btn cmp-btn-primary cmp_dialog_btn width_85">' + info.sure + '</button>\n' +
            '                </div>';
        $(modelWarp).appendTo(document.body).find('.container').html(alertHtml).find('button').on('tap', function () {
            typeof info.fn === 'function' && info.fn();
            $('.notice-component').remove();
        });
    };
    win.confirmModal = function (v, buttons) {
        $('.notice-component').remove();
        var confirmModal = '<div class="window_alert_cont">\n' +
            '                    <span class="text">' + v + '</span>\n' +
            '                </div>\n' +
            '                <div class="window_alert_sub cmp-before-line">\n' +
            '                    <button class="cmp-btn cmp-btn-primary cmp_dialog_btn">' + buttons[0].text + '</button>\n' +
            '                    <button class="cmp-btn cmp-btn-primary cmp_dialog_btn cmp-before-left-line">' + buttons[1].text + '</button>\n' +
            '                </div>';
        $(modelWarp).appendTo(document.body).find('.container').html(confirmModal).find('button').each(function (i) {
            $(this).on('tap', function () {
                typeof buttons[i].fn === 'function' && buttons[i].fn(i);
                $('.notice-component').remove();
            })
        });
    }
    win.tipsModal = function (v, fn) {
        var textModel = '<div class="notice-component middle-center">\n' +
            '        <div class="success-bomb success-bomb-start">\n' +
            '            <i class="iconfont icon-duigou"></i>\n' +
            '            <p>\n' + v +
            '            </p>\n' +
            '        </div>\n' +
            '    </div>';
        var textModelNode = $(textModel).appendTo(document.body);
        var tips = textModelNode.find('.success-bomb');
        tips.on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function () {
            setTimeout(function () {
                textModelNode.remove();
                typeof fn === 'function' && fn();
            }, 1100);
        });
        setTimeout(function () {
            tips.removeClass('success-bomb-start');
        }, 4)
    }
})(window);