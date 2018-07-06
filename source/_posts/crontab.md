---
title: crontab.md
date: 2016-08-17 16:06:42
tags: crontab
---
## crontab

### 基本格式
```
*　　*　　*　　*　　*　　command
分　 时　 日　 月　 周　 命令
```

1. 第1列表示分钟1～59 每分钟用*或者 */1表示
2. 第2列表示小时1～23（0表示0点）
3. 第3列表示日期1～31
4. 第4列表示月份1～12
5. 第5列标识号星期0～6（0表示星期天）

### 例子
crontab文件的一些例子：

```
30 21 * * * /usr/local/etc/rc.d/lighttpd restart
```
上面的例子表示每晚的21:30重启apache。

```
45 4 1,10,22 * * /usr/local/etc/rc.d/lighttpd restart
```
上面的例子表示每月1、10、22日的4 : 45重启apache。

```
10 1 * * 6,0 /usr/local/etc/rc.d/lighttpd restart
```
上面的例子表示每周六、周日的1 : 10重启apache。

```
0,30 18-23 * * * /usr/local/etc/rc.d/lighttpd restart
```
上面的例子表示在每天18 : 00至23 : 00之间每隔30分钟重启apache。

```
0 23 * * 6 /usr/local/etc/rc.d/lighttpd restart
```
上面的例子表示每星期六的11 : 00 pm重启apache。

```
* */1 * * * /usr/local/etc/rc.d/lighttpd restart
```
每一小时重启apache

```
* 23-7/1 * * * /usr/local/etc/rc.d/lighttpd restart
```
晚上11点到早上7点之间，每隔一小时重启apache

```
0 11 4 * mon-wed /usr/local/etc/rc.d/lighttpd restart
```
每月的4号与每周一到周三的11点重启apache

```
10 6 * * *
```
每天早上6点10分

```
0 */2 * * *
```
每两个小时

```
0 23-7/2,8 * * *
```
晚上11点到早上8点之间每两个小时，早上8点

```
0 11 4 * mon-wed
```
每个月的4号和每个礼拜的礼拜一到礼拜三的早上11点

```
0 4 1 jan * 
```
1月份日早上4点

> */n 代表每n/单位执行一下

### 常用命令
1. crontab -e 编辑任务
2. crontab -l 列出所有的任务
3. crontab -r 删除所有的任务


### 服务管理
```
service crond [start|stop|restart|status]
```

### 查看crontab输出日志
- Linux
位于/var/log/cron-* 文件中

- Mac

### 参考
- [Linux crontab定时执行任务](http://www.jb51.net/LINUXjishu/19905.html)
