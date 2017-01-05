```shell
nohup command >/dev/null 2>&1   # doesn't create nohup.out
```

```shell
nohup command >/dev/null 2>&1 & # runs in background, still doesn't create nohup.out
```

```shell
nohup command </dev/null >/dev/null 2>&1 & # completely detached from terminal
```
