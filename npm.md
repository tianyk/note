### 安装
```
curl -L https://www.npmjs.com/install.sh | sh
```

sudo node bin/npm-cli.js install -g -f

### 常用命令
1. npm init
2. npm i  [--save|--save-dev]
3. npm outdated
4. npm list
5. npm version <update_type> -m "<message>"
```
npm version patch增加一位补丁号（比如 1.1.1 -> 1.1.2）
npm version minor增加一位小版本号（比如 1.1.1 -> 1.2.0）
npm version major增加一位大版本号（比如 1.1.1 -> 2.0.0）。
```


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

The --only={prod[uction]|dev[elopment]} argument will cause either only devDependencies or only non-devDependencies to be installed regardless of the NODE_ENV."
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

npm config set prefix "/usr/local"

### 参考
[【1】](http://blog.csdn.net/ligang2585116/article/details/47703291) [【2】](http://codecloud.net/12932.html) [【3】](http://www.admin10000.com/document/6736.html) [【4】](https://github.com/npm/npm#fancy-install-unix)
