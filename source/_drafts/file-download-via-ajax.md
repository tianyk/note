---
title: 通过Ajax下载文件
author: tyk
date: 2018-05-17 14:02:53
tags:
---

## 通过Ajax下载文件

参考网站<https://send.firefox.com/> [Github](https://github.com/mozilla/send)

``` html 
<button type="button" id="GetFile">Get File!</button>
```

``` javascript 
$('#GetFile').on('click', function () {
    $.ajax({
        url: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/172905/test.pdf',
        method: 'GET',
        xhrFields: {
            responseType: 'blob'
        },
        success: function (data) {
            var a = document.createElement('a');
            var url = window.URL.createObjectURL(data);
            a.href = url;
            a.download = 'myfile.pdf';
            a.click();
            window.URL.revokeObjectURL(url);
        }
    });
});
```

### 参考
- [File Download via AJAX](https://codepen.io/chrisdpratt/pen/RKxJNo)
