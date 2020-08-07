---
title: Babel Webpack
author: tyk
date: 2020-02-21 10:53:27
tags:
---

##  Babel Webpack

### @babel/preset-env

用来取代以前的 `es2016`、`es2017`、`stage-x` 等等 `preset`、它是一个合集，包含已经成为标准的提案。它的`useBuiltIns`能配置如何处理`polyfill`，现在已经不在推荐使用`@babel/polyfill`。一般的配置如下：

``` json 
{
	"presets": [
		[
			"@babel/preset-env",
			{
				"targets": [
					"chrome >= 58",
					"iOS >= 9",
					"Android >= 5"
				],
				"useBuiltIns": "usage",
				"corejs": 3
			}
		]
	]
}
```

- `useBuiltIns` 用来指定 `polyfill` 如何处理，配合 `core-js`使用（推荐使用`core-js@3`）有以下三个取值：

	```js 
	const foo = { name: 'Ming' };
	const bar = { address: 'Beijing', age: '18' };

	Object.assign(foo, bar);

	const map = new Map();
	```

	- usage:（推荐）会按需引入 `polyfill`
	
		```js
		"use strict";
		require("core-js/modules/es.array.iterator");
		require("core-js/modules/es.map");
		require("core-js/modules/es.object.assign");
		require("core-js/modules/es.object.to-string");
		require("core-js/modules/es.string.iterator");
		require("core-js/modules/web.dom-collections.iterator");

		var foo = {
		name: 'Ming'
		};
		var bar = {
		address: 'Beijing',
		age: '18'
		};
		Object.assign(a, b);
		var map = new Map();
		```
	- entry: 会引入全部 `polyfill`

		> ~~搞不清楚结果为什么和 `false` 一样，打开 `debug` 选项后会有如下提示`Import of core-js was not found.`~~

		> 更新：需要在代码中手动引入 `import 'core-js'`，结果会加载非常多的`polyfill`。

		```js
		"use strict";

		var foo = {
		name: 'Ming'
		};
		var bar = {
		address: 'Beijing',
		age: '18'
		};
		Object.assign(foo, bar);
		var map = new Map();
		```
	- false: 不引入 `polyfill`

		> `debug` 提示 `Using polyfills: No polyfills were added, since the *useBuiltIns* option was not set.` 

		```js 
		"use strict";

		var foo = {
		name: 'Ming'
		};
		var bar = {
		address: 'Beijing',
		age: '18'
		};
		Object.assign(foo, bar);
		var map = new Map();
		```

- `targets` 选项用来配置配置兼容范围，语法参考 [browserslist](https://github.com/browserslist/browserslist)

- `exclude` 和 `include` 用来排查和强制引入某些`ployfill`，例如下例：

	> 测试中发现设置 `"in P clude": ["es.set"]` 并未生效 

	设置 `"exclude": ["es.object.assign"]`，即使我们代码中用到了`Object.assign`方法，也不会自动引入这个`polyfill`。


### @babel/plugin-transform-runtime

一般情况下不需要，需要配置 `@babel/runtime`（不是**开发依赖**） 一起使用。使用了这个后能复用一些`helpers`代码，能避免污染全局。下面是打开使用这个插件后的转义代码：

我们看到 `Map` 和 `Object.assign` 不在是全局的了
```js 
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/map"));
var _assign = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/assign"));

var foo = {
  name: 'Ming'
};
var bar = {
  address: 'Beijing',
  age: '18'
};
(0, _assign.default)(foo, bar);
var map = new _map.default();
```

### 其它 

- 配合`webpack`的 `splitChunks` 将 `polyfill` 打包到一个文件中

``` js 
optimization: {
	splitChunks: {
		// cacheGroups 指定拆分规则 默认的拆分规则如下 <https://webpack.js.org/plugins/split-chunks-plugin/#optimizationsplitchunks>
		cacheGroups: {
			polyfill: {
				// 一个正则匹配那些代码适用这个规则
				test: /core-js/, 
				// 表示从哪些chunks里面抽取代码，除了三个可选字符串值 initial、async、all 之外，还可以通过函数来过滤所需的 chunks
				chunks: 'all' 
			}
		}
	}
}
```

### 参考

- [@babel/preset-env](https://www.babeljs.cn/docs/babel-preset-env)
- [@babel/polyfill](https://www.babeljs.cn/docs/babel-polyfill)
- [@babel/plugin-transform-runtime](https://www.babeljs.cn/docs/babel-plugin-transform-runtime)
- [SplitChunksPlugin](https://webpack.js.org/plugins/split-chunks-plugin/#splitchunkschunks)