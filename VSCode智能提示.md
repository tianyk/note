### 安装Typings
``` shell
npm install -g typings
```

### 安装相关提示信息文件
#### 搜索
``` shell
typings search node
```
![](images/WechatIMG40.jpeg)
#### 安装
> 在提示文件列中`SOURCE`列，有的显示是`dt`有的是`npm`如果是`dt`，安装时应该在名字前加`dt~`。`

``` shell
typings install dt~node --global --save
typings install lodash --save
```

#### 什么时候需要使用 --global 参数
* 如果安装的包使用 script 标记来引用(如 jQuery )(也就是在浏览器中使用)
* 这个包是属于环境的一部分(如 node )时
* 该包没有使用 --global 安装失败时
* 如果报错了说需要加 global 时加--global


### 启用智能提示功能
* 第一种是在需要进行只能提示的文件最上行增加提示信息文件所在目录，格式如下:
```
/// <reference path="./typings/index.d.ts" />
```
> path为相对路径

* 第二种是在项目所在目录(在这里是NodeSnippet文件夹中)增加一个名为jsconfig.json的空文件。
> `jsconfig.json`方式需要重启VSCode


### 参考
[【1】](http://www.cnblogs.com/IPrograming/p/VsCodeTypings.html)
