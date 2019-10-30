; (function ($) {
    var util;
    define('todo/js/cmp-util.js', function(require, exports, module) {
        module.exports = util;
    });
    util = {
        getParamByUrl: function () {
            try {
                var url = decodeURI(window.location.href);
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

        mix: function (target, options, deep) {
            if (deep === true) {
                console.log('还未实现');
                return;
            }
            for (var i in options) {
                target[i] = options[i];
            }
            return target;
        },

        sort: function(arr, isReverse) {
            var isChange;
            for ( i = 0; i < arr.length - 1;i++ ) {
                for ( j=0; j < arr.length - 1 - i;j++ ) {
                    if (isReverse) {
                        isChange = arr[j] < arr[j + 1]
                    } else {
                        isChange = arr[j] > arr[j + 1]
                    }
                    if ( isChange ) {
                        var temp = arr[j];
                        arr[j] = arr[j + 1];
                        arr[j + 1] = temp;
                    }
                }
            }
        },

        sortByKey: function(arr, key, isReverse) {
            for ( i = 0; i < arr.length - 1;i++ ) {
                for ( j=0; j < arr.length - 1 - i;j++ ) {
                    if (isReverse) {
                        isChange = arr[j][key] < arr[j + 1][key]
                    } else {
                        isChange = arr[j][key] > arr[j + 1][key]
                    }
                    if ( isChange ) {
                        var temp = arr[j];
                        arr[j] = arr[j + 1];
                        arr[j + 1] = temp;
                    }
                }
            }
        }
    }
    $ = $ || {};
    $.util = {};
    util.mix($.util, util);
})(cmp);
