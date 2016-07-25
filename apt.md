### 常用命令
* apt-get
```
參數：
-q ：不要在螢幕上輸出訊息，常用在背景環境的執行當中喔！
-y ：自動在進行 apt-get 時回答 y 的回應；
-c ：後面接的是設定檔，一般系統會主動的以 /etc/apt 內的設定檔為依據。
[更新項目]：要 apt-get 進行的工作，主要有這幾項：
   update      ：就是更新伺服器與用戶端的套件表頭清單，這個動作務必要進行！
   install     ：後面需要加上要安裝的套件名稱才行！
   upgrade     ：進行『已安裝套件』的完整升級，不過未安裝套件則不予安裝；
   dist-upgrade：以 upgrade 相似，但是當新版本的套件有其他相依屬性的套件加入時，
                 單純的 upgrade 將無法進行安裝，此時就得要使用 dist-upgrade 了！
   clean       ：清除已經下載到 /var/cache/apt/archives/ 的套件檔案。
   remove      ：移除某個套件啊！
```

*那個 update 的參數並不是在進行更新， 而是在進行伺服器與用戶端的套件表頭清單更新而已， 但這個動作相當重要，如果你沒有作這個動作的話，你的套件就不會更新了！ 在 apt-get update 後，再使用 apt-get dist-upgrade 這樣就能夠將整個系統給他升級了！*

* apt-cache
```
參數：
[搜尋項目]：apt-cache 可以搜尋 apt 所列出的套件標頭資料喔！可用項目有：
pkgnames：列出本系統上面的所有套件名稱！！有點類似 (rpm -qa)；
dump    ：列出所有的套件標頭以及其相關的相依屬性套件！
search  ：後面可接要搜尋的字串，例如 apt-cache search postfix
show    ：後面接套件名稱，可以顯示出該套件的主要內容的描述！
showpkg ：列出後面所接套件的相依屬性以該其套件提供的相關功能！
depends ：可以列出與後面所接套件有相依屬性或者是衝突的相關資料！
```

### 源配置
文件/etc/apt/sources.list是一个普通可编辑的文本文件，保存了ubuntu软件更新的源服务器的地址。和sources.list功能一样的是/etc/apt/sources.list.d/*.list(*代表一个文件名，只能由字母、数字、下划线、英文句号组成)。sources.list.d目录下的*.list文件为在单独文件中写入源的地址提供了一种方式，通常用来安装第三方的软件。  

每一行的开头是deb或者deb-src，分别表示直接通过.deb文件进行安装和通过源文件的方式进行安装。  
deb或者deb-src字段之后，是一段URL，之后是五个用空格隔开的字符串，分别对应相应的目录结构。在浏览器中输入 http://archive.ubuntu.com/ubuntu/ ，并进入dists目录，可以发现有5个目录和前述sources.list文件中的第三列字段相对应。任选其中一个目录进入，可以看到和sources.list后四列相对应的目录结构。


树莓派apt源

```
deb http://mirrors.tuna.tsinghua.edu.cn/raspbian/raspbian/ jessie main contrib non-free rpi
deb http://mirrors.neusoft.edu.cn/raspbian/raspbian jessie main contrib non-free rpi
deb http://mirrors.ustc.edu.cn/raspbian/raspbian/ jessie main contrib non-free rpi
deb http://mirrors.zju.edu.cn/raspbian/raspbian/ jessie main contrib non-free rpi
deb http://mirrors.cqu.edu.cn/Raspbian/raspbian/ jessie main contrib non-free rpi
```

### 国内的apt源
1. [阿里](http://mirrors.aliyun.com/)


### 参考
[【1】](http://linux.vbird.org/linux_server/0210network-secure/0220upgrade.php#apt_config)[【2】](http://www.tuicool.com/articles/EjMJNz/)[【3】](http://outofmemory.cn/code-snippet/35699/raspberry-pi-apt-get-source-list)[【4】](http://shumeipai.nxez.com/2013/08/31/raspbian-chinese-software-source.html)[【5】](https://www.raspbian.org/RaspbianMirrors)
