编译zookeeper 
```
./configure
make
make install 
```

[zklua](https://github.com/forhappy/zklua.git)

如果lua是openresy自带的，需要`export =/usr/loacal/openresty/luajit/`。下载后编译`make`，编译出错可以尝试使用<https://github.com/forhappy/zklua>。


ldd zklua.so 查看引用有没有缺失的
```
$ ldd zklua.so
	linux-vdso.so.1 =>  (0x00007ffcecf7a000)
	librt.so.1 => /lib64/librt.so.1 (0x00007fb2597ff000)
	libm.so.6 => /lib64/libm.so.6 (0x00007fb25957b000)
	libdl.so.2 => /lib64/libdl.so.2 (0x00007fb259376000)
	libpthread.so.0 => /lib64/libpthread.so.0 (0x00007fb259159000)
	libzookeeper_mt.so.2 => /lib64/libzookeeper_mt.so.2 (0x00007fb258f3f000)
	libc.so.6 => /lib64/libc.so.6 (0x00007fb258baa000)
	/lib64/ld-linux-x86-64.so.2 (0x00007fb259c17000)
```
如果`libzookeeper_mt.so.2`缺失，将`/usr/local/lib/libzookeeper_mt.so.2`链接到`/lib64/libzookeeper_mt.so.2`
```
ln -s /usr/local/lib/libzookeeper_mt.so.2 /lib64/libzookeeper_mt.so.2
```


<http://san-yun.iteye.com/blog/1973552>