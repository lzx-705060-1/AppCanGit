(function(_){
    _.shortcutMenu = {};
    _.shortcutMenu.show = function(options){
        var _options = _.extend({
            success:null,
            error:null
        },options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPShortcutMenuPlugin",
            "show",
            [{}]
        );
    };
    _.shortcutMenu.hide = function(options){
        var _options = _.extend({
            success:null,
            error:null
        },options);
        cordova.exec(
            _options.success,
            _options.error,
            "CMPShortcutMenuPlugin",
            "hide",
            [{}]
        );
    };
})(cmp);
