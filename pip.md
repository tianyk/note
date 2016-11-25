### 安装
```
curl -s "https://bootstrap.pypa.io/get-pip.py" | python

# 或者下载完执行
python get-pip.py
```

#### 安装配置

`--no-setuptools` 不安装setuptools

`--no-wheel` 不安装wheel

### 升级
Linux or macOS
```
pip install -U pip
```
Win
```
python -m pip install -U pip
```

### 其他
```
把当前环境中所有的包及版本写进requirements.txt
pip freeze > requirements.txt
```

```
把requirements.txt里面的包安装一遍
pip install -r requirements.txt
```

### 参考
[【1】](https://pip.pypa.io/en/stable/installing/)
