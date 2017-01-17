### httpstat - HTTP 响应的可视化命令行工具

![](images/QQ20170117-0@2x.jpg)

### 安装
```
sudo pip install httpstat
```

### 使用
```
httpstat http://www.baidu.com
```

整個網路連線所耗費的時間分為四段：

DNS Lookup：DNS 名稱解析所耗費的時間。   
TCP Connection：實際與網頁伺服器建立 TCP 連線所耗費的時間。   
Server Processing：網頁伺服器在處理網頁請求所耗費的時間。   
Content Transfer：傳送網頁內容至瀏覽器所耗費的時間。   
從這個報表我們就可以大約看出網站目前的運行情況是否正常。   

### 参考
[【1】](https://gold.xitu.io/entry/57c7a11d0e3dd9006a28a7ca) [【2】](https://blog.gtwang.org/linux/httpstat-curl-statistics-tool-to-check-website-performance/) [【3】](https://linux.cn/article-8039-1.html)
