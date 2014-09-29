tiny-require.js
===============

An extremely lightweight dependency injection framework for javascript in the browser

Usage
-----

Arrange your modules in files like this:

```
// greeter.js
module('greeter');
define(function() {
	return {
		greet: function() {
			alert('Welcome!');
		}
	};
});
```
```
// delayedGreeter.js
module('delayedGreeter');
define(['greeter'], function(greeter) {
	return {
		greet: function() {
			setTimeout(greeter.greet, 1000);
		}
	};
});
```

And populate your index.html file with your definitions in any order! (except for tyni-require itself. It must be the first...)

```
...
<!-- tiny-require.js -->
<script src="tiny-require.js"></script>
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


