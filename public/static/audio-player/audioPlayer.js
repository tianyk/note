; (function () {
    function noop() { };
    function once(fn, context) {
        var result;

        return function () {
            if (fn) {
                result = fn.apply(context || this, arguments);
                fn = null;
            }

            return result;
        };
    }

    function AudioPlayer() {
        this.audio = null;
        this.status = '';
    }

    AudioPlayer.prototype.play = function (url, cb) {
        console.log('play');
        cb = once(cb || noop);
        var self = this;

        if (url) {
            this.stop();
            var audio = document.createElement('audio');
            audio.autoplay = true;
            audio.preload = 'auto';
            audio.volume = 1;
            audio.src = url;
            audio.onended = function () {
                console.log('onended');
                cb();
            }
            audio.onerror = function () {
                console.log('onerror');
                cb();
            }
            audio.onplaying = function () {
                console.log('onplaying');
                self.status = 'playing';
            }

            audio.onpause = function () {
                console.log('onpause');
                self.status = 'pause';
            }

            this.audio = audio;
        } else {
            if (this.audio) {
                var audio = this.audio;
                audio.play();
            }
        }
    }

    AudioPlayer.prototype.stop = function (cb) {
        console.log('stop');
        cb = once(cb || noop);
        var self = this;
        var audio = this.audio;

        if (audio) {
            audio.onpause = noop;  // 清理注册的暂停事件
            audio.pause();
            audio.currentTime = 0;

            self.audio = null;
            self.status = '';


            try {
                var _onended = audio.onended;
                if (typeof _onended === 'function') _onended.call(audio);
            } finally {
                cb();
            }
        }
    }

    AudioPlayer.prototype.pause = function (cb) {
        console.log('pause');
        cb = once(cb || noop);
        audio = this.audio;

        if (audio) {
            var _onpause = audio.onpause;
            audio.onpause = function () {
                try {
                    if (typeof _onpause === 'function') _onpause.call(audio);
                } finally {
                    cb();
                }
            }
            audio.pause();
        }
    }

    window.AudioPlayer = AudioPlayer;
})();

// var player = new AudioPlayer();
// player.play('http://s.itextbook.51talk.com/14/E7/9B5D77C48062C24109903166F3DE.mp3', function () {
//     console.log('...end');
// });
// setTimeout(function () {
//     player.pause(function () {
//         console.log('...pause');
//     });
// }, 1200);

// // setTimeout(function () {
// //     player.play();
// // }, 1500);

// setTimeout(function () {
//     player.stop();
// }, 1800);

// setTimeout(function () {
//     player.play('http://s.itextbook.51talk.com/14/E7/9B5D77C48062C24109903166F3DE.mp3');
// }, 2800);


