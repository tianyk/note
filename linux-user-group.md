## Linux 用户和用户组
我们要进入`Linux`系统首先要输入我们的用户名，其实`Linux`并不认识这个用户名，它只认识这个用户名对应的ID - `UID`。用户名是给我们人类看的，`UID`才是给机器用的。除了用户名，我们还要输入密码。这样就能进入`Linux`系统了。

Linux下的用户和用户密码是以文本形式存分别存在`/etc/passwd`和`/etc/shadow`中。`/etc/passwd`里面存的数据是一个七元组，以`:`分割。
> 用户名:密码:UID:GID:用户说明:用户目录:用户Shell
``` shell
$ head /etc/passwd
root:x:0:0:root:/root:/bin/bash
bin:x:1:1:bin:/bin:/sbin/nologin
daemon:x:2:2:daemon:/sbin:/sbin/nologin
adm:x:3:4:adm:/var/adm:/sbin/nologin
lp:x:4:7:lp:/var/spool/lpd:/sbin/nologin
sync:x:5:0:sync:/sbin:/bin/sync
shutdown:x:6:0:shutdown:/sbin:/sbin/shutdown
halt:x:7:0:halt:/sbin:/sbin/halt
mail:x:8:12:mail:/var/spool/mail:/sbin/nologin
uucp:x:10:14:uucp:/var/spool/uucp:/sbin/nologin
```
其中第二列密码列全部都是`x`，这是遗留问题。现在用户密码已经不在存在`/etc/passwd`文件中了，而是在`/etc/shadow`里面。最后一个`用户shell`是用户登陆后使用的shell，如果我们不想让这个用户登陆可以指定其shell为`/sbin/nologin`。

Linux中每一个用户都会至少属于一个用户组，这个用户组可以用来标识一批用户的关系。在文件权限管理中，我们可以设置组权限来实现同一个组下面的用户对文件的读写操作。同样，用户组的名字是给我们人类看的，用户组有一个ID - `GID`。用户组信息存放在`/etc/group`文件中，另外还有一个很少用的用户组密码，它存放在`/etc/gshadow`文件中。`/etc/group`存放的数据是一个四元组。
> 群组名:群组密码:GID:群组下的用户
```
$ head /etc/group
root:x:0:
bin:x:1:bin,daemon
daemon:x:2:bin,daemon
sys:x:3:bin,adm
adm:x:4:adm,daemon
tty:x:5:
disk:x:6:
lp:x:7:daemon
mem:x:8:
kmem:x:9:
```
这里的组密码同样是`x`，它存放在`/etc/gshadow`中。


### 用户组
#### 常用命令  
- groupadd [-g] gid [-r] groupname    
    \-g  後面接某個特定的 GID ，用來直接給予某個 GID 
    \-r  建立系統群組啦！與 /etc/login.defs 內的 GID_MIN 有關。   

- groupmod [-g gid] [-n group_name] 群組名
    \-g  修改既有的 GID 數字
    \-n  修改既有的群組名稱

- groupdel [groupname]

### 用户

- useradd [-u UID] [-g 初始群組] [-G 次要群組] [-mM]\
    >  [-c 說明欄] [-d 家目錄絕對路徑] [-s shell] 使用者帳號名
    ```
    \-u  ：後面接的是 UID ，是一組數字。直接指定一個特定的 UID 給這個帳號；
    \-g  ：後面接的那個群組名稱就是我們上面提到的 initial group 啦～
        該群組的 GID 會被放置到 /etc/passwd 的第四個欄位內。
    \-G  ：後面接的群組名稱則是這個帳號還可以加入的群組。
        這個選項與參數會修改 /etc/group 內的相關資料喔！
    \-M  ：強制！不要建立使用者家目錄！(系統帳號預設值)
    \-m  ：強制！要建立使用者家目錄！(一般帳號預設值)
    \-c  ：這個就是 /etc/passwd 的第五欄的說明內容啦～可以隨便我們設定的啦～
    \-d  ：指定某個目錄成為家目錄，而不要使用預設值。務必使用絕對路徑！
    \-r  ：建立一個系統的帳號，這個帳號的 UID 會有限制 (參考 /etc/login.defs)
    \-s  ：後面接一個 shell ，若沒有指定則預設是 /bin/bash 的啦～
    \-e  ：後面接一個日期，格式為『YYYY-MM-DD』此項目可寫入 shadow 第八欄位，
        亦即帳號失效日的設定項目囉；
    \-f  ：後面接 shadow 的第七欄位項目，指定密碼是否會失效。0為立刻失效，
        -1 為永遠不失效(密碼只會過期而強制於登入時重新設定而已。
    ```

- usermod [-cdegGlsuLU] username 
    ```      
    \-c  後面接帳號的說明，即 /etc/passwd 第五欄的說明欄，可以加入一些帳號的說明。
    \-d  後面接帳號的家目錄，即修改 /etc/passwd 的第六欄；
    \-e  後面接日期，格式是 YYYY-MM-DD 也就是在 /etc/shadow 內的第八個欄位資料啦！
    \-f  後面接天數，為 shadow 的第七欄位。
    \-g  後面接初始群組，修改 /etc/passwd 的第四個欄位，亦即是 GID 的欄位！
    \-G  後面接次要群組，修改這個使用者能夠支援的群組，修改的是 /etc/group 囉～
    \-a  與 -G 合用，可『增加次要群組的支援』而非『設定』喔！
    \-l  後面接帳號名稱。亦即是修改帳號名稱， /etc/passwd 的第一欄！
    \-s  後面接 Shell 的實際檔案，例如 /bin/bash 或 /bin/csh 等等。
    \-u  後面接 UID 數字啦！即 /etc/passwd 第三欄的資料；
    \-L  暫時將使用者的密碼凍結，讓他無法登入。其實僅改 /etc/shadow 的密碼欄。
    \-U  將 /etc/shadow 密碼欄的 ! 拿掉，解凍啦
    ```

- userdel [-r] username
    ```
    -r  ：連同使用者的家目錄也一起刪除
    ```

- passwd [-l] [-u] [--stdin] [-S] \
    >  [-n 日數] [-x 日數] [-w 日數] [-i 日數] 帳號 <==root 功能
    ```
    \--stdin ：可以透過來自前一個管線的資料，作為密碼輸入，對 shell script 有幫助！
    \-l  ：是 Lock 的意思，會將 /etc/shadow 第二欄最前面加上 ! 使密碼失效；
    \-u  ：與 -l 相對，是 Unlock 的意思！
    \-S  ：列出密碼相關參數，亦即 shadow 檔案內的大部分資訊。
    \-n  ：後面接天數，shadow 的第 4 欄位，多久不可修改密碼天數
    \-x  ：後面接天數，shadow 的第 5 欄位，多久內必須要更動密碼
    \-w  ：後面接天數，shadow 的第 6 欄位，密碼過期前的警告天數
    \-i  ：後面接天數，shadow 的第 7 欄位，密碼失效天數
    ```

- chage [-ldEImMW] 帳號名
    > 与 `passwd -S` 功能类似
    ```
    \-l ：列出該帳號的詳細密碼參數；
    \-d ：後面接日期，修改 shadow 第三欄位(最近一次更改密碼的日期)，格式 YYYY-MM-DD
    \-E ：後面接日期，修改 shadow 第八欄位(帳號失效日)，格式 YYYY-MM-DD
    \-I ：後面接天數，修改 shadow 第七欄位(密碼失效日期)
    \-m ：後面接天數，修改 shadow 第四欄位(密碼最短保留天數)
    \-M ：後面接天數，修改 shadow 第五欄位(密碼多久需要進行變更)
    \-W ：後面接天數，修改 shadow 第六欄位(密碼過期前警告日期)
    ```
- groups     
    显示用户的有效群组

- newgrp    
    切换有效群组 （可以使用 usermod -G 为用户添加有效群组）

- id [username]
    查询用户的UID、GID

- chsh [-ls]
    ```
    -l  ：列出目前系統上面可用的 shell ，其實就是 /etc/shells 的內容！
    -s  ：設定修改自己的 Shell 囉
    ```
### 文件权限

- chgrp [groupname] 文件    
    修改文件所属组
- chown    
    修改文件所有者和组
- chmod    
    修改文件权限

### 应用
可以将一个用户设置同一个用户组，在文件组权限设置组可读。同组内的用户就可以共享文件。
> 注意：对于文件夹要想读取必须要有执行权限。

## 参考
- [Linux 帳號管理與 ACL 權限設定](http://linux.vbird.org/linux_basic/0410accountmanager.php)  
- [Linux 下以其他用户身份运行程序—— su、sudo、runuser](http://www.cnblogs.com/bodhitree/p/6018369.html) 

