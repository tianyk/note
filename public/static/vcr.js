function clone(source) {
    return JSON.parse(JSON.stringify(source));
}

class Recorder {
    constructor() {
        this.state = '';
        this.start = null;
        this.originData = {};
    }

    start(vm) {
        this.start = new Date();
        this.originData = clone(vm.$data);
    }

    install(Vue, options = { ns: 'RECORDER:' }) {
        Vue.startRecorder = this.start;
        Vue.playRecorder = this.play;
        Vue.stopRecorder = this.stop;

        Vue.prototype.$startRecorder = function () {
            // start(this);
        }

        Vue.mixin({
            created: function () {
                $DATA = Vue.clone(this.$data);
            },
            updated: function () {
                if (state !== 'RECORDER') return;

                this.$nextTick(function () {
                    var oldData = $DATA;
                    var newData = Vue.clone(this.$data);
                    $DATA = newData;

                    var differences = Vue.diff(oldData, newData);
                    if (!differences) return;
                    Vue.log(differences);
                    var timeline = getTimeline(start, new Date());
                    var actions = JSON.parse(sessionStorage.getItem('recorder') || '[]');
                    actions.push([timeline, differences]);
                    sessionStorage.setItem('recorder', JSON.stringify(actions));
                    // Vue.log(differences);
                })
            },
        })

    }
}