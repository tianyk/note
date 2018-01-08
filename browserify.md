## Browserify
`Browserify`可以编译`node`模块让其在浏览器中使用。

### Node.js内置模块的转换
理想情况下，大部分不涉及io操作的模块可以在浏览器中直接运行。

对于nodejs内置模块，在require()它们的时候，会被转换成如下模块来打包，以适配浏览器环境。

- assert
- buffer
- console
- constants
- crypto
- domain
- events
- http
- https
- os
- path
- punycode
- querystring
- stream
- string_decoder
- timers
- tty
- url
- util
- vm
- zlib

另外, 如果是用到了如下5个全局变量，它们会在打包过程中被改写成可以适配浏览器环境的。

- process
- Buffer
- global 全局变量window
- __filename - 文件名
- __dirname - 文件路径


1. 编译代码
```
browserify ./math.js -o bundle.js
```

2. 编译成require的形式
> var math = require('./math.js');
```
browserify -r ./math.js -o bundle.js
```

3. 编译成模块的形式
> 浏览器里面直接访问math，node环境里面可以require
```
browserify ./math.js -s math bundle.js
```

### 参考
- <http://zhaoda.net/2015/10/16/browserify-guide/>
- <https://www.ibm.com/developerworks/cn/web/1501_chengfu_browserify/>