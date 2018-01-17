1. 下载gcc最新的源码包 `wget http://gcc.skazkaforyou.com/releases/gcc-4.9.4/gcc-4.9.4.tar.gz`    

2. 解压缩 `tar -zxvf gcc-4.9.4.tar.gz`    

3. cd gcc-4.9.4    

4. 运行`download_prerequisites`脚本`./contrib/download_prerequisites` 。这个脚本会自动帮你下载所需要的依赖文件和库  

5. 建立输出目录，将所有的中间文件都放到该目录    
    ```
    mkdir gcc_temp
    cd gcc_temp
    ```

6. 运行 `../configure --enable-checking=release --enable-languages=c,c++ --disable-multilib`    

7. make & make install    