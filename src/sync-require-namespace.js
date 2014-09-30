
require("SyncRequire", function(SyncRequire) {

    function SyncRequireNamespace(instance) {
        var oldGenerateKey = instance.generateKey;
        var oldResolve = instance.resolve;

        instance.generateKey = function(name) {
            return namespace.namespaced(oldGenerateKey(name));
        };

        instance.resolve = function(name) {
            if (name.indexOf('.') < 0) {
                var name2 = namespace.namespaced(name);
                var temp = oldResolve(name2);
                if (temp) return temp;
            }
            return oldResolve(name);
        };

        function namespaced(name) {
            return (namespace.current || "") + "." + name;
        }

        function namespace(name) {
            namespace.current = name;
        }

        instance.namespace = namespace;
        namespace.namespaced = namespaced;
        namespace.current = null;
    }

    SyncRequire.constructor.plugins.namespace = SyncRequireNamespace;
    SyncRequireNamespace(SyncRequire);
    SyncRequire.constructor.publish("namespace", SyncRequire.namespace);
});