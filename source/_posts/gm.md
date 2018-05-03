---
title: gm
date: 2017-10-16 17:42:41
tags: gm
---
gm convert myImage.png +dither -depth 8 -colors 50 myImage.png

gm identify -format "file_size:%b,unique_colors:%k,bit_depth:%q" myImage.png

gm convert -strip -interlace Plane -gaussian-blur 0.05 -quality 85% source.jpg result.jpg


<https://stackoverflow.com/questions/4228027/what-options-for-convert-imagemagick-or-graphicsmagick-produce-the-smallest-f>

<http://www.iitshare.com/the-graphicsmagick-installation-and-use.html>

<https://my.oschina.net/pangzhuzhu/blog/317925>

<http://www.cnblogs.com/zhoujingjie/p/4917461.html>

<https://stackoverflow.com/questions/25372402/graphicsmagick-processes-resulting-in-empty-file>

<https://stackoverflow.com/questions/6605006/convert-pdf-to-image-with-high-resolution>

<https://stackoverflow.com/questions/2257322/reducing-the-file-size-of-a-very-large-images-without-changing-the-image-dimens>cd GraphicsMagic