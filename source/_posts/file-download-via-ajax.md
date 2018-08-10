---
title: 通过Ajax下载文件
author: tyk
date: 2018-05-17 14:02:53
updated: 2018-08-10 14:40:40
tags: 
- download
- ajax
---
## 通过Ajax下载文件

参考网站<https://send.firefox.com/> [Github](https://github.com/mozilla/send)

``` html 
<button type="button" id="GetFile">Get File!</button>
```

``` javascript 
$('#GetFile').on('click', function () {
    $.ajax({
        url: 'https://kekek.cc/static/P60524-122812.jpg',
        xhr: function () {
            var xhr = $.ajaxSettings.xhr();
            xhr.onprogress = function (e) {
                // For downloads
                if (e.lengthComputable) {
                    console.log(e.loaded / e.total);
                }
            };
            xhr.upload.onprogress = function (e) {
                // For uploads
                if (e.lengthComputable) {
                    console.log(e.loaded / e.total);
                }
            };
            return xhr;
        },
        method: 'GET',
        xhrFields: {
            responseType: 'blob'
        },
        success: function (data) {
            var a = document.createElement('a');
            var url = window.URL.createObjectURL(data);
            a.href = url;
            a.download = 'P60524.jpg';
            a.click();
            window.URL.revokeObjectURL(url);
        }
    });
});
```

{% iframe https://kekek.cc/static/file-download-via-ajax.html 100% 80px %}

### 参考
- [File Download via AJAX](https://codepen.io/chrisdpratt/pen/RKxJNo)
- [Get progress of an AJAX request](https://coderwall.com/p/je3uww/get-progress-of-an-ajax-request)
- [Mozilla/send](https://github.com/mozilla/send/blob/master/app/api.js#L140)

