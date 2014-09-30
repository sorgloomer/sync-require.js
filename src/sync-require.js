
(function(context) {
    'use strict';

    var SyncRequire = {
        core: {
            generateKey: function () {
                return SyncRequire.core.currentModule;
            },
            providers: null,
            currentModule: null,
            resolve: resolve
        },
        context: context,
        published: {},
        publish: publish
    };

    function publish(name, fn) {
        SyncRequire.context[name] = fn;
        SyncRequire.published[name] = fn;
    }

    SyncRequire.core.providers = {
        SyncRequire: {
            cached: true,
            creating: false,
            module: SyncRequire
        }
    };

    function resolve(name) {
        var providers = SyncRequire.core.providers;
        if (Object.prototype.hasOwnProperty.call(providers, name)) {
            return providers[name];
        } else {
            return null;
        }
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
                        var res = SyncRequire.core.resolve(name);
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

    function module(name) {
        SyncRequire.core.currentModule = name;
    }

    function require(deps, generator) {
        return provide(makeProvider(deps, generator), "ROOT");
    }

    function define(deps, generator) {
        var providers = SyncRequire.core.providers;
        var name = SyncRequire.core.generateKey();
        if (Object.prototype.hasOwnProperty.call(providers, name)) {
            throw new Error("Multiple definitions for '" + name + "'");
        }
        providers[name] = makeProvider(deps, generator);
    }

    publish("define", define);
    publish("require", require);
    publish("module", module);
    publish("SyncRequire", SyncRequire);
})(window);
