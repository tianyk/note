---
title: NPM配置
date: 2017-02-06 15:18:57
tags: 
---
### npm-config

npm 配置管理

```
$ npm config --help
npm config set <key> <value>
npm config get [<key>]
npm config delete <key>
npm config list
npm config edit
npm set <key> <value>
npm get [<key>]

alias: c
```

### npm获取配置有6种方式，优先级由高到底。

1. 命令行参数   
--proxy http://server:port 即将 proxy 的值设为 http://server:port 。

2. 环境变量   
以`npm_config_`为前缀的环境变量将会被认为是 npm 的配置属性。如设置 proxy 可以加入这样的环境变量`npm_config_proxy=http://server:port`。

3. 用户配置文件   
可以通过`npm config get userconfig`查看文件路径。如果是mac系统的话默认路径就是`$HOME/.npmrc`。

4. 全局配置文件    
可以通过`npm config get globalconfig`查看文件路径。mac系统的默认路径是`/usr/local/etc/npmrc`。

5. 内置配置文件    
安装npm的目录下的npmrc文件。

6. 默认配置    
npm本身有默认配置参数，如果以上5条都没设置，则npm会使用默认配置参数。

### 例子
```
npm config set registry https://registry.npm.taobao.org/
npm config set prefix /usr/local
```

### 参考
[【1】](http://www.cnblogs.com/huang0925/archive/2013/05/17/3083207.html) [【2】](http://www.cnblogs.com/breakdown/archive/2012/12/18/2823646.html) [【3】](https://docs.npmjs.com/misc/config)
