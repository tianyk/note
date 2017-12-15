### 安装
```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

### 搜索与安装
1. 搜索
    ```
    brew search vi
    brew search /正则表达式/ # 标准格式
    brew search /^vi/   #规定了只能是vi开头
    brew search /^vi\\w$/   #规定只能是vi开头并且只有三个字母
    ```

2. 安装
    ```
    brew install vim 
    brew install username/repo/vim
    ```

### 卸载与更新
1. 卸载
    ```
    # 卸载对应包名字
    brew uninstall <package_name>

    # 列出过时的包
    brew outdated
    ```

2. 更新
    ```
    # 更新过时的包，不带包名就跟新所有包
    brew upgrade [package_name]

    # 跟新HomeBrew自身
    brew update

    # 清除缓存
    brew cleanup [package_name]

    # 列出已经安装的包
    brew list
    ```

### 扩展
`brew`和包含的包源都是通过`github`来管理，人为的维护管理，除了自己的源还允许别人的源添加进来。很多时候有些软件包并不在官方提供列表里面而是由第三方提供的这个时候，我们就需要使用下面的命令

```
brew [un]tap <github_userid/repo_name> #添加或者删除仓库
```

### 服务管理
<https://github.com/Homebrew/homebrew-services>
```
brew services [start|stop|restart] [package_name]

brew services list

brew services cleanup
```

### 修复
```
brew doctor
```

### 常见问题
1. In macOS 10.12 Sierra, /usr/local is readonly
    [升级macOS Sierra后修复brew可能存在的问题](https://maomihz.com/2016/09/upgrade-sierra-homebrew/) [In macOS 10.12 Sierra, /usr/local is readonly.](https://github.com/Homebrew/brew/issues/385)
    ```
    sudo chown -R $(whoami) /usr/local
    ```

### 参考
- [Homebrew总结](http://www.jianshu.com/p/8ad7056b243f)
- [Homebrew 隐藏命令](http://icyleaf.com/2014/01/homebrew-hidden-commands/)