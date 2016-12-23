### web通信之跨文档通信实例页面

#### index.html
```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <title>parent</title>
        <meta charset="UTF-8">
    </head>
    <body>
        <iframe src="left.html"></iframe>
        <iframe src="right.html"></iframe>
    </body>
</html>
```

#### left.html
```html
<!DOCTYPE html>
<html lang="zh">
    <head>
        <title>left</title>
        <meta charset="UTF-8">
    </head>
    <body>
        <form>
            <input type="text" name="" value="">
            <button type="submit">确认</button>
        </form>
    </body>
    <script>
        var eleForm = document.querySelector("form");
        eleForm.onsubmit = function() {
            var message = document.querySelector("input[type='text']").value;
            // 这里是关键，发送信息
            window.parent.frames[1].postMessage(message, "*");
            return false;    
        }
    </script>
</html>
```

#### right.html
```html
<!DOCTYPE html>
<html lang="zh">
    <head>
        <title>right</title>
        <meta charset="UTF-8">
    </head>
    <body>
        <div id="message"></div>
    </body>
    <script>
        var eleBox = document.querySelector("#message");
        var messageHandle = function(e) {
            eleBox.innerHTML = "接受到的信息是：" + e.data;
        };
        if (window.addEventListener) {
            // 接受信息
            window.addEventListener("message", messageHandle, false);
        } else if (window.attachEvent) {
            // 接受信息，兼顾IE8之流
            window.attachEvent("onmessage", messageHandle);
        }
    </script>
</html>
```

### 参考
[【1】](http://www.zhangxinxu.com/wordpress/2012/02/html5-web-messaging-cross-document-messaging-channel-messaging/)
