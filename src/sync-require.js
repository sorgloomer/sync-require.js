
(function(context) {
    'use strict';


    function generateKey(name) {
        return name;
    }
    function SyncRequire() {
        var self = this;
        function resolve(name) {
            var providers = self.providers;
            if (Object.prototype.hasOwnProperty.call(providers, name)) {
                return providers[name];
            } else {
                return null;
            }
        }

        function provide(provider, from) {
            if (!provider.cached) {
                if (provider.creating) {
                    throw new Error("Circular dependency including '"+from+"'");
                } else {
                    provider.creating = true;
                    var deps = provider.deps;
                    if (deps) {
                        if (typeof deps === "string") deps = [deps];
                        deps = deps.map(function (name) {
                            var res = self.resolve(name);
                            if (!res) throw new Error("Unmet dependency '" + from + "' -> '" + name + "'");
                            return provide(res, name);
                        })
                    }
                    provider.module = provider.generator.apply(context, deps);
                    provider.cached = true;
                    provider.creating = false;
                }
            }
            return provider.module;
        }

        function require(deps, generator) {
            return provide(makeProvider(deps, generator), "ROOT");
        }

        function define(name, deps, generator) {
            var providers = self.providers;
            name = self.generateKey(name);
            if (Object.prototype.hasOwnProperty.call(providers, name)) {
                throw new Error("Multiple definitions for '" + name + "'");
            }
            providers[name] = makeProvider(deps, generator);
        }

        this.providers = {
            SyncRequire: {
                cached: true,
                creating: false,
                module: this
            }
        };
        this.generateKey = generateKey;
        this.resolve = resolve;
        this.require = require;
        this.define = define;
    }

    SyncRequire.context = context;
    SyncRequire.publish = publish;
    SyncRequire.plugins = {};

    function publish(name, fn) {
        SyncRequire.context[name] = fn;
    }

    function makeProvider(deps, generator) {
        if (typeof deps === "function") {
            generator = deps;
            deps = null;
        }
        return {
            deps: deps,
            generator: generator,
            module: null,
            cached: false,
            creating: false
        };
    }

    var i = SyncRequire.instance = new SyncRequire();

    publish("define", i.define);
    publish("require", i.require);
    publish("SyncRequire", SyncRequire);
})(window);
