### undefined

#### 判断对象是不是`undefined`

``` javascript
var x;

// 方法一
console.log(typeof x === 'undefined');

// 方法二
console.log(x === undefined);
```
不要使用`==`比较，因为`null == undefined`为true。

#### undefined & null
很多时候`undefined`和`null`差别不大，但是二者的含义完全不同。

undefined代表未定义，而null代表值为空。
``` javascript
typeof undefined;    // 'undefined'
typeof null;         // 'object'
```
可以看到null的类型是'object'，它表示的意思是一个为空的值。

### 参考
[【1】](http://www.ruanyifeng.com/blog/2014/03/undefined-vs-null.html)
