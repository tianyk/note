---
title: safari-audio-autoplay
author: tyk
date: 2020-07-28 16:19:58
tags:
---


```js
// 解决iOS禁止自动播放音频
// 微信自动播放音频
const bgAudio = document.getElementById('bg-audio')
bgAudio.play();

document.addEventListener('WeixinJSBridgeReady',function () {
    bgAudio.play();
}, false);

document.addEventListener('touchstart', function () {
    bgAudio.play()
});
```

```html
<iframe src="audio.html" allow="autoplay"/>
```