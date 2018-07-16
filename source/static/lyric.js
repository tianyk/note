let timeSchedule = '00:00:00';

let lyrics = [
    ['00:00:00.40', '周杰伦 - 等你下课 (with 杨瑞代)'],
    ['00:00:03.94', '词：周杰伦'],
    ['00:00:05.21', '曲：周杰伦'],
    ['00:00:13.89', 'Jay：你住的 巷子里 我租了一间公寓'],
    ['00:00:22.88', '为了想与你不期而遇'],
    ['00:00:28.51', '高中三年 我为什么 为什么不好好读书'],
    ['00:00:35.75', '没考上跟你一样的大学'],
    ['00:00:40.61', '我找了份工作 离你宿舍很近'],
    ['00:00:46.90', '当我开始学会做蛋饼 才发现你 不吃早餐'],
    ['00:00:55.50', '喔 你又擦肩而过'],
    ['00:00:59.94', '你耳机听什么 能不能告诉我'],
    ['00:01:06.05', '合：躺在你学校的操场看星空'],
    ['00:01:14.26', '教室里的灯还亮着你没走'],
    ['00:01:21.05', '记得 我写给你的情书'],
    ['00:01:27.24', '都什么年代了'],
    ['00:01:30.50', '到现在我还在写着'],
    ['00:01:34.18', '总有一天总有一年会发现'],
    ['00:01:40.18', '有人默默的陪在你的身边'],
    ['00:01:47.16', '也许 我不该在你的世界'],
    ['00:01:53.45', '当你收到情书'],
    ['00:01:56.67', '也代表我已经走远'],
    ['00:02:23.63', 'Gary：学校旁 的广场 我在这等钟声响'],
    ['00:02:32.56', '等你下课一起走好吗'],
    ['00:02:36.13', 'J：弹着琴 唱你爱的歌 暗恋一点都不痛苦（G：一点都不痛苦）'],
    ['00:02:45.46', 'J：痛苦的是你'],
    ['00:02:46.98', '合：根本没看我'],
    ['00:02:49.09', 'J：我唱这么走心 却走不进你心里（G：这么走心 进你心里）'],
    ['00:02:56.87', 'J：在人来人往'],
    ['00:02:58.08', '合：找寻着你 守护着你 不求结局'],
    ['00:03:04.23', 'G：喔 你又擦肩而过（J：喔 而过）'],
    ['00:03:09.38', 'J：我唱告白气球 终于你回了头'],
    ['00:03:16.69', '合：躺在你学校的操场看星空'],
    ['00:03:24.01', '教室里的灯还亮着你没走'],
    ['00:03:30.74', '记得 我写给你的情书'],
    ['00:03:37.02', '都什么年代了'],
    ['00:03:40.26', '到现在我还在写着'],
    ['00:03:43.96', '总有一天总有一年会发现'],
    ['00:03:49.95', '有人默默的陪在你的身边'],
    ['00:03:56.73', '也许 我不该在你的世界'],
    ['00:04:03.21', '当你收到情书'],
    ['00:04:06.40', '也代表我已经走远']
];

function toSecond(time) {
    return new Date(`1970-01-01T${time}Z`).getTime() / 1000;
}

function print(lyric) {
    console.log(`%c${lyric}`, "background: rgba(252,234,187,1);background: -moz-linear-gradient(left, rgba(252,234,187,1) 0%, rgba(175,250,77,1) 12%, rgba(0,247,49,1) 28%, rgba(0,210,247,1) 39%,rgba(0,189,247,1) 51%, rgba(133,108,217,1) 64%, rgba(177,0,247,1) 78%, rgba(247,0,189,1) 87%, rgba(245,22,52,1) 100%); background: -webkit-gradient(left top, right top, color-stop(0%, rgba(252,234,187,1)), color-stop(12%, rgba(175,250,77,1)), color-stop(28%, rgba(0,247,49,1)), color-stop(39%, rgba(0,210,247,1)), color-stop(51%, rgba(0,189,247,1)), color-stop(64%, rgba(133,108,217,1)), color-stop(78%, rgba(177,0,247,1)), color-stop(87%, rgba(247,0,189,1)), color-stop(100%, rgba(245,22,52,1)));background: -webkit-linear-gradient(left, rgba(252,234,187,1) 0%, rgba(175,250,77,1) 12%, rgba(0,247,49,1) 28%, rgba(0,210,247,1) 39%, rgba(0,189,247,1) 51%, rgba(133,108,217,1) 64%, rgba(177,0,247,1) 78%, rgba(247,0,189,1) 87%, rgba(245,22,52,1) 100%);background: -o-linear-gradient(left, rgba(252,234,187,1) 0%, rgba(175,250,77,1) 12%, rgba(0,247,49,1) 28%, rgba(0,210,247,1) 39%, rgba(0,189,247,1) 51%, rgba(133,108,217,1) 64%, rgba(177,0,247,1) 78%, rgba(247,0,189,1) 87%, rgba(245,22,52,1) 100%);background: -ms-linear-gradient(left, rgba(252,234,187,1) 0%, rgba(175,250,77,1) 12%, rgba(0,247,49,1) 28%, rgba(0,210,247,1) 39%, rgba(0,189,247,1) 51%, rgba(133,108,217,1) 64%, rgba(177,0,247,1) 78%, rgba(247,0,189,1) 87%, rgba(245,22,52,1) 100%);background: linear-gradient(to right, rgba(252,234,187,1) 0%, rgba(175,250,77,1) 12%, rgba(0,247,49,1) 28%, rgba(0,210,247,1) 39%, rgba(0,189,247,1) 51%, rgba(133,108,217,1) 64%, rgba(177,0,247,1) 78%, rgba(247,0,189,1) 87%, rgba(245,22,52,1) 100%);filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#fceabb', endColorstr='#f51634', GradientType=1 ); font-family: Georgia, \"Times New Roman\", \"Microsoft YaHei\", \"微软雅黑\", STXihei, \"华文细黑\", serif; font-size:2em")
}

function play({ lyrics, start = '00:00:00', print = (lyric) => console.log(lyric), interval = 10 }) {
    start = toSecond(start);
    lyrics = lyrics.map(lyric => [toSecond(lyric[0]), lyric[1]]).sort((lyric1, lyric2) => lyric1[0] - lyric2[0]).filter(lyric => lyric[0] >= start);

    // 浏览器窗口非激活的状态下会停止工作或者以极慢的速度工作
    const timer = setInterval(() => {
        if (lyrics.length === 0) {
            console.log('end: ', new Date())
            return clearInterval(timer);
        }
        
        // console.log(lyrics[0][0], start);
        while (lyrics.length > 0 && lyrics[0][0] <= start) print(lyrics.shift()[1]);
            
        start += (interval / 1000);
    }, interval);

    return timer;
}

// console.log('start: ', new Date())
play({ lyrics, interval: 50, print });

