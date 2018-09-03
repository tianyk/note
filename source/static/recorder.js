(function (root) {
    if (!root.Vue) throw new Error('Required Vue!');
    var Vue = root.Vue;

    var validKinds = ['N', 'E', 'A', 'D'];

    // 继承实现
    // nodejs compatible on server side and in the browser.
    function inherits(ctor, superCtor) {
        ctor.super_ = superCtor;
        ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
                value: ctor,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
    }

    // Diff基类
    function Diff(kind, path) {
        Object.defineProperty(this, 'kind', {
            value: kind,
            enumerable: true
        });
        if (path && path.length) {
            Object.defineProperty(this, 'path', {
                value: path,
                enumerable: true
            });
        }
    }

    // 更新
    // {
    //   kind: 'E',
    //   path: Array,
    //   lhs: Object,
    //   rhs: Object
    // }
    function DiffEdit(path, origin, value) {
        // kind = E 
        DiffEdit.super_.call(this, 'E', path);
        Object.defineProperty(this, 'lhs', {
            value: origin,
            enumerable: true
        });
        Object.defineProperty(this, 'rhs', {
            value: value,
            enumerable: true
        });
    }
    inherits(DiffEdit, Diff);

    // 新增
    // {
    //   kind: 'N',
    //   path: Array,
    //   rhs: Object
    // }
    function DiffNew(path, value) {
        DiffNew.super_.call(this, 'N', path);
        Object.defineProperty(this, 'rhs', {
            value: value,
            enumerable: true
        });
    }
    inherits(DiffNew, Diff);

    // 删除
    // {
    //   kind: 'D',
    //   path: Array,
    //   lhs: Object
    // }
    function DiffDeleted(path, value) {
        DiffDeleted.super_.call(this, 'D', path);
        Object.defineProperty(this, 'lhs', {
            value: value,
            enumerable: true
        });
    }
    inherits(DiffDeleted, Diff);

    // 数组
    // {
    //   kind: 'A',
    //   path: Array,
    //   index: Number,
    //   item: { Object | Diff }
    // }
    function DiffArray(path, index, item) {
        DiffArray.super_.call(this, 'A', path);
        Object.defineProperty(this, 'index', {
            value: index,
            enumerable: true
        });
        Object.defineProperty(this, 'item', {
            value: item,
            enumerable: true
        });
    }
    inherits(DiffArray, Diff);


    /**
     * 删除数组中指定元素
     *
     * @param {*} arr 
     * @param {*} from 开始索引（包括）
     * @param {*} to 结束索引（不包括）
     * @returns
     */
    function arrayRemove(arr, from, to) {
        var len = to ? to - from : 1;
        arr.splice(from, len);
        return arr;
    }

    // 算类型
    function realTypeOf(subject) {
        var type = Object.prototype.toString.call(subject);
        var match = type.match(/^\[object\s([a-zA-Z]+)\]$/);
        if (!match) return 'object';

        return match[1].toLowerCase();
    }

    // 算字符串hash值
    // http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
    function hashThisString(string) {
        var hash = 0;
        if (string.length === 0) { return hash; }
        for (var i = 0; i < string.length; i++) {
            var char = string.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }

    // 算对象的hash值
    // Gets a hash of the given object in an array order-independent fashion
    // also object key order independent (easier since they can be alphabetized)
    function getOrderIndependentHash(object) {
        var accum = 0;
        var type = realTypeOf(object);

        // 对象和数组迭代计算
        if (type === 'array') {
            object.forEach(function (item) {
                // Addition is commutative so this is order indep
                accum += getOrderIndependentHash(item);
            });

            var arrayString = '[type: array, hash: ' + accum + ']';
            return accum + hashThisString(arrayString);
        }

        if (type === 'object') {
            for (var key in object) {
                if (object.hasOwnProperty(key)) {
                    var keyValueString = '[ type: object, key: ' + key + ', value hash: ' + getOrderIndependentHash(object[key]) + ']';
                    accum += hashThisString(keyValueString);
                }
            }

            return accum;
        }

        // Non object, non array...should be good?
        var stringToHash = '[ type: ' + type + ' ; value: ' + object + ']';
        return accum + hashThisString(stringToHash);
    }

    /**
     * 比较对象
     *
     * @param {*} lhs
     * @param {*} rhs
     * @returns 
     */
    function deepDiff(lhs, rhs, changes, prefilter, path, key, stack, orderIndependent) {
        changes = changes || [];
        path = path || [];
        stack = stack || [];
        var currentPath = path.slice(0);
        if (typeof key !== 'undefined' && key !== null) {
            if (prefilter) {
                if (typeof (prefilter) === 'function' && prefilter(currentPath, key)) {
                    return;
                } else if (typeof (prefilter) === 'object') {
                    if (prefilter.prefilter && prefilter.prefilter(currentPath, key)) {
                        return;
                    }
                    if (prefilter.normalize) {
                        var alt = prefilter.normalize(currentPath, key, lhs, rhs);
                        if (alt) {
                            lhs = alt[0];
                            rhs = alt[1];
                        }
                    }
                }
            }
            currentPath.push(key);
        }

        // Use string comparison for regexes
        if (realTypeOf(lhs) === 'regexp' && realTypeOf(rhs) === 'regexp') {
            lhs = lhs.toString();
            rhs = rhs.toString();
        }

        var ltype = typeof lhs;
        var rtype = typeof rhs;
        var i, j, k, other;

        var ldefined = ltype !== 'undefined' ||
            (stack && (stack.length > 0) && stack[stack.length - 1].lhs &&
                Object.getOwnPropertyDescriptor(stack[stack.length - 1].lhs, key));
        var rdefined = rtype !== 'undefined' ||
            (stack && (stack.length > 0) && stack[stack.length - 1].rhs &&
                Object.getOwnPropertyDescriptor(stack[stack.length - 1].rhs, key));

        if (!ldefined && rdefined) {
            changes.push(new DiffNew(currentPath, rhs));
        } else if (!rdefined && ldefined) {
            changes.push(new DiffDeleted(currentPath, lhs));
        } else if (realTypeOf(lhs) !== realTypeOf(rhs)) {
            changes.push(new DiffEdit(currentPath, lhs, rhs));
        } else if (realTypeOf(lhs) === 'date' && (lhs - rhs) !== 0) {
            changes.push(new DiffEdit(currentPath, lhs, rhs));
        } else if (ltype === 'object' && lhs !== null && rhs !== null) {
            for (i = stack.length - 1; i > -1; --i) {
                if (stack[i].lhs === lhs) {
                    other = true;
                    break;
                }
            }
            if (!other) {
                stack.push({ lhs: lhs, rhs: rhs });
                if (Array.isArray(lhs)) {
                    // If order doesn't matter, we need to sort our arrays
                    if (orderIndependent) {
                        lhs.sort(function (a, b) {
                            return getOrderIndependentHash(a) - getOrderIndependentHash(b);
                        });

                        rhs.sort(function (a, b) {
                            return getOrderIndependentHash(a) - getOrderIndependentHash(b);
                        });
                    }
                    i = rhs.length - 1;
                    j = lhs.length - 1;
                    while (i > j) {
                        changes.push(new DiffArray(currentPath, i, new DiffNew(undefined, rhs[i--])));
                    }
                    while (j > i) {
                        changes.push(new DiffArray(currentPath, j, new DiffDeleted(undefined, lhs[j--])));
                    }
                    for (; i >= 0; --i) {
                        deepDiff(lhs[i], rhs[i], changes, prefilter, currentPath, i, stack, orderIndependent);
                    }
                } else {
                    var akeys = Object.keys(lhs);
                    var pkeys = Object.keys(rhs);
                    for (i = 0; i < akeys.length; ++i) {
                        k = akeys[i];
                        other = pkeys.indexOf(k);
                        if (other >= 0) {
                            deepDiff(lhs[k], rhs[k], changes, prefilter, currentPath, k, stack, orderIndependent);
                            pkeys[other] = null;
                        } else {
                            deepDiff(lhs[k], undefined, changes, prefilter, currentPath, k, stack, orderIndependent);
                        }
                    }
                    for (i = 0; i < pkeys.length; ++i) {
                        k = pkeys[i];
                        if (k) {
                            deepDiff(undefined, rhs[k], changes, prefilter, currentPath, k, stack, orderIndependent);
                        }
                    }
                }
                stack.length = stack.length - 1;
            } else if (lhs !== rhs) {
                // lhs is contains a cycle at this element and it differs from rhs
                changes.push(new DiffEdit(currentPath, lhs, rhs));
            }
        } else if (lhs !== rhs) {
            if (!(ltype === 'number' && isNaN(lhs) && isNaN(rhs))) {
                changes.push(new DiffEdit(currentPath, lhs, rhs));
            }
        }
    }

    function observableDiff(lhs, rhs, observer, prefilter, orderIndependent) {
        var changes = [];
        deepDiff(lhs, rhs, changes, prefilter, null, null, null, orderIndependent);
        if (observer) {
            for (var i = 0; i < changes.length; ++i) {
                observer(changes[i]);
            }
        }
        return changes;
    }

    function orderIndependentDeepDiff(lhs, rhs, changes, prefilter, path, key, stack) {
        return deepDiff(lhs, rhs, changes, prefilter, path, key, stack, true);
    }

    function accumulateDiff(lhs, rhs, prefilter, accum) {
        var observer = (accum) ?
            function (difference) {
                if (difference) {
                    accum.push(difference);
                }
            } : undefined;
        var changes = observableDiff(lhs, rhs, observer, prefilter);
        return (accum) ? accum : (changes.length) ? changes : undefined;
    }

    function accumulateOrderIndependentDiff(lhs, rhs, prefilter, accum) {
        var observer = (accum) ?
            function (difference) {
                if (difference) {
                    accum.push(difference);
                }
            } : undefined;
        var changes = observableDiff(lhs, rhs, observer, prefilter, true);
        return (accum) ? accum : (changes.length) ? changes : undefined;
    }

    function applyArrayChange(arr, index, change) {
        if (change.path && change.path.length) {
            var it = arr[index],
                i, u = change.path.length - 1;
            for (i = 0; i < u; i++) {
                it = it[change.path[i]];
            }
            switch (change.kind) {
                case 'A':
                    applyArrayChange(it[change.path[i]], change.index, change.item);
                    break;
                case 'D':
                    Vue.delete(it, change.path[i]);
                    break;
                case 'E':
                case 'N':
                    Vue.set(it, change.path[i]) = change.rhs;
                    break;
            }
        } else {
            switch (change.kind) {
                case 'A':
                    applyArrayChange(arr[index], change.index, change.item);
                    break;
                case 'D':
                    arr = arrayRemove(arr, index);
                    break;
                case 'E':
                case 'N':
                    Vue.set(arr, index, change.rhs)
                    break;
            }
        }
        return arr;
    }

    // 应用变更
    function applyChange(target, source, change) {
        if (typeof change === 'undefined' && source && ~validKinds.indexOf(source.kind)) {
            change = source;
        }

        if (target && change && change.kind) {
            var it = target,
                i,
                key,
                last = change.path ? change.path.length - 1 : 0;

            for (i = 0; i < last; i++) {
                key = change.path[i];
                if (typeof it[key] === 'undefined') {
                    // 根据下一个key的类型是数组还是对象
                    Vue.set(it, key, (typeof change.path[i + 1] !== 'undefined' && typeof change.path[i + 1] === 'number') ? [] : {})
                }

                // 遍历找到真正要修改的子对象
                it = it[key];
            }

            switch (change.kind) {
                case 'A':
                    if (change.path && typeof it[change.path[i]] === 'undefined') {
                        Vue.set(it, change.path[i], []);
                    }
                    applyArrayChange(change.path ? it[change.path[i]] : it, change.index, change.item);
                    break;
                case 'D':
                    Vue.delete(it, change.path[i]);
                    break;
                case 'E':
                case 'N':
                    Vue.set(it, change.path[i], change.rhs);
                    break;
            }
        }
    }

    function revertArrayChange(arr, index, change) {
        if (change.path && change.path.length) {
            // the structure of the object at the index has changed...
            var it = arr[index],
                i, u = change.path.length - 1;
            for (i = 0; i < u; i++) {
                it = it[change.path[i]];
            }
            switch (change.kind) {
                case 'A':
                    revertArrayChange(it[change.path[i]], change.index, change.item);
                    break;
                case 'D':
                    it[change.path[i]] = change.lhs;
                    break;
                case 'E':
                    it[change.path[i]] = change.lhs;
                    break;
                case 'N':
                    delete it[change.path[i]];
                    break;
            }
        } else {
            // the array item is different...
            switch (change.kind) {
                case 'A':
                    revertArrayChange(arr[index], change.index, change.item);
                    break;
                case 'D':
                    arr[index] = change.lhs;
                    break;
                case 'E':
                    arr[index] = change.lhs;
                    break;
                case 'N':
                    arr = arrayRemove(arr, index);
                    break;
            }
        }
        return arr;
    }

    function revertChange(target, source, change) {
        if (target && source && change && change.kind) {
            var it = target,
                i, u;
            u = change.path.length - 1;
            for (i = 0; i < u; i++) {
                if (typeof it[change.path[i]] === 'undefined') {
                    it[change.path[i]] = {};
                }
                it = it[change.path[i]];
            }
            switch (change.kind) {
                case 'A':
                    // Array was modified...
                    // it will be an array...
                    revertArrayChange(it[change.path[i]], change.index, change.item);
                    break;
                case 'D':
                    // Item was deleted...
                    it[change.path[i]] = change.lhs;
                    break;
                case 'E':
                    // Item was edited...
                    it[change.path[i]] = change.lhs;
                    break;
                case 'N':
                    // Item is new...
                    delete it[change.path[i]];
                    break;
            }
        }
    }


    // 让target编程source一样的对象。
    function applyDiff(target, source, filter) {
        if (target && source) {
            var onChange = function (change) {
                if (!filter || filter(target, source, change)) {
                    applyChange(target, source, change);
                }
            };
            observableDiff(target, source, onChange);
        }
    }

    function getTimeline(start, end) {
        var padStart = String.prototype.padStart;
        var tdoa = end - start;
        var hour = padStart.call(Math.trunc(tdoa / (60 * 60 * 1000)), 2, '0');
        var minute = padStart.call(Math.trunc((tdoa - hour * 60 * 60 * 1000) / (60 * 1000)), 2, '0');
        var secoud = padStart.call(Math.trunc((tdoa - hour * 60 * 60 * 1000 - minute * 60 * 1000) / 1000), 2, '0');
        var millisecond = padStart.call(tdoa - hour * 60 * 60 * 1000 - minute * 60 * 1000 - secoud * 1000, 3, '0');

        return `${hour}:${minute}:${secoud}.${millisecond}`;
    }

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
    function play({ lyrics, seek = '00:00:00', print = (lyric) => console.log(lyric), done = () => console.log('done'), interval = 50 }) {
        seek = toSecond(seek);
        lyrics = lyrics.map(lyric => [toSecond(lyric[0]), lyric[1]]).sort((lyric1, lyric2) => lyric1[0] - lyric2[0]).filter(lyric => lyric[0] >= seek);

        // setInterval和setTimeout在浏览器窗口非激活的状态下会停止工作或者以极慢的速度工作
        // 可以使用 Web Worker 解决或者 requestAnimationFrame 解决[更新：经过测试窗口处于非激活状态下 requestAnimationFrame 也会停止工作]
        // [RAF replacements for setTimeout and setInterval](https://bl.ocks.org/joyrexus/7304146)
        // @see https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame
        const timer = setInterval(() => {
            if (lyrics.length === 0) {
                done();
                return clearInterval(timer);
            }

            // seek 之前的全部显示 
            while (lyrics.length > 0 && lyrics[0][0] <= seek) print(lyrics.shift()[1]);

            seek += (interval / 1000);
        }, interval);

        return timer;
    }


    var recorder = {
        clone: function (source) {
            return JSON.parse(JSON.stringify(source));
        },

        log: function (val) {
            console.log(JSON.stringify(val, null, 2));
        },

        diff: function (lhs, rhs) {
            return accumulateDiff(lhs, rhs);
        },

        install: function (Vue, options) {
            var start = Date.now();
            var $DATA;
            var state = 'RECORDER';

            Vue.clone = this.clone;
            Vue.log = this.log;
            Vue.diff = this.diff;
            Vue.applyChange = applyChange;
            Vue.play = function (vm) {
                state = 'PLAY';
                var data = vm.$data;
                var actions = JSON.parse(sessionStorage.getItem('recorder') || '[]');
                // sessionStorage.setItem('recorder', '[]');

                // console.log(actions)
                play({
                    lyrics: actions, 
                    print: function (action) {
                        while (action.length > 0) {
                            var diff = action.pop();
                            applyChange(data, diff);
                        }
                    },
                    done: function () {
                        state = 'RECORDER';
                    }
                }); 

                // for (var i = 0; i < actions.length; i++) {
                //     (function (action) {
                //         setTimeout(() => {
                //             while (action.length > 0) {
                //                 var diff = action.pop();
                //                 applyChange(data, diff);
                //             }
                //         }, 200 * i)
                //     })(actions[i]);
                // }
            }

            Vue.cleanRecorder = function (vm) {
                start = new Date();
                sessionStorage.setItem('recorder', '[]');
            }

            Vue.prototype.$clone = this.clone;
            Vue.prototype.$log = this.log;
            Vue.prototype.$diff = this.diff;

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

                        var timeline = getTimeline(start, new Date());
                        var actions = JSON.parse(sessionStorage.getItem('recorder') || '[]');
                        actions.push([timeline, differences]);
                        sessionStorage.setItem('recorder', JSON.stringify(actions));
                        // Vue.log(differences);
                    })
                },
            })
        }
    };

    Vue.use(recorder);

})(this);

