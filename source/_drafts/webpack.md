---
title: webpack
date: 2018-02-05 15:16:45
tags: 
---
## Webpack 
![](/images/QQ20180111-103710@2x.jpg)
### 原理

### 基础配置
#### entry
> entry: {[entryChunkName: string]: string|Array<string>}

单入口
```
const config = {
  entry: './path/to/my/entry/file.js'
};
```

对象形式
```
const config = {
  entry: {
    main: './path/to/my/entry/file.js'
  }
};
```

数组形式
```
const glob = require('glob');

const config = {
  entry: glob.sync('./path/**/index.js')
};
```

#### output
<https://doc.webpack-china.org/configuration/output#output-filename>
单出口。指定具体的文件名
```
const config = {
  output: {
    filename: 'bundle.js',
    path: '/home/proj/public/assets'
  }
};
```

多入口多出口，出口处可以使用占位符
> filename: "[name].bundle.js" 模块名称，单入口的[name]默认为main
> filename: "[id].bundle.js" 模块标识符(module identifier)
> filename: "[name].[hash].bundle.js" 模块标识符(module identifier)的 hash
> filename: "[chunkhash].bundle.js" 基于每个chunk内容的hash
> filename: "[query].bundle.js" 模块的 query，例如，文件名 ? 后面的字符串
```
{
  entry: {
    app: './src/app.js',
    search: './src/search.js'
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist'
  }
}

```

#### externals
```
externals: {
    // https://doc.webpack-china.org/configuration/externals/
    // key module名字，value全局变量名字
    'vue': 'Vue'
}
```

#### [resolver](https://doc.webpack-china.org/configuration/resolve/#resolve-modules)

`resolver`用于帮助找到模块的绝对路径。

```JavaScript
import foo from 'path/to/module'
// 或者
require('path/to/module')
```


```JavaScript
resolve: {
    // 别名 如果模块不在`node_modules`中，可以直接使用下面的形式去引入模块
    // import Templates from 'Templates';
    alias: {
        Templates: path.resolve(__dirname, 'src/templates/')
    },
    aliasFields: ["browser"],
    extensions: ['.js', '.vue', '.css'],
    // 解析目录时要使用的文件名。
    resolve.mainFiles: ["index"],
    // 告诉 webpack 解析模块时应该搜索的目录。
    modules: ["node_modules"]
} 
```

#### [target](https://doc.webpack-china.org/concepts/targets/)

#### loader
##### [file-loader](https://github.com/webpack-contrib/file-loader)
使用`file-loader`我们可以把文件当做一个模块。这里可以将文件名自动替换为摘要，对于需要`CDN`的环境，对于线上需要使用CDN的还可以直接配置`publicPath`来配置。
```
# webpack.conf.js
module: {
    rules: [
        {
            test: /\.(png|jpg|gif)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name]-[hash].[ext]',
                    publicPath: 'http://cdn.example.com/assets/'
                }
            }]
        }
    ]
}

# index.js 
var logo = document.createElement('img');
logo.src = require('../assets/logo.png');
document.body.appendChild(logo);
```
这个例子中最终编译渲染后页面
``` html
<img src="http://cdn.example.com/assets/logo-f404404990004ac9b3a3c6711e81f94b.png">
```

##### [babel-loader](https://doc.webpack-china.org/loaders/babel-loader/)


> Babel默认只转换新的JavaScript句法（syntax），而不转换新的API，比如Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise等全局对象，以及一些定义在全局对象上的方法（比如Object.assign）都不会转码。    
> 最主要的区别就是polyfill引入后，会将新的原生对象、API这些都直接引入到全局环境，直接在代码中插入帮助函数，会导致污染了全局环境，并且不同的代码文件中包含重复的代码，导致编译后的代码体积变大。    
> Babel为了解决这个问题，提供了单独的包babel-runtime用以提供编译模块的工具函数， 启用插件babel-plugin-transform-runtime后，Babel就会使用babel-runtime下的工具函数。这个时候es6代码变成了模块引用,这样可以避免自行引入polyfill时导致的污染全局命名空间的问题。    
> babel-polyfill与babel-runtime相比虽然有各种缺点，但在某些情况下仍然不能被babel-runtime替代， 例如，代码：[1, 2, 3].includes(3)，Object.assign({}, {key: 'value'})，Array，Object以及其他”实例”下es6的方法，babel-runtime是无法支持的， 因为babel-runtime只支持到static的方法。    
> abel-runtime适合在组件，类库项目中使用，而babel-polyfill适合在业务项目中使用。    

##### [css-loader]
css-loader 负责对css文件的转换，例如转换`url()`等。
```
url(../../logo.png) => url(images/logo-f40440.png)
```

> CSS MODULE是一种css in javascript的方式，当我们把一个css文件import到一个js模块时，这个css文件会暴露一个对象，这个对象映射所有的本地和全局css类名

##### [style-loader](https://doc.webpack-china.org/loaders/style-loader/)
style-loader用于将转换后的css插入到html中，通过内敛和link方式。注意，并不是在编译器就将css文件插入到html中的，此时的css还在编译后的js中，这里的插入只是通过js动态插入。如果要想将css从最终的js中抽离出来，需要使用`extract-text-webpack-plugin`插件。



#### [extract-text-webpack-plugin]()

#### plugins

### 常用插件
#### UglifyJsPlugin [内置]

#### HtmlWebpackPlugin



### 参考
- [polyfill与runtime的区别](https://github.com/ToPeas/blog/issues/2)
- [Webpack概念](https://doc.webpack-china.org/concepts/)
- [Webpack Loaders](https://doc.webpack-china.org/loaders)