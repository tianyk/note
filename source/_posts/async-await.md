---
title: async/await
date: 2017-07-19 13:39:12
updated: 2018-05-04 12:02:31
tags: 
- nodejs
- async
- await
---
``` javascript
// async function like a auto-execute generator function. Juse like co.
// co + generator yield similar with async/await

function f1(ret) {
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            if (ret) resolve(ret)
            else reject('err');
        }, 1000)
    });
}

// similar code 
co(function* () {
    let rets = yield Promise.all([f1('f1_1'), f1('f1_2')]);
    return rets;
})
    .then(console.log)
    .catch(console.error);


// async function return a promise;
async function f2() {
    // you can use Promise.all to parallel execute function.
    let rets = await Promise.all([f1('f1_1'), f1('f1_2')]);
    // throw new Error('abc');
    return rets;
}

// you can use catch function to catch async function error.
// also you can use try-catch to catch error in async function inner. 
f2()
    .then(console.log)
    .catch(console.error);
```