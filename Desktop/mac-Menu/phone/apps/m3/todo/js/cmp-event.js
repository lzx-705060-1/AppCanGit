; (function ($$) {
    var event, util;
    define('todo/js/cmp-event.js', function(require, exports, module) {
        require('zepto');
        util = require('todo/js/cmp-util.js');
        module.exports = event;
    });

    var timer;

    event = {
        on: function(selector, eventName, handle, time) {
            $(selector).on(eventName, function(e) {
                var _this = $(this);
                if (time === 0) {
                    handle(e, _this);
                    return;
                }
                clearTimeout(timer);
                timer = setTimeout(function() {
                    handle(e, _this);
                }, time || 100);
            });
            return this;
        },

        off: function(eventName) {
            $(selector).off(eventName);
        }
    }

})(cmp);
