### Linux 常用命令

#### 查看文件夹大小
```shell 
du -h --max-depth=1 ~/
du -h -d=1 .

du -sh file_path
```

```shell
--max-depth为深度

-s, --summarize
    display only a total for each argument

-h, --human-readable
    print sizes in human readable format (e.g., 1K 234M 2G)

To check more than one directory and see the total, use du -sch:
-c, --total
    produce a grand total
```

- [How do I get the size of a directory on the command line?](https://unix.stackexchange.com/questions/185764/how-do-i-get-the-size-of-a-directory-on-the-command-line)

#### 查看磁盘使用情况
```shell
df -h
```

#### 列出文件
```shell 
1. ls -p | grep -v /                                   (without hidden files)
2. ls -l | grep ^- | tr -s ' ' | cut -d ' ' -f 9       (without hidden files)

a) ls -pa | grep -v /                                  (with hidden files)
b) ls -la | grep ^- | tr -s ' ' | cut -d ' ' -f        (with hidden files)
```

List directories only:

```shell 
1. ls -p | grep /                                      (without hidden)
2. ls -l | grep ^d | tr -s ' ' | cut -d ' ' -f 9       (without hidden)

a) ls -pa | grep /                                     (with hidden)
b) ls -l | grep ^d | tr -s ' ' | cut -d ' ' -f 9       (with hidden)
```
grep -v -e ^$ is to remove blank lines from the result.

#### Argument list too long 错误
```shell
find src -name '*.*' -exec mv {} dest \;
```

#### 查看内核及发行版
```shell
cat /etc/issue
uname -a
```

#### 文件分割
```shell
split [-bl] file [prefix]  
-b, --bytes=SIZE：对file进行切分，每个小文件大小为SIZE。可以指定单位b,k,m。
-l, --lines=NUMBER：对file进行切分，每个文件有NUMBER行。
prefix：分割后产生的文件名前缀。

split -l 1000 urls.txt url_
```

#### 读取文件N行
```shell
# 第二行到最后一行
sed -n '2,$p' file

# 第二行到第100行
sed -n '2,100p' file
```

#### echo 输出转义字符
默认`echo`的输出是不转义的。使用`-e`可以实现转义。
```shell 
echo -e "第一行\n第二行"
```

#### 查找和删除失效的软链接 
```shell 
查找当前目录
find -L -type l
复制代码
查找指定目录
find -L ur_path -type l
复制代码
删除
find -L ur_path -type l -delete
复制代码
```

#### 查看文件编码
```shell
file --mime-encoding [filename]
```

#### 生成指定大小文件
```shell
truncate -s 50M 50M.file
```

```shell
dd if=/dev/zero of=50M.file bs=1M count=50
```

#### 网卡流量分析
```shell 
sar -n DEV 2 10 每2秒刷新一次，共10次
```

#### 宽口使用查看
[linux 端口](linux-端口.md)

#### 进程检查
```shell
#!/bin/sh
PID=$$ # $BASHPID

if kill -0 $PID 2>/dev/null; then 
    echo "process $PID existence" 
else 
    echo "process $PID nexistence"
fi
```

#### fuser
fuser 1080/tcp
fuser -k 1080/tcp
fkill

#### pidstat