### 页面自动刷新

1.页面自动刷新：把如下代码加入<head>区域中

```html
<meta http-equiv="refresh" content="20">
```

其中20指每隔20秒刷新一次页面.

2.页面自动跳转： 把如下代码加入<head>区域中

```html
<meta http-equiv="refresh" content="20; URL=http://www.baidu.com">
```

其中20指隔20秒后跳转到`http://www.baidu.com`页面

3.页面自动刷新js版

```JavaScript
function refresh() {
    window.location.reload();
}

setTimeout(refresh, 1000);
```

// 指定1秒刷新一次</script>

### 参考

[【1】](http://www.cnblogs.com/lhws/archive/2012/03/05/2380249.html)
