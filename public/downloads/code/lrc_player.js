function toSecond(time) {
    return new Date(`1970-01-01T${time}Z`).getTime() / 1000;
}

/**
 * 播放歌词
 * 
 * @param  { 
 *              lyrics, 歌词，格式为二维数组。e.g. [ ['00:00:00.40', '周杰伦 - 等你下课 (with 杨瑞代)'], ['00:00:03.94', '词：周杰伦'], ['00:00:05.21', '曲：周杰伦'] ]
 *              seek  = '00:00:00', 开始时间
 *              print = (lyric) => console.log(lyric), 歌词回调
 *              interval = 50 刷新检测间隔 ms
 *          }
 * @returns
 */
function play({ lyrics, seek = '00:00:00', print = (lyric) => console.log(lyric), interval = 50 }) {
    seek = toSecond(seek);
    lyrics = lyrics.map(lyric => [toSecond(lyric[0]), lyric[1]]).sort((lyric1, lyric2) => lyric1[0] - lyric2[0]).filter(lyric => lyric[0] >= seek);

    // setInterval和setTimeout在浏览器窗口非激活的状态下会停止工作或者以极慢的速度工作
    // 可以使用 Web Worker 解决或者 requestAnimationFrame 解决[更新：经过测试窗口处于非激活状态下 requestAnimationFrame 也会停止工作]
    // [RAF replacements for setTimeout and setInterval](https://bl.ocks.org/joyrexus/7304146)
    // @see https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame
    const timer = setInterval(() => {
        if (lyrics.length === 0) return clearInterval(timer);

        // seek 之前的全部显示 
        while (lyrics.length > 0 && lyrics[0][0] <= seek) print(lyrics.shift()[1]);

        seek += (interval / 1000);
    }, interval);

    return timer;
}