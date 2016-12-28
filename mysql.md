### chang常用命令

1.	数据库复制

```shell
mysqldump db_1 -uroot -ppassword -h10.0.1.4 --add-drop-table | mysql db_2 -uroot -ppassword -h10.0.1.4
```
