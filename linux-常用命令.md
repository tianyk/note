1. 查看文件夹大小
```
du -h --max-depth=1 ~/
du -h -d=1 .
```
--max-depth为深度

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

4.
