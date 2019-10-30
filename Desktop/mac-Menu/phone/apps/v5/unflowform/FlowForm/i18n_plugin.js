(function($){
    $.i18n = function(key) {
        try {
            var lang = CTPLang[_locale];
            if (!lang)
                return key;
            var msg = lang[key];
            if(!msg){
                msg = lang[key];
            }
            if(!msg){
                msg = lang[key];
            }

            if (msg && arguments.length > 1) {
                var messageRegEx_0 = /\{0\}/g;
                var messageRegEx_1 = /\{1\}/g;
                var messageRegEx_2 = /\{2\}/g;
                var messageRegEx_3 = /\{3\}/g;
                var messageRegEx_4 = /\{4\}/g;
                var messageRegEx_5 = /\{5\}/g;
                var messageRegEx_6 = /\{6\}/g;
                var messageRegEx_7 = /\{7\}/g;
                var messageRegEx_8 = /\{8\}/g;
                var messageRegEx_9 = /\{9\}/g;
                var messageRegEx_10 = /\{10\}/g;
                var messageRegEx_11 = /\{11\}/g;
                var messageRegEx_12 = /\{12\}/g;
                var messageRegEx_13 = /\{13\}/g;
                var messageRegEx_14 = /\{14\}/g;
                var messageRegEx_15 = /\{15\}/g;
                for ( var i = 0; i < arguments.length - 1; i++) {
                    var regEx = eval("messageRegEx_" + i);
                    var repMe = "" + arguments[i + 1];
                    if (repMe.indexOf("$_") != -1) {
                        repMe = repMe.replace("$_", "$$_");
                    }
                    msg = msg.replace(regEx, repMe);
                }
            }

            return msg;
        } catch (e) {
        }

        return "";
    }
})(jQuery);