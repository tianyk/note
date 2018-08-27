---
title: LRC播放器
author: tyk
date: 2018-06-28 13:24:16
tags:
---
## LRC播放器

{% jsfiddle ac35otdk result,html,js,css %}

{% include_code lrc_player.js %}

### TODO 
- 使用RAF模拟setInterval
- 封装为对象，支持play、pause、resume、seek、reset等功能

    ``` javascript 
    class LRCPlayer {
        constructor({ lyrics, seek = '00:00:00', print = (lyric) => console.log(lyric), interval = 50 }) {
            // TODO
        }
        
        // 播放（支持seek）
        play(seek = '00:00:00') {
            // TODO
        }

        // 暂停
        pause() {
            // TODO
        }

        // 继续播放
        resume() {

        }
        
        // 重新开始
        reset() {
            // TODO
        }
    }
    ```

### 参考
- [RAF replacements for setTimeout and setInterval](https://bl.ocks.org/joyrexus/7304146)
- [requestAnimationFrame](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame)
- [Better Performance With requestAnimationFrame](https://dev.opera.com/articles/better-performance-with-requestanimationframe/)
- [How do browsers pause/change Javascript when tab or window is not active?](https://stackoverflow.com/a/16033979/4942848)
- [Using requestAnimationFrame](https://css-tricks.com/using-requestanimationframe/)