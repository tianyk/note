---
title: ES6 模块系统
author: tyk
date: 2018-06-25 16:09:40
tags: 
---
## ES6 模块系统

在从`ES6`之前JavaScript一直没有模块系统，社区提供了一些解决方案`CommonJS`、`CMD`、`AMD`。现在随着`ES6`的发布JavaScript也开始对模块化提供了支持。

`ES6`模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。这带了的局限就是我们**无法在运行期动态加载模块**。

模块功能主要由两个命令构成：`export`和`import`。`export`命令用于规定模块的对外接口，`import`命令用于输入其他模块提供的功能。

### export 命令

常见的写法：
1. 直接export命令输出变量或者函数

    ``` javascript
    export let name = 'dog';

    export function say() {
        console.log('wangwang~');
    }
    ```

2. 对外输出一组变量或者函数

    ``` javascript
    let name = 'dog';

    function say() {
        console.log('wangwang~');
    }

    export { name, say };
    ```

3. 以别名的方式输出变量和函数

    ``` javascript
    let name = 'dog';

    function say() {
        console.log('wangwang~');
    }

    export { 
        name, 
        say as wang 
    };
    ```

注意事项：

export命令规定的是对外的接口，必须与模块内部的变量建立一一对应关系。下面两种都是错误的示例：
``` javascript
let name = 'dog';
export name;

function say() {
    console.log('wangwang~');
}
export say;
```

### import 命令

`import`命令具有提升效果，会提升到整个模块的头部，首先执行。`import`命令是编译阶段执行的，在代码运行之前。我们无法在运行期间动态`import`模块，这一点使用`Node.js`的同学要注意。

1. 基本用法
    ``` javascript
    import { stat, exists, readFile } from 'fs';
    ```

2. 整体导入
    ``` javascript
    improt * as fs from 'fs';
    // fs.stat
    ```

3. 只导入
    使用`Node.js`的同学可能会用过`require('my_module');`这样的语法来加载模块，执行一些初始化工作，现在用了`import`同样可以。
    > 会有些差别`require`是在运行期，`import`在编译期。

    ``` javascript
    import 'my_module';
    ```
    
### export default

    ``` javascript
    // 第一组
    export default function crc32() { // 输出
    // ...
    }

    import crc32 from 'crc32'; // 输入

    // 第二组
    export function crc32() { // 输出
    // ...
    };

    import {crc32} from 'crc32'; // 输入
    ```