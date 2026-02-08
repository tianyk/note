class LRCPlayer {
    constructor({ lyrics, print = (lyric) => console.log(lyric), done = () => { }, interval = 50 }) {
        this.lyrics = lyrics;
        this.print = print;
        this.done = done;
        this.interval = interval;
        this.seek = 0;
        this._timer = null;
        this.state = 'INIT';
    }

    // 播放（支持seek）
    play(seek = '00:00:00') {
        if (this.state === 'PLAY') return;

        if (this.state !== 'PAUSE') {
            this.seek = toSecond(seek);
        }
        this.state = 'PLAY';

        const lyrics = this.lyrics.map(lyric => [toSecond(lyric[0]), lyric[1]]).sort((lyric1, lyric2) => lyric1[0] - lyric2[0]).filter(lyric => lyric[0] >= this.seek);
        this._timer = setInterval(() => {
            if (lyrics.length === 0) {
                clearInterval(this._timer);
                this.done();
                return;
            }

            // seek 之前的全部显示
            while (lyrics.length > 0 && lyrics[0][0] <= this.seek) this.print(lyrics.shift()[1]);

            this.seek += (this.interval / 1000);
        }, this.interval);
    }

    // 暂停
    pause() {
        if (this.state === 'PAUSE') return;
        this.state = 'PAUSE';
        clearInterval(this._timer);
    }

    // 继续播放
    resume() {
        if (this.state === 'PAUSE') this.play();
    }

    // 重新开始
    reset() {
        this.pause();
        this.state = 'INIT';
        this.play();
    }
}