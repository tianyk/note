---
title: fish-shell
date: 2016-11-16 11:05:57
tags: 
- fish
- shell
---
### 安装
```shell
brew install fish

curl -L http://get.oh-my.fish | fish
```

### 切换脚本
```shell
chsh -s /usr/local/bin/fish
# sudo -u [user] chsh -s /usr/local/bin/fish
```
> 如果不生效，重新打开Terminal

### 安装主题
```shell
omf install [<name>|<url>]
```

[主题列表](https://github.com/oh-my-fish/oh-my-fish/blob/master/docs/Themes.md)

### 配置文件
```
vim ~/.config/fish/config.fish
```

### 注意事项


### 参考
[【1】](https://github.com/oh-my-fish/oh-my-fish) [【2】](http://doabit.com/posts/3-from-oh-my-zsh-to-oh-my-fish)[【3】](http://www.jianshu.com/p/7ffd9d1af788) [【4】](https://github.com/oh-my-fish/oh-my-fish/blob/master/docs/zh-CN/FAQ.md)
