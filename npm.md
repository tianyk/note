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


### 参考
[【1】](1http://blog.csdn.net/ligang2585116/article/details/47703291) [【2】](http://codecloud.net/12932.html)
