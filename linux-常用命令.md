1. 查看文件夹大小
    ```
    du -h --max-depth=1 ~/
    du -h -d=1 .

    du -sh file_path
    ```

    ```
    --max-depth为深度

    -s, --summarize
        display only a total for each argument

    -h, --human-readable
        print sizes in human readable format (e.g., 1K 234M 2G)

    To check more than one directory and see the total, use du -sch:
    -c, --total
        produce a grand total
    ```
    [Link](https://unix.stackexchange.com/questions/185764/how-do-i-get-the-size-of-a-directory-on-the-command-line)
    
2. 查看磁盘使用情况
    ```
    df -h
    ```

3. 列出文件
    ```
    1. ls -p | grep -v /                                   (without hidden files)
    2. ls -l | grep ^- | tr -s ' ' | cut -d ' ' -f 9       (without hidden files)

    a) ls -pa | grep -v /                                  (with hidden files)
    b) ls -la | grep ^- | tr -s ' ' | cut -d ' ' -f        (with hidden files)
    ```

    List directories only:

    ```
    1. ls -p | grep /                                      (without hidden)
    2. ls -l | grep ^d | tr -s ' ' | cut -d ' ' -f 9       (without hidden)

    a) ls -pa | grep /                                     (with hidden)
    b) ls -l | grep ^d | tr -s ' ' | cut -d ' ' -f 9       (with hidden)
    ```
    grep -v -e ^$ is to remove blank lines from the result.

4. Argument list too long 错误
    ```
    find src -name '*.*' -exec mv {} dest \;
    ```

5. 查看内核及发行版
    ```
    cat /etc/issue
    uname -a
    ```

6. 文件分割
    ```
    split [-bl] file [prefix]  
    -b, --bytes=SIZE：对file进行切分，每个小文件大小为SIZE。可以指定单位b,k,m。
    -l, --lines=NUMBER：对file进行切分，每个文件有NUMBER行。
    prefix：分割后产生的文件名前缀。

    split -l 1000 urls.txt url_
    ```

7. 读取文件N行
    ```
    # 第二行到最后一行
    sed -n '2,$p' file

    # 第二行到第100行
    sed -n '2,100p' file
    ```

8. echo 输出转义字符
    默认`echo`的输出是不转义的。使用`-e`可以实现转义。
    ```
    echo -e "第一行\n第二行"
    ```

9. 查找和删除失效的软链接 
    ```
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

10. 查看文件编码
    ```
    file --mime-encoding [filename]
    ```