/**
 * Created by Hege on 2014.09.28..
 */

(function(context) {
    'use strict';

    var TinyRequire = {
        core: {
            generateKey: function () {
                return TinyRequire.core.currentModule;
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
        TinyRequire.context[name] = fn;
        TinyRequire.published[name] = fn;
    }

    TinyRequire.core.providers = {
        TinyRequire: {
            cached: true,
            module: TinyRequire
        }
    };

    function resolve(name) {
        var providers = TinyRequire.core.providers;
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
            cached: false
        };
    }

    function provide(provider, from) {
        if (!provider.cached) {
            var deps = provider.deps;
            if (deps) {
                if (typeof deps === "string") deps = [deps];
                deps = deps.map(function(name) {
                    var res = TinyRequire.core.resolve(name);
                    if (!res) throw new Error("Unmet dependency '"+from+"' -> '"+name+"'");
                    return provide(res, name);
                })
            }
            provider.module = provider.generator.apply(context, deps);
            provider.cached = true;
        }
        return provider.module;
    }

    function module(name) {
        TinyRequire.core.currentModule = name;
    }

    function require(deps, generator) {
        return provide(makeProvider(deps, generator), "ROOT");
    }

    function define(deps, generator) {
        var providers = TinyRequire.core.providers;
        var name = TinyRequire.core.generateKey();
        if (Object.prototype.hasOwnProperty.call(providers, name)) {
            throw new Error("Multiple definitions for '" + name + "'");
        }
        providers[name] = makeProvider(deps, generator);
    }

    publish("define", define);
    publish("require", require);
    publish("module", module);
    publish("TinyRequire", TinyRequire);
})(window);
