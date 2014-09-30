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

    SyncRequire.reflect = { annotate: annotate };

    SyncRequire.published.define.reflect = function (fn) {
        var annotate = SyncRequire.reflect.annotate;
        var deps = annotate(fn);
        SyncRequire.published.define(deps, fn);
    };

    SyncRequire.published.require.reflect = function (fn) {
        var annotate = SyncRequire.reflect.annotate;
        var deps = annotate(fn);
        var require = SyncRequire.published.require;
        require(deps, fn);
    };
});