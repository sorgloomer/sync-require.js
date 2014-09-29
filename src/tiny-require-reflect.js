/**
 * Created by Hege on 2014.09.29..
 */
require("TinyRequire", function(TinyRequire) {

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

    TinyRequire.reflect = { annotate: annotate };

    TinyRequire.published.define.reflect = function (fn) {
        var annotate = TinyRequire.reflect.annotate;
        var deps = annotate(fn);
        TinyRequire.published.define(deps, fn);
    };

    TinyRequire.published.require.reflect = function (fn) {
        var annotate = TinyRequire.reflect.annotate;
        var deps = annotate(fn);
        var require = TinyRequire.published.require;
        require(deps, fn);
    };
});