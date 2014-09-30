require("SyncRequire", function(SyncRequire) {

    var REGEX_CALL = /\(((?:(?:\/\*[\s\S]*?\*\/)|(?:\/\/.*\n)|[^\/])*?)\)/;
    var REGEX_PARAM_SPLIT = /(?:(?:\/\*[\s\S]*?\*\/)|(?:\/\/.*\n)|[,\s\n])+/;

    function nonEmpty(s) {
        return !!s;
    }

    function annotate(fn) {
        var fnStr = String(fn);
        var paramList = fnStr.match(REGEX_CALL);
        var params = paramList[1].split(REGEX_PARAM_SPLIT);
        return params.filter(nonEmpty);
    }

    function SyncRequireReflect(instance) {

        instance.reflect = {
            annotate: annotate
        };

        instance.require.reflect = function(fn) {
            var deps = instance.reflect.annotate(fn);
            instance.require(deps, fn);
        };

        instance.define.reflect = function (fn) {
            var deps = instance.reflect.annotate(fn);
            instance.define(deps, fn);
        };
    }

    SyncRequire.constructor.plugins.reflect = SyncRequireReflect;
    SyncRequireReflect(SyncRequire);
});