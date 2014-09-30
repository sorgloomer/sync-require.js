
require("SyncRequire", function(SyncRequire) {
    SyncRequire.namespace = {
        current: null,
        namespaced: namespaced
    };

    var oldGenerateKey = SyncRequire.core.generateKey;
    var oldResolve = SyncRequire.core.resolve;

    SyncRequire.core.generateKey = function() {
        return SyncRequire.namespace.namespaced(oldGenerateKey());
    };

    SyncRequire.core.resolve = function(name) {
        if (name.indexOf('.') < 0) {
            var name2 = SyncRequire.namespace.namespaced(name);
            var temp = oldResolve(name2);
            if (temp) return temp;
        }
        return oldResolve(name);
    };

    function namespaced(name) {
        return (SyncRequire.namespace.current || "") + "." + name;
    }

    function namespace(name) {
        SyncRequire.namespace.current = name;
    }

    SyncRequire.publish("namespace", namespace);
});