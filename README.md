sync-require.js
===============

An extremely lightweight dependency injection framework for javascript in the browser

Usage
-----

Arrange your modules in files like this:

```
// greeter.js
define('greeter', function() {
	return {
		greet: function() {
			alert('Welcome!');
		}
	};
});
```
```
// delayedGreeter.js
define('delayedGreeter', ['greeter'], function(greeter) {
	return {
		greet: function() {
			setTimeout(greeter.greet, 1000);
		}
	};
});
```

And populate your index.html file with your definitions in any order! (Except for sync-require itself. It must be the first...)

```
...
<!-- sync-require.js -->
<script src="sync-require.js"></script>
<!-- list of your modules, in any order -->
<script src="delayedGreeter.js"></script>
<script src="greeter.js"></script>
...
<!-- entry point of your application -->
<script>
	require(['delayedGreeter'], function(delayedGreeter) {
		delayedGreeter.greet();
	});
</script>
...
```

When should I use it?
---------------------
Well, if you:
   * like AngularJs's dependency injection system, but
      * You don't want the rest of it
   * like RequireJs, but
      * You don't like asynchronous loading
      * And you don't want to insert RequireJs's preprocessor into your toolchain
   * like very small frameworks
   * are going to use your modules only in browsers (but not in Node.js or Rhino, etc..)

Then you will probably be happy with sync-require.

How does it work?
-----------------
syncRequire injects three functions into window:
   * ```define```: Registers a factory method for a module with the given name. The factory method is guaranteed to run at most once, only when it is needed by a dependency resolution.
      * ```define(name:string, factory:function)``` - Defines a module without dependencies. The factory method will be called without arguments.
      * ```define(name:string, dependency:string, factory:function)``` - Defines a module with a single dependency. The factory method will be called with one parameter.
      * ```define(name:string, dependencies:string[], factory:function)``` - Defines a module with multiple dependencies. The dependencies array can be empty, or singleton. 
   * ```require```: Use this method to define an entry point of your application. Normally only one call of ```require``` is required. This method immediately causes a dependency resolution. If some of the dependencies does not meet, then an error will be thrown, otherwise the entry function will be called with the resolved dependencies. This method does not use definitions registered after the invocation.
      * ```require(dependency:string, entry:function)``` - Injects a single dependency into ```entry```, and calls it.
      * ```require(dependencies:string[], entry:function)``` - Injects dependencies into ```entry```, and calls it.

Namespaces
----------

By default, sync-require does not handle namespaces. However an extension is provided.

TODO

Automated dependency name extraction
------------------------------------

In AngularJS you can define modules without explicitly listing the referenced modules as strings. Instead, it can extract the parameter names from the given function. If you like this functionality, you can take advantage of this in sync-require as well by using the sync-require-reflect extension.
Keep in mind that minification of such a code that uses this technique will cause corruption, unless you are using tools in your build process such as ngMin, that will transform your code to use explicit naming of your references. Such a tool for sync-require does not exist yet.

TODO
