---
title: 树莓派摄像头挂载
date: 2016-07-15 22:49:05
tags: RaspberryPi
---
### 树莓派摄像头挂载

#### 问题描述
使用raspistill命令能拍照，但是调用opencv打开摄像头方法却失败。找不到/dev/video0设备。

#### 处理办法
`sudo modprobe bcm2835-v4l2 gst_v4l2src_is_broken=1`

要想永久生效，需要修改`/etc/modules-load.d/modules.conf `，在下面追加
`bcm2835-v4l2`

参考：[【1】](http://blog.csdn.net/machh/article/details/51385130) [【2】](http://stackoverflow.com/questions/25941171/how-to-get-gstreamer1-0-working-with-v4l2-raspicam-driver)