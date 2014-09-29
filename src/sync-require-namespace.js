/**
 * Created by Hege on 2014.09.29..
 */

require("TinyRequire", function(TinyRequire) {
    TinyRequire.namespace = {
        current: null,
        namespaced: namespaced
    };

    var oldGenerateKey = TinyRequire.core.generateKey;
    var oldResolve = TinyRequire.core.resolve;

    TinyRequire.core.generateKey = function() {
        return TinyRequire.namespace.namespaced(oldGenerateKey());
    };

    TinyRequire.core.resolve = function(name) {
        if (name.indexOf('.') < 0) {
            var name2 = TinyRequire.namespace.namespaced(name);
            var temp = oldResolve(name2);
            if (temp) return temp;
        }
        return oldResolve(name);
    };

    function namespaced(name) {
        return (TinyRequire.namespace.current || "") + "." + name;
    }

    function namespace(name) {
        TinyRequire.namespace.current = name;
    }

    TinyRequire.publish("namespace", namespace);
});