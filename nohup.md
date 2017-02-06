### 简介
nohup 命令可以将程序以忽略挂起信号的方式运行起来，被运行的程序的输出信息将不会显示到终端。  

该命令的一般形式为`nohup command &`。


### 常用命令
```shell
nohup command >/dev/null 2>&1   # doesn't create nohup.out
```

```shell
nohup command >/dev/null 2>&1 & # runs in background, still doesn't create nohup.out
```

```shell
nohup command </dev/null >/dev/null 2>&1 & # completely detached from terminal
```

> 解释：  
前面的 nohup 和后面的 & 我想大家都能明白了把。
主要是中间的 2>&1 的意思  
这个意思是把标准错误（2）重定向到标准输出中（1），而标准输出又导入文件 output 里面，
所以结果是标准错误和标准输出都导入文件 output 里面了。  
至于为什么需要将标准错误重定向到标准输出的原因，那就归结为标准错误没有缓冲区，而stdout有。  
这就会导致 >output 2>output 文件output被两次打开，而stdout和stderr将会竞争覆盖，这肯定不是我门想要的。  
这就是为什么有人会写成：  
nohup ./command.sh >output 2>output出错的原因了  


### 参考
[【1】](http://blog.sina.com.cn/s/blog_6c9eaa1501011zml.html)
