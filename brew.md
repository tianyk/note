### 安装

```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

### 常用命令
1. brew install ..

### 问题
#### In macOS 10.12 Sierra, /usr/local is readonly
[✨](https://maomihz.com/2016/09/upgrade-sierra-homebrew/) [🚀](https://github.com/Homebrew/brew/issues/385)
```
sudo chown -R $(whoami) /usr/local
```
