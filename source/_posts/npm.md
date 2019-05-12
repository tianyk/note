---
title: NPM
date: 2016-08-03 13:51:30
updated: 2018-07-09 16:07:47
tags: npm
---

## NPM 

### 安装
```
curl -L https://www.npmjs.com/install.sh | sh
```

sudo node bin/npm-cli.js install -g -f

### 配置
npm 获取配置有6种方式，优先级由高到底。
- 命令行参数。 --proxy http://server:port即将proxy的值设为http://server:port。
- 环境变量。 以npm_config_为前缀的环境变量将会被认为是npm的配置属性。如设置proxy可以加入这样的环境变量npm_config_proxy=http://server:port。
- 用户配置文件。可以通过npm config get userconfig查看文件路径。如果是mac系统的话默认路径就是$HOME/.npmrc。
- 全局配置文件。可以通过npm config get globalconfig查看文件路径。mac系统的默认路径是/usr/local/etc/npmrc。
- 内置配置文件。安装npm的目录下的npmrc文件。
- 默认配置。 npm本身有默认配置参数，如果以上5条都没设置，则npm会使用默认配置参数。

npm 配置命令操作
```
npm config set <key> <value> [--global]
npm config get <key>
npm config delete <key>
npm config list
npm config edit
npm get <key>
npm set <key> <value> [--global]
```

```
With the --production flag (or when the NODE_ENV environment variable is set to production), npm will not install modules listed in devDependencies."

The --only={prod[uction]|dev[development]} argument will cause either only devDependencies or only non-devDependencies to be installed regardless of the NODE_ENV."
```

npm 常用配置
```
配置代理
npm config set proxy http://server:port
npm config set https-proxy http://server:port
```

```
配置私有仓库
npm config set registry "https://registry.npm.taobao.org"
```

```
npm config set prefix "/usr/local"
```

### 版本的格式

NPM中的包版本采用[semver](https://semver.org/lang/zh-CN/)规范。

major.minor.patch

主版本号.次版本号.修补版本号

- version

    必须匹配某个版本。

    如：1.1.2，表示必须依赖1.1.2版

- \>version

    必须大于某个版本。

    如：>1.1.2，表示必须大于1.1.2版

- \>=version

    可大于或等于某个版本。

    如：>=1.1.2，表示可以等于1.1.2，也可以大于1.1.2版本

- <version

    必须小于某个版本。

    如：<1.1.2，表示必须小于1.1.2版本

- <=version

    可以小于或等于某个版本

    如：<=1.1.2，表示可以等于1.1.2，也可以小于1.1.2版本

- ~version

    大概匹配某个版本

    如果minor版本号指定了，那么minor版本号不变，而patch版本号任意

    如果minor和patch版本号未指定，那么minor和patch版本号任意

    如：~1.1.2，表示>=1.1.2 <1.2.0，可以是1.1.2，1.1.3，1.1.4，.....，1.1.n 

    如：~1.1，表示>=1.1.0 <1.2.0，可以是同上

    如：~1，表示>=1.0.0 <2.0.0，可以是1.0.0，1.0.1，1.0.2，.....，1.0.n，1.1.n，1.2.n，.....，1.n.n

- ^version

    兼容某个版本

    版本号中最左边的非0数字的右侧可以任意

    如果缺少某个版本号，则这个版本号的位置可以任意

    如：^1.1.2 ，表示>=1.1.2 <2.0.0，可以是1.1.2，1.1.3，.....，1.1.n，1.2.n，.....，1.n.n

    如：^0.2.3 ，表示>=0.2.3 <0.3.0，可以是0.2.3，0.2.4，.....，0.2.n

    如：^0.0，表示 >=0.0.0 <0.1.0，可以是0.0.0，0.0.1，.....，0.0.n

- x-range

    x的位置表示任意版本

    如：1.2.x，表示可以1.2.0，1.2.1，.....，1.2.n

- *-range

    任意版本，""也表示任意版本

    如：*，表示>=0.0.0的任意版本

- version1 - version2

    大于等于version1，小于等于version2

    如：1.1.2 - 1.3.1，表示包括1.1.2和1.3.1以及他们件的任意版本

- range1 || range2

    满足range1或者满足range2，可以多个范围

    如：<1.0.0 || >=2.3.1 <2.4.5 || >=2.5.2 <3.0.0，表示满足这3个范围的版本都可以

### 常用命令
1. npm init   

    初始化项目
    
2. npm i <packageName> [--save|--save-dev]

    安装一个模块 
    ```
    npm i express --save
    npm i express@3 --save 
    npm i gulp --save-dev
    ```
    - --save：安装模块，并将版本写到`dependencies`中。
    - --save-dev：安装模块，并将版本写到`devDependencies`中。
    - --force：同`-f`，强制重新安装。

3. npm update

    更新已安装模块。

4. npm cache

    NPM从`registry`下载压缩包之后，都存放在本地的缓存目录。
    ```
    $ npm cache -h
    npm cache add <tarball file>
    npm cache add <folder>
    npm cache add <tarball url>
    npm cache add <git url>
    npm cache add <name>@<version>
    npm cache clean
    npm cache verify
    ```

3. npm outdated

    ```
    $ npm outdated
    Package  Current  Wanted  Latest  Location
    debug      2.6.9   2.6.9   3.1.0  requestbin
    ejs        2.5.9   2.5.9   2.6.1  requestbin
    ```
    
4. npm list

    列出来模块依赖树

5. npm version 

    ```
    npm version patch 增加一位补丁号（比如 1.1.1 -> 1.1.2）
    npm version minor 增加一位小版本号（比如 1.1.1 -> 1.2.0）
    npm version major 增加一位大版本号（比如 1.1.1 -> 2.0.0）。
    ```


### package-lock.json
`NPM5`开始引入了`package-lock.json`，`package-lock.json`能保证各个开发者安装模块时模板的版本都是相同的。`package-lock.json`的规则期间有些变化，现在最终规则是**只有当 package.json 有改变并且和 lock 里的规则不兼容，才会修改 package-lock.json**。


### 钩子
1. prepublish：发布一个模块前执行。
2. publish, postpublish：发布一个模块后执行。
3. preinstall：安装一个模块前执行。
4. install, postinstall：安装一个模块后执行。
5. preuninstall, uninstall：卸载一个模块前执行。
6. postuninstall：卸载一个模块后执行。
7. preversion, version：更改模块版本前执行。
8. postversion：更改模块版本后执行。
9. pretest, test, posttest：运行npm test命令时执行。
10. prestop, stop, poststop：运行npm stop命令时执行。

### 参数
- unsafe-perm

    Default: false if running as root, true otherwise
    Type: Boolean
    Set to true to suppress the UID/GID switching when running package scripts. If set explicitly to false, then installing as a non-root user will fail.


### 参考
[【1】](http://blog.csdn.net/ligang2585116/article/details/47703291) [【2】](http://codecloud.net/12932.html) [【3】](http://www.admin10000.com/document/6736.html) [【4】](https://github.com/npm/npm#fancy-install-unix)
